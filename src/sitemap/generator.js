const buildSitemap = require("react-router-sitemap").sitemapBuilder;
const path = require("path");
const fs = require("fs");

// use your website root address here. Optimally you can
// include dev and production enviorenments with variables
const hostname = "http://www.entitree.com";

// define our destination folder and sitemap file name
const dest = path.resolve("./public", "sitemap.xml");

// Generate sitemap and return Sitemap instance
const sitemap = buildSitemap(hostname, ["/", "/about", "/privacy"]);

// write sitemap.xml file in /public folder
// Access the sitemap content by converting it with .toString() method
fs.writeFileSync(dest, sitemap.toString());
