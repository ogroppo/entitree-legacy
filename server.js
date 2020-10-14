const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");
const fs = require("fs");

app.use(express.static(path.resolve(__dirname, "./build")));

//first letter uppercase
function ucfirst(string)
{
  return string.charAt(0).toUpperCase() + string.slice(1);
}

app.get("/:lang/:prop/:title", function (request, response) { // /:lang([a-z]{2})/:prop/:title to only match 2letter languages
  const filePath = path.resolve(__dirname, "./build", "index.html");
  // const reqRoute = request.originalUrl.replace(/\?.*$/, '');
  const { lang, prop, title } = request.params;
  const featuredImageFile = "screenshot/"+prop+"/"+title+".png";
  const pageTitle = (ucfirst(prop) + " of " + title).replaceAll('_',' ');

  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, pageTitle + " - EntiTree");// - Grow your knowledge
    data = data.replace(
      /\$OG_DESCRIPTION/g,
      "Visualize connected Wikidata items on a dynamic, navigable tree diagram. Discover properties of People, Organizations and Events with a direct link to Wikipedia Aticles."
    );
    //only replace image if it's present
    if (fs.existsSync(__dirname+"/public/"+featuredImageFile)) {
      data = data.replace(
        /\$OG_IMAGE/g,
        featuredImageFile
      );
    }
    response.send(data);
  });
});


app.get("*", function (request, response) {
  const filePath = path.resolve(__dirname, "./build", "index.html");
  response.sendFile(filePath);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
