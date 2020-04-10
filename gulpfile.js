const
    
    babel       = require('gulp-babel'),
    cache       = require('gulp-cached'),
    concat      = require('gulp-concat'),
    csso        = require('gulp-csso'),
    del         = require('del'),
    handlebars  = require('gulp-compile-handlebars'),
    htmlmin     = require('gulp-minify-html'),
    gulp        = require('gulp'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),

    src         = 'src/',
    build       = './',

    cssFiles    = [src + 'scss/*.scss', src + 'scss/*.sass', src + 'scss/*.css'],
    jsFiles     = src + 'js/*.js',
    handleFiles = [src + 'templates/*.handlebars', '!' + src + 'templates/index.handlebars'],
    indexFile   = src + 'templates/index.handlebars'
;

function index() {
    var templateData = {
        indexRoot: '/',
        root: '/'
    },
    options = {
        batch : [src + '/partials'],
        helpers : {

        }
    }

    return gulp.src(indexFile)
        .pipe(cache())
        .pipe(handlebars(templateData, options))
        .pipe(htmlmin())
        .pipe(rename({ extname: ".html" }))
        .pipe(gulp.dest(build));
}

function handleB() {
    var templateData = {
        indexRoot: '/',
        root: '/'
    },
    options = {
        batch : [src + '/partials'],
        helpers : {

        }
    }

    return gulp.src(handleFiles)
        .pipe(cache())
        .pipe(handlebars(templateData, options))
        .pipe(htmlmin())
        .pipe(rename({ extname: ".html" }))
        .pipe(gulp.dest(build + 'en/'));
}

function indexTest() {
    var templateData = {
        indexRoot: '',
        root: ''
    },
    options = {
        batch : [src + '/partials'],
        helpers : {

        }
    }

    return gulp.src(indexFile)
        .pipe(cache())
        .pipe(handlebars(templateData, options))
        .pipe(htmlmin())
        .pipe(rename({ extname: ".html" }))
        .pipe(gulp.dest(build));
}

function handleBTest() {
    var templateData = {
        indexRoot: '',
        root: '../'
    },
    options = {
        batch : [src + '/partials'],
        helpers : {

        }
    }

    return gulp.src(handleFiles)
        .pipe(cache())
        .pipe(handlebars(templateData, options))
        .pipe(htmlmin())
        .pipe(rename({ extname: ".html" }))
        .pipe(gulp.dest(build + 'en/'));
}

function css() {
    return gulp.src(cssFiles)
        .pipe(cache())
        .pipe(sass().on('error', sass.logError))
        .pipe(csso())
        .pipe(gulp.dest(build + 'css/'));
}

function js() {
    return gulp.src(jsFiles)
        .pipe(cache())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('scg_min.js'))
        .pipe(gulp.dest(build + 'js/'));
}

function clean() {
    return del([build + 'css', build + 'en', build + 'js', build + 'index.html']);
}

function watchIndex() {
    gulp.watch(indexFile, gulp.series(['index']));
}

function watchHandleB() {
    gulp.watch(handleFiles, gulp.series(['handleB']));
}

function watchCSS() {
    gulp.watch(cssFiles, gulp.series(['css']));
}

function watchJS() {
    gulp.watch(jsFiles, gulp.series(['js']));
}

exports.index   = index;
exports.handleB = handleB;
exports.css     = css;
exports.js      = js;
exports.clean   = clean;

exports.build   = gulp.parallel(css, js, handleB, index);
exports.test    = gulp.parallel(css, js, handleBTest, indexTest);
exports.default = gulp.series(gulp.parallel(css, js, handleB, index), gulp.parallel(watchIndex, watchHandleB, watchCSS, watchJS));
