import {loadModule} from '../../src/build.js';
import path from "path";

/**
 * Collect all relative paths that are in `files`.
 * Do also return the implict dirs, those that have no entry in `files` but are a parent dir without a processed
 * file, those might also contain a `_config.js` file.
 * E.g. if `files` contains `one/two/file.txt.njk`, then the implicit dirs is `one`.
 */
function collectAllRelativePaths(files) {
  const dirsInFiles = new Set();
  for (const [relativeFilename, _] of files) {
    dirsInFiles.add(path.dirname(relativeFilename));
  }
  // Remove the root directory if it exists, the "normal" _config.js file is in the root directory, that is processed by picossg, so do not load it here.
  dirsInFiles.delete('.');
  
  const allDirs = new Set();
  for (const dir of dirsInFiles) {
    let builtDir = [];
    dir.split(path.sep).map((subDir) => {
      builtDir.push(subDir);
      allDirs.add(path.join(...builtDir));
    });
  }
  return allDirs;
}

const loadDataFromConfigs = async (files, config) => {
  const allRelativePaths = collectAllRelativePaths(files);
  
  // Load the esm module from (<dir>/_config.js) for each directory in `allRelativePaths`
  const modules = new Map();
  for (const relativePath of allRelativePaths) {
    const absFilePath = path.resolve(config.contentDir, relativePath, '_config.js');
    try {
      const module = await loadModule(absFilePath, 'config-in-dir');
      modules.set(relativePath, module?.data);
    } catch {
      // nothing to do here, loadModule() already produced an output
    }
  }
  
  // Merge the data of parent dirs into the data of child dirs.
  // e.g. data in `one/two/three` will contain all data from `one` and `one/two` as well.
  // merged bottom up, so `one/two/three` is merged onto `one/two`, which is merged onto `one`.
  for (const [relativePath, data] of modules) {
    const parts = relativePath.split(path.sep);
    let parentPath = '';
    let mergedData = {};
    for (let i = 0; i < parts.length - 1; i++) {
      parentPath = path.join(parentPath, parts[i]);
      mergedData = {...mergedData, ...modules.get(parentPath)};
    }
    modules.set(relativePath, {...mergedData, ...data});
  }
  
  // Provide `_data` in all the files that have data in `modules`.
  for (const [filename, file] of files) {
    const relativePath = path.dirname(filename);
    if (modules.has(relativePath)) {
      file._data = modules.get(relativePath);
    } else {
      file._data = {};
    }
  }
};

export {loadDataFromConfigs};
