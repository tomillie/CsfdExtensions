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
                var profile_type = null;
                var imdb_id = "";
                var csfd_url = "";

                if (current_url.indexOf("/title/") >= 0) {
                    profile_type = ProfileType.FILM;
                    imdb_id = current_url.substring(27, 36);
                } else if (current_url.indexOf("/name/") >= 0) {
                    profile_type = ProfileType.CREATOR;
                    imdb_id = current_url.substring(26, 35);
                }

                if (profile_type != null) {
                    var api_url = "https://api.csfd.cz/imdb/" + ProfileType.properties[profile_type].urlParam + "/?id=" + imdb_id;
                    var isFound = false;

                    var json = (function () {
                        $.ajax({
                            'async': false,
                            'global': false,
                            'url': api_url,
                            'dataType': "json",
                            'success': function (data) {
                                if (profile_type == ProfileType.FILM && data.film != null) {
                                    csfd_url = data.film.web_url;
                                    isFound = true;
                                } else if (profile_type == ProfileType.CREATOR && data.creator != null) {
                                    csfd_url = data.creator.web_url;
                                    isFound = true;
                                }
                            }
                        });
                    })();

                    if (!isFound) {
                        return;
                    }

                    if (profile_type == ProfileType.FILM) {
                        $("#quicklinksMainSection .ghost:last").after('<a href="' + csfd_url + '" class="quicklink imdb_csfd_link">CSFD</a>');
                        $(".show_more.quicklink").html('<span class="titleOverviewSprite quicklinksArrowUp"></span>');
                        $(".show_less.quicklink").html('<span class="titleOverviewSprite quicklinksArrowDown"></span>');
                    } else {
                        $(".split_1 .quicklinks .subnav_item_main:last").after('<li class="subnav_item_main"><span class="nobr-only"><a href="' + csfd_url + '" class="link imdb_csfd_link">CSFD</a></span></li>');
                    }
                }
            }
        });

    } catch (err) {
        // error
    }
});