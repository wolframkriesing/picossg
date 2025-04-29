import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import MarkdownIt from 'markdown-it';

const srcDir = 'src';
const outDir = 'dist';
const includesDir = '_includes';
const md = new MarkdownIt();

const njk = nunjucks.configure(path.join(srcDir, includesDir), {autoescape: false});

// Helper to ensure directory exists
function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true});
  }
}

// Walk through directory and yield files
function* walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(res);
    } else {
      yield res;
    }
  }
}

const processors = new Map([
  ['.njk.md', (content) => md.render(njk.renderString(content))],
  ['.njk', (content) => njk.renderString(content)],
  ['.md', (content) => md.render(content)],
])

function processFile(relPath, filePath) {
  let outPath = path.join(outDir, relPath);
  ensureDirSync(path.dirname(outPath));
  let content = fs.readFileSync(filePath, 'utf8');

  for (const [ext, processor] of processors) {
    if (relPath.endsWith(ext)) {
      content = processor(content);
      outPath = outPath.split(ext)[0] + '.html';
      break; // Apply ONLY ONE processor!
    }
  }

  fs.writeFileSync(outPath, content);
  console.log('⚙️ Built', `${relPath} => ${outPath}`);
}

function copyFile(relPath, filePath) {
  const dest = path.join(outDir, relPath);
  ensureDirSync(path.dirname(dest));
  fs.copyFileSync(filePath, dest);
  console.log('💾 Copied', `${relPath} => ${dest}`);
}

function transformFile(filePath) {
  const relPath = path.relative(srcDir, filePath);
  if (relPath.startsWith('_')) {
    return;
  }

  if (processors.has(path.extname(relPath))) {
    processFile(relPath, filePath);
    return;
  }

  copyFile(relPath, filePath);
}

function buildAll() {
  fs.rmSync(outDir, {recursive: true, force: true});
  for (const file of walk(srcDir)) transformFile(file);
}

buildAll();
