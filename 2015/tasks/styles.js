module.exports = (gulp, $) => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    '> 5% in TW',
    'bb >= 10'
  ];

  return () => {
    gulp.src([
      'app/styles/**/*.scss',
      'app/styles/**/*.css'
    ])
      .pipe($.newer('.tmp/styles'))
      .pipe($.sourcemaps.init())
      .pipe($.sass({
        outputStyle: 'expanded',
        precision: 10
      }).on('error', $.sass.logError))
      .pipe($.postcss([
        require('autoprefixer')(/*AUTOPREFIXER_BROWSERS*/),
        require("css-mqpacker")()
      ]))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('.tmp/styles'))
      // Concatenate and minify styles
      .pipe($.if('*.css', $.minifyCss()))
      .pipe($.size({title: 'styles'}))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('dist/styles'));
  };
};
