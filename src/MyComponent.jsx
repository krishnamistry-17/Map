import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MyComponent = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const previousLocation = useRef(null);

  const [lng, setLng] = useState();
  const [lat, setLat] = useState();
  const [pathCoordinates, setPathCoordinates] = useState([]);

  useEffect(() => {
    if (map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/jay001/cmac3lvo600n301s45q2380v6",
        center: [lng, lat],
        zoom: 16,
      });

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLng(longitude);
          setLat(latitude);

          map.current.flyTo({ center: [longitude, latitude], duration: 1000 });

          if (previousLocation.current) {
            getDirections(
              previousLocation.current.longitude,
              previousLocation.current.latitude,
              longitude,
              latitude
            );
          }

          setPathCoordinates((prev) => [...prev, [longitude, latitude]]);
          previousLocation.current = { longitude, latitude };
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

      map.current.on("load", () => {
        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: pathCoordinates,
            },
          },
        });

        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 4,
            "line-opacity": 0.75,
          },
        });
      });

      return () => {
        navigator.geolocation.clearWatch(watchId);
        if (map.current) map.current.remove();
      };
    }
  }, [lng, lat, pathCoordinates]);

  useEffect(() => {
    if (map.current && map.current.getSource("route")) {
      map.current.getSource("route").setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: pathCoordinates,
        },
      });
    }
  }, [pathCoordinates]);

  const getDirections = async (startLng, startLat, endLng, endLat) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${startLng},${startLat};${endLng},${endLat}?geometries=geojson&access_token=${TOKEN}`
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const newCoordinates = data.routes[0].geometry.coordinates;
        setPathCoordinates((prevCoordinates) => [
          ...prevCoordinates,
          ...newCoordinates,
        ]);
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  return (
    <>
      <div ref={mapContainer} style={{ height: "400px" }} />
    </>
  );
};

export default MyComponent;
