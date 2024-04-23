import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './assets/HomePage.css';
import BurgerMenu from './BurgerMenu';

const HomePage = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const askForLocationPermission = async () => {
      try {
        const { geolocation } = navigator;
        if (!geolocation) {
          alert('Geolocation is not supported by your browser');
          return;
        }

        const position = await new Promise((resolve, reject) => {
          geolocation.getCurrentPosition(resolve, reject);
        });

        console.log(position);

        const { latitude, longitude } = position.coords;
        localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
        
        // Fetch weather for the new location
        fetchWeather(latitude, longitude);

      } catch (error) {
        console.error('Error getting location:', error);
      }
    };
    
    const fetchWeather = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=1&units=imperial&appid=c2a91f3cea984faeb2c4779182b5272e`
        );
        const data = await response.json();
        const weatherData = data.list[0];
        console.log(weatherData);
        setWeather({
          city: data.city.name,
          condition: weatherData.weather[0].main,
          max: weatherData.temp.max,
          min: weatherData.temp.min,
          icon: weatherData.weather[0].icon,
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    const userLocation = JSON.parse(localStorage.getItem('userLocation'));
    if (userLocation) {
      const { latitude, longitude } = userLocation;
      fetchWeather(latitude, longitude);
    } else {
      // Default coordinates for Riverdale, Bronx, NY
      fetchWeather(40.9039, -73.9142);
    }

    askForLocationPermission();
  }, []);

  return (
    <div className="container">
      <div className='top-nav'>
        <BurgerMenu />
      </div>
      <h1>Home Page</h1>
     
      <div className="giant-box">
        <h2>MC Farm</h2>
        <div className="flex-container">
          <div className="square-box">
          <a href="/weather" style={{ textDecoration: 'none', color: 'black', display: 'inline-block', width: '100%' }}>
            <div className="weather-preview">
              <h2>Weather</h2>
              {weather ? (
                <>
                  <h3>{weather.city}</h3>
                  <p>{weather.condition}</p>
                  <p>Max: {weather.max.toFixed(1)}°F</p>
                  <p>Min: {weather.min.toFixed(1)}°F</p>
                </>
              ) : (
                <p>Loading weather...</p>
              )}
              </div>
              </a>
            </div>
          
          <div className="square-box" style={{ marginLeft: "10px" }}>
            <h3>Inventory</h3>
            <p>Corn: 188</p>
            <p>Wheat: 238</p>
            <p>Tomatoes: 327</p>
          </div>
        </div>
        <a href="/reminders" style={{ textDecoration: 'none', color: 'black', display: 'inline-block', width: '100%' }}>
          <div className="rectangle" style={{ margin: "0 auto" }}>
            <h3>Reminders</h3>
            <p>28 Days to harvest Corn 245</p>
            <hr />
            <p>30 Days to sell Tomatoes</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default HomePage