// const gulp = require('gulp');
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');
var page_watch_css = null;
var page_watch_js = null;


const location_css = {
    style_homepage_rtl: {
        src: [
            'sass/_homepage/style-rtl.scss'
        ],
        dest: 'build/css'
    },
    style_homepage_ltr: {
        src: [
            'sass/_homepage/style-ltr.scss'
        ],
        dest: 'build/css'
    },

}

const location_js = {
    script_homepage: {
        src: [
            'js/lib/jquery.min.js',
            'js/lib/bootstrap.bundle.min.js', 
            'js/lib/blazy.min.js',
            'js/lib/swiper.min.js',
            'js/lib/fontawesome.min.js',
            'js/lib/wow-animate.min.js', 
            'js/common.js',
            'js/homepage.js',
        ],
        dest: 'build/js'
    },

}


//CSS
function page_css() {
    var page;
    if (page_watch_css != null) {
        page = page_watch_css;
    } else {
        page = '' + gutil.env.page;
    }
    if (location_css[page] != undefined) {
        const css_src = location_css[page].src;
        return src(css_src)
            .pipe(sass().on('error', sass.logError))
            .pipe(minifyCSS())
            .pipe(concat(page + '.min.css'))
            .pipe(dest('./build/css/'))
            .pipe(browserSync.stream());
    } else {
        return new Promise(function (resolve, reject) {
            console.log('Page doesnt exists!');
            resolve();
        });
    }
}

function css_all() {
    return new Promise(function (resolve, reject) {
        for (const [key, value] of Object.entries(location_css)) {
            var name = key;
            var source = value.src;
            src(source)
                .pipe(sass().on('error', sass.logError))
                .pipe(minifyCSS())
                .pipe(concat(name + '.min.css'))
                .pipe(dest('./build/css/'))
                .pipe(browserSync.stream());
        }
        resolve();
    });
}


//JS
function page_js() {
    var page;
    if (page_watch_js != null) {
        page = page_watch_js;
    } else {
        page = '' + gutil.env.page;
    }
    if (location_js[page] != undefined) {
        const css_src = location_js[page].src;
        return src(css_src)
            .pipe(uglify())
            .pipe(concat(page + '.min.js'))
            .pipe(dest('./build/js/', { sourcemaps: true }));
    } else {
        return new Promise(function (resolve, reject) {
            console.log('page doesnt exists!');
            resolve();
        });
    }
}

function js_all() {
    return new Promise(function (resolve, reject) {
        for (const [key, value] of Object.entries(location_js)) {
            var name = key;
            var source = value.src;
            src(source)
                .pipe(uglify())
                .pipe(concat(name + '.min.js'))
                .pipe(dest('./build/js/', { sourcemaps: true }));
        }
        resolve();
    });
}





function browser() {
    browserSync.init({
        server:
        {
            baseDir: './build'
        }
    });
    watch('./sass/**/**/*.scss').on('change', function (e) {
        var folder_name = e.split(/\\/g)[1].replace('_', '');
        var file_name = e.split(/\\/g)[2];
        var dir = e.split(/\\/g)[2].replace('.scss', '').split('-')[1];
        if (folder_name === `partials`) {
            console.log(`File: ${file_name} updated ... run css all`);
            css_all();
        }

        else if (dir == undefined) {
            console.log(`File: ${file_name} updated ... run css for ${folder_name}`);
            var dir_arr = ['rtl', 'ltr'];
            for (let i = 0; i < dir_arr.length; i++) {
                page_watch_css = 'style_' + folder_name + '_' + dir_arr[i];
                page_css();
            }
        }

        else {
            console.log(`File: ${file_name} updated ... run css for ${folder_name}`);
            page_watch_css = 'style_' + folder_name + '_' + dir;
            page_css();
        }
    });
    watch('./js/**').on('change', function (e) {
        var file_name = e.replace(/\\/g, '').replace('.js', '').replace('/', '').replace('js', '');
        if (file_name === 'common') {
            console.log(`${file_name} updated ... run js all`);
            js_all();
            browserSync.reload();
        } else {
            console.log(`${file_name} updated ... run js for ${file_name}`);
            page_watch_js = 'script_' + file_name;
            page_js();
            browserSync.reload();
        }
    });
    watch('./build/*.html').on('change', browserSync.reload);
}


exports.css_all = css_all;
exports.css = page_css;
exports.js_all = js_all;
exports.js = page_js;
exports.default = browser;
