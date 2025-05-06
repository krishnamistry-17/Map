// import React, { useState } from "react";
// import {
//   APIProvider,
//   InfoWindow,
//   Map,
//   Marker,
// } from "@vis.gl/react-google-maps";
// import Directions from "./Directions";

// const App = () => {
//   const [activeMarker, setActiveMarker] = useState(null);
//   console.log("activeMarker :", activeMarker);
//   const [hoverdMarker, setHoveredMarker] = useState(null);

//   const svgIcon =
//     `data:image/svg+xml;utf-8,` +
//     encodeURIComponent(`
//     <svg xmlns="http://www.w3.org/2000/svg" width="22" height="28" viewBox="0 0 22 28" fill="none">
//       <path d="M11 0.120087C8.08369 0.123477 5.28779 1.26659 3.22564 3.29867C1.16348 5.33075 0.00345217 8.08587 1.17029e-05 10.9597C-0.00348119 13.3081 0.774992 15.5929 2.21601 17.4634C2.21601 17.4634 2.51601 17.8527 2.56501 17.9088L11 27.7118L19.439 17.9039C19.483 17.8517 19.784 17.4634 19.784 17.4634L19.785 17.4605C21.2253 15.5907 22.0034 13.3071 22 10.9597C21.9966 8.08587 20.8365 5.33075 18.7744 3.29867C16.7122 1.26659 13.9163 0.123477 11 0.120087ZM11 14.9013C10.2089 14.9013 9.43553 14.6702 8.77773 14.237C8.11993 13.8039 7.60724 13.1883 7.30449 12.4681C7.00174 11.7478 6.92253 10.9553 7.07687 10.1907C7.23121 9.42608 7.61217 8.72374 8.17158 8.17249C8.73099 7.62124 9.44373 7.24583 10.2197 7.09374C10.9956 6.94165 11.7998 7.01971 12.5307 7.31804C13.2616 7.61638 13.8864 8.12159 14.3259 8.7698C14.7654 9.418 15 10.1801 15 10.9597C14.9987 12.0047 14.5768 13.0065 13.827 13.7454C13.0771 14.4843 12.0605 14.9 11 14.9013Z" fill="black"/>
//     </svg>
//   `);
//   {
//     /*mailinatore,yopemail */
//   }
//   const origin = { lat: 20.593683, lng: 78.962883 };

//   const destination = { lat: 21.155, lng: 72.98 };

//   return (
//     <APIProvider apiKey={"AIzaSyBLDpejeD6kFYkZuQZFN2-cE2s7qd2d-BY"}>
//       <Map
//         style={{
//           width: "100vw",
//           height: "100vh",
//         }}
//         defaultCenter={{ lat: 20.54992, lng: 90.98 }}
//         defaultZoom={3}
//         // gestureHandling={"greedy"}
//         // disableDefaultUI={true}
//       >
//         {/*latlng.net
//          */}
//         {/*for origin-india*/}
//         <Marker
//           position={origin}
//           onMouseOver={() => setHoveredMarker("origin")}
//           onMouseOut={() => setHoveredMarker(null)}
//         />
//         {hoverdMarker === "origin" && (
//           <InfoWindow position={origin}>
//             <div>Origin: India</div>
//           </InfoWindow>
//         )}

//         <Marker
//           position={destination}
//           onMouseOver={() => setHoveredMarker("destination")}
//           onMouseOut={() => setHoveredMarker(null)}
//         />
//         {hoverdMarker === "destination" && (
//           <InfoWindow position={destination}>
//             <div> Destination: Gujarat</div>
//           </InfoWindow>
//         )}

//         {/* Show Route */}
//         <Directions origin={origin} destination={destination} />

//         {/* {sub-destination} */}
//         <Marker
//           position={{ lat: 21.17024, lng: 72.85 }}
//           icon={{
//             url: svgIcon,
//             scaledSize: { width: 22, height: 28 },
//             fillColor: "black",
//           }}
//         />
//         <Marker
//           position={{ lat: 23.6666, lng: 75.6666 }}
//           icon={{
//             url: svgIcon,
//             scaledSize: { width: 22, height: 28 },
//             fillColor: "black",
//           }}
//         />
//       </Map>
//     </APIProvider>
//   );
// };

// export default App;
// {
//   /*AIzaSyBLDpejeD6kFYkZuQZFN2-cE2s7qd2d-BY */
// }

import React, { useState } from "react";
import Map, { Layer, Marker, NavigationControl, Source } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import Room from "@mui/icons-material/Room";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const App = () => {
  const [newdestination, setNewDestination] = useState(null);
  const [newplace, setNewPlace] = useState({
    lat: 23.103683,
    long: 78.962883,
    zoom: 4,
  });

  console.log("newplace :", newplace);

  const [viewPort, setViewPort] = useState({
    latitude: 20,
    longitude: 78,
    zoom: 3,
  });

  // const [routeGeoJSON, setRouteGeoJson] = useState(null);

  const destination = [77.218788, 28.632429]; //newdelhi

  const origin = [78.962883, 23.503683]; //india

  const routeGeoJSON = newdestination
    ? {
        type: "Feature",
        properties: {
          title: "Mapbox DC",
          "marker-symbol": "monument",
        },
        geometry: {
          type: "LineString",
          coordinates: [origin, destination],
        },
      }
    : null;

  console.log("routeGeoJSON  :", routeGeoJSON);

  const handleClick = (e) => {
    const { lng, lat } = e.lngLat;
    // setNewPlace({
    //   lat: lat,
    //   long: lng,
    // });
    setNewDestination([lng, lat]);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Map
        id="route"
        mapboxAccessToken={TOKEN}
        initialViewState={viewPort}
        mapStyle="mapbox://styles/jay001/cmac3lvo600n301s45q2380v6"
        style={{ width: "100vw", height: "100vh", zIndex: 999 }}
        onDblClick={handleClick}
        onMove={(evt) => setViewPort(evt.viewState)}
      >
        {routeGeoJSON && (
          <Source id="route" type="geojson" data={routeGeoJSON}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                "line-color": "#3b9ddd",
                "line-width": 5,
              }}
            />
          </Source>
        )}

        {newdestination && (
          <Marker latitude={newdestination[1]} longitude={newdestination[0]}>
            <Room style={{ fontSize: 30, color: "red" }} />
          </Marker>
        )}

        {/* Origin marker 78.962883, 23.503683 */}
        <Marker latitude={23.503683} longitude={78.962883}>
          <Room style={{ fontSize: 30, color: "green" }} />
        </Marker>

        {/* {newplace && (
          <Marker
            latitude={newplace.lat}
            longitude={newplace.long}
            offsetLeft={-3.5 * viewPort.zoom}
            offsetTop={-7 * viewPort.zoom}
          >
            <Room
              style={{
                fontSize: 7 * viewPort.zoom,
                cursor: "pointer",
                color: "tomato",
              }}
            />
          </Marker>
        )} */}
        <NavigationControl position="bottom-right" />
      </Map>
    </div>
  );
};

export default App;

{
  /*mapbox://styles/jay001/cmac3lvo600n301s45q2380v6
// mapstyle-https://api.mapbox.com/styles/v1/jay001/cmac3lvo600n301s45q2380v6.html?title=view&access_token=pk.eyJ1IjoiamF5MDAxIiwiYSI6ImNtYWMxdGl5OTI3NG8ya3NibDNxbWFxbW8ifQ.Dnj5BcnOy36tvKY0AHrlvA&zoomwheel=true&fresh=true#2/38/-34
//  */
}
