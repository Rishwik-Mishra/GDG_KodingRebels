// ===== CONFIG =====
const OPENWEATHER_API_KEY = "YOUR_API_KEY_HERE"; // Replace with your OpenWeatherMap API key

// ===== LEAFLET MAP =====
let map;
let currentMarker = null;

function initMap() {
  map = L.map("map").setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);
}

function updateMap(lat, lon, countryName, temp, weather, score) {

  lat = Number(lat);
  lon = Number(lon);

  if (!map || isNaN(lat) || isNaN(lon)) {
    console.error("Invalid coordinates:", lat, lon);
    return;
  }

  if (currentMarker) {
    map.removeLayer(currentMarker);
  }

  map.flyTo([lat, lon], 6, { duration: 1.5 });

  let color = "red";
  if (score >= 75) color = "green";
  else if (score >= 50) color = "orange";

  currentMarker = L.circleMarker([lat, lon], {
    radius: 10,
    color: color,
    fillColor: color,
    fillOpacity: 0.8
  }).addTo(map);

  currentMarker.bindPopup(`
    <b>${countryName}</b><br/>
    🌡 Temp: ${temp}°C<br/>
    🌤 Weather: ${weather}<br/>
    🧭 Travel Score: ${score}
  `).openPopup();
}

// ===== GEOLOCATION =====
let userLat = 20.5937;
let userLon = 78.9629;

navigator.geolocation.getCurrentPosition(
  (position) => {
    userLat = position.coords.latitude;
    userLon = position.coords.longitude;
  },
  () => {
    console.log("Using India fallback location.");
  }
);

// ===== DOM ELEMENTS =====
const countrySelect = document.getElementById("countrySelect");
const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const results = document.getElementById("results");

const flag = document.getElementById("flag");
const countryNameEl = document.getElementById("countryName");
const capitalEl = document.getElementById("capital");
const populationEl = document.getElementById("population");
const regionEl = document.getElementById("region");

const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

const ecoScoreEl = document.getElementById("ecoScore");
const adviceText = document.getElementById("adviceText");
const scoreCircle = document.querySelector(".score-circle");

const weatherBar = document.getElementById("weatherBar");
const ecoBar = document.getElementById("ecoBar");
const costBar = document.getElementById("costBar");

const weatherScoreText = document.getElementById("weatherScore");
const ecoScoreText = document.getElementById("ecoDistanceScore");
const costScoreText = document.getElementById("costScore");

// ===== LOAD COUNTRIES =====
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,capital,latlng,flags,population,region"
    );
    const data = await res.json();

    data
      .sort((a, b) => a.name.common.localeCompare(b.name.common))
      .forEach(country => {
        if (!country.latlng) return;

        const option = document.createElement("option");
        option.value = country.name.common;
        option.textContent = country.name.common;
        countrySelect.appendChild(option);
      });

  } catch (error) {
    console.error("Error loading countries:", error);
  }
});

// ===== SEARCH BUTTON =====
searchBtn.addEventListener("click", async () => {
  const selectedCountry = countrySelect.value;
  if (!selectedCountry) return;

  results.classList.add("hidden");
  loading.classList.remove("hidden");

  try {
    // Fetch country with latlng
    const countryRes = await fetch(
      `https://restcountries.com/v3.1/name/${selectedCountry}?fullText=true&fields=name,capital,latlng,flags,population,region`
    );

    const countryData = await countryRes.json();
    const country = countryData[0];

    if (!country || !country.latlng) {
      throw new Error("Invalid country data.");
    }

    const lat = country.latlng[0];
    const lon = country.latlng[1];

    // Populate UI
    flag.src = country.flags.png;
    countryNameEl.textContent = country.name.common;
    capitalEl.textContent = country.capital?.[0] || "N/A";
    populationEl.textContent = country.population.toLocaleString();
    regionEl.textContent = country.region;

    // Fetch weather
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );

    const weatherData = await weatherRes.json();

    if (!weatherData.main || weatherData.cod !== 200) {
      throw new Error("Weather API failed.");
    }

    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const wind = weatherData.wind.speed;
    const description = weatherData.weather[0].description;

    temperatureEl.textContent = `${temp}°C`;
    descriptionEl.textContent = description;
    humidityEl.textContent = humidity;
    windEl.textContent = wind;

    // WEATHER SCORE
    let weatherScore = 40;
    if (temp < 10 || temp > 35) weatherScore -= 15;
    if (humidity > 85) weatherScore -= 5;
    if (wind > 12) weatherScore -= 5;

    // ECO DISTANCE SCORE
    const distance = calculateDistance(userLat, userLon, lat, lon);

    let ecoScore = 30;
    if (distance > 8000) ecoScore = 10;
    else if (distance > 4000) ecoScore = 20;

    // COST SCORE
    let costScore = 30;
    if (country.region === "Europe") costScore = 20;
    if (country.region === "Americas") costScore = 15;
    if (country.region === "Oceania") costScore = 10;

    const totalScore = weatherScore + ecoScore + costScore;

    updateUI(totalScore, weatherScore, ecoScore, costScore);
    adviceText.textContent = generateAdvice(totalScore);

    loading.classList.add("hidden");
    results.classList.remove("hidden");

    // 🔥 Initialize map AFTER results visible
    if (!map) {
      initMap();
    }

    setTimeout(() => {
      map.invalidateSize();
      updateMap(lat, lon, selectedCountry, temp, description, totalScore);
    }, 200);

  } catch (error) {
    console.error("Error:", error);
    loading.classList.add("hidden");
    alert("Something went wrong. Try another country.");
  }
});

// ===== DISTANCE =====
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(value) {
  return value * Math.PI / 180;
}

// ===== UPDATE UI =====
function updateUI(total, weather, eco, cost) {
  animateScore(total);

  weatherBar.style.width = (weather/40)*100 + "%";
  ecoBar.style.width = (eco/30)*100 + "%";
  costBar.style.width = (cost/30)*100 + "%";

  weatherScoreText.textContent = `${weather}/40`;
  ecoScoreText.textContent = `${eco}/30`;
  costScoreText.textContent = `${cost}/30`;
}

// ===== ADVICE =====
function generateAdvice(score) {
  if (score > 80)
    return "🌿 Excellent time to visit! Conditions are ideal.";
  if (score > 60)
    return "🌤 Travel possible but consider minor factors.";
  if (score > 40)
    return "⚠ Moderate conditions. Plan wisely.";
  return "🚫 Not recommended currently.";
}

// ===== SCORE ANIMATION =====
function animateScore(score) {
  let current = 0;

  const interval = setInterval(() => {
    if (current >= score) {
      clearInterval(interval);
    } else {
      current++;
      ecoScoreEl.textContent = current;

      const degrees = (current / 100) * 360;
      scoreCircle.style.background =
        `conic-gradient(#00ff87 ${degrees}deg, rgba(255,255,255,0.1) ${degrees}deg)`;
    }
  }, 15);
}