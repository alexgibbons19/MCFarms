import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/OptimalPlants.css';
import BurgerMenu from './BurgerMenu';

const OptimalPlants = () => {
  const [location, setLocation] = useState('');
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSearchedLocation, setLastSearchedLocation] = useState('');
  const navigate = useNavigate();

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios.post('https://us-central1-mcgardens-bd0b1.cloudfunctions.net/askOptimalCrops/askOptimalCrops', { location })
      .then(response => {
        setIsLoading(false);
        if (response.data && response.data.crops) {
          const optimalPlants = response.data.crops.split('\n').map(line => line.trim());
          setPlants(optimalPlants.filter(plant => plant !== ''));
          setLastSearchedLocation(location);
          setLocation(''); // Clear the input field
        } else {
          setPlants([]); // Clear any previous plants
          console.error('No crops data found in response:', response.data);
        }
      })
      .catch(error => {
        console.error('Failed to fetch optimal plants:', error);
        setIsLoading(false);
        setPlants([]);
        setLocation(''); // Clear the input field even if there's an error
      });
  };

  const handlePlantClick = (plant) => {
    const plantName = plant.substring(plant.indexOf(' ') + 1);
    navigate(`/plant-details?query=${encodeURIComponent(plantName)}`);
  };

  return (
    <div>
      <div className='top-nav'>
        <BurgerMenu />
      </div>
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
        {isLoading ? (
          <p>Generating Information...</p>
        ) : plants.length > 0 ? (
          <>
            <h2>Optimal plants for {lastSearchedLocation}:</h2>
            <div className="optimal-plants-list-container">
              <div className="column">
                {plants.slice(0, 10).map((plant, index) => (
                  <div key={index} className="plant-entry" onClick={() => handlePlantClick(plant)}>
                    {plant}
                  </div>
                ))}
              </div>
              <div className="column">
                {plants.slice(10, 20).map((plant, index) => (
                  <div key={index} className="plant-entry" onClick={() => handlePlantClick(plant)}>
                    {plant}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p>Enter location above to get list of plants.</p>
        )}
      </div>
    </div>
  );  
};

export default OptimalPlants;
