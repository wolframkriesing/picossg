# Title with `code`

## Auto link URLs
The URL ssg.picostitch.com should be rendered as a-href.
With "marked" we need the package "marked-linkify-it" additionally.

## Escape Entities 
Some characters should be escaped as HTML entities.

### Default/Simple

The inlined HTML for `<strong>` and its angle brackets <strong>are NOT</strong> escaped.

![the < alt " text ' with > entities](irrelvant.png)

## Markdown (by the spec) or not

  The package "marked" keeps the leading spaces of this line (while "markdown-it" would not).
the markdown spec says that less than 4 leading spaces can be ignored, but "marked" does not ignore them.
