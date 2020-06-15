export default function getPathD(
  { x: startX, y: startY },
  { x: endX, y: endY },
  options = {}
) {
  if (options.offsetStartY) {
    startY += options.offsetStartY;
  }
  const xDiff = endX - startX;
  const yDiff = endY - startY;

  const c1Y = yDiff / 3 + startY;
  const c2Y = (yDiff / 3) * 2 + startY;

  const d = `M${startX},${startY} C${startX},${c1Y} ${endX},${c2Y} ${endX},${endY}`;
  return d;
}
