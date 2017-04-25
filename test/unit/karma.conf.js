const path = require('path')
const srcPath = path.resolve(__dirname, '../../')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')

module.exports = function(config) {
    config.set({
        frameworks: ['mocha', 'sinon-chai'],
        files: [
            './specs/*.spec.js'
        ],
        preprocessors: {
            './specs/*.spec.js': ['rollup']
        },
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],
        singleRun: false,
        concurrency: Infinity,
        rollupPreprocessor: {
            plugins: [ babel(), replace({
                "process.env.NODE_ENV": '"development"'
            })],
            moduleName: 'VueDragging',
            format: 'iife',
            sourceMap: 'inline',

        }
    })
}
