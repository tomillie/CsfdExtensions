/**
 * Updates an object with a new object comparing their properties.
 * If the property is null, nothing is updated, otherwise it is.
 *
 * @param  {Object} oldObject 	The object ot be updated
 * @param  {Object} newObject 	The object which updates the old one
 * @return {Object} 			Updated object
 */
function updateOldObject(oldObject, newObject) {

    if (oldObject == null) {
        return newObject;
    }

    var updatedObject = {};

    for (var key in oldObject) {
        updatedObject[key] = newObject[key] == null || typeof newObject[key] == 'undefined' ? oldObject[key] : newObject[key];
    }

    return updatedObject;
}


/**
 * Creates an artist object for further use (a constructor).
 *
 * @param  {string} tooltipContent 	Parameter 1
 * @param  {string} timestamp 		Parameter 2
 * @return {Object} 				Normalized object.
 */
function normalizeArtistObject(tooltipContent, timestamp) {

    var normalizedObject = {
        tooltipContent: tooltipContent,
        timestamp: timestamp
    }

    return normalizedObject;
}


/**
 * Creates a movie object for further use (a constructor).
 *
 * @param  {string} 	movieInfo 		Parameter 1
 * @param  {string} 	tooltipContent 	Parameter 2
 * @param  {string} 	youtubeVideo 	Parameter 3
 * @param  {boolean} 	isTVShow 		Parameter 4
 * @param  {string} 	episodes 		Parameter 5
 * @param  {string} 	timestamp 		Parameter 6
 * @return {Object} 					Normalized object
 */
function normalizeMovieObject(movieInfo, tooltipContent, youtubeVideo, isTVShow, episodes, timestamp) {

    var normalizedObject = {
        movieInfo: movieInfo,
        tooltipContent: tooltipContent,
        youtubeVideo: youtubeVideo,
        isTVShow: isTVShow,
        episodes: episodes,
        timestamp: timestamp
    }

    return normalizedObject;
}


/**
 * Creates a movieInfo object for further use (a constructor).
 *
 * @param  {string} title 		Paramter 1
 * @param  {string} imdbRating 	Paramter 2
 * @param  {string} yearEnd 	Paramter 3
 * @param  {string} language 	Paramter 4
 * @return {Object} 			Normalized object
 */
function normalizeMovieInfoObject(title, imdbRating, yearEnd, language) {

    var normalizedObject = {
        title: title,
        imdbRating: imdbRating,
        yearEnd: yearEnd,
        language: language
    }

    return normalizedObject;
}


/**
 * Creates a youtubeVideo object for further use (a constructor).
 *
 * @param  {string} id 			Parameter 1
 * @param  {string} duration 	Parameter 2
 * @return {Object}  			Normalized object
 */
function normalizeYouTubeVideoObject(id, duration) {

    var normalizedObject = {
        id: id,
        duration: duration
    }

    return normalizedObject;
}


/**
 * Converts youtube's ISO8601 time into readable format minutes:seconds.
 *
 * @param  {string} s Time in ISO8601.
 * @return {string}   Time in readable format mm:ss.
 */
function iso8601TimeToHMS(s) {

    var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    var hours = 0,
        minutes = 1,
        seconds = 0;

    if (reptms.test(s)) {
        var matches = reptms.exec(s);
        if (matches[1]) hours = Number(matches[1]);
        if (matches[2]) minutes = Number(matches[2]);
        if (matches[3]) seconds = Number(matches[3]);
    }

    minutes = minutes + (hours * 60);

    return (minutes < 10 ? '0' + minutes : minutes) + ":" + (seconds < 10 ? '0' + seconds : seconds);
}


/**
 * Gets CSFD ID of the movie or artist from CSFD url.
 *
 * @param  {string} url 	CSFD url
 * @return {int} 			ID of the movie or artist
 */
function getCsfdIdFromUrl(url) {

    return url.match(/\d+/)[0];
}


/**
 * Checks if the provided timestamp is older than a month.
 *
 * @param  {Date} 	timestamp 	Timestamp to be checked
 * @return {boolean} 			True if the timestamp is older than a month, false otherwise
 */
function isOlderThanMonth(timestamp) {

    var monthInMiliseconds = 30 * 24 * 60 * 60 * 1000;
    var currentTimestamp = $.now();

    return currentTimestamp - timestamp > monthInMiliseconds;
}


/**
 * Decodes a string with special HTML characters (e.g.: single qoute (') as &#x27;).
 *
 * @param {string} encodedString String to be decoded
 */
function decodeEntities(encodedString) {

    var div = document.createElement('div');
    div.innerHTML = encodedString;

    return div.textContent;
}


/**
 * Decodes a string which consists of some special HTML characters (such as &#39;).
 *
 * @param  string html String with HTML characters
 * @return string      String without HTML characters
 */
function decodeHtml(html) {

    var txt = document.createElement("textarea");
    txt.innerHTML = html;

    return txt.value;
}


/**
 * Translates each language from english to czech.
 *
 * @param  {string} language String of languages in english.
 * @return {string}          String of languages in czech.
 */
function transalteOriginalLanguage(language) {

    var langInEnglish = new Array(
        'Afrikaans',
        'Albanian',
        'Arabic',
        'Armenian',
        'Bosnian',
        'Brazilian',
        'Bulgarian',
        'Canton',
        'Cantonese',
        'Chinese',
        'Croatian',
        'Czech',
        'Danish',
        'Dutch',
        'English',
        'Estonian',
        'Finnish',
        'French',
        'German',
        'Greek',
        'Hindi',
        'Hungarian',
        'Icelandic',
        'Indonesian',
        'Italian',
        'Japanese',
        'Kazakh',
        'Korean',
        'Kurdish',
        'Latin',
        'Latvian',
        'Lithuanian',
        'Macedonian',
        'Mandarin',
        'Mongolian',
        'Nepali',
        'Norwegian',
        'Persian',
        'Portuguese',
        'Polish',
        'Romanian',
        'Romany',
        'Russian',
        'Slovak',
        'Slovenian',
        'Spanish',
        'Swahili',
        'Swedish',
        'Taiwanese',
        'Thai',
        'Turkish',
        'Turkmen',
        'Ukrainian',
        'Vietnamese',
        'Welsh');
    var langInCzech = new Array(
        'afrikánština',
        'albánština',
        'arabština',
        'arménština',
        'bosenština',
        'brazilština',
        'bulharština',
        'kantonština',
        'kantonština',
        'čínština',
        'chorvatština',
        'čeština',
        'dánština',
        'nizozemština',
        'angličtina',
        'estonština',
        'finština',
        'francouzština',
        'němčina',
        'řečtina',
        'hindština',
        'maďarština',
        'islandština',
        'indonéština',
        'italština',
        'japonština',
        'kazaština',
        'korejština',
        'kurdština',
        'latina',
        'lotyština',
        'litevština',
        'makedonština',
        'mandanština',
        'mongolština',
        'nepálština',
        'norština',
        'perština',
        'portugalština',
        'polština',
        'rumunština',
        'romština',
        'ruština',
        'slovenština',
        'slovinština',
        'španělština',
        'svahilština',
        'švédština',
        'tajvanština',
        'thajština',
        'turečtina',
        'turkmenština',
        'ukrajinština',
        'vietnamština',
        'velština');

    for (var i = 0; i < langInEnglish.length; i++) {
        language = language.replace(langInEnglish[i], langInCzech[i]);
    }

    return language;
}