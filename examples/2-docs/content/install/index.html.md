---
layout: _base.njk
title: Installation
category: Getting Started
---

# Installation Guide

Getting started with PicoSSG is quick and easy. This guide will walk you through the installation process and set you up to create your first static site.

## Prerequisites

Before installing PicoSSG, you'll need:

- **Node.js**: Version 14.x or higher (download from [nodejs.org](https://nodejs.org/))
- **npm**: Usually comes with Node.js installation

You can verify you have the right versions installed by running:

```bash
node --version
npm --version
```

## Installation Methods

There are two main ways to use PicoSSG:

### 1. Use with npx (Recommended for First-Time Users)

The simplest way to use PicoSSG without installing it globally is with `npx`, which comes with npm:

```bash
npx @wolframkriesing/picossg -c content -o output
```

This command runs PicoSSG, processing files from the `content` directory into the `output` directory.

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
mkdir content output
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

## Command Line Options

PicoSSG supports the following command line options:

| Option | Short | Description |
|--------|-------|-------------|
| `--content` | `-c` | Source directory (required) |
| `--out` | `-o` | Output directory (required) |
| `--config` | `-x` | Config file name (default: `_config.js`) |
| `--help` | `-h` | Show help message |

Example usage:

```bash
npx @wolframkriesing/picossg -c content -o output -x custom-config.js
```

## Next Steps

Now that you have PicoSSG installed, you're ready to start building your site:

- Continue to the [Quick Start Guide](/quick-start/) to build your first site
- Learn about [File Mapping](/file-mapping/) to understand how PicoSSG processes files
- Explore [Templates](/templates/) to take advantage of Nunjucks templating