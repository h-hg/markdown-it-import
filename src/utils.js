import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import * as child_process from 'child_process';
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
  let currentDirPath = path.dirname(currentFilePath);
  // user-defined processing
  importPath = config.handleImportPath(importPath);
  if(url.parse(importPath).protocol) {
    /**
     * importPath: https://google.com/current/a.md
     * filePath  : https://google.com/current/a.md
     */
    return importPath;
  } else if(url.parse(currentDirPath).protocol) {
    if(path.isAbsolute(importPath)) {
      /**
       * currentDirPath: http://example.com/path/to/dir
       * importPath    : /file.ext
       * filePath      : http://example.com/file.ext
       */
      urlObj = url.parse(importPath);
      return `${urlObj.protocol}//${urlObj.auth ? urlObj.auth + '@' : ''}${urlObj.host}` + importPath
    } else {
      /**
       * currentDirPath: http://example.com/path/to/dir
       * importPath    : ./file.ext
       * filePath      : http://example.com/path/to/dir/file.ext
       */
      return path.resolve(currentDirPath, importPath);
    }
  } else {
    if(path.isAbsolute(importPath)) {
      /**
       * currentDirPath : /path/to/root/path/to/current
       * rootPath:      : /path/to/root
       * importPath     : /file.ext
       * filePaht       : /path/to/root/file.ext
       */
      return path.resolve(config.rootPath, importPath);
    } else {
      /**
       * currentDirPath : /path/to/root/path/to/current
       * rootPath:      : /path/to/root
       * importPath     : ./file.ext
       * filePaht       : /path/to/root/path/to/current/file.ext
       */
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
    if(lines.length == 2 && typeof line[0] == 'number' && typeof line[1] == 'number') {
      // example: lines = [1, 5]
      contentLines = contentLines.slice(line[0], line[1] + 1);
    } else {
      // example: lines = [[1,3], 5, [8,10]]
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

const downliadFileSync = (url) => {
  // reference: https://www.npmjs.com/package/download-file-sync
  return child_process.execFileSync('curl', ['--silent', '-L', url], {encoding: 'utf8'});
};

const readFile = (args) => {
  let content;
  if(url.parse(args.filePath).protocol) {
    content = downliadFileSync(args.filePath);
  } else if(fs.existsSync(args.filePath)) {
    content = fs.readFileSync(args.filePath, 'utf8');
  } else {
    throw new Error(`Markdown-it-import: Error path '${args.filePath}'`);
  }
  return transclude(content, args);
};

const getCurrentFilePath = ({filePath, filePathRelative}) => {
  if(filePath && !config.rootPath) {
    // settings for vuepress
    config.rootPath = filePath.slice(0, filePath.length - filePathRelative.length);
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