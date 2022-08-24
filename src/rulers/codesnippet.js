import * as utils from '../utils.js';

const main = (state, startLine, endLine, slient) => {
  // if it's indented more than 3 spaces, it should be a code block
  /* istanbul ignore if */
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  const pos = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.skipSpacesBack(state.eMarks[startLine], pos);
  const line = state.src.slice(pos, max);

  const args = utils.match('code', line, utils.getCurrentFilePath(state.env));
  if(!args || args.index != 0 || args.content != line) {
    return false;
  }
  if(slient) {
    return true;
  }
  const token = state.push('fence', 'code', 0);
  token.info = args.lang || utils.extname(args.filePath).slice(1);
  token.content = utils.readFile(args);
  token.markup = '```';
  token.map = [startLine, startLine + 1];
  // process the next line
  state.line = startLine + 1;
  return true;
};

module.exports.type = 'code';
module.exports.register = (md) => {
  md.block.ruler.before('fence', `import_codesnippet`, main);
}