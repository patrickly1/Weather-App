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
        if (location) {
            document.getElementById('locationName').textContent = `Location Name: ${location.name}`;
            document.getElementById('locationRegion').textContent = `Location Region: ${location.region}`;
            document.getElementById('locationCountry').textContent = `Location Country: ${location.country}`;
        } else {
            console.log("error");
        };
    });
};

function updateDOMWithCurrentWeather() {
    getCurrentWeatherData().then(current_weather => {
        if (current_weather) {
            document.getElementById('feelslike').textContent = `Feels like: ${current_weather.feelslike_c}°C`;
        }
        
    });
}


updateDOMWithLocation();
updateDOMWithCurrentWeather();