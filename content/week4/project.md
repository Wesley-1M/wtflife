# Week 4 Project: Build a Weather App

**Duration:** 4-5 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ Advanced  
**Type:** Full-featured API-driven application  
**Goal:** Apply async programming and API integration

---

## 📚 Project Overview

Build a **professional weather application** that:
- ✅ Shows current weather for any city
- ✅ Displays 5-day forecast
- ✅ Shows weather details (humidity, wind, pressure)
- ✅ Has search functionality
- ✅ Caches recent searches
- ✅ Shows loading states
- ✅ Handles errors gracefully
- ✅ Beautiful responsive UI

---

## 🔑 Getting Your Free API Key

Visit: https://openweathermap.org/api

Sign up for free account and get API key for:
- Current Weather Data (Free)
- 5 Day / 3 Hour Forecast (Free)

---

## 🏗️ Part 1: HTML Structure

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weather App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="weather-app">
    <header class="app-header">
      <h1>🌤️ Weather App</h1>
      <p>Get weather for any city in the world</p>
    </header>

    <main class="app-main">
      <!-- Search Section -->
      <div class="search-section">
        <input 
          type="text" 
          id="searchInput" 
          placeholder="Search for a city..."
          autocomplete="off"
        >
        <button id="searchBtn" class="btn btn-primary">Search</button>
        <button id="currentLocationBtn" class="btn btn-secondary">📍 Current</button>
      </div>

      <!-- Recent Searches -->
      <div class="recent-searches" id="recentSearches"></div>

      <!-- Current Weather -->
      <div class="current-weather" id="currentWeather"></div>

      <!-- Forecast -->
      <div class="forecast-section">
        <h2>5-Day Forecast</h2>
        <div class="forecast-grid" id="forecastGrid"></div>
      </div>

      <!-- Loading -->
      <div class="loading" id="loading"></div>

      <!-- Error -->
      <div class="error" id="errorMsg"></div>
    </main>

    <footer class="app-footer">
      <p>Data from OpenWeatherMap API | Built with JavaScript & Fetch</p>
    </footer>
  </div>

  <script src="app.js"></script>
</body>
</html>
```

---

## 🎨 Part 2: CSS Styling

Create `styles.css`:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #3498db;
  --secondary: #2ecc71;
  --danger: #e74c3c;
  --warning: #f39c12;
  --bg-dark: #1e3a5f;
  --bg-light: #ecf0f1;
  --text-dark: #2c3e50;
  --text-light: #7f8c8d;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
  color: var(--text-dark);
}

.weather-app {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

/* Header */
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.app-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.app-header p {
  opacity: 0.9;
  font-size: 1rem;
}

/* Main */
.app-main {
  padding: 2rem;
}

/* Search Section */
.search-section {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

#searchInput {
  flex: 1;
  min-width: 200px;
  padding: 0.875rem 1rem;
  border: 2px solid var(--bg-light);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

#searchInput:focus {
  outline: none;
  border-color: var(--primary);
}

.btn {
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.btn-secondary {
  background: var(--bg-light);
  color: var(--text-dark);
}

.btn-secondary:hover {
  background: var(--text-light);
}

/* Recent Searches */
.recent-searches {
  margin-bottom: 2rem;
}

.search-tag {
  display: inline-block;
  background: var(--bg-light);
  padding: 0.5rem 1rem;
  margin: 0.25rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.search-tag:hover {
  background: var(--primary);
  color: white;
}

.search-label {
  display: block;
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

/* Current Weather */
.current-weather {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: none;
}

.current-weather.show {
  display: block;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1.5rem;
}

.weather-location h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.weather-location p {
  opacity: 0.9;
  font-size: 0.95rem;
}

.weather-icon {
  font-size: 4rem;
}

.weather-main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.weather-stat {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  opacity: 0.9;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1.5rem;
}

.detail {
  text-align: center;
}

.detail-value {
  font-size: 1.5rem;
  font-weight: 600;
}

.detail-label {
  opacity: 0.8;
  font-size: 0.85rem;
}

/* Forecast */
.forecast-section h2 {
  margin-bottom: 1.5rem;
  color: var(--text-dark);
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.forecast-card {
  background: var(--bg-light);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.forecast-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.forecast-day {
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.forecast-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.forecast-temp {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.forecast-desc {
  font-size: 0.9rem;
  color: var(--text-light);
  text-transform: capitalize;
  margin-bottom: 1rem;
}

.forecast-details {
  font-size: 0.85rem;
  color: var(--text-light);
}

/* Loading */
.loading {
  text-align: center;
  padding: 2rem;
  display: none;
}

.loading.show {
  display: block;
}

.spinner {
  border: 4px solid var(--bg-light);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error */
.error {
  background: #ffe6e6;
  border: 2px solid var(--danger);
  color: var(--danger);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: none;
}

.error.show {
  display: block;
}

/* Footer */
.app-footer {
  background: var(--bg-light);
  padding: 1.5rem;
  text-align: center;
  color: var(--text-light);
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 600px) {
  .app-header h1 {
    font-size: 1.5rem;
  }

  .app-main {
    padding: 1rem;
  }

  .search-section {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .weather-main {
    grid-template-columns: repeat(2, 1fr);
  }

  .forecast-grid {
    grid-template-columns: 1fr;
  }

  .weather-header {
    flex-direction: column;
  }

  .weather-icon {
    margin-top: 1rem;
  }
}
```

---

## 💻 Part 3: JavaScript Logic

Create `app.js`:

```javascript
// ==========================================
// Weather App - Complete Application
// ==========================================

const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

let recentSearches = [];

// ==========================================
// Initialize App
// ==========================================

function init() {
  loadRecentSearches();
  setupEventListeners();
  displayRecentSearches();
}

// ==========================================
// Setup Event Listeners
// ==========================================

function setupEventListeners() {
  document.getElementById('searchBtn').addEventListener('click', () => {
    let city = document.getElementById('searchInput').value.trim();
    if (city) {
      searchWeather(city);
    }
  });

  document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      let city = document.getElementById('searchInput').value.trim();
      if (city) {
        searchWeather(city);
      }
    }
  });

  document.getElementById('currentLocationBtn').addEventListener('click', () => {
    getLocationWeather();
  });
}

// ==========================================
// Search Weather by City Name
// ==========================================

async function searchWeather(city) {
  showLoading(true);
  hideError();

  try {
    let response = await fetch(
      `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('City not found');
    }

    let weatherData = await response.json();
    let forecastData = await fetchForecast(weatherData.coord.lat, weatherData.coord.lon);

    displayCurrentWeather(weatherData);
    displayForecast(forecastData);

    addToRecentSearches(weatherData.name);
    document.getElementById('searchInput').value = '';

    showLoading(false);
  } catch (error) {
    showError(error.message);
    showLoading(false);
  }
}

// ==========================================
// Get Current Location Weather
// ==========================================

function getLocationWeather() {
  if (!navigator.geolocation) {
    showError('Geolocation not supported');
    return;
  }

  showLoading(true);

  navigator.geolocation.getCurrentPosition(
    (position) => {
      let {latitude, longitude} = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    },
    (error) => {
      showError('Could not get your location');
      showLoading(false);
    }
  );
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    let response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    let weatherData = await response.json();
    let forecastData = await fetchForecast(lat, lon);

    displayCurrentWeather(weatherData);
    displayForecast(forecastData);

    showLoading(false);
  } catch (error) {
    showError('Failed to get weather');
    showLoading(false);
  }
}

// ==========================================
// Fetch Forecast Data
// ==========================================

async function fetchForecast(lat, lon) {
  let response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );

  return response.json();
}

// ==========================================
// Display Current Weather
// ==========================================

function displayCurrentWeather(data) {
  let container = document.getElementById('currentWeather');

  let temp = Math.round(data.main.temp);
  let feelsLike = Math.round(data.main.feels_like);
  let description = data.weather[0].main;
  let icon = getWeatherIcon(data.weather[0].main);

  container.innerHTML = `
    <div class="weather-header">
      <div class="weather-location">
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>${new Date().toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'})}</p>
      </div>
      <div class="weather-icon">${icon}</div>
    </div>

    <div class="weather-main">
      <div class="weather-stat">
        <div class="stat-value">${temp}°C</div>
        <div class="stat-label">Temperature</div>
      </div>
      <div class="weather-stat">
        <div class="stat-value">${description}</div>
        <div class="stat-label">Condition</div>
      </div>
      <div class="weather-stat">
        <div class="stat-value">${feelsLike}°C</div>
        <div class="stat-label">Feels Like</div>
      </div>
    </div>

    <div class="weather-details">
      <div class="detail">
        <div class="detail-value">${data.main.humidity}%</div>
        <div class="detail-label">Humidity</div>
      </div>
      <div class="detail">
        <div class="detail-value">${Math.round(data.wind.speed)} m/s</div>
        <div class="detail-label">Wind Speed</div>
      </div>
      <div class="detail">
        <div class="detail-value">${data.main.pressure} mb</div>
        <div class="detail-label">Pressure</div>
      </div>
      <div class="detail">
        <div class="detail-value">${data.clouds.all}%</div>
        <div class="detail-label">Cloudiness</div>
      </div>
    </div>
  `;

  container.classList.add('show');
}

// ==========================================
// Display Forecast
// ==========================================

function displayForecast(data) {
  let forecastGrid = document.getElementById('forecastGrid');
  let dailyForecasts = {};

  // Group forecast by day
  data.list.forEach(forecast => {
    let date = new Date(forecast.dt * 1000).toLocaleDateString();

    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        temp: forecast.main.temp,
        description: forecast.weather[0].main,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        icon: forecast.weather[0].main,
        date: new Date(forecast.dt * 1000)
      };
    }
  });

  // Display first 5 days
  let days = Object.values(dailyForecasts).slice(0, 5);

  forecastGrid.innerHTML = days.map(day => `
    <div class="forecast-card">
      <div class="forecast-day">
        ${day.date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
      </div>
      <div class="forecast-icon">${getWeatherIcon(day.icon)}</div>
      <div class="forecast-temp">${Math.round(day.temp)}°C</div>
      <div class="forecast-desc">${day.description}</div>
      <div class="forecast-details">
        💧 ${day.humidity}% | 💨 ${Math.round(day.wind)} m/s
      </div>
    </div>
  `).join('');
}

// ==========================================
// Weather Icons
// ==========================================

function getWeatherIcon(description) {
  const icons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Smoke': '💨',
    'Haze': '🌫️',
    'Dust': '🌫️',
    'Fog': '🌫️',
    'Sand': '🌫️',
    'Ash': '🌫️',
    'Squall': '💨',
    'Tornado': '🌪️'
  };

  return icons[description] || '🌤️';
}

// ==========================================
// Recent Searches
// ==========================================

function addToRecentSearches(city) {
  if (!recentSearches.includes(city)) {
    recentSearches.unshift(city);
    if (recentSearches.length > 5) {
      recentSearches.pop();
    }
    saveRecentSearches();
    displayRecentSearches();
  }
}

function saveRecentSearches() {
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}

function loadRecentSearches() {
  let saved = localStorage.getItem('recentSearches');
  if (saved) {
    recentSearches = JSON.parse(saved);
  }
}

function displayRecentSearches() {
  let container = document.getElementById('recentSearches');

  if (recentSearches.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="search-label">Recent Searches:</div>
    ${recentSearches.map(city => `
      <span class="search-tag" onclick="searchWeather('${city}')">${city}</span>
    `).join('')}
  `;
}

// ==========================================
// UI Helpers
// ==========================================

function showLoading(show) {
  let loading = document.getElementById('loading');

  if (show) {
    loading.innerHTML = '<div class="spinner"></div><p>Loading weather data...</p>';
    loading.classList.add('show');
  } else {
    loading.classList.remove('show');
  }
}

function showError(message) {
  let errorDiv = document.getElementById('errorMsg');
  errorDiv.textContent = `❌ ${message}`;
  errorDiv.classList.add('show');

  setTimeout(() => {
    errorDiv.classList.remove('show');
  }, 5000);
}

function hideError() {
  document.getElementById('errorMsg').classList.remove('show');
}

// ==========================================
// Start App
// ==========================================

document.addEventListener('DOMContentLoaded', init);
```

---

## 🔧 Setup Instructions

1. **Get API Key:**
   - Go to https://openweathermap.org/api
   - Sign up for free
   - Copy your API key

2. **Update Code:**
   - Replace `'YOUR_OPENWEATHERMAP_API_KEY'` in `app.js` with your actual key

3. **Run Locally:**
   - Use Python HTTP server or similar
   - Open in browser

---

## 🎯 Features Implemented

✅ **Async Programming**: async/await with Fetch API  
✅ **API Integration**: Real OpenWeatherMap API  
✅ **Error Handling**: Try/catch and user-friendly messages  
✅ **DOM Manipulation**: Dynamic content rendering  
✅ **Storage**: Recent searches with localStorage  
✅ **Geolocation**: Get weather for current location  
✅ **Responsive Design**: Mobile-friendly UI  
✅ **Loading States**: Visual feedback during requests  

---

## 🧪 Test Cases

- [ ] Search for a city name
- [ ] Error handling (invalid city)
- [ ] Get current location weather
- [ ] Recent searches display
- [ ] Click recent search to reload
- [ ] Display correct weather icons
- [ ] Show forecast for next 5 days
- [ ] Responsive on mobile

---

## 🎓 Learning Outcomes

You've built a complete, production-like application using:
- ✅ Async/await patterns
- ✅ Real API integration
- ✅ Error handling
- ✅ DOM manipulation
- ✅ Local storage
- ✅ Responsive design
- ✅ Real-world data handling

---

**Project Type:** Full-Stack Weather Application  
**Completion Time:** 4-5 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ (Advanced)  
**Next:** Week 5 - React Framework Begins
