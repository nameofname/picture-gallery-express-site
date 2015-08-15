var express = require('express');
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
    var offset = req.query.offset || 0;
    var limit = req.query.limit || 30;
    var fileName;
    var fullPath;
    var isImage;
    var arr = fs.readdirSync(imagesPath, function (err, files) {
        return files;
    });

    lewp:
    for (var idx = offset; idx < limit; idx++) {
        fullPath = imagesPath + arr[idx];
        isImage = mime.lookup(fullPath).split('/')[0] === 'image';
        if (arr[idx] && isImage) {
            fileName = prefix + arr[idx];
            out.push(fileName);
        }
        if (arr.length === limit) {
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
