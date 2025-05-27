The test in this directory are used to verify the functionality of PicoSSG.
- using the `loadDataFromConfigs()` fn works basically?
- data from `_config.js` are loaded from all directories and applied for any depth
- in `level1/level1_1` dir all the `_config.js` files are loaded and merged, where the deepest dir's data
  merge on top of the less deep ones