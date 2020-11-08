import React, { memo } from "react";
import getPathD from "../../lib/getPathD";
import "./Rel.scss";

export default memo(function Rel({ rel: { source, target }, debug }) {
  if (debug) console.log(target);
  const relStart = target.virtualParent || source;

  return <path className="Rel" d={getPathD(relStart, target)} />;
});
