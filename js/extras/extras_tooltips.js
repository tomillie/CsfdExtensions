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
				var content;

				return $.ajax({
					url: url,
					type: "GET",
					async: true,
					success: function(data) {
						// ignore if there are some redirect
						if (typeof data.redirect == 'undefined') {
							content = $(data).find('#profile').html();
							if (content == null) {
								return false;
							}
							var filmography = "";
							for (var i = 0; i < 3; i++) {
								filmography += $(data).find('#filmography .content tr').get(i).outerHTML;
							}
							content = content.replace('</ul>', '</ul><br><table>' + filmography + '</table>');

							// use the content in a popup
							fillUpArtistPopup(content, e);

							// store to cache
							storeToCache(CacheType.ARTIST, normalizeArtistObject(content, $.now()), getCsfdIdFromUrl(url));
						}
					}
				});
			}

			function fillUpArtistPopup(content, e) {

				$('<div class="artist-tooltip">' + content + '</div>').appendTo('body').fadeIn('fast');
				$('div.artist-tooltip').css({
					'top': e.pageY - ($('div.artist-tooltip').height() / 2) - 5,
					'left': e.pageX + 15
				});
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
							artist_link_prefix + artist_link + "oceneni/podle-rating_average/",
							artist_link_prefix + artist_link + "autogram/podle-rating_average/",
							artist_link_prefix + artist_link + "zajimavosti/podle-rating_average/",
							artist_link_prefix + artist_link + "podle-rating_average/"
							];

				// check the cache
				var cache;
				var content;

				$.when(retrieveFromCache(CacheType.ARTIST, getCsfdIdFromUrl(urls[urls.length - 1]))).then(function(result) {
					cache = result;
					if (typeof cache != 'undefined' && cache != null && cache.tooltipContent != null) {
						content = cache.tooltipContent;
						fillUpArtistPopup(content, e);
					} else {
						// if the artist is not yet stored in cache
						tryGetArtistProfile(urls, urls.length - 1, e);
					}
				});

				$(this).bind('mousemove', function(e) {
					$('div.artist-tooltip').css({
						'top': e.pageY - ($('div.artist-tooltip').height() / 2) - 5,
						'left': e.pageX + 15
					});
				});
			}

			function tryGetArtistProfile(urls, i, e) {
				$.when(getArtistProfile(urls[i], e)).done(function(result) {
					if (typeof result.redirect == 'undefined') {
						i = 0;
						return;
					} else {
						i--;
						if (i >= 0) {
							tryGetArtistProfile(urls, i, e);
						} else {
							return;
						}
					}
				});
			}

			function destroyArtistPopup() {
				$('div.artist-tooltip').remove();
			}

			$('[rel=artist-info]').hoverIntent({
				over: createArtistPopup,
				out: destroyArtistPopup,
				interval: 300, // delay before 'over'
				timeout: 200 // delay before 'out'
			});

			// MOVIE TOOLTIP
			if (valMovieTooltip == "1" || valMovieTooltip == null) {
				$('a[href^="/film/"], [href^="http://www.csfd.cz/film/"]')
					.not('a[href$="/prehled/"]')
					.not('a[href*="/videa/"]')
					.not('a[href*="/bazar/"]')
					.not('a[href*="/oceneni/"]')
					.not('a[href*="/zajimavosti/"]')
					.not('a[href*="/recenze/"]')
					.not('a[href*="/galerie/"]')
					.not('a[href*="/filmoteka/"]')
					.not('a[href*="/komentare/"]')
					.not('a[href*="/diskuze/"]')
					.not('a[href*="/epizody/"]')
					// season of TV serie (if the url is like /film/420272-serie-1/ and doesn't fit zhe filter below)
					.not('a[href*="-serie-"]')
					// example of serie url: http://www.csfd.cz/film/237486-pernikovy-tata/420272-serie-1/
					// example of episode url: http://www.csfd.cz/film/237486-pernikovy-tata/420276-cancer-man/
					// we want to filter them out
					// using regex: starts with /film, continuing with digits, arbitrary characters, / and digits again
					.filter(function() {
						return !this.href.match(/film\/\d*[a-zA-z0-9-]*\/{1}\d{1,}/);
					})
					.attr('rel', 'movie-info');
			}

			function getMovieProfile(url, e) {
				var content;

				return $.ajax({
					url: url,
					type: "GET",
					async: true,
					cache: true,
					success: function(data) {
						// ignore if there is some redirection
						if (typeof data.redirect == 'undefined') {
							var content = "<table border=\"0\"><tr><td>";
							var poster = $(data).find('.film-poster').get(0);
							if (typeof poster == 'undefined') {
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
								return false;
							}
							// use the content in a popup
							fillUpMoviePopup(content, e);

							// store to cache
							storeToCache(CacheType.MOVIE, normalizeMovieObject(null, content, null, null, null, $.now()), getCsfdIdFromUrl(url));
						} else {
							return false;
						}
					}
				});
			}

			function fillUpMoviePopup(content, e) {

				$('<div class="movie-tooltip">' + content + '</div>').appendTo('body').fadeIn('fast');
				$('div.movie-tooltip').css({
					'top': e.pageY - ($('div.movie-tooltip').height() / 2) - 5,
					'left': e.pageX + 15
				});
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
							movie_link_prefix + movie_link + "komentare/",
							movie_link_prefix + movie_link
							];

				// check the cache
				var cache;
				var content;

				$.when(retrieveFromCache(CacheType.MOVIE, getCsfdIdFromUrl(urls[urls.length - 1]))).then(function(result) {
					cache = result;
					if (typeof cache != 'undefined' && cache != null && cache.tooltipContent != null) {
						content = cache.tooltipContent;
						fillUpMoviePopup(content, e);
					} else {
						// if the movie is not yet stored in cache
						tryGetMovieProfile(urls, urls.length - 1, e);
					}
				});

				$(this).bind('mousemove', function(e) {
					$('div.movie-tooltip').css({
						'top': e.pageY - ($('div.movie-tooltip').height() / 2) - 5,
						'left': e.pageX + 15
					});
				});
			}

			function tryGetMovieProfile(urls, i, e) {
				$.when(getMovieProfile(urls[i], e)).then(function(result) {
					if (typeof result.redirect == 'undefined') {
						i = 0;
						return;
					} else {
						i--;
						if (i >= 0) {
							tryGetMovieProfile(urls, i, e);
						} else {
							return;
						}
					}
				});
			}

			function destroyMoviePopup() {
				$('div.movie-tooltip').remove();
			}

			$('[rel=movie-info]').hoverIntent({
				over: createMoviePopup,
				out: destroyMoviePopup,
				interval: 300, // delay before 'over'
				timeout: 200 // delay before 'out'
			});

		});

	} catch (err) {
		// error
	}
});