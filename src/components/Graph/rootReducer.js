export default function rootReducer(prevRoot, { type, root }) {
  switch (type) {
    case "set":
      return root;
    case "expandRootSpouses":
      root._spousesExpanded = true;
      if (root._spouses && !root.spouses) root.spouses = root._spouses;
      return { ...root };
    case "collapseRootSpouses":
      root._spousesExpanded = false;
      root._spouses = root.spouses;
      root.spouses = null;
      return { ...root };
    case "collapseRootSiblings":
      root._siblingsExpanded = false;
      root._siblings = root.siblings;
      root.siblings = null;
      return { ...root };
    case "expandRootSiblings":
      root._siblingsExpanded = true;
      if (root._spouses && !root.siblings) root.siblings = root._siblings;
      return { ...root };
    default:
      throw new Error("Unknown action type " + type);
  }
}
