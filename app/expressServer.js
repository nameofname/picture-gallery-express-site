"use strict";

module.exports = function () {

    var express = require('express');
    var app = express();
    var conf = require('./conf');
    var imagesPath = conf.imageDir;
    var port = conf.port;
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
        const prefix = '/images/';
        const out = [];
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 30;
        let fileName;
        const arr = readAllFiles(imagesPath);

        lewp:
            for (let i = offset; i < limit; i++) {
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


    const server = app.listen(3000, function () {
        const host = server.address().address;
        const port = server.address().port;
        console.log('Image Gallery app listening at http://%s:%s', host, port);
    });

};
