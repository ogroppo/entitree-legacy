import { tree } from "d3-hierarchy";
import {
  CARD_VERTICAL_SPACING,
  SIBLING_SPOUSE_SEPARATION,
  SAME_GROUP_SEPARATION,
  COUSINS_SEPARATION,
  CARD_WIDTH,
} from "../constants/tree";

const treeLayout = tree();
treeLayout.nodeSize([CARD_WIDTH, CARD_VERTICAL_SPACING]);
treeLayout.separation((a, b) => {
  if (a.isSpouse) return SIBLING_SPOUSE_SEPARATION;
  //if (a.isSpouse && b.isSpouse) return 0.5;

  if (b.isSibling) return SIBLING_SPOUSE_SEPARATION;
  //if (a.isSibling && b.isSibling) return 0.5;

  if (a.parent === b.parent) return SAME_GROUP_SEPARATION;

  if (a.parent !== b.parent) return COUSINS_SEPARATION;
});

export default treeLayout;
