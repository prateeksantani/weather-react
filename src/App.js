import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('New York');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date) => {
    return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let startDate;
        let endDate;

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        switch (selectedDate.getDay()) {
          case 0: // Sunday
            startDate = new Date(selectedDate);
            startDate.setDate(selectedDate.getDate() - 6);
            endDate = new Date(selectedDate);
            break;
          default:
            startDate = new Date(selectedDate);
            startDate.setDate(selectedDate.getDate() - selectedDate.getDay() + 1);
            endDate = new Date(selectedDate);
            endDate.setDate(selectedDate.getDate() + (7 - selectedDate.getDay()));
        }

        const response = await fetchWeatherData(formatDate(startDate), formatDate(endDate));
        setWeatherData(response);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setWeatherData(null);
      }
    };

    fetchData();
  }, [selectedDate]);

  const fetchWeatherData = async (startDate, endDate) => {
    const apiKey = '8bb13baffb874e89a4a74143242702';
    const apiUrl = `http://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${city}&dt=${startDate}&enddate=${endDate}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return response.json();
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleOptionChange = async (option) => {
    let startDate;
    let endDate;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    switch (option) {
      case 'day':
        startDate = new Date(selectedDate);
        endDate = new Date(selectedDate);
        break;
      case 'dayAgo':
        startDate = new Date(selectedDate);
        startDate.setDate(selectedDate.getDate() - 1);
        endDate = new Date(selectedDate);
        break;
      case 'twoDaysAgo':
        startDate = new Date(selectedDate);
        startDate.setDate(selectedDate.getDate() - 2);
        endDate = new Date(selectedDate);
        break;
      case 'week':
        startDate = new Date(selectedDate);
        startDate.setDate(selectedDate.getDate() - 6);
        endDate = new Date(selectedDate);
        break;
      default:
        startDate = new Date(selectedDate);
        endDate = new Date(selectedDate);
    }

    const response = await fetchWeatherData(formatDate(startDate), formatDate(endDate));
    setWeatherData(response);
  };

  const getBackgroundColor = (index) => {
    const colors = ['#f4f4f4', '#e3f2fd', '#fce4ec', '#e8f5e9', '#fffde7', '#f3e5f5', '#ffe0b2'];
    return colors[index % colors.length];
  };

  return (
    <div className="App">
      <h1 className="text-center text-3xl font-bold mb-8">Weather History</h1>
      <div className="flex justify-between mb-4">
        <div className="w-1/2 mr-2">
          <label htmlFor="cityInput" className="block font-bold mb-2">Enter City:</label>
          <input 
            type="text" 
            id="cityInput" 
            value={city} 
            onChange={handleCityChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="w-1/2 ml-2">
          <label className="block font-bold mb-2">Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <label className="block font-bold mb-2">Select Option:</label>
      <select onChange={(e) => handleOptionChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mb-4">
        <option value="day">Selected Day</option>
        <option value="dayAgo">1 Day Ago</option>
        <option value="twoDaysAgo">2 Days Ago</option>
        <option value="week">Last 7 Days</option>
      </select>
      {weatherData && weatherData.forecast ? (
        <div>
          {weatherData.forecast.forecastday.map((day, index) => (
            <div key={index} className="border border-gray-300 p-4 mb-4" style={{ backgroundColor: getBackgroundColor(index) }}>
              <p>Date: {day.date}</p>
              <p>Average Temperature: {day.day.avgtemp_c}°C</p>
              <p>Condition: {day.day.condition.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="loading text-center">Loading...</p>
      )}
    </div>
  );
}

export default App;