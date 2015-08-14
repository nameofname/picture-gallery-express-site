var express = require('express');
var app = express();
//var imagesDir = express.static(__dirname + '../pics/inspiration/');
var imagesPath = __dirname + '/../pics/inspiration/';
var fs = require('fs');

app.use('/css', express.static(__dirname + '/css'));

console.log(fs.realpathSync(imagesPath));
app.use('/images', express.static(fs.realpathSync(imagesPath)));

app.use('/js', express.static(__dirname + '/js'));

app.set('views', __dirname + '/html');

console.log('ronalding !!!!!!!!!!!!!!!!!!!!');

app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
  return res.render('index.html');
});

app.use('/ajax', function (req, res, next) {
    var prefix = '/images/';
    var arr = fs.readdirSync(imagesPath, function (err, files) {
        return files;
    });
    var out = [];
    var offset = req.query.offset || 0;
    var limit = req.query.limit || 30;

    lewp:
    for (var idx = offset; idx < limit; idx++) {
        var fileName = prefix + arr[idx];
        out.push(fileName);
        if (idx === limit) {
            break lewp;
        }
    }
    return res.json(out);
});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
