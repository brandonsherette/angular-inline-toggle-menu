'use strict';

var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});

var port = process.env.PORT || config.defaultPort;

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('clean-build', function() {
  clean(config.build);
});

/**
 * Remove all files from the build, temp, and reports folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean', function(done) {
  var delconfig = [].concat(config.build, config.temp, config.report);
  log('Cleaning: ' + $.util.colors.blue(delconfig));
  del(delconfig, done);
});

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function() {
  log('Analyzing source with JSHint and JSCS');

  return gulp
    .src(config.alljs)
    .pipe($.if(args.verbose, $.print()))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
    .pipe($.jshint.reporter('fail'))
    .pipe($.jscs());
});

/**
 * Compile less to css
 * @return {Stream}
 */
gulp.task('styles', ['clean-styles'], function() {
  log('Compiling Less --> CSS');

  return gulp
    .src(config.less)
    .pipe($.plumber()) // exit gracefully if something fails after this
    .pipe($.less())
    .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe($.concat('styles.css'))
    .pipe(gulp.dest(config.temp));
});

gulp.task('clean-build-styles', function(done) {
  log('Cleaning Build Styles');

  clean(config.build + 'styles/**/*.css', done);
});

/**
 * Remove all styles from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-styles', function(done) {
  var files = [].concat(
    config.temp + '**/*.css',
    config.build + 'styles/**/*.css');
  clean(files, done);
});

gulp.task('clean-build-js', function(done) {
  clean(config.build + '**/*.js', done);
});

gulp.task('less-watcher', function() {
  gulp.watch([config.less], ['styles']);
});

/**
 * Wire-up the bower dependencies
 * @return {Stream}
 */
gulp.task('wiredep', function() {
  log('Wiring the bower dependencies into the html');

  var wiredep = require('wiredep').stream;
  var options = config.getWiredepDefaultOptions();

  // Only include stubs if flag is enabled
  var js = args.stubs ? [].concat(config.js, config.stubsjs) : config.js;

  return gulp
    .src(config.index)
    .pipe(wiredep(options))
    .pipe(inject(js, '', config.jsOrder))
    .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles'], function() {
  log('Wire up css into the html, after files are ready');

  return gulp
    .src(config.index)
    .pipe(inject(config.css))
    .pipe(gulp.dest(config.client));
});

/**
 * Run the spec runner
 * @return {Stream}
 */
gulp.task('serve-specs', ['build-specs'], function(done) {
  log('run the spec runner');
  serve(true /* isDev */, true /* specRunner */);
  done();
});

/**
 * Inject all the spec files into the specs.html
 * @return {Stream}
 */
gulp.task('build-specs', [], function(done) {
  log('building the spec runner');

  var wiredep = require('wiredep').stream;
  var options = config.getWiredepDefaultOptions();
  var specs = config.specs;

  options.devDependencies = true;

  return gulp
    .src(config.specRunner)
    .pipe(wiredep(options))
    .pipe(inject(config.js, '', config.jsOrder))
    .pipe(inject(config.testlibraries, 'testlibraries'))
    .pipe(inject(config.specHelpers, 'spechelpers'))
    .pipe(inject(specs, 'specs', ['**/*']))
    .pipe(gulp.dest(config.client));
});

/**
 * Build everything
 * This is separate so we can run tests on
 * optimize before handling image or fonts
 */
gulp.task('build', ['optimize', 'build-styles', 'build-js'], function() {
  log('Building everything');

  log($.util.colors.blue('Build Completed!'));
});

gulp.task('build-js', ['clean-build-js'], function() {
  log('Compling Plugin JS');

  return gulp
    .src(config.pluginSrcCode)
    .pipe($.plumber())
    .pipe($.concat(config.pluginName + '.js'))
    .pipe(gulp.dest(config.build));
});

gulp.task('build-styles', ['clean-build-styles'], function() {
  log('Compiling Less --> CSS in Build');

  return gulp
    .src(config.pluginLess)
    .pipe($.plumber()) // exit gracefully if something fails after this
    .pipe($.less())
    .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe($.concat(config.pluginName + '.css'))
    .pipe(gulp.dest(config.build));
});

gulp.task('optimize', ['optimize-js', 'optimize-css'], function() {
  log('Optimized JS and CSS');
});

/**
 * Optimize js files.
 * @return {Stream}
 */
gulp.task('optimize-js', ['test'], function() {
  log('Optimizing the js, css, and html');

  return gulp
    .src(config.pluginSrcCode)
    .pipe($.plumber())
    .pipe($.concat(config.pluginName + '.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(config.build));
});

gulp.task('optimize-css', function() {
  log('Optimizing css');

  return gulp
    .src(config.pluginLess)
    .pipe($.plumber()) // exit gracefully if something fails after this
    .pipe($.less())
    .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe($.concat(config.pluginName + '.min.css'))
    .pipe($.minifyCss())
    .pipe(gulp.dest(config.build));
});

/**
 * Remove all files from the build, temp, and reports folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean', function(done) {
  var delconfig = [].concat(config.build, config.temp);
  log('Cleaning: ' + $.util.colors.blue(delconfig));
  del(delconfig, done);
});

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
gulp.task('test', ['vet'], function(done) {
  startTests(true /*singleRun*/, done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *    gulp autotest --startServers
 */
gulp.task('autotest', function(done) {
  startTests(false /*singleRun*/, done);
});

/**
 * serve the dev environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-dev', ['inject'], function() {
  serve(true /*isDev*/);
});

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */
gulp.task('bump', function() {
  var msg = 'Bumping versions';
  var type = args.type;
  var version = args.ver;
  var options = {};
  if (version) {
    options.version = version;
    msg += ' to ' + version;
  }else {
    options.type = type;
    msg += ' for a ' + type;
  }
  log(msg);

  return gulp
    .src(config.packages)
    .pipe($.print())
    .pipe($.bump(options))
    .pipe(gulp.dest(config.root));
});

gulp.task('jsdoc', function() {
  return gulp.src(config.pluginSrcCode)
    .pipe($.yuidoc({
      name: config.pluginName + ' API',
      description: config.pluginName + ' API.',
      'version': require('./package').version,
      url: ''
    }, {
      themedir: 'node_modules/yuidoc-bootstrap-theme',
      helpers: ['node_modules/yuidoc-bootstrap-theme/helpers/helpers.js']
    }))
    .pipe(gulp.dest('api-docs'));
});

/**
 * Optimize the code and re-load browserSync
 */
gulp.task('browserSyncReload', ['optimize'], browserSync.reload);

////////////////

/**
 * When files change, log it
 * @param  {Object} event - event that fired
 */
function changeEvent(event) {
  var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
  log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
  log('Cleaning: ' + $.util.colors.blue(path));
  del(path, done);
}

/**
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name
 * @param   {Array} order   glob pattern for sort order of the files
 * @returns {Stream}   The stream
 */
function inject(src, label, order) {
  var options = {read: false};
  if (label) {
    options.name = 'inject:' + label;
  }

  log('About to inject: ' + label);
  log('with source: ' + src);

  return $.inject(orderSrc(src, order), options);
}

/**
 * Order a stream
 * @param   {Stream} src   The gulp.src stream
 * @param   {Array} order Glob array pattern
 * @returns {Stream} The ordered stream
 */
function orderSrc(src, order) {
  //order = order || ['**/*'];
  return gulp
    .src(src)
    .pipe($.if(order, $.order(order)));
}

/**
 * serve the code
 * --debug-brk or --debug
 * --nosync
 * @param  {Boolean} isDev - dev or build mode
 * @param  {Boolean} specRunner - server spec runner html
 */
function serve(isDev, specRunner) {
  var debugMode = '--debug';
  var nodeOptions = getNodeOptions(isDev);

  nodeOptions.nodeArgs = [debugMode + '=5858'];

  if (args.verbose) {
    console.log(nodeOptions);
  }

  return $.nodemon(nodeOptions)
    .on('restart', ['vet'], function(ev) {
      log('*** nodemon restarted');
      log('files changed:\n' + ev);
      setTimeout(function() {
        browserSync.notify('reloading now ...');
        browserSync.reload({stream: false});
      }, config.browserReloadDelay);
    })
    .on('start', function() {
      log('*** nodemon started');
      startBrowserSync(isDev, specRunner);
    })
    .on('crash', function() {
      log('*** nodemon crashed: script crashed for some reason');
    })
    .on('exit', function() {
      log('*** nodemon exited cleanly');
    });
}

function getNodeOptions(isDev) {
  return {
    script: config.nodeServer,
    delayTime: 1,
    env: {
      'PORT': port,
      'NODE_ENV': isDev ? 'dev' : 'build'
    },
    watch: [config.server]
  };
}

/**
 * Start BrowserSync
 * --nosync will avoid browserSync
 */
function startBrowserSync(isDev, specRunner) {
  if (args.nosync || browserSync.active) {
    return;
  }

  log('Starting BrowserSync on port ' + port);

  // If build: watches the files, builds, and restarts browser-sync.
  // If dev: watches less, compiles it to css, browser-sync handles reload
  if (isDev) {
    gulp.watch([config.less], ['styles'])
      .on('change', changeEvent);
  }else {
    gulp.watch([config.less, config.js, config.html], ['browserSyncReload'])
      .on('change', changeEvent);
  }

  var options = {
    proxy: 'localhost:' + port,
    port: 3000,
    files: isDev ? [
      config.client + '**/*.*',
      '!' + config.less,
      config.temp + '**/*.css'
    ] : [],
    watchOptions: {
      ignored: ['node_modules', 'bower_components']
    },
    ghostMode: {// these are the defaults t,f,t,t
      clicks: true,
      location: false,
      forms: true,
      scroll: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'info',
    logPrefix: 'plugator',
    notify: true,
    reloadDelay: 0 //1000
  };
  if (specRunner) {
    options.startPath = config.specRunnerFile;
  }

  browserSync(options);
}

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
  var child;
  var excludeFiles = [];
  var fork = require('child_process').fork;
  var Karma = require('karma').Server;
  var serverSpecs = config.serverIntegrationSpecs;

  if (args.startServers) {
    log('Starting servers');
    var savedEnv = process.env;
    savedEnv.NODE_ENV = 'dev';
    savedEnv.PORT = 8888;
    child = fork(config.nodeServer);
  }else {
    // make sure server specs are not run through karma
    if (serverSpecs && serverSpecs.length) {
      excludeFiles = serverSpecs;
    }
  }

  new Karma({
    configFile: __dirname + '/karma.conf.js',
    exclude: excludeFiles,
    singleRun: !!singleRun
  }, karmaCompleted).start();

  ////////////////

  function karmaCompleted(karmaResult) {
    log('Karma completed');
    if (child) {
      log('shutting down the child process');
      child.kill();
    }
    if (karmaResult === 1) {
      done('karma: tests failed with code ' + karmaResult);
    }else {
      done();
    }
  }
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 * @param {String} msg the msg to log.
 */
function log(msg) {
  if (typeof (msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  }else {
    $.util.log($.util.colors.blue(msg));
  }
}

module.exports = gulp;
