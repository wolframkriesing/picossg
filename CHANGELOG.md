# (Maybe) Future Version

- [ ] add sizes to the _file and _output, maybe also the time it took to process

# V3.0.0

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

# V2.0.0

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

# Done

- [x] serve and process njk files
- [x] serve and process md files
- [x] serve and process njk.md files
- [x] serve assets, favicon, img.svg
- [x] exclude files with _
- [x] make includes work
- [x] make asset loading from components work, actually just a convention, no code for it

# To do

- [ ] generate code from e.g. JSON files
- [ ] allow running JS server side code to generate content

