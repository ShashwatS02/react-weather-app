// --- Node.js Express Backend ---
// This server acts as a proxy to the OpenWeatherMap API.
// Why use a backend?
// 1. **API Key Security**: It hides your API key from the frontend client-side code, which is crucial for security.
// 2. **CORS Handling**: It resolves Cross-Origin Resource Sharing (CORS) issues.
// 3. **Rate Limiting/Caching**: You can implement server-side caching or rate limiting to manage API usage.

const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config(); // Use environment variables for sensitive data

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// --- Environment Variable Check ---
if (!process.env.OPENWEATHERMAP_API_KEY) {
  console.error(
    "FATAL ERROR: OPENWEATHERMAP_API_KEY is not defined in your .env file."
  );
  process.exit(1); // Exit the application if the key is not set
}

// --- API Proxy Route ---
app.get("/api/weather", async (req, res) => {
  const { lat, lon, city } = req.query;

  if ((!lat || !lon) && !city) {
    return res
      .status(400)
      .json({
        message: "Please provide either latitude and longitude or a city name.",
      });
  }

  try {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const baseURL = "https://api.openweathermap.org/data/2.5";

    const paramsCurrent = {
      appid: apiKey,
      units: "metric",
      ...(city ? { q: city } : { lat, lon }),
    };

    const paramsForecast = {
      ...paramsCurrent,
    };

    // Use Promise.all to fetch both current weather and forecast concurrently
    const [currentWeatherResponse, forecastResponse] = await Promise.all([
      axios.get(`${baseURL}/weather`, { params: paramsCurrent }),
      axios.get(`${baseURL}/forecast`, { params: paramsForecast }),
    ]);

    // Combine the data into a single response object
    const responseData = {
      current: currentWeatherResponse.data,
      forecast: forecastResponse.data,
    };

    res.json(responseData);
  } catch (error) {
    console.error(
      "Error fetching weather data:",
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response?.status || 500)
      .json({
        message:
          error.response?.data?.message ||
          "Error fetching data from OpenWeatherMap API.",
      });
  }
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

/*
--- How to Run This Backend ---
1.  **Save this file** as `server.js`.
2.  **Initialize a Node.js project**: In your terminal, in the same directory, run `npm init -y`.
3.  **Install dependencies**: Run `npm install express axios cors dotenv`.
4.  **Create a `.env` file**: In the same directory, create a file named `.env`.
5.  **Add your API key to `.env`**: Inside the `.env` file, add this line:
    OPENWEATHERMAP_API_KEY=your_actual_api_key_here
6.  **Start the server**: Run `node server.js`.
7.  **Update Frontend**: In the React App.jsx file, you would change the `fetchWeatherData` function to call your backend (`http://localhost:3001/api/weather`) instead of the OpenWeatherMap API directly.
*/
