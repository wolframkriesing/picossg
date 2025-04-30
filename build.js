import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import MarkdownIt from 'markdown-it';

const config = {
  srcDir: 'src',
  outDir: 'dist',
  includesDir: 'components'
};

const md = new MarkdownIt();
const njk = nunjucks.configure(path.join(config.srcDir, config.includesDir), {autoescape: false});

// File processors mapped by extension
const processors = new Map([
  ['.njk', (content) => njk.renderString(content)],
  ['.md', (content) => md.render(content)]
]);

// Helper functions
function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true});
  }
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const res = path.resolve(dir, entry.name);
    yield* entry.isDirectory() ? walk(res) : [res];
  }
}

function needsProcessing(relPath) {
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

function handleFile(filePath) {
  const relPath = path.relative(config.srcDir, filePath);

  // Skip files/directories starting with underscore
  if (path.basename(relPath).startsWith('_')) {
    return;
  }

  let outPath = path.join(config.outDir, relPath);
  ensureDir(outPath);

  if (needsProcessing(relPath)) {
    let content = fs.readFileSync(filePath, 'utf8');
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
    return;
  }

  // Simply copy the file
  fs.copyFileSync(filePath, outPath);
  console.log('💾 Copied', `${relPath} => ${outPath}`);
}

function buildAll() {
  fs.rmSync(config.outDir, {recursive: true, force: true});
  for (const file of walk(config.srcDir)) handleFile(file);
}

buildAll();
