import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import bgImage from "./images/wil-stewart-T26KCgCPsCI-unsplash.jpg";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setError("Please enter a valid city name.");
      setWeather(null);
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.get(`http://localhost:8080/api/weather/${trimmedCity}`);
      console.log("API Response:", response.data); // Debugging API response
  
      if (!response.data) {
        setError("No weather data found for this city.");
        setWeather(null);
        return;
      }
  
      // Make sure response contains valid values before setting state
      setWeather({
        location: trimmedCity,
        temperature: response.data.includes("°C") 
          ? Math.round(parseFloat(response.data.match(/(-?\d+\.\d+)°C/)[1])) || "--" 
          : "--",
        feelsLike: response.data.includes("Feels like:")
          ? Math.round(parseFloat(response.data.match(/Feels like: (-?\d+\.\d+)°C/)[1])) || "--"
          : "--",
        humidity: response.data.includes("Humidity:")
          ? Math.round(parseInt(response.data.match(/Humidity: (\d+)%/)[1])) || "--"
          : "--",
        condition: response.data.includes("Condition:")
          ? response.data.match(/Condition: (.*?),/)[1] || "No data available"
          : "No data available",
      });
      
      
  
      console.log("Weather state updated:", {
        location: trimmedCity,
        temperature: response.data.temperature,
        feelsLike: response.data.feelsLike,
        humidity: response.data.humidity, 
        condition: response.data.condition
      });
  
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Could not fetch weather data. Please try again later.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };
  

  // Trigger search when pressing "Enter"
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchWeather();
    }
  };

  useEffect(() => {
    console.log("Weather state updated:", weather);
  }, [weather]);

  return (
    <div className="App" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress} // Trigger search on Enter
          />
          <button onClick={fetchWeather}>Search</button>
        </div>

        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}

        {/* ✅ Fixed the JSX issue */}
        {weather && (
          <div className="weather-info">
            <h2>{weather.location}</h2>
            <h1>{weather.temperature}°C</h1>
            <p className="description">{weather.condition}</p>
            <div className="weather-details">
              <p>Feels Like: {weather.feelsLike}°C</p>
              <p>Humidity: {weather.humidity}%</p>
              <p>Wind: {weather.wind} mph</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
