---
layout: _base.njk
title: Templates
category: Concepts
---

# Templates in PicoSSG

PicoSSG uses [Nunjucks](https://mozilla.github.io/nunjucks/) as its templating engine. Nunjucks is a powerful, flexible templating language with a syntax similar to Jinja2 (Python) and Twig (PHP).

## Basic Template Usage

Files with the `.njk` extension are processed by Nunjucks. Here's a simple example:

```html
<!DOCTYPE html>
<html>
<head>
  <title>{{ title }}</title>
</head>
<body>
  <h1>{{ title }}</h1>
  <p>Welcome to my website!</p>
</body>
</html>
```

## Variable Output

To output a variable, use double curly braces:

```
{{ variable }}
```

For safety, HTML characters are escaped by default. To output raw HTML, use the `safe` filter:

```
{{ variable | safe }}
```

## Control Structures

### Conditionals

```
{% if user %}
  <h1>Hello {{ user.name }}!</h1>
{% else %}
  <h1>Hello Guest!</h1>
{% endif %}
```

### Loops

```
<ul>
{% for item in items %}
  <li>{{ item.name }}</li>
{% endfor %}
</ul>
```

With an else block for empty collections:

```
<ul>
{% for item in items %}
  <li>{{ item.name }}</li>
{% else %}
  <li>No items found</li>
{% endfor %}
</ul>
```

## Template Inheritance

Nunjucks supports template inheritance, which is extremely useful for creating consistent layouts.

### Base Template

Create a base template with blocks that can be overridden:

```html
{# _base.njk #}
<!DOCTYPE html>
<html>
<head>
  <title>{% block title %}Default Title{% endblock %}</title>
  {% block head %}{% endblock %}
</head>
<body>
  <header>
    {% block header %}
      <h1>My Website</h1>
    {% endblock %}
  </header>
  
  <main>
    {% block content %}{% endblock %}
  </main>
  
  <footer>
    {% block footer %}
      <p>&copy; {{ "now" | date: "%Y" }} My Website</p>
    {% endblock %}
  </footer>
</body>
</html>
```

### Child Template

Extend the base template and override specific blocks:

```html
{% extends "_base.njk" %}

{% block title %}About Us{% endblock %}

{% block content %}
  <h1>About Our Company</h1>
  <p>We are a great company!</p>
{% endblock %}
```

## Including Templates

You can include other templates using the `include` tag:

```
{% include "_header.njk" %}

<main>
  <p>This is the main content.</p>
</main>

{% include "_footer.njk" %}
```

## Special PicoSSG Integration

### The `content` Variable

When using a layout specified in front matter, the processed content is available as the `content` variable:

```html
{{ content | safe }}
```

### Combining with Markdown

PicoSSG can combine Nunjucks and Markdown processing:

1. Files with `.md.njk` extension are first processed by Nunjucks, then by Markdown
2. Files with `.html.md` are processed by Markdown and output as HTML

### Front Matter Integration

Front matter data is automatically available in your templates:

```
---
title: My Page
author: John Doe
---

{% if author %}
  <p>Written by {{ author }}</p>
{% endif %}
```

## Built-in Filters

PicoSSG adds a few built-in filters to Nunjucks:

### `md`

Processes a string as Markdown:

```
{{ "**Bold text** and *italic text*" | md | safe }}
```

### `mdinline`

Processes a string as inline Markdown (no block elements):

```
<p>Click {{ "[here](https://example.com)" | mdinline | safe }} to visit our site.</p>
```

## Advanced Template Features

### Template Comments

Add comments that won't appear in the output:

```
{# This is a comment and won't be rendered #}
```

### Set Variables

Create or modify variables within templates:

```
{% set greeting = "Hello" %}
{{ greeting }}, World!
```

### Whitespace Control

Control whitespace with the `-` character:

```
{% for item in items -%}
  {{ item }}
{%- endfor %}
```

### Raw Content

Use the `raw` tag to prevent processing:

```
{% raw %}
  This {{ will not be }} processed.
{% endraw %}
```

## Common Patterns

### Navigation Highlighting

```html
<nav>
  <a href="/" class="{% if page.url == '/' %}active{% endif %}">Home</a>
  <a href="/about/" class="{% if page.url == '/about/' %}active{% endif %}">About</a>
  <a href="/contact/" class="{% if page.url == '/contact/' %}active{% endif %}">Contact</a>
</nav>
```

### Working with Dates

```html
<p>Published: {{ date | date: "%B %d, %Y" }}</p>
```

### Conditionally Including Content

```html
{% if env == "production" %}
  <script src="/analytics.js"></script>
{% endif %}
```

## Best Practices

1. **Use template inheritance** for consistent layouts
2. **Keep templates DRY** (Don't Repeat Yourself) using includes and macros
3. **Organize templates logically** with clear naming conventions
4. **Use underscore prefixes** (`_header.njk`) for partial templates
5. **Comment complex sections** for better maintainability
6. **Avoid complex logic** in templates where possible

## Related Topics

- [Custom Filters](/custom-filters/) - Adding your own Nunjucks filters
- [Front Matter](/frontmatter/) - Using metadata in templates
- [Components](/components/) - Creating reusable components