import React, { useState, useEffect, useCallback, useRef } from "react";

// --- Helper Functions & Constants ---
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // IMPORTANT: Replace with your actual API key
const API_URL_CURRENT = "https://api.openweathermap.org/data/2.5/weather";
const API_URL_FORECAST = "https://api.openweathermap.org/data/2.5/forecast";

// --- SVG Icons Components ---
// I'm creating these as reusable components for cleaner code.
// They include subtle animations for a more dynamic feel.

const SunIcon = () => (
  <svg viewBox="0 0 64 64" className="w-16 h-16 animate-pulse-slow">
    <g strokeLinecap="round" strokeWidth="4" fill="none" stroke="currentColor">
      <circle cx="32" cy="32" r="12"></circle>
      <path d="M32 4v4M32 56v4M4 32h4M56 32h4m-39.6 22.6l2.8-2.8M11.8 11.8l2.8 2.8m22.6 39.6l2.8-2.8M11.8 49.4l2.8-2.8"></path>
    </g>
  </svg>
);

const CloudIcon = ({ opacity = 1 }) => (
  <svg viewBox="0 0 64 64" className="w-20 h-20" style={{ opacity }}>
    <g
      fill="currentColor"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="3"
    >
      <path
        d="M41.5 20A11.5 11.5 0 0020 23.5a11.5 11.5 0 00-1 23h23.5a10.5 10.5 0 00.5-21 11.4 11.4 0 00-1.5-5z"
        className="animate-float"
      />
    </g>
  </svg>
);

const RainIcon = () => (
  <svg viewBox="0 0 64 64" className="w-20 h-20">
    <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="3">
      <path
        d="M41.5 20A11.5 11.5 0 0020 23.5a11.5 11.5 0 00-1 23h23.5a10.5 10.5 0 00.5-21 11.4 11.4 0 00-1.5-5z"
        className="text-gray-400"
      />
    </g>
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2">
      <path
        d="M28 42v4"
        className="animate-drizzle opacity-0"
        style={{ animationDelay: "0.1s" }}
      />
      <path
        d="M34 42v4"
        className="animate-drizzle opacity-0"
        style={{ animationDelay: "0.6s" }}
      />
      <path
        d="M22 42v4"
        className="animate-drizzle opacity-0"
        style={{ animationDelay: "0.3s" }}
      />
    </g>
  </svg>
);

const ThunderstormIcon = () => (
  <svg viewBox="0 0 64 64" className="w-20 h-20">
    <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="3">
      <path
        d="M41.5 20A11.5 11.5 0 0020 23.5a11.5 11.5 0 00-1 23h23.5a10.5 10.5 0 00.5-21 11.4 11.4 0 00-1.5-5z"
        className="text-gray-500"
      />
    </g>
    <path
      d="m35 41-10 8 4-8-8-1h9l-3 10 9-11z"
      fill="currentColor"
      className="text-yellow-400 animate-flash"
    />
  </svg>
);

const SnowIcon = () => (
  <svg viewBox="0 0 64 64" className="w-20 h-20">
    <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="3">
      <path
        d="M41.5 20A11.5 11.5 0 0020 23.5a11.5 11.5 0 00-1 23h23.5a10.5 10.5 0 00.5-21 11.4 11.4 0 00-1.5-5z"
        className="text-gray-400"
      />
    </g>
    <g
      fill="currentColor"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
    >
      <path
        d="m24.5 44.5 3 3m-3-3-3 3m3-3 3-3m-3 3-3-3"
        className="animate-snow opacity-0"
        style={{ animationDelay: "0.1s" }}
      />
      <path
        d="m34.5 42.5 3 3m-3-3-3 3m3-3 3-3m-3 3-3-3"
        className="animate-snow opacity-0"
        style={{ animationDelay: "0.6s" }}
      />
      <path
        d="m28.5 49.5 3 3m-3-3-3 3m3-3 3-3m-3 3-3-3"
        className="animate-snow opacity-0"
        style={{ animationDelay: "0.3s" }}
      />
    </g>
  </svg>
);

// --- Main App Component ---
export default function App() {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backgroundStyle, setBackgroundStyle] = useState({});

  const searchInputRef = useRef(null);

  const fetchWeatherData = useCallback(async (lat, lon, city) => {
    setLoading(true);
    setError(null);

    // --- MODIFICATION: Point to your local backend server ---
    // This is more secure as your API key is not exposed on the frontend.
    const backendApiUrl = new URL("http://localhost:3001/api/weather");
    if (city) {
      backendApiUrl.searchParams.append("city", city);
    } else {
      backendApiUrl.searchParams.append("lat", lat);
      backendApiUrl.searchParams.append("lon", lon);
    }

    try {
      const response = await fetch(backendApiUrl);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "City not found or API error.");
      }

      const data = await response.json();
      setWeatherData(data.current);
      setForecastData(data.forecast);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for fetching user's location on initial load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      (err) => {
        console.warn("Geolocation denied. Defaulting to London.", err);
        fetchWeatherData(null, null, "London"); // Default location
      }
    );
  }, [fetchWeatherData]);

  // Effect for handling keyboard shortcuts (Ctrl+K to focus search)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Effect to update background based on weather
  useEffect(() => {
    if (!weatherData) {
      // --- MODIFICATION: New default background ---
      setBackgroundStyle({
        background: "linear-gradient(to top, #0f2027, #203a43, #2c5364)",
      }); // Default deep space blue
      return;
    }
    const weatherMain = weatherData.weather[0].main;
    let bgGradient = "";

    const now = new Date();
    const hour = now.getHours();
    const isDay = hour > 6 && hour < 19;

    // --- MODIFICATION: New, more pleasing color schemes ---
    switch (weatherMain) {
      case "Clear":
        bgGradient = isDay
          ? "linear-gradient(to top, #4facfe 0%, #00f2fe 100%)" // Vibrant blue sky
          : "linear-gradient(to top, #0f2027, #203a43, #2c5364)"; // Deep space blue night
        break;
      case "Clouds":
        bgGradient = isDay
          ? "linear-gradient(to top, #6a85b6, #bac8e0)" // Soft cloudy day
          : "linear-gradient(to top, #36425a, #52627d)"; // Moody cloudy night
        break;
      case "Rain":
      case "Drizzle":
        bgGradient = "linear-gradient(to top, #304352, #d7d2cc)"; // Rainy dawn/dusk
        break;
      case "Thunderstorm":
        bgGradient = "linear-gradient(to top, #232526, #414345)"; // Dark stormy grey
        break;
      case "Snow":
        bgGradient = "linear-gradient(to top, #d3cce3, #e9e4f0)"; // Light, crisp snow
        break;
      default: // Mist, Smoke, Haze, etc.
        bgGradient = "linear-gradient(to top, #757f9a, #d7dde8)"; // Foggy morning
        break;
    }
    setBackgroundStyle({ background: bgGradient });
  }, [weatherData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim()) {
      fetchWeatherData(null, null, location.trim());
    }
  };

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain) {
      case "Clear":
        return <SunIcon />;
      case "Clouds":
        return <CloudIcon />;
      case "Rain":
        return <RainIcon />;
      case "Drizzle":
        return <RainIcon />;
      case "Thunderstorm":
        return <ThunderstormIcon />;
      case "Snow":
        return <SnowIcon />;
      default:
        return <CloudIcon opacity={0.7} />; // For Mist, Haze etc.
    }
  };

  // Filter to get one forecast per day (around noon)
  const dailyForecast = forecastData?.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  return (
    <div
      style={backgroundStyle}
      className="min-h-screen text-slate-100 font-sans transition-all duration-1000 ease-in-out p-4 sm:p-6 lg:p-8 flex flex-col items-center"
    >
      <main className="w-full max-w-4xl bg-black/25 backdrop-blur-lg rounded-2xl shadow-2xl p-4 sm:p-6 ring-1 ring-white/20 flex flex-col">
        {/* Header: Search and Title */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wider">
            Weatherly
          </h1>
          <form onSubmit={handleSearch} className="relative w-full sm:w-64">
            <input
              ref={searchInputRef}
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search city..."
              className="w-full bg-white/10 placeholder-slate-300 rounded-full py-2 pl-4 pr-12 text-slate-100 outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <div className="absolute top-full left-0 right-0 text-center mt-1">
              <kbd className="text-xs text-slate-300 bg-white/10 rounded-md px-1.5 py-0.5">
                Ctrl+K
              </kbd>
            </div>
          </form>
        </header>

        {/* Main Content */}
        <div className="flex-grow">
          {loading && (
            <div className="flex justify-center items-center h-full min-h-[300px]">
              <div className="w-12 h-12 border-4 border-white/50 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
          {error && (
            <div className="flex justify-center items-center h-full min-h-[300px] bg-red-500/30 rounded-lg p-4 text-center">
              {error}
            </div>
          )}
          {weatherData && forecastData && !loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Weather */}
              <div className="flex flex-col items-center justify-center text-center p-6 bg-white/10 rounded-xl">
                <h2 className="text-3xl font-semibold">
                  {weatherData.name}, {weatherData.sys.country}
                </h2>
                <p className="text-lg opacity-80 capitalize">
                  {weatherData.weather[0].description}
                </p>
                <div className="my-4 flex items-center">
                  <div className="scale-150">
                    {getWeatherIcon(weatherData.weather[0].main)}
                  </div>
                  <p className="text-7xl font-bold ml-4">
                    {Math.round(weatherData.main.temp)}°C
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-left">
                  <p>
                    <span className="opacity-70">Feels like:</span>{" "}
                    {Math.round(weatherData.main.feels_like)}°C
                  </p>
                  <p>
                    <span className="opacity-70">Humidity:</span>{" "}
                    {weatherData.main.humidity}%
                  </p>
                  <p>
                    <span className="opacity-70">Wind:</span>{" "}
                    {weatherData.wind.speed.toFixed(1)} m/s
                  </p>
                  <p>
                    <span className="opacity-70">Pressure:</span>{" "}
                    {weatherData.main.pressure} hPa
                  </p>
                </div>
              </div>

              {/* 5-Day Forecast */}
              <div className="flex flex-col gap-3 p-6 bg-white/10 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">5-Day Forecast</h3>
                {dailyForecast?.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white/10 p-2 rounded-lg transition-all hover:bg-white/20 hover:scale-105"
                  >
                    <p className="w-1/4 font-medium">
                      {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </p>
                    <div className="w-1/4 flex justify-center">
                      {getWeatherIcon(day.weather[0].main)}
                    </div>
                    <p className="w-1/4 text-center capitalize text-sm opacity-80">
                      {day.weather[0].main}
                    </p>
                    <p className="w-1/4 text-right font-semibold">
                      {Math.round(day.main.temp_max)}° /{" "}
                      {Math.round(day.main.temp_min)}°
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="text-center mt-6 text-sm text-white/70">
        <p>Powered by OpenWeatherMap. Designed with ❤️.</p>
      </footer>
    </div>
  );
}

// NOTE: You need to add custom animations to your tailwind.config.js file for this to work fully.
// Since we are in a single file, I will add them in a style tag in the public/index.html.
/*
 In your index.html's <head>, add this style tag:
 <style>
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    @keyframes pulse-slow {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
    }
    @keyframes drizzle {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(10px); opacity: 0; }
    }
    @keyframes flash {
        0%, 50%, 100% { opacity: 1; }
        25%, 75% { opacity: 0; }
    }
    @keyframes snow {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(5px, 20px) rotate(90deg); opacity: 0; }
    }
   .animate-float { animation: float 6s ease-in-out infinite; }
   .animate-pulse-slow { animation: pulse-slow 5s ease-in-out infinite; }
   .animate-drizzle { animation: drizzle 1.5s linear infinite; }
   .animate-flash { animation: flash 2s linear infinite; }
   .animate-snow { animation: snow 2s linear infinite; }
 </style>
*/
