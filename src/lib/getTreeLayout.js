import { tree } from "d3-hierarchy";
import {
  SIBLING_SPOUSE_SEPARATION,
  SAME_GROUP_SEPARATION,
  COUSINS_SEPARATION,
} from "../constants/tree";

const treeLayout = tree();

export default treeLayout;
