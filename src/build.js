import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import MarkdownIt from 'markdown-it';
import {parse as parseYaml} from 'yaml'
import {PicoSsg} from "./picossg.js";

/**
 * @typedef {string} ProcessedFilename These are the filenames that are processed by picossg, e.g. `*.njk` or `*.md.njk` files.
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
    console.log(e);
    return;
  }
  console.log(`✅  Loaded njk custom filters from:\n    ${njkFilterFile}`);
}

/**
 * @return {Promise<ProcessorMap>}
 */
async function createProcessors(config) {
  const md = new MarkdownIt();

  const nunjucksOptions = {
    autoescape: true,
    throwOnUndefined: true,
    trimBlocks: true,
    lstripBlocks: true,
  };
  const njk = nunjucks.configure(path.join(config.contentDir, config.includesDir), nunjucksOptions);
  njk.addFilter('md', (s) => md.render(s));
  njk.addFilter('mdinline', (s) => md.renderInline(s));
  const coreFilters = Object.keys(njk.filters);
  await loadNjkCustomStuff(config, njk);
  const newFilters = Object.keys(njk.filters).filter((f) => !coreFilters.includes(f));
  console.log(`${newFilters.length} custom njk filters loaded: ${newFilters.join(', ')}`);

  return new Map([
    ['.njk', (content, data) => njk.renderString(content, data)],
    ['.md', (content, _) => md.render(content)],

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

function processFile(contentIn, processors, outPath, relPath, data) {
  let contentOut = contentIn;
  const initialSize = toSize(contentOut.length);
  process.stdout.write(`⚙️ Process ${relPath} (${initialSize}) ... `);
  while (processors.has(path.extname(outPath))) { // process all known extensions
    const ext = path.extname(outPath);
    process.stdout.write(`${ext}`);
    const processor = processors.get(ext);
    contentOut = processor(contentOut, data);
    outPath = outPath.slice(0, -ext.length);
    process.stdout.write(`👍🏾`);
  }

  // If the metadata (front-matter block) has a "layout" key, wrap it all in that given layout, we use njk's {% extends %} for it.
  if (data?.layout) {
    process.stdout.write(` layout: ${data.layout}`);
    const processor = processors.get(Symbol.for('njk-layout'));
    contentOut = processor(data.layout, {...data, content: contentOut});
    process.stdout.write(`👍🏾`);
  }

  fs.writeFileSync(outPath, contentOut);
  console.log(`\n        ✅  => ${outPath} (${toSize(contentOut.length)})`);
}

const frontMatterRegexp = /^---(\s*[\s\S]*?\s*)---/;

function readMetadata(content) {
  const frontmatterBlock = content.match(frontMatterRegexp)?.pop() ?? '';
  return parseYaml(frontmatterBlock) ?? {};
}

function splitMetadataAndContent(content) {
  const metadata = readMetadata(content);
  const contentWithoutFrontMatterBlock = content.replace(frontMatterRegexp, '');
  return [metadata, contentWithoutFrontMatterBlock];
}

async function handleFile(filePath, config, processors, picossg) {
  const relPath = path.relative(config.contentDir, filePath);

  if (isIgnoredFile(path.basename(relPath))) {
    return;
  }

  let outPath = path.join(config.outDir, relPath);
  ensureDir(outPath);

  if (needsProcessing(relPath, processors)) {
    const rawContent = fs.readFileSync(filePath, 'utf8');
    const [metadata, content] = splitMetadataAndContent(rawContent);
    processFile(content, processors, outPath, relPath, {...metadata, picossg});
    return;
  }

  // Simply copy the file
  process.stdout.write(`💾 Copy ${relPath} => ${outPath}`);
  fs.copyFileSync(filePath, outPath);
  console.log(' ✅ ');
}

/**
 * Reads the metadata from a file and returns the relative path and the metadata.
 * @return {undefined | [ProcessedFilename, object]}
 */
function readMetadataFromFile(filePath, config, processors) {
  const relPath = path.relative(config.contentDir, filePath);

  if (isIgnoredFile(path.basename(relPath))) {
    return;
  }

  if (needsProcessing(relPath, processors)) {
    const rawContent = fs.readFileSync(filePath, 'utf8');
    return [relPath, readMetadata(rawContent)]
  }
}

export async function buildAll(config) {
  fs.rmSync(config.outDir, {recursive: true, force: true});
  const processors = await createProcessors(config);
  console.log('');

  // Collect all the metadata from the content files
  /** @type {Map<ProcessedFilename, object>} */
  const metadata = new Map();
  for (const file of walk(config.contentDir)) {
    const metaOrNot = readMetadataFromFile(file, config, processors);
    if (metaOrNot !== undefined) {
      const [processedFilename, oneFilesMetadata] = metaOrNot;
      metadata.set(processedFilename, oneFilesMetadata);
    }
  }
  
  const picoSsg = new PicoSsg(metadata, processors);
  
  for (const file of walk(config.contentDir)) {
    // If these shall be `Promise.all()`'ed then the outputting needs fixed, because they would be out of order.
    await handleFile(file, config, processors, picoSsg);
  }
}
