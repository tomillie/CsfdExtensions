$(document).ready(function () {

    var keys = [ "csfdLink" ];

    chrome.storage.local.get(keys, function (result) {
        var valCsfd = result.csfdLink;

        // CSFD LINK
        if (valCsfd == "1" || valCsfd == null) {

            var current_url = window.location.href;
            var profile_type = null;
            var imdb_id = "";

            if (current_url.indexOf("/title/") >= 0) {
                profile_type = ProfileType.FILM;
                imdb_id = current_url.substring(27, 36);
            } else if (current_url.indexOf("/name/") >= 0) {
                profile_type = ProfileType.CREATOR;
                imdb_id = current_url.substring(26, 35);
            }

            if (profile_type != null) {
                let apiUrl = "https://api.csfd.cz/imdb/" + ProfileType.properties[profile_type].urlParam + "/?id=" + imdb_id;

                fetchAPI(apiUrl)
                    .then(function(response) {
                        if (profile_type == ProfileType.FILM && response.film != null) {
                            $("#quicklinksMainSection .ghost:last").after('<a href="' + response.film.web_url + '" class="quicklink imdb_csfd_link">CSFD</a>');
                            $(".show_more.quicklink").html('<span class="titleOverviewSprite quicklinksArrowUp"></span>');
                            $(".show_less.quicklink").html('<span class="titleOverviewSprite quicklinksArrowDown"></span>');
                        } else if (profile_type == ProfileType.CREATOR && response.creator != null) {
                            $(".split_1 .quicklinks .subnav_item_main:last").after('<li class="subnav_item_main"><span class="nobr-only"><a href="' + response.creator.web_url + '" class="link imdb_csfd_link">CSFD</a></span></li>');
                        }
                    });

            }
        }
    });
});