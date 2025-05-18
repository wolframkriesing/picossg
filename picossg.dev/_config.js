import {fileURLToPath} from 'url';
import path, {dirname} from 'path';
import fs from 'fs';
import packageJson from '../package.json' with {type: 'json'};

const __dirname = dirname(fileURLToPath(import.meta.url));

const DOCS_DIR = 'docs/';
const SRC_DIR = path.resolve(path.join(__dirname, '../src'));

const picoSsgVersion = packageJson.version;

const buildNav = files => {
  const pages = new Map([
    ['Getting Started', ['', 'install', 'create-site']],
    // ['Concepts', ['file-mapping', 'markdown', 'frontmatter', 'templates']],
    // ['Advanced', ['components', 'custom-filters', 'diagrams']],
  ]);

  const nav = new Map();
  pages.keys().toArray().forEach(title => nav.set(title, []));

  for (const [title, pagePaths] of pages) {
    for (const pagePath of pagePaths) {
      for (const [filename, data] of files) {
        if (filename.startsWith(path.join(DOCS_DIR, pagePath, 'index.html'))) {
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
  const files = fs.readdirSync(SRC_DIR);
  const numFiles = files.length;
  const numLoc = files.map(file => fs.readFileSync(path.join(SRC_DIR, file), 'utf8').split('\n').length);
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
      title: 'PicoSSG',
      abstract: 'PicoSSG is a minimal static site generator built on the philosophy of simplicity and predictability.',
      summaryImage: '/og-image.webp',
      picoSsgVersion,
    }
  }
}

const configureNjk = (njk) => {
  njk.addFilter('slug', (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  njk.addFilter('readableDateTime', (date) => new Date(date).toLocaleString('en-EN', {
    dateStyle: 'long',
    timeStyle: 'medium',
    hourCycle: 'h24'
  }));
}

export {preprocess, configureNjk}
