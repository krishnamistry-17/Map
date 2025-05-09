
//>>>old location
// import React, { useState, useEffect, useRef } from "react";
// import mapboxgl from "mapbox-gl";
// import ReactMapGL, { Marker } from "react-map-gl";

// const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// const MapLocation = () => {

//   const mapContainerRef = useRef(null);
//   const mapRef = useRef(null);
//   const markerRef = useRef(null);

//   const [lng, setLng] = useState(72.831062);
//   const [lat, setLat] = useState(21.17024);

//   // const [routeCoords, setRouteCoords] = useState(null);
//   // console.log("routeCoords :", routeCoords);

//   useEffect(() => {
//     if (mapContainerRef.current && mapRef.current) {
//       const map = new mapboxgl.Map({
//         container: mapContainerRef.current,
//         style: "mapbox://styles/jay001/cmac3lvo600n301s45q2380v6",
//         center: [lng, lat],
//         zoom: 8,
//       });

//       //add marker to get map
//       markerRef.current = new mapboxgl.Marker()
//         .setLngLat([lng, lat])
//         .addTo(mapRef.current);

//       // Get user's current location
//       //used navigator-> geolocation and getcurrentpostion
//       //gelocation instance method ->  getcurrentpostion
//       //geolocation->property-> coords

//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { longitude, latitude } = position.coords;
//           setLng(longitude);
//           setLat(latitude);
//           setUserLocation({ longitude, latitude });

//           map.flyTo({
//             center: [longitude, latitude],
//             zoom: 15,
//             duration: 2000,
//           });
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//         },
//         {
//           enableHighAccuracy: true, //aplication try to get best result
//           timeout: 5000,
//           maximumAge: 0,
//         }
//       );

//       // Track user's location
//       //  geolocation->property-> coords
//       //geolocation instance mnethod -> watchpositiion
//       const watchId = navigator.geolocation.watchPosition(
//         (position) => {
//           const { longitude, latitude } = position.coords;
//           setLng(longitude);
//           setLat(latitude);
//           setUserLocation({ longitude, latitude });
//           // setRouteCoords(route.geometry.coordinates); // Save the full route coordinates

//           map.flyTo({
//             center: [longitude, latitude],
//             duration: 1000,
//           });
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//         }
//       );
//       console.log("watchId>>>> :", watchId);
//       return () => navigator.geolocation.clearWatch(watchId);
//     }
//     // Clean up the watch position
//   }, []);

//   // const [markerIndex, setMarkerIndex] = useState(0);

//   // useEffect(() => {
//   //   if (routeCoords?.length === 0) return;

//   //   const interval = setInterval(() => {
//   //     setMarkerIndex((prev) => {
//   //       //set marker index depending on rouecord small or big
//   //       if (prev < routeCoords?.length - 1) {
//   //         return prev + 1;
//   //       } else {
//   //         clearInterval(interval); //clear interval
//   //         return prev;
//   //       }
//   //     });
//   //   }, 100);

//   //   return () => clearInterval(interval);
//   // }, [routeCoords]);

//   return (
//     <>
//       <div>
//         <div ref={markerRef} style={{ width: "100%", height: "500px" }}></div>
//         {/* {routeCoords?.length > 0 && markerIndex < routeCoords.length && (
//           <Marker
//             longitude={routeCoords[markerIndex][0]}
//             latitude={routeCoords[markerIndex][1]}
//           >
//             <Room style={{ fontSize: 20, color: "blue" }} />
//           </Marker>
//         )} */}
//       </div>
//     </>
//   );
// };

// export default MapLocation;

//>>old app
// import React, { useEffect, useState } from "react";
// import Map, {
//   GeolocateControl,
//   Layer,
//   Marker,
//   NavigationControl,
//   Source,
// } from "react-map-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
// import Room from "@mui/icons-material/Room";

// import axios from "axios";
// import MapLocation from "./MapLocation";

// const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// const App = () => {
//   const [newdestination, setNewDestination] = useState(null);
//   // console.log("newdestination :", newdestination);

//   // const [newplace, setNewPlace] = useState({
//   //   lat: 23.103683,
//   //   long: 78.962883,
//   //   zoom: 3,
//   // });

//   {
//     /*distance & duration */
//   }

//   // const [distance, setDistance] = useState(null);
//   // const [duration, setDuration] = useState(null);

//   const [userlocation, setUserLocation] = useState();
//   // console.log("userlocation :", userlocation);

//   // const [routeCoords, setRouteCoords] = useState(null);
//   // console.log("routeCoords :", routeCoords);

//   //driving-direction Api
//   // useEffect(() => {
//   //   const getRouteInfo = async () => {
//   //     if (!newdestination) return;
//   //     //mapbox-driving-direction  Api
//   //     const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${newdestination[0]},${newdestination[1]}?geometries=geojson&access_token=${TOKEN}`;

//   //     try {
//   //       const response = await axios.get(url);
//   //       const route = response.data.routes[0];

//   //       const distanceInKm = route.distance / 1000;
//   //       const durationInMin = route.duration / 60;

//   //       setDistance(distanceInKm.toFixed(2));
//   //       setDuration(durationInMin.toFixed(2));

//   //       // setRouteCoords(route.geometry.coordinates); // Save the full route coordinates
//   //     } catch (error) {
//   //       console.error("Failed to fetch route info:", error);
//   //     }
//   //   };

//   //   getRouteInfo();
//   // }, [newdestination]);

//   // const [markerIndex, setMarkerIndex] = useState(0);
//   // console.log("markerIndex :", markerIndex);

//   // useEffect(() => {
//   //   if (routeCoords?.length === 0) return;

//   //   const interval = setInterval(() => {
//   //     setMarkerIndex((prev) => {
//   //       //set marker index depending on rouecord small or big
//   //       if (prev < routeCoords?.length - 1) {
//   //         return prev + 1;
//   //       } else {
//   //         clearInterval(interval); //clear interval
//   //         return prev;
//   //       }
//   //     });
//   //   }, 100);

//   //   return () => clearInterval(interval);
//   // }, [routeCoords]);

//   const [viewPort, setViewPort] = useState({
//     latitude: 20,
//     longitude: 75,
//     zoom: 3,
//   });

//   useEffect(() => {
//     if (!navigator.geolocation) {
//       console.warn("Geolocation is not supported by this browser.");
//       return;
//     }

//     const watchId = navigator.geolocation.watchPosition(
//       (position) => {
//         console.log(
//           "updte",
//           position.coords.latitude,
//           position.coords.longitude
//         );

//         const { latitude, longitude } = position.coords;

//         setUserLocation({ lat: latitude, lng: longitude });

//         // console.log("User moved to:", latitude);
//         // console.log("User moved to:", longitude);
//       },
//       (error) => {
//         console.error("Error getting location updates:", error);
//       },
//       {
//         enableHighAccuracy: true,
//         maximumAge: 0,
//         timeout: 5000,
//       }
//     );

//     // Cleanup function
//     return () => navigator.geolocation.clearWatch(watchId);
//   }, []);

//   // const origin = [72.831062, 21.17024]; //india-surat

//   //   /*route*/
//   // Lat:21.2235218
//   // Lng: 72.8020522

//   // const routeGeoJSON = newdestination
//   //   ? {
//   //       type: "Feature",
//   //       properties: {},
//   //       geometry: {
//   //         type: "LineString",
//   //         coordinates: [origin, newdestination],
//   //       },
//   //     }
//   //   : null;

//   // const handleClick = (e) => {
//   //   const { lng, lat } = e.lngLat;
//   //   setNewDestination([lng, lat]);
//   // };

//   return (
//     <div style={{ width: "100vw", height: "100vh" }}>
//       <Map
//         id="route"
//         mapboxAccessToken={TOKEN}
//         initialViewState={viewPort}
//         mapStyle="mapbox://styles/jay001/cmac3lvo600n301s45q2380v6"
//         style={{ width: "100vw", height: "100vh", zIndex: 999 }}
//         // onDblClick={handleClick}
//         onMove={(evt) => setViewPort(evt.viewState)}
//       >
//         <GeolocateControl
//           position="top-right"
//           showUserLocation={true}
//           trackUserLocation={true}
//           onGeolocate={(pos) => {
//             const { longitude, latitude } = pos.coords;
//             setUserLocation({
//               latitude: pos.coords.latitude,
//               longitude: pos.coords.longitude,
//             });

//             // console.log(" latitude>>>>>>user :", latitude);
//             // console.log("longitude: >>>>user:", longitude);

//             setViewPort((prev) => ({
//               ...prev,
//               latitude,
//               longitude,
//               zoom: 10,
//               transitionDuration: 1000,
//             }));
//           }}
//         />

//         <NavigationControl position="bottom-right" />

//         {userlocation && (
//           <div
//             style={{
//               position: "absolute",
//               top: 10,
//               right: 49,
//               color: "black",
//               backgroundColor: "white",
//               padding: "10px",
//               borderRadius: "6px",
//               fontSize: "12px",
//               zIndex: 1000,
//             }}
//           >
//             <div>
//               <strong style={{ paddingRight: "5px" }}>Lat:</strong>
//               {userlocation.latitude}
//             </div>
//             <div>
//               <strong>Lng:</strong> {userlocation.longitude}
//             </div>
//           </div>
//         )}

//         {/* {routeGeoJSON && (
//           <Source id="route" type="geojson" data={routeGeoJSON}>
//             <Layer
//               id="route-line"
//               type="line"
//               paint={{
//                 "line-color": "#3b9ddd",
//                 "line-width": 5,
//               }}
//             />
//           </Source>
//         )} */}

//         {newdestination && (
//           <Marker latitude={newdestination[1]} longitude={newdestination[0]}>
//             <Room style={{ fontSize: 30, color: "red" }} />
//           </Marker>
//         )}

//         {/* Origin /*surat-lat-21.170240,long-72.831062 */}
//         {/* <Marker latitude={21.17024} longitude={72.831062}>
//           <Room style={{ fontSize: 30, color: "green" }} />
//         </Marker> */}

//         {/* {distance && duration && (
//           <div
//             style={{
//               position: "absolute",
//               top: 15,
//               left: 15,
//               background: "white",
//               padding: "15px",
//               borderRadius: "8px",
//               color: "red",
//               zIndex: 1000,
//             }}
//           >
//             <div style={{ fontSize: "13px" }}>
//               <strong>Distance:</strong> {distance} km
//             </div>
//             <div style={{ paddingTop: "8px", fontSize: "13px" }}>
//               <strong>Duration:</strong> {duration} minutes
//             </div>
//           </div>
//         )} */}

//         {/* {routeCoords?.length > 0 && markerIndex < routeCoords.length && (
//           <Marker
//             longitude={routeCoords[markerIndex][0]}
//             latitude={routeCoords[markerIndex][1]}
//           >
//             <Room style={{ fontSize: 20, color: "blue" }} />
//           </Marker>
//         )} */}
//       </Map>
//     </div>
//   );
// };

// export default App;

{
  /*mapbox://styles/jay001/cmac3lvo600n301s45q2380v6
// mapstyle-https://api.mapbox.com/styles/v1/jay001/cmac3lvo600n301s45q2380v6.html?title=view&access_token=pk.eyJ1IjoiamF5MDAxIiwiYSI6ImNtYWMxdGl5OTI3NG8ya3NibDNxbWFxbW8ifQ.Dnj5BcnOy36tvKY0AHrlvA&zoomwheel=true&fresh=true#2/38/-34
//  */
}
