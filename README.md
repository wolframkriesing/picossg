# picossg

The pico static site generator – the simplest one I ever wanted and hopefully "found"

## What it does

picossg is a minimalist static site generator that processes:
- Markdown files (`.md`) using [markdown-it](https://markdown-it.github.io/)
- Nunjucks templates (`.njk`) using [nunjucks](https://mozilla.github.io/nunjucks/)
- Combined Nunjucks + Markdown files (`.md.njk`)
- Static assets (copied as-is)

It transforms these files into a static website with a 1:1 mapping from source to output.

## Philosophy

The core philosophy of picossg is simplicity and predictability:

1. **1:1 file mapping** – Each source file maps directly to an output file with the same path (except for extension changes)
2. **Minimal magic** – The only "magic" is:
   - Files starting with underscore (`_*`) are excluded from the output
   - Template files (`.njk`, `.md`) are processed, a `file.html.md.njk` processes nunjucks and markdown and outputs `file.html`, 
     just by working off the extensions from the last one backward. Allows also for `style.css.njk` to be processed and output as `style.css` if desired.
   - All other files are copied as-is
3. **Components** – Components can be included from the `components` directory, this is handled like any other directory or URL
   - For example, `components/_header.njk` can be included in any template with `{% include "_header.njk" %}`, the leading underscore excludes it from being built and served
   - This allows for easy reuse of components across different templates
4. **Asset handling** – Any assets (CSS, images, etc.) in the source directory are copied to the output, as mentioned in 2. already

There are no complex configuration options, no plugins, no middleware – just a simple, predictable build process.

## How to run it

```bash
# Start the build process (watches for changes)
npm run build

# In another terminal, start the server
npm run serve
```

Then open http://localhost:8899 in your browser.

## For developers

To run the tests:

```bash
npm test
```

This compares the generated `dist` directory with the expected output in `expected-dist`.
