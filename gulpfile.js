var express = require('express');
var app = express();

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');

var browserify = require('browserify');
var shimify = require('browserify-shim');
var babelify = require('babelify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

// Let watchify can watch unlimited files.
require('events').EventEmitter.defaultMaxListeners = Infinity;

var distTargets = ['index'];
var cssDistTargets = ['index'];

var routes = [
    {dir: 'dist/html', as: '/'},
    {dir: 'dist/css', as: '/css'},
    {dir: 'dist/js', as: '/js'},
    {dir: 'dist/fonts', as: '/fonts'},
    {dir: 'dist/img', as: '/img'},
];

gulp.task('server', function() {
    if(-1 != process.argv.indexOf('-s')) {
        app.use(express.static('html'));
        for(var i = 0; i < routes.length; ++i) {
            app.use(routes[i].as, express.static(routes[i].dir));
        }
        var server = app.listen(3000, function () {
            var opt = {
                host: server.address().address,
                port: server.address().port,
            };
            var host = server.address().address;
            var port = server.address().port;
            var url = 'http://%h:%p'.replace('%h', host).replace('%p', port);
            util.log(
                util.colors.cyan('[express]'),
                util.colors.white('Node server'),
                util.colors.cyan('listening'),
                util.colors.white('at'),
                util.colors.yellow(url),
                util.colors.white('...')
            );
        });
    }
});

var errorHandler = function(target, error, self) {
    util.log(
        util.colors.red('Browserify error:'),
        util.colors.yellow('[' + target + ']'),
        error.message
    );
    self.emit('end');
}

var jsBundleProcesser = function(bundle, out, dest) {
    var shouldUglify = (-1 != process.argv.indexOf('-u'));

    var tempBuffer = bundle
    .on('error', function(e) { errorHandler(out, e, this); })
    .pipe(source(out))
    .pipe(buffer());

    if(shouldUglify) { tempBuffer = tempBuffer.pipe(uglify()); }

    tempBuffer.pipe(gulp.dest(dest));
    return true;
}

var browserifyFromPath = function(target, path, opt_debug) {
    var browserifiedJs = browserify({
        entries: [path.entryPoint], transform: [babelify, shimify],
        cache: {}, packageCache: {}, fullPaths: false, // Requirement of watchify
        debug: opt_debug || false
    });
    if(-1 != process.argv.indexOf('-w')) {
        var watcher = watchify(browserifiedJs);
        watcher
        .on('update', function (event) {
            var updateStart = Date.now();
            util.log(
                util.colors.cyan('Updating'),
                util.colors.yellow('`' + path.destBuild + '/' + path.out + '`'),
                util.colors.white('by'),
                util.colors.yellow('`' + event[0].replace(__dirname, '.') + '`'),
                util.colors.white('...')
            );
            jsBundleProcesser(watcher.bundle(), path.out, path.destBuild);
            util.log(
                util.colors.cyan('Updated'),
                util.colors.yellow('`' + path.destBuild + '/' + path.out + '`'),
                util.colors.white('for'),
                util.colors.magenta((Date.now() - updateStart) + ' ms')
            );
        });
    }
    var bundle = browserifiedJs.bundle();
    jsBundleProcesser(bundle, path.out, path.destBuild);
    return true;
}

var compileFromTargetToPath = function(app, destPath, debug) {
    var reactPath = {
        entryPoint: './js/' + app + '/react/App.react.js',
        destBuild: destPath + '/js/',
        out: app + '.react.js'
    };
    var corePath = {
        entryPoint: './js/' + app + '/core/App.js',
        destBuild: destPath + '/js/',
        out: app + '.js'
    };

    if(-1 != process.argv.indexOf('-w')) {
        gulp.watch('./js/common/react/*.js', function(event) {
            browserifyFromPath(app, reactPath, debug);
            browserifyFromPath(app, corePath, debug);
        });
    }
    browserifyFromPath(app, reactPath, debug);
    browserifyFromPath(app, corePath, debug);
}

gulp.task('js-dist', function() {
    distTargets.map(function(app) {
        compileFromTargetToPath(app, 'dist/', false);
    })
});

var lessFromPath = function(target, path, opt_debug) {
    var shouldUglify = (-1 != process.argv.indexOf('-u'));

    var tempBundle = gulp.src(path.entryPoint)
    .pipe(less())
    .on('error', function(e) { errorHandler(target, e, this); });

    if(shouldUglify) { tempBundle = tempBundle.pipe(cssnano()); }

    tempBundle.pipe(gulp.dest(path.destBuild));
    return true;
}

var compileCssFromTargetToPath = function(app, destPath, debug) {
    var lessPath = {
        entryPoint: './css/' + app + '.less',
        destBuild: destPath + '/css/',
        out: app + '.css'
    };
    lessFromPath(app, lessPath, debug);
}

var distributeCss = function() {
    cssDistTargets.map(function(app) {
        compileCssFromTargetToPath(app, 'dist/', false);
    })
};

gulp.task('css-dist', function() {
    if(-1 != process.argv.indexOf('-w')) {
        gulp.watch('./css/**/*.less', distributeCss)
        .on('change', function(event) {
            util.log(
                util.colors.cyan('Compile'),
                util.colors.yellow('`' + event.path.replace(__dirname, '.') + '`'),
                util.colors.white('because it'),
                util.colors.red(event.type)
            );
        });
    }
    distributeCss();
});

gulp.task('img-dist', function() {
    var shouldUglify = (-1 != process.argv.indexOf('-u'));

    var tempBundle = gulp.src(['./img/**/*.*']);

    if(shouldUglify) {
        tempBundle = tempBundle.pipe(imagemin({
            optimizationLevel: 7, // .png
            progressive: true, // .jpg
            interlaced: true, // .gif
            multipass: true, // .svg
            svgoPlugins: [
                {removeViewBox: true},
                {cleanupIDs: true},
                {removeUselessStrokeAndFill: true},
                {removeEmptyAttrs: true},
            ],
            use: [pngquant()]
        }));
    }

    tempBundle.pipe(gulp.dest('dist/img'));
});

gulp.task('html-dist', function() {
    var tempBundle = gulp.src(['./html/**/*.html']);
    tempBundle.pipe(gulp.dest('dist/html'));
});

gulp.task('compile-lib', function() {
    var bundle = browserify({
        entries: ['./js/lib/lib.js'], transform: [babelify],
        presets: ["react"], debug: false
    })
    .bundle();
    jsBundleProcesser(bundle, 'compiledLib.js', 'dist/js');
    return true;
});

gulp.task('js-lib', function() {
    var shouldUglify = (-1 != process.argv.indexOf('-u'));

    var tmpOutput = gulp.src([
        './js/lib/*.js',
        '!./js/lib/lib.js',
    ])
    .pipe(concat('lib.js'));

    if(shouldUglify) { tmpOutput = tmpOutput.pipe(uglify()); }

    tmpOutput.pipe(gulp.dest('dist/js'));
    
    var tempBundle = gulp.src(['./js/lib/third-party/**/*', './node_modules/jquery/dist/jquery.min.js']);
    tempBundle.pipe(gulp.dest('dist/js/lib'));

});

gulp.task('fonts-lib', function() {
    gulp.src([
        './node_modules/font-awesome/fonts/*.*',
        './node_modules/bootstrap/dist/fonts/*.*'
    ])
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('css-lib', function() {
    var shouldUglify = (-1 != process.argv.indexOf('-u'));

    var tempBundle = gulp.src([
        './node_modules/bootstrap/dist/css/bootstrap.css',
        './node_modules/font-awesome/css/font-awesome.css',
        './node_modules/toastr/build/toastr.css',
    ])
    .pipe(concat('lib.css'));

    if(shouldUglify) { tempBundle = tempBundle.pipe(cssnano()); }

    tempBundle.pipe(gulp.dest('dist/css'));
    
    return true;
});

gulp.task('lib', ['js-lib', 'css-lib', 'compile-lib', 'fonts-lib']);
gulp.task('dist', ['js-dist', 'css-dist', 'img-dist', 'html-dist', 'lib', 'server']);

gulp.task('watch', function() {
    gulp.watch('./js/**/*.js*', ['js-dist']);
    gulp.watch('./html/**/*.html', ['html-dist']);
});
