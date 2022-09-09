import * as utils from '../utils.js';

const helper = (src, filePaths) => {
  for(let ret; ret = utils.match('md', src, filePaths.at(-1)), ret; ) {
    const {index, content, args} = ret;
    // check if there is a loop
    filePaths.push(args.filePath);
    if(filePaths.indexOf(args.filePath) != filePaths.length - 1) {
      throw new Error(`Markdown-it-import: Circular inclusion: ${filePaths.map(s => `'${s}'`).join(' -> ')}`);
    }
    // recursive import
    let replaceSrc = utils.readFile(args);
    if(!args.options.recursive || args.options.recursive != false) {
      replaceSrc = helper(replaceSrc, filePaths);
    }
    // combine
    src = src.slice(0, index) + replaceSrc + src.slice(index + content.length, src.length);
    filePaths.pop();
  }
  return src;
};

const main = (state, startLine, endLine, slient) => {
  state.src = helper(state.src, [utils.getCurrentFilePath(state.env)]);
};

export const type = 'md'
export const register = (md) => {
  md.core.ruler.before('normalize', `import_md`, main);
}
