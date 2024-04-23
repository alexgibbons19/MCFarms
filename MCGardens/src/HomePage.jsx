import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import './assets/HomePage.css';
import BurgerMenu from './BurgerMenu';
const HomePage = () => {

  useEffect(() => {
    const askForLocationPermission = async () => {
      try {
        const { geolocation } = navigator;
        if(!geolocation) {
          alert('Geolocation is not support by your browser');
          return;
        }

        const position = await new Promise((resolve, reject) => {
          geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    askForLocationPermission();
  }, []);

  return (
    <div className="container">
      <div className='top-nav'>
        <BurgerMenu />
      </div>
      <h1>Home Page</h1>
      
      <div className="giant-box">
        <div className="notification-box">
          <img src="https://cdn3.vectorstock.com/i/1000x1000/79/72/notification-bell-icon-vector-34877972.jpg" alt="Bell Icon" width="30" />
        </div>
        <h2>MC Farm</h2>
        <div className="flex-container">
          <div className="square-box" style={{ marginRight: "10px" }}>
            <h3>Weather</h3>
            <img src="https://cdn2.iconfinder.com/data/icons/weather-color-2/500/weather-02-512.png" alt="Weather Icon" width="50" />
            <p>Riverdale</p>
            <p>25°C</p>
          </div>
          <div className="square-box" style={{ marginLeft: "10px" }}>
            <h3>Inventory</h3>
            <p>Corn: 188</p>
            <p>Wheat: 238</p>
            <p>Tomatoes: 327</p>
          </div>
        </div>
        <div className="rectangle" style={{ margin: "0 auto" }}>
          <h3>Reminders</h3>
          <p>28 Days to harvest Corn 245</p>
          <hr />
          <p>30 Days to sell Tomatoes</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
