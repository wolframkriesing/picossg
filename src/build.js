import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import MarkdownIt from 'markdown-it';
import {parse as parseYaml} from 'yaml'

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
  const processed = [];
  process.stdout.write(`⚙️ Process ${relPath} (${initialSize}) ... `);
  while (processors.has(path.extname(outPath))) { // process all known extensions
    const ext = path.extname(outPath);
    const processor = processors.get(ext);
    contentOut = processor(contentOut, data);
    outPath = outPath.slice(0, -ext.length);
    processed.push(ext);
  }

  // If the metadata (front-matter block) has a "layout" key, wrap it all in that given layout, we use njk's {% extends %} for it.
  if (data?.meta?.layout) {
    const processor = processors.get(Symbol.for('njk-layout'));
    contentOut = processor(data.meta.layout, {content: contentOut});
  }

  fs.writeFileSync(outPath, contentOut);
  console.log(`=> ${outPath} (${toSize(contentOut.length)}) – (${processed.join(' ')}) ✅ `);
}

function readMetadata(content) {
  const regexp = /^---(\s*[\s\S]*?\s*)---/;
  const frontmatterBlock = content.match(regexp)?.pop() ?? '';
  const metadata = parseYaml(frontmatterBlock);
  const contentWithoutFrontMatterBlock = content.replace(regexp, '');
  return [metadata, contentWithoutFrontMatterBlock];
}

async function handleFile(filePath, config, processors) {
  const relPath = path.relative(config.contentDir, filePath);

  if (isIgnoredFile(path.basename(relPath))) {
    return;
  }

  let outPath = path.join(config.outDir, relPath);
  ensureDir(outPath);

  if (needsProcessing(relPath, processors)) {
    const rawContent = fs.readFileSync(filePath, 'utf8');
    const [metadata, content] = readMetadata(rawContent);
    processFile(content, processors, outPath, relPath, {meta: metadata});
    return;
  }

  // Simply copy the file
  process.stdout.write(`💾 Copy ${relPath} => ${outPath}`);
  fs.copyFileSync(filePath, outPath);
  console.log(' ✅ ');
}

export async function buildAll(config) {
  fs.rmSync(config.outDir, {recursive: true, force: true});
  const processors = await createProcessors(config);
  console.log('');

  const fileProcessings = [];
  for (const file of walk(config.contentDir)) {
    fileProcessings.push(handleFile(file, config, processors));
  }
  await Promise.all(fileProcessings);
}
