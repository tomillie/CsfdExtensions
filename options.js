// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-18127823-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga);
})();

// spusti restore_option() pred nacitanim stranky
document.addEventListener('DOMContentLoaded', restore_options);
// po kliknuti na Ulozit spustit save_options()
document.querySelector('#submitButton').addEventListener('click', save_options);

// uloženie do LocalStorage
function save_options() {
    var select = document.getElementById("jazyk");
    var lang = select.children[select.selectedIndex].value;
    chrome.storage.local.set({"jazyk_nastavenia" : lang});

    var select1 = document.getElementById("imdbRating");
    var val1 = select1.children[select1.selectedIndex].value;
    chrome.storage.local.set({"imdbRating" : val1});

    var select2 = document.getElementById("youtubeTrailer");
    var val2 = select2.children[select2.selectedIndex].value;
    chrome.storage.local.set({"youtubeTrailer" : val2});

    var select3 = document.getElementById("torrentSearch");
    var val3 = select3.children[select3.selectedIndex].value;
    chrome.storage.local.set({"torrentSearch" : val3});

    var select4 = document.getElementById("subtitleSearch");
    var val4 = select4.children[select4.selectedIndex].value;
    chrome.storage.local.set({"subtitleSearch" : val4});

    var select5 = document.getElementById("goUp");
    var val5 = select5.children[select5.selectedIndex].value;
    chrome.storage.local.set({"goUp" : val5});

    var select6 = document.getElementById("csfdLink");
    var val6 = select6.children[select6.selectedIndex].value;
    chrome.storage.local.set({"csfdLink" : val6});

    var select7 = document.getElementById("artistTooltip");
    var val7 = select7.children[select7.selectedIndex].value;
    chrome.storage.local.set({"artistTooltip" : val7});

    var select8 = document.getElementById("movieTooltip");
    var val8 = select8.children[select8.selectedIndex].value;
    chrome.storage.local.set({"movieTooltip" : val8});

// Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = "Nastavenia \u00fape\u0161ne zmenen\u00e9.";
    setTimeout(function() {
        status.innerHTML = "";
    }, 10000);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    var keys = new Array();
    keys[0] = "imdbRating";
    keys[1] = "youtubeTrailer";
    keys[2] = "torrentSearch";
    keys[3] = "subtitleSearch";
    keys[4] = "goUp";
    keys[5] = "csfdLink";
    keys[6] = "jazyk_nastavenia";
    keys[7] = "artistTooltip";
    keys[8] = "movieTooltip";

    chrome.storage.local.get(keys, function (result) {
        var lang = result.jazyk_nastavenia;
        if (!lang) {
            return;
        }
        var select = document.getElementById("jazyk");
        for (var i = 0; i < select.children.length; i++) {
            var child = select.children[i];
            if (child.value == lang) {
                child.selected = "true";
                break;
            }
        }

        var val = result.imdbRating;
        if (!val) {
            return;
        }
        select = document.getElementById("imdbRating");
        for (i = 0; i < select.children.length; i++) {
            child = select.children[i];
            if (child.value == val) {
                child.selected = "true";
                break;
            }
        }

        val = result.youtubeTrailer;
        if (!val) {
            return;
        }
        select = document.getElementById("youtubeTrailer");
        for (i = 0; i < select.children.length; i++) {
            child = select.children[i];
            if (child.value == val) {
                child.selected = "true";
                break;
            }
        }

        val = result.torrentSearch;
        if (!val) {
            return;
        }
        select = document.getElementById("torrentSearch");
        for (i = 0; i < select.children.length; i++) {
            child = select.children[i];
            if (child.value == val) {
                child.selected = "true";
                break;
            }
        }

        val = result.subtitleSearch;
        if (!val) {
            return;
        }
        select = document.getElementById("subtitleSearch");
        for (i = 0; i < select.children.length; i++) {
            child = select.children[i];
            if (child.value == val) {
                child.selected = "true";
                break;
            }
        }

        val = result.goUp;
        if (!val) {
            return;
        }
        select = document.getElementById("goUp");
        for (i = 0; i < select.children.length; i++) {
            child = select.children[i];
            if (child.value == val) {
                child.selected = "true";
                break;
            }
        }

        val = result.csfdLink;
        if (!val) {
            return;
        }
        select = document.getElementById("csfdLink");
        for (i = 0; i < select.children.length; i++) {
            child = select.children[i];
            if (child.value == val) {
                child.selected = "true";
                break;
            }
        }

        val = result.artistTooltip;
        if (!val) {
            return;
        }
        select = document.getElementById("artistTooltip");
        for (i = 0; i < select.children.length; i++) {
            child = select.children[i];
            if (child.value == val) {
                child.selected = "true";
                break;
            }
        }

        val = result.movieTooltip;
        if (!val) {
            return;
        }
        select = document.getElementById("movieTooltip");
        for (i = 0; i < select.children.length; i++) {
            child = select.children[i];
            if (child.value == val) {
                child.selected = "true";
                break;
            }
        }

    });
}