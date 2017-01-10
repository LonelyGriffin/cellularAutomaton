var webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  config.set({
    // конфигурация репортов о покрытии кода тестами
    coverageReporter: {
      dir:'tmp/coverage/',
      reporters: [
        { type:'html', subdir: 'report-html' },
        { type:'lcov', subdir: 'report-lcov' }
      ],
      instrumenterOptions: {
        istanbul: { noCompact:true }
      }
    },

    // spec файлы
    files: [
      'src/**/*.spec.js', 'src/**/*.spec.jsx'
    ],

    frameworks: [ 'chai', 'jasmine' ],

    // репортеры необходимы для  наглядного отображения результатов
    reporters: ['mocha', 'coverage'],

    preprocessors: {
      'src/**/*.spec.js': ['webpack', 'sourcemap'],
      'src/**/*.spec.jsx': ['webpack', 'sourcemap'],
    },

    plugins: [
      'karma-jasmine', 'karma-mocha',
      'karma-chai', 'karma-coverage',
      'karma-webpack', 'karma-phantomjs-launcher',
      'karma-mocha-reporter', 'karma-sourcemap-loader'
    ],

    // передаем конфигурацию webpack
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo:true
    }
  });
};