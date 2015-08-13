$.getJSON('/ajax', function (data) {
    console.log(data);
    _.each(data, function (val) {
        var image = $('<image width="500px" src="'+ val +'" />');
        $('body').append(image)
        console.log(image);
    });
});
