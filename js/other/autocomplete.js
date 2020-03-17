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


async function injectAutocomplate() {

    var cache = {};
    var optionKeys = new Array("searchAutocomplete");
    var optionValues = await readStorageAsync(optionKeys);

    // check settings, if autocomplete is allowed on CSFD site, then check document.domain and proceed
    if (optionValues.searchAutocomplete == "1" || optionValues.searchAutocomplete == null) {
        $("#mainSearch").autocomplete({
            source: function(request, response) {
                // get from cache if available
                var term = request.term;
                if (term in cache) {
                    response(cache[term]);
                    return;
                }

                // if not
                let apiParams = {
                    q: term,
                    domain: document.domain,
                    api_key: "2B4DB333ADB11B2A7FEF7C9E1CC33"
                };
                let apiUrl = `https://imdbapi.tomizzi.com/suggest.php?${$.param(apiParams)}`;

                fetchAPI(apiUrl)
                    .then(function(data) {
                        var suggestions = [];
                        var decodedTitle = "";

                        $.each(data, function(_key, val) {
                            decodedTitle = decodeHtml(val.title);
                            suggestions.push({ "value": decodedTitle, "csfd_id": val.csfd_id });
                        });

                        if (suggestions.length != 0) {
                            cache[term] = suggestions;
                        }

                        response(suggestions);
                    });
            },
            minLength: 2,
            messages: {
                noResults: "",
                results: function() { return ""; }
            },
            open: function(_event) { resizePopup(); },
            close: function(_event) { resetPopup(); },
            select: function(_event, ui) {
                // if this script is initiated from CSFD.cs search bar
                if (document.domain == "www.csfd.cz") {
                    window.location.replace("https://www.csfd.cz/film/" + ui.item.csfd_id);
                // from the extension's popup window
                } else {
                    chrome.tabs.create({ url: "https://www.csfd.cz/film/" + ui.item.csfd_id });
                }
            }
        });
    }
}


$(document).ready(function() {

    injectAutocomplate();

});