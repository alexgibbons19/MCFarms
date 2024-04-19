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
    setIsLoading(true); // Set loading to true on submit
    axios.post('https://us-central1-mcgardens-bd0b1.cloudfunctions.net/askOptimalCrops/askOptimalCrops', { location })
      .then(response => {
        setIsLoading(false); // Turn off loading once data is received
        // Directly accessing response.data.crops since that's where your data is
        if (response.data && response.data.crops) {
          const optimalPlants = response.data.crops.split('\n').map(line => line.trim());
          setPlants(optimalPlants.filter(plant => plant !== ''));
          setLastSearchedLocation(location); // Update the location for the title only after fetching
          setLocation(''); // Clear the input field
        } else {
          // Handle case where data might be received but not as expected
          setPlants([]); // Clear any previous plants
          console.error('No crops data found in response:', response.data);
        }
      })
      .catch(error => {
        console.error('Failed to fetch optimal plants:', error);
        setIsLoading(false); // Ensure loading is turned off on error too
        setPlants([]); // Clear any previous plants on error
        setLocation(''); // Clear the input field even if there's an error
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
          {isLoading ? (
            <p>Generating Information...</p>
          ) : plants.length > 0 ? (
            <>
              <h2>Optimal plants for {lastSearchedLocation}:</h2>
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
