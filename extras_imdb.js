$(document).ready(function(){

    try
    {
        var keys = new Array();
        keys[0] = "csfdLink";
        
        chrome.storage.local.get(keys, function (result) {
            valCsfd = result.csfdLink;
            
            // CSFD LINK
            if (valCsfd == "1" || valCsfd == null) {
                var name = $("title").text();
                if (name.indexOf('TV Series') >= 0) {
                    name = name.slice(0, -29);
                } else {
                    name = name.slice(0, -14);
                }
                $("#maindetails_quicklinks").after('<a href="http://www.csfd.cz/hledat/?q=' + name + '">CSFD</a>');
            }
            

        });
        
    } catch (err) {
            // error
    }
});