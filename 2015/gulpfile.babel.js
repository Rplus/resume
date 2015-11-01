// based on WSK(web starter kit)
'use strict';

let fs = require('fs');
let path = require('path');
let gulp = require('gulp');
let del = require('del');
let runSequence = require('run-sequence');
let browserSync = require('browser-sync');
let gulpLoadPlugins = require('gulp-load-plugins');
let pkg = require('./package.json');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

function getTask(task) {
  return require('./tasks/' + task)(gulp, $);
}


// Compile and automatically prefix stylesheets
gulp.task('styles', getTask('styles'));


// Concatenate and minify JavaScript. Optionally transpiles ES2015 code to ES5.
gulp.task('scripts', getTask('scripts'));


// Scan your HTML for assets & optimize them
gulp.task('html', getTask('html'));


gulp.task('svg', getTask('svg'));


// Lint JavaScript
gulp.task('jshint', () =>
  gulp.src('app/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')))
);


// Optimize images
gulp.task('images', getTask('images'));


// Copy all files at the root level (app)
gulp.task('copy', () =>
  gulp.src([
    'app/*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}))
);


// Clean output directory
gulp.task('clean', cb => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}, cb));


// Watch files for changes & reload
gulp.task('serve', ['scripts', 'styles'], () => {
  browserSync({
    open: 'external',
    browser: 'google-chrome',
    notify: false,
    ghostMode: {
      clicks: false,
      scroll: false,
      forms: false
    },
    scrollThrottle: 500,
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'app']
  });

  gulp.watch(['app/**/*.jade', 'app/lang/*.json'], ['html', reload]);
  gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['app/scripts/**/*.js'], ['jshint', 'scripts', reload]);
  gulp.watch(['app/images/**/*'], reload);
});


// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], () =>
  browserSync({
    open: 'external',
    browser: 'google-chrome',
    notify: false,
    ghostMode: {
      clicks: false,
      scroll: false,
      forms: false
    },
    scrollThrottle: 500,
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist'
  })
);


// Build production files, the default task
gulp.task('default', ['clean'], cb =>
  runSequence(
    'styles',
    ['jshint', 'html', 'scripts', 'images', 'copy', 'svg'],
    cb
  )
);


// Run PageSpeed Insights
gulp.task('pagespeed', cb =>
  // Update the below URL to the public URL of your site
  pagespeed('example.com', {
    strategy: 'mobile'
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: 'YOUR_API_KEY'
  }, cb)
);


// Load custom tasks from the `tasks` directory
try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
