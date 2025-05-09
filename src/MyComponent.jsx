import React from "react";
import { GeoCoder } from "@mapbox/search-js-react";

const MyComponent = () => {
  const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  return (
    <div>
      <div>
        <GeoCoder
          accessToken={TOKEN}
          options={{
            language: "en",
            country: "IN",
          }}
        />
      </div>
    </div>
  );
};

export default MyComponent;
