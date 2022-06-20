"use strict";

var express = require('express');
var fs = require('fs');
var readAllFiles = require('./readAllFiles');
var ejs = require('ejs');

module.exports = function (conf) {

    const app = express();

    app.use('/css', express.static(__dirname + '/../css'));

    app.use('/images', express.static(fs.realpathSync(conf.imageDir)));

    app.use('/js', express.static(__dirname + '/../js'));

    app.set('views', __dirname + '/../html');

    app.engine('html', ejs.renderFile);

    app.get('/', function (req, res) {
        return res.render('index.html');
    });

    app.use('/ajax', function (req, res, next) {
        const prefix = '/images/';
        const out = [];
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 30;
        let fileName;
        const arr = readAllFiles(conf.imageDir);

        lewp:
            for (let i = offset; i < limit; i++) {
                if (!arr[i]) {
                    break lewp;
                }

                fileName = arr[i].split(conf.imageDir)[1];
                fileName = prefix + fileName;

                console.log('looking at the following : ');
                console.log(arr[i]);
                console.log(conf.imageDir);
                console.log(arr[i].split(conf.imageDir));

                out.push(fileName);

                if (out.length === limit) {
                    break lewp;
                }
            }
        console.log('returned the following images', out);
        return res.json(out);
    });

    // not related to the core app, testing moving script tags around a page and seeing how it affects rendering :
    app.use('/renderTest', function(req, res, next) {
        return res.render('renderTest.html');
    });
    app.use('/slow/script.js', function(req, res, next) {
        setTimeout(function() {
            res.send('console.log("It is loaded!")');
        }, 2000);
    });

    console.log(`Starting express with port ${conf.port} and image dir ${conf.imageDir}`);
    app.listen(conf.port);
};
