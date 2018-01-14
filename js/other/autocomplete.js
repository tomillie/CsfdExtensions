function resizePopup($param) {
    var ulHeight = $('ul').height() + 40;
    var ulWidth = $('ul').width() + 80;
    $('body').height(ulHeight);
    $('html').height(ulHeight);

    if ($('body').width() < ulWidth) {
        $('body').width(ulWidth);
        $('html').width(ulWidth);
        $('#mainSearch').width(ulWidth - 78);
    }
};

function resetPopup($param) {
    $('body').height('0');
    $('html').height('0');
    $('body').width('auto');
    $('html').width('auto');
    $('#mainSearch').width('160');
};

/**
 * Decodes a string which consists of some special HTML characters (such as &#39;)
 * @param  string html String with HTML characters
 * @return string      String without HTML characters
 */
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};

$(document).ready(function() {
    var cache = {};
    $("#mainSearch").autocomplete({
        source: function(request, response) {
            // get from cache if available
            var term = request.term;
            if (term in cache) {
                response(cache[term]);
                return;
            }

            // if not
            $.ajax({
                url: "https://imdbapi.tomizzi.com/suggest.php",
                dataType: "json",
                data: {
                    q: term,
                    api_key: "2B4DB333ADB11B2A7FEF7C9E1CC33"
                },
                success: function(data) {
                    var suggestions = [];
                    var encodedTitle = "";
                    $.each(data, function(key, val) {
                        decodedTitle = decodeHtml(val.title);
                        suggestions.push({ "value": decodedTitle, "csfd_id": val.csfd_id });
                    });
                    if (suggestions.length != 0) {
                        cache[term] = suggestions; // save to cache
                    }
                    response(suggestions);
                }
            });
        },
        minLength: 2,
        messages: {
            noResults: "",
            results: function() { return ""; }
        },
        open: function(event, ui) { resizePopup(); },
        close: function(event, ui) { resetPopup(); },
        select: function(event, ui) {
            // if this script is initiated from CSFD.cs search bar
            if (document.domain == "www.csfd.cz") {
                window.location.replace("https://www.csfd.cz/film/" + ui.item.csfd_id);
            // from the extension's popup window
            } else {
                chrome.tabs.create({ url: "https://www.csfd.cz/film/" + ui.item.csfd_id });
            }
        }
    });
});