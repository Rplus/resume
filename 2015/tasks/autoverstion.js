module.exports = (gulp, $) => {

  var fs = require('fs');
  var appInfo = JSON.parse(fs.readFileSync('./app/manifest.webapp', 'utf8'));

  return () => {
    gulp.src('app/offline.appcache')
      .pipe($.data(appInfo))
      .pipe($.replace(/(data-version=)\"[^"]+?\"/, `$1"${appInfo.version}"`))
      .pipe(gulp.dest('.tmp/'))
      .pipe(gulp.dest('dist/'));
  };
};
