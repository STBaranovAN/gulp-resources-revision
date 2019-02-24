const gulp = require('gulp');
const rev = require('gulp-rev');
const collect = require('gulp-rev-collector');
const revDistClean = require('gulp-rev-dist-clean');

gulp.task('default', () =>
    gulp.src('src/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest('dist'))
);

gulp.task('copy-data', function() {
    return gulp.src(["./src/**/*.*"])
      .pipe(gulp.dest('dist'));
});

gulp.task('revision:rename', () =>
  gulp.src(["src/**/*.css",
            "src/**/*.js"])
  .pipe(rev())
  .pipe(gulp.dest('dist'))
  .pipe(rev.manifest())
  .pipe(gulp.dest('dist'))
);

gulp.task('revision:update-references', () =>
   gulp.src(['dist/rev-manifest.json','dist/**/*.html'])
   .pipe(collect())
   .pipe(gulp.dest('dist'))
);

gulp.task('revision:rev-dist-clean', () =>
    gulp.src(["dist/**/*.css", "dist/**/*.js"])
      .pipe(revDistClean('dist/rev-manifest.json', {
        keepRenamedFiles: true,
        keepOriginalFiles: false
      })
    )
);

gulp.task('compile:production', gulp.series('copy-data', 'revision:rename', 'revision:update-references', 'revision:rev-dist-clean'));