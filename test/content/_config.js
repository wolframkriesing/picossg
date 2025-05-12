const findPages = (files, startsWith = '') => {
  const filtered = new Map();
  for (const [key, value] of files) {
    if (key.startsWith(startsWith)) {
      filtered.set(key, value);
    }
  }
  return filtered;
}

const preprocess = (files) => {
  const file40 = files.get('40-preprocess.txt.njk');
  file40.content = 'This is all the content, coming from the preprocessor. And the <<<{{title}}>>>';
  file40.title = 'Hi-jacked';

  const file50 = files.get('50-picossg-findPages.txt.njk');
  file50.allPagesStartingWith2 = findPages(files, '2');
}

export {preprocess};
