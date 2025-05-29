import {fileURLToPath} from 'url';
import path, {dirname} from 'path';
import fs from 'fs';
import packageJson from '../package.json' with {type: 'json'};
import {addChangelogFile} from "./docs/changelog/_config.js";
import * as docs from "./docs/_config.js";
import {addStatsProperty} from "../src/plugins/stats.js";

const toSlug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const __dirname = dirname(fileURLToPath(import.meta.url));

const SRC_DIR = path.resolve(path.join(__dirname, '../src'));

const picoSsgVersion = packageJson.version;

const collectSrcStats = () => {
  // count the number of files in 'src' and count the number of lines of code in total in that directory
  const files = fs.readdirSync(SRC_DIR, {withFileTypes: true}).filter(file => file.isFile());
  const numFiles = files.length;
  const numLoc = files
    .map(({name: file}) => fs.readFileSync(path.join(SRC_DIR, file), 'utf8').split('\n').length);
  return {
    numFiles,
    numLoc: numLoc.reduce((a, b) => a + b, 0),
  }
}

const preprocess = async (files, config) => {
  addChangelogFile(files);
  docs.preprocess(files, {toSlug});
  addStatsProperty(files);
  const srcStats = collectSrcStats();

  for (const [_, data] of files) {
    data.srcStats = srcStats;
    data._site = {
      title: 'PicoSSG',
      abstract: 'PicoSSG is a minimal static site generator built on the philosophy of simplicity and predictability.',
      summaryImage: '/og-image.webp',
      picoSsgVersion,
    }
  }
}

const configure = ({njk}) => {
  njk.addFilter('slug', toSlug);
  njk.addFilter('readableDateTime', (date) => new Date(date).toLocaleString('en-EN', {
    dateStyle: 'long',
    timeStyle: 'medium',
    hourCycle: 'h24'
  }));
}

export {preprocess, configure}
