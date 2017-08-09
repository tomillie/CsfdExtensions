// check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
        logOnInstalledMessage(details);
    } else if (details.reason == "update") {
        logOnInstalledMessage(details, true);
        removeCache();
        popNotification("Nová verze úspěšně nainstalována.");
    }
});

function logOnInstalledMessage(details, updated = false) {

    if (updated) {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("[CSFD Search & Extensions] Updated from " + details.previousVersion + " to " + thisVersion + ".");
    } else {
        console.log("[CSFD Search & Extensions] First installation.");
    }
}

function removeCache() {

    chrome.storage.local.remove(["artists", "movies"], function() {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        } else {
            console.log("[CSFD Search & Extensions] Cache cleared.")
        }
    });
}

function popNotification(message) {

    chrome.notifications.create(
        'CSFD_Extensions_Updated', {
            type: 'basic',
            iconUrl: './img/icon_128.png',
            title: "CSFD Vyhledáváni & Rozšíření",
            message: message
        },
        function() {}
    );
}