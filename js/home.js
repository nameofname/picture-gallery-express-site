var $doc = $(document);
var $images;
var $footer;
var incrementor = 30;
var offset = 0 - incrementor;
var limit = 0;
var width = 300;
var urlBase = '/ajax';
var tmpString = '<div class="img">' +
    '<a target="_blank" href="<%= image.src %>">' +
    '<img width="' + width + 'px" src="<%= image.src %>" />' +
    '</a>' +
    '</div>';
var template = _.template(tmpString, null, {variable : 'image'});
var doneMessage1 = '<h1>THIS IS THE END OF ALL THE IMAGES.</h1>';
var doneMessage2 = '<h1>STOP ASKING FOR MORE IMAGES.</h1>';
var _initSelectors = function () {
    $images = $('#images');
    $footer = $('#footer');
};
var _addImages = function (data) {
    _.each(data, function (val) {
        var img = val.split('/');
        img = img.map(encodeURIComponent);
        var html = template({src : img.join('/')});
        $images.append(html);
    });

    $images.imagesLoaded(function() {
        new Masonry(document.querySelector('#images'), {
            itemSelector: '.img',
            columnWidth: width + 15
        });
    });

    if (data.length < incrementor) {
        $footer.append(Math.random() > 0.5 ? doneMessage1 : doneMessage2);
    }
};
var _getImages = function () {
    limit += incrementor;
    offset += incrementor;
    var url = urlBase + '?' + $.param({
            offset : offset,
            limit : limit
        });

    $.getJSON(url, _addImages);
};
var _initScroll = function () {
    $doc.on('scroll', function () {
        var currHeight = $doc.scrollTop() + $(window).height();
        var maxHeight = $doc.height();
        if (currHeight >= maxHeight) {
            _getImages();
        }
    });
};

// Get the initial batch of images, then set up scroll event to get more every time we get to the bottom :
$doc.ready(function () {

    _getImages();
    _initSelectors();
    _initScroll();

});
