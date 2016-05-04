module.exports = function() {
  'use strict';

  var client = './src/client/';
  var clientPlugin = client + 'plugin/';
  var clientApp = client + 'app/';
  var server = './src/server/';
  var report = './report/';
  var root = './';
  var specRunnerFile = 'specs.html';
  var temp = './.tmp/';
  var wiredep = require('wiredep');
  var bowerFiles = wiredep({devDependencies: true})['js'];
  var bower = {
    json: require('./bower.json'),
    directory: './bower_components/',
    ignorePath: '../..'
  };
  var nodeModules = 'node_modules';
  var pluginLess = clientPlugin + 'styles/**/*.less';
  var pluginName = 'inline-toggle-menu';

  var config = {
    /* FILE PATHS */
    // all javascript that we want to vet
    alljs: [
      './src/**/*.js',
      './*.js'
    ],
    build: './dist/',
    client: client,
    css: temp + 'styles.css',
    fonts: bower.directory + 'font-awesome/fonts/**/*.*',
    html: client + '**/*.html',
    htmlTemplates: clientApp + '**/*.html',
    images: client + 'images/**/*.*',
    index: client + 'index.html',
    // all js with no spec files
    js: [
      clientApp + '**/*.js',
      clientPlugin + '**/*.js',
      '!' + clientApp + '**/*.spec.js',
      '!' + clientPlugin + '**/*.spec.js'
    ],
    jsOrder: [
      '**/*.js'
    ],
    less: [client + 'styles/**/*.less', pluginLess],
    pluginLess: pluginLess,
    pluginName: pluginName,
    report: report,
    root: root,
    server: server,
    source: 'src/',
    temp: temp,
    /* End Paths */

    /* Browser Sync */
    browserReloadDelay: 1000,

    /* Bower and NPM Files */
    bower: bower,
    packages: [
      './package.json',
      './bower.json'
    ],

    /* Plugin Info */
    pluginSrcCode: [
      clientPlugin + '**/*.js',
      '!' + clientPlugin + '**/*.spec.js'
    ],

    /* Spec Files */
    specRunner: client + specRunnerFile,
    specRunnerFile: specRunnerFile,

    /* Spec Injections */
    testlibraries: [
      nodeModules + '/mocha/mocha.js',
      nodeModules + '/chai/chai.js',
      nodeModules + '/sinon-chai/lib/sinon-chai.js'
    ],
    specHelpers: [client + 'test-helpers/*.js'],
    specs: [clientPlugin + '**/*.spec.js'],
    serverIntegrationSpecs: [client + '/tests/server-integration/**/*.spec.js'],

    /* Node Settings */
    nodeServer: server + 'app.js',
    defaultPort: '8001'
  };

  /* Config Functions */
  /**
   * Wiredep and Bower Settings.
   * @return {PlainObject} the default options for wiredep injection with bower.
   */
  config.getWiredepDefaultOptions = function() {
    return {
      bowerJson: config.bower.json,
      directory: config.bower.directory,
      ignorePath: config.bower.ignorePath
    };
  };

  /**
   * Karma Settings
   */
  config.karma = getKarmaOptions();

  return config;
  ////////////////////////

  function getKarmaOptions() {
    var options = {
      files: [].concat(
        bowerFiles,
        config.specHelpers,
        clientApp + '**/*.js',
        clientPlugin + '**/*.js'
      ),
      exclude: [],
      coverage: {
        dir: report + 'coverage',
        reporters: [
          // reporters not supporting the `file` property
          { type: 'html', subdir: 'report-html' },
          { type: 'lcov', subdir: 'report-lcov' },
          { type: 'text-summary' } //, subdir: '.', file: 'text-summary.txt'}
        ]
      },
      preprocessors: {}
    };
    options.preprocessors[client + '**/!(*.spec)+(.js)'] = ['coverage'];
    return options;
  }
};
