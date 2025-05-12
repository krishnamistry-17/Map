import { useEffect, useRef, useState } from "react";
import Map, {
  GeolocateControl,
  Marker,
  NavigationControl,
  Source,
  Layer,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const App = () => {
  const [userlocation, setUserLocation] = useState(null);
  const [pathCoords, setPathCoords] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  console.log("pathCoords>>>> :", pathCoords);

  const [viewPort, setViewPort] = useState({
    latitude: 20,
    longitude: 72,
    zoom: 3,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Update user location
        setUserLocation({ latitude, longitude });

        setPathCoords((prev) => [...prev, [longitude, latitude]]);
      },
      (error) => {
        console.error("Error getting location updates:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Map
        id="route"
        mapboxAccessToken={TOKEN}
        initialViewState={viewPort}
        mapStyle="mapbox://styles/jay001/cmac3lvo600n301s45q2380v6"
        style={{ width: "100vw", height: "100vh", zIndex: 999 }}
        onMove={(evt) => setViewPort(evt.viewState)}
      >
        <GeolocateControl
          position="top-right"
          showUserLocation={true}
          trackUserLocation={true}
          onGeolocate={(pos) => {
            const { longitude, latitude } = pos.coords;
            setUserLocation({ latitude, longitude });

            setViewPort((prev) => ({
              ...prev,
              latitude,
              longitude,
              zoom: 10,
              transitionDuration: 1000,
            }));
          }}
        />

        <NavigationControl position="top-right" />

        {/* Walking path line */}
        {pathCoords.length > 1 && (
          <Source
            id="user-path"
            type="geojson"
            data={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: pathCoords,
              },
            }}
          >
            <Layer
              id="line-layer"
              type="line"
              paint={{
                "line-color": "#3b9ddd",
                "line-width": 6,
                "line-opacity": 0.75,
              }}
            />
          </Source>
        )}

        {/* User coordinates display */}
        {userlocation && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 49,
              color: "black",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "6px",
              fontSize: "12px",
              zIndex: 1000,
            }}
          >
            <div>
              <strong style={{ paddingRight: "5px" }}>Lat:</strong>
              {userlocation.latitude}
            </div>
            <div>
              <strong>Lng:</strong> {userlocation.longitude}
            </div>
          </div>
        )}
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
