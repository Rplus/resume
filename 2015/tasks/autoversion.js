module.exports = (gulp, $) => {

  let lastGitHash = require('git-rev-sync').short();

  return () => {
    gulp.src('app/offline.appcache')
      .pipe($.replace(/(data-version=)\"[^"]+?\"/, `$1"${lastGitHash}"`))
      .pipe(gulp.dest('.tmp/'))
      .pipe(gulp.dest('dist/'));
  };
};
