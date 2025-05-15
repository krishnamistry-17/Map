import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import * as turf from "@turf/turf";

const TOKEN = "YOUR_MAPBOX_ACCESS_TOKEN";

mapboxgl.accessToken = TOKEN;

const DrawMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const draw = useRef(null);

  //   onLoad={({ target: map }) => {
  //   mapRef.current = map;

  //   const geocoder = new MapboxGeocoder({
  //     accessToken: TOKEN,
  //     mapboxgl: mapboxgl,
  //     placeholder: "Search location..",
  //     marker: {
  //       color: "orange",
  //     },
  //   });

  //   map.addControl(geocoder, "top-left");

  //   // Initialize MapboxDraw
  //   const draw = new MapboxDraw({
  //     displayControlsDefault: false,
  //     controls: {
  //       polygon: true,
  //       trash: true,
  //     },
  //     defaultMode: "draw_polygon",
  //   });

  //   map.addControl(draw);

  //   const updateArea = (e) => {
  //     const data = draw.getAll();
  //     if (data.features.length > 0) {
  //       const area = turf.area(data);
  //       setRoundArea(Math.round(area * 100) / 100);
  //     } else {
  //       setRoundArea(undefined);
  //       if (e.type !== "draw.delete") alert("Click on map to draw polygon");
  //     }
  //   };

  //   map.on("draw.create", updateArea);
  //   map.on("draw.delete", updateArea);
  //   map.on("draw.update", updateArea);
  // }};

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default DrawMap;
