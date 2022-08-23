const rulers = require('./rules')
let config  = require('./config')

module.exports = (md, options) => {
  // update the configuration
  Object.assign(config, {
    ...config,
    ...options,
  });
  // register
  for(let i in rulers) {
    rulers[i].register();
  }
};