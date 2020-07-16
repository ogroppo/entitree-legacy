const LANGUAGE_CODE = "en";
//const views = require("./topviews-2019.json");
const views = require("./topviews-2020_06.json");
const slugs = require(`./${LANGUAGE_CODE}-slugs.json`);
const axios = require("axios");
const wdk = require("wikidata-sdk");
const fs = require("fs");

const go = async () => {
  for (let index = 0; index < views.length; index++) {
    const view = views[index];
    const slug = view.article.replace(new RegExp(" ", "g"), "_");
    const encodedSlug = encodeURIComponent(slug);

    if (!slugs[slug]) {
      console.log("processing", slug);
      let qid;
      try {
        const { data } = await axios.get(
          `https://${LANGUAGE_CODE}.wikipedia.org/api/rest_v1/page/summary/${encodedSlug}`
        );
        qid = data.wikibase_item;
        slugs[slug] = {
          id: qid,
          importedAt: new Date(),
        };
      } catch (error) {
        console.log(slug, error.response.status, error.response.statusText);
      }
      try {
        const url = await wdk.getEntities({
          ids: qid,
          languages: LANGUAGE_CODE,
          props: ["claims"],
        });
        const {
          data: { entities },
        } = await axios.get(url);
        const entity = entities[qid];
        let isHuman = false;
        try {
          if (
            entity.claims["P31"].some(
              ({
                mainsnak: {
                  datavalue: {
                    value: { id },
                  },
                },
              }) => {
                return id === "Q5";
              }
            )
          ) {
            isHuman = true;
          }
        } catch (error) {}

        if (
          ["P40", "P3373", "P26", "P22", "P25"].some((id) => entity.claims[id])
        ) {
          slugs[slug].hasFamily = true;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  let data = JSON.stringify(slugs, null, 2);
  fs.writeFileSync(`./src/sitemap/${LANGUAGE_CODE}-slugs.json`, data);
};

go();
