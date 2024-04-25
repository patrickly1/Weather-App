import _ from "lodash";
import "./style.css";
import { getCurrentWeather, getForecast } from "./weather-data";

let currentTemperatureUnit = "C";
let currentDistanceUnit = "mm";
let currentSpeedUnit = "kph";
let localTime;

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
            const [locationDate, locationTime] = location.localtime.split(' ');
            localTime = locationTime;
            document.getElementById('localDate').textContent = `Local Date: ${locationDate}`;
            document.getElementById('localTime').textContent = `Local Time: ${locationTime}`;
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
            const hourlyForecastContainer = document.getElementById('hourlyForecastContainer');
            hourlyForecastContainer.textContent = "";

            let nextHour = parseInt(localTime.split(':')[0]) + 1;
            console.log('localtime', localTime, 'nextHour', nextHour); 

            const next24HoursForecast = 
            forecast.forecastday[0].hour.concat(forecast.forecastday[1].hour);
            console.log("hourly forecast", next24HoursForecast);

            //unit toggle
            //const temperature = currentTemperatureUnit === 'C' ?
            //current_weather.temp_c: current_weather.temp_f; 
            //const feelsLike = currentTemperatureUnit === 'C' ?
            //current_weather.feelslike_c: current_weather.feelslike_f;
            //const precipitation = currentDistanceUnit === "mm" ? 
            //current_weather.precip_mm: current_weather.precip_in;
            //const wind = currentSpeedUnit === "kph" ?
            //current_weather.wind_kph: current_weather.wind_mph;

            for (let i = 0; i < 24; i++) {
                //Convert units
                const hourlyTemperature = currentTemperatureUnit === 'C' ? 
                next24HoursForecast[i + nextHour].temp_c:
                next24HoursForecast[i + nextHour].temp_f;

                const hourlyPrecipitation = currentDistanceUnit === 'mm' ?
                next24HoursForecast[i + nextHour].precip_mm:
                next24HoursForecast[i + nextHour].precip_in;

                const hourlyWind = currentDistanceUnit === 'kph' ?
                next24HoursForecast[i + nextHour].wind_kph:
                next24HoursForecast[i + nextHour].wind_mph;

                //create Elements for each hour, hourly temperature, hourly precipitation, 
                //and hourly wind
                const hourElement = document.createElement('div');
                hourElement.id = `hour${i}`;

                const hourlyTimeElement = document.createElement('div');
                hourlyTimeElement.id = `hour${i}Time`;

                const hourlyTemperatureElement = document.createElement('div');
                hourlyTemperatureElement.id = `hour${i}Temperature`;

                const hourlyPrecipitationElement = document.createElement('div');
                hourlyPrecipitationElement.id = `hour${i}Precipitation`;

                const hourlyWindElement = document.createElement('div');
                hourlyWindElement.id = `hour${i}Wind`;

                hourlyTimeElement.textContent = `${(i + nextHour) % 24}:00`
                hourlyTemperatureElement.textContent = 
                `${hourlyTemperature}°${currentTemperatureUnit}`;
                hourlyPrecipitationElement.textContent = 
                `${hourlyPrecipitation}°${currentDistanceUnit}`;
                hourlyWindElement.textContent = 
                `${hourlyWind}°${currentSpeedUnit}`;

                hourElement.appendChild(hourlyTimeElement)
                hourElement.appendChild(hourlyTemperatureElement);
                hourElement.appendChild(hourlyPrecipitationElement);
                hourElement.appendChild(hourlyWindElement);
                hourlyForecastContainer.appendChild(hourElement);
            }
        }
    })
}

function resetDOM() {
    const blank = "";
    console.log("Resetting DOM");
    document.getElementById('locationName').textContent = blank;
    document.getElementById('locationCountry').textContent = blank;
    document.getElementById('localDate').textContent = blank;
    document.getElementById('localTime').textContent = blank;
    document.getElementById('temperatureId').textContent = blank;
    document.getElementById('feelsLikeId').textContent = blank;
    document.getElementById('precipitation_Id').textContent = blank;
    document.getElementById('uv').textContent = blank;
    document.getElementById('wind_Id').textContent = blank;
    document.getElementById('hourlyForecastContainer').textContent = blank;
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
