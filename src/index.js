import _ from "lodash";
import "./style.css";
import { getCurrentWeather, getForecast } from "./weather-data";

let currentTemperatureUnit = "C";
let currentDistanceUnit = "mm";
let currentSpeedUnit = "kph";

function loadPage() {
    let place = 'toronto';
    console.log("load page with", place);

    getCurrentWeather(place);
    getForecast(place);
    updateWeatherData();
}

loadPage();

function getLocationData(place) {
    return getCurrentWeather(place).then(data => data ? data.location : null);
}

function getCurrentWeatherData(place) {
    return getCurrentWeather(place).then(data => data ? data.current : null);
}

function getForecastData(place) {
    return getForecast(place).then(data => data ? data.forecast : null);
}

function updateDOMWithLocation(place) {
    getLocationData(place).then(location => {
        console.log("Updating DOM with location...", location);
        if (location) {
            document.getElementById('locationName').textContent = `Location Name: ${location.name}`;
            document.getElementById('locationCountry').textContent = `Location Country: ${location.country}`;
        } else {
            console.log("error");
        };
    });
};

function updateDOMWithCurrentWeather(place) {
    getCurrentWeatherData(place).then(current_weather => {
        if (current_weather) {
            const temperature = currentTemperatureUnit === 'C' ?
            current_weather.temp_c: current_weather.temp_f; 
            const feelsLike = currentTemperatureUnit === 'C' ?
            current_weather.feelslike_c: current_weather.feelslike_f;
            const precipitation = currentDistanceUnit === "mm" ? 
            current_weather.precip_mm: current_weather.precip_in;
            const wind = currentSpeedUnit === "kph" ?
            current_weather.wind_kph: current_weather.wind_mph;

            console.log(temperature, feelsLike, currentTemperatureUnit);
            document.getElementById('temperatureId').textContent = 
            `Temperature: ${temperature}°${currentTemperatureUnit}`;
            document.getElementById('feelsLikeId').textContent = `
            Feels like: ${feelsLike}°${currentTemperatureUnit}`;
            document.getElementById('precipitation_Id').textContent = 
            `Precipitation: ${precipitation} ${currentDistanceUnit}`;
            document.getElementById('uv').textContent = `UV: ${current_weather.uv}`;
            document.getElementById('wind_Id').textContent = 
            `Wind: ${wind} ${currentSpeedUnit} ${current_weather.wind_dir}`;
        }    
    });
}

function updateDOMWithForecast(place) {
    getForecastData(place).then(forecast => {
        if (forecast) {
            document.getElementById('day0').textContent = `Day 0: ${forecast.forecastday[0]}`;
            console.log("forecastday0", forecast.forecastday[0]);
        }
    })
}

function resetDOM() {
    const blank = "";
    console.log("Resetting DOM");
    document.getElementById('locationName').textContent = blank;
    document.getElementById('locationCountry').textContent = blank;
    document.getElementById('temperatureId').textContent = blank;
    document.getElementById('feelsLikeId').textContent = blank;
    document.getElementById('precipitation_Id').textContent = blank;
    document.getElementById('uv').textContent = blank;
    document.getElementById('wind_Id').textContent = blank;
}

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('weatherForm');
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); 
  
        const placeInput = document.getElementById('place').value;
        console.log("City entered:", placeInput);

        let place = placeInput;
  
        try {
            console.log("New location:", place);

            const weatherData = await getCurrentWeather(place);
            const ForecastData = await getForecast(place);

            console.log("weatherdata and forecastdata", weatherData, ForecastData);

            updateWeatherData();
        } catch (error) {
            console.error("Event Listener failed", error);
        }
    });
});

document.getElementById("unitToggle").addEventListener("click", function () {
    currentTemperatureUnit = currentTemperatureUnit === 'C' ? 'F' : 'C';
    currentDistanceUnit = currentDistanceUnit === 'mm' ? 'in' : 'mm';
    currentSpeedUnit = currentSpeedUnit === 'kph' ? 'mph' : 'kph';
    updateWeatherData();
});

async function updateWeatherData() {
    let place = document.getElementById('place').value;

    if (!place) {
        place = 'toronto';
    }
    resetDOM();
    updateDOMWithLocation(place);
    updateDOMWithCurrentWeather(place);
    updateDOMWithForecast(place);
}