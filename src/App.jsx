import React, { useState } from "react";
import {
  APIProvider,
  InfoWindow,
  Map,
  Marker,
} from "@vis.gl/react-google-maps";

const App = () => {
  const [activeMarker, setActiveMarker] = useState(null);
  console.log("activeMarker :", activeMarker);

  const svgIcon =
    `data:image/svg+xml;utf-8,` +
    encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="28" viewBox="0 0 22 28" fill="none">
      <path d="M11 0.120087C8.08369 0.123477 5.28779 1.26659 3.22564 3.29867C1.16348 5.33075 0.00345217 8.08587 1.17029e-05 10.9597C-0.00348119 13.3081 0.774992 15.5929 2.21601 17.4634C2.21601 17.4634 2.51601 17.8527 2.56501 17.9088L11 27.7118L19.439 17.9039C19.483 17.8517 19.784 17.4634 19.784 17.4634L19.785 17.4605C21.2253 15.5907 22.0034 13.3071 22 10.9597C21.9966 8.08587 20.8365 5.33075 18.7744 3.29867C16.7122 1.26659 13.9163 0.123477 11 0.120087ZM11 14.9013C10.2089 14.9013 9.43553 14.6702 8.77773 14.237C8.11993 13.8039 7.60724 13.1883 7.30449 12.4681C7.00174 11.7478 6.92253 10.9553 7.07687 10.1907C7.23121 9.42608 7.61217 8.72374 8.17158 8.17249C8.73099 7.62124 9.44373 7.24583 10.2197 7.09374C10.9956 6.94165 11.7998 7.01971 12.5307 7.31804C13.2616 7.61638 13.8864 8.12159 14.3259 8.7698C14.7654 9.418 15 10.1801 15 10.9597C14.9987 12.0047 14.5768 13.0065 13.827 13.7454C13.0771 14.4843 12.0605 14.9 11 14.9013Z" fill="black"/>
    </svg>
  `);

  const origin = { lat: 20.593683, lng: 78.962883 };
  console.log("origin  :", origin);
  const destination = { lat: 21.155, lng: 72.98 };
  console.log("destination :", destination);

  return (
    <APIProvider apiKey={"AIzaSyBLDpejeD6kFYkZuQZFN2-cE2s7qd2d-BY"}>
      <Map
        style={{
          width: "100vw",
          height: "100vh",
        }}
        defaultCenter={{ lat: 20.54992, lng: 90.98 }}
        defaultZoom={3}
        // gestureHandling={"greedy"}
        // disableDefaultUI={true}
      >
        {/*latlng.net
         */}
        {/*for origin-india*/}
        <Marker position={origin} onClick={() => setActiveMarker("origin")} />
        {activeMarker === "origin" && (
          <InfoWindow
            position={origin}
            onCloseClick={() => setActiveMarker(null)}
          >
            <div>Origin location</div>
          </InfoWindow>
        )}
        {/*for destination*/}
        <Marker
          position={destination}
          onClick={() => setActiveMarker("destination")}
        />
        {activeMarker === "destination" && (
          <InfoWindow
            position={destination}
            onCloseClick={() => setActiveMarker(null)}
          >
            <div>destination location</div>
          </InfoWindow>
        )}

        {/* {sub-destination} */}
        <Marker
          position={{ lat: 21.17024, lng: 72.85 }}
          icon={{
            url: svgIcon,
            scaledSize: { width: 22, height: 28 },
            fillColor: "black",
          }}
        />
        <Marker
          position={{ lat: 23.6666, lng: 75.6666 }}
          icon={{
            url: svgIcon,
            scaledSize: { width: 22, height: 28 },
            fillColor: "black",
          }}
        />
      </Map>
    </APIProvider>
  );
};

export default App;
{
  /*AIzaSyBLDpejeD6kFYkZuQZFN2-cE2s7qd2d-BY */
}

{
  /*
  echo "# Map" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/krishnamistry-17/Map.git
git push -u origin main
  */
}
