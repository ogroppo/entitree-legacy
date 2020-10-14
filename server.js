const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");
const fs = require("fs");

app.use(express.static(path.resolve(__dirname, "./build")));

//first letter uppercase
function ucfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

app.get("/:langCode/:propSlug/:titleSlug", function (request, response) {
  // /:langCode([a-z]{2})/:propSlug/:titleSlug to only match 2letter languages
  const filePath = path.resolve(__dirname, "./build", "index.html");
  // const reqRoute = request.originalUrl.replace(/\?.*$/, '');
  const { langCode, propSlug, titleSlug } = request.params;
  const featuredImageFile = "screenshot/" + propSlug + "/" + titleSlug + ".png";
  const baseUrl =
    (request.connection && request.connection.encrypted ? "https" : "http") +
    "://" +
    request.headers.host +
    "/";

  const propName = propSlug.replace(/_/g, " ");
  const titleName = titleSlug.replace(/_/g, " ");
  const pageTitle = ucfirst(propName) + " of " + titleName;

  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, pageTitle + " - EntiTree");
    data = data.replace(
      /\$OG_DESCRIPTION/g,
      `Visualize the ${propName} on a dynamic, navigable tree diagram.`
    );
    //only replace image if it's present
    if (fs.existsSync(__dirname + "/public/" + featuredImageFile)) {
      data = data.replace(/\$OG_IMAGE/g, baseUrl + featuredImageFile);
    } else {
      data = data.replace(/\$OG_IMAGE/g, "");
    }
    response.send(data);
  });
});

app.get("*", function (request, response) {
  const filePath = path.resolve(__dirname, "./build", "index.html");
  response.sendFile(filePath);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
