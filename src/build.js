import fs from 'fs';
import fsPromise from 'node:fs/promises';
import path from 'path';
import nunjucks from 'nunjucks';
import {parse as parseYaml} from 'yaml'

import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({html: true, linkify: true});
const mdRender = (s) => md.render(s);
const mdRenderInline = (s) => md.renderInline(s);

/**
 * @typedef {string} Filename These are the filenames that will be copied or processed by picossg, e.g. `*.njk` or `*.md.njk` files.
 * @typedef {string} UrlPath The trailing part in a URL after the domain name, e.g. `/about` or `/blog/2023/01/01/my-post.html` and excluding the query string and hash.
 *
 * @typedef {{url: UrlPath, content: string, date: Date}} RootProps
 * @typedef {{relativeFilePath: Filename, absoluteFilePath: Filename, content: string, needsProcessing: boolean, hasFrontmatterBlock: boolean}} FileObject
 * @typedef {{rawUrlPath: UrlPath, prettyUrlPath: UrlPath, relativeFilePath: Filename, absoluteFilePath: Filename}} OutputObject
 * @typedef {{_file: FileObject, _frontmatter: object, _output: OutputObject, _site: object}} PicossgObjects
 * @typedef {PicossgObjects & RootProps} FileData All the data each file has.
 *
 * @typedef {Map<string|symbol, function(*, *): *>} ProcessorMap
 */

async function loadNjkCustomStuff(config, njk) {
  const njkFilterFile = path.join(process.cwd(), config.contentDir, '_njk-custom/filters.js');
  try {
    const mod = await import(njkFilterFile);
    if (mod.default) {
      mod.default(njk);
    }
  } catch (e) {
    if (e.code === 'ERR_MODULE_NOT_FOUND') {
      console.error(`⏭️ NO (valid) custom njk filters loaded, searched at:\n     ${njkFilterFile}`);
      return;
    }
    console.log(`❌ Error loading njk custom filters:\n    ${njkFilterFile}`);
    throw e;
  }
  console.log(`✅  Loaded njk custom filters from:\n    ${njkFilterFile}`);
}

async function loadUserFunctions(config) {
  const userFunctionsFile = path.join(process.cwd(), config.contentDir, config.configFile);
  let module;
  try {
    module = await import(userFunctionsFile);
  } catch (e) {
    if (e.code === 'ERR_MODULE_NOT_FOUND') {
      console.error(`⏭️ NO (valid) user functions loaded, searched at:\n     ${userFunctionsFile}`);
      return;
    }
    console.log(`❌ Error loading user functions:\n    ${userFunctionsFile}`);
    throw e;
  }
  if (module) {
    console.log(`✅  Loaded user functions from:\n    ${userFunctionsFile}`);
    return module;
  }
  console.error(`⏭️ NO (valid) user functions loaded, searched at:\n     ${userFunctionsFile}`);
}

/**
 * @return {Promise<ProcessorMap>}
 */
async function createProcessors(config) {
  const nunjucksOptions = {
    autoescape: true,
    throwOnUndefined: true,
    trimBlocks: true,
    lstripBlocks: true,
  };
  const njk = nunjucks.configure(config.contentDir, nunjucksOptions);
  njk.addFilter('md', (s) => mdRender(s));
  njk.addFilter('mdinline', (s) => mdRenderInline(s));
  const coreFilters = Object.keys(njk.filters);
  await loadNjkCustomStuff(config, njk);
  const newFilters = Object.keys(njk.filters).filter((f) => !coreFilters.includes(f));
  console.log(`    ${newFilters.length} custom njk filters loaded: ${newFilters.join(', ')}`);

  return new Map([
    ['.njk', (content, data) => njk.renderString(content, data)],
    ['.md', (content, _) => mdRender(content)],

    // The processor below is not for a file extension but just for rendering the "layout" given as (front-matter) attribute in the metadata.
    [Symbol.for('njk-layout'), (filename, data) => njk.render(filename, data)],
  ]);
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true});
  }
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const res = path.resolve(dir, entry.name);
    const shouldEnterDirectory = entry.isDirectory() && !entry.name.startsWith('_');
    yield* shouldEnterDirectory ? walk(res) : [res];
  }
}

function needsProcessing(relPath, processors) {
  for (const ext of processors.keys()) {
    if (typeof ext === 'string' && relPath.endsWith(ext)) {
      return true;
    }
  }
  return false;
}

const isIgnoredFile = (filename) => filename.startsWith('_');

const toSize = (size) => {
  const number = size / 1024;
  if (number < 1) {
    return `${size} Bytes`;
  }
  return number.toFixed(2) + ' kB';
};

function processFileContent(contentIn, processors, originalFilePath, relPath, fileData) {
  let outPath = originalFilePath;
  let contentOut = contentIn;
  const initialSize = toSize(contentOut.length);
  process.stdout.write(`⚙️ Process ${relPath}, ${initialSize}, `);

  while (processors.has(path.extname(outPath))) { // process all known extensions
    const ext = path.extname(outPath);
    process.stdout.write(`${ext}`);
    const processor = processors.get(ext);
    contentOut = processor(contentOut, fileData);
    outPath = outPath.slice(0, -ext.length);
    process.stdout.write(`👍🏾`);
  }

  // If the metadata (front-matter block) has a "layout" key, wrap it all in that given layout, we use njk's {% extends %} for it.
  if (fileData._frontmatter?.layout) {
    process.stdout.write(` layout: ${fileData._frontmatter?.layout}`);
    const processor = processors.get(Symbol.for('njk-layout'));
    contentOut = processor(fileData._frontmatter?.layout, {...fileData, content: contentOut});
    process.stdout.write(`👍🏾`);
  }
  console.log('');
  return contentOut;
}

const frontMatterRegexp = /^---(\s*[\s\S]*?\s*)---/;

function readMetadataAndContent(content) {
  const frontmatterBlock = content.match(frontMatterRegexp)?.pop() ?? '';
  const hasFrontmatterBlock = frontmatterBlock.trim().length > 0;
  const metadata = hasFrontmatterBlock ? parseYaml(frontmatterBlock) : {};
  const contentWithoutFrontMatterBlock = content.replace(frontMatterRegexp, '');
  return [hasFrontmatterBlock, metadata, contentWithoutFrontMatterBlock];
}

function isFileToHandle(relPath, config, processors) {
  if (isIgnoredFile(path.basename(relPath))) {
    return [false, false];
  }

  return [true, needsProcessing(relPath, processors)];
}

/**
 * @return {OutputObject}
 */
const toOutputObject = (relativeFilePath, config, processors) => {
  let outRelativePath = relativeFilePath;
  while (processors.has(path.extname(outRelativePath))) { // process all known extensions
    const ext = path.extname(outRelativePath);
    outRelativePath = outRelativePath.slice(0, -ext.length);
  }
  const urlPath = '/' + outRelativePath;
  return {
    rawUrlPath: urlPath,
    prettyUrlPath: urlPath.endsWith('/index.html') ? urlPath.replace(/index\.html$/, '') : urlPath,
    relativeFilePath: outRelativePath,
    absoluteFilePath: path.resolve(config.outDir, outRelativePath),
  };
};

/**
 * This function just prevents `fs.statSync` to be run for files where `date` is already set in the frontmatter.
 * So it's just reducing processing load (for now).
 */
const readRootPropDate = (picossgObject) => {
  const frontmatter = picossgObject._frontmatter;
  if (frontmatter.date) {
    return frontmatter.date;
  }
  const stats = fs.statSync(picossgObject._file.absoluteFilePath);
  return stats.mtime.toISOString();
};

const toRootProps = (picossgObject) => {
  return {
    url: picossgObject._output.prettyUrlPath,
    content: picossgObject._file.content,
    date: readRootPropDate(picossgObject),
    ...picossgObject._frontmatter,
  }
};

export async function buildAll(config) {
  const startTime = performance.now();
  fs.rmSync(config.outDir, {recursive: true, force: true});
  const processors = await createProcessors(config);
  const userFunctions = await loadUserFunctions(config);
  console.log('');

  // Go through all files and fill the files map, with the relative filename and all data for it.
  /** @type {Map<Filename, FileData>} */
  const files = new Map();
  for (const absoluteFilePath of walk(config.contentDir)) {
    const relativeFilePath = path.relative(config.contentDir, absoluteFilePath);
    const [shouldHandleFile, needsProcessing] = isFileToHandle(relativeFilePath, config, processors);
    if (shouldHandleFile) {
      if (needsProcessing) {
        const fileContent = fs.readFileSync(absoluteFilePath, 'utf8');
        const [hasFrontmatterBlock, frontmatter, content] = needsProcessing
          ? readMetadataAndContent(fileContent)
          : [false, {}, ''];
        const picossgObject = {
          _file: {relativeFilePath, absoluteFilePath, content, needsProcessing, hasFrontmatterBlock},
          _frontmatter: frontmatter,
          _output: toOutputObject(relativeFilePath, config, processors),
          _site: {},
        };
        files.set(relativeFilePath, {
          ...picossgObject,
          ...toRootProps(picossgObject),
        });
      } else {
        // File needs no processing => only copy the file
        const outFilePath = path.join(config.outDir, relativeFilePath);
        ensureDir(outFilePath);
        process.stdout.write(`💾 Copy ${relativeFilePath} => ${outFilePath}`);
        fs.copyFileSync(absoluteFilePath, outFilePath);
        console.log(' ✅ ');
      }
    }
  }

  // Run the user's pre-processor first, if any
  // NOTE: this might modify `files`, intentionally. It is an architecture decision.
  if (userFunctions.preprocess) {
    await userFunctions.preprocess(files);
    console.log('⏭️ Preprocessing done.');
  }

  for (const [relativeFilePath, fileData] of files) {
    // If these shall be `Promise.all()`'ed then the outputting needs fixed, because they would be out of order.
    const outFilePathBeforeProcessing = path.join(config.outDir, relativeFilePath);
    ensureDir(outFilePathBeforeProcessing);
    // NOTE: use the `fileData.content` here, it might have been modified by the user's preprocessor!
    fileData.content = processFileContent(fileData.content, processors, outFilePathBeforeProcessing, relativeFilePath, fileData);
  }

  if (userFunctions.postprocess) {
    await userFunctions.postprocess(files);
    console.log('⏭️ Postprocessing done.');
  }

  const writes = [];
  for (const [_, fileData] of files) {
    const inPath = fileData._file.relativeFilePath;
    const output = fileData._output;
    writes.push(fsPromise
      .writeFile(output.absoluteFilePath, fileData.content, 'utf8')
      .then(() => console.log(`✅  ${inPath} => ${output.relativeFilePath} ${toSize(fileData.content.length)}`))
    );
  }
  await Promise.allSettled(writes);
  const endTime = performance.now();
  console.log(`\n⏱️ Processed ${files.size} files in ${((endTime - startTime) / 1000).toFixed(2)} seconds.`);
}
