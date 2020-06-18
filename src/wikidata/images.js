export default function addImagesFromClaims(claims) {
  var images = [];
  var claim;
  if (claims['P18']) {//image
    for (claim in claims['P18']) {
      images.push({
        'url': getCommonsUrlByFile(claims['P18'][claim].value),
        'source': 'Wikimedia Commons',
      });
    }
  }
  if (claims['P154']) {//logo propery
    for (claim in claims['P18']) {
      images.push({
        'url': getCommonsUrlByFile(claims['P154'][claim].value),
        'source': 'Wikimedia Commons',
      });
    }
  }
  //Twitter
  if (claims['P2002']) {//https://github.com/siddharthkp/twitter-avatar
    images.push({
      'url': 'https://twitter-avatar.now.sh/' + claims['P2002'][0].value + '',
      'source': "Twitter",
    });
  }
  return images;
}


function getCommonsUrlByFile(filename) {
  return 'https://commons.wikimedia.org/wiki/Special:FilePath/' + filename + '?width=100px';
}