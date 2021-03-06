const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();

// Copy third party libraries from /node_modules into /vendor
gulp.task("vendor", function (done) {
  // Bootstrap
  gulp
    .src([
      "./node_modules/bootstrap/dist/**/*",
      "!./node_modules/bootstrap/dist/css/bootstrap-grid*",
      "!./node_modules/bootstrap/dist/css/bootstrap-reboot*",
    ])
    .pipe(gulp.dest("./vendor/bootstrap"));

  // Font Awesome
  gulp.src(["./node_modules/@fortawesome/**/*"]).pipe(gulp.dest("./vendor"));

  // jQuery
  gulp
    .src([
      "./node_modules/jquery/dist/*",
      "!./node_modules/jquery/dist/core.js",
    ])
    .pipe(gulp.dest("./vendor/jquery"));

  // jQuery Easing
  gulp
    .src(["./node_modules/jquery.easing/*.js"])
    .pipe(gulp.dest("./vendor/jquery-easing"));

  done();
});

// Compile SCSS
gulp.task("css:compile", function () {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(
      sass
        .sync({
          outputStyle: "expanded",
        })
        .on("error", sass.logError)
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(gulp.dest("./css"));
});

// Minify CSS
gulp.task(
  "css:minify",
  gulp.series("css:compile", function () {
    return gulp
      .src(["./css/*.css", "!./css/*.min.css"])
      .pipe(cleanCSS())
      .pipe(
        rename({
          suffix: ".min",
        })
      )
      .pipe(gulp.dest("./css"))
      .pipe(browserSync.stream());
  })
);

// CSS
gulp.task("css", gulp.series("css:compile", "css:minify"));

// Minify JavaScript
gulp.task("js:minify", function () {
  return gulp
    .src(["./js/*.js", "!./js/*.min.js"])
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(gulp.dest("./js"))
    .pipe(browserSync.stream());
});

// JS
gulp.task("js", gulp.series("js:minify"));

// Default task
gulp.task("default", gulp.series("css", "js", "vendor"), function () {
  return gulp.dest("./dist");
});

gulp.task("dist", gulp.series("css", "js", "vendor"), function () {
  return gulp.dest("./dist");
});

// Configure the browserSync task
gulp.task("browserSync", function () {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
});

// Dev task
gulp.task("dev", gulp.series("css", "js", "browserSync"), function () {
  gulp.watch("./scss/*.scss", ["css"]);
  gulp.watch("./js/*.js", ["js"]);
  gulp.watch("./*.html", browserSync.reload);
});
