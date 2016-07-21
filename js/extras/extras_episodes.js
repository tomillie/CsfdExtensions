/**
 * Gets all episodes of TV show from tvmaze.com via API. The data are then processed and displayed.
 * 
 * @param  {string} 	title 	Title of the TV show.
 * @return {boolean}			True if the episodes are printed, false otherwise.
 */
function getEpisodes(title) {

	var api_url = "http://api.tvmaze.com/singlesearch/shows?q=" + title + "&embed=episodes";

	var episodes;

	// get data
	var json = (function () {
		$.ajax({
			'async': false,
			'global': false,
			'url': api_url,
			'dataType': "json",
			'success': function (data) {
				episodes = data._embedded.episodes;
			},
			'error': function(xhr, textStatus, errorThrown) {
				return false;
			}
		});
	})();

	if (episodes) {
		// create and print the episodes
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

		return true;
	} else {
		return false;
	}
}