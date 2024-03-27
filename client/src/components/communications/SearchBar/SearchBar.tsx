import React, { useState } from "react";
import { Search20Regular } from "@fluentui/react-icons";
import "./SearchBar.css";

const SearchBar = ({searchInput, setSearchInput}) => {
  
  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  return (
    // Use a fragment to wrap adjacent elements
    <>
      <div className="search-container">
        <Search20Regular className="search-icon" />
        <input
          type="search"
          placeholder="Search"
          onChange={handleChange}
          value={searchInput}
          className="search-input"
        />
      </div>
    </>
  );
};

export default SearchBar;