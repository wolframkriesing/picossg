---
title: My most minimal SSG
dateCreated: "2025-05-01 01:02:03",
tags: 
  - simple
  - ssg
  - web
  - static
  - useThePlatform
  - noFrameworks
  - lightweight
---

{% block content %}{% markdown %}

# I am H1

{% for k,v in meta %}
  {{ k }}: {{ v }}
{% endfor %}

I am a paragraph in markdown, so I should become embedded in a <p> tag.

Next comes a list of items:
- item 1
- item 2
- item 3
- item 4

{% endmarkdown %}{% endblock %}
