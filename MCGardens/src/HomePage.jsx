import React from 'react';
import './assets/HomePage.css';

const HomePage = () => {
  const toggleMenu = () => {
    const dropdownMenu = document.getElementById("dropdownMenu");
    dropdownMenu.classList.toggle("show");
  };

  const goToPage = (page) => {
    alert("Navigating to " + page);
    // Implement your navigation logic here
  };

  // Close the dropdown if the user clicks outside of it
  window.onclick = (event) => {
    if (!event.target.matches('.menu-button')) {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
        const openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  };

  return (
    <div className="container">
      <h1>Home Page</h1>
      <div className="giant-box">
        <button className="menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <div id="dropdownMenu" className="dropdown-content">
          <a href="#" onClick={() => goToPage('home')}>Home</a>
          <a href="#" onClick={() => goToPage('weather')}>Weather</a>
          <a href="#" onClick={() => goToPage('inventory')}>Inventory</a>
          <a href="#" onClick={() => goToPage('calendar')}>Calendar</a>
          <a href="#" onClick={() => goToPage('reminders')}>Reminders</a>
          <a href="#" onClick={() => goToPage('optimalCrops')}>Optimal Crops</a>
        </div>
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
