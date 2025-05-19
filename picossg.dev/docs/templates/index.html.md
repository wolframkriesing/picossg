---
layout: docs/_base.njk
title: Templates
---

# Templates in PicoSSG

PicoSSG uses [Nunjucks](https://mozilla.github.io/nunjucks/) as its templating engine. 
Nunjucks is a powerful, flexible templating language with a syntax inspired by
[Django templates](https://docs.djangoproject.com/en/dev/topics/templates/#syntax),
[Jinja2 (Python)](https://jinja.palletsprojects.com/en/stable/) and [Twig (PHP)](https://twig.symfony.com/).

## Basics

Files with the `.njk` extension are processed by Nunjucks. Here's a simple example:

```html
---
title: My Page
---

<!DOCTYPE html>
<html>
<head>
  <title>{{ title }}</title>
</head>
<body>
  <h1>{{ title }}</h1>
  <p>Welcome to my website!</p>

  {% for number in [1, 2, 3, 4, 5] %}
    {% if number % 2 == 0 %}
      <p>Even Number: {{ number }}</p>
    {% else %}
      <p>Odd Number: {{ number }}</p>
    {% endif %}
  {% endfor %}

</body>
</html>
```

In this example, the `title` variable is defined in the [front matter](/docs/frontmatter) and used in the template.
The `for` loop iterates over a list of numbers, and the `if` statement checks if each number is even or odd.

## Syntax

### Variable Output

To output a variable, use double curly braces:

```
{{ variable }}
```

For safety, HTML characters are escaped by default. To output raw HTML, use the `safe` filter:

```
{{ variable | safe }}
```

### Control Structures

#### Conditionals

```
{% if user %}
  <h1>Hello {{ user.name }}!</h1>
{% else %}
  <h1>Hello Guest!</h1>
{% endif %}
```

#### Loops

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

### Much More

See the [Nunjucks documentation](https://mozilla.github.io/nunjucks/templating.html) for all the features, 
there are a lot of built-in filters, more control structures, macros, and asynchronous templates.

## Inheritance `{% extends %}`

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

## Includes `{% include %}`

You can include other templates using the `include` tag:

```
{% include "_header.njk" %}

<main>
  <p>This is the main content.</p>
</main>

{% include "_footer.njk" %}
```

## `layout` and `{{ content }}`

In PicoSSG, when you specify a `layout` in the front matter of a Markdown file, 
the rendered content is passed to that layout via the `content` variable.

```html
---
layout: _base.njk
---

my md content ...
```

In order to render the content of the file above, you can use the `{{ content }}` variable in your layout,
which is the `_base.njk` file in this case (the one referenced as `layout` in the front matter above):

```html
{{ content | safe }}
```

Note: Using `{{ content | safe }}` is important to prevent HTML escaping, allowing the rendered Markdown to be displayed correctly.

## Built-in Filters

PicoSSG adds a few built-in filters to Nunjucks:

### `md`

Processes a string as Markdown:

```
{{ "**Bold text** and *italic text*" | md | safe }}
```

this will render

```html
<p><strong>Bold text</strong> and <em>italic text</em></p>
```

### `mdinline`

Processes a string as inline Markdown, it does NOT add surrounding `<p>` elements as `md` does:

```
<p>Click {{ "[here](https://example.com)" | mdinline | safe }} to visit our site.</p>
```

renders

```html
<p>Click <a href="https://example.com">here</a> to visit our site.</p>
```

## Best Practices

1. **Use template inheritance** for consistent layouts
2. **Keep templates DRY** (Don't Repeat Yourself) using includes and macros
3. **Organize templates logically** with clear naming conventions
4. **Use underscore prefixes** (`_header.njk`) for partial templates
5. **Comment complex sections** for better maintainability
6. **Avoid complex logic** in templates where possible

## Related Topics

- [Custom Filters](/docs/custom-filters/) - Adding your own Nunjucks filters
- [Front Matter](/docs/frontmatter/) - Using metadata in templates
- [Components](/docs/components/) - Creating reusable components