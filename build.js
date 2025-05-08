import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import MarkdownIt from 'markdown-it';

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

  const njk = nunjucks.configure(path.join(config.contentDir, config.includesDir), {autoescape: false});
  njk.addFilter('md', (s) => md.render(s));
  njk.addFilter('mdinline', (s) => md.renderInline(s));
  const coreFilters = Object.keys(njk.filters);
  await loadNjkCustomStuff(config, njk);
  const newFilters = Object.keys(njk.filters).filter((f) => !coreFilters.includes(f));
  console.log(`${newFilters.length} custom njk filters loaded: ${newFilters.join(', ')}`);

  return new Map([
    ['.njk', (content, meta) => njk.renderString(content, {meta})],
    ['.md', (content, meta) => md.render(content, {meta})]
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
    if (relPath.endsWith(ext)) {
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

function processFile(content, processors, outPath, relPath, metadata) {
  const initialSize = toSize(content.length);
  const processed = [];
  process.stdout.write(`⚙️ Process ${relPath} (${initialSize}) ... `);
  while (processors.has(path.extname(outPath))) { // process all known extensions
    const ext = path.extname(outPath);
    const processor = processors.get(ext);
    content = processor(content, metadata);
    outPath = outPath.slice(0, -ext.length);
    processed.push(ext);
  }
  fs.writeFileSync(outPath, content);
  console.log(`=> ${outPath} (${toSize(content.length)}) – (${processed.join(' ')}) ✅ `);
}

async function readMetadata(filePath) {
  return {};
}

async function handleFile(filePath, config, processors) {
  const relPath = path.relative(config.contentDir, filePath);

  if (isIgnoredFile(path.basename(relPath))) {
    return;
  }
  const metadata = await readMetadata(filePath);

  let outPath = path.join(config.outDir, relPath);
  ensureDir(outPath);

  if (needsProcessing(relPath, processors)) {
    const content = fs.readFileSync(filePath, 'utf8');
    processFile(content, processors, outPath, relPath, metadata);
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
