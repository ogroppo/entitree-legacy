const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");
const fs = require("fs");

app.use(express.static(path.resolve(__dirname, "./build")));

app.get("*", function (request, response) {
  const filePath = path.resolve(__dirname, "./build", "index.html");
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, "EntiTree - Grow your knowledge");
    data = data.replace(
      /\$OG_DESCRIPTION/g,
      "Visualize connected Wikidata items on a dynamic, navigable tree diagram. Discover properties of People, Organizations and Events with a direct link to Wikipedia Aticles."
    );
    result = data.replace(
      /\$OG_IMAGE/g,
      "screenshot/family_tree/Jeffrey_Epstein.jpg"
    );
    response.send(result);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
