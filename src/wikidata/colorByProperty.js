import { EYE_AND_HAIR_COLORS } from "../constants/eyeHairColors";

export default function colorByProperty(id) {
  if(!id){
    return null;
  }
  console.log(id);
  const entityId = id[0].value;
  const color = EYE_AND_HAIR_COLORS.find(c  => c.item === "http://www.wikidata.org/entity/"+entityId);
  console.log(color);
  if(!color) { //SHOULD HAVE ALWAYS A HEX
    return null;
  }
  return color;

}