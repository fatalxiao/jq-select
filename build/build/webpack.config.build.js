var path = require('path');
var utils = require('./../utils');
var webpack = require('webpack');
var config = require('../../config/index');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./../webpack.config.base.js');
var CopyWebpackPlugin = require('copy-webpack-plugin');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

var env = config.build.env;

var webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    entry: {
        app: './src/JQSelect.js'
    },
    output: {
        publicPath: './',
        path: config.build.assetsRoot,
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

        // new HtmlWebpackPlugin({
        //     filename: config.build.index,
        //     template: './examples/index.html',
        //     favicon: './examples/assets/images/favicon.ico',
        //     inject: true,
        //     minify: {
        //         removeComments: true,
        //         collapseWhitespace: true
        //     },
        //     chunksSortMode: 'dependency'
        // }),

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
            to: config.build.assetsSubDirectory,
            ignore: ['.*']
        }])

    ]
});

module.exports = webpackConfig;