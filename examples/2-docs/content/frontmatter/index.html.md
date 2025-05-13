---
layout: _base.njk
title: Front Matter
---

# Front Matter

Front matter is a powerful feature in PicoSSG that allows you to include metadata at the top of your content files. This metadata can be used for layouts, content organization, and custom data processing.

## What is Front Matter?

Front matter is a YAML block at the beginning of a file, enclosed by triple dashes (`---`). It looks like this:

```yaml
---
title: My Page Title
layout: _base.njk
date: 2025-01-15
author: Jane Doe
tags: [tutorial, beginner]
---
```

PicoSSG uses the [yaml](https://www.npmjs.com/package/yaml) package to parse front matter.

## How Front Matter Works in PicoSSG

When PicoSSG processes a file:

1. It checks for a front matter block at the beginning
2. If found, it extracts and parses the YAML data
3. The data becomes available in the page context for templating
4. The front matter block is removed from the final output

## Common Front Matter Properties

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

Then in your layout:

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

## Using Front Matter in Templates

All front matter data is available directly in your templates. For example, with this front matter:

```yaml
---
title: My Page
subtitle: A great page
author: Jane Doe
tags: [important, featured]
---
```

You can use the data in your Nunjucks templates:

```html
<h1>{{ title }}</h1>
<h2>{{ subtitle }}</h2>
<p>Written by {{ author }}</p>

<ul>
{% for tag in tags %}
  <li>{{ tag }}</li>
{% endfor %}
</ul>
```

## Front Matter and Layouts

The most common use of front matter is to specify layouts. Here's how it works:

1. Create a layout file (e.g., `_base.njk`):
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>{{ title }}</title>
   </head>
   <body>
     <header>My Site</header>
     <main>
       {{ content | safe }}
     </main>
     <footer>Copyright {{ "now" | date: "%Y" }}</footer>
   </body>
   </html>
   ```

2. Use the layout in your content file:
   ```markdown
   ---
   layout: _base.njk
   title: Welcome
   ---
   
   # Welcome to my site
   
   This is my homepage.
   ```

3. The output will combine both files, with your content inserted into the layout.

## Complex Data in Front Matter

Front matter supports complex YAML structures:

```yaml
---
title: Products
products:
  - name: Product A
    price: 19.99
    features:
      - Fast
      - Reliable
  - name: Product B
    price: 29.99
    features:
      - Premium
      - Durable
---
```

You can then iterate through this data in your templates:

```html
<h1>{{ title }}</h1>

<div class="products">
  {% for product in products %}
    <div class="product">
      <h2>{{ product.name }} - ${{ product.price }}</h2>
      <ul>
        {% for feature in product.features %}
          <li>{{ feature }}</li>
        {% endfor %}
      </ul>
    </div>
  {% endfor %}
</div>
```

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

- [Templates](/templates/) - Using front matter in Nunjucks templates
- [User Functions](/user-functions/) - Accessing front matter data in user functions
- [Custom Filters](/custom-filters/) - Working with front matter in filters