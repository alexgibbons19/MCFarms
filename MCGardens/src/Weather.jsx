import React, { useState, useEffect } from 'react';
import './assets/Weather.css';
import BurgerMenu from './BurgerMenu';

const Weather = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [zipCode, setZipCode] = useState('');
    const [currCity, setCurrCity] = useState("");


    useEffect(() => {
        const userLocation = JSON.parse(localStorage.getItem('userLocation'));
        console.log(userLocation);
        if (userLocation) {
            const { latitude, longitude } = userLocation;
            fetchWeatherDataByLocation(latitude, longitude);
        }

    }, []);
    const fetchWeatherDataByLocation = async (lat, lon) => {
        try {
            const weatherResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&units=imperial&appid=c2a91f3cea984faeb2c4779182b5272e`
            );
          const weatherData = await weatherResponse.json();
          if (weatherData.list) {
            setWeatherData(weatherData.list);
            setIsLoading(false);
            setCurrCity(weatherData.city.name);
            console.log(weatherData);
          }
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      };


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
                    setCurrCity(weatherData.city.name);
                    console.log(weatherData);
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


    return (
        <div className='weather-body'>
            <div className='top-nav'>
                <BurgerMenu />
            </div>
            <div className="weather-main">
                <div className='weather-container'>
                    <h1 className='weather-header'>Weekly Weather Forecast</h1>
                    <form onSubmit={handleSubmit}>
                        <div className='input-wrapper'>
                            <label className='zipcode-label' htmlFor='zipCode'>Enter ZIP Code:</label>
                            <input
                                className='zipcode-input'
                                type='text'
                                id='zipCode'
                                value={zipCode}
                                onChange={(event) => setZipCode(event.target.value)}
                            />
                            <button className='submit-btn' type='submit'>Submit</button>
                        </div>
                    </form>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <div>
                            <h1 className='city-name'>{currCity}</h1>
                            <div className='forecast'>
                                {weatherData.map(({ dt, temp, weather }) => (
                                    <div key={dt} className='day-forecast'>
                                        <h2 className='date'>{new Date(dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</h2>
                                        <p className='condition'>{weather[0].main}</p>
                                        <img className='weather-icon' src={`http://openweathermap.org/img/w/${weather[0].icon}.png`} alt="Weather Icon" />
                                        <p className='temp-high'>High: {Math.round(temp.max)}°F </p>
                                        <p className='temp-low'>Low: {Math.round(temp.min)}°F</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Weather;
