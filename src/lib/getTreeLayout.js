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
treeLayout.separation((next, prev) => {
  if (next.isSpouse) return SIBLING_SPOUSE_SEPARATION;
  if (prev.isSpouse && !next.isSpouse) return COUSINS_SEPARATION;

  if (prev.isSibling) return SIBLING_SPOUSE_SEPARATION;
  if (next.isSibling && !prev.isSibling) return COUSINS_SEPARATION;

  if (next.parent === prev.parent) return SAME_GROUP_SEPARATION;

  if (next.parent !== prev.parent) return COUSINS_SEPARATION;
});

export default treeLayout;
