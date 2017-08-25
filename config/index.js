var path = require('path');

module.exports = {

    dev: {

        env: require('./dev.env'),
        port: 3000,
        autoOpenBrowser: true,
        srcRoot: path.resolve(__dirname, '../examples'),
        index: path.resolve(__dirname, '../examples/index.html'),
        assetsSubDirectory: 'lib',
        assetsPublicPath: '/',
        assetsVirtualRoot: path.posix.join('/', 'lib'),
        proxyTable: {},
        cssSourceMap: false

    },

    build: {

        env: require('./prod.env'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'lib',
        assetsPublicPath: '/'

    },

    prod: {

        env: require('./prod.env'),
        index: path.resolve(__dirname, '../docs/index.html'),
        assetsRoot: path.resolve(__dirname, '../docs'),
        assetsSubDirectory: 'lib',
        assetsPublicPath: '/'

    },

    demo: {

        port: 3001

    }

};