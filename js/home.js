var $doc = $(document);
var offset = -30;
var limit = 0;
var urlBase = '/ajax';
var template = _.template('<div class="img"><img width="500px" src="<%= image.src %>" /></div>', null, {variable : 'image'});
var _addImages = function (data) {
    _.each(data, function (val) {
        var image = template({src : val});
        $('body').append(image);
    });

    setTimeout(function () {
        $('body').masonry({
            itemSelector: '.img',
            columnWidth: 500
        });
    }, 1000);
};
var _getImages = function () {
    limit += 30;
    offset += 30;
    var url = urlBase + '?' + $.param({
            offset : offset,
            limit : limit
        });

    $.getJSON(url, _addImages);
};

_getImages();

$doc.on('scroll', function () {
    var currHeight = $doc.scrollTop() + $(window).height();
    var maxHeight = $doc.height();
    if (currHeight >= maxHeight) {
        _getImages();
    }
});