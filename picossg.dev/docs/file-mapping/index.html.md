---
layout: docs/_base.njk
title: File Mapping
---

# File Mapping

One of PicoSSG's core principles is its predictable **1:1 file mapping** from input (content) to output files.
The output files are those served by a web server, your website structure.

This page explains how PicoSSG maps source files to output files.

## Basic Principle

PicoSSG follows a straightforward rule: 
**each source file in your content directory maps directly to an output file in your output directory, with the same relative path**.

The only changes that happen are:
1. Files are processed based on their extension(s) (`.njk`, `.md`)
2. Processed extensions are removed from filenames when outputting
3. Files and directories prefixed with `_` are excluded from the output

## File Processing

PicoSSG processes files based on their extensions, from right to left. It only removes the extensions it processes and never replaces extensions:

| Source File | Output File | Processing Steps  |
|-------------|-----------------|-------------|
| `about.html.md` | `about.html` | Process as Markdown |
| `page.html.njk` | `page.html` | Process as Nunjucks |
| `style.css.njk` | `style.css` | Process as Nunjucks | 
| `post.html.md.njk` | `post.html` | Process as Nunjucks, then as Markdown |
| `style.css` | `style.css` | No processing, copy as-is |
| `index.html` | `index.html` | No processing, copy as-is |

**Important**: Notice that you must include the final extension in the filename. For example, use `about.html.md` instead of just `about.md`. PicoSSG only removes the processed extensions and does not add or replace any extensions.

## Directory Processing

PicoSSG preserves your directory structure exactly:

```
content/                   output/
├── index.html.md          ├── index.html
├── _config.js             │
├── _base.njk              │
├── about/                 ├── about/
│   └── index.html.md      │   └── index.html
├── blog/                  ├── blog/
│   └── post1.html.md      │   └── post1.html
├── _components/           │
│   └── base.njk           │
└── css/                   └── css/
    └── style.css              └── style.css
```

All Markdown files must be named with `.html.md` to generate HTML files, not just `.md`.
The files and directories starting with `_` are excluded from the output.

## `_*` Files/Directories

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

## Processing Flow

When PicoSSG builds your site, it:

1. Scans the content directory recursively
2. For each file, it determines if processing is needed
3. Runs the `preprocess()` function if present in `_config.js`
   - This function can modify the file content before processing
   - If `_config.js` is not present, it skips this step
4. Processes each file if needed (or copies it if not)
   - If the file is a Nunjucks template, it processes it first
   - If the file is Markdown, it processes it after Nunjucks
   - If the file is a static asset (like CSS), it copies it as-is
5. Runs the `postprocess()` function if present in `_config.js` 
   - This function can modify the file content after processing
   - If `_config.js` is not present, it skips this step
6. Writes the result to the output directory

The processing order for extensions is important: **extensions are processed from right to left**:

- For a file named `page.html.md.njk`:
  1. First, it's processed as a Nunjucks template (`.njk`)
  2. Then, the result is processed as Markdown (`.md`)
  3. Each extension is removed from the filename for the output filename, resulting in `page.html`

## Filename Examples

### Files Copied as-is

The files below use no special extensions and are copied as-is, no matter their extension, 
PicoSSG just moves them to the output directory:

```
index.html → index.html (copied as-is)
style.css → style.css (copied as-is)
favicon.ico → favicon.ico (copied as-is)
somefile.pdf → somefile.pdf (copied as-is)
```

### Markdown Content

The files below are processed as Markdown, and the `.md` extension is removed in the output:

```
about.html.md → about.html (processed as Markdown)
about.md → about (processed as Markdown, ⚠️ no `.html` extension)
```

### Nunjucks Template

If the file ends with `.njk`, it is processed as a Nunjucks template, and the `.njk` extension is removed in the output.
Notice that multiple extensions are processed from right to left, so `file.html.md.njk` is possible too:

```
contact.html.njk → contact.html (processed as Nunjucks)
post.html.md.njk → post.html (processed as Nunjucks, then Markdown)
style.css.njk → style.css (processed as Nunjucks, output as CSS)
```

## Related Topics

- [Front Matter](/docs/frontmatter/) - Adding metadata to your files
- [Templates](/docs/templates/) - Using Nunjucks for templating
- [Components](/docs/components/) - Creating reusable components