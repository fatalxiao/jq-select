var path = require('path');

module.exports = {

    dev: {

        env: require('./dev.env'),
        port: 3000,
        autoOpenBrowser: true,
        srcRoot: path.resolve(__dirname, '../examples'),
        index: path.resolve(__dirname, '../examples/index.html'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        assetsVirtualRoot: path.posix.join('/', 'static'),
        proxyTable: {},
        cssSourceMap: false

    },

    build: {

        env: require('./prod.env'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/'

    },

    prod: {

        env: require('./prod.env'),
        index: path.resolve(__dirname, '../docs/index.html'),
        assetsRoot: path.resolve(__dirname, '../docs'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/'

    },

    demo: {

        port: 3001

    }

};