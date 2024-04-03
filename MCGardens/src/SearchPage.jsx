import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  const [query, setQuery] = useState('');

  return (
    <div>
      <h1>Search Page</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search plant..."
      />
      {/* Link to PlantDetails.jsx with the query parameter */}
      <Link to={`/plant-details?query=${encodeURIComponent(query)}`}>
        <button>Search</button>
      </Link>
    </div>
  );
};

export default SearchPage;