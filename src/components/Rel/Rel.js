import React from "react";
import getPathD from "../../lib/getPathD";
export default function Rel({ rel, isParent }) {
  if (rel.target.isSpouse || rel.target.isSibling) return null; //TODO
  return (
    <path
      className="relPath"
      d={getPathD(rel.source, rel.target, {
        offsetStartY: isParent ? -40 : 40,
      })}
    />
  );
}
