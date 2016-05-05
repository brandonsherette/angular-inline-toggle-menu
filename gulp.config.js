module.exports = function() {
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
    htmltemplates: [clientApp + '**/*.html', clientPlugin + '**/*.html'],
    images: client + 'images/**/*.*',
    index: client + 'index.html',
    // app js, with no specs
    js: [
      clientApp + '**/*.module.js',
      clientPlugin + '**/*.module.js',
      clientApp + '**/*.js',
      clientPlugin + '**/*.js',
      '!' + clientApp + '**/*.spec.js',
      '!' + clientPlugin + '**/*.spec.js'
    ],
    jsOrder: [
      '**/app.module.js',
      '**/*.module.js',
      '**/*.js'
    ],
    less: [client + 'styles/**/*.less', pluginLess],
    pluginLess: pluginLess,
    pluginName: pluginName,
    report: report,
    root: root,
    server: server,
    source: 'src/',
    stubsjs: [
      bower.directory + 'angular-mocks/angular-mocks.js',
      client + 'stubs/**/*.js'
    ],
    temp: temp,
    /**
     * optimized files
     */
    optimized: {
      app: 'app.js',
      lib: 'lib.js'
    },
    /**
     * plato
     */
    plato: {js: clientApp + '**/*.js'},
    /**
     * browser sync
     */
    browserReloadDelay: 1000,
    /**
     * template cache
     */
    templateCache: {
      file: 'templates.js',
      options: {
        module: 'inlineToggleMenu',
        root: 'inline-toggle-menu/',
        standalone: false
      }
    },
    /**
     * Bower and NPM files
     */
    bower: bower,
    packages: [
      './package.json',
      './bower.json'
    ],
    /* Plugin Info */
    pluginSrcCode: [
      clientPlugin + '**/*.module.js',
      clientPlugin + '**/*.js',
      '!' + clientPlugin + '**/*.spec.js'
    ],
    /**
     * specs.html, our HTML spec runner
     */
    specRunner: client + specRunnerFile,
    specRunnerFile: specRunnerFile,
    /**
     * E2E
     */
    scenarios: client + '/test/e2e/**/*.spec.js',
    /**
     * The sequence of the injections into specs.html:
     *  1 testlibraries
     *      mocha setup
     *  2 bower
     *  3 js
     *  4 spechelpers
     *  5 specs
     *  6 templates
     */
    testlibraries: [
      nodeModules + '/mocha/mocha.js',
      nodeModules + '/chai/chai.js',
      nodeModules + '/sinon-chai/lib/sinon-chai.js'
    ],
    specHelpers: [client + 'test-helpers/*.js'],
    specs: [clientApp + '**/*.spec.js', clientPlugin + '**/*.spec.js'],
    serverIntegrationSpecs: [client + '/tests/server-integration/**/*.spec.js'],
    /**
     * Node settings
     */
    nodeServer: server + 'app.js',
    defaultPort: '8001'
  };

  /**
   * wiredep and bower settings
   */
  config.getWiredepDefaultOptions = function() {
    var options = {
      bowerJson: config.bower.json,
      directory: config.bower.directory,
      ignorePath: config.bower.ignorePath
    };
    return options;
  };

  config.pluginBuildCode = [].concat(
    config.pluginSrcCode,
    config.temp + config.templateCache.file);

  /**
   * karma settings
   */
  config.karma = getKarmaOptions();

  return config;

  ////////////////

  function getKarmaOptions() {
    var options = {
      files: [].concat(
        bowerFiles,
        config.specHelpers,
        clientApp + '**/*.module.js',
        clientPlugin + '**/*.module.js',
        clientApp + '**/*.js',
        clientPlugin + '**/*.js',
        temp + config.templateCache.file,
        config.serverIntegrationSpecs
        ),
      exclude: [],
      coverage: {
        dir: report + 'coverage',
        reporters: [
          // reporters not supporting the `file` property
          {type: 'html', subdir: 'report-html'},
          {type: 'lcov', subdir: 'report-lcov'},
          {type: 'text-summary'} //, subdir: '.', file: 'text-summary.txt'}
        ]
      },
      preprocessors: {}
    };
    options.preprocessors[clientPlugin + '**/!(*.spec)+(.js)'] = ['coverage'];
    return options;
  }
};
