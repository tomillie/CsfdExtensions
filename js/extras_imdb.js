$(document).ready(function() {

	try
	{
		var keys = new Array();
		keys[0] = "csfdLink";

		chrome.storage.local.get(keys, function (result) {
			var valCsfd = result.csfdLink;

			// CSFD LINK
			if (valCsfd == "1" || valCsfd == null) {

				var current_url = window.location.href;
				var profile_type = "";
				var imdb_id = "";
				var csfd_url = "";

				if (current_url.indexOf("/title/") >= 0) {
					profile_type = "film";
					imdb_id = current_url.substring(26, 35);
				} else if (current_url.indexOf("/name/") >= 0) {
					profile_type = "creator";
					imdb_id = current_url.substring(25, 34);
				}

				if (profile_type != "") {
					var api_url = "https://api.csfd.cz/imdb/" + profile_type + "/?id=" + imdb_id;

					var json = (function () {
						$.ajax({
							'async': false,
							'global': false,
							'url': api_url,
							'dataType': "json",
							'success': function (data) {
								if (profile_type == "film") {
									csfd_url = data.film.web_url;
								} else {
									csfd_url = data.creator.web_url;
								}
							}
						});
					})();

					$("#quicklinksMainSection .ghost:last").after('<a href="' + csfd_url + '" class="quicklink imdb_csfd_link">CSFD</a><span class="ghost">|</span>');
					$(".show_more.quicklink").html('<span class="titleOverviewSprite quicklinksArrowUp"></span>');
					$(".show_less.quicklink").html('<span class="titleOverviewSprite quicklinksArrowDown"></span>');
				}

			}

		});

	} catch (err) {
		// error
	}
});