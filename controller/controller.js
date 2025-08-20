const axios = require('axios');
const Weather = require('../models/model');
const { WEATHER_API_KEY } = require('../config/config');

// Add weather data by fetching from OpenWeatherMap API
const addWeather = async (req, res) => {
  try {
    const { city } = req.body;
    if (!city) return res.status(400).send({ error: "City is required" });

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
    );

    const temperature = response.data.main.temp;
    const description = response.data.weather[0].description;

    const newWeather = new Weather({ city, temperature, description });
    await newWeather.save();

    res.json({ message: "Weather data has been saved!" });
  } catch (err) {
    console.error("❌ Add Weather Error:", err.message);
    res.status(500).send({ error: "Failed to fetch or save weather data" });
  }
};

// Display live weather (not DB, API call)
const displayWeather = async (req, res) => {
  const city = req.params.city;

  if (!city) {
    return res.status(400).send({ error: "City parameter is required" });
  }

  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await axios.get(apiUrl);

    if (response.data.cod !== 200) {
      return res.status(404).send({ error: "City not found" });
    }

    const weatherInfo = {
      city: response.data.name,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description
    };

    res.status(200).json(weatherInfo);
  } catch (err) {
    console.error("❌ Display Weather Error:", err.message);
    res.status(500).send({ error: "Error fetching weather data" });
  }
};

// Get all weather records from DB
const getAllWeather = async (req, res) => {
  try {
    const records = await Weather.find().sort({ searchedAt: -1 });
    res.json(records);
  } catch (err) {
    console.error("❌ GetAllWeather Error:", err.message);
    res.status(500).json({ error: "Failed to fetch records" });
  }
};

// Bulk insert
const bulkInsertWeather = async (req, res) => {
  try {
    const records = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: "Provide an array of weather records" });
    }

    await Weather.insertMany(records);
    res.json({ message: "Records inserted successfully!" });
  } catch (err) {
    console.error("❌ Bulk insert error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addWeather, displayWeather, getAllWeather, bulkInsertWeather };
