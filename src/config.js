export default {
  rootPath: null,
  entryFile: null,
  importRe: {},
  importReStr: /@import\(\s*('|"|`)type\1\s*,\s*('|"|`)(.*)\2\s*,?\s*(\{.*\})?\s*\)/.toString().slice(1, -1),
  handleImportPath: (str) => str,
  md: null,
}
