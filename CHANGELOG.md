# V3.0.0

- [ ] rebuild tests to be at least somehow grouped/sorted
- [ ] rewrite the processing to
  - [ ] allow `preprocess()` and `postprocess()` functions that receive ALL files incl. data and content
        like so: `preprocess(files: Map<filename, {content: string, data: object}>)`
        this allows to process any file before and after the main processing, it provides access to all files e.g. to find related ones and do searches
- [ ] allow post-processing, e.g. to minify pages

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

