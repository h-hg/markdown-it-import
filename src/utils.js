const fs     = require('fs');
const path   = require('path')
const url    = require('url')
const config = require('./config')

const parseArgs = (strArgs, currentFilePath) => {
  let args;
  try {
    args = JSON.parse(/\{.*\}/.test(strArgs) ? strArgs : '{' + strArgs + '}');
  } catch(ex) {
    // example: import(/a.md)
    args = {
      type: 'markdown',
      path: strArgs
    }
  }
  // check argument
  if(!args.type) {
    // example: import("path": "/a.md")
    args.type = 'markdown';
  }
  if(!args.path) {
    // example
    throw new Error(`Markdown-it-import: There is no path argument in import(${strArgs})`);
  }
  // add abstract path for file
  args.filePath = parsePath(args.path, dirname(currentFilePath));

  return args;
};

const dirname = (filePath) => {
  return path.dirname(filePath);
};

const parsePath = (filePath, currentDirPath) => {
  // 其实 ./c.md https://baidu.com/a/b/ => https://baidu.com/a/c.md
  if(url.parse(filePath).protocol) {
    // ? + https://google.com/current/a.md = https://google.com/current/a.md
    return filePath;
  } else if(url.parse(currentDirPath).protocol) {
    if(path.isAbsolute(filePath)) {
      // https://google.com/current + /a.md = https://google.com/a.md
      urlObj = url.parse(filePath);
      return `${urlObj.protocol}//${urlObj.auth ? urlObj.auth + '@' : ''}${urlObj.host}` + filePath
    } else {
      // https://google.com/current + ./a.md = https://google.com/current/a.md
      return path.resolve(currentDirPath, filePath);
    }
  } else {
    if(path.isAbsolute(filePath)) {
      // /path/to/root + /a.md = /path/to/root/a.md
      return path.resolve(config.rootPath, filePath);
    } else {
      // /path/to/current + ./a.md = /path/to/current/a.md
      return path.resolve(currentDirPath, filePath);
    }
  }
}

const readFile = (filePath) => {
  if(url.parse(filePath).protocol) {
    // TODO
    return null;
  } else if(fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  } else {
    return null
  }
  // TODO: transc
};

module.exports.readFile = readFile;
module.exports.parseArgs = parseArgs;
