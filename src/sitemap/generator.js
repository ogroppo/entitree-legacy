const buildSitemap = require("react-router-sitemap").sitemapBuilder;
const path = require("path");
const en_slugs = require("./slugs.json");
const fs = require("fs");

// use your website root address here. Optimally you can
// include dev and production enviorenments with variables
const hostname = "https://www.entitree.com";

// define our destination folder and sitemap file name
const dest = path.resolve("./public", "sitemap.xml");

const pages = ["/", "/about", "/privacy"];

for (slug in en_slugs) {
  if (slugs[slug].hasFamily) {
    pages.push(`/en/family_tree/${slug}`);
  }
}

// Generate sitemap and return Sitemap instance
const sitemap = buildSitemap(hostname, pages);

// write sitemap.xml file in /public folder
// Access the sitemap content by converting it with .toString() method
fs.writeFileSync(dest, sitemap.toString());
