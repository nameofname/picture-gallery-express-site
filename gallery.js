#! /usr/bin/env node

"use strict";

const path = require('path');
const yargs = require('yargs');
const server = require('./app/expressServer');
const conf = require('./app/conf');

var argv = yargs
    .usage('Usage: $0 [str]')
    .demandOption(['p'])
    .alias('p', 'path')
    .describe('p', 'Path to image directory')
    .argv;

const { p } = argv;
const imageDir = path.resolve(process.cwd(), p);

server(Object.assign(conf, { imageDir }));