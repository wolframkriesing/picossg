#!/usr/bin/env node

import {buildAll} from './build.js';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    contentDir: {paramNames: ['content', 'c']},
    outDir: {paramNames: ['out', 'o']},
    includesDir: {value: 'components', paramNames: ['includes', 'i']},
    configFile: {value: '_config.js', paramNames: ['config', 'x']},
  };

  for (let i = 0; i < args.length; i++) {
    for (const option in options) {
      if (args[i] === `--${option}` || args[i] === `-${options[option].paramNames[1]}`) {
        options[option].value = args[i + 1];
      }
    }
    if (args[i] === '--help' || args[i] === '-h') {
      showHelp();
      process.exit(0);
    }
  }

  const entries = Object.entries(options).map(([k, v]) => [k, v.value])
  ;
  return Object.fromEntries(entries);
}

function showHelp() {
  console.log(`
picossg - A pico static site generator

Usage:
  picossg [options]

Options:
  -c, --content <directory>  Source directory
  -o, --out <directory>      Output directory
  -i, --includes <directory> Includes directory (default: "components")
  -x, --config <filename>    The config.js filename (default: "_config.js")
  -h, --help                 Show this help message
`);
}

const options = parseArgs();
if (!options.contentDir || !options.outDir) {
  console.error('Error: Missing content and/or output dir. Use --help for more information.');
  process.exit(1);
}
console.log(`🎬 Building with config: ${JSON.stringify(options, null, 4)}`);
await buildAll(options);
