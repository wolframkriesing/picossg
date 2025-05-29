/**
 * @typedef {{filename: Filename, dateISO: DateISO, prettyUrlPath: UrlPath}} LastModifiedStats
 * @typedef {{lastModified: LastModifiedStats}} Stats
 */

/**
 * @param file {FilesValue}
 * @return {Date}
 */
const toDate = (file) => new Date(file[1]._file.lastModifiedISO)

/**
 * @param files {FilesMap}
 */
const addStatsProperty = (files) => {
  let latest = files.entries().next().value;
  for (const entry of files) {
    if (toDate(latest) < toDate(entry)) {
      latest = entry;
    }
  }
  /** @type {LastModifiedStats} */
  const lastModified = {
    filename: latest[1]._file.relativeFilePath,
    dateISO: latest[1]._file.lastModifiedISO,
    prettyUrlPath: latest[1]._output.prettyUrlPath
  };
  
  // Add the stats to all files.
  for (const [_, data] of files) {
    data._stats = {lastModified};
  }
}

export {addStatsProperty};
