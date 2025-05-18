# picossg

The pico static site generator – the simplest one I ever wanted and hopefully "found".
See the [picossg.dev](https://picossg.dev) for more information.

## What it does

picossg processes:
- files from the `content` directory into the `output` directory, processing the files if needed
- Markdown files (`.md`) using [markdown-it](https://markdown-it.github.io/)
- Nunjucks templates (`.njk`) using [nunjucks](https://mozilla.github.io/nunjucks/)
- Combined Nunjucks + Markdown files (`.md.njk`)
- Static assets (copied as-is)

It transforms these files into a static website with a 1:1 mapping from source director+file structure to output.

## How to use it

- Make sure to have nodejs installed [see here](https://nodejs.org/en/download/)
- open a terminal
- run `npx @wolframkriesing/picossg -c content -o output`, this builds all files in the `content` directory into the `output` directory
- to serve, open another terminal, run `npx http-server output -p 8000`, now open http://localhost:8000 in your browser
  and the files in `content` are processed and served from `output`

## Getting Started

- create your new site's directory: `mkdir my-site; cd my-site`
- create the `content` directory: `mkdir content`
- put the `package.json` in the root of the project
```json
{
  "name": "my-ssg-site",
  "version": "1.0.0",
  "scripts": {
    "build": "npx @wolframkriesing/picossg -c content -o output",
    "start": "npx http-server output -p 8000",
    "build:watch": "npx nodemon --quiet --legacy-watch --watch content --ext '*' --exec \"bash -c 'npm run build'\""
  }
}
```
- put any `*.md` or `*.njk` file into the `content` directory, e.g. start with `index.html.md`
  (you can start with just putting "Hello World!" in there and go from there)
- run `npm run build:watch` in one terminal to start building the site
- run `npm start` in another terminal to start the server
- open http://localhost:8000 in your browser to see the site

The `npm run build` script above (the code `npx @wolframkriesing/picossg -c content -o output`) will run the remote picossg
package (which is published on npmjs.org) and look for files in the `content` directory, process them and put them to the `output` directory.  
The `npm run start` (or can also be called as `npm start`) script (the code `npx http-server output -p 8000`) 
will run the remote package `http-server` (also published on npmjs.org) and serve the files from the `output` directory on port 8000
on your local computer, which you can then see in your browser at http://localhost:8000.  
The `npm run build:watch` script uses yet another remote package `nodemon` to watch the `content` directory for changes 
and re-run the build command whenever a file changes, so you don't have to call `npm run build` every time you change a file.

## Examples

- see a [basic example in this repo](examples/1-basic), it contains a simple [index.html.njk](examples/1-basic/content/index.html.njk) file, start reading there
- a bit more complex example is a design implemented for the JSCraftCamp.org site for 2025,
  find it in the [jscc-site-2025 repo](https://codeberg.org/wolframkriesing/jscc-site-2025) – it uses only picossg to build the site
- [my blog](https://picostitch.com) runs only on picossg [the source code is here](https://codeberg.org/wolframkriesing/picostitch-com)

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

## How to develop picossg

To develop picossg, clone the repository and install the dependencies:
- `git clone https://codeberg.org/wolframkriesing/picossg.git`
- `cd picossg`
- `npm i`
- `npm run test:ci` runs all the tests, just not in watch mode
- `npm run test:watch` runs the tests in watch mode, and re-runs on any content change
- `test:preprocess:watch` runs the preprocess tests in watch mode, they can NOT run in parallel with the `npm run test:watch` tests,
    since they are using the same `_output` directory and would overwrite each other, therefore the final `nom run test:ci` command does the "final" test before a release

The `npm test` runs a simple `diff` command, it compares the generated `_output` directory with the expected output in `test/golden-ref`.

Since the default `npm run build:watch` runs multiple times when you change the source code, e.g. `build.js`
there is also `build:watch:dev` which only watches the code to be run and NOT the content to be generated.

## Run it via docker

- you can use `docker-compose run --rm --remove-orphans picossg_node node src/build-cli.js -c content -o _output` to run the build
- to build the docs into `_picossg.dev` directory you can use `docker-compose run --rm --remove-orphans picossg_node npm run build`
