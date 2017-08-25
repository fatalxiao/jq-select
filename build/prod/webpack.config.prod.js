var path = require('path');
var utils = require('./../utils');
var webpack = require('webpack');
var config = require('../../config/index');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./../webpack.config.base.js');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

var env = config.prod.env;

var webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.prod.productionSourceMap,
            extract: true
        })
    },
    devtool: false,
    output: {
        publicPath: './',
        path: config.prod.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    plugins: [

        new webpack.DefinePlugin({
            'process.env': env
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),

        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css')
        }),

        new OptimizeCSSPlugin(),

        new HtmlWebpackPlugin({
            filename: config.prod.index,
            template: './examples/index.html',
            favicon: './examples/assets/images/favicon.ico',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            chunksSortMode: 'dependency'
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                return (
                    module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                );
            }
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),

        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../../static'),
            to: config.prod.assetsSubDirectory,
            ignore: ['.*']
        }])

    ]
});

module.exports = webpackConfig;