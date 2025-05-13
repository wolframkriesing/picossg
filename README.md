# picossg

The pico static site generator – the simplest one I ever wanted and hopefully "found"

## What it does

picossg processes:
- Source files from the `content` directory into a `output` directory, processing the files if needed
- Markdown files (`.md`) using [markdown-it](https://markdown-it.github.io/)
- Nunjucks templates (`.njk`) using [nunjucks](https://mozilla.github.io/nunjucks/)
- Combined Nunjucks + Markdown files (`.md.njk`)
- Static assets (copied as-is)

It transforms these files into a static website with a 1:1 mapping from source director+file structure to output.

## Philosophy

The core philosophy of picossg is simplicity and predictability:

1. **1:1 file mapping** – Each source file maps directly to an output file with the same path (except for extension changes)
2. **Minimal magic** – The only "magic" is:
   - Files starting with underscore (`_*`) are excluded from the output
   - Template files (`.njk`, `.md`) are processed, a `file.html.md.njk` processes nunjucks and markdown and outputs `file.html`, 
     just by working off the extensions from the last one backward. Allows also for `style.css.njk` to be processed and output as `style.css` if desired.
   - All other files are copied as-is
3. **Asset handling** – Any assets (CSS, images, etc.) in the source directory are copied to the output, as mentioned in 2. already
4. **_config.js** – An optional `_config.js` file in the content directory can provide `preprocess()` and `postprocess()` functions, they both receive a map of all files
   and can be used to preprocess the content before rendering or postprocess the output after rendering.

There are no complex configuration options, no plugins, no middleware – just a simple, predictable build process.

## How to run it

```bash
# Start the build process
npm run build
npm run build:watch # watch mode

# In another terminal, start the server
npm run serve
```

Then open http://localhost:8899 in your browser.

## For developers

To run the tests:

```bash
npm test
```

This compares the generated `dist` directory with the expected output in `test/golden-ref`.

Run `npm run test:watch` to run the tests in watch mode, and re-run on any content change.

Since the default `npm run build:watch` runs multiple times when you change the source code, e.g. `build.js`
there is also `build:watch:dev` which only watches the code to be run and NOT the content to be generated.