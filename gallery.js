var express = require('express');
var _ = require('underscore');
var app = express();
var mime = require('mime');
var imagesPath = __dirname + '/../pics/inspiration/';
var fs = require('fs');

app.use('/css', express.static(__dirname + '/css'));

app.use('/images', express.static(fs.realpathSync(imagesPath)));

app.use('/js', express.static(__dirname + '/js'));

app.set('views', __dirname + '/html');

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
    var fullPath;
    // read all the files in the images dir then filter out anything that is not an image.
    var arr = _.filter(fs.readdirSync(imagesPath), function (file) {
        fullPath = imagesPath + file;
        var test = mime.lookup(fullPath).split('/')[0] === 'image';
        console.log('testing out this shit. ', test);
        return test;
    });

    lewp:
    for (var i = offset; i < limit; i++) {
        if (!arr[i]) {
            break lewp;
        }

        fileName = prefix + arr[i];
        out.push(fileName);

        if (out.length === limit) {
            break lewp;
        }
    }
    return res.json(out);
});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Image Gallery app listening at http://%s:%s', host, port);
});
