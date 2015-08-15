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
    var offset = parseInt(req.query.offset) || 0;
    var limit = parseInt(req.query.limit) || 30;
    var max = limit; // max must be different than limit so it can be incremented below
    var fileName;
    var fullPath;
    var isImage;
    var arr = fs.readdirSync(imagesPath, function (err, files) {
        return files;
    });

    // Iterate from the offset to the limit. For each iteration, push the next image to the output array IF it is
    // not undefined and is an image. If the file is not an image, increment max but not limit so that the loop tries
    // again. Break on finding an undefined index (at the end of the images array) or when your output array reaches
    // the limit.
    lewp:
    for (var i = offset; i <= max; i++) {
        fullPath = imagesPath + arr[i];
        isImage = mime.lookup(fullPath).split('/')[0] === 'image';

        if (!arr[i]) {
            break lewp;
        }

        if (arr[i] && isImage) {
            fileName = prefix + arr[i];
            out.push(fileName);
        } else {
            max++;
        }
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
