import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import ReactMapGL, { Marker } from "react-map-gl";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapLocation = () => {
  const mapContainerRef = useRef(null);
  const [lng, setLng] = useState(72.831062);
  const [lat, setLat] = useState(21.17024);
  const [zoom, setZoom] = useState(8);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/jay001/cmac3lvo600n301s45q2380v6",
        center: [lng, lat],
        zoom: zoom,
      });
    }

    // Get user's current location
    //used navigator-> geolocation and getcurrentpostion
    //geolocation->property-> coords

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setLng(longitude);
        setLat(latitude);
        setUserLocation({ longitude, latitude });

        map.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          duration: 2000,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    // Track user's location geolocation->property-> coords
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setLng(longitude);
        setLat(latitude);
        setUserLocation({ longitude, latitude });
        map.flyTo({
          center: [longitude, latitude],
          duration: 1000,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
    console.log("watchId :", watchId);

    // Clean up the watch position
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <>
      {userLocation && (
        <Marker
          longitude={userLocation.longitude}
          latitude={userLocation.latitude}
        ></Marker>
      )}
    </>
  );
};

export default MapLocation;
