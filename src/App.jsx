import { useEffect, useRef, useState } from "react";
import Map, {
  GeolocateControl,
  Marker,
  NavigationControl,
  Source,
  Layer,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const clusterLayer = {
  id: "clusters",
  type: "circle",
  source: "earthquakes",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#51bbd6",
      100,
      "#f1f075",
      750,
      "#f28cb1",
    ],
    "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
  },
};

const clusterCountLayer = {
  id: "cluster-count",
  type: "symbol",
  source: "earthquakes",
  filter: ["has", "point_count"],
  layout: {
    "text-field": ["get", "point_count_abbreviated"],
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
};

const unclusteredPointLayer = {
  id: "unclustered-point",
  type: "circle",
  source: "earthquakes",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": "#11b4da",
    "circle-radius": 4,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  },
};

const App = () => {
  const [userlocation, setUserLocation] = useState(null);
  const [pathCoords, setPathCoords] = useState([]);
  const [earthquakeData, setEarthquakeData] = useState([]);

  const mapRef = useRef();
  const [viewPort, setViewPort] = useState({
    latitude: 20,
    longitude: 72,
    zoom: 3,
  });

  //watch user location using watchposition and coords
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

  // add the clustering for earthquakes
  useEffect(() => {
    fetch("https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson")
      .then((res) => res.json())
      .then((data) => setEarthquakeData(data));
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
        interactiveLayerIds={["clusters", "unclustered-point"]}
        onClick={(event) => {
          console.log("Click event:", event);
          console.log("Features:", event.features); // Should not be undefined
          const feature = event.features?.[0];

          if (!feature) return;

          if (feature.layer.id === "clusters") {
            const clusterId = feature.properties.cluster_id;
            const mapboxSource = event.target.getSource("earthquakes");
            mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;

              event.target.easeTo({
                center: feature.geometry.coordinates,
                zoom,
                duration: 500,
              });
            });
          } else if (feature.layer.id === "unclustered-point") {
            const coordinates = feature.geometry.coordinates.slice();
            const mag = feature.properties.mag;
            const tsunami = feature.properties.tsunami === 1 ? "Yes" : "No";

            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(`Magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`)
              .addTo(event.target);
          }
        }}
      >
        {earthquakeData && (
          <div
            style={{
              backgroundColor: "white",
              color: "black",
              padding: "8px",
              borderRadius: "5px",
            }}
          >
            <Source
              id="earthquakes"
              type="geojson"
              data={earthquakeData}
              cluster={true}
              clusterMaxZoom={14}
              clusterRadius={50}
            >
              <Layer {...clusterLayer} />
              <Layer {...clusterCountLayer} />
              <Layer {...unclusteredPointLayer} />
            </Source>
          </div>
        )}
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
                "line-width": 7,
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
