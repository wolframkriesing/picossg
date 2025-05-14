---
layout: _base.njk
title: Home
---

# PicoSSG - The Minimal Static Site Generator

PicoSSG is a minimal static site generator built on the philosophy of simplicity and predictability. It processes your Markdown, Nunjucks templates, and static files into a clean, static website with minimal configuration.

## Why Choose PicoSSG?

- **Minimal Magic**: Simple, predictable processing with minimal configuration
- **1:1 File Mapping**: Each source file maps directly to an output file
- **Straightforward Processing**: Markdown (`.md`), Nunjucks templates (`.njk`), or both combined
- **Zero Configuration**: Works out of the box with sensible defaults
- **Flexibility When Needed**: Optional hooks for preprocessing and postprocessing when you need more power

## Key Features

### Simple File Processing

PicoSSG processes:
- Markdown files (`.md`) using [markdown-it](https://markdown-it.github.io/)
- Nunjucks templates (`.njk`) using [nunjucks](https://mozilla.github.io/nunjucks/)
- Combined files (`.md.njk` or `.html.md`) - extensions processed from right to left
- Static assets (copied as-is)

### Predictable Output

One of PicoSSG's most valuable features is its predictable 1:1 mapping from source to output:
- `content/about.md` becomes `output/about.html`
- `content/posts/my-post.html.md` becomes `output/posts/my-post.html`
- `content/css/style.css` is copied directly to `output/css/style.css`

### Minimal "Magic"

The only special behaviors in PicoSSG are:
- Files starting with underscore (`_*`) are excluded from the output
- Template files are processed based on their extensions
- Optional front matter for metadata and layouts

## Getting Started

Ready to start using PicoSSG? Check out:

- [Installation Guide](/install/) - How to install PicoSSG
- [Quick Start Guide](/quick-start/) - Build your first site in minutes

## Philosophy

PicoSSG is built on the belief that a static site generator should be:

1. **Simple to understand**: The codebase should be small and easy to understand
2. **Predictable in operation**: No magic, no surprises
3. **Minimal in configuration**: Works well out of the box
4. **Flexible when needed**: Provides escape hatches for advanced use cases

This philosophy guides every decision in the development of PicoSSG.

## Examples

Looking for inspiration? Check out these sites built with PicoSSG:

- [JSCraftCamp.org site for 2025](https://codeberg.org/wolframkriesing/jscc-site-2025)
- [picostitch.com](https://picostitch.com) - Wolfram Kriesing's blog

## Contribute

PicoSSG is open source and welcomes contributions. Check out the [repository on Codeberg](https://codeberg.org/wolframkriesing/picossg) to contribute.