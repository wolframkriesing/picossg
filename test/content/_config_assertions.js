import {strict as assert} from 'assert';

let numTestSets = 0;
const testSetSucceeded = (description) => {
  numTestSets++;
  console.log(`✅  Test set ${numTestSets} – ${description}`);
}

const testAllFilesAreFound = (files) => {
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
  
  testSetSucceeded('All files are found');
};

/**
 * The "picossg objects" are the objects picossg provides, they are always prefixed with "_".
 * They are _file, _output, _frontmatter, ...
 */
const testAllPicossgObjectsExist = (files) => {
  const firstFile = files.get('01-pure-html.html');
  const actualKeys = Object.keys(firstFile);
  assert(actualKeys.includes('_file')); 
  assert(actualKeys.includes('_frontmatter')); 
  assert(actualKeys.includes('_output')); 
  assert(actualKeys.includes('_site')); 
  
  testSetSucceeded('All picossg objects exist');
};

/**
 * Test a static file, one that does NOT get processed.
 */
const testStaticFilesFileObject = (files) => {
  /** @type {FileObject} */
  const f = files.get('favicon.ico')._file;
  
  assert.equal(f.needsProcessing, false);
  assert.equal(f.hasFrontmatterBlock, false);
  assert.equal(f.relativeFilePath, 'favicon.ico');
  assert.ok(f.absoluteFilePath.endsWith('test/content/favicon.ico')); // the absolute path depends on the local fs, so we just check what we know for sure.
  assert.equal(f.content, '');
  
  testSetSucceeded('Static files `_file` object');
};

const testToBeProcessedFilesFileObject = (files) => {
  /** @type {FileObject} */
  const f = files.get('02-markdown.html.md')._file;
  
  assert.equal(f.needsProcessing, true);
  assert.equal(f.hasFrontmatterBlock, false);
  assert.equal(f.relativeFilePath, '02-markdown.html.md');
  assert.ok(f.absoluteFilePath.endsWith('test/content/02-markdown.html.md')); // the absolute path depends on the local fs, so we just check what we know for sure.
  assert.equal(f.content, '# Headline\n\nparagraph');
  
  // A file with a frontmatter block, that block should NOT be part of `_file.content`.
  const fileWithFrontmatterBlock = files.get('22-with-layout.html.md')._file;
  assert.equal(fileWithFrontmatterBlock.content, '\n\n# I am H1\n\nand a paragraph');
  assert.equal(fileWithFrontmatterBlock.hasFrontmatterBlock, true);
  
  testSetSucceeded('To be processed files `_file` object');
};

/**
 * A static file, one that will just be copied to the output directory, does NOT have a frontmatter block.
 * The `_frontmatter` object is empty.
 */
const testStaticFilesFrontmatterObject = (files) => {
  /** @type {FileData} */
  const file = files.get('house.svg');
  
  assert.equal(file._file.hasFrontmatterBlock, false);
  assert.deepEqual(file._frontmatter, {});
  
  testSetSucceeded('Static files `_frontmatter` object');
};

const testToBeProcessedFilesFrontmatterObject = files => {
  const f = files.get('20-front-matter.html.md.njk')._frontmatter;
  
  assert.equal(f.title, 'Simple Meta Data');
  assert.equal(f.dateCreated, "2023-10-01 10:00:00");
  assert.deepEqual(f.tags, ['simple', 'SSG']);
  
  testSetSucceeded('To be processed files `_frontmatter` object');
};

const testStaticFilesOutputObject = (files) => {
  /** @type {OutputObject} */
  const o = files.get('house.svg')._output;
  
  assert.equal(o.rawUrlPath, '/house.svg');
  assert.equal(o.prettyUrlPath, '/house.svg');
  
  testSetSucceeded('Static files `_output` object');
};

const testToBeProcessedFilesOutputObject = (files) => {
  /** @type {OutputObject} */
  const o = files.get('05-myindex.html.md')._output;
  
  assert.equal(o.rawUrlPath, '/05-myindex.html');
  assert.equal(o.prettyUrlPath, '/05-myindex.html');
  
  testSetSucceeded('To be processed files `_output` object');
};

/**
 * @param files {Map<Filename, FileData>}
 */
const preprocess = (files) => {
  testAllFilesAreFound(files);
  testAllPicossgObjectsExist(files);
  
  // Test the `_file` object.
  testStaticFilesFileObject(files);
  testToBeProcessedFilesFileObject(files);
  // Test the `_frontmatter` object.
  testStaticFilesFrontmatterObject(files);
  testToBeProcessedFilesFrontmatterObject(files);
  // Test the `_output` object.
  testStaticFilesOutputObject(files);
  testToBeProcessedFilesOutputObject(files);

  console.log('✅  All config-assertion test sets passed.');
  process.exit(0);
}

export {preprocess};
