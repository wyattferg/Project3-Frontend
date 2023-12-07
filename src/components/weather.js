import React, { useState, useEffect } from 'react';
import './weather.css';

/**
 * Functional component representing a weather display.
 * @function WeatherComponent
 * @returns {JSX.Element} JSX element containing weather information.
 */
const WeatherComponent = () => {
  /**
   * State to store weather data received from the API.
   * @type {object | null}
   */
  const [weatherData, setWeatherData] = useState(null);

  /**
   * State to manage the loading status of weather data.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(true);

  /**
   * Effect hook to fetch weather data based on user's geolocation.
   * @function useEffect
   * @param {function} getWeatherData - Function to fetch weather data.
   * @param {Array} [] - Empty dependency array to ensure the effect runs only once.
   */
  useEffect(() => {
    /**
     * Function to fetch weather data using the OpenWeatherMap API.
     * @function getWeatherData
     */
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

  /**
   * Render loading message while weather data is being fetched.
   * @returns {JSX.Element} Loading message.
   */
  if (loading) {
    return <p>Loading...</p>;
  }

  /**
   * Render message if weather data cannot be fetched.
   * @returns {JSX.Element} Error message.
   */
  if (!weatherData) {
    return <p>Unable to fetch weather data.</p>;
  }

  /**
   * Render weather information if available.
   * @returns {JSX.Element} Weather information.
   */
  return (
    (typeof weatherData.main !== 'undefined') ? (
      <div className='weatherContainer'>
        {/* <h2>Weather Information</h2> */}
        <p>Location: {weatherData.name}</p>
        <p>Temperature: {weatherData.main.temp}°C</p>
        <p>Weather: {weatherData.weather[0].description}</p>
      </div>
    ) : (
      <div></div>
    )
  );
};

export default WeatherComponent;
