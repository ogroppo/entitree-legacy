import React from "react";
import getPathD from "../../lib/getPathD";
export default function Rel({ rel: { source, target }, debug }) {
  if (debug) console.log(target);
  const relStart = target.virtualParent || source;
  return (
    <path
      className="relPath"
      d={getPathD(relStart, target, {
        offsetStartY: target.y < relStart.y ? -40 : 40, //for parents start from the top of the card
        offsetEndY: target.y < relStart.y ? 40 : -40, //for children start from the bottom of the card
      })}
    />
  );
}
