# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About PicoSSG

PicoSSG is a minimal static site generator built on the philosophy of simplicity and predictability. It processes Markdown files, Nunjucks templates, or combined files and transforms them into a static website with a 1:1 mapping from source to output.

## Core Commands

### Build and Development

- Build the site: `npm run build`
- Build with watch mode: `npm run build:watch` (watches content AND source code)
- Build with dev watch mode: `npm run build:watch:dev` (watches ONLY source code)
- Serve the site: `npm run serve` (runs on http://localhost:8899)

### Testing

- Run tests: `npm test`
- Run tests in watch mode: `npm run test:watch`

The test system compares generated output in the `_output` directory with the expected output in `test/golden-ref`.

## Architecture

### Code Organization

- `src/build-cli.js` - CLI entry point for the PicoSSG tool
- `src/build.js` - Core build process implementation
- `src/picossg.js` - PicoSSG class with utilities for page finding and processing

### Build Process

1. The build process starts by parsing CLI arguments with options for content directory, output directory, and includes directory
2. The system loads custom Nunjucks filters and user functions if available
3. It creates processors for different file extensions (.njk, .md)
4. The system first collects metadata from all content files
5. Then it processes each file based on its extension:
   - Nunjucks templates (.njk) are rendered with the template engine
   - Markdown files (.md) are processed with markdown-it
   - Combined files (e.g., .md.njk) are processed in order from right to left
   - Files with front matter can specify a layout to wrap the content
6. Files are output to the destination directory with processed extensions removed

### Key Concepts

- **1:1 File Mapping**: Each source file maps directly to an output file with the same path
- **Files starting with underscore**: Files starting with `_` are excluded from output but can be used as includes/components
- **Front Matter**: YAML front matter blocks can specify metadata and layouts
- **Components**: Components can be included from the components directory using Nunjucks includes
- **Preprocessing**: User-defined functions can preprocess content before rendering

## Extension Points

1. **Custom Nunjucks Filters**:
   - Export a default function that receives the Nunjucks environment

2. **User Functions**:
   - Create `_config.js` in the content directory
   - Export a `preprocess` and/or `postprocess` function that can transform content and data before/after processing
   - Configure nunjucks by providing `configureNjk` which receives `njk` as parameter

## Roadmap (from CHANGELOG)

The project is moving toward v3.0.0 with plans to:
- Allow preprocessing and postprocessing functions that receive ALL files
- Support page minification 
- Restructure tests

## Coding Guidelines

- Always use descriptive variable names
- Try to write the most minimal code, not smartest and shortest but the least code needed to fulfill something, and also just fulfill that not a tiny bit more!