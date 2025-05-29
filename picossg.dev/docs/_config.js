import path from "path";

const DOCS_DIR = 'docs/';

const addPropertyNav = (files, {toSlug}) => {
  const pages = new Map([
    ['Getting Started', [
      '.',
      'install',
      'cli',
      'create-site',
    ]],
    ['Concepts', [
      'file-mapping',
      // 'markdown', 
      'frontmatter',
      'templates',
    ]],
    ['Plugins', [
      'plugins',
      'plugins/stats',
    ]],
    ['Advanced', [
      // 'config-js',
      'components',
      'custom-filters',
      // 'diagrams',
    ]],
    ['About', [
      'changelog',
    ]],
  ]);

  const nav = new Map();
  pages.keys().toArray().forEach(title => nav.set(title, {id: toSlug(title), items: []}));

  for (const [title, pagePaths] of pages) {
    for (const pagePath of pagePaths) {
      for (const [filename, data] of files) {
        if (filename.startsWith(path.join(DOCS_DIR, pagePath, 'index.html'))) {
          nav.get(title).items.push(data);
        }
      }
    }
  }
  for (const [_, data] of files) {
    data.nav = nav;
  }
};

const preprocess = (files, {toSlug}) => {
  addPropertyNav(files, {toSlug});
}

export {preprocess};