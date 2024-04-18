import _ from "lodash";
import "./style.css";
import { getCurrentWeather, getForecast} from "./weather-data";

getCurrentWeather();
getForecast();

function getLocationData() {
    return getCurrentWeather().then(data => data ? data.location : null);
}

function getCurrentWeatherData() {
    return getCurrentWeather().then(data => data ? data.current : null);
}

function updateDOMWithLocation() {
    getLocationData().then(location => {
        console.log("Updating DOM with location...", location);
        if (location) {
            document.getElementById('locationName').textContent = `Location Name: ${location.name}`;
            document.getElementById('locationRegion').textContent = `Location Region: ${location.region}`;
            document.getElementById('locationCountry').textContent = `Location Country: ${location.country}`;
            document.getElementById('locationTime').textContent = `Location Time: ${location.localtime}`;
        } else {
            console.log("error");
        };
    });
};

function updateDOMWithCurrentWeather() {
    getCurrentWeatherData().then(current_weather => {
        if (current_weather) {
            document.getElementById('temperature_c').textContent = `Temperature: ${current_weather.temp_c}°C`;
            document.getElementById('feelslike').textContent = `Feels like: ${current_weather.feelslike_c}°C`;
            document.getElementById('precipitation_mm').textContent = `Precipitation: ${current_weather.precip_mm}mm`;
            document.getElementById('uv').textContent = `UV: ${current_weather.uv}`;
            document.getElementById('wind_kph').textContent = `Wind: ${current_weather.wind_kph}kph ${current_weather.wind_dir}`;
        }
        
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('weatherForm');
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); 
  
        const locationInput = document.getElementById('location').value;
        console.log("City entered:", locationInput);

        let location = locationInput;
        let currentWeatherURL = 'https://api.weatherapi.com/v1/current.json?key=9d73c117f8704d6c91f235638241604&q=' + location;
        let forecastURL = 'https://api.weatherapi.com/v1/forecast.json?key=9d73c117f8704d6c91f235638241604&q=' + location + '&days=3';
  
        try {
            await getCurrentWeather(currentWeatherURL);
            await getForecast(forecastURL);
            updateDOMWithLocation();
            updateDOMWithCurrentWeather();
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
        }
        
    });
  });


updateDOMWithLocation();
updateDOMWithCurrentWeather();