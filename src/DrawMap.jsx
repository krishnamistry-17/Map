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

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/jay001/cmac3lvo600n301s45q2380v6",
      center: [78, 22],
      zoom: 4,
    });

    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "draw_polygon",
    });

    map.current.addControl(draw.current, "top-left");

    map.current.on("draw.create", updateArea);
    map.current.on("draw.update", updateArea);
    map.current.on("draw.delete", updateArea);

    function updateArea(e) {
      const data = draw.current.getAll();
      if (data.features.length > 0) {
        const area = turf.area(data);
        alert(`Area: ${Math.round(area)} m²`);
      } else {
        alert("Click the map to draw a polygon.");
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default DrawMap;
