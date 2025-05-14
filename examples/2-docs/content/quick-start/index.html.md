---
layout: _base.njk
title: Quick Start Guide
---

# Quick Start Guide

This guide will walk you through creating a simple website with PicoSSG. By the end, you'll have a functional site with multiple pages, templates, and styling.

## 1. Set Up Your Project

First, let's create a new project and set up PicoSSG:

```bash
# Create a project directory
mkdir my-picossg-site
cd my-picossg-site

# Create basic structure
mkdir -p content

# Initialize npm project
npm init -y

# Add scripts to package.json
```

Edit your `package.json` to include these scripts:

```json
{
  "name": "my-picossg-site",
  "version": "1.0.0",
  "scripts": {
    "build": "npx @wolframkriesing/picossg -c content -o output",
    "start": "npx http-server output -p 8000",
    "build:watch": "npx nodemon --quiet --legacy-watch --watch content --ext '*' --exec \"bash -c 'npm run build'\""
  }
}
```

## 2. Create Your First Page

Let's create a simple homepage. Create a file at `content/index.html.md`:

```markdown
# My First PicoSSG Site

Welcome to my website built with PicoSSG!

## Features

- **Simple** - Easy to use and understand
- **Fast** - Minimal processing overhead
- **Flexible** - Use Markdown, Nunjucks, or both
```

**Important**: Notice that we're using `.html.md` as the extension, not just `.md`. PicoSSG only removes the processed extensions (like `.md` and `.njk`) but doesn't replace them, so you need to include the final extension you want (`.html` in this case).

## 3. Add a Layout Template

Let's create a layout template to apply consistent styling to all pages. Create `content/_base.njk`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% if title %}{{ title }} - {% endif %}My PicoSSG Site</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 1rem;
    }
    nav {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    nav a {
      margin-right: 1rem;
    }
    footer {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
      font-size: 0.9rem;
      color: #666;
    }
  </style>
</head>
<body>
  <nav>
    <a href="/">Home</a>
    <a href="/about/">About</a>
    <a href="/blog/">Blog</a>
  </nav>
  
  <main>
    {{ content | safe }}
  </main>
  
  <footer>
    Built with PicoSSG - {{ "now" | date }}
  </footer>
</body>
</html>
```

## 4. Add Front Matter to Use the Layout

Now modify your `content/index.html.md` to use the layout:

```markdown
---
layout: _base.njk
title: Home
---

# My First PicoSSG Site

Welcome to my website built with PicoSSG!

## Features

- **Simple** - Easy to use and understand
- **Fast** - Minimal processing overhead
- **Flexible** - Use Markdown, Nunjucks, or both
```

## 5. Add More Pages

Let's add an about page. Create `content/about/index.html.md`:

```markdown
---
layout: _base.njk
title: About
---

# About This Site

This is a demonstration site built with PicoSSG, the minimal static site generator.

## About Me

I'm learning to build static sites with PicoSSG because it's:

- Simple to understand
- Quick to set up
- Powerful enough for my needs
```

## 6. Create a Blog Post with a Date

Create a blog directory and add a post:

```bash
mkdir -p content/blog
```

Create `content/blog/index.html.md`:

```markdown
---
layout: _base.njk
title: Blog
---

# Blog

Latest articles:

- [My First Post](/blog/first-post/)
```

Create `content/blog/first-post/index.html.md`:

```markdown
---
layout: _base.njk
title: My First Blog Post
date: 2025-01-15
---

# My First Blog Post

This is my first blog post using PicoSSG.

The date of this post ({{ date | date: "%B %d, %Y" }}) is specified in the front matter!
```

## 7. Build and Run Your Site

Run these commands:

```bash
# Start the build process with auto-rebuilding
npm run build:watch

# In a separate terminal, start the server
npm start
```

Open your browser to http://localhost:8000 to see your site!

## 8. What's Next?

You now have a basic site with:

- Multiple pages with a shared layout
- Markdown content with front matter
- Navigation between pages
- Simple styling

## Next Steps

To continue learning PicoSSG, explore:

- [File Mapping](/file-mapping/) - Understand how PicoSSG processes files
- [Front Matter](/frontmatter/) - Add metadata to your pages
- [Templates](/templates/) - Unleash the power of Nunjucks templating
- [Components](/components/) - Build reusable components
- [Custom Filters](/custom-filters/) - Extend Nunjucks with custom filters