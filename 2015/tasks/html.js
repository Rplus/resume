module.exports = (gulp, $) => {

  var fs = require('fs');
  var path = require('path');
  var lang = 'zh'
  var strs = require(`../app/lang/${lang}.json`);
  strs.lang = lang;
  strs.appInfo = JSON.parse(fs.readFileSync('./app/manifest.webapp', 'utf8'));

  return () => {
    gulp.src('app/index.jade')
      .pipe($.data(strs))
      .pipe($.jade({
        pretty: true
      })).on('error', function(err) {
        console.log(err);
      })
      .pipe(gulp.dest('.tmp/'))
      // Minify any HTML
      .pipe($.if('*.html', $.minifyHtml({
        quotes: true,
        empty: true
      })))
      // Output files
      .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
      .pipe(gulp.dest('dist'));
  };
};
