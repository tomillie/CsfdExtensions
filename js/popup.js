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
    // language
    document.getElementById('searchButton').value = chrome.i18n.getMessage("button_search");    
    
    // selected text
    chrome.tabs.query({ active:true, windowId: chrome.windows.WINDOW_ID_CURRENT }, 
        function(tab) {
            chrome.tabs.sendMessage(tab[0].id, {method: "getSelection"}, 
                function(response) {
                    if (typeof response !== 'undefined' && response.data != "") {
                        chrome.tabs.create({url: 'http://chrome.tomizzi.com/search.php?nastroj=csfd&fraza=' + response.data});
                    }
                });
        });

};
