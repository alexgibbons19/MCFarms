import React, { useState } from 'react';
import './assets/Weather.css';
import BurgerMenu from './BurgerMenu';

const Weather = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [zipCode, setZipCode] = useState('');

    const fetchWeatherData = async (zipCode) => {
        try {
            const locationResponse = await fetch(
                `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode}&appid=c2a91f3cea984faeb2c4779182b5272e`
            );
            const locationData = await locationResponse.json();
            if (locationData.lat !== undefined && locationData.lon !== undefined) {
                const { lat, lon } = locationData;
                const weatherResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&units=imperial&appid=c2a91f3cea984faeb2c4779182b5272e`
                );
                const weatherData = await weatherResponse.json();
                if (weatherData.list) {
                    setWeatherData(weatherData.list);
                    setIsLoading(false);
                }
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        fetchWeatherData(zipCode);
    };

    // Retrieve credentials from local storage safely
    let credentials = JSON.parse(localStorage.getItem('credentials')) || {};
    console.log("From Weather");
    if (!credentials.email) {
        console.error("No credentials stored, redirecting to login.");
        // navigate('/login'); // Use this if react-router is setup
    } else {
        console.log("Email:", credentials.email);
        console.log("Password:", credentials.password);
    }

    return (
        <div>
            <div className='top-nav'>
                <BurgerMenu />
            </div>
            <div className='weatherContainer'>
                <h1 className='header'>Weekly Weather Forecast</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='zipCode'>Enter ZIP Code: </label>
                    <input
                        type='text'
                        id='zipCode'
                        value={zipCode}
                        onChange={(event) => setZipCode(event.target.value)}
                    />
                    <button type='submit'>Submit</button>
                </form>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div className='forecast'>
                        {weatherData.map(({ dt, temp, weather }) => (
                            <div key={dt} className='dayForecast'>
                                <h2>{new Date(dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</h2>
                                <p className='condition'>{weather[0].main}</p>
                                <p>High: {temp.max}°F | Low: {temp.min}°F</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Weather;
