---
layout: _base.njk
title: Custom Filters
category: Advanced
---

# Custom Filters

PicoSSG allows you to extend Nunjucks with your own custom filters. This can be extremely useful for creating reusable formatting functions, data transformations, or utility methods.

## What Are Custom Filters?

Filters in Nunjucks modify or format variables within templates. They're applied using the pipe (`|`) character:

```
{{ variable | filter }}
```

PicoSSG includes a few built-in filters like `md` and `mdinline`, but you can add your own to extend functionality.

## Adding Custom Filters

To add custom filters, create a file at `_njk-custom/filters.js` in your content directory:

```
content/
├── _njk-custom/
│   └── filters.js
├── index.html.md
└── ...
```

This file should export a default function that receives the Nunjucks environment:

```javascript
// content/_njk-custom/filters.js
export default function(env) {
  // Add your custom filters here
  env.addFilter('uppercase', function(str) {
    return str.toUpperCase();
  });
  
  env.addFilter('formatDate', function(date, format) {
    // Date formatting logic
    return formattedDate;
  });
}
```

## Custom Filter Examples

Here are some useful custom filters you might want to add:

### Text Transformation

```javascript
// Capitalize first letter of each word
env.addFilter('titleCase', function(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
});

// Truncate text with ellipsis
env.addFilter('truncate', function(str, length) {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
});
```

### Date Formatting

```javascript
// Format dates using Intl.DateTimeFormat
env.addFilter('formatDate', function(date, format = 'medium') {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  const formats = {
    short: { month: 'numeric', day: 'numeric', year: '2-digit' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' }
  };
  
  return new Intl.DateTimeFormat('en-US', formats[format] || formats.medium).format(dateObj);
});
```

### Array and Collection Processing

```javascript
// Sort array of objects by property
env.addFilter('sortBy', function(array, property) {
  if (!array || !property) return array;
  return [...array].sort((a, b) => {
    if (a[property] < b[property]) return -1;
    if (a[property] > b[property]) return 1;
    return 0;
  });
});

// Group array of objects by property
env.addFilter('groupBy', function(array, property) {
  if (!array || !property) return {};
  
  return array.reduce((groups, item) => {
    const key = item[property];
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
});
```

### URL and Path Processing

```javascript
// URL-friendly slug
env.addFilter('slug', function(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')  // Remove special chars
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-');      // Remove consecutive hyphens
});

// Relative link checker
env.addFilter('relativeLink', function(url) {
  if (!url) return '#';
  if (url.startsWith('http') || url.startsWith('//')) return url;
  return url.startsWith('/') ? url : '/' + url;
});
```

### Math and Calculation

```javascript
// Basic arithmetic
env.addFilter('add', (a, b) => a + b);
env.addFilter('subtract', (a, b) => a - b);
env.addFilter('multiply', (a, b) => a * b);
env.addFilter('divide', (a, b) => b !== 0 ? a / b : 0);

// Random number within range
env.addFilter('random', function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
});
```

## Using Custom Filters in Templates

Once you've defined your custom filters, you can use them in your templates:

```
{# Using a text filter #}
<h1>{{ "hello world" | titleCase }}</h1>

{# Using a date filter #}
<p>Published: {{ article.date | formatDate('long') }}</p>

{# Using a collection filter #}
<ul>
{% for group, articles in articles | groupBy('category') %}
  <li>
    <h3>{{ group }}</h3>
    <ul>
      {% for article in articles %}
        <li>{{ article.title }}</li>
      {% endfor %}
    </ul>
  </li>
{% endfor %}
</ul>
```

## Async Filters

Nunjucks supports asynchronous filters for operations that might take time (like fetching data):

```javascript
env.addFilter('fetchData', async function(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Filter error:', error);
    return {};
  }
}, true); // true flag indicates async filter
```

## Accessing Nunjucks Environment

You can access and modify the Nunjucks environment directly:

```javascript
export default function(env) {
  // Change delimiter syntax
  env.opts.autoescape = false;
  
  // Add globals
  env.addGlobal('site', {
    title: 'My Awesome Site',
    url: 'https://example.com'
  });
  
  // Add filters
  env.addFilter('myFilter', function(str) {
    return str;
  });
}
```

## Best Practices

1. **Keep filters simple**: Each filter should do one thing well
2. **Add error handling**: Make filters resilient to invalid inputs
3. **Document your filters**: Include comments explaining each filter's purpose
4. **Use consistent naming**: Follow a naming convention for clarity
5. **Group related filters**: Organize filters logically by functionality
6. **Test with different inputs**: Ensure filters work correctly with various data types

## Debugging Custom Filters

If you're having issues with custom filters:

1. Check the console for errors when PicoSSG starts
2. Verify your `filters.js` file is in the correct location (`_njk-custom/filters.js`)
3. Make sure the export syntax is correct (default export function)
4. Add console.log statements in your filters to debug values
5. Try using simpler filters first to ensure the system is working

## Related Topics

- [Templates](/templates/) - Using filters in Nunjucks templates 
- [User Functions](/user-functions/) - Adding custom preprocessing and postprocessing
- [Components](/components/) - Building reusable template components