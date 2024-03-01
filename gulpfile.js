const { src, dest, watch, parallel } = require("gulp");

// CSS
const sass= require("gulp-sass")(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer'); //se asegura que funcione en el navegador que tu le digas
const cssnano = require('cssnano'); //comprime nuestro codigo css
const postcss = require('gulp-postcss'); //hace unas transformaciones atravez de los otros dos
const sourcemaps = require('gulp-sourcemaps');

// Imagenes
const cache = require('gulp-cache');
const imagemin =require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// Javascrip
const terser = require('gulp-terser-js');


function css(done){
    src('src/scss/**/*.scss') //Identificar el archivo .SCSS a compilar
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass()) // Compilarlo
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/css")); // Almacenar en el disco duro

    done();
}

function imagenes(done){
    const opciones = {
        optimizationLevel: 3
    }
        src('src/img/**/*.{png,jpg}')
        .pipe( cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done();
}

function versionWebp (done) {
    const opciones ={
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe( webp(opciones))
        .pipe( dest('build/img'))
    done();
}

function versionAvif (done) {
    const opciones ={
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones))
        .pipe( dest('build/img'))
    done();
}

function javascrip(done){
    src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'));

    done();
}

function dev(done){
    watch('src/scss/**/*.scss', css)
    watch('src/js/**/*.js', javascrip)

    done();
}

exports.css = css;
exports.js = javascrip;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascrip, dev);
