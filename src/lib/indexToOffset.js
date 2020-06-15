export default function indexToOffset(index, length) {
  let floorIndex = Math.floor(length / 2);
  if (length % 2) return index - floorIndex;

  if (index < floorIndex) return index - floorIndex;
  else return index - floorIndex + 1;
}
