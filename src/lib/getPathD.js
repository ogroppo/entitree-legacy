export default function getPathD(
  { x: startX, y: startY },
  { x: endX, y: endY },
  options = {}
) {
  if (options.offsetStartY) {
    startY += options.offsetStartY;
  }
  if (options.offsetEndY) {
    endY += options.offsetEndY;
  }

  if (startX === endX) return `M${startX},${startY} V${endY}`;
  if (startY === endY) return `M${startX},${startY} H${endX}`;
  const yDiff = endY - startY;

  const thirdY = yDiff / 3 + startY;
  const twoThirdsY = (yDiff / 3) * 2 + startY;
  const halfY = yDiff / 2 + startY;

  const r = Math.abs(halfY - thirdY);

  const isLeft = startX > endX;
  const isDown = startY > endY;

  const ax1 = isLeft ? startX - r : startX + r;
  const ay1 = isDown ? thirdY - r : thirdY + r;
  const hEnd = isLeft ? endX + r : endX - r;

  const d = `M${startX},${startY} V${thirdY} A${r} ${r} 0 0 ${
    isLeft ? (isDown ? 0 : 1) : isDown ? 1 : 0
  } ${ax1} ${ay1} H${hEnd} A${r} ${r} 0 0 ${
    isLeft ? (isDown ? 1 : 0) : isDown ? 0 : 1
  } ${endX} ${twoThirdsY} V${endY}`;
  return d;
}
