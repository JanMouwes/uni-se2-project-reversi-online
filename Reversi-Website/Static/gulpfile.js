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
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const handlebars = require("gulp-handlebars");
const sass = require("gulp-sass");

const HTML_PATH = 'src/html';
const JS_PATH = 'src/js';
const CSS_PATH = 'src/css';
const SASS_PATH = 'src/sass';
const TEMPLATES_PATH = 'src/templates';
const VENDOR_PATH = 'src/vendor';
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

const sass_task = function () {
    return gulp.src(SASS_PATH + "/**/*.scss")
        .pipe(debug({title: "sass:"}))
        .pipe(sass())
        .pipe(dest(CSS_PATH));
};

const css = () => {

    const fileNames = {
        full: "style.css",
        min: "style.min.css"
    };

    return gulp.src(CSS_PATH + '/**/*.css')
        .pipe(debug({title: "css:"}))
        .pipe(concat(fileNames.full))
        .pipe(dest(OUTPUT_PATH + "/css"))
        .pipe(rename(fileNames.min))
        .pipe(uglify_css())
        .pipe(dest(OUTPUT_PATH + "/css"));
};

const sass_css = series(sass_task, css);

const html = () => {
    return src(HTML_PATH + "/**/*.html")
        .pipe(dest(OUTPUT_PATH))
};

const templates = function () {
    return src([TEMPLATES_PATH + '/**/*.hbs'])
    // Compile each Handlebars template source file to a template function
        .pipe(handlebars())
        // Wrap each template function in a call to Handlebars.template
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        // Declare template functions as properties and sub-properties of MyApp.templates
        .pipe(declare({
            namespace: 'SPA_Templates',
            noRedeclare: true, // Avoid duplicate declarations
            processName: function (filePath) {
                // Allow nesting based on path using gulp-declare's processNameByPath()
                // You can remove this option completely if you aren't using nested folders
                // Drop the client/templates/ folder from the namespace path by removing it from the filePath
                return declare.processNameByPath(filePath.replace(TEMPLATES_PATH, ''));
            }
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest(OUTPUT_PATH + '/js'))
};


const vendor = function () {
    return gulp.src([VENDOR_PATH + '/**/*.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dist/js'));
};


const serve = function () {
    browserSync.init({server: "./dist/"});
    gulp.watch(HTML_PATH + "/**/*.html", series(html));
    gulp.watch(JS_PATH + "/**/*.js", series(js));
    gulp.watch(CSS_PATH + "/**/*.css", series(css));
    gulp.watch(SASS_PATH + "/**/*.scss", sass_css);
    gulp.watch(TEMPLATES_PATH + "/**/*.hbs", series(templates));
    gulp.watch(VENDOR_PATH + "/**/*.js", series(vendor));
};

exports.build = series(vendor, templates, sass_css, js, html);
exports.serve = series(exports.build, serve);
