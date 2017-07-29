/**
 * Gets all episodes of TV show from tvmaze.com via API. The data are then processed and displayed.
 *
 * @param  {string} 	title 	Title of the TV show
 * @param  {int} 		title 	CSFD ID of the TV show
 */
function getEpisodes(title, csfdId) {

    var api_url = "https://api.tvmaze.com/singlesearch/shows?q=" + title + "&embed=episodes";
    var episodes;

    $.ajax({
        'async': true,
        'global': false,
        'url': api_url,
        'dataType': "json",
        'success': function(data) {
            episodes = data._embedded.episodes;
            printEpisodes(episodes);
            storeToCache(CacheType.MOVIE, normalizeMovieObject(null, null, null, true, episodes, $.now()), csfdId);
        }
    });

}

/**
 * Prints seasons with episodes on the page.
 *
 * @param  {Array} episodes An array of seasons and episodes
 */
function printEpisodes(episodes) {

    var epContent;
    var lastPrintedSeason;
    var seasonTemp;
    var episodeTemp;

    epContent = '<div class="content">' +
        '<table class="epTable">' +
        '<tr>' +
        '<td>';

    for (var i = 0; i < episodes.length; i++) {

        if (episodes[i].season % 2 != 0 && episodes[i].season - 1 == lastPrintedSeason) {
            epContent += "</td></tr><tr><td>";
        } else if (episodes[i].season - 1 == lastPrintedSeason) {
            epContent += "</td><td>";
        }

        seasonTemp = ("0" + episodes[i].season).slice(-2);
        episodeTemp = ("0" + episodes[i].number).slice(-2);

        epContent += "<strong>" + seasonTemp + "x" + episodeTemp + "</strong> - " + episodes[i].name + "<br>";
        lastPrintedSeason = episodes[i].season;

        if (i == episodes.length - 1) {
            epContent += "</td></tr></table></div>";
        }

    };

    $("#eph4 > h4").after(epContent);

}