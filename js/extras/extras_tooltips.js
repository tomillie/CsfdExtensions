$(document).ready(function() {

	try {
		var keys = new Array();
		keys[0] = "artistTooltip";
		keys[1] = "movieTooltip";
		
		chrome.storage.local.get(keys, function (result) {
			valArtistTooltip = result.artistTooltip;
			valMovieTooltip = result.movieTooltip;

			// ARTIST TOOLTIP
			if (valArtistTooltip == "1" || valArtistTooltip == null) {
				$('a[href^="/tvurce/"], [href^="http://www.csfd.cz/tvurce/"]')
					.not('a[href*="/videa/"]')
					.not('a[href*="/autogram/"]')
					.not('a[href*="/zajimavosti/"]')
					.not('a[href*="/galerie/"]')
					.not('a[href*="/oceneni/"]')
					.not('a[href$="/diskuze/"]')
					.attr('rel', 'artist-info');
			}

			function getArtistProfile(url, e) {
				var isValid = true;
				$.ajax({
					url: url,
					type: "GET",
					async: false,
					success: function(data) {
						var content = $(data).find('#profile').html();
						if (content == null) {
							isValid = false;
							return false;
						}
						var filmography = "";
						for (var i = 0; i < 3; i++) {
							filmography += $(data).find('#filmography .content tr').get(i).outerHTML;
						}
						content = content.replace('</ul>', '</ul><br><table>' + filmography + '</table>');
						$('<div class="artist-tooltip">' + content + '</div>').appendTo('body').fadeIn('fast');
						$('div.artist-tooltip').css({
							'top': e.pageY - ($('div.artist-tooltip').height() / 2) - 5,
							'left': e.pageX + 15
						});
					}
				});

				return isValid;
			}

			function createArtistPopup(e) {
				var artist_link = $(this).attr('href');
				var artist_link_prefix = "";

				if (artist_link.match("^http://www.csfd.cz/")) {
					artist_link_prefix = "";
				} else {
					artist_link_prefix = "http://www.csfd.cz";
				}

				var urls = [
							artist_link_prefix + artist_link + "gelerie/podle-rating_average/",
							artist_link_prefix + artist_link + "autogram/podle-rating_average/",
							artist_link_prefix + artist_link + "oceneni/podle-rating_average/",
							artist_link_prefix + artist_link + "zajimavosti/podle-rating_average/",
							artist_link_prefix + artist_link + "podle-rating_average/"
							];

				for (var i = urls.length - 1; i >= 0; i--) {
					if(getArtistProfile(urls[i], e)) {
						i = 0;
					}
				};

				$(this).bind('mousemove', function(e) {
					$('div.artist-tooltip').css({
						'top': e.pageY - ($('div.artist-tooltip').height() / 2) - 5,
						'left': e.pageX + 15
					});
				});
			}

			function destroyArtistPopup() {
				$('div.artist-tooltip').remove();
			}

			$('[rel=artist-info]').hoverIntent({
				over: createArtistPopup,
				out: destroyArtistPopup
			});

			// MOVIE TOOLTIP
			if (valMovieTooltip == "1" || valMovieTooltip == null) {
				$('a[href^="/film/"], [href^="http://www.csfd.cz/film/"]')
					.not('a[href*="/videa/"]')
					.not('a[href*="/bazar/"]')
					.not('a[href*="/oceneni/"]')
					.not('a[href*="/zajimavosti/"]')
					.not('a[href*="/recenze/"]')
					.not('a[href*="/galerie/"]')
					.not('a[href*="/filmoteka/"]')
					.not('a[href*="/komentare/"]')
					.not('a[href*="/diskuze/"]')
					.not('a[href$="/prehled/"]')
					.attr('rel', 'movie-info');
			}

			function getMovieProfile(url, e) {
				var isValid = true;
				$.ajax({
					url: url,
					type: "GET",
					async: false,
					success: function(data) {
						var content = "<table border=\"0\"><tr><td>";
						var poster = $(data).find('.film-poster').get(0);
						if (typeof poster == 'undefined') {
							isValid = false;
							return false;
						}
						content += poster.outerHTML;
						content += "<br>";
						var rating = $(data).find('#rating .average').text();
						var ratingNumbersOnly = parseInt(rating);
						if (ratingNumbersOnly >= 70) {
							rating = "<div id=\"rating-good\">" + rating +"</div>";
						} else if (ratingNumbersOnly < 70 && ratingNumbersOnly >= 30) {
							rating = "<div id=\"rating-average\">" + rating +"</div>";
						} else if (ratingNumbersOnly < 30) {
							rating = "<div id=\"rating-trash\">" + rating +"</div>";
						}
						content += rating;
						content += "</td><td>";
						content += $(data).find('.info h1').get(0).outerHTML;
						content += $(data).find('.info .genre').get(0).outerHTML;
						content += $(data).find('.info .origin').get(0).outerHTML;
						var creators = $(data).find('.info .creators').text();
						creators = creators.substr(0, 500);
						creators = creators.replace('Režie:', '<br><strong>Režie:</strong>');
						creators = creators.replace('Předloha:', '<br><strong>Předloha:</strong>');
						creators = creators.replace('Kamera:', '<br><strong>Kamera:</strong>');
						creators = creators.replace('Hudba:', '<br><strong>Hudba:</strong>');
						creators = creators.replace('Hrají:', '<br><strong>Hrají:</strong>');
						creators = creators.replace('Scénář:', '<br><strong>Scénář:</strong>');
						creators += " ...";
						content += creators;
						content += "</td></tr></table>"
						if (content == null) {
							isValid = false;
							return false;
						}
						$('<div class="movie-tooltip">' + content + '</div>').appendTo('body').fadeIn('fast');
						$('div.movie-tooltip').css({
							'top': e.pageY - ($('div.movie-tooltip').height() / 2) - 5,
							'left': e.pageX + 15
						});
					}
				});

				return isValid;
			}

			function createMoviePopup(e) {
				var movie_link = $(this).attr('href');
				var movie_link_prefix = "";

				if (movie_link.match("^http://www.csfd.cz/")) {
					movie_link_prefix = "";
				} else {
					movie_link_prefix = "http://www.csfd.cz";
				}

				var urls = [
							movie_link_prefix + movie_link + "filmoteka/",
							movie_link_prefix + movie_link + "bazar/",
							movie_link_prefix + movie_link + "recenze/?type=film",
							movie_link_prefix + movie_link + "zajimavosti/?type=related",
							movie_link_prefix + movie_link + "zajimavosti/?type=film",
							movie_link_prefix + movie_link + "zajimavosti/",
							movie_link_prefix + movie_link + "videa/?type=9",
							movie_link_prefix + movie_link + "videa/?type=5",
							movie_link_prefix + movie_link + "videa/?type=4",
							movie_link_prefix + movie_link + "videa/?type=3",
							movie_link_prefix + movie_link + "videa/?type=2",
							movie_link_prefix + movie_link + "galerie/?type=4",
							movie_link_prefix + movie_link + "galerie/?type=3",
							movie_link_prefix + movie_link + "galerie/?type=1",
							movie_link_prefix + movie_link + "videa/",
							movie_link_prefix + movie_link + "diskuze/",
							movie_link_prefix + movie_link + "galerie/",
							movie_link_prefix + movie_link
							];

				for (var i = urls.length - 1; i >= 0; i--) {
					if(getMovieProfile(urls[i], e)) {
						i = 0;
					}
				};

				$(this).bind('mousemove', function(e) {
					$('div.movie-tooltip').css({
						'top': e.pageY - ($('div.movie-tooltip').height() / 2) - 5,
						'left': e.pageX + 15
					});
				});
			}

			function destroyMoviePopup() {
				$('div.movie-tooltip').remove();
			}

			$('[rel=movie-info]').hoverIntent({
				over: createMoviePopup,
				out: destroyMoviePopup
			});

		});

	} catch (err) {
		// error
	}
});