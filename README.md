# 🌿 EcoTravel Decision Assistant  

A smart travel decision platform that helps users choose destinations based on **weather conditions, environmental impact, and affordability** — all combined into a single Travel Readiness Score.

🚀 **Built in just 3 hours during a hackathon.**  
This is a rapid prototype and will be further developed into a more advanced, production-level intelligent travel assistant.

---

## 🎯 What It Does

EcoTravel simplifies travel planning by combining multiple factors into one smart decision system:

- 🌤 Real-time weather data  
- 🌍 Distance-based environmental impact calculation  
- 💰 Basic affordability estimation  
- 📊 Weighted travel score (0–100)  
- 🗺 Interactive map visualization  
- 💡 Instant travel recommendation  

Instead of checking multiple platforms, users get a single sustainability-aware decision metric.

---

## 🧮 How The Travel Score Works

The Travel Decision Score is calculated out of **100 points**:

- 🌤 Weather Comfort → 40%
- 🌱 Environmental Impact (Distance) → 30%
- 💰 Affordability (Region-based) → 30%


### Technical Implementation
- Weather data fetched using **OpenWeather API**
- Country metadata via **RestCountries API**
- Distance calculated using the **Haversine formula**
- Interactive map built using **Leaflet.js**

---

## 🛠 Tech Stack

- HTML  
- CSS (Modern Glass UI)  
- JavaScript (Vanilla JS)  
- Leaflet.js  
- OpenWeather API  
- RestCountries API  

---

## ⚠ Current Limitations

- Cost estimation is region-based (not real-time flight pricing)
- Environmental impact assumes average air travel
- No Air Quality Index integration yet
- API key handling will be secured via backend in future version

---

## 🔮 Future Roadmap

This project will be expanded to include:

- ✈ Real-time flight pricing APIs  
- 🌫 Air Quality Index scoring  
- 🌍 Carbon emission APIs  
- 📅 Seasonal weather trend predictions  
- 🔐 Backend integration for secure API handling  
- 📊 Advanced sustainability analytics  

The long-term goal is to build a **full-scale intelligent sustainable travel advisor.**

---

## 🏆 Hackathon Context

This project was designed and developed in **under 3 hours** during a hackathon.

Focus areas:
- Rapid prototyping  
- Functional scoring engine  
- Real API integration  
- Clean UI/UX  
- End-to-end working system  

---

## 🌱 Vision

EcoTravel encourages responsible and sustainable travel decisions by combining comfort, cost, and climate impact into a single intelligent score.

---

**Built fast. Built smart. Built to scale. 🚀**