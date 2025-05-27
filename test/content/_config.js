import {loadDataFromConfigs} from '../../src/utils/configs.js'

const findPages = (files, startsWith = '') => {
  const filtered = new Map();
  for (const [key, value] of files) {
    if (key.startsWith(startsWith)) {
      filtered.set(key, value);
    }
  }
  return filtered;
}

const preprocess = async (files, config) => {
  await loadDataFromConfigs(files);

  const file40 = files.get('40-preprocess.txt.njk');
  file40.content = 'This is all the content, coming from the preprocessor. And the <<<{{title}}>>>';
  file40.title = 'Hi-jacked';

  const file42 = files.get('42-config-param.txt.njk');
  file42.config = config;

  const file50 = files.get('50-picossg-findPages.txt.njk');
  file50.allPagesStartingWith2 = findPages(files, '2');
}

const postprocess = (files) => {
  const file50 = files.get('41-postprocess.txt.njk');
  file50.content = file50.content.split('\n').filter((line) => line.trim().length > 0).join('\n');
};

const configureNjk = (njkEnv) => {
  njkEnv.addFilter('filterWithJustOneOutput', () => 'This is from the filter with just 1 output');
}


export {preprocess, postprocess, configureNjk};
