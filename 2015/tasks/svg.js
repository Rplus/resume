module.exports = (gulp, $) => {
  return () => {
    gulp.src('app/images/svg-icon/*.svg', {base: 'app/images'})
      .pipe($.cache($.imagemin({
        // svgoPlugins: [{removeViewBox: false}]
      })))
      .pipe($.rename({prefix: 'inject-icon-'}))
      .pipe($.svgstore({ inlineSvg: true }))
      .pipe($.rename('icons.svg'))
      .pipe(gulp.dest('.tmp/images'))
      .pipe(gulp.dest('dist/images'))
      .pipe($.size({title: 'images'}))
  };
};
