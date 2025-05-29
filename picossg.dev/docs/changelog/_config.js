import path from "path";
import fs from "fs";
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const relativePathToChangelog = '../../../CHANGELOG.md';

const addChangelogFile = (files) => {
  const absoluteFilePath = path.join(__dirname, relativePathToChangelog);
  const content = fs.readFileSync(absoluteFilePath, 'utf8');

  const file = files.get('docs/changelog/index.html.md');
  file._file.content = content;
  file.content = content;
};

export {addChangelogFile};
