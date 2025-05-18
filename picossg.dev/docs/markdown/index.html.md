---
layout: docs/_base.njk
title: Markdown
---

# Markdown in PicoSSG

PicoSSG uses [markdown-it](https://markdown-it.github.io/) to transform your Markdown content into HTML. Markdown is a lightweight markup language that allows you to write using a plain text format that converts to structurally valid HTML.

## Basic Usage

Files with the `.md` extension are processed as Markdown. For example:

```markdown
# My Page Title

This is a paragraph with **bold** and *italic* text.

## Subheading

- List item 1
- List item 2
- List item 3

[Link text](https://example.com)
```

Will be converted to:

```html
<h1>My Page Title</h1>
<p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
<h2>Subheading</h2>
<ul>
  <li>List item 1</li>
  <li>List item 2</li>
  <li>List item 3</li>
</ul>
<p><a href="https://example.com">Link text</a></p>
```

## Combining with Templates

PicoSSG's power comes from combining Markdown with Nunjucks templates:

- Files with `.html.md` extension: First processed as Markdown, then output as HTML
- Files with `.html.md.njk` extension: First processed as Nunjucks, then as Markdown, then output as HTML

This allows you to use Nunjucks template features in your Markdown content:

```markdown
# {{ title }}

This page was generated on {{ "now" | date: "%Y-%m-%d" }}.

{% if author %}
Written by {{ author }}
{% endif %}

## Content

{{ content | safe }}
```

## Common Markdown Syntax

### Headers

```markdown
# H1
## H2
### H3
#### H4
##### H5
###### H6
```

### Emphasis

```markdown
*Italic* or _Italic_
**Bold** or __Bold__
***Bold and Italic*** or ___Bold and Italic___
```

### Lists

Unordered:
```markdown
- Item 1
- Item 2
  - Nested item
- Item 3
```

Ordered:
```markdown
1. First item
2. Second item
3. Third item
```

### Links

```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Title text")
```

### Images

```markdown
![Alt text](image.jpg)
![Alt text](image.jpg "Optional title")
```

### Code

Inline code: `` `code` ``

Code blocks:
````markdown
```javascript
function hello() {
  console.log("Hello world!");
}
```
````

### Tables

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

### Blockquotes

```markdown
> This is a blockquote.
> It can span multiple lines.
>
> It can also contain multiple paragraphs.
```

### Horizontal Rules

```markdown
---
```

## HTML in Markdown

Markdown-it allows raw HTML in your Markdown files:

```markdown
# My Title

<div class="special-container">
  This is inside a custom div.
</div>

And back to regular Markdown.
```

## Using Markdown Filters in Templates

PicoSSG provides two special Nunjucks filters for processing Markdown:

### md

Processes a string as Markdown (including block elements):

```
{{ "**Bold text** and *italic text*" | md | safe }}
```

### mdinline

Processes a string as inline Markdown (no block elements):

```
<p>Click {{ "[here](https://example.com)" | mdinline | safe }} to visit our site.</p>
```

## Front Matter with Markdown

You can include YAML front matter at the beginning of your Markdown files:

```markdown
---
title: My Page
layout: _base.njk
date: 2023-05-15
tags: [documentation, markdown]
---

# {{ title }}

Content goes here...
```

## Learn More About Markdown

For more detailed information about Markdown syntax, check out these resources:

- [CommonMark Spec](https://commonmark.org/) - The modern Markdown specification
- [GitHub Flavored Markdown](https://github.github.com/gfm/) - GitHub's extended Markdown syntax
- [Markdown Guide](https://www.markdownguide.org/) - A comprehensive guide to Markdown
- [Markdown-it Documentation](https://markdown-it.github.io/) - Docs for the library PicoSSG uses

## Related Topics

- [Templates](/templates/) - Using Nunjucks templates
- [Front Matter](/frontmatter/) - Working with metadata
- [Custom Filters](/custom-filters/) - Creating custom filters