import _ from "lodash";
import "./style.css";
import { getCurrentWeather, getForecast } from "./weather-data";
import thermometerIcon from './images/thermometer.svg';
import waterIcon from './images/water.svg';
import rainIcon from './images/weather-pouring.svg'
import windIcon from './images/weather-windy.svg'

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
            document.getElementById('locationName').textContent = `${location.name}`;
            document.getElementById('locationCountry').textContent = `${location.country}`;
            const [locationDate, locationTime] = location.localtime.split(' ');
            localTime = locationTime;
            document.getElementById('localDate').textContent = `${convertDate(locationDate)}`;
            document.getElementById('localTime').textContent = `${locationTime}`;
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

            const myThermometerIcon = new Image();
            myThermometerIcon.src = thermometerIcon;

            console.log(temperature, feelsLike, currentTemperatureUnit);

            const temperatureContainer = document.getElementById('temperatureId');
            temperatureContainer.textContent = ``;
            temperatureContainer.appendChild(myThermometerIcon); // Append the image element
            temperatureContainer.insertAdjacentHTML('beforeend', `${temperature}°${currentTemperatureUnit}`);

            document.getElementById('feelsLikeId').textContent = `
            Feels like: ${feelsLike}°${currentTemperatureUnit}`;

            const myWaterIcon = new Image();
            myWaterIcon.src = waterIcon;

            const precipitationContainer = document.getElementById('precipitation_Id');
            precipitationContainer.textContent = ""; // Clear existing content
            precipitationContainer.appendChild(myWaterIcon); // Append the water icon
            precipitationContainer.appendChild(document.createTextNode(`Precipitation: ${precipitation} ${currentDistanceUnit}`)); // Append the precipitation text

            document.getElementById('uv').textContent = `UV: ${current_weather.uv}`;

            const myWindIcon = new Image();
            myWindIcon.src = windIcon;

            const windContainer = document.getElementById('wind_Id');
            windContainer.textContent = ""; // Clear existing content
            windContainer.appendChild(myWindIcon); // Append the water icon
            windContainer.appendChild(document.createTextNode(`${wind} ${currentSpeedUnit} ${current_weather.wind_dir}`)); // Append the precipitation text
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

                const hourlyWeatherConditionElement = document.createElement('div');
                hourlyWeatherConditionElement.id = `hour${i}WeatherCondition`;
                
                const hourlyWeatherIconElement = document.createElement('div');
                hourlyWeatherConditionElement.id = `hour${i}WeatherIcon`;

                const hourlyTemperatureElement = document.createElement('div');
                hourlyTemperatureElement.id = `hour${i}Temperature`;

                const hourlyChanceOfRainElement = document.createElement('div');
                hourlyChanceOfRainElement.id = `hour${i}ChanceofRain`

                const hourlyPrecipitationElement = document.createElement('div');
                hourlyPrecipitationElement.id = `hour${i}Precipitation`;

                const hourlyWindElement = document.createElement('div');
                hourlyWindElement.id = `hour${i}Wind`;

                hourlyTimeElement.textContent = `${(i + nextHour) % 24}:00`;

                hourlyWeatherConditionElement.textContent =
                `${next24HoursForecast[i].condition.text}`;

                const hourlyIconUrl = 'https:' + next24HoursForecast[i].condition.icon;
                const hourlyIconElement = document.createElement('img');
                hourlyIconElement.src = hourlyIconUrl;
                hourlyWeatherIconElement.appendChild(hourlyIconElement);

                hourlyTemperatureElement.textContent = 
                `${hourlyTemperature}°${currentTemperatureUnit}`;

                hourlyChanceOfRainElement.textContent = 
                `${next24HoursForecast[i].chance_of_rain}%`;

                if (next24HoursForecast[i].chance_of_rain > 0) {
                    hourlyPrecipitationElement.textContent = 
                    `${hourlyPrecipitation} ${currentDistanceUnit}`;
                }

                hourlyWindElement.textContent = 
                `${hourlyWind} ${currentSpeedUnit} ${next24HoursForecast[i].wind_dir}`;

                hourElement.appendChild(hourlyTimeElement);
                hourElement.appendChild(hourlyWeatherConditionElement);
                hourElement.appendChild(hourlyWeatherIconElement);
                hourElement.appendChild(hourlyTemperatureElement);
                hourElement.appendChild(hourlyChanceOfRainElement);
                hourElement.appendChild(hourlyPrecipitationElement);
                hourElement.appendChild(hourlyWindElement);
                hourlyForecastContainer.appendChild(hourElement);
            };
        };
    });
};

function updateDOMWithTwilight(place) {
    getForecastData(place).then(forecast => {
        if (forecast) {
            document.getElementById('sunriseId').textContent = `Sunrise: ${forecast.forecastday[0].astro.sunrise}`; 
            document.getElementById('sunsetId').textContent = `Sunset: ${forecast.forecastday[0].astro.sunset}`; 
            console.log(forecast.forecastday[0].astro);
        };
    });
};

function updateDOMWithWeeklyForecast(place) {
    getForecastData(place).then(forecast => {
        if (forecast) {
            //Adding current day weather condition here
            document.getElementById('day0WeatherConditionId').textContent =
            `${forecast.forecastday[0].day.condition.text}`;     

            //Add chance of rain icon
            const myRainIcon = new Image();
            myRainIcon.src = rainIcon;

            const day0ChanceofRainContainer = document.getElementById('day0ChanceofRain');
            day0ChanceofRainContainer.textContent = ""; // Clear existing content
            day0ChanceofRainContainer.appendChild(myRainIcon); // Append the water icon
            day0ChanceofRainContainer.appendChild(document.createTextNode(`${forecast.forecastday[0].day.daily_chance_of_rain}%`)); // Append the precipitation text
                        
            //Add weather icon
            const iconUrl = 'https:' + forecast.forecastday[0].day.condition.icon;
            console.log("iconurl TEST", iconUrl);
            const iconElement = document.createElement('img');
            iconElement.src = iconUrl;
            

            document.getElementById("day0WeatherIconId").appendChild(iconElement);


            const avgTempDay1 = currentTemperatureUnit === 'C' ?
            forecast.forecastday[1].day.avgtemp_c:
            forecast.forecastday[1].day.avgtemp_f;

            const maxTempDay1 = currentTemperatureUnit === 'C' ?
            forecast.forecastday[1].day.maxtemp_c:
            forecast.forecastday[1].day.maxtemp_f;

            const minTempDay1 = currentTemperatureUnit === 'C' ?
            forecast.forecastday[1].day.mintemp_c:
            forecast.forecastday[1].day.mintemp_f;

            console.log(forecast.forecastday[1].date);
            document.getElementById("day1Date").textContent = 
            `${convertDate(forecast.forecastday[1].date)}`; 
            document.getElementById('day1AvgTemperature').textContent = 
            `Average Temperature: ${avgTempDay1}°${currentTemperatureUnit}`;  
            document.getElementById('day1MaxTemperature').textContent = 
            `High: ${maxTempDay1}°${currentTemperatureUnit}`;  
            document.getElementById('day1MinTemperature').textContent = 
            `Low: ${minTempDay1}°${currentTemperatureUnit}`;  
            document.getElementById('day1Condition').textContent = 
            `${forecast.forecastday[1].day.condition.text}`;  
            document.getElementById('day1ChanceOfRain').textContent = 
            `Chance of Rain: ${forecast.forecastday[1].day.daily_chance_of_rain}%`;  


            const iconUrlDay1 = 'https:' + forecast.forecastday[1].day.condition.icon;
            const iconDay1Element = document.createElement('img');
            iconDay1Element.src = iconUrlDay1;
            

            document.getElementById("day1WeatherIconId").appendChild(iconDay1Element);
            
            const iconUrlDay2 = 'https:' + forecast.forecastday[2].day.condition.icon;
            const iconDay2Element = document.createElement('img');
            iconDay2Element.src = iconUrlDay2;
            

            document.getElementById("day2WeatherIconId").appendChild(iconDay2Element);
            
            const avgTempDay2 = currentTemperatureUnit === 'C' ?
            forecast.forecastday[2].day.avgtemp_c:
            forecast.forecastday[2].day.avgtemp_f;

            const maxTempDay2 = currentTemperatureUnit === 'C' ?
            forecast.forecastday[2].day.maxtemp_c:
            forecast.forecastday[2].day.maxtemp_f;

            const minTempDay2 = currentTemperatureUnit === 'C' ?
            forecast.forecastday[2].day.mintemp_c:
            forecast.forecastday[2].day.mintemp_f;

            console.log(forecast.forecastday[2].date);
            document.getElementById("day2Date").textContent = 
            `${convertDate(forecast.forecastday[1].date)}`; 
            document.getElementById('day2AvgTemperature').textContent = 
            `Average Temperature: ${avgTempDay2}°${currentTemperatureUnit}`;  
            document.getElementById('day2MaxTemperature').textContent = 
            `High: ${maxTempDay2}°${currentTemperatureUnit}`;  
            document.getElementById('day2MinTemperature').textContent = 
            `Low: ${minTempDay2}°${currentTemperatureUnit}`;  
            document.getElementById('day2Condition').textContent = 
            `${forecast.forecastday[2].day.condition.text}`;  
            document.getElementById('day2ChanceOfRain').textContent = 
            `Chance of Rain: ${forecast.forecastday[2].day.daily_chance_of_rain}%`;  
        };
    });
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
    document.getElementById('sunriseId').textContent = blank;
    document.getElementById('sunsetId').textContent = blank;
    document.getElementById('day0WeatherConditionId').textContent = blank;
    document.getElementById('day0WeatherIconId').textContent = blank;    
    document.getElementById('day0ChanceofRain').textContent = blank;    
    document.getElementById('day1Condition').textContent = blank;
    document.getElementById('day1WeatherIconId').textContent = blank;    
    document.getElementById('day2Condition').textContent = blank;
    document.getElementById('day2WeatherIconId').textContent = blank;
    document.getElementById('day1Date').textContent = blank;
    document.getElementById('day1AvgTemperature').textContent = blank;
    document.getElementById('day1MaxTemperature').textContent = blank;
    document.getElementById('day1MinTemperature').textContent = blank;
    document.getElementById('day1Condition').textContent = blank;
    document.getElementById('day1ChanceOfRain').textContent = blank;    
    document.getElementById('day2Date').textContent = blank;
    document.getElementById('day2AvgTemperature').textContent = blank;
    document.getElementById('day2MaxTemperature').textContent = blank;
    document.getElementById('day2MinTemperature').textContent = blank;
    document.getElementById('day2Condition').textContent = blank;
    document.getElementById('day2ChanceOfRain').textContent = blank;

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
    updateDOMWithTwilight(place);
    updateDOMWithWeeklyForecast(place);
}

function convertDate(dateInput) {
    const date = new Date(dateInput)

    // Format the date using toLocaleDateString() method
    const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long", // Display full weekday name
        month: "long",   // Display full month name
        day: "numeric",  // Display day of the month
        year: "numeric"  // Display full year
    });

    return formattedDate;
}