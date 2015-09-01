// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-18127823-1']);
_gaq.push(['_trackPageview']);
(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga);
})();

window.onload=function() {
    // jazyk
    chrome.storage.local.get('jazyk_nastavenia', function (result) {
        var val = result.jazyk_nastavenia;
        if (val == 0) {
            document.getElementById('searchButton').value = 'Hľadaj';
        } else if (val == 1) {
            document.getElementById('searchButton').value = 'Hledej';
        } else if (val == 2) {
            document.getElementById('searchButton').value = 'Search';
        } else {
            document.getElementById('searchButton').value = 'Hľadaj';
        }
    });
    
    
    // oznaceny text
    chrome.tabs.query({ active:true, windowId: chrome.windows.WINDOW_ID_CURRENT }, 
    function(tab) {
      chrome.tabs.sendMessage(tab[0].id, {method: "getSelection"}, 
      function(response){
//        var text = document.getElementById('mainSearch');     // ak by sme predvyplnit pole na vyladavanie
//        text.value = response.data;
        if (response.data != "") {
            chrome.tabs.create({url: 'http://chrome.tomizzi.com/search.php?nastroj=csfd&fraza=' + response.data});
        }
      });
    });

};
