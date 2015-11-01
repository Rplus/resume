module.exports = (gulp, $) => {
  return () => {
    gulp.src([
      'app/images/**/*',
      '!app/images/svg-icon/*'
    ])
      .pipe($.cache($.imagemin({
        progressive: true,
        interlaced: true
      })))
      .pipe(gulp.dest('.tmp/images'))
      .pipe(gulp.dest('dist/images'))
      .pipe($.if('*.jpg', $.webp()))
      .pipe(gulp.dest('.tmp/images'))
      .pipe(gulp.dest('dist/images'))
      .pipe($.size({title: 'images'}))
  };
};
