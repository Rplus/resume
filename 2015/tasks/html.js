module.exports = (gulp, $) => {

  var fs = require('fs');
  var path = require('path');
  var lang = 'zh';
  var strsSrc = `../app/lang/${lang}.json`;
  var appInfo = JSON.parse(fs.readFileSync('./app/manifest.webapp', 'utf8'));

  function requireUncached ($module) {
    delete require.cache[require.resolve($module)];
    return require($module);
  }

  function addAppInfo () {
    var strs = requireUncached(strsSrc);
    strs.lang = lang;
    strs.appInfo = appInfo;
    strs.appInfo.version += +new Date();
    return strs;
  }

  return () => {
    gulp.src('app/index.jade')
      .pipe($.data(addAppInfo))
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
