import config from './config.js';
import * as utils from './utils.js'

const rulers = [
  require('./rulers/markdown'),
  require('./rulers/codesnippet')
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