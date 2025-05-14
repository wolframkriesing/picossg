const filters = (njk) => {
  njk.addFilter('slug', (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
}

export default filters;
