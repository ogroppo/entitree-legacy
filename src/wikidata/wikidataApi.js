import wdk from "wikidata-sdk";
import axios from "axios";


export default async function getEntitiesFromWikidata(para) {

  if(para.ids.length === 0){
    return null;
  }
  para.ids = para.ids.filter(item => !!item);//delete undefined values

  const urls = wbk.getManyEntities({
    ids: para.ids,
    languages: para.lang || [ 'en', 'fr', 'de' ], // returns all languages if not specified
    props: para.props || [ 'labels', 'descriptions', 'claims', 'sitelinks/urls' ], // returns all data if not specified
  });

  //https://stackoverflow.com/questions/44402079/how-to-make-multiple-axios-requests-using-a-dynamic-array-of-links-in-javascript/44402712
  axios.all(urls.map(l => axios.get(l)))
    .then(axios.spread(function (...res) {
      console.log(res);
      let entities = {};
      for(let text in res){
        for(let index in res[text].entities){
          entities[index] = res[text].entities[index];
        }
      }
      return entities;
    }));


};