$(function whenDomIsReady(){
    setTimeout(function afterRetrievingVieos() {
        var videos = [
            {
                title: 'JOURNEY TO JAH - Gentleman Ft. Alborosie',
                src: 'https://www.youtube.com/watch?v=dN8FTAx06rE&list=RDdN8FTAx06rE'
            },
            {
                title: 'Suga Roy & Conrad Crystal feat. Alborosie - Run Come',
                src: 'https://www.youtube.com/watch?v=JEXDg8fz8uI&index=2&list=RDdN8FTAx06rE'
            }
        ];

    $('the-list-of-videos .loading').hide();

    var videosHtml = _.reduce(videos, function(html, video) {
        html = '<li class="video">' +
            ' <h2>' + video.title + '</h2>' +
            ' <iframe width="640" height="390" src="'+ video.src +'"frameborder="0" allowfullscreen></iframe>' +
            '</li>';
        return html;
    },'');

    $('the-list-of-videos ul').replaceWith(videosHtml);

    }, 750);

});



