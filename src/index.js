import _ from "lodash";
import "./style.css";
import { getCurrentWeather, getForecast} from "./weather-data";

let place = 'toronto';

function loadPage() {

    console.log("load page with", place);

    getCurrentWeather(place);
    getForecast(place);
    updateDOMWithLocation(place);
    updateDOMWithCurrentWeather(place);
}

loadPage();

function getLocationData(place) {
    return getCurrentWeather(place).then(data => data ? data.location : null);
}

function getCurrentWeatherData(place) {
    return getCurrentWeather(place).then(data => data ? data.current : null);
}

function updateDOMWithLocation(place) {
    getLocationData(place).then(location => {
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

function updateDOMWithCurrentWeather(place) {
    getCurrentWeatherData(place).then(current_weather => {
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
  
        const placeInput = document.getElementById('place').value;
        console.log("City entered:", placeInput);

        let place = placeInput;
  
        try {
            console.log("New location:", place);
            const weatherData = await getCurrentWeather(place)
            console.log(weatherData);
            await getCurrentWeather(place);
            await getForecast(place);
            updateDOMWithLocation(place);
            updateDOMWithCurrentWeather(place);
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
        }
    });
});
