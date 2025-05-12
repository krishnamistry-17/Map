import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

// const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapLocation = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const [lng, setLng] = useState();
  const [lat, setLat] = useState();

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiamF5MDAxIiwiYSI6ImNtYWMxdGl5OTI3NG8ya3NibDNxbWFxbW8ifQ.Dnj5BcnOy36tvKY0AHrlvA";

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/jay001/cmac3lvo600n301s45q2380v6",
        center: [lng, lat],
        zoom: 5,
      });

      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      });

      mapRef.current.addControl(geolocateControl, "top-right");

      const geocoder = new MapboxGeocoder({
        accessToken: TOKEN,
        mapboxgl: mapboxgl,
        marker: true,
      });

      map.addControl(geocoder, "top-left");

      geolocateControl.on("error", (e) =>
        console.error("Geolocation error:", e.error.message)
      );
    }

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <>
      <div ref={mapContainerRef} style={{ height: "100vh" }} />
    </>
  );
};

export default MapLocation;
