import React, { useEffect } from "react";
import mapboxgl from "map";
const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const Rotate = () => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/jay001/cmac3lvo600n301s45q2380v6",
      projection: "globe",
      zoom: 1,
      center: [30, 15],
    });
    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();

    map.on("style.load", () => {
      map.setFog({});
    });
    map.on("mousedown", () => {
      userInteracting = true;
    });
    map.on("dragstart", () => {
      userInteracting = true;
    });
    map.on("moveend", () => {
      spinGlobe();
    });
  }, []);
  const secondsPerRevolution = 240;

  const maxSpinZoom = 5;

  const slowSpinZoom = 3;
  let userInteracting = false;
  const spinEnabled = true;

  const zoom = map.getZoom();
  if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
    let distancePerSecond = 360 / secondsPerRevolution;
    if (zoom > slowSpinZoom) {
      const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
      distancePerSecond *= zoomDif;
    }
    const center = map.getCenter();
    center.lng -= distancePerSecond;

    map.easeTo({ center, duration: 1000, easing: (n) => n });
  }
};

return <div>Rotate</div>;

export default Rotate;
