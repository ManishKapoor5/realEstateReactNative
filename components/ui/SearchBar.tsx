import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/properties?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex gap-2 items-center bg-white p-4 rounded shadow-md">
      <input
        type="text"
        placeholder='Search "Farm house in Punjab below 1 cr"'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow border px-3 py-2 rounded"
      />
      <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
