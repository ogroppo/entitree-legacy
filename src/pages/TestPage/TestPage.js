import React, { useState, useEffect, useRef } from "react";
import axios, { CancelToken } from "axios";
import { Container } from "react-bootstrap";
import bidirectionalQuery from "../../wikidata/sparql";

  export default function TestPage({ more, loadMore }) {
    const [joke, setJoke] = useState("");
    const componentIsMounted = useRef(true);

    useEffect(() => {
      // each useEffect can return a cleanup function
      return () => {
        componentIsMounted.current = false;
      };
    }, []); // no extra deps => the cleanup function run this on component unmount

    useEffect(() => {
      const cancelTokenSource = CancelToken.source();

      async function fetchJoke() {
        try {
          // const asyncResponse = await axios(
          //   "https://api.icndb.com/jokes/random",
          //   {
          //     cancelToken: cancelTokenSource.token,
          //   }
          // );
          const asyncResponse = await bidirectionalQuery();
          console.log(asyncResponse);
          const { value } = asyncResponse.data;

          if (componentIsMounted.current) {
            setJoke(value.joke);
          }
        } catch (err) {
          if (axios.isCancel(err)) {
            return console.info(err);
          }

          console.error(err);
        }
      }

      fetchJoke();

      return () => {
        // here we cancel preveous http request that did not complete yet
        cancelTokenSource.cancel(
          "Cancelling previous http call because a new one was made ;-)"
        );
      };
    }, [more]);
//
//     const id = "Q9682";
//   var result = await getSparql(`PREFIX gas: <http://www.bigdata.com/rdf/gas#>
//   SELECT ?item ?itemLabel ?linkTo {
//   { SERVICE gas:service {
//   gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.SSSP" ;
//   gas:in wd:${id};
//   gas:traversalDirection "Forward" ;
//   gas:out ?item ;
//   gas:out1 ?depth ;
//   gas:maxVisited 2 ;
//   gas:linkType wdt:P40 .
// } } UNION { SERVICE gas:service {
//   gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.SSSP" ;
//   gas:in wd:${id} ;
//   gas:traversalDirection "Reverse" ;
//   gas:out ?item ;
//   gas:out1 ?depth ;
//   gas:maxVisited 4 ;
//   gas:linkType wdt:P40 .
// } }
//   OPTIONAL { ?item wdt:P279 ?linkTo }
//   SERVICE wikibase:label {bd:serviceParam wikibase:language "en" }
// }`);
//   console.log(result);
  return (
    <Container className="pt-3">
      <h1>TestPage</h1>
      <p>Todo</p>
      <h2>{`"${joke}"`}</h2>
    </Container>
  );
}
