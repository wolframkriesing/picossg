---
layout: _base.njk
title: Components
---

# Components in PicoSSG

PicoSSG lets you create reusable components for your site by leveraging Nunjucks's include and macro features. This guide shows how to create and use components to keep your templates DRY (Don't Repeat Yourself) and maintainable.

## What Are Components?

In PicoSSG, components are reusable template fragments that you can include in multiple pages. They help you:

- Avoid duplicating code
- Maintain consistent styling and behavior
- Make updates easier by centralizing code
- Create a more modular site structure

## Basic Component Usage

The simplest way to create components is with Nunjucks's `include` directive. Put component files in a dedicated directory (like `components/` or `_includes/`) with names starting with underscore to prevent them from being output as standalone pages.

### Directory Structure

```
content/
├── components/
│   ├── _header.njk
│   ├── _footer.njk
│   └── _card.njk
├── index.html.md
└── about.html.md
```

### Creating a Simple Component

Create a header component at `content/components/_header.njk`:

```html
<header class="site-header">
  <div class="container">
    <a href="/" class="logo">My Site</a>
    <nav>
      <a href="/">Home</a>
      <a href="/about/">About</a>
      <a href="/blog/">Blog</a>
      <a href="/contact/">Contact</a>
    </nav>
  </div>
</header>
```

### Including the Component

Use the `include` directive to add the component to your templates:

```html
{% include "components/_header.njk" %}

<main>
  {{ content | safe }}
</main>

{% include "components/_footer.njk" %}
```

## Passing Variables to Components

Basic components are often static, but you can pass variables for more flexibility:

### In Your Layout Template

```html
{% include "components/_header.njk" %}

<main class="container">
  <h1>{{ title }}</h1>
  {{ content | safe }}
</main>

{% include "components/_footer.njk" %}
```

### In Your Component

```html
<header class="site-header">
  <div class="container">
    <a href="/" class="logo">{{ site.title }}</a>
    <nav>
      <a href="/" class="{% if page.url == '/' %}active{% endif %}">Home</a>
      <a href="/about/" class="{% if page.url == '/about/' %}active{% endif %}">About</a>
      <a href="/blog/" class="{% if page.url == '/blog/' %}active{% endif %}">Blog</a>
      <a href="/contact/" class="{% if page.url == '/contact/' %}active{% endif %}">Contact</a>
    </nav>
  </div>
</header>
```

## Creating Advanced Components with Macros

For more powerful components, use Nunjucks macros - they work like functions, accepting parameters and returning output.

### Creating a Card Macro

Create `content/components/_card.njk`:

```html
{% macro card(title, content, imageUrl='', link='', buttonText='Read More') %}
<div class="card">
  {% if imageUrl %}
    <img src="{{ imageUrl }}" alt="{{ title }}" class="card-image">
  {% endif %}
  
  <div class="card-body">
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-content">{{ content }}</p>
    
    {% if link %}
      <a href="{{ link }}" class="card-button">{{ buttonText }}</a>
    {% endif %}
  </div>
</div>
{% endmacro %}
```

### Using the Card Macro

Import and use the macro in your templates:

```html
{% from "components/_card.njk" import card %}

<div class="card-grid">
  {{ card(
    title = "First Card",
    content = "This is the content for the first card.",
    imageUrl = "/images/card1.jpg",
    link = "/card1/"
  ) }}
  
  {{ card(
    title = "Second Card",
    content = "This is the content for the second card.",
    imageUrl = "/images/card2.jpg",
    link = "/card2/",
    buttonText = "Learn More"
  ) }}
  
  {{ card(
    title = "Third Card",
    content = "This is the content for the third card."
  ) }}
</div>
```

## Component Libraries

For larger sites, create a component library by collecting related macros in a file:

### Creating a Component Library

Create `content/components/_ui-library.njk`:

```html
{# Button Component #}
{% macro button(text, url='#', type='primary', size='medium') %}
<a href="{{ url }}" class="btn btn-{{ type }} btn-{{ size }}">{{ text }}</a>
{% endmacro %}

{# Alert Component #}
{% macro alert(content, type='info', dismissible=false) %}
<div class="alert alert-{{ type }} {% if dismissible %}alert-dismissible{% endif %}">
  {{ content | safe }}
  {% if dismissible %}
    <button class="close">&times;</button>
  {% endif %}
</div>
{% endmacro %}

{# Icon Component #}
{% macro icon(name, size='medium') %}
<span class="icon icon-{{ name }} icon-{{ size }}"></span>
{% endmacro %}
```

### Using the Component Library

Import and use the components:

```html
{% from "components/_ui-library.njk" import button, alert, icon %}

<div class="container">
  {{ alert('Welcome to my site!', 'success', true) }}
  
  <h1>{{ title }}</h1>
  
  <div class="action-area">
    {{ button('Contact Us', '/contact/', 'primary', 'large') }}
    {{ button('Learn More', '/about/', 'secondary') }}
  </div>
  
  <footer>
    {{ icon('github') }} {{ icon('twitter') }} {{ icon('linkedin') }}
  </footer>
</div>
```

## Components with Associated Assets

Components can include their own CSS and JavaScript. PicoSSG helps you organize this by preserving directory structure.

### Component with Assets

```
content/
├── components/
│   ├── slider/
│   │   ├── _index.njk    (the component template)
│   │   ├── slider.css    (component-specific CSS)
│   │   └── slider.js     (component-specific JS)
```

Your slider component (`_index.njk`):

```html
<link rel="stylesheet" href="/components/slider/slider.css">

<div class="slider" id="{{ id | default('slider-' + range(1000) | random) }}">
  <div class="slider-track">
    {% for slide in slides %}
      <div class="slide">{{ slide | safe }}</div>
    {% endfor %}
  </div>
  <button class="prev">Previous</button>
  <button class="next">Next</button>
</div>

<script src="/components/slider/slider.js"></script>
```

### Using the Component with Assets

```html
{% include "components/slider/_index.njk" with {
  id: 'homepage-slider',
  slides: [
    '<img src="/images/slide1.jpg" alt="Slide 1">',
    '<img src="/images/slide2.jpg" alt="Slide 2">',
    '<img src="/images/slide3.jpg" alt="Slide 3">'
  ]
} %}
```

## Nested Components

Components can include other components to create more complex structures:

### Layout Component

`content/components/_layout.njk`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }} | My Site</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  {% include "components/_header.njk" %}
  
  <main class="container">
    {{ content | safe }}
  </main>
  
  {% include "components/_footer.njk" %}
</body>
</html>
```

## Best Practices

### 1. Use Naming Conventions

- Prefix component files with underscore (`_header.njk`)
- Use descriptive names that indicate function
- Group related components in subdirectories

### 2. Make Components Reusable

- Use parameters with sensible defaults
- Don't hardcode values that might change
- Design components to be context-independent

### 3. Component Structure

- Keep components focused on a single responsibility
- Break complex components into smaller ones
- Consider component relationships and hierarchy

### 4. Documentation

- Comment complex components
- Document required and optional parameters
- Provide examples of usage

### 5. Performance

- Import only the macros you need
- Avoid excessive nesting of components
- Consider the impact of components on page load time

## Troubleshooting

### Component Not Found

If you get "Template Not Found" errors:

- Check the path is correct
- Ensure the file exists in the right location
- Verify the file extension is correct

### Variable Not Available

If variables aren't available in your component:

- Check that variables are passed correctly
- Use the `with` keyword to pass context
- Add default values for optional parameters

## Related Topics

- [Templates](/templates/) - Nunjucks templating basics
- [Custom Filters](/custom-filters/) - Extend components with custom filters
- [File Mapping](/file-mapping/) - How component files are processed