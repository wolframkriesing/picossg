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
  ['.njk.md', (content) => md.render(njk.renderString(content))],
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

function getOutputPath(relPath) {
  for (const [ext] of processors) {
    if (relPath.endsWith(ext)) {
      return path.join(config.outDir, relPath.split(ext)[0] + '.html');
    }
  }
  return path.join(config.outDir, relPath);
}

function needsProcessing(relPath) {
  for (const ext of processors.keys()) {
    if (relPath.endsWith(ext)) {
      return true;
    }
  }
  return false;
}

function handleFile(filePath) {
  const relPath = path.relative(config.srcDir, filePath);

  // Skip files/directories starting with underscore
  if (path.basename(relPath).startsWith('_')) {
    return;
  }

  const outPath = getOutputPath(relPath);
  ensureDir(outPath);

  if (needsProcessing(relPath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const [ext, processor] of processors) {
      if (relPath.endsWith(ext)) {
        fs.writeFileSync(outPath, processor(content));
        console.log('⚙️ Built', `${relPath} => ${outPath}`);
        return;
      }
    }
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
