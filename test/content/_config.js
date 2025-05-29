import {loadDataFromConfigs} from '../../src/plugins/configs.js'
import {addStatsProperty} from "../../src/plugins/stats.js";

const preprocess = async (files, config) => {
  await loadDataFromConfigs(files, config);
  addStatsProperty(files);

  const file40 = files.get('40-preprocess.txt.njk');
  file40.content = 'This is all the content, coming from the preprocessor. And the <<<{{title}}>>>';
  file40.title = 'Hi-jacked';

  const file42 = files.get('42-config-param.txt.njk');
  file42.config = config;
}

const postprocess = (files) => {
  const file50 = files.get('41-postprocess.txt.njk');
  file50.content = file50.content.split('\n').filter((line) => line.trim().length > 0).join('\n');
};

const configure = ({njk}) => {
  njk.addFilter('filterWithJustOneOutput', () => 'This is from the filter with just 1 output');
}


export {preprocess, postprocess, configure};
