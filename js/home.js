var $doc = $(document);
var offset = -30;
var limit = 0;
var width = 300;
var urlBase = '/ajax';
var tmpString = '<div class="img">' +
    '<a target="_blank" href="<%= image.src %>">' +
    '<img width="' + width + 'px" src="<%= image.src %>" />' +
    '</a>' +
    '</div>';
var template = _.template(tmpString, null, {variable : 'image'});
var _addImages = function (data) {
    _.each(data, function (val) {
        var image = template({src : val});
        $('body').append(image);
    });

    $('body').imagesLoaded(function(){
        new Masonry(document.querySelector('body'), {
            itemSelector: '.img',
            columnWidth: width + 15
        });
    });
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