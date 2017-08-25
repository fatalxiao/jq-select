delete process.env['DEBUG_FD'];

process.env.NODE_ENV = '"production"';

var express = require('express'),
    opn = require('opn'),

    app = express(),
    config = require('../../config'),
    port = config.demo.port,
    uri = 'http://localhost:' + port;

app.use(express.static(config.prod.assetsRoot));

app.listen(port, function (err) {

    if (err) {
        console.log(err);
        return;
    }

    console.log('> Listening at ' + uri);

    opn(uri);

});