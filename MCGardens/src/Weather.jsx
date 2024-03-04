import React, { useState } from 'react';
import './assets/Weather.css';

import BurgerMenu from './BurgerMenu';

// Dummy weather data
const weatherData = [
  { day: 'Monday', condition: 'Sunny', high: 25, low: 15, icon: '🌞' },
  { day: 'Tuesday', condition: 'Cloudy', high: 22, low: 14, icon: '☁️' },
  { day: 'Wednesday', condition: 'Rainy', high: 18, low: 12, icon: '🌧️' },
  { day: 'Thursday', condition: 'Thunderstorm', high: 20, low: 11, icon: '⛈️' },
  { day: 'Friday', condition: 'Sunny', high: 27, low: 16, icon: '🌞' },
  { day: 'Saturday', condition: 'Partly Cloudy', high: 24, low: 17, icon: '⛅' },
  { day: 'Sunday', condition: 'Rainy', high: 21, low: 13, icon: '🌧️' },
];

const Weather = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Retrieve credentials from local storage
    let credentials = JSON.parse(localStorage.getItem('credentials'));
    console.log("From Weather");
    console.log(credentials['email']);
    console.log(credentials['password']);

    return (
        <div>
            
            <BurgerMenu />
            <div className='weatherContainer'>
                <h1 className='header'>Weekly Weather Forecast</h1>

                <div className='forecast'>
                    {weatherData.map(({ day, condition, high, low, icon }) => (
                        <div key={day} className='dayForecast'>
                            <h2>{day}</h2>
                            <p className='condition'><span className='icon'>{icon}</span> {condition}</p>
                            <p>High: {high}°C | Low: {low}°C</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    
    );
};

export default Weather;
