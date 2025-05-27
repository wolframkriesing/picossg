import {loadModule} from '../../src/build.js';
import path from "path";

const loadDataFromConfigs = async (files) => {
  const file0 = files.get('config-loading/all-vars-0.txt.njk');
  const pathOnly = path.dirname(file0._file.absoluteFilePath);
  const configFilepath0 = path.join(pathOnly, '_config.js');
  const module0 = await loadModule(configFilepath0, 'config-for-dir');
  file0._data = module0?.data;
  
  const configFilepath1 = path.join(pathOnly, 'level1', '_config.js');
  const module1 = await loadModule(configFilepath1, 'config-for-dir');

  const file1_1 = files.get('config-loading/level1/level1_1/all-vars-1-1.txt.njk');
  const configFilepath1_1 = path.join(path.dirname(file1_1._file.absoluteFilePath), '_config.js');
  const module1_1 = await loadModule(configFilepath1_1, 'config-for-dir');
  file1_1._data = {...module0?.data, ...module1?.data, ...module1_1?.data};
};

export {loadDataFromConfigs};
