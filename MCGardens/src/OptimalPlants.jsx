import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/OptimalPlants.css'; // Make sure this is the correct path
import BurgerMenu from './BurgerMenu';

const OptimalPlants = () => {
  const [location, setLocation] = useState('');
  const [plants, setPlants] = useState([]);
  const navigate = useNavigate();

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/get-optimal-crops', { location })
      .then(response => {
        if (response.data.success) {
          const optimalPlants = response.data.data.split('\n').map(line => line.trim());
          setPlants(optimalPlants.filter(plant => plant !== ''));
        }
      })
      .catch(error => {
        console.error('Failed to fetch optimal plants:', error);
      });
  };

  const handlePlantClick = (plant) => {
    const plantName = plant.substring(plant.indexOf(' ') + 1);
    navigate(`/plant-details?query=${encodeURIComponent(plantName)}`);
  };

  return (
    <>
      <BurgerMenu />
      <Link to="/" className="home-page-link">Home</Link>
      <p></p>
      <Link to="/discussion-board" className="discussion-board-link">Discussion Board</Link>
      <div className='optimal-plants-container'>
        <div className="search-bar-container">
          <h2>Find Optimal Plants For Your Garden</h2>
          <form onSubmit={handleSubmit}>
            <div className="search-bar-parameters-container">
              <label htmlFor="locationInput" className="enter-location">Enter your location:</label>
              <input 
                type="text" 
                className="location-input" 
                id="locationInput"
                value={location}
                onChange={handleLocationChange}
                placeholder="E.g., Riverdale, Bronx, NY"
                required
              />
              <button type="submit" className="search-location">Search</button>
            </div>
          </form>
        </div>
        <div className="optimal-plants-list-container">
          {plants.length > 0 ? (
            <>
              <h2>Optimal plants for {location}:</h2>
              <div>
                {plants.map((plant, index) => (
                  <div key={index} className="plant-entry" onClick={() => handlePlantClick(plant)}>
                    {plant}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>Enter location above to get list of plants.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default OptimalPlants;
