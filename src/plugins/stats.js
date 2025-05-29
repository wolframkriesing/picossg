/**
 * @typedef {{filename: Filename, dateISO: DateISO, prettyUrlPath: UrlPath}} LastModifiedStats
 * @typedef {{numFiles: number, numFolders: number, numFilesWithFrontmatter: number}} FilesStats
 * @typedef {{lastModified: LastModifiedStats}} Stats
 */

/**
 * @param file {FilesValue}
 * @return {Date}
 */
const toDate = (file) => new Date(file[1]._file.lastModifiedISO)

/**
 * @param files {FilesMap}
 * @return {LastModifiedStats}
 */
const lastModifiedStats = files => {
  let latest = files.entries().next().value;
  for (const entry of files) {
    if (toDate(latest) < toDate(entry)) {
      latest = entry;
    }
  }
  return {
    filename: latest[1]._file.relativeFilePath,
    dateISO: latest[1]._file.lastModifiedISO,
    prettyUrlPath: latest[1]._output.prettyUrlPath
  };
};

const filesStats = () => {
  
}

/**
 * @param files {FilesMap}
 */
const addStatsProperty = (files) => {
  // Add the stats to all files.
  for (const [_, data] of files) {
    data._stats = {
      lastModified: lastModifiedStats(files),
      files: filesStats(files),
    };
  }
}

export {addStatsProperty};
