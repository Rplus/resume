/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var fs = require('fs');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 12',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var plumberOption = {
      errorHandler: function(err) {
        console.log(err);
        this.emit('end');
      }
    };

var loadJSON = function(path) {
  var data = fs.readFileSync(path, 'utf8');
  return JSON.parse(data);
};

var RplusConfig = loadJSON('./app/manifest.webapp');

gulp.task('filter-webfont-chars', function() {
  var rawHtml = fs.readFileSync('./app/index.html', 'utf8');
  var webFontChars = encodeURIComponent(rawHtml.match(/say\-hi[^>]+?>([^<]+)/).pop().replace(/\s/g, ''));

  var outputPath = ['.tmp', 'dist'];
  var changeWebFont = function($folder) {
    gulp.src([
        $folder + '/index.html'
      ])
      .pipe($.replace(/family=Courgette.*?"/, 'family=Courgette&text=' + webFontChars + '"'))
      .pipe(gulp.dest($folder));
  };

  for (var i = 0; i < outputPath.length; i++) {
    changeWebFont(outputPath[i]);
  }
});

gulp.task('update-version', function() {
  console.log(RplusConfig.version);
  var regPattern = /data-version="[\.\d]+?"/;
  var outputPath = ['.tmp', 'dist'];
  var changeVersion = function($folder) {
    gulp.src([
        $folder + '/index.html',
        $folder + '/offline.appcache'
      ])
      .pipe($.replace(regPattern, 'data-version="' + RplusConfig.version + '"'))
      .pipe(gulp.dest($folder));
  };

  for (var i = 0; i < outputPath.length; i++) {
    changeVersion(outputPath[i]);
  }
});

// JS task
gulp.task('js', function() {
  return gulp.src('app/scripts/*.js')
    .pipe($.plumber(plumberOption))
    .pipe($.jscs())
    .on('error', $.notify.onError(function() {
      return 'jscs error';
    }))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.notify(function(file) {
      // ref: https://gist.github.com/rudijs/9148283
      if (!file.jshint.success) {
        return 'jshint error';
      }
    }))
    .pipe($.util.env.type !== 'dev' ? $.uglify({preserveComments: 'some'}) : $.util.noop())
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe($.size({title: 'images'}));
});

// Optimize Images
gulp.task('images', function() {
  return gulp.src(['app/images/**/*', '!app/images/inject-svg/icons/*.svg'])
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('.tmp/images'))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});

// Copy All Files At The Root Level (app)
gulp.task('copy', function() {
  return gulp.src([
    'app/*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('.tmp'))
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}));
});

// Compile and Automatically Prefix Stylesheets
gulp.task('libsass', function() {
  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
      'app/styles/main.scss'
    ])
    .pipe($.plumber(plumberOption))
    .pipe($.changed('libsass', {extension: '.scss'}))
    .pipe($.sass())
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    // Concatenate And Minify Styles
    .pipe($.if('*.css', $.csso()))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(gulp.dest('dist/styles'))
    .pipe($.size({title: 'styles'}));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function() {
  var assets = $.useref.assets({searchPath: '{.tmp,app}'});

  return gulp.src('app/**/*.html')
    .pipe($.plumber(plumberOption))
    .pipe(assets)
    // Concatenate And Minify JavaScript
    .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
    // Remove Any Unused CSS
    // Note: If not using the Style Guide, you can delete it from
    // the next line to only include styles your project uses.
    .pipe($.if('*.css', $.uncss({
      html: [
        'app/index.html'
      ],
      // CSS Selectors for UnCSS to ignore
      ignore: [
        /avatar/,
        /.contact-link/,
        /#card/,
        /.navdrawer-container.open/,
        /.app-bar.open/
      ]
    })))
    // Concatenate And Minify Styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    // Output Files: to .tmp folder
    .pipe(gulp.dest('.tmp'))
    .pipe($.size({title: 'html'}));
});

gulp.task('inject-html', ['html'], function() {
  return gulp.src('.tmp/**/*.html')
    .pipe($.plumber(plumberOption))
    // inject css into html inline style
    .pipe($.inject(gulp.src(['.tmp/styles/*.css', '.tmp/scripts/init.js']), {
      starttag: '<!-- inject:head:{{ext}} -->',
      transform: function(filePath, file) {
        // return file contents as string
        var _ext;
        var tags;
        _ext = filePath.split('.').reverse()[0];

        tags = ('js' === _ext ? 'script' : 'style');

        return '<' + tags + '>' + file.contents.toString('utf8') + '</' + tags + '>';
      }
    }))
    // Minify Any HTML
    .pipe($.if('*.html', $.minifyHtml({quotes: true})))
    // Output Files: to dist folder
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'inject-html'}));
});

gulp.task('svgicons', function() {
  function transformSvg ($svg, done) {
    $svg.attr('style', 'display:none');
    done(null, $svg);
  }

  gulp.src('./app/images/inject-svg/icons/*.svg')
    .pipe($.imagemin({
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe($.svgstore({
      prefix: 'inject-icon-',
      transformSvg: transformSvg
    }))
    .pipe(gulp.dest('.tmp/images/inject-svg/'))
    .pipe(gulp.dest('dist/images/inject-svg/'));

  $.iconify({
    src: './app/images/inject-svg/icons/*.svg',
    pngOutput: './app/images/inject-svg/png',
    scssOutput: './.tmp/images/inject-svg/scss',
    cssOutput:  './app/images/inject-svg/css',
    styleTemplate: './app/styles/_icon_gen.scss.mustache'
  });
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

// Watch Files For Changes & Reload
gulp.task('serve', function() {
  browserSync({
    browser: 'google-chrome',
    notify: false,
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: true
    },

    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'app']
  });

  gulp.watch(['app/**/*.html'], ['html', reload]);
  gulp.watch(['app/styles/**/*.{scss,css}'], ['libsass', reload]);
  gulp.watch(['app/scripts/**/*.js'], ['js', reload]);
  gulp.watch(['app/images/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', function() {
  browserSync({
    browser: 'google-chrome',
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    port: 8000,
    server: 'dist'
  });

  gulp.watch(['app/**/*.html'], ['inject-html', reload]);
  gulp.watch(['app/styles/**/*.{scss,css}'], ['libsass', 'inject-html', reload]);
  gulp.watch(['app/scripts/**/*.js'], ['js', 'inject-html', reload]);
  gulp.watch(['app/images/**/*'], reload);
});

// deploy dist folder to github branch gh-pages
gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe($.ghPages());
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function(cb) {
  runSequence('svgicons',
              'libsass',
              'js',
              'inject-html',
              ['images', 'copy'],
              'update-version',
              'filter-webfont-chars',
              cb);
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', pagespeed.bind(null, {
  // By default, we use the PageSpeed Insights
  // free (no API key) tier. You can use a Google
  // Developer API key if you have one. See
  // http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
  url: 'http://rplus.github.io/resume/',
  strategy: 'mobile'
}));

// Load custom tasks from the `tasks` directory
try { require('require-dir')('tasks'); } catch (err) {}
