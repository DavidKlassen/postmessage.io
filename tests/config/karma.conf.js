module.exports = function (config) {
    config.set({
        basePath: '../../',
        frameworks: ['mocha', 'browserify'],
        files: [
            'dist/postmessage.io.min.js',
            'tests/config/setup.js',
            'tests/integration/**/*.js'
        ],
        preprocessors: {
            'tests/{config/setup,integration/**/*}.js': ['browserify']
        },
        browserify: {
            debug: true,
            transform: ['babelify']
        },
        reporters: ['spec'],
        colors: true,
        browsers: ['PhantomJS']
    });
};
