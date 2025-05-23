---
layout: docs/_base.njk
title: Front Matter
---

# Front Matter

Front matter has become a standard feature in markdown files that allows you to include metadata at the
top of your content files. This metadata can be used for layouts, content organization, and custom data processing.

> Front matter is the initial section of a book

Says [wikipedia](https://en.wikipedia.org/wiki/Book_design#Front_matter) about the origin of the term.


## What is it?

Front matter is a YAML block that must start on the first line of the file! 
It is enclosed by triple dashes (`---`). It looks like this:

```yaml
---
title: My Page Title
layout: _base.njk
date: 2025-01-15
author: Jane Doe
tags: 
  - tutorial
  - beginner
---
```

PicoSSG uses the [yaml](https://www.npmjs.com/package/yaml) package to parse front matter.

## How it works

When PicoSSG processes a file (excluding copied as-is files like `.css`), it performs the following steps:

1. It checks for a front matter block at the beginning
2. If found, it extracts and parses the YAML data
3. The data becomes available in the page context in the variable `_frontmatter` for templating
4. The front matter block is removed before further processing

## Properties

While you can include any properties you want in front matter, certain properties have special meaning in PicoSSG:

### `layout`

Specifies a Nunjucks template to wrap the content:

```yaml
---
layout: _base.njk
---
```

The layout file should include `{{ content | safe }}` where the page content should be inserted.

### `title`

While not specially processed by PicoSSG, it's a common convention for page titles:

```yaml
---
title: About Us
---
```

Then in your content you can write:

```html
<title>{{ title }} - My Site</title>
```

### `date`

Can be used for blog posts or content organization:

```yaml
---
date: 2025-01-15
---
```

PicoSSG automatically reads the file's modification time if no date is specified in the front matter.

## Best Practices

1. **Keep it consistent**: Use the same properties across similar types of content
2. **Don't overload**: Keep front matter concise and relevant
3. **Use layouts**: Specify layouts in front matter for consistent page design
4. **Schema planning**: For larger sites, plan your front matter schema in advance
5. **Dates**: Use ISO format (`YYYY-MM-DD`) for dates to ensure proper sorting

## Troubleshooting

### Front Matter Not Being Parsed

If your front matter isn't being parsed:

- Ensure there's no whitespace before the first `---`
- Check that the YAML is valid (no missing quotes, proper indentation)
- Confirm the file has an extension that PicoSSG processes (`.md`, `.njk`, etc.)

### Data Not Available in Templates

If your front matter data isn't available in templates:

- Verify the front matter syntax is correct
- Check that you're using the correct variable names
- Make sure the template has access to the data context

## Related Topics

- [Templates](/docs/templates/) - Using front matter in Nunjucks templates
- [Custom Filters](/docs/custom-filters/) - Working with front matter in filters