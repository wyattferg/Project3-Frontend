import React, { useState, useEffect } from 'react';
import './weather.css';

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          const apiKey = '81260794ba7f1cef3cb0d8917e365e72';
          const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

          const response = await fetch(apiUrl);
          const data = await response.json();

          setWeatherData(data);
          setLoading(false);
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setLoading(false);
      }
    };

    getWeatherData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!weatherData) {
    return <p>Unable to fetch weather data.</p>;
  }

  return (
    (typeof weatherData.main != 'undefined') ? (
        <div className='weatherContainer'>
            {/* <h2>Weather Information</h2> */}
            <p>Location: {weatherData.name}</p>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Weather: {weatherData.weather[0].description}</p>
        </div>
      ): (
        <div></div>
      )
    
  );
};

export default WeatherComponent;
