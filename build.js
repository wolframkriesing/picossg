import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import MarkdownIt from 'markdown-it';

const srcDir = 'src';
const outDir = 'dist';
const includesDir = '_includes';
const md = new MarkdownIt();

const env = nunjucks.configure(path.join(srcDir, includesDir), {autoescape: false});

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
      yield * walk(res);
    } else {
      yield res;
    }
  }
}

// Transform and build the site
function transform(filePath) {
  const relPath = path.relative(srcDir, filePath);
  if (relPath.includes(includesDir)) {
    return;
  } // Skip components themselves

  const outPath = path.join(outDir, relPath
    .replace(/\.md\.njk\.html$/, '.html')
    .replace(/\.njk\.html$/, '.html')
    .replace(/\.md\.html$/, '.html')
  );

  ensureDirSync(path.dirname(outPath));
  let content = fs.readFileSync(filePath, 'utf8');

  // Process Markdown + Nunjucks chained files
  if (filePath.endsWith('.md.njk.html')) {
    content = env.renderString(content);
    content = md.render(content);
  } else if (filePath.endsWith('.md.html')) {
    content = md.render(content);
  } else if (filePath.endsWith('.njk.html')) {
    content = env.renderString(content);
  }

  fs.writeFileSync(outPath, content);
  console.log('✔ Built', relPath);
}

// Main build function
function buildAll() {
  fs.rmSync(outDir, {recursive: true, force: true});
  for (const file of walk(srcDir)) transform(file);
}

buildAll();