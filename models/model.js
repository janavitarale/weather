const mongoose = require('mongoose');

// Define the schema for searched weather logs
const weatherSchema = new mongoose.Schema({
  city: { type: String, required: true },
  temperature: { type: Number, required: true },
  description: { type: String, required: true },
  searchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("WeatherLog", weatherSchema);
