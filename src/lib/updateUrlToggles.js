import queryString from "query-string";

export function updateUrlToggles(location, history, node, symbol) {
  const urlIds = queryString.parse(location.search);

  console.log(node.data.id, location.search);

  if (urlIds[node.data.id]) {
    if (urlIds[node.data.id].indexOf(symbol) > -1) {
      urlIds[node.data.id] = urlIds[node.data.id].replace(symbol, "");
    } else {
      urlIds[node.data.id] += symbol;
    }
  } else {
    urlIds[node.data.id] = symbol;
  }

  history.push({
    search: queryString.stringify(urlIds),
  });
}
