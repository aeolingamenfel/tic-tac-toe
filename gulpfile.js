const fs = require("fs");
const gulp = require("gulp");
const sass = require("gulp-sass");
const inject = require("gulp-inject-string");
const uglify = require('gulp-uglify');
const webpack = require("webpack-stream");
const webpack3 = require("webpack");

const HTML_SOURCES = [
    "src/html/*.html",
    "src/html/**/*.html"
];

const SASS_SOURCES = [
    "src/sass/*.scss",
    "src/sass/**/*.scss"
];

const JS_SOURCES = [
    "src/js/*.js",
    "src/js/**/*.js"
];

gulp.task("default", ["build-html"]);

gulp.task("build-html", ["build-css", "build-js"], function() {
    const siteStyles = fs.readFileSync(`${__dirname}/build/css/app.css`).toString();
    //const siteScripts = fs.readFileSync(`${__dirname}/build/js/app.js`).toString();

    return gulp.src(HTML_SOURCES)
        .pipe(inject.replace("<!-- CSS -->", `<style>${siteStyles}</style>`))
        //.pipe(inject.replace("<!-- JS -->", `<script>${siteScripts}</script>`))
        .pipe(gulp.dest("build/"));
});

gulp.task("build-css", function() {
    return gulp.src(SASS_SOURCES)
        .pipe(sass({
            outputStyle: "compressed"
        }))
        .pipe(gulp.dest("build/css/"));
});

gulp.task("build-js", function() {
    return gulp.src(JS_SOURCES)
        .pipe(webpack(require("./webpack.config.js"), webpack3))
        .pipe(gulp.dest("build/js/"));
});

gulp.task("watch", function() {
    gulp.watch(HTML_SOURCES, ["build-html"]);
    gulp.watch(SASS_SOURCES, ["build-html"]);
    gulp.watch(JS_SOURCES, ["build-html"]);
});