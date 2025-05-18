---
layout: docs/_base.njk
title: Command Line Options
---

# Command Line Options

PicoSSG supports the following command line options:

| Option | Short | Description |
|--------|-------|-------------|
| `--content` | `-c` | Source directory (required) |
| `--out` | `-o` | Output directory (required) |
| `--config` | `-x` | Config file name (default: `_config.js`) |
| `--help` | `-h` | Show help message |

Example usage:

See all the supported options by running:
```bash-allow2copy
npx @wolframkriesing/picossg --help
```

Run PicoSSG with a custom config file:
```bash-allow2copy
npx @wolframkriesing/picossg -c content -o output -x _custom-config.js
```

