"use strict";

var _ = require('underscore');
var mime = require('mime');
var diveSync = require('diveSync');
var diveConf = {
    recursive: true,
    all: false,
    directories: false,
    files: true
};
var arr = [];


module.exports = function (path) {

    // cach the array so that you only ever fetch it once.
    if (arr.length) {
        return arr;
    }

    // read all the files in the images dir
    diveSync(path, diveConf, function(err, fsPath) {
        if (err) {
            throw err;
        }

        // filter out anything that is not an image.
        var test = mime.lookup(fsPath).split('/')[0] === 'image';

        if (test) {
            arr.push(fsPath);
        }
    });

    return arr;
};