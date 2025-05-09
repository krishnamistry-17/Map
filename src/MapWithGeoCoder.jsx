import { useRef, useEffect, useState } from "react";
import { Geocoder } from "@mapbox/search-js-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const accessToken = TOKEN;

const MapWithGeocoder = () => {
  const mapContainerRef = useRef();
  const mapInstanceRef = useRef();

  const [, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    mapboxgl.accessToken = accessToken;

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current, // container ID
      center: [75, 20], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });

    mapInstanceRef.current.on("load", () => {
      setMapLoaded(true);
    });
  }, []);

  return (
    <>
      <Geocoder
        accessToken={accessToken}
        map={mapInstanceRef.current}
        mapboxgl={mapboxgl}
        value={inputValue}
        onChange={(d) => {
          setInputValue(d);
        }}
        marker
      />
      <div id="map-container" ref={mapContainerRef} style={{ height: 300 }} />
    </>
  );
};
export default MapWithGeocoder;
