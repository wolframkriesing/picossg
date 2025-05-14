const buildNav = files => {
  const nav = new Map([
    ['Getting Started', []],
    ['Concepts', []],
    ['Advanced', []],
  ]);
  for (const [filename, data] of files) {
    if (nav.has(data?.category)) {
      nav.get(data.category).push(data);
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
