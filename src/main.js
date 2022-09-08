import config from './config.js';
import * as utils from './utils.js'
import * as utils from './utils.js';
import * as rulerMd from './rulers/markdown.js';
import * as rulerCode from './rulers/codesnippet.js';

const rulers = [
  require('./rulers/markdown'),
  require('./rulers/codesnippet')
  rulerMd,
  rulerCode
];

export default function (md, options) {
  // update the configuration
  Object.assign(config, {
    ...config,
    ...options,
    md: md,
  });
  // register
  for(let ruler of rulers) {
    utils.register(md, ruler);
  }
};