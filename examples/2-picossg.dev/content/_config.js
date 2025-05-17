import path from 'path';
import fs from 'fs';

const join = path.join;

const buildNav = files => {
  const pages = new Map([
    ['Getting Started', ['docs/', 'docs/install', 'docs/create-site']],
    // ['Concepts', ['docs/file-mapping', 'docs/markdown', 'docs/frontmatter', 'docs/templates']],
    // ['Advanced', ['docs/components', 'docs/custom-filters', 'docs/diagrams']],
  ]);
  
  const nav = new Map();
  pages.keys().toArray().forEach(title => nav.set(title, []));
  
  for (const [title, pagePaths] of pages) {
    for (const path of pagePaths) {
      for (const [filename, data] of files) {
        if (filename.startsWith(join(path, 'index.html'))) {
          nav.get(title).push(data);
        }
      }
    }
  }
  for (const [_, data] of files) {
    data.nav = nav;
  }
};

const collectSrcStats = () => {
  // count the number of files in 'src' and count the number of lines of code in total in that directory
  const statsDir = path.resolve(process.cwd() + '../../../src');
  const files = fs.readdirSync(statsDir);
  const numFiles = files.length;
  const numLoc = files.map(file => fs.readFileSync(path.join(statsDir, file), 'utf8').split('\n').length);
  return {
    numFiles,
    numLoc: numLoc.reduce((a, b) => a + b, 0),
  }
}

const addFirstLevelHeadlines = files => {
  for (const [_, data] of files) {
    if (data._output.relativeFilePath.startsWith('docs/')) {
      const lines = data.content.match(/^## .*/gm);
      data.firstLevelHeadlines = lines.map(s => s.replace(/^## /, ''));
    }
  }  
}

const preprocess = (files) => {
  buildNav(files);
  const srcStats = collectSrcStats();
  addFirstLevelHeadlines(files);
  
  for (const [_, data] of files) {
    data.srcStats = srcStats;
    data._site = {
      abstract: 'PicoSSG is a minimal static site generator built on the philosophy of simplicity and predictability.',
      summaryImage: '/og-image.webp',
    }
  }  
}

export {preprocess}
