---
layout: _base.njk
title: File Mapping
---

# File Mapping

One of PicoSSG's core principles is its predictable **1:1 file mapping** system. This page explains how PicoSSG maps source files to output files.

## Basic Principle

PicoSSG follows a straightforward rule: **each source file in your content directory maps directly to an output file in your output directory, with the same relative path**.

The only changes that happen are:
1. Processing file content based on extensions
2. Removing processed extensions from filenames

## Extension Processing

PicoSSG processes files based on their extensions, from right to left:

| Source File | Processing Steps | Output File |
|-------------|-----------------|-------------|
| `about.md` | Process as Markdown | `about.html` |
| `about.html.md` | Process as Markdown, keeping .html extension | `about.html` |
| `style.css` | No processing, copy as-is | `style.css` |
| `page.html.njk` | Process as Nunjucks, output as HTML | `page.html` |
| `style.css.njk` | Process as Nunjucks, output as CSS | `style.css` |
| `post.html.md.njk` | Process as Nunjucks, then as Markdown | `post.html` |

## Directory Structure Preservation

PicoSSG preserves your directory structure exactly:

```
content/                   output/
├── index.html.md          ├── index.html
├── about/                 ├── about/
│   └── index.html.md      │   └── index.html
├── blog/                  ├── blog/
│   └── post1.html.md      │   └── post1.html
└── css/                   └── css/
    └── style.css              └── style.css
```

## Special Files

There are a few special rules for certain files:

### Files Starting with Underscore (`_`)

Files and directories starting with an underscore are **excluded from the output**. This is perfect for:

- Layout templates
- Partial components
- Include files
- Configuration files

Example:
```
content/                   output/
├── _base.njk              (not copied/processed)
├── _includes/             (not copied/processed)
├── index.html.md          ├── index.html
└── about.html.md          └── about.html
```

### Index Files

Files named `index.html` (or that process to that name) create "pretty URLs":

- `content/about/index.html.md` → `output/about/index.html`
- Accessible at `/about/` rather than `/about/index.html`

## How Processing Works

When PicoSSG builds your site, it:

1. Scans the content directory recursively
2. For each file, it determines if processing is needed
3. Processes the file if needed (or copies it if not)
4. Writes the result to the output directory

The processing order for extensions is important: **extensions are processed from right to left**:

- For a file named `page.html.md.njk`:
  1. First, it's processed as a Nunjucks template (`.njk`)
  2. Then, the result is processed as Markdown (`.md`)
  3. Finally, it's output as an HTML file (`.html`)

## Practical Examples

### Basic HTML Content

```
index.html → index.html (copied as-is)
```

### Markdown Content

```
about.md → about.html (processed as Markdown)
```

### Nunjucks Template

```
contact.html.njk → contact.html (processed as Nunjucks)
```

### Markdown Content in Nunjucks Template

```
post.html.md.njk → post.html (processed as Nunjucks, then Markdown)
```

### CSS from Nunjucks Template

```
style.css.njk → style.css (processed as Nunjucks, output as CSS)
```

## Best Practices

- Use clear file naming conventions
- Maintain a logical directory structure
- Put reusable templates in `_includes` or similar underscore-prefixed directories
- Use `index.html.md` files for clean URLs
- Organize related content in subdirectories

## Related Topics

- [Front Matter](/frontmatter/) - Adding metadata to your files
- [Templates](/templates/) - Using Nunjucks for templating
- [Components](/components/) - Creating reusable components