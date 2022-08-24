import * as utils from '../utils.js';

const helper = (src, filePaths) => {

  for(let args; args = utils.match('md', src, filePaths.at(-1)), args; ) {
    // check if there is a loop
    filePaths.push(args.filePath);
    if(filePaths.indexOf(args.filePath) != filePaths.length - 1) {
      throw new Error(`Markdown-it-import: Circular inclusion: ${filePaths.map(s => `'${s}'`).join(' -> ')}`);
    }
    // recursive import
    let replaceSrc = utils.readFile(args);
    replaceSrc = helper(replaceSrc, filePaths);
    // combine
    src = src.slice(0, args.index) + replaceSrc + src.slice(args.index + args.content.length, src.length);
    filePaths.pop();
  }
  return src;
};

const main = (state, startLine, endLine, slient) => {
  state.src = helper(state.src, [utils.getCurrentFilePath(state.env)]);
};

module.exports.type = 'md';
module.exports.register = (md) => {
  md.core.ruler.before('normalize', `import_md`, main);
};
