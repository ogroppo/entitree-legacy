/**
 * Gets a list of social media icons
 * @param claims accepts wbk.simplify.claims
 */
export default function getSocialMediaIcons(claims) {

    var socialMedia = {
        'P6634': ['linkedin', 'https://www.linkedin.com/in/$1/'],
        'P2003': ['instagram', 'https://www.instagram.com/$1/'],
        'P2002': ['twitter', 'https://twitter.com/$1'],
        'P2013': ['facebook', 'https://www.facebook.com/$1/'],
        'P2949': ['wikitree', 'https://www.wikitree.com/wiki/$1'],
        'P2600': ['geni', ' https://www.geni.com/profile/index/$1'],
        'P7085': ['tiktok', ' https://www.tiktok.com/@$1'],
        // 'P345' : ['imdb',' https://www.imdb.com/name/$1/']

    };
    var html = '';
    html += '<span class="co_index co_socialmedia">';
    for (var s in socialMedia) {
        if (claims[s]) {
            html += '<a target="_blank" href="' + socialMedia[s][1].replace("$1", claims[s][0].value) + '"  style="margin-right: 5px"><img src="/icons/' + socialMedia[s][0] + '.png" style="height: 16px;"/></a>';
        }
    }
    html += '</span>';
    return html;
}