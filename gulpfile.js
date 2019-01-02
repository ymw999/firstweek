var gulp = require("gulp");
var sass = require("gulp-sass");
var webserver = require("gulp-webserver");
var watch = require("gulp-watch");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var url = require("url");
var path = require("path");
var fs = require("fs");

//sass
gulp.task("sass", function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./src/css/"))
})

//监听
gulp.task("watch", function() {
    return gulp.watch("./src/scss/*.scss", gulp.series("sass"))
})

//拷贝
gulp.task("build", function() {
    return gulp.src(["./src/js/**/*.js", "./src/css/*.css"])
        .pipe(gulp.dest("./dist/"))
})

//合并压缩js
gulp.task("uglify", function() {
    return gulp.src("./src/js/**/*.js")
        .pipe(concat("app.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./src/js"))
})

//起服务
gulp.task("webserver", function() {
    return gulp.src("src")
        .pipe(webserver({
            port: 1224,
            open: true,
            livereload: true,
            middleware: function(req, res, next) {
                var pathname = decodeURI(url.parse(req.url).pathname);
                pathname = pathname === "/" ? "index.html" : pathname;
                if (pathname === "/favicon.ico") {
                    return res.end("")
                }
                res.end(fs.readFileSync(path.join(__dirname, "src", pathname)))
            }
        }))
})


gulp.task("default", gulp.series(["sass", "uglify", "webserver", "watch"]))