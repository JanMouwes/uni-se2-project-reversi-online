const {src, dest, series} = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const uglify_css = require('gulp-uglifycss');
const babel = require('gulp-babel');
const debug = require('gulp-debug');
const merge = require('merge-stream');
const gulp = require("gulp");
const browserSync = require("browser-sync");

const HTML_PATH = 'src/html';
const JS_PATH = 'src/js';
const CSS_PATH = 'src/css';
const OUTPUT_PATH = "dist";

const BABEL_PRESET = "babel-preset-env";
const BABEL_OPTS = {
    presets: [BABEL_PRESET]
};

const js = () => {

    const fileNames = {
        full: "app.js",
        min: "app.min.js"
    };

    let tasks = src(JS_PATH + '/**/*.js')
        .pipe(debug({title: "merge-modules-src:"}))
        .pipe(babel(BABEL_OPTS))
        .pipe(concat(fileNames.full))
        .pipe(dest(OUTPUT_PATH + "/js"))
        .pipe(rename(fileNames.min))
        .pipe(uglify())
        .pipe(dest(OUTPUT_PATH + "/js"));

    return merge(tasks);
};

const css = () => {

    const fileNames = {
        full: "style.css",
        min: "style.min.css"
    };

    let tasks = src(CSS_PATH + '/**/*.css')
        .pipe(debug({title: "css:"}))
        .pipe(concat(fileNames.full))
        .pipe(dest(OUTPUT_PATH + "/css"))
        .pipe(rename(fileNames.min))
        .pipe(uglify_css())
        .pipe(dest(OUTPUT_PATH + "/css"));

    return merge(tasks);
};

const html = () => {
    return src(HTML_PATH + "/**/*.html")
        .pipe(dest(OUTPUT_PATH))
};

gulp.task('serve', function () {
    browserSync.init({server: "./dist/"});
    gulp.watch(HTML_PATH + "/**/*.html", series(html));
    gulp.watch(JS_PATH + "/**/*.js", series(js));
    gulp.watch(CSS_PATH + "/**/*.css", series(css));
});


exports.build = series(css, js, html);