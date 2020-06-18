import axios from "axios";
import wdk from "wikidata-sdk";
import formatEntity from "./formatEntity";

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

export async function getItemTypes(id, options = {}) {
  const query = `SELECT DISTINCT ?type ?typeLabel WHERE {
    BIND(wd:${id} as ?item)
    ?item wdt:P31 ?type.
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }`;
  const url = wdk.sparqlQuery(query);

  return axios.get(url).then(
    ({
      data: {
        results: { bindings },
      },
    }) => {
      let types = [];

      bindings.forEach((row) => {
        const typeLabel = row.typeLabel.value;
        const typeId = row.type.value.replace(
          "http://www.wikidata.org/entity/",
          ""
        );
        types.push({ id: typeId, label: typeLabel });
      });
      return types;
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
    if (options.withParents) {
      entities.forEach((entity, index) => {
        entity.parentIds = multiParents[index];
      });
    }
    return entities;
  });
}
