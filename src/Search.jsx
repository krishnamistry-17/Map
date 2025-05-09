import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import ReactMapGL, { Marker } from "react-map-gl";
import { SearchBox } from "@mapbox/search-js-react";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const Search = () => {
  const mapContainerRef = useRef(null);

  const mapInstanceRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");

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
    //gelocation instance method ->  getcurrentpostion
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
        enableHighAccuracy: true, //aplication try to get best result
        timeout: 5000,
        maximumAge: 0,
      }
    );

    // Track user's location
    //  geolocation->property-> coords
    //geolocation instance mnethod -> watchpositiion
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

  useEffect(() => {
    mapboxgl.accessToken = TOKEN;
    if (mapContainerRef.current) {
      mapInstanceRef.current = new mapboxgl.Map({
        container: mapContainerRef.current, // container ID
        center: [72.831062, 21.17024], // starting position [lng, lat] lat-21.170240,long-72.831062
        zoom: 9, // starting zoom
      });
      mapInstanceRef.current.on("load", () => {
        setMapLoaded(true);
      });
    }
  }, []);

  return (
    <>
      <div style={{ width: "150px", height: "25px" }}>
        <SearchBox
          accessToken={TOKEN}
          map={mapInstanceRef.current}
          mapboxgl={mapboxgl}
          value={inputValue}
          onChange={(d) => {
            setInputValue(d);
          }}
          marker
        />
        <div id="map-container" ref={mapContainerRef} style={{ height: 300 }} />
      </div>
      {userLocation && (
        <Marker
          longitude={userLocation.longitude} //marker for long and lang that shows users location
          latitude={userLocation.latitude}
        ></Marker>
      )}
    </>
  );
};

export default Search;
