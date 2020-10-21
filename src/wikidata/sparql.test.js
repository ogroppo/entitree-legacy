import React from "react";
import bidirectionalQuery from "./sparql";

test("SparqlTest", () => {
  //not working
  let formatted = bidirectionalQuery();
  console.log(formatted);
  // expect(formatted).toBe("7 BCE");
});
