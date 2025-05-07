# V2.0.0

- [x] make `npx run @wolframkriesing/picossg -c content -o out` work in other projects
- [x] allow loading njk filters
- [x] provide filter `|md` and `|mdinline`
- [ ] make a ~~frontmatter block~~ *.meta.js work – just purely processing `*.html.md.njk` does not work, since `njk` files that
  extend others and generate HTML will
  be processed as md later and all the included HTML gets escaped
  - [ ] make "extends" key in ~~frontmatter block~~ work, we start with *.meta.js files for each content file

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

