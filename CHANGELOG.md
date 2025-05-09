# V2.0.0

- [x] make `npx run @wolframkriesing/picossg -c content -o out` work in other projects
- [x] allow loading njk filters
- [x] provide filter `|md` and `|mdinline`
- [ ] make a frontmatter block work
  - [x] pass meta data to the template
  - [x] make "extends/layout" key in frontmatter block work
  - [ ] allow "collecting" all metadata e.g. through picossg.pages("/blog") or so and iterate over them to generate a blog list or alike

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

