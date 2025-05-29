/**
 * @typedef {{filename: Filename, dateISO: DateISO, prettyUrlPath: UrlPath}} LastModifiedStats
 * @typedef {{numFiles: number, numFilesNeedProcessing: number, numFilesWithFrontmatter: number, numExtensions: object}} FilesStats
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

/**
 * @param files {FilesMap}
 * @return {FilesStats}
 */
const filesStats = (files) => {
  let numFilesWithFrontmatter = 0;
  let numFilesNeedProcessing = 0;
  const numExtensions = {};
  for (const [_, data] of files) {
    if (data._file.hasFrontmatterBlock) {
      numFilesWithFrontmatter++;
    }
    if (data._file.needsProcessing) {
      numFilesNeedProcessing++;
    }
    const extension = '.' + data._file.relativeFilePath.split('.').slice(1).join('.');
    extension in numExtensions ? numExtensions[extension]++ : numExtensions[extension] = 1;
  }
  return {
    numFiles: files.size,
    numFilesWithFrontmatter,
    numFilesNeedProcessing,
    numExtensions,
  }
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
