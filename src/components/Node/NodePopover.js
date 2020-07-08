// import React, {useState, useEffect, useRef} from "react";
// import {Button, Overlay, Popover, PopoverContent, PopoverTitle} from "react-bootstrap";
// import axios from "axios";
// import wbk from "wikidata-sdk";
//
// export default function NodePopover({
//                                       // node,
//                                       title,
//                                       qid,
//                                       lang,
//                                       // sitelink,
//                                       wikipediaPageName,
//                                       debug,
//                                     }) {
//   const [show, setShow] = useState(false);//showPropFromNode
//   const [target, setTarget] = useState(null);
//   const ref = useRef(null);
// //onhide
//   const handleClick = async (event)  => {
//     const wik = await wikipediaRequest(wikipediaPageName, "en");
//     setShow(!show);
//     setTarget(event.target);
//     // return wik;
//   };
//
//   // const handleClick = (event) => {
//   //   const wik = wikipediaRequest(qid, lang);
//   //   setShow(!show);
//   //   setTarget(event.target);
//   // };
//   // const content = await wikipediaRequest(sitelink, lang);
//   // console.log(content);
//
//   return (
//     <div ref={ref}>
//       <a href={`javascript:void(0)`} onClick={handleClick}>{title}</a>
//
//       <Overlay
//         show={show}
//         target={target}
//         placement="right"
//         container={ref.current}
//         containerPadding={20}
//       >
//         {/*<OverlayTrigger trigger="click" rootClose placement="right" overlay={popover}>   @orlando on hide callback falg to false */}
//         <Popover id="popover-contained">
//           {wikipediaPageName ? (
//             <Popover.Title as="h3">{wikipediaPageName}</Popover.Title>
//           ) : ""}
//           <Popover.Content>
//             Check this info.
//             <br/>
//             <a href={wbk.getSitelinkUrl({site: 'wikidata', title: qid})}
//                target="_blank">Wikidata</a> -
//             {wikipediaPageName ? (
//               <a href={wbk.getSitelinkUrl({site: 'enwiki', title: wikipediaPageName})} target="_blank">Wikipedia</a>
//             ) : ""}
//
//             {/*' + (first ? ' - <a href="' + first + '" target="_blank">Offical Website</a>*/}
//
//           </Popover.Content>
//         </Popover>
//       </Overlay>
//     </div>
//   );
// }
//
//
//
// export async function wikipediaRequest(id, languageCode) {
//   const url = "https://"+languageCode+".wikipedia.org/api/rest_v1/page/summary/" + id;
//   const content = await axios.get(url);
//   // const formattedEntity = await formatEntity(entities[id], languageCode);
//   return content;
// }
//
//
// // function wikipediaRequest(e,lang, first, table) {
// //   console.log("start");
// //   var e = $(e);
// //   e.off('hover');
// //   $.get("https://"+lang+".wikipedia.org/api/rest_v1/page/summary/" + e.attr("data-wiki") , function (d) { //+"?redirect=false"
// //     e.popover({
// //       html: true,
// //       content: (e.attr("data-wiki") === d.titles.canonical ? '<div class="wikipediatext">' + d.extract_html + '</div>' + (d.thumbnail ? '<img src="' + d.thumbnail.source + '" width="100%" />' : '') : "") + '<a href="https://www.wikidata.org/wiki/Q' + e.attr("data-id") + '" target="_blank">Wikidata</a> - <a href="https://en.wikipedia.org/wiki/' + e.attr("data-wiki") + '" target="_blank">Wikipedia</a>' + (first ? ' - <a href="' + first + '" target="_blank">Offical Website</a>' : '') + (table ? ' - <a href="/compare/' + table + '?Q82799=' + e.text() + '" target="_blank">' + table + ' table</a>' : '')
// //
// //     }).popover('show');
// //   });
// // }