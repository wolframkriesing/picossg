import {loadModule} from '../../src/build.js';
import path from "path";

const loadDataFromConfigs = async (files) => {
  const file = files.get('utils-config/all-vars.txt.njk');
  const configFilepath = path.join(path.dirname(file._file.absoluteFilePath), '_config.js');
  const module = await loadModule(configFilepath, 'config-for-dir');
  file._data = module?.data;
};

export {loadDataFromConfigs};
