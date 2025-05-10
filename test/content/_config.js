const preprocess = (filename, ctx) => {
  if (filename === '40-preprocess.txt.njk') {
    return {
      content: 'This is all the content, coming from the preprocessor. And the <<<{{title}}>>>',
      data: {title: 'Hi-jacked'},
    }
  }
  return ctx;
}

export {preprocess};
