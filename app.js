const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require("cors");

const weatherRoutes = require('./routes/routes');
const { PORT, MONGO_URL } = require('./config/config');

const app = express();

// Load environment variables
dotenv.config();

// ✅ Enable CORS (fixes "Failed to fetch" from frontend)
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Serve static frontend files (index.html should be inside /public folder)
app.use(express.static('public'));

// Mount weather routes
app.use('/weather', weatherRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("welcome");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
