import React, { useEffect, useState } from "react";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

const Directions = ({ origin, destination }) => {
  
  const [directions, setDirections] = useState(null);

  const map = useMap();
  const maps = useMapsLibrary("routes");

  useEffect(() => {
    if (!maps || !map) return;

    const directionsService = new maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        travelMode: maps.TravelMode.DRIVING,
      },

      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        } else {
          console.error("Directions request failed>>>>>:", status);
        }
      }
    );
  }, [maps, map, origin, destination]);

  useEffect(() => {
    if (directions && map && maps) {
      const directionsRenderer = new maps.DirectionsRenderer({
        map,
        directions,
        suppressMarkers: true,
      });
      return () => directionsRenderer.setMap(null);
    }
  }, [directions, map, maps]);

  return null;
};
export default Directions;
