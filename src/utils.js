import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import config from './config.js';

const register = (md, ruler) => {
  ruler.register(md);
  config.importRe[ruler.type] = RegExp(config.importReStr.replace('type', ruler.type), 'i');
};

const match = (type, content, currentFilePath) => {
  let cap = config.importRe[type].exec(content);
  if(!cap)
    return null;
  let args = parseArgs(cap[0]);
  if(currentFilePath) {
    args.filePath = resolve(currentFilePath, args.importPath);
  }
  return {
    index: cap.index,
    content: cap[0],
    ...args,
  }
};

const parseArgs = (strArgs) => {
  const getFuncArgs = (...args) => {
    return {
      type: args[0],
      importPath: args[1],
      ...(args[2] || {})
    };
  };
  let args = null;
  try {
    args = eval(strArgs.trim().replace('@import', 'getFuncArgs'));
  } catch(ex) {
    throw new Error(`Markdown-it-import: Error import format '${strArgs}'`);
  }
  return args;
};

const resolve = (currentFilePath, importPath) => {
  // TODO
  let currentDirPath = path.dirname(currentFilePath);
  // user-defined processing
  importPath = config.handleImportPath(importPath);
  // 其实 ./c.md https://baidu.com/a/b/ => https://baidu.com/a/c.md
  if(url.parse(importPath).protocol) {
    // ? + https://google.com/current/a.md = https://google.com/current/a.md
    return importPath;
  } else if(url.parse(currentDirPath).protocol) {
    if(path.isAbsolute(importPath)) {
      // https://google.com/current + /a.md = https://google.com/a.md
      urlObj = url.parse(importPath);
      return `${urlObj.protocol}//${urlObj.auth ? urlObj.auth + '@' : ''}${urlObj.host}` + importPath
    } else {
      // https://google.com/current + ./a.md = https://google.com/current/a.md
      return path.resolve(currentDirPath, importPath);
    }
  } else {
    if(path.isAbsolute(importPath)) {
      // /path/to/root + /a.md = /path/to/root/a.md
      return path.resolve(config.rootPath, importPath);
    } else {
      // /path/to/current + ./a.md = /path/to/current/a.md
      return path.resolve(currentDirPath, importPath);
    }
  }
}

const transclude = (content, {lines, fragment, regex}) => {
  if(!lines && !fragment && !regex) {
    return content;
  }
  let contentLines = content.split('\n');
  // lines
  if(lines) {
    // lines = [1, 2]
    if(lines.length == 2 && typeof line[0] == 'number' && typeof line[1] == 'number') {
      contentLines = contentLines.slice(line[0], line[1] + 1);
    } else {
      // lines = [[1,2], 5, [8,9]]
      let tmp = [];
      for(let index of lines) {
        if(Array.isArray(index)) {
          tmp = tmp.concat(contentLines.slice(index[0], index.at(-1) + 1));
        } else if(typeof index === 'number'){
          tmp.push(contentLines[index - 1]);
        }
      }
      contentLines = tmp;
    }
  }
  // fragment
  if(fragment) {
    let frageLines = [], tmp = [];
    for(let i in ret) {
      if(contentLines[i] == fragment) {
        frageLines.push(i);
      }
    }
    for(let i = 1; i < frageLines.length; i += 2) {
      tmp = tmp.concat(contentLines.slice(frageLines[i - 1] + 1, frageLines[i]));
    }
    contentLines = tmp;
  }
  if(regex) {
    content = content.filter(line => regex.test(line));
  }
  return contentLines.join('\n');
}

const readFile = (args) => {
  let content;
  if(url.parse(args.filePath).protocol) {
    // TODO
    throw new Error('Markdown-it-import: unfished');
    return null;
  } else if(fs.existsSync(args.filePath)) {
    content = fs.readFileSync(args.filePath, 'utf8');
  } else {
    throw new Error(`Markdown-it-import: Error path '${args.filePath}'`);
    return null;
  }
  return transclude(content, args);
};

const getCurrentFilePath = ({filePath, filePathRelative}) => {
  if(filePath && !config.rootPath) {
    // settings for vuepress
    config.rootPath = filePath.slice(0, filePath.length - filePathRelative.length);
    console.log('log rootPath', config.rootPath);
  }
  return filePath || config.entryFile;
}

const extname = path.extname;

export {
  register,
  match,
  resolve,
  extname,
  readFile,
  getCurrentFilePath,
};