/**
 * Converts youtube's ISO8601 time into readable format minutes:seconds.
 * 
 * @param  {string} s Time in ISO8601.
 * @return {string}   Time in readable format mm:ss.
 */
function iso8601TimeToHMS(s) {

    var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    var hours = 0, minutes = 1, seconds = 0;

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

    for(var i = 0; i < langInEnglish.length; i++) {
        language = language.replace(langInEnglish[i], langInCzech[i]);
    }

    return language;
}