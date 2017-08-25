var utils = require('./../utils');
var webpack = require('webpack');
var config = require('../../config/index');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

var env = config.build.env;

module.exports = {
    devtool: false,
    entry: {
        JQSelect: './src/JQSelect.js'
    },
    output: {
        publicPath: './',
        path: config.build.assetsRoot,
        filename: utils.distPath('[name].min.js'),
        chunkFilename: utils.distPath('[id].min.js')
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader'
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 1000,
                name: utils.distPath('images/[name].[ext]')
            }
        }, ...utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })]
    },
    plugins: [

        new webpack.DefinePlugin({
            'process.env': env
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: false
        }),

        new ExtractTextPlugin({
            filename: utils.distPath('[name].min.css')
        }),

        new OptimizeCSSPlugin()

    ]
};