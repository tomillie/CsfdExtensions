// converts youtube's ISO8601 time into readable format minutes:seconds
function iso8601TimeToHMS(s) {

    var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    var hours = 0, minutes = 1, seconds = 0;

    if (reptms.test(s)) {
        var matches = reptms.exec(s);
        if (matches[1]) hours = Number(matches[1]);
        if (matches[2]) minutes = Number(matches[2]);
        if (matches[3]) seconds = Number(matches[3]);
    }

    minutes = minutes + (hours * 60);

    return (minutes < 10 ? '0' + minutes : minutes) + ":" + (seconds < 10 ? '0' + seconds : seconds);
}

$(document).ready(function(){

    // TITLE OF THE MOVIE IN ORIGINAL LANGUAGE
    // removes all from the creation year to the end
    var title = $(document).attr('title');
    title = title.slice(0, title.indexOf('|') - 8 - title.length);

    // removes all before '/'
    if (title.indexOf('/') !== -1) {
        title = title.substring(title.indexOf("/") + 2);
    }

    // removes type of the work
    var extraWords = ["(video film)", "(TV film)", "(TV seriál)", "(TV pořad)", "(divadelní záznam)", "(koncert)", "(studentský film)", "(amatérský film)", "(hudební videoklip)"]

    for (var i = 0; i < extraWords.length; ++i) {
        title = title.replace(extraWords[i], '');
        title = title.trim();
    }

    // moves The/Der/Die/Das/Los/Las/El/La/An/A at the beggining of the title
    var compRaw = "";
    var comp = "";

    // A
    if (title.substr(-3) == ", A") {
        title = "A " + title.slice(0, -3);
    }
    
    // An, El, La
    compRaw = title.substr(-2);
    comp = title.substr(-4);
    if (comp == ", An" || comp == ", El" || comp == ", La") {
        title = compRaw + " " + title.slice(0, -4);
    }

    // The, Der, Die, Das, Los, Las
    compRaw = title.substr(-3);
    comp = title.substr(-5);
    if (comp == ", The" || comp == ", Der" || comp == ", Die" || comp == ", Das" || comp == ", Los" || comp == ", Las") {
        title = compRaw + " " + title.slice(0, -5);
    }

    // FEATURES
    try {
        var keys = new Array();
        keys[0] = "imdbRating";
        keys[1] = "youtubeTrailer";
        keys[2] = "torrentSearch";
        keys[3] = "subtitleSearch";
        keys[4] = "goUp";
        
        chrome.storage.local.get(keys, function (result) {
            valImdb = result.imdbRating;
            valYoutube = result.youtubeTrailer; 
            valTorrent = result.torrentSearch; 
            valSubtitle = result.subtitleSearch; 
            valGoUp = result.goUp; 

            // IMDB RATING
            if (valImdb == "1" || valImdb == null) {
                // reserve space between CSFD rating and user rating
                $("#rating").after('<div id="imdb_rating">N/A</div>');

                // find a link to the IMDB profile
        		var imdb_link = $("img.imdb").parent().attr('href');
        		if (imdb_link) {
        			var imdb_id = imdb_link.split('/');
        			if (imdb_id[imdb_id.length - 1] == "" || "combined" == imdb_id[imdb_id.length - 1]) {
        				imdb_id = imdb_id[imdb_id.length - 2];
        			} else {
        				imdb_id = imdb_id[imdb_id.length - 1];
        			}
        			var api_url = "http://www.imdbapi.com/?i=" + imdb_id;
        		}
        			
                // get data
        		var json = (function () {
        			$.ajax({
        				'async': true,
        				'global': false,
        				'url': api_url,
        				'dataType': "json",
        				'success': function (data) {
                            $("#imdb_rating").html('<a href="' + imdb_link + '">' + data.imdbRating + '</a>');
        				}
        			});
        		})();
                
            }    
            
            // YOUTUBE TRAILER
            var developerKey = "AIzaSyB4oumidwVxj-I-0bIQBKXBwBgS0YXXU0I";
            var current_url = window.location.href;

            if ((valYoutube == "1" || valYoutube == null) && current_url.indexOf("videa") !== -1) {
                // youtube search
                var jsonYoutube = (function () {
                    var jsonYoutube = null;
                    $.ajax({
                        'async': true,
                        'global': false,
                        'url': 'https://www.googleapis.com/youtube/v3/search?q=' + title + ' trailer' + 
                            '&part=snippet&maxResults=1&order=relevance&type=video&videoEmbeddable=true&key=' + developerKey,
                        'dataType': "json",
                        'success': function (data) {
                            jsonYoutube = data;

                            // id of the youtube video
                            var youtubeTrailerId = jsonYoutube.items[0].id.videoId;  

                            // youtube video data
                            var jsonVideoData = (function () {
                                $.ajax({
                                    'async': true,
                                    'global': false,
                                    'url': 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=' + youtubeTrailerId + '&key=' + developerKey,
                                    'dataType': "json",
                                    'success': function (data) {
                                        var youtubeTrailerDuration = data.items[0].contentDetails.duration; 
                                        youtubeTrailerDuration = iso8601TimeToHMS(youtubeTrailerDuration);

                                        // placing the video on the page
                                        $("#videoPlayer1").parent().parent().before('<li>' +
                                                                                        '<div class="ui-video-player">' + 
                                                                                            '&nbsp;&nbsp;<iframe width="660" height="371" src="http://www.youtube.com/embed/' + youtubeTrailerId + '?vq=hd1080" frameborder="0" allowfullscreen></iframe>' + 
                                                                                            '<div style="width: 660px" class="toolbar-main">' + 
                                                                                                '<div>' + 
                                                                                                    '<div class="description">YouTube Trailer</div>' + 
                                                                                                    '<span class="duration">' + youtubeTrailerDuration + '</span>' + 
                                                                                                '</div>' +
                                                                                            '</div>' + 
                                                                                        '</div>' + 
                                                                                     '</li>');
                                    }
                                });
                            })();
		
                        }
                    });
                })();                 

            }
            
            // TORRENT AND SUBTITLES DOWNLOAD
            if (valTorrent == "1" || valTorrent == null || valSubtitle == "1" || valSubtitle == null) {

                var links_url = "http://chrome.tomizzi.com/csfd-extension-links.json";
                var cc_names = [];
                var cc_urls = [];
                var torrent_names = [];
                var torrent_urls = [];

                // pozor, getJSON() beží asynchrónne
                $.getJSON(links_url, function (json_data) {
                    $.each(json_data.links, function(index, element) {
                        if (element.type == "cc") {
                            cc_names.push(element.name);
                            cc_urls.push(element.url);
                        } else if (element.type == "torrent") {
                            torrent_names.push(element.name);
                            torrent_urls.push(element.url);
                        }
                    });

                    // SUBTITLES
                    var cc =    '<div id="share">' + 
                                    '<ul class="ext">' + 
                                        '<li><img src="' + chrome.extension.getURL("img/cc.gif") + '"></li>';

                    for (var i = 0; i < cc_names.length; ++i) {
                        cc_urls[i] = cc_urls[i].replace('%%QUERY%%', title)
                        cc += '<li><a href="' + cc_urls[i] + '">' + cc_names[i] + '</a></li>';
                    }

                    cc +=           '</ul>' +  
                                    '<div class="clear"></div>' + 
                                '</div>';

                    if (valSubtitle == "1" || valSubtitle == null) {
                        $("#share").after(cc);
                    }

                    // TORRENTS
                    var torrent =   '<div id="share">' + 
                                        '<ul class="ext">' + 
                                            '<li><img src="' + chrome.extension.getURL("img/utorrent.jpg") + '"></li>';

                    for (var i = 0; i < torrent_names.length; ++i) {
                        torrent_urls[i] = torrent_urls[i].replace('%%QUERY%%', title)
                        torrent += '<li><a href="' + torrent_urls[i] + '">' + torrent_names[i] + '</a></li>';
                    }

                    torrent +=          '</ul>' +  
                                        '<div class="clear"></div>' + 
                                    '</div>';
                    
                    if (valTorrent == "1" || valTorrent == null) {
                        $("#share").after(torrent);
                    }
                });

            }
                              
            // GO UP LINK
            if (valGoUp == "1" || valGoUp == null) {
                $("#page-header").before('<a name="#top"></a><a href="#top" class="go_up"><img src="' + chrome.extension.getURL("img/up.png") + '"></a>');
            }
            
            // REMOVE SOME ADS
            $("#ad-wrapper").remove();

        });
        
    } catch (err) {
            // error
    }
});