var _ = require("lodash");

var _configs = {
    global: require(__dirname + '/build_config/global.js'),
    production: require(__dirname + '/build_config/production.js'),
    development: require(__dirname + '/build_config/development.js')
};

var _load = function(environment) {
  // Проверяем окружение
  if (!environment) throw 'Can\'t find local environment variable via process.env.NODE_ENV';
  if (!_configs[environment]) throw 'Can\'t find environments see _config object';

  // load config file by environment
  return _configs && _.merge(
    _configs[environment](__dirname),
    _configs['global'](__dirname)
  );
};

/**
 * Export WebPack config
 * @type {[type]}
 */
module.exports = _load(process.env.NODE_ENV || "development");