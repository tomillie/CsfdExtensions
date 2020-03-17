/**
 * Call API and fetches the results.
 *
 * @param {RequestInfo} input Defines the resource to fetch.
 * @param {RequestInit} init An object containing any custom settings.
 */
function fetchAPI(input, init) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({input, init}, messageResponse => {
            const [response, error] = messageResponse;
            if (response === null) {
                reject(error);
            } else {
                resolve(new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                }));
            }
        });
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    })
    .catch(function(error) {
        console.log(error);
    });
}


/**
 * Retrieves movies or artists from a storage cache if they exist.
 *
 * @param  {CacheType} 	type 	Specify if the object retrieved from cache should be a movie or an artist
 * @param  {int} 		id 		ID of the object
 * @return {Object} 			Retrieved object
 */
function retrieveFromCache(type, id) {

    var dfrd = $.Deferred();

    switch (type) {
        case CacheType.ARTIST:
            chrome.storage.local.get('artists', function(result) {
                if (typeof result.artists == 'undefined') {
                    dfrd.resolve(null);
                } else {
                    if (result.artists[id] == null || isOlderThanMonth(result.artists[id].timestamp)) {
                        dfrd.resolve(null);
                    }
                    dfrd.resolve(result.artists[id]);
                }
            });
            break;

        case CacheType.MOVIE:
            chrome.storage.local.get('movies', function(result) {
                if (typeof result.movies == 'undefined') { // if the movies are not initializied yet (e.g. after the extension installation)
                    dfrd.resolve(null);
                } else {
                    if (result.movies[id] == null || isOlderThanMonth(result.movies[id].timestamp)) {
                        dfrd.resolve(null);
                    }
                    dfrd.resolve(result.movies[id]);
                }
            });
            break;

        default:
            return null;
    }

    return dfrd.promise();
}


/**
 * Stores an object to the cache.
 *
 * @param  {CacheTye} 	type 	The type of the object which is to be stored into the cache
 * @param  {Object} 	data 	The object to be stored
 * @param  {int} 		id 		ID of the object to be stored
 * @return {boolean} 			True if the process ended successfully, false otherwise
 */
function storeToCache(type, data, id) {

    var dfrd = $.Deferred();

    switch (type) {
        case CacheType.ARTIST:
            chrome.storage.local.get('artists', function(result) {
                if (typeof result.artists == 'undefined') {
                    result.artists = [];
                }
                result.artists[id] = updateOldObject(result.artists[id], data);
                chrome.storage.local.set({ 'artists': result.artists }, function() {
                    dfrd.resolve(true);
                });
            });
            break;

        case CacheType.MOVIE:
            chrome.storage.local.get('movies', function(result) {
                if (typeof result.movies == 'undefined') {
                    result.movies = [];
                }
                result.movies[id] = updateOldObject(result.movies[id], data);
                chrome.storage.local.set({ 'movies': result.movies }, function() {
                    dfrd.resolve(true);
                });
            });
            break;

        default:
            dfrd.resolve(false);
    }

    return dfrd.promise();
}


/**
 * Clears chrome.storage.local asynchronously.
 */
function clearStorageAsync() {

    return new Promise((resolve) => {
        chrome.storage.local.clear(function (result) {
            resolve(result);
        });
    });
}


/**
 * Reads chrome.storage.local asynchronously.
 *
 * @param {string or an array of strings} key Keys to identify the item(s) to be retrieved from storage.
 */
function readStorageAsync(key) {

    return new Promise((resolve, reject) => {
        if (key != null) {
            chrome.storage.local.get(key, function (result) {
                resolve(result);
            });
        } else {
            reject(null);
        }
    });
}


/**
 * Prints all chrome.storage.local data into console (might be useful during debug).
 */
function printAllStorageData() {

    readStorageAsync().then(function(response){
        console.log(response);
    });
}