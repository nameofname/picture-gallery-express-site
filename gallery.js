var express = require('express');
var app = express();
var dive = require('dive');
var imagesDir = express.static(__dirname + '../pics/inspiration/');
var imagesPath = __dirname + '/../pics/inspiration/';
var fs = require('fs');

//app.use('/images*', function (req, res) {
//    return res.send('iamges');
//});
//app.use('/images*', imagesDir); 

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
    var index = 0; 
    var arr = fs.readdirSync(imagesPath, function (err, files) {
        return files;
    });
    var out = [];
    arr.forEach(function (file) {
        var fileName = prefix + file;
        out.push(fileName);
        if (out.length > 30) {
            return res.json(out);
        }
    });
});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
