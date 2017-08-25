var path = require('path');
var utils = require('./../utils');
var webpack = require('webpack');
var config = require('../../config/index');
var CopyWebpackPlugin = require('copy-webpack-plugin');
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
        filename: utils.assetsPath('[name].min.js'),
        chunkFilename: utils.assetsPath('[id].min.js')
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
                name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 1000,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
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
            filename: utils.assetsPath('[name].min.css')
        }),

        new OptimizeCSSPlugin(),

        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../../lib'),
            to: config.build.assetsSubDirectory,
            ignore: ['.*']
        }])

    ]
};