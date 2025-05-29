# Changelog

Find here all changes tracked while developing picossg.

## (Maybe) Future Version

- [ ] ignore .DS_Store files (or turn it around and allow only certain files)
- [ ] add sizes to the _file and _output, maybe also the time it took to process
- [ ] docs: make the docs correct and as I like them to be
- [ ] docs: add to the docs how to use PicoSSG when running `npm install` in a project
- [ ] docs: document the second parameter to the `preprocess` and `postprocess` functions
- [ ] provide a playground to see play with the converter online
- [ ] plugins: a link checker would be nice
- [ ] plugins: I want MUCH better error messages when a variable was not found or some error happens, nunjucks does a really bad job here
- [ ] plugins: render social-exported.json (e.g. tweets.json) to HTML, so it can be used in the site
- [ ] plugins: a `{% toc %}` for md pages would be cool to render the table of contents 

## v5.0.0 (349 LOC)

- [x] BREAKING: rename `configureNjk()` to `configure()` and pass it all processors, so the user can configure as they like
- [x] BREAKING: rename "utils" to "plugins" 
- [x] docs: multiple updates
- [x] docs: for `throwOnUndefined` default configuration for nunjucks and why 
- [x] docs: for stats plugin `addStatsProperty(files)`
- [x] plugins: applying config.js files per directory, that applies to all files in that directory, and the child dirs
      this is implemented in `src/plugins/configs.js` and can be called like this in a `preprocess()` `loadDataFromConfigs(files, config)`
      I am NOT documenting this plugin yet, I feel like it is not going to last
- [x] plugins: provide `{{ _stats.lastModified.* }}` and `{{ _stats.files }}`

## v4.0.0 (339 LOC)

- [x] add `npm run build:site` to build the picossg.dev website, might move somewhere else later
- [x] use _config.js instead of _nunjuck-custom/filters.js (a breaking change)
- [x] add `config` as second parameter to `preprocess` and `postprocess` functions, sometimes you need to know the config instead of assuming e.g. the output-path
- [x] improved the docs significantly
- [x] move picossg.dev site into the [repo root in the dir `picossg.dev`](./picossg.dev) so we can 
  - [x] use/link changelog, package.json and other files directly from the source
- [x] rename `dist` to `_output`, just to be consistent in naming
- [x] ensure that the path output files are written to are child paths of the output dir, it might happen that one adds a `_output` 
      object which accidentally writes to places it should not (actually just happened to me), this is basically a safeguard I feel worth having

## v3.0.2 (332 LOC)

- [x] add some real docs
- [x] 🐛 fixed a bug, `npm run build` did not work, I had the wrong path to `build-cli.js` in there

## v3.0.1 (332 LOC)

- [x] update the README to be useful and correct
- [x] provide example(s)

## v3.0.0 (332 LOC)

- [x] rebuild tests to be at least somehow grouped/sorted
- [x] ~~make the components directory be _includes, just like in nunjucks no need to invent names~~ actually this is good as it is, the components have files that will be built and served, so its mixed purpose
- [x] rewrite the processing to
  - [x] provide the metadata conveniently
    - [x] merge the data below on the root level deterministically, so the data are convenient to use in the template but also available in their original form (in the `_*` keys)
    - [x] provide `_file` with all info about the original file, like filename, size, content, etc.
    - [x] provide `_frontmatter` with all frontmatter data
    - [x] provide `_output` with the processed data, like url, content, etc.
    - [x] provide `_site` with all data from the site, like url, title, description, author, etc.
- [x] allow `preprocess()` and `postprocess()` functions that receive ALL files incl. data and content
  like so: `preprocess(files: Map<filename, {content: string, data: object}>)`
  this allows processing any file before and after the main processing, it provides access to all files e.g. to find related ones and do searches
- [x] no need for `picossg.*`, remove it, can be done inside the `preprocess()` function
- [x] copy files first, and do NOT put them in the `files` map, so they are handled first, and do not land in the processing function (preprocess and postprocess)
- [x] allow post-processing, e.g. to minify pages
- [x] add absolute and relative filePath to _output, to provide where the file will be stored to
- [x] remove -i command line option, just make the includes root be the content dir, simple

## v2.0.0 (281 LOC)

- [x] make `npx run @wolframkriesing/picossg -c content -o out` work in other projects
- [x] allow loading njk filters
- [x] provide filter `|md` and `|mdinline`
- [x] make a frontmatter block work
  - [x] pass meta data to the template
  - [x] make "extends/layout" key in frontmatter block work
  - [x] allow "collecting" all metadata e.g. through picossg.pages("/blog") or so and iterate over them to generate a blog list or alike
    - [x] and provide attributes for each page such as "url", ????
  - [x] pass the data into the layout template too, so e.g. a `title` of a page will be seen in the _base.njk template
- [x] add _config.js/ts to allow pre-processing 

## v1.0.0 (138 LOC)

- [x] serve and process njk files
- [x] serve and process md files
- [x] serve and process njk.md files
- [x] serve assets, favicon, img.svg
- [x] exclude files with _
- [x] make includes work
- [x] make asset loading from components work, actually just a convention, no code for it
- [x] ~~generate code from e.g. JSON files~~ can be done in _config.js
- [x] ~~allow running JS server side code to generate content~~ use _config.js

