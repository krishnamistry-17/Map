import { useEffect, useRef, useState } from "react";
import Map, {
  GeolocateControl,
  NavigationControl,
  Source,
  Layer,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
//css
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

//make a cluster layer and define type and paints
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

//make cluster count layer that define source and layout
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

//make unclustered point layer that define source and paint

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

//style changes options
const styleOptions = {
  Custom: "mapbox://styles/jay001/cmac3lvo600n301s45q2380v6",
  Satellite: "mapbox://styles/mapbox/standard-satellite",
};

const App = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef();
  const animationFrameRef = useRef(null);

  const [userlocation, setUserLocation] = useState(null);
  const [pathCoords, setPathCoords] = useState([]);
  const [earthquakeData, setEarthquakeData] = useState([]);
  const [heatData, setHeatData] = useState([]);
  const [viewMode, setViewMode] = useState();
  const [isRotating, setIsRotating] = useState(true);
  const [mapStyle, setMapStyle] = useState(styleOptions.Custom);
  const [roundArea, setRoundArea] = useState();
  const [calLat, setCalLat] = useState();
  const [calLng, setCalLng] = useState();
  const [viewPort, setViewPort] = useState({
    latitude: 20,
    longitude: 72,
    zoom: 2,
  });

  //watch user loca tion using watchposition and coords
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

  //heat map data
  useEffect(() => {
    fetch("https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson")
      .then((res) => res.json())
      .then((data) => setHeatData(data));
  });

  //rotation camera
  let animationFrameId = null;
  const rotateCamera = (timestamp) => {
    if (!mapRef.current || isRotating) return;
    const map = mapRef.current;
    // Rotate by time
    const angle = (timestamp / 100) % 360;
    map.rotateTo(angle, { duration: 0 });

    animationFrameRef.current = requestAnimationFrame(rotateCamera);
  };

  //rotating
  useEffect(() => {
    if (isRotating) {
      animationFrameRef.current = requestAnimationFrame(rotateCamera);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isRotating]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Map
        ref={mapRef}
        id="route"
        mapboxAccessToken={TOKEN}
        initialViewState={viewPort}
        mapStyle={mapStyle}
        style={{ width: "100vw", height: "100vh", zIndex: 999 }}
        onMove={(evt) => setViewPort(evt.viewState)}
        dragPan={true}
        scrollZoom={true}
        boxZoom={true}
        dragRotate={true}
        keyboard={true}
        touchZoomRotate={true}
        onLoad={({ target: map }) => {
          mapRef.current = map;

          // Setup Geocoder
          const geocoder = new MapboxGeocoder({
            accessToken: TOKEN,
            mapboxgl: mapboxgl,
            placeholder: "Search location...",
            marker: { color: "orange" },
          });
          map.addControl(geocoder, "top-left");

          // Setup Mapbox Draw to draw polygon
          const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
              polygon: true,
              trash: true,
            },
            defaultMode: "draw_polygon",
          });

          map.addControl(draw, "top-right");
          //calculate area using turf
          const updateArea = (e) => {
            const data = draw.getAll();
            if (data.features.length > 0) {
              const area = turf.area(data);
              setRoundArea(Math.round(area * 100) / 100);
              const coordinates = data.features[0].geometry.coordinates[0]; // calculate lat lng for polygon coordinate
              console.log("Polygon coordinates>>:", coordinates);
            } else {
              setRoundArea(undefined);
              if (e.type !== "draw.delete")
                alert("Click on map to draw polygon");
            }
          };
          map.on("draw.create", updateArea);
          map.on("draw.delete", updateArea);
          map.on("draw.update", updateArea);

          //listeners used with on method- (move,click) also use rotate insted of move
          map.on("move", () => {
            console.log("Map is moving");
          });

          map.on("click", (e) => {
            console.log(`Clicked at: ${e.lngLat.lng}, ${e.lngLat.lat}`);
          });

          map.on("rotateend", (e) => {
            console.log("Rotation end");
          });

          // Heatmap layer
          map.addLayer(
            {
              id: "earthquakes-heat",
              type: "heatmap",
              source: "earthquakes",
              maxzoom: 9,
              paint: {
                "heatmap-weight": [
                  "interpolate",
                  ["linear"],
                  ["get", "mag"],
                  0,
                  0,
                  6,
                  1,
                ],
                "heatmap-intensity": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  0,
                  1,
                  9,
                  3,
                ],
                "heatmap-color": [
                  "interpolate",
                  ["linear"],
                  ["heatmap-density"],
                  0,
                  "rgba(33,102,172,0)",
                  0.2,
                  "rgb(103,169,207)",
                  0.4,
                  "rgb(209,229,240)",
                  0.6,
                  "rgb(253,219,199)",
                  0.8,
                  "rgb(239,138,98)",
                  1,
                  "rgb(178,24,43)",
                ],
                "heatmap-radius": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  0,
                  2,
                  9,
                  20,
                ],
                "heatmap-opacity": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  7,
                  1,
                  9,
                  0,
                ],
              },
            }
            // "waterway-label" // place it below labels
          );

          // Point Layer
          map.addLayer(
            {
              id: "earthquakes-point",
              type: "circle",
              source: "earthquakes",
              minzoom: 7,
              paint: {
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  7,
                  ["interpolate", ["linear"], ["get", "mag"], 1, 1, 6, 4],
                  16,
                  ["interpolate", ["linear"], ["get", "mag"], 1, 5, 6, 50],
                ],
                "circle-color": [
                  "interpolate",
                  ["linear"],
                  ["get", "mag"],
                  1,
                  "rgba(33,102,172,0)",
                  2,
                  "rgb(103,169,207)",
                  3,
                  "rgb(209,229,240)",
                  4,
                  "rgb(253,219,199)",
                  5,
                  "rgb(239,138,98)",
                  6,
                  "rgb(249, 98, 116)",
                ],
                "circle-stroke-color": "white",
                "circle-stroke-width": 1,
                "circle-opacity": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  7,
                  0,
                  8,
                  1,
                ],
              },
            }
            // "waterway-label"
          );

          // Start camera rotation
          mapRef.current.on("load", () => {
            animationFrameRef.current = requestAnimationFrame(rotateCamera);
          });
          rotateCamera(0);

          // Optional: Remove labels
          // const layers = mapRef.current.getStyle().layers;
          // for (const layer of layers) {
          //   if (layer.type === "symbol" && layer.layout["text-field"]) {
          //     mapRef.current.removeLayer(layer.id);
          //   }
          // }
          // // Add 3D buildings
          // mapRef.current.addLayer({
          //   id: "3d-buildings",
          //   source: "composite",
          //   "source-layer": "building",
          //   filter: ["==", "extrude", "true"],
          //   type: "fill-extrusion",
          //   minzoom: 15,
          //   paint: {
          //     "fill-extrusion-color": "#aaa",
          //     "fill-extrusion-height": [
          //       "interpolate",
          //       ["linear"],
          //       ["zoom"],
          //       15,
          //       0,
          //       15.05,
          //       ["get", "height"],
          //     ],
          //     "fill-extrusion-base": [
          //       "interpolate",
          //       ["linear"],
          //       ["zoom"],
          //       15,
          //       0,
          //       15.05,
          //       ["get", "min_height"],
          //     ],
          //     "fill-extrusion-opacity": 0.6,
          //   },
          // });
        }}
        interactiveLayerIds={["clusters", "unclustered-point"]}
        onClick={(event) => {
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
        {/*cluster */}
        {earthquakeData && viewMode === "cluster" && (
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
        )}
        {/*heatmap */}
        {earthquakeData && viewMode === "heatmap" && (
          <Source id="earthquakes-heat" type="geojson" data={earthquakeData}>
            <Layer
              id="earthquakes-heat"
              type="heatmap"
              source="earthquakes-heat"
              maxzoom={9}
              paint={{
                "heatmap-weight": [
                  "interpolate",
                  ["linear"],
                  ["get", "mag"],
                  0,
                  0,
                  6,
                  1,
                ],
                "heatmap-intensity": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  0,
                  1,
                  9,
                  3,
                ],
                "heatmap-color": [
                  "interpolate",
                  ["linear"],
                  ["heatmap-density"],
                  0,
                  "rgba(33,102,172,0)",
                  0.2,
                  "rgb(103,169,207)",
                  0.4,
                  "rgb(209,229,240)",
                  0.6,
                  "rgb(253,219,199)",
                  0.8,
                  "rgb(239,138,98)",
                  1,
                  "rgb(178,24,43)",
                ],
                "heatmap-radius": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  0,
                  2,
                  9,
                  20,
                ],
                "heatmap-opacity": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  7,
                  1,
                  9,
                  0,
                ],
              }}
            />
            <Layer
              id="earthquakes-point"
              type="circle"
              source="earthquakes-heat"
              minzoom={7}
              paint={{
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  7,
                  ["interpolate", ["linear"], ["get", "mag"], 1, 1, 6, 4],
                  16,
                  ["interpolate", ["linear"], ["get", "mag"], 1, 5, 6, 50],
                ],
                "circle-color": [
                  "interpolate",
                  ["linear"],
                  ["get", "mag"],
                  1,
                  "rgba(33,102,172,0)",
                  2,
                  "rgb(103,169,207)",
                  3,
                  "rgb(209,229,240)",
                  4,
                  "rgb(253,219,199)",
                  5,
                  "rgb(239,138,98)",
                  6,
                  "rgb(178,24,43)",
                ],
                "circle-stroke-color": "white",
                "circle-stroke-width": 1,
                "circle-opacity": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  7,
                  0,
                  8,
                  1,
                ],
              }}
            />
          </Source>
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

        {/*click button */}
        {/* <div
          style={{
            position: "absolute",
            bottom: 45,
            left: 10,
            backgroundColor: "white",
            padding: "5px",
          }}
        >
          <button
            style={{
              fontSize: "13px",
              backgroundColor: "white",
              color: "black",
            }}
            onClick={() =>
              setViewMode((prev) =>
                prev === "cluster" ? "heatmap" : "cluster"
              )
            }
          >
            Click
          </button>
        </div> */}

        {/*select map */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 100,
            zIndex: 1000,
            backgroundColor: "white",
          }}
        >
          <select
            value={mapStyle}
            onChange={(e) => setMapStyle(e.target.value)}
            style={{ fontSize: "13px", padding: "10px" }}
          >
            {Object.entries(styleOptions).map(([label, value]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/*pause button */}
        {/* <div
          style={{
            position: "absolute",
            bottom: 150,
            right: 10,
            zIndex: 1000,
          }}
        >
          <button
            style={{ backgroundColor: "white", color: "black" }}
            onClick={() => setIsRotating((prev) => !prev)}
          >
            {isRotating ? "Pause Rotation" : "Resume Rotation"}
          </button>
        </div> */}

        {/*calculation-box */}
        <div
          className="calculation-box"
          style={{
            height: 65,
            width: 150,
            position: "absolute",
            bottom: 25,
            right: 15,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: 16,
            textAlign: "center",
          }}
        >
          <p style={{ fontFamily: "Open Sans", margin: 0, fontSize: "13px " }}>
            Click the map to draw a polygon.
          </p>
          <div id="calculated-area">
            {roundArea && (
              <>
                <p
                  style={{
                    fontFamily: "Open Sans",
                    margin: 0,
                    fontSize: "13px ",
                    color: "black",
                  }}
                >
                  <strong>{roundArea}</strong>
                </p>
                <p
                  style={{
                    fontFamily: "Open Sans",
                    margin: 0,
                    fontSize: "13px ",
                    color: "black",
                  }}
                >
                  square meters
                </p>
              </>
            )}
          </div>
        </div>

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
