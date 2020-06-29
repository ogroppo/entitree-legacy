import getItems from "./getItems";

test("getItems", async () => {
  let ids = [];
  for (let index = 1; index <= 51; index++) {
    ids.push(`Q${index}`);
  }
  let items = await getItems(ids, "en");
  expect(items[0].label).toBe("universe");
  expect(items[46]).toBe(undefined);
  expect(items[items.length - 1].label).toBe("Antarctica");
}, 40000); //usually done in ~30s
