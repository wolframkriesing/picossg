import {strict as assert} from 'assert';
import path from "path";

let numTestSets = 0;
const testSetSucceeded = (description) => {
  numTestSets++;
  console.log(`✅  Test set ${numTestSets} – ${description}`);
}

const testAllFilesAreFound = (files) => {
  assert.deepEqual(files.keys().toArray(), [
    '02-markdown.html.md',
    '03-custom-filter.txt.njk',
    '04-builtin-filters.html.njk',
    '05-myindex.html.md',
    '06-mixed.html.md.njk',
    '07-html-in-md.html.md',
    '08-markdown-edge-cases.html.md',
    '10-include-html-only.html.njk',
    '11-include-with-style.html.njk',
    '20-front-matter.html.md.njk',
    '21-with-layout.html.md',
    '22-metadata-for-layout.html.njk',
    '23-has-date.html.md',
    '40-preprocess.txt.njk',
    '41-postprocess.txt.njk',
    '50-picossg-findPages.txt.njk',
    'README.md',
    'in-dir/index.html.md'
  ]);
  
  testSetSucceeded('All files are found');
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
  const fileWithFrontmatterBlock = files.get('21-with-layout.html.md')._file;
  assert.equal(fileWithFrontmatterBlock.content, '\n\n# I am H1\n\nand a paragraph');
  assert.equal(fileWithFrontmatterBlock.hasFrontmatterBlock, true);
  
  testSetSucceeded('To be processed files `_file` object');
};

const testToBeProcessedFilesFrontmatterObject = files => {
  const f = files.get('20-front-matter.html.md.njk')._frontmatter;
  
  assert.equal(f.title, 'Simple Meta Data');
  assert.equal(f.dateCreated, "2023-10-01 10:00:00");
  assert.deepEqual(f.tags, ['simple', 'SSG']);
  
  testSetSucceeded('To be processed files `_frontmatter` object');
};

const testToBeProcessedFilesOutputObject = (files) => {
  /** @type {OutputObject} */
  const o = files.get('05-myindex.html.md')._output;
  
  assert.equal(o.rawUrlPath, '/05-myindex.html');
  assert.equal(o.prettyUrlPath, '/05-myindex.html');
  assert.equal(o.relativeFilePath, '05-myindex.html');
  const pwd = process.cwd();
  const expectedFilePath = path.join(pwd, '_output/05-myindex.html');
  assert.equal(o.absoluteFilePath, expectedFilePath);
  
  testSetSucceeded('To be processed files `_output` object');
};

const testToBeProcessedFilesRootProps = files => {
  const hasDate = files.get('23-has-date.html.md');
  assert.equal(hasDate.date, '1999-12-31');
  
  // all of frontmatter is merged into the root object
  const rootObj = files.get('20-front-matter.html.md.njk');
  const frontmatterProps = Object.keys(rootObj._frontmatter);
  frontmatterProps.forEach(key =>
    assert.ok(key in rootObj, `Key "${key}" (from the frontmatter block) not found in root object.`)
  );
};

/**
 * @param files {Map<Filename, FileData>}
 */
const preprocess = (files) => {
  testAllFilesAreFound(files);
  
  // Test the `_file` object.
  testToBeProcessedFilesFileObject(files);
  // Test the `_frontmatter` object.
  testToBeProcessedFilesFrontmatterObject(files);
  // Test the `_output` object.
  testToBeProcessedFilesOutputObject(files);
  
  // Test the root props.
  testToBeProcessedFilesRootProps(files);

  console.log('✅  All preprocess assertion test sets passed.');
  process.exit(0);
}

export {preprocess};
