#!/usr/bin/env node

import {createConfig, buildAll} from './build.js';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    srcDir: {paramNames: ['src', 's']},
    outDir: {paramNames: ['out', 'o']},
    includesDir: {paramNames: ['includes', 'i']},
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

  const entries = Object.entries(options)
    .filter(([_, v]) => v.value !== undefined)
    .map(([k, v]) => [k, v.value])
  ;
  return Object.fromEntries(entries);
}

function showHelp() {
  console.log(`
picossg - A pico static site generator

Usage:
  picossg [options]

Options:
  -s, --src <directory>      Source directory (default: "src")
  -o, --out <directory>      Output directory (default: "dist")
  -i, --includes <directory> Includes directory (default: "components")
  -h, --help                 Show this help message
`);
}

const options = parseArgs();
const config = createConfig(options);
console.log(`Building from '${config.srcDir}' to '${config.outDir}' (includes: '${config.includesDir}')`);
buildAll(config);
