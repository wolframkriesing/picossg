import {strict as assert} from 'assert';

/**
 * @param files {Map<Filename, FileData>}
 */
const preprocess = (files) => {
  
  // Verify all files are found.
  assert.deepEqual(files.keys().toArray(), [
    '01-pure-html.html',
    '02-markdown.html.md',
    '03-custom-filter.txt.njk',
    '04-builtin-filters.html.njk',
    '05-myindex.html.md',
    '06-mixed.html.md.njk',
    '10-include-html-only.html.njk',
    '11-include-with-style.html.njk',
    '20-front-matter.html.md.njk',
    '22-metadata-for-layout.html.njk',
    '22-with-layout.html.md',
    '40-preprocess.txt.njk',
    '50-picossg-findPages.txt.njk',
    'README.md',
    'components/2-with-css/style.css',
    'favicon.ico',
    'house.svg',
    'in-dir/index.html.md'
  ]);

  console.log('done');
  process.exit(1);
}

export {preprocess};
