import React, { useState } from "react";
import { Search16Regular } from "@fluentui/react-icons";
import "./SearchBar.css";

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");

  const Images = [
    { name: "Belgium", continent: "Europe" },
    { name: "India", continent: "Asia" },
    { name: "Bolivia", continent: "South America" },
    { name: "Ghana", continent: "Africa" },
    { name: "Japan", continent: "Asia" },
    { name: "Canada", continent: "North America" },
    { name: "New Zealand", continent: "Australasia" },
    { name: "Italy", continent: "Europe" },
    { name: "South Africa", continent: "Africa" },
    { name: "China", continent: "Asia" },
    { name: "Paraguay", continent: "South America" },
    { name: "Usa", continent: "North America" },
    { name: "France", continent: "Europe" },
    { name: "Botswana", continent: "Africa" },
    { name: "Spain", continent: "Europe" },
    { name: "Senegal", continent: "Africa" },
    { name: "Brazil", continent: "South America" },
    { name: "Denmark", continent: "Europe" },
    { name: "Mexico", continent: "South America" },
    { name: "Australia", continent: "Australasia" },
    { name: "Tanzania", continent: "Africa" },
    { name: "Bangladesh", continent: "Asia" },
    { name: "Portugal", continent: "Europe" },
    { name: "Pakistan", continent: "Asia" },
    { name: "Korea", continent: "Asia" },
  ];

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  let FilteredImages =
    searchInput.length > 0
      ? Images.filter((image) =>
          image.name.toLowerCase().includes(searchInput.toLowerCase())
        )
      : Images;

  return (
    // Use a fragment to wrap adjacent elements
    <>
      <div className="search-container">
        <Search16Regular className="search-icon" />
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