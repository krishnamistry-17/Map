import React from "react";
import { SearchBox } from "@mapbox/search-js-react";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const Search = () => {
  return (
    <div>
      <SearchBox
        accessToken={TOKEN}
        options={{
          language: "en",
          country: "IN",
        }}
      ></SearchBox>
    </div>
  );
};

export default Search;
