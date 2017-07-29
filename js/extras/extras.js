var keys = new Array();
keys[0] = "imdbRating";
keys[1] = "favUsersRating";
keys[2] = "youtubeTrailer";
keys[3] = "episodes";
keys[4] = "torrentSearch";
keys[5] = "subtitleSearch";
keys[6] = "goUp";
keys[7] = "tvSerieEnding";
keys[8] = "originalLanguage";

chrome.storage.local.get(keys, function(result) {
    valImdb = result.imdbRating;
    valFavUsersRating = result.favUsersRating;
    valYoutube = result.youtubeTrailer;
    valEpisodes = result.episodes;
    valTorrent = result.torrentSearch;
    valSubtitle = result.subtitleSearch;
    valGoUp = result.goUp;
    valTvSerieEnding = result.tvSerieEnding;
    valOriginalLanguage = result.originalLanguage;


    if (valImdb == 1 || valImdb == null ||
        valYoutube == 1 || valYoutube == null ||
        valSubtitle == 1 || valSubtitle == null ||
        valTorrent == 1 || valTorrent == null ||
        valEpisodes == 1 || valEpisodes == null ||
        valTvSerieEnding == 1 || valTvSerieEnding == null ||
        valOriginalLanguage == 1 || valOriginalLanguage == null) {

        var currentUrl = window.location.href;
        var cache;

        // first, get some data from the API
        var title = "";
        var imdbRating = "";
        var yearEnd = "";
        var language = "";

        // find a link to the IMDB profile
        var imdbLink = $("img.imdb").parent().attr('href');
        if (imdbLink) {
            var imdbId = imdbLink.split('/');
            if (imdbId[imdbId.length - 1] == "" || "combined" == imdbId[imdbId.length - 1]) {
                imdbId = imdbId[imdbId.length - 2];
            } else {
                imdbId = imdbId[imdbId.length - 1];
            }

            var apiKey = "582BD8F699A9666AF3B8431E5B624";
            var apiUrl = "https://imdbapi.tomizzi.com/api.php?id=" + imdbId + "&api_key=" + apiKey;
        }
        var imdbLink_pretty = imdbLink.replace('combined', '');

        // check the cache
        $.when(retrieveFromCache(CacheType.MOVIE, getCsfdIdFromUrl(currentUrl))).then(function(result) {
            cache = result;
            if (typeof cache != 'undefined' && cache != null && cache.movieInfo != null) {
                title = cache.movieInfo.title;
                imdbRating = cache.movieInfo.imdbRating;
                yearEnd = cache.movieInfo.yearEnd;
                language = cache.movieInfo.language;

                // display features
                addFeatures();
            } else {
                // not cached yet
                $.ajax({
                    'async': true,
                    'global': false,
                    'url': apiUrl,
                    'dataType': "json",
                    'success': function(data) {
                        title = data.Title;
                        data.Rating ? imdbRating = data.Rating : imdbRating = "N/A";
                        yearEnd = data.YearEnd;
                        language = data.Language;

                        // display features
                        addFeatures();

                        // store to the cache
                        var movieInfo = normalizeMovieInfoObject(title, imdbRating, yearEnd, language);
                        storeToCache(CacheType.MOVIE, normalizeMovieObject(movieInfo, null, null, null, null, $.now()), getCsfdIdFromUrl(currentUrl));
                    }
                });
            }
        });
    }


    /**
     * Adds features to the CSFD website, such as IMDB rating, favourite users rating,
     * orignal language, YouTube trailer, go-up link, year end and episodes of a TV show.
     */
    function addFeatures() {

        var titleDecoded = decodeEntities(title);

        // IMDB RATING
        if (valImdb == "1" || valImdb == null) {
            $("#rating").after('<div id="imdb_rating"><a href="' + imdbLink_pretty + '">' + imdbRating + '</a></div>');
        }

        // FAVOURITE USERS RATING
        if (valFavUsersRating == "1" || valFavUsersRating == null) {
            var favCount = 0;
            var favSum = 0;

            $(".favorite > img").each(function() {
                favCount++;
                favSum += parseInt($(this).attr("width"));
            });

            $(".favorite > span > strong.rating").each(function() {
                favCount++;
            });

            // width size = number of stars
            // 40 = 5*
            // 32 = 4*
            // 24 = 3*
            // 16 = 2*
            //  8 = 1*
            if (favCount > 0) {
                var favRating = (((favSum / 8) / favCount) * 20).toFixed();
                $("#rating > h2").after('<strong class="hcenter">' + favRating + '% hodnocení oblíbených uživatelů</strong>');
            }
        }

        // ORIGINAL LANGUAGE
        if ((valOriginalLanguage == "1" || valOriginalLanguage == null) && language) {
            language = transalteOriginalLanguage(language);
            language = language.replace(/\|/g, ", ");
            $(".genre").after('<p>Jazyk originálu: ' + language + '</p>');
        }

        // END YEAR
        if ((valTvSerieEnding == "1" || valTvSerieEnding == null) && yearEnd) {
            var origin = $(".origin").text();
            var yearStart = origin.match(/\d{4}/g);
            origin = origin.replace(/\d{4}/g, yearStart[0] + "-" + yearEnd);
            $(".origin").text(origin);
        }

        // EPISODES
        if (valEpisodes == "1" || valEpisodes == null) {
            // check if it's a TV show
            var titleTag = $(document).attr('title');

            if (titleTag.indexOf("(TV seriál)") >= 0) {
                // start displaying the episodes
                $("#plots").after('<div id="plots" class="ct-related">' +
                    '<div class="header"><h3>Epizódy</h3></div>' +
                    '<div class="content">' +
                    '<div class="ui-collapsible collapsed" id="eph4" data-collapsible="1">' +
                    '<h4 class="title">Načíst</h4>' +
                    '</div>' +
                    '</div>' +
                    '</div>');

                var loaded = false;
                var collapsed = true;

                $("#eph4 > h4").click(function() {
                    if (collapsed) {
                        $(this).removeClass("collapsed");
                        collapsed = false;
                        $("#eph4 > h4").text("Skrýt");
                        $("#eph4 > .content").css("display", "block");
                        if (!loaded) {
                            // check the cache
                            if (cache != null && cache.episodes != null && typeof cache.episodes != 'undefined') {
                                printEpisodes(cache.episodes);
                            } else {
                                getEpisodes(title, getCsfdIdFromUrl(currentUrl));
                                loaded = true;
                            }
                        }
                    } else {
                        $(this).addClass("collapsed");
                        collapsed = true;
                        $("#eph4 > h4").text("Zobrazit");
                        $("#eph4 > .content").css("display", "none");
                    }
                });
            }
        }

        // YOUTUBE TRAILER
        var developerKey = "AIzaSyB4oumidwVxj-I-0bIQBKXBwBgS0YXXU0I";

        if ((valYoutube == "1" || valYoutube == null) && currentUrl.indexOf("videa") !== -1) {
            if (cache != null && cache.youtubeVideo != null && typeof cache.youtubeVideo != 'undefined' && cache.youtubeVideo.id != null && cache.youtubeVideo.duration != null) {
                // place the video on the page
                placeVideoOnPage(cache.youtubeVideo.id, cache.youtubeVideo.duration);
            } else {
                var jsonYoutube = null;
                $.ajax({
                    'async': true,
                    'global': false,
                    'url': 'https://www.googleapis.com/youtube/v3/search?q=' + titleDecoded + ' trailer' +
                        '&part=snippet&maxResults=1&order=relevance&type=video&videoEmbeddable=true&key=' + developerKey,
                    'dataType': "json",
                    'success': function(data) {
                        // id of the youtube video
                        var youtubeTrailerId = data.items[0].id.videoId;

                        // youtube video info
                        $.ajax({
                            'async': true,
                            'global': false,
                            'url': 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=' + youtubeTrailerId + '&key=' + developerKey,
                            'dataType': "json",
                            'success': function(info) {
                                // duration of the youtube video
                                var youtubeTrailerDuration = info.items[0].contentDetails.duration;
                                youtubeTrailerDuration = iso8601TimeToHMS(youtubeTrailerDuration);

                                // place the video on the page
                                placeVideoOnPage(youtubeTrailerId, youtubeTrailerDuration);

                                // store to the cache
                                var youtubeVideo = normalizeYouTubeVideoObject(youtubeTrailerId, youtubeTrailerDuration);
                                storeToCache(CacheType.MOVIE, normalizeMovieObject(null, null, youtubeVideo, null, null, $.now()), getCsfdIdFromUrl(currentUrl));
                            }
                        });
                    }
                });
            }

            /**
             * Adds the video on the page.
             *
             * @param  {string} id       YouTube ID of the video
             * @param  {string} duration Duration of the video
             */
            function placeVideoOnPage(id, duration) {

                $("#videoPlayer1").parent().parent().before('<li>' +
                    '<div class="ui-video-player">' +
                    '&nbsp;&nbsp;<iframe width="660" height="371" src="https://www.youtube.com/embed/' + id + '?vq=hd1080" frameborder="0" allowfullscreen></iframe>' +
                    '<div style="width: 660px" class="toolbar-main">' +
                    '<div>' +
                    '<div class="description">YouTube Trailer</div>' +
                    '<span class="duration">' + duration + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</li>');

            }

        }

        // TORRENT AND SUBTITLES DOWNLOAD
        if (valTorrent == "1" || valTorrent == null || valSubtitle == "1" || valSubtitle == null) {

            var links_url = "https://chrome.tomizzi.com/csfd-extension-links.json";
            var cc_names = [];
            var cc_urls = [];
            var torrent_names = [];
            var torrent_urls = [];

            $.getJSON(links_url, function(json_data) {
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
                var cc = '<div id="share">' +
                    '<ul class="ext">' +
                    '<li><img src="' + chrome.extension.getURL("img/cc.gif") + '"></li>';

                for (var i = 0; i < cc_names.length; ++i) {
                    cc_urls[i] = cc_urls[i].replace('%%QUERY%%', title)
                    cc += '<li><a href="' + cc_urls[i] + '">' + cc_names[i] + '</a></li>';
                }

                cc += '</ul>' +
                    '<div class="clear"></div>' +
                    '</div>';

                if (valSubtitle == "1" || valSubtitle == null) {
                    $("#share").after(cc);
                }

                // TORRENTS
                var torrent = '<div id="share">' +
                    '<ul class="ext">' +
                    '<li><img src="' + chrome.extension.getURL("img/utorrent.jpg") + '"></li>';

                for (var i = 0; i < torrent_names.length; ++i) {
                    torrent_urls[i] = torrent_urls[i].replace('%%QUERY%%', title)
                    torrent += '<li><a href="' + torrent_urls[i] + '">' + torrent_names[i] + '</a></li>';
                }

                torrent += '</ul>' +
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

    }

});