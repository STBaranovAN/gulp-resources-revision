const gulp = require('gulp');
const rev = require('gulp-rev');
const revDel = require('rev-del');
const collect = require('gulp-rev-collector');
 
gulp.task('default', () =>
    gulp.src('src/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest('dist'))
);

// gulp.task('copy-data', function() {
//     return gulp.src(["./src/**/*.*"])
//       .pipe(gulp.dest('dist'));
// });

gulp.task('copy-data', function() {
    return gulp.src(["./src/**/*.*", "!./src/**/*.css", "!./src/**/*.js", "!./src/**/*.map"])
      .pipe(gulp.dest('dist'));
});

gulp.task('revision:rename', () =>
  gulp.src(["src/**/*.css",
            "src/**/*.js"])
  .pipe(rev())
  .pipe(gulp.dest('dist'))
  .pipe(rev.manifest('manifest.json'))
  .pipe(revDel({ dest: 'dist' }))
  .pipe(gulp.dest('dist'))
);

gulp.task('revision:updateReferences', () =>
   gulp.src(['dist/manifest.json','dist/**/*.html'])
   .pipe(collect())
   .pipe(gulp.dest('dist'))
);

gulp.task('compile:production', gulp.series('copy-data', 'revision:rename', 'revision:updateReferences'));