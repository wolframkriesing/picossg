const filters = (njkEnv) => {
  njkEnv.addFilter('filterWithJustOneOutput', () => 'This is from the filter with just 1 output');
}

export default filters;
