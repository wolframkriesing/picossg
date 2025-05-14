import {join} from 'path';

const buildNav = files => {
  const pages = new Map([
    ['Getting Started', ['', 'install', 'quick-start']],
    ['Concepts', ['file-mapping', 'frontmatter', 'templates']],
    ['Advanced', ['components', 'custom-filters', 'diagrams']],
  ]);
  
  const nav = new Map();
  pages.keys().toArray().forEach(title => nav.set(title, []));
  
  for (const [filename, data] of files) {
    for (const [title, paths] of pages) {
      for (const path of paths) {
        if (filename.startsWith(join(path, 'index.html'))) {
          nav.get(title).push(data);
        }
      }
    }
  }
  for (const [filename, data] of files) {
    data.nav = nav;
  }
};

const preprocess = (files) => {
  buildNav(files);
}

export {preprocess}
