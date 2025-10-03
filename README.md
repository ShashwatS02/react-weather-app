# 🌦️ Weatherly – Modern Weather Forecast App

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react\&logoColor=white)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwindcss\&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite\&logoColor=white)](https://vitejs.dev/)
[![OpenWeatherMap](https://img.shields.io/badge/API-OpenWeatherMap-FF9800?logo=openstreetmap\&logoColor=white)](https://openweathermap.org/api)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?logo=vercel)](https://your-deployment-link.com)

---

Weatherly is a **beautifully designed, real-time weather application** built with **React.js and Tailwind CSS**.
It provides **live weather data**, a **5-day forecast**, and features a **dynamic, animated interface** that changes based on the current weather conditions and time of day.

---

## 📸 Preview

![Weatherly App Screenshot](./screenshots/Screenshot%202025-10-02%20024558.png)

---

## ✨ Features

* 🌍 **Live Weather Data** – Get up-to-the-minute weather information for any city worldwide.
* 📅 **5-Day Forecast** – Plan ahead with accurate daily forecasts.
* 🌌 **Dynamic Backgrounds** – Background transitions with **weather conditions** (Clear, Clouds, Rain, etc.) and **time of day** (Day/Night).
* 📍 **Geolocation** – Automatically detects and shows your current location weather.
* 🎨 **Animated SVG Icons** – Beautiful, interactive weather icons for each condition.
* 💻 **Modern & Responsive UI** – Glassmorphism-inspired design, optimized for all devices.
* ⌨️ **Keyboard Shortcuts** – `Ctrl+K` (or `Cmd+K` on Mac) to quickly focus the search bar.

---

## 🛠️ Tech Stack

* **Framework**: [React.js](https://react.dev/) (Vite)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **API**: [OpenWeatherMap](https://openweathermap.org/api)
* **Icons & Animations**: Animated SVGs

---

## 🚀 Getting Started

### ✅ Prerequisites

* [Node.js](https://nodejs.org/) **v16+**
* npm (comes with Node.js)
* [OpenWeatherMap API Key](https://openweathermap.org/api)

---

### 📥 Installation

1. **Clone the repository**

```bash
git clone https://github.com/<your-username>/weatherly.git
cd weatherly
```

2. **Navigate to frontend folder**

```bash
cd weather-app-frontend
```

3. **Install dependencies**

```bash
npm install
```

4. **Set up environment variables**

Create a `.env.local` file inside `weather-app-frontend` and add:

```env
VITE_OPENWEATHERMAP_API_KEY=your_actual_api_key_here
```

> ⚠️ This file is gitignored for security and should not be committed.

5. **Run the development server**

```bash
npm run dev
```

* Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 📂 Project Structure

```
weatherly/
├── weather-app-frontend/      # Main React app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Helper functions
│   │   └── App.tsx
│   ├── public/                # Static assets
│   └── package.json
├── weather-app-backend/       # (Unused in current version)
└── README.md
```

---

## 🙏 Acknowledgements

* Weather data provided by [OpenWeatherMap](https://openweathermap.org/api)
* Custom app icon and favicon designed for this project

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch (`feature/your-feature`)
3. Commit changes
4. Open a Pull Request 🚀

---

## 📜 License

This project is licensed under the MIT License – feel free to use, modify, and share.

**Built with ❤️ using React + Tailwind CSS**
