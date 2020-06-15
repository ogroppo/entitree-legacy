import axios from "axios";
import wdk from "wikidata-sdk";
import getChildrenFromPropId from "./getChildrenFromPropId";

export function search(term) {
  //const url = wbk.searchEntities('Ingmar Bergman')
  return axios.get("https://www.wikidata.org/w/api.php", {
    params: {
      origin: "*",
      action: "wbsearchentities",
      format: "json",
      language: "en",
      search: term,
    },
  });
}

export function getItemProps(id) {
  const query = `SELECT DISTINCT ?claim ?claimLabel WHERE {
  VALUES ?item {
    wd:${id}
  }
  ?item ?p ?statement.
  ?claim wikibase:claim ?p.
  ?claim wikibase:propertyType wikibase:WikibaseItem .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}`;
  const url = wdk.sparqlQuery(query);

  return axios.get(url).then(
    ({
      data: {
        results: { bindings },
      },
    }) => {
      let props = [];
      bindings.forEach((row) => {
        const propLabel = row.claimLabel.value;
        console.log(row);
        const propId = row.claim.value.replace(
          "http://www.wikidata.org/entity/",
          ""
        );
          props.push({ id: propId, label: propLabel });
      });
      return props;
    }
  );
}

export function getAllProps() {
  return axios.get("https://www.wikidata.org/w/api.php", {
    params: {
      origin: "*",
      action: "wbsearchentities",
      format: "json",
      language: "en",
      type: "property",
    },
  });
}

export async function getItem(id, options = {}) {
  const url = await new Promise(function (resolve, reject) {
    try {
      resolve(wdk.getEntities(id, options.languages));
    } catch (error) {
      reject(error);
    }
  });

  let promises = [
    axios
      .get(url, {
        params: {
          origin: "*",
        },
      })
      .then(({ data: { entities } }) => {
        const entity = entities[id];
        formatEntity(entity, options);
        return entity;
      }),
  ];

  if (options.withParents && options.propId) {
    promises.push(getParentIds(id, options.propId));
  }

  return Promise.all(promises).then(([entity, parentIds]) => {
    if (parentIds) entity.parentIds = parentIds;
    return entity;
  });
}

async function getParentIds(id, propId) {
  const query = `SELECT DISTINCT ?parent WHERE {
      VALUES ?item {
        wd:${id}
      }
      ?parent wdt:${propId} ?item.
    }`;
  const url = wdk.sparqlQuery(query);

  return axios.get(url).then(
    ({
      data: {
        results: { bindings },
      },
    }) => {
      let parentIds = [];
      bindings.forEach((row) => {
        const parentId = row.parent.value.replace(
          "http://www.wikidata.org/entity/",
          ""
        );
        parentIds.push(parentId);
      });
      return parentIds;
    }
  );
}

export async function getItems(ids, options = {}) {
  const url = await new Promise(function (resolve, reject) {
    try {
      resolve(wdk.getEntities(ids, options.languages));
    } catch (error) {
      reject(error);
    }
  });

  let promises = [
    axios
      .get(url, {
        params: {
          origin: "*",
        },
      })
      .then(({ data: { entities } }) => {
        const entitiesArray = Object.values(entities);
        entitiesArray.forEach((entity) => formatEntity(entity, options));

        return entitiesArray;
      }),
  ];

  if (options.withParents && options.propId) {
    ids.forEach((id) => {
      promises.push(getParentIds(id, options.propId));
    });
  }

  return Promise.all(promises).then(([entities, ...multiParents]) => {
    entities.forEach((entity, index) => {
      entity.parentIds = multiParents[index];
    });
    return entities;
  });
}

function formatEntity(entity, options = {}) {
  if (entity.missing !== undefined)
    throw new Error(`Entity ${entity.id} not found`);

  if (options.propId && options.withChildren !== false) {
    entity.childrenIds = getChildrenFromPropId(entity, options.propId);
  }

  const languages = options.languages || ["en"];
  entity.label = languages
    .map((lang) => (entity.labels[lang] ? entity.labels[lang].value : null))
    .filter((l) => l)
    .join(", ");
  entity.description = languages
    .map((lang) =>
      entity.descriptions[lang] ? entity.descriptions[lang].value : null
    )
    .filter((l) => l)
    .join(", ");

  const images = entity.claims["P18"] || [];
  entity.images = images.map(({ mainsnak: { datavalue: { value } } }) => ({
    alt: value, //a lot of things could be done here from the qualifiers
    url: `http://commons.wikimedia.org/wiki/Special:FilePath/${value}?width=80px`,
  }));
}
