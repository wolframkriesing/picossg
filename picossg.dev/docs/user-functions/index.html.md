---
layout: docs/_base.njk
title: User Functions
---

# User Functions

PicoSSG allows for powerful customization through user-defined functions. These functions can modify content and metadata during the build process, enabling advanced workflows and site-wide operations.

## What Are User Functions?

User functions are JavaScript functions that PicoSSG calls at specific points during the build process:

1. **Preprocessing**: Before rendering content files
2. **Postprocessing**: After rendering but before writing files to disk

This gives you hooks to modify content, add metadata, generate new pages, or perform other custom operations.

## Setting Up User Functions

To add user functions, create a `_config.js` file in your content directory:

```
content/
├── _config.js
├── index.html.md
└── ...
```

In this file, export the functions you want PicoSSG to use:

```javascript
// content/_config.js
export async function preprocess(files) {
  // Modify files before processing
  console.log(`Preprocessing ${files.size} files`);
}

export async function postprocess(files) {
  // Modify rendered files before writing to disk
  console.log(`Postprocessing ${files.size} files`);
}
```

## The `files` Map

Both functions receive a `Map` of all content files. Each entry in the map has:

- Key: The relative file path (e.g., `blog/post1.html.md`)
- Value: A file data object with metadata and content

The file data object contains:

```javascript
{
  // File metadata
  _file: {
    relativeFilePath: 'blog/post.html.md',
    absoluteFilePath: '/path/to/content/blog/post.html.md',
    content: '# My Post\nContent here...',
    needsProcessing: true,
    hasFrontmatterBlock: true
  },
  
  // Front matter content (if any)
  _frontmatter: {
    title: 'My Blog Post',
    date: '2025-01-15',
    // Other front matter fields...
  },
  
  // Output information
  _output: {
    rawUrlPath: '/blog/post.html',
    prettyUrlPath: '/blog/post',
    relativeFilePath: 'blog/post.html',
    absoluteFilePath: '/path/to/output/blog/post.html'
  },
  
  // Site-wide data
  _site: {},
  
  // Root properties (merged from _frontmatter)
  title: 'My Blog Post',
  date: '2025-01-15',
  url: '/blog/post',
  content: '# My Post\nContent here...'
}
```

## Preprocessing Examples

Here are some practical examples of what you can do with preprocessing:

### Add Site-Wide Data

```javascript
export async function preprocess(files) {
  const siteData = {
    title: 'My Awesome Site',
    description: 'A site built with PicoSSG',
    baseUrl: 'https://example.com',
    author: 'Jane Doe'
  };
  
  // Add site data to all files
  for (const [path, data] of files) {
    data._site = siteData;
  }
}
```

### Generate Tag Pages

```javascript
export async function preprocess(files) {
  // Collect all tags from blog posts
  const tagMap = new Map();
  
  for (const [path, data] of files) {
    if (path.startsWith('blog/') && data._frontmatter.tags) {
      for (const tag of data._frontmatter.tags) {
        if (!tagMap.has(tag)) tagMap.set(tag, []);
        tagMap.get(tag).push(data);
      }
    }
  }
  
  // Create a tag page for each tag
  for (const [tag, posts] of tagMap) {
    const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');
    const tagPath = `tags/${tagSlug}.html.md`;
    
    // Create content for the tag page
    const content = `---
layout: _base.njk
title: Posts tagged "${tag}"
---

# Posts tagged "${tag}"

${posts.map(post => `- [${post.title}](${post.url})`).join('\n')}
`;
    
    // Add the tag page to the files map
    files.set(tagPath, {
      _file: {
        relativeFilePath: tagPath,
        absoluteFilePath: `content/${tagPath}`,
        content,
        needsProcessing: true,
        hasFrontmatterBlock: true
      },
      _frontmatter: {
        layout: '_base.njk',
        title: `Posts tagged "${tag}"`
      },
      _output: {
        rawUrlPath: `/tags/${tagSlug}.html`,
        prettyUrlPath: `/tags/${tagSlug}`,
        relativeFilePath: `tags/${tagSlug}.html`,
        absoluteFilePath: `output/tags/${tagSlug}.html`
      },
      _site: {},
      title: `Posts tagged "${tag}"`,
      url: `/tags/${tagSlug}`,
      content
    });
  }
}
```

### Sort Blog Posts by Date

```javascript
export async function preprocess(files) {
  // Create a sorted list of blog posts
  const posts = [];
  
  for (const [path, data] of files) {
    if (path.startsWith('blog/') && !path.endsWith('index.html.md')) {
      posts.push(data);
    }
  }
  
  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Add the sorted list to the blog index page
  for (const [path, data] of files) {
    if (path === 'blog/index.html.md') {
      data.posts = posts;
    }
  }
}
```

## Postprocessing Examples

Postprocessing happens after rendering but before writing to disk, which is useful for:

### Minify HTML

```javascript
import { minify } from 'html-minifier';

export async function postprocess(files) {
  const minifyOptions = {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true
  };
  
  for (const [path, data] of files) {
    if (path.endsWith('.html')) {
      data.content = minify(data.content, minifyOptions);
    }
  }
}
```

### Generate a Sitemap

```javascript
export async function postprocess(files) {
  const siteUrl = 'https://example.com';
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  for (const [path, data] of files) {
    if (path.endsWith('.html') && data._output) {
      const url = data._output.prettyUrlPath;
      const lastmod = data.date || new Date().toISOString().split('T')[0];
      
      sitemap += '  <url>\n';
      sitemap += `    <loc>${siteUrl}${url}</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += '  </url>\n';
    }
  }
  
  sitemap += '</urlset>\n';
  
  // Add sitemap.xml to the files map
  files.set('sitemap.xml', {
    _file: {
      relativeFilePath: 'sitemap.xml',
      absoluteFilePath: 'content/sitemap.xml',
      content: sitemap,
      needsProcessing: false,
      hasFrontmatterBlock: false
    },
    _output: {
      rawUrlPath: '/sitemap.xml',
      prettyUrlPath: '/sitemap.xml',
      relativeFilePath: 'sitemap.xml',
      absoluteFilePath: 'output/sitemap.xml'
    },
    content: sitemap
  });
}
```

### Add Analytics or Other Site-Wide Scripts

```javascript
export async function postprocess(files) {
  const analytics = `
<!-- Analytics -->
<script>
  // Your analytics code here
</script>
`;
  
  for (const [path, data] of files) {
    if (path.endsWith('.html')) {
      // Add analytics before closing body tag
      data.content = data.content.replace('</body>', `${analytics}</body>`);
    }
  }
}
```

## Best Practices

### Modifying the Files Map

The `files` Map is passed by reference, so you can modify it directly:

```javascript
// Add a new file
files.set('new-file.md', { /* file data */ });

// Delete a file
files.delete('unwanted-file.md');

// Modify a file's content
files.get('blog/post.md').content = 'New content';
```

### Performance Considerations

Since you have access to all files at once, be careful with performance:

1. **Minimize file reads/writes**: PicoSSG already has all files in memory
2. **Use efficient algorithms**: When processing large sites, optimize your code
3. **Use async/await**: For any I/O operations like reading external data

### Error Handling

Add proper error handling to prevent build failures:

```javascript
export async function preprocess(files) {
  try {
    // Your code here
  } catch (error) {
    console.error('Error in preprocessing:', error);
    // Continue with the build process
  }
}
```

## Debugging User Functions

When debugging:

1. Use `console.log` statements to inspect data
2. Check the terminal output during builds
3. Start with simple functions to ensure they're being called
4. Check the file structure against what you expect

## Custom Config File

You can specify a custom config file name with the `-x` or `--config` flag:

```bash
picossg -c content -o output -x custom-config.js
```

## Related Topics

- [Front Matter](/frontmatter/) - Working with front matter data
- [Custom Filters](/custom-filters/) - Extending Nunjucks templates
- [File Mapping](/file-mapping/) - Understanding file processing paths