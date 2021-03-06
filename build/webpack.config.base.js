var path = require('path');
var utils = require('./utils');
var config = require('../config');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    entry: {
        app: './examples/index.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: resolve('examples')
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 1000,
                name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 1000,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        }]
    }
};