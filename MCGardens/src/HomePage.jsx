import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './assets/HomePage.css';
import BurgerMenu from './BurgerMenu';
import { getUser, fetchCurrentWeeksEvents, fetchMostRecentThread } from '../backend/Firebase.js';

const HomePage = () => {
  const [weather, setWeather] = useState(null);
  const [events,setEvents] = useState([]);
  const user = getUser();
  const [mostRecentThread, setMostRecentThread] = useState([]);

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

    const fetchWeeksEvents = async () => {
      try {
        const eventsData = await fetchCurrentWeeksEvents(user);
        setEvents(eventsData);
        console.log(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    const fetchThread = async () => {
      try {
        const threadData = await fetchMostRecentThread();
        console.log("MRE:", threadData);
        setMostRecentThread(threadData);
      } catch (error) {
        console.error("Error fetching thread:", error);
      }
    }
    fetchThread();
    fetchWeeksEvents();
    askForLocationPermission();

  }, []);

  return (
    <div className="container">
      <div className='top-nav'>
        <BurgerMenu />
      </div>
      <h1>Home Page</h1>
     
      <div className="giant-box">
        <h2>MC Farms</h2>
        <div className="flex-container">
          <div className="square-box">
          <a href="/weather" style={{ textDecoration: 'none', color: 'black', display: 'inline-block', width: '100%' }}>
            <div className="weather-preview">
              <h2>Weather</h2>
              {weather ? (
                <>
                  <h3>{weather.city}</h3>
                  <p>{weather.condition}</p>
                  {/* <img className='weather-icon' src={`http://openweathermap.org/img/w/${weather.icon}.png`} alt="Weather Icon" /> */}
                  <p>High: {Math.round(weather.max)}°F</p>
                  <p>Low: {Math.round(weather.min)}°F</p>
                </>
              ) : (
                <p>Loading weather...</p>
              )}
              </div>
              </a>
            </div>
            <div className="square-box" style={{ marginLeft: "10px" }}>
              <a href="/discussion-board" style={{ textDecoration: 'none', color: 'black', display: 'inline-block', width: '100%' }}>
                <div className="recent-threads-container">
                  <h2>Most recent thread</h2>
                  <div className="thread-title">
                    {mostRecentThread.title}
                  </div>
                  <div className="thread-author">
                    {mostRecentThread.author}
                  </div>
                </div>
              </a>
            </div>   
        </div>
        <a href="/reminders" style={{ textDecoration: 'none', color: 'black', display: 'inline-block', width: '100%' }}>
        </a>

          <div className="rectangle" style={{ margin: "0 auto" }}>
             <h1>This Weeks Events</h1>
            {events.length > 0 ? (
            <o1 style={{listStyleType: 'none',paddingleft:0}}>
              {events.map((event,index) => (
                <li key={event.id} style={{ textAlgin:"left"}}>
                  <span style={{display: 'inline-block',width:'30px'}}>{index+1}.</span>
                  {event.title} - ends on {new Date(event.endDate).toLocaleTimeString('en-US', {month: 'short', day: 'numeric',hour:'numeric',minute:'2-digit'})}
                </li>
              ))}
            </o1>
            ): (
              <p>No events this week.</p>
            )}
          </div>
      </div>
    </div>
  );
};

export default HomePage
