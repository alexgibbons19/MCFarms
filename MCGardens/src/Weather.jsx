import React, { useState } from 'react';
import './Weather.css';
import logo from './logo.png'
import burger from './burger.png'
import bell from './bell.png'

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

    return (
        <div>
            <nav className='navBar'>
                <div className='menuLogoContainer'>
                    <img
                    src={burger}
                    alt="Menu"
                    className='menuIcon'
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    />

                    <img src={logo} alt="Company Logo" className='companyLogo' />
                    <h2 style={{marginLeft: 1 + 'em'}}>MCGardens</h2>
                </div>

                <button className='notificationButton'>
                    <img src={bell} alt="Notifications" className='icon' />
                </button>
            </nav>

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
