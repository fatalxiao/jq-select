var path = require('path');
var utils = require('./../utils');
var webpack = require('webpack');
var config = require('../../config/index');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

var env = config.prod.env;

module.exports = {
    devtool: false,
    entry: {
        app: './examples/index.js'
    },
    output: {
        publicPath: './',
        path: config.prod.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
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
            sourceMap: config.prod.productionSourceMap,
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
            sourceMap: true
        }),

        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css')
        }),

        new OptimizeCSSPlugin(),

        new HtmlWebpackPlugin({
            filename: config.prod.index,
            template: './examples/index.html',
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
};