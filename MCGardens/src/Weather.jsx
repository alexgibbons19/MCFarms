import React, { useState } from 'react';
import './assets/Weather.css';

import BurgerMenu from './BurgerMenu';


const Weather = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [zipCode, setZipCode] = useState([]);

    const fetchWeatherData = async (zipCode) => {
        try {
            const locationResponse = await fetch(
                `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode}&appid=c2a91f3cea984faeb2c4779182b5272e`
            );
            const locationData = await locationResponse.json();
            if (locationData.lat !== undefined && locationData.lon !== undefined) {
                const {lat,lon} = locationData;
                console.log(lat, lon);
                const weatherResponse = await fetch(
                `http://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&units=imperial&appid=c2a91f3cea984faeb2c4779182b5272e`
                );
                const weatherData = await weatherResponse.json();
                console.log(weatherData);
                if(weatherData.list) {
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
        fetchWeatherData(zipCode);
    };

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
