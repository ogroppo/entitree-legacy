export default function parseSparqlResponse(response) {
  let itemsMap = {};

  response.results.bindings.forEach((element) => {
    let id = null;
    response.head.vars.forEach((variable) => {
      if (!id) {
        id = parseValue(element[variable]);
        return;
      }
      let item = itemsMap[id];
      if (!item) {
        itemsMap[id] = { id };
        item = itemsMap[id];
      }
      if (variable.endsWith("Group"))
        item[variable.replace("Group", "")] = parseValue(element[variable])
          .split(" ")
          .filter((v) => v);
    });
  });

  let results = Object.values(itemsMap);
  return results;
}

const parseValue = (keyObject) => {
  if (!keyObject) return undefined;

  //console.log(keyObject);

  switch (keyObject.type) {
    case "literal":
      return keyObject.value;
    case "uri":
      return parseUri(keyObject.value);
    default:
      break;
  }
};

const parseUri = (uri) => {
  // ex: http://www.wikidata.org/entity/statement/
  if (uri.match(/http.*\/entity\/statement\//)) {
    return convertStatementUriToGuid(uri);
  }

  return (
    uri
      // ex: http://www.wikidata.org/entity/
      .replace(/^https?:\/\/.*\/entity\//, "")
      // ex: http://www.wikidata.org/prop/direct/
      .replace(/^https?:\/\/.*\/prop\/direct\//, "")
  );
};

const convertStatementUriToGuid = (uri) => {
  // ex: http://www.wikidata.org/entity/statement/
  uri = uri.replace(/^https?:\/\/.*\/entity\/statement\//, "");
  const parts = uri.split("-");
  return parts[0] + "$" + parts.slice(1).join("-");
};
