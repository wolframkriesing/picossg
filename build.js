import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import MarkdownIt from 'markdown-it';

function createProcessors(config) {
  const njk = nunjucks.configure(path.join(config.contentDir, config.includesDir), {autoescape: false});
  const md = new MarkdownIt();

  return new Map([
    ['.njk', (content) => njk.renderString(content)],
    ['.md', (content) => md.render(content)]
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

const toSize = (size) => {
  const number = size / 1024;
  if (number < 1) {
    return `${size} Bytes`;
  }
  return number.toFixed(2) + ' kB';
};

function processFile(content, processors, outPath, relPath) {
  const initialSize = toSize(content.length);
  const processed = [];
  while (processors.has(path.extname(outPath))) { // process all known extensions
    const ext = path.extname(outPath);
    const processor = processors.get(ext);
    content = processor(content);
    outPath = outPath.slice(0, -ext.length);
    processed.push(ext);
  }
  fs.writeFileSync(outPath, content);
  console.log(`⚙️ Processed (${processed.join(' ')}) ${relPath} (${initialSize}) => ${outPath} (${toSize(content.length)})`);
}

function handleFile(filePath, config, processors) {
  const relPath = path.relative(config.contentDir, filePath);

  // Skip files/directories starting with underscore
  if (path.basename(relPath).startsWith('_')) {
    return;
  }

  let outPath = path.join(config.outDir, relPath);
  ensureDir(outPath);

  if (needsProcessing(relPath, processors)) {
    const content = fs.readFileSync(filePath, 'utf8');
    processFile(content, processors, outPath, relPath);
    return;
  }

  // Simply copy the file
  fs.copyFileSync(filePath, outPath);
  console.log('💾 Copied', `${relPath} => ${outPath}`);
}

export function buildAll(config) {
  fs.rmSync(config.outDir, {recursive: true, force: true});
  const processors = await createProcessors(config);
  console.log('');
  for (const file of walk(config.contentDir)) handleFile(file, config, processors);
}
