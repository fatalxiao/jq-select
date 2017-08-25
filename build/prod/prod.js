delete process.env['DEBUG_FD'];

process.env.NODE_ENV = '"production"';

var ora = require('ora');
var chalk = require('chalk');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.prod.js');

var spinner = ora('building for production...');
spinner.start();

webpack(webpackConfig, function (err, stats) {

    spinner.stop();

    if (err) {
        throw err;
    }

    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n');

    console.log(chalk.cyan('Build complete.'));

});