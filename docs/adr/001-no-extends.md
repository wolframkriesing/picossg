# 1. Learning from .md.njk Processing

## Status

Accepted

## Context

Multiple ways one can process md and njk mixed content, lets look at the pros and cons and take a decision below.

### Standard Processing `*.md.njk`

Just purely processing `*.md.njk` does not work, since `njk` files that
extend others and generate HTML, will be processed as md later and all the included HTML gets escaped.
Example:
```
// _base.njk
<body>{% block content %}{% endblock %}</body>

// post.md.njk
{% extends "_base.njk" %}
{% block content %}
    # My Title
{% endblock %}
```

This renders:

```html
<p>&lt;body&gt;</p>
<h1>My Title</h1>
<p>&lt;/body&gt;</p>
```

Note the escaped `<body>` tags. This makes sense the way the processing works, process the result of the nunjucks processing as
markdown, but it is not what we want.


### njk Only with `{% markdown %}` Block Inside

Another way is to use pure njk files with a `{% markdown %}` block, 
and adding a `{% set %}` tag allows setting data that would go in front-matter headers.
like so:
```html
{% extends '_base.njk' %}
{% set meta = {
  title: "My most minimal SSG",
  tags: ['simple','ssg']
} %}

{% block content %}{% markdown %}
  # Markdown Title
{% endmarkdown %}{% endblock %}
```

This is the simplest way in terms of least special code to write for the processing, since it is standard njk,
with markdown content inside a block.  
The drawbacks are
- the verbosity of the meta data block
- the need to use `{% markdown %}` and `{% endmarkdown %}` tags
- the missing syntax highlighting in IDEs due to the mix of njk and md content (only one highlighting normally works)

## Decision

Use front-matter block, even though it requires more code to be written.

## Consequences

The pros are:
- standard format, compatible with other tools
- syntax highlighting in IDEs exists
- markdown first
- easy to read and write

the cons are:
- more code to write
- less flexible meta data (simple data are ok, complex structures or executing code must be done differently)
