var gulp = require("gulp");

var useref = require("gulp-useref");
var gulpIf = require("gulp-if");
var critical = require("critical").stream;

// HTML
const htmlmin = require("gulp-htmlmin");

// CSS
var postcss = require("gulp-postcss");
var cssnano = require("cssnano");
var autoprefixer = require("autoprefixer");
var uncss = require("uncss");

// JS
var uglify = require("gulp-uglify-es").default;

// Images
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache");

// Misc
var replace = require("gulp-replace");
var del = require("del");

var postcss_plugins = [
  autoprefixer(),
  cssnano(),
  // uncss.postcssPlugin({ html: ["*.html"] }),
];

// Collect js and css into 1 file
gulp.task("useref", function () {
  return (
    gulp
      .src("*.html")
      .pipe(useref())

      // CSS
      .pipe(gulpIf("*.css", postcss(postcss_plugins)))

      // JS
      .pipe(gulpIf("*.js", uglify()))

      // Replace
      .pipe(replace("http://127.0.0.1:8000", "https://app.kwikpic.in")) // dev to prod

      .pipe(replace("no-optimize-", "")) // skip compression of images

      .pipe(
        replace(
          "kwikpic-yt-video-gulp-replace",
          "https://www.youtube.com/embed/vlC5jzeC2kE"
        )
      ) // Replace kwikpic video so takes less bandwidth in dev

      .pipe(replace("click.html", "click"))

      .pipe(replace("GTM-NQ5PDTF", "GTM-MKJLSPS")) // Google Tag manager

      .pipe(gulp.dest("dist"))
  );
});

// compress images
gulp.task("images", function () {
  return (
    gulp
      .src("images/**/*.+(png|jpg|jpeg|gif|svg)")
      // Caching images that ran through imagemin
      .pipe(
        cache(
          imagemin({
            interlaced: true,
          })
        )
      )
      .pipe(gulp.dest("dist/images"))
  );
});

// cache compress images
gulp.task("cache", function () {
  return (
    gulp
      .src("images/**/*.+(png|jpg|jpeg|gif|svg)")
      // Caching images that ran through imagemin
      .pipe(
        cache(
          imagemin({
            interlaced: true,
          })
        )
      )
  );
});

// get critical css
gulp.task("critical", () => {
  return gulp
    .src("dist/*.html")
    .pipe(
      critical({
        base: "dist/",
        inline: true,
        css: ["dist/css/*.css"],
        width: 1280,
        height: 600,
        minify: true,
        extract: true,
        ignore: {
          atrule: ["@font-face"],
        },
      })
    )
    .on("error", (err) => {
      console.log(err.message);
    })
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest("dist"));
});

// Copy favicons and stuff
gulp.task("copy-icon", function () {
  return gulp.src("icon/*").pipe(gulp.dest("dist/icon"));
});
gulp.task("copy-no-optimize-images", function () {
  return gulp.src("no-optimize-images/*").pipe(gulp.dest("dist/images"));
});
gulp.task("copy-files", function () {
  var fontsFilesToCopy = ["favicon.ico", "browserconfig.xml"];
  return gulp.src(fontsFilesToCopy).pipe(gulp.dest("dist"));
});

// Clean
gulp.task("clean", function (done) {
  del(["dist"]);
  done();
});

// Build
gulp.task(
  "build",
  gulp.series(
    gulp.parallel("useref", "images"),
    "critical",
    gulp.parallel("copy-icon", "copy-files", "copy-no-optimize-images")
  )
);

// development: gulp clean && gulp build
// Prod: gulp cache && gulp clean && gulp build
