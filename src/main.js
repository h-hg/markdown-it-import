const config  = require('./config');
const utils = require('./utils');
const rulers = [
  require('./rulers/markdown'),
  require('./rulers/codesnippet')
];

module.exports = (md, options) => {
  // update the configuration
  Object.assign(config, {
    ...config,
    ...options,
    md: md,
  });
  // register
  for(let ruler of rulers) {
    utils.register(ruler);
  }
};