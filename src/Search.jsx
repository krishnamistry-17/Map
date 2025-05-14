import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
//css
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const Search = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/jay001/cmac3lvo600n301s45q2380v6",
      center: [72, 20],
      zoom: 3,
    });
    mapInstanceRef.current = map;

    //add geocoder control
    const geocoder = new MapboxGeocoder({
      accessToken: TOKEN,
      mapboxgl: mapboxgl,
      placeholder: "Search place",
      marker: {
        color: "orange",
      },
    });
    map.addControl(geocoder, "top-left");
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "100%" }}
      ></div>
    </div>
  );
};

export default Search;
