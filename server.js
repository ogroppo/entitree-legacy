const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");
const fs = require("fs");
const urljoin = require("url-join");

const indexFilePath = path.resolve(__dirname, "./build", "index.html");

const getFullUrl = (request, url) => {
  return urljoin(request.protocol + "://" + request.get("host"), url);
};

const capitalise = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

app.get("/", function (request, response) {
  fs.readFile(indexFilePath, "utf8", function (err, template) {
    if (err) {
      return console.log(err);
    }
    let page = template
      .replace(/\$OG_TITLE/g, "EntiTree - Grow you knowledge")
      .replace(
        /\$OG_DESCRIPTION/g,
        "Visualize connected Wikidata items on a dynamic, navigable tree diagram. Discover properties of People, Organizations and Events with a direct link to Wikipedia Aticles."
      )
      .replace(/\$OG_IMAGE/g, getFullUrl(request, "logo.png"));

    response.send(page);
  });
});

//don't move it from here
app.use(express.static(path.resolve(__dirname, "./build")));

app.get("/:langCode/:propSlug/:titleSlug", function (request, response) {
  // /:langCode([a-z]{2})/:propSlug/:titleSlug to only match 2letter languages
  // const reqRoute = request.originalUrl.replace(/\?.*$/, '');
  const { langCode, propSlug, titleSlug } = request.params;
  const featuredImageFile = path.join(
    "screenshot",
    propSlug,
    titleSlug + ".png"
  );
  const logoImageFile = path.join("icons", "entitree_square.png");

  const propName = propSlug.replace(/_/g, " ");
  const titleName = titleSlug.replace(/_/g, " ");
  const pageTitle = capitalise(propName) + " of " + titleName;

  fs.readFile(indexFilePath, "utf8", function (err, template) {
    if (err) {
      return console.log(err);
    }
    let page = template
      .replace(/\$OG_TITLE/g, pageTitle + " - EntiTree")
      .replace(
        /\$OG_DESCRIPTION/g,
        `Visualize the ${propName} on a dynamic, navigable tree diagram.`
      );
    //only replace image if it's present
    if (fs.existsSync(path.resolve(__dirname, "/public/", featuredImageFile))) {
      page = page.replace(
        /\$OG_IMAGE/g,
        getFullUrl(request, featuredImageFile)
      );
    } else {
      page = page.replace(/\$OG_IMAGE/g, getFullUrl(request, logoImageFile));
      page = page.replace(/summary_large_image/g, "summary");
    }
    response.send(page);
  });
});

app.get("*", function (request, response) {
  response.sendFile(indexFilePath);
});

app.listen(port, () => console.log(`http://localhost:${port}`));
