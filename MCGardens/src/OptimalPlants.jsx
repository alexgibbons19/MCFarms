import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './assets/OptimalPlants.css'

const OptimalPlants = () => {
  const [location, setLocation] = useState('');
  const [plants, setPlants] = useState([]);
  const [numPlants, setNumPlants] = useState(5);
  const [displayedPlants, setDisplayedPlants] = useState([]);
  const [userLocation, setUserLocation] = useState('');

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  }

  const handleNumPlantsChange = (e) => {
    setNumPlants(parseInt(e.target.value));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const optimalPlants = [
      'Sunflower', 'Rose', 'Lavender', 'Tulip', 'Daisy',
      'Peony', 'Daffodil', 'Lily', 'Hydrangea', 'Orchid',
      'Cactus', 'Bamboo', 'Fern', 'Snake Plant', 'Pothos',
      'Monstera', 'Spider Plant', 'Peace Lily', 'Aloe Vera', 'Succulent','Geranium', 'Hosta', 'Begonia', 'Coleus', 'Tomato', 'Marigold', 'Petunia', 'Snapdragon', 'Zinnia', 'Hibiscus'
    ];
    setPlants(optimalPlants);
    setDisplayedPlants(optimalPlants.slice(0, numPlants));
    setUserLocation(location)
    console.log('Plants:', optimalPlants);
    console.log('Location submitted:', userLocation);
    console.log('Num Plants: ', numPlants);
    setLocation('');
  };

  const handleViewMore = () => {
    const nextBatch = plants.slice(displayedPlants.length, displayedPlants.length + numPlants);
    setDisplayedPlants([...displayedPlants,...nextBatch]);
  }

  const handleViewPlant = () => {
    // should send user to plant details page
  }

  return (
    <>
      <Link to='/' className="discussion-bard-link">Discussion Board</Link>
      <div className='optimal-plants-container'>
        <div className="search-bar-container">
          <h2>Find Optimal Plants For your Garden</h2>
          <form onSubmit={handleSubmit}>
            <div className="search-bar-paramaters-container">
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
              <div>
                <label htmlFor="numPlantsSelect">Number of plants: </label>
                <select id="numPlantsSelect" value={numPlants} onChange={handleNumPlantsChange}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
            <button type="submit" className="search-location">Search</button>
          </form>
        </div>
        {plants.length === 0 ? (
          <p>ENTER LOCATION ABOVE TO GET LIST OF PLANTS</p>
        ) : ( 
          <div className="optimal-plants-list-container">
            <h2>Optimal plants for {userLocation}:</h2>
            <ol className='optimal-plants-list'>
              {displayedPlants.map((plant, index) => {
                return <li className='optimal-plants-entry' key={index} onClick={handleViewPlant}>{plant}</li>
              })}
            </ol>
            {displayedPlants.length < plants.length && (
              <p className="view-more" onClick={handleViewMore}>View More</p>
            )}
          </div>
          )}
      </div>
    </>
  )
}

export default OptimalPlants