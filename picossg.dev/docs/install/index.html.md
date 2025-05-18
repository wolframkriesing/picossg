---
layout: docs/_base.njk
title: Installation
---

# Installation Guide

Getting started with PicoSSG is quick and easy. This guide will walk you through the installation 
process and set you up to create your first static site.

## Prerequisites

Before installing PicoSSG, you'll need:

- **Node.js**: Version 23.x or higher (maybe older ones work too), download it from [nodejs.org](https://nodejs.org/)
- **npm**: Usually comes with Node.js installation

You can verify you have the right versions installed by running:

```bash-allow2copy
node --version; npm --version
```

## Installation Methods

There are two main ways to use PicoSSG:

### 1. Use with npx (Recommended for Quick Setup)

The simplest way to use PicoSSG without installing it globally is with `npx`, which comes with npm:

```bash-allow2copy
npx @wolframkriesing/picossg -c content -o output
```

This command runs PicoSSG, processing files from the `content` directory into the `output` directory.
Running the command will maybe hopefully create detailed output like this:
```bash
> npx @wolframkriesing/picossg -c content -o output

🎬 Building with config: {
    "contentDir": "content",
    "outDir": "output",
    "configFile": "_config.js"
}
✅  Loaded _config.js from:
    /xxxxx/content/_config.js
    1 user-defined njk filters loaded: slug

💾 Copy style.css => output/style.css ✅ 
⏭️ Preprocessing done.
⚙️ Process index.html.md.njk, 3.72 kB, .njk👍🏾.md👍🏾 layout: _base.njk👍🏾
⚙️ Process components/index.html.md, 8.05 kB, .md👍🏾 layout: _base.njk👍🏾
⚙️ Process custom-filters/index.html.md, 5.99 kB, .md👍🏾 layout: _base.njk👍🏾
⚙️ Process diagrams/index.html.md, 5.46 kB, .md👍🏾 layout: _base.njk👍🏾
⚙️ Process file-mapping/index.html.md, 4.00 kB, .md👍🏾 layout: _base.njk👍🏾
✅  index.html.md.njk => index.html 9.00 kB
✅  components/index.html.md => components/index.html 15.05 kB
✅  custom-filters/index.html.md => custom-filters/index.html 11.31 kB
✅  diagrams/index.html.md => diagrams/index.html 10.10 kB
✅  file-mapping/index.html.md => file-mapping/index.html 9.38 kB

⏱️ Processed 5 files in 0.04 seconds.
```

### 2. Project-Based Installation (Recommended for Projects)

For ongoing projects, it's better to set up PicoSSG as a project dependency:

1. Create a new directory for your project and navigate into it:

```bash
mkdir my-ssg-site
cd my-ssg-site
```

2. Initialize a new npm project (or skip if you already have a `package.json`):

```bash
npm init -y
```

3. Create a basic project structure:

```bash
mkdir content
```

4. Add PicoSSG scripts to your `package.json`:

```json
{
  "name": "my-ssg-site",
  "version": "1.0.0",
  "scripts": {
    "build": "npx @wolframkriesing/picossg -c content -o output",
    "start": "npx http-server output -p 8000",
    "build:watch": "npx nodemon --quiet --legacy-watch --watch content --ext '*' --exec \"bash -c 'npm run build'\""
  }
}
```

With this setup, you can:
- Run `npm run build` to build your site
- Run `npm start` to serve your site on http://localhost:8000
- Run `npm run build:watch` to rebuild your site automatically when files change

## Next Steps

Now that you have PicoSSG installed, you're ready to start building your site:

- Continue to the [Create a Site](/docs/create-site/) guide to build your first site
- Learn about [File Mapping](/docs/file-mapping/) to understand how PicoSSG processes files
- Explore [Templates](/docs/templates/) to take advantage of Nunjucks templating