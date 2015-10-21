"use strict";

module.exports = function () {

    var express = require('express');
    var app = express();
    var imagesPath = require('./conf').imageDir;
    var fs = require('fs');
    var readAllFiles = require('./readAllFiles');

    app.use('/css', express.static(__dirname + '/../css'));

    app.use('/images', express.static(fs.realpathSync(imagesPath)));

    app.use('/js', express.static(__dirname + '/../js'));

    app.set('views', __dirname + '/../html');

    app.engine('html', require('ejs').renderFile);

    app.get('/', function (req, res) {
        return res.render('index.html');
    });

    app.use('/ajax', function (req, res, next) {
        var prefix = '/images/';
        var out = [];
        var offset = parseInt(req.query.offset) || 0;
        var limit = parseInt(req.query.limit) || 30;
        var fileName;
        var arr = readAllFiles(imagesPath);

        lewp:
            for (var i = offset; i < limit; i++) {
                if (!arr[i]) {
                    break lewp;
                }

                fileName = arr[i].split(imagesPath)[1];
                fileName = prefix + fileName;

                console.log('looking at the following : ');
                console.log(arr[i]);
                console.log(imagesPath);
                console.log(arr[i].split(imagesPath));



                out.push(fileName);

                if (out.length === limit) {
                    break lewp;
                }
            }
        console.log('returned the following images', out);
        return res.json(out);
    });


    var server = app.listen(3000, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Image Gallery app listening at http://%s:%s', host, port);
    });

};
