import {
  DOWN_SYMBOL,
  LEFT_SYMBOL,
  RIGHT_SYMBOL,
  UP_SYMBOL,
} from "../constants/tree";

import { browserHistory } from "../App";
import queryString from "query-string";

export const removeUrlBookmark = (node, directionSymbol) => {
  const urlIds = queryString.parse(window.location.search);

  const removeRecursive = (node) => {
    // the below COULD be simplified removing the bookmak completely,
    // but then if the node appears somewhere else, this will not work
    if (urlIds[node.data.id]) {
      //remove current direction
      if (urlIds[node.data.id].indexOf(directionSymbol) > -1) {
        urlIds[node.data.id] = urlIds[node.data.id].replace(
          directionSymbol,
          ""
        );
      }

      // remove open siblings bookmarks for parents
      if (directionSymbol === UP_SYMBOL) {
        if (urlIds[node.data.id].indexOf(LEFT_SYMBOL) > -1) {
          urlIds[node.data.id] = urlIds[node.data.id].replace(LEFT_SYMBOL, "");
        }
      }

      // remove open spouses bookmarks for children
      if (directionSymbol === DOWN_SYMBOL) {
        if (urlIds[node.data.id].indexOf(RIGHT_SYMBOL) > -1) {
          urlIds[node.data.id] = urlIds[node.data.id].replace(RIGHT_SYMBOL, "");
        }
      }
    }

    //if empty because of the removals, remove completely from url
    if (urlIds[node.data.id] === "") delete urlIds[node.data.id];

    // continue removing bookmarks recursively
    // this will work in both directions (parents/children)
    // will work also for Root node that is never bookmarked
    if (node.children)
      node.children.forEach((child) => {
        // do not act on siblings/spouses nor root node
        if (child.isParent || child.isChild) {
          removeRecursive(child);
        }
      });
  };

  removeRecursive(node);

  browserHistory.push({
    search: queryString.stringify(urlIds),
  });
};

export const addUrlBookmark = (node, directionSymbol) => {
  //exclude root (is always open by default)
  if (node.isRoot) return;

  const urlIds = queryString.parse(window.location.search);

  // node bookmarked already
  if (urlIds[node.data.id]) {
    // if symbol not found, add
    if (urlIds[node.data.id].indexOf(directionSymbol) === -1) {
      urlIds[node.data.id] += directionSymbol;
    }
  } else {
    urlIds[node.data.id] = directionSymbol; //set
  }

  browserHistory.push({
    search: queryString.stringify(urlIds),
  });
};
