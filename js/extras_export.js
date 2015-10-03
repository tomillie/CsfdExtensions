$(document).ready(function() {

	try {
        var keys = new Array();
        keys[0] = "exportUserData";
        
        chrome.storage.local.get(keys, function (result) {
            valExportUserData = result.exportUserData;

            // EXPORT USER'S DATA
            if (valExportUserData == "1" || valExportUserData == null) {
            	var url = window.location.href;
            	var user_id = url.match("/uzivatel/(.*?)-");
                $("p.contact").append('<a href="http://chrome.tomizzi.com/export_user_data.php?user_id=' + user_id[1] + '" target="_blank">stáhnout uživatelská data</a>');
            } 

		});
	        
	} catch (err) {
        // error
	}

});