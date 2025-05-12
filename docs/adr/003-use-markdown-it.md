# 3. Use npm package markdown-it

## Status

Accepted

## Context

There are at least two markdown parsers, the final choice boiled down to marked and markdown-it.
I tested both, the code to use with marked is the following:

```javascript
import { marked } from 'marked';
import markedLinkifyIt from 'marked-linkify-it';
marked.use(markedLinkifyIt());
const mdRender = (s) => marked.parse(s);
const mdRenderInline = (s) => marked.parseInline(s);
```

See the file [08-markdown-edge-case.html.md](test/content/08-markdown-edge-case.html.md) for edge cases
collected in order to find out which markdown parser to use.

## Decision

Even though marked seems more modern, better maintained, and has more features, I decided to use markdown-it.
The escaping of entities in attributes does not work in marked, 
see 08-markdown-edge-case.html.md, so we are sticking to markdown-it for now.
Also marked needs at least one more package "marked-linkify-it" to automatically link URLs, while markdown-it has this feature built-in.

## Consequences

- markdown-it is used as the markdown parser