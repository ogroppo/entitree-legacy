import getItemsLabel from "./getItemsLabel";

test("getItemsLabel", async () => {
  let ids = [];
  for (let index = 1; index <= 3; index++) {
    ids.push(`Q${index}`);
  }
  let labels = await getItemsLabel(ids, "en");
  expect(labels[0]).toBe("universe");
  expect(labels[46]).toBe(undefined);
  expect(labels[labels.length - 1]).toBe("life");
}, 4000); //usually done in ~3s
