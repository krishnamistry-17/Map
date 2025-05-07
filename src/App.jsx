import React, { useEffect, useState } from "react";
import Map, { Layer, Marker, NavigationControl, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Room from "@mui/icons-material/Room";
import axios from "axios";
import MapLocation from "./MapLocation";
const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const App = () => {
  const [newdestination, setNewDestination] = useState(null);

  const [newplace, setNewPlace] = useState({
    lat: 23.103683,
    long: 78.962883,
    zoom: 3,
  });

  {
    /*distance & duration */
  }

  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  // const [calculatedistance, setCalculateDistance] = useState(null);

  // const [routeCoords, setRouteCoords] = useState(null);
  // console.log("routeCoords :", routeCoords);

  //driving-direction Api
  useEffect(() => {
    const getRouteInfo = async () => {
      if (!newdestination) return;
      //mapbox-driving-direction  Api
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${newdestination[0]},${newdestination[1]}?geometries=geojson&access_token=${TOKEN}`;

      try {
        const response = await axios.get(url);
        const route = response.data.routes[0];

        const distanceInKm = route.distance / 1000;
        const durationInMin = route.duration / 60;

        setDistance(distanceInKm.toFixed(2));
        setDuration(durationInMin.toFixed(2));

        // setRouteCoords(route.geometry.coordinates); // Save the full route coordinates
      } catch (error) {
        console.error("Failed to fetch route info:", error);
      }
    };

    getRouteInfo();
  }, [newdestination]);

  // const [markerIndex, setMarkerIndex] = useState(0);
  // console.log("markerIndex :", markerIndex);

  // useEffect(() => {
  //   if (routeCoords?.length === 0) return;

  //   const interval = setInterval(() => {
  //     setMarkerIndex((prev) => {
  //       //set marker index depending on rouecord small or big
  //       if (prev < routeCoords?.length - 1) {
  //         return prev + 1;
  //       } else {
  //         clearInterval(interval); //clear interval
  //         return prev;
  //       }
  //     });
  //   }, 100);

  //   return () => clearInterval(interval);
  // }, [routeCoords]);

  const [viewPort, setViewPort] = useState({
    latitude: 20,
    longitude: 78,
    zoom: 3,
  });

  const origin = [72.831062, 21.17024]; //india-surat

  /*route*/

  const routeGeoJSON = newdestination
    ? {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [origin, newdestination],
        },
      }
    : null;

  const handleClick = (e) => {
    const { lng, lat } = e.lngLat;
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

        {/* Origin /*surat-lat-21.170240,long-72.831062 */}
        <Marker latitude={21.17024} longitude={72.831062}>
          <Room style={{ fontSize: 30, color: "green" }} />
        </Marker>

        {distance && duration && (
          <div
            style={{
              position: "absolute",
              top: 15,
              left: 15,
              background: "white",
              padding: "15px",
              borderRadius: "8px",
              color: "red",
              zIndex: 1000,
            }}
          >
            <div style={{ fontSize: "13px" }}>
              <strong>Distance:</strong> {distance} km
            </div>
            <div style={{ paddingTop: "8px", fontSize: "13px" }}>
              <strong>Duration:</strong> {duration} minutes
            </div>
          </div>
        )}

        {/* {routeCoords?.length > 0 && markerIndex < routeCoords.length && (
          <Marker
            longitude={routeCoords[markerIndex][0]}
            latitude={routeCoords[markerIndex][1]}
          >
            <Room style={{ fontSize: 20, color: "blue" }} />
          </Marker>
        )} */}
        <MapLocation />
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
