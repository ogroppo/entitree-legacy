import {
  DOWN_SYMBOL,
  LEFT_SYMBOL,
  RIGHT_SYMBOL,
  UP_SYMBOL,
} from "../constants/tree";

import { browserHistory } from "../App";
import queryString from "query-string";

// TODO: add direction argument so can save also sibligns/spouses
export const removeUrlBookmark = (node) => {
  const urlIds = queryString.parse(window.location.search);

  const removeRecursive = (node) => {
    if (urlIds[node.data.id]) {
      if (node.isParent) {
        // remove open parents bookmarks
        if (urlIds[node.data.id].indexOf(UP_SYMBOL) > -1) {
          urlIds[node.data.id] = urlIds[node.data.id].replace(UP_SYMBOL, "");
        }
        // remove open siblings bookmarks
        if (urlIds[node.data.id].indexOf(LEFT_SYMBOL) > -1) {
          urlIds[node.data.id] = urlIds[node.data.id].replace(LEFT_SYMBOL, "");
        }
      }
      if (node.isChild) {
        // remove open children bookmarks
        if (urlIds[node.data.id].indexOf(DOWN_SYMBOL) > -1) {
          urlIds[node.data.id] = urlIds[node.data.id].replace(DOWN_SYMBOL, "");
        }
        // remove open spouses bookmarks
        if (urlIds[node.data.id].indexOf(RIGHT_SYMBOL) > -1) {
          urlIds[node.data.id] = urlIds[node.data.id].replace(RIGHT_SYMBOL, "");
        }
      }
    }

    if (urlIds[node.data.id] === "") delete urlIds[node.data.id];

    // continue removing bookmarks recursively
    // this will work in both directions (parents/children)
    // will work also for Root node that is never bookmarked
    if (node.children)
      node.children.forEach((child) => {
        if (child.isParent || child.isChild) {
          // do not act on siblings/spouses
          removeRecursive(child);
        }
      });
  };

  removeRecursive(node);

  browserHistory.push({
    search: queryString.stringify(urlIds),
  });
};

export const addUrlBookmark = (node) => {
  const urlIds = queryString.parse(window.location.search);

  // in url already
  if (urlIds[node.data.id]) {
    if (
      node.isParent && //root will not be affected
      urlIds[node.data.id].indexOf(UP_SYMBOL) === -1 // if open already, ignore
    ) {
      urlIds[node.data.id] += UP_SYMBOL; //add
    }
    if (
      node.isChild && //root will not be affected
      urlIds[node.data.id].indexOf(DOWN_SYMBOL) === -1 // if open already, ignore
    ) {
      urlIds[node.data.id] += DOWN_SYMBOL; //add
    }
  } else {
    if (node.isParent) urlIds[node.data.id] = UP_SYMBOL; //set
    if (node.isChild) urlIds[node.data.id] = DOWN_SYMBOL; //set
  }

  browserHistory.push({
    search: queryString.stringify(urlIds),
  });
};
