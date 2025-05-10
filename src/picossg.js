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
   * @param metadata {Map<Filename, object>}
   * @param processors {ProcessorMap}
   */
  constructor(metadata, processors) {
    this.metadata = metadata;
    this.processors = processors;
  }

  findPages(startsWith='') {
    const pages = [];
    for (const [filename, meta] of this.metadata) {
      if (filename.startsWith(startsWith)) {
        pages.push({...meta, filename, ...filenameToUrlPaths(filename, this.processors)});
      }
    }
    return pages;
  }
}
