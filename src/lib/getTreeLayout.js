import { tree } from "d3-hierarchy";
import {
  SIBLING_SPOUSE_SEPARATION,
  SAME_GROUP_SEPARATION,
  COUSINS_SEPARATION,
} from "../constants/tree";

const treeLayout = tree();
treeLayout.separation((next, prev) => {
  if (next.isSpouse) return SIBLING_SPOUSE_SEPARATION;
  if (prev.isSpouse && !next.isSpouse) return COUSINS_SEPARATION;

  if (prev.isSibling) return SIBLING_SPOUSE_SEPARATION;
  if (next.isSibling && !prev.isSibling) return COUSINS_SEPARATION;

  if (next.parent === prev.parent) return SAME_GROUP_SEPARATION;

  if (next.parent !== prev.parent) return COUSINS_SEPARATION;
});

export default treeLayout;
