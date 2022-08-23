const utils = require('../utils')
const config = require('../config')
const rulers = require('../rules')

const helper = (src, filePaths, importRe) => {

  for(let cap; cap = importRe.exec(src), cap;) {
    let args = utils.parseArgs(cap[1], filePaths.at(-1));
    // check if there is a loop
    filePaths.push(args.filePath);
    if(filePaths.indexOf(args.filePath) != filePaths.length - 1) {
      throw new Error(`Markdown-it-import: Circular inclusion: ${filePaths.map(s => `'${s}'`).join(' -> ')}`);
    }
    // inclusion process
    let replaceSrc = cap[0];
    if(args.type == 'markdown') {
      // check file status
      if(!(replaceSrc = utils.readFile(args.filePath))) {
        throw new Error(`Markdown-it-import: Unreadable file '${args.filePath}'`);
      }
      replaceSrc = helper(replaceSrc, filePaths, importRe);
    } else if(!rulers[args.type]) {
      throw new Error(`Markdown-it-import: There is no ruler ${args.type}`);
    }
    src = src.slice(0, cap.index) + replaceSrc + src.slice(cap.index + cap[0].length, src.length);
  }
  return src;
};

const main = (state, startLine, endLine, slient) => {
  let entryFile = config.entryFile;
  if(state.env.filePath) {
    // settings for vuepress
    entryFile = state.env.filePath;
    if(!config.rootPath) {
      config.rootPath = entryFile.slice(0, entryFile.length - state.env.filePathRelative.length);
    }
  }

  state.src = helper(state.src, [entryFile], config.importRe);
};

const name = 'markdown'
module.exports.name = name;
module.exports.register = () => {
  config.md.core.ruler.before('normalize', `import_${name}`, main);
}
module.exports.main = main;
