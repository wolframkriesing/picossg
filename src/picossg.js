import path from "path";

const filenameToUrlPaths = (filenameIn, processors) => {
  let filenameOut = '/' + filenameIn;
  while (processors.has(path.extname(filenameOut))) { // process all known extensions
    const ext = path.extname(filenameOut);
    filenameOut = filenameOut.slice(0, -ext.length);
  }
  return {
    rawUrlPath: filenameOut, 
    prettyUrlPath: filenameOut.endsWith('/index.html') ? filenameOut.replace(/index\.html$/, '') : filenameOut,
  };
}

export class PicoSsg {
  /**
   * @param metadata {Map<ProcessedFilename, object>}
   * @param processors {ProcessorMap}
   */
  constructor(metadata, processors) {
    this.metadata = metadata;
    this.processors = processors;
  }

  findPages() {
    const pages = [];
    for (const [filename, meta] of this.metadata) {
      pages.push({...meta, filename, ...filenameToUrlPaths(filename, this.processors)});
    }
    return pages;
  }
}
