import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // Navigate to the desired path with query
    navigate(`/plant-details?query=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      <h1>Search Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search plant..."
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchPage;
