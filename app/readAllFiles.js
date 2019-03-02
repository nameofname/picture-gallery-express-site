"use strict";

const fs = require('fs');
const _ = require('underscore');
const mime = require('mime');
const diveSync = require('diveSync');
const logger = require('pint-sized-logger');
const diveConf = {
    recursive: true,
    all: false,
    directories: false,
    files: true
};
const arr = [];


module.exports = function (path) {

    // cach the array so that you only ever fetch it once.
    if (arr.length) {
        return arr;
    }

    // read all the files in the images dir
    diveSync(path, diveConf, function(err, fsPath) {
        if (err) {
            logger.error(err);
            return;
        }

        // filter out anything that is not an image.
        const exists = fs.existsSync(fsPath);
        logger.trace('exists', exists, fsPath)
        if (exists) {
            const isImage = mime.lookup(fsPath).split('/')[0] === 'image';
            const isSymlink = fs.lstatSync(fsPath).isSymbolicLink();
            const test = isImage && !isSymlink;

            if (test) {
                arr.push(fsPath);
            }
        }
    });

    return arr;
};