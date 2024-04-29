import _ from "lodash";
import "./style.css";
import { getCurrentWeather, getForecast } from "./weather-data";
import thermometerIcon from './images/thermometer.svg';
import waterIcon from './images/water.svg';
import rainIcon from './images/weather-pouring.svg';
import windIcon from './images/weather-windy.svg';
import sunriseIcon from './images/weather-sunset-up.svg';
import sunsetIcon from './images/weather-sunset-down.svg';
import thermometerHighIcon from './images/thermometer-high.svg';
import thermometerLowIcon from './images/thermometer-low.svg';

let currentTemperatureUnit = "C";
let currentDistanceUnit = "mm";
let currentSpeedUnit = "kph";
let localTime;

function loadPage() {
    //Assume the location is Toronto, until the user changes the location
    let place = 'toronto';

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
        if (location) {
            document.getElementById('locationName').textContent = `${location.name}`;
            document.getElementById('locationCountry').textContent = `${location.country}`;
            //Split localtime string to get date and time
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
            //Check current units
            const temperature = currentTemperatureUnit === 'C' ?
            current_weather.temp_c: current_weather.temp_f; 
            const feelsLike = currentTemperatureUnit === 'C' ?
            current_weather.feelslike_c: current_weather.feelslike_f;
            const precipitation = currentDistanceUnit === "mm" ? 
            current_weather.precip_mm: current_weather.precip_in;
            const wind = currentSpeedUnit === "kph" ?
            current_weather.wind_kph: current_weather.wind_mph;

            //Get thermometer image for average temperature
            const myThermometerIcon = new Image();
            myThermometerIcon.src = thermometerIcon;

            //Place avg temperature with the correct units after the thermometer icon
            const temperatureContainer = document.getElementById('temperatureId');
            temperatureContainer.textContent = ``;
            temperatureContainer.appendChild(myThermometerIcon); // Append the image element
            temperatureContainer.insertAdjacentHTML('beforeend', `${temperature}°${currentTemperatureUnit}`);

            //Feels-like temperature
            document.getElementById('feelsLikeId').textContent = `
            Feels like ${feelsLike}°${currentTemperatureUnit}`;

            //Precipitation
            const myWaterIcon = new Image();
            myWaterIcon.src = waterIcon;

            const precipitationContainer = document.getElementById('precipitation_Id');
            precipitationContainer.textContent = ""; // Clear existing content
            precipitationContainer.appendChild(myWaterIcon); // Append the water icon
            precipitationContainer.appendChild(document.createTextNode(`${precipitation} ${currentDistanceUnit}`)); // Append the precipitation text

            //UV
            document.getElementById('uv').textContent = `UV: ${current_weather.uv}`;

            //Wind and direction
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

            //Use the next hour of the local ltime as the first hour reported in the hourly forecast
            let nextHour = parseInt(localTime.split(':')[0]) + 1;

            //Concat the current day with tomorrow's hourly forecast to get 24 hours 
            //of forecast from the next hour of the local time
            const next24HoursForecast = 
            forecast.forecastday[0].hour.concat(forecast.forecastday[1].hour);

            for (let i = 0; i < 24; i++) {
                //Update current units
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
                //and hourly wind. Add class for CSS purposes
                const hourElement = document.createElement('div');
                hourElement.id = `hour${i}`;

                const hourlyTimeElement = document.createElement('div');
                hourlyTimeElement.id = `hour${i}Time`;

                const hourlyWeatherConditionElement = document.createElement('div');
                hourlyWeatherConditionElement.id = `hour${i}WeatherCondition`;
                hourlyWeatherConditionElement.classList.add('hourlyWeatherCondition');
                
                const hourlyWeatherIconElement = document.createElement('div');
                hourlyWeatherConditionElement.id = `hour${i}WeatherIcon`;

                const hourlyTemperatureElement = document.createElement('div');
                hourlyTemperatureElement.id = `hour${i}Temperature`;
                hourlyTemperatureElement.classList.add('hourlyTemperatureClass')

                const hourlyChanceOfRainElement = document.createElement('div');
                hourlyChanceOfRainElement.id = `hour${i}ChanceofRain`;
                hourlyChanceOfRainElement.classList.add('hourlyChanceOfRainClass')

                const hourlyPrecipitationElement = document.createElement('div');
                hourlyPrecipitationElement.id = `hour${i}Precipitation`;
                hourlyPrecipitationElement.classList.add('hourlyPrecipitationClass');

                const hourlyWindElement = document.createElement('div');
                hourlyWindElement.id = `hour${i}Wind`;
                hourlyWindElement.classList.add('hourlyWindClass')

                //Hour
                hourlyTimeElement.textContent = `${(i + nextHour) % 24}:00`;

                //Condition
                hourlyWeatherConditionElement.textContent =
                `${next24HoursForecast[i].condition.text}`;

                //Get weather condition icon from API
                const hourlyIconUrl = 'https:' + next24HoursForecast[i].condition.icon;
                const hourlyIconElement = document.createElement('img');
                hourlyIconElement.src = hourlyIconUrl;
                hourlyWeatherIconElement.appendChild(hourlyIconElement);

                //temperature
                const myThermometerIcon = new Image();
                myThermometerIcon.src = thermometerIcon;

                hourlyTemperatureElement.textContent = ``;
                hourlyTemperatureElement.appendChild(myThermometerIcon); // Append the image element
                hourlyTemperatureElement.insertAdjacentHTML('beforeend', `${hourlyTemperature}°${currentTemperatureUnit}`);

                //chance of rain
                const myRainIcon = new Image();
                myRainIcon.src = rainIcon

                hourlyChanceOfRainElement.textContent = ``;
                hourlyChanceOfRainElement.appendChild(myRainIcon); // Append the image element
                hourlyChanceOfRainElement.insertAdjacentHTML('beforeend', `${next24HoursForecast[i].chance_of_rain}%`);

                //Only show precipitation if there is a chance of rain
                if (next24HoursForecast[i].chance_of_rain > 0) {
                    const myWaterIcon = new Image();
                    myWaterIcon.src = waterIcon;

                    //precipitation
                    hourlyPrecipitationElement.textContent = ``;
                    hourlyPrecipitationElement.appendChild(myWaterIcon); // Append the image element
                    hourlyPrecipitationElement.insertAdjacentHTML('beforeend', `${hourlyPrecipitation} ${currentDistanceUnit}`);
                }

                //wind
                const myWindIcon = new Image();
                myWindIcon.src = windIcon;

                hourlyWindElement.textContent = ``;
                hourlyWindElement.appendChild(myWindIcon); // Append the image element
                hourlyWindElement.insertAdjacentHTML('beforeend', `${hourlyWind} ${currentSpeedUnit} ${next24HoursForecast[i].wind_dir}`);

                //apend all the hourly elements to the hourlyForecastContainer
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
            //sunrise
            const mySunriseIcon = new Image();
            mySunriseIcon.src = sunriseIcon;

            const sunriseContainer = document.getElementById('sunriseId');
            sunriseContainer.textContent = ""; // Clear existing content
            sunriseContainer.appendChild(mySunriseIcon); // Append the water icon
            sunriseContainer.appendChild(document.createTextNode(`${forecast.forecastday[0].astro.sunrise}`)); // Append the precipitation text

            //sunset
            const mySunsetIcon = new Image();
            mySunsetIcon.src = sunsetIcon;

            const sunsetContainer = document.getElementById('sunsetId');
            sunsetContainer.textContent = ""; // Clear existing content
            sunsetContainer.appendChild(mySunsetIcon); // Append the water icon
            sunsetContainer.appendChild(document.createTextNode(`${forecast.forecastday[0].astro.sunset}`)); // Append the precipitation text
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

            //get current units
            const avgTempDay1 = currentTemperatureUnit === 'C' ?
            forecast.forecastday[1].day.avgtemp_c:
            forecast.forecastday[1].day.avgtemp_f;

            const maxTempDay1 = currentTemperatureUnit === 'C' ?
            forecast.forecastday[1].day.maxtemp_c:
            forecast.forecastday[1].day.maxtemp_f;

            const minTempDay1 = currentTemperatureUnit === 'C' ?
            forecast.forecastday[1].day.mintemp_c:
            forecast.forecastday[1].day.mintemp_f;

            //tomorrow's date
            document.getElementById("day1Date").textContent = 
            `${convertDate(forecast.forecastday[1].date)}`; 

            //tomorrow's temperature
            const myThermometerIcon2 = new Image();
            myThermometerIcon2.src = thermometerIcon;

            const temperatureContainer = document.getElementById('day1AvgTemperature');
            temperatureContainer.textContent = ``;
            temperatureContainer.appendChild(myThermometerIcon2); // Append the image element
            temperatureContainer.insertAdjacentHTML('beforeend', `${avgTempDay1}°${currentTemperatureUnit}`);

            //tomorrow's high temperature
            const myThermometerHighIcon = new Image();
            myThermometerHighIcon.src = thermometerHighIcon;

            const temperatureHighDay1Container = document.getElementById('day1MaxTemperature');
            temperatureHighDay1Container.textContent = ``;
            temperatureHighDay1Container.appendChild(myThermometerHighIcon); // Append the image element
            temperatureHighDay1Container.insertAdjacentHTML('beforeend', `${maxTempDay1}°${currentTemperatureUnit}`);

            //tomorrow's low temperature
            const myThermometerLowIcon = new Image();
            myThermometerLowIcon.src = thermometerLowIcon;

            const temperatureLowDay1Container = document.getElementById('day1MinTemperature');
            temperatureLowDay1Container.textContent = ``;
            temperatureLowDay1Container.appendChild(myThermometerLowIcon); // Append the image element
            temperatureLowDay1Container.insertAdjacentHTML('beforeend', `${minTempDay1}°${currentTemperatureUnit}`);

            //tomorrow's weather condition
            document.getElementById('day1Condition').textContent = 
            `${forecast.forecastday[1].day.condition.text}`;  

            //tomorrow's chance of rain
            const myRainIcon2 = new Image();
            myRainIcon2.src = rainIcon;

            const day1ChanceofRainContainer = document.getElementById('day1ChanceOfRain');
            day1ChanceofRainContainer.textContent = ""; // Clear existing content
            day1ChanceofRainContainer.appendChild(myRainIcon2); // Append the water icon
            day1ChanceofRainContainer.appendChild(document.createTextNode(`${forecast.forecastday[1].day.daily_chance_of_rain}%`)); // Append the precipitation text

            //get the next two day's weather condition icon from API
            const iconUrlDay1 = 'https:' + forecast.forecastday[1].day.condition.icon;
            const iconDay1Element = document.createElement('img');
            iconDay1Element.src = iconUrlDay1;
            
            document.getElementById("day1WeatherIconId").appendChild(iconDay1Element);
            
            const iconUrlDay2 = 'https:' + forecast.forecastday[2].day.condition.icon;
            const iconDay2Element = document.createElement('img');
            iconDay2Element.src = iconUrlDay2;

            document.getElementById("day2WeatherIconId").appendChild(iconDay2Element);
            
            //Repeat everything for day 2
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

            const myThermometerIcon3 = new Image();
            myThermometerIcon3.src = thermometerIcon;

            const temperatureDay2Container = document.getElementById('day2AvgTemperature');
            temperatureDay2Container.textContent = ``;
            temperatureDay2Container.appendChild(myThermometerIcon3); // Append the image element
            temperatureDay2Container.insertAdjacentHTML('beforeend', `${avgTempDay2}°${currentTemperatureUnit}`);

            const myThermometerHighIcon2 = new Image();
            myThermometerHighIcon2.src = thermometerHighIcon;

            const temperatureHighDay2Container = document.getElementById('day2MaxTemperature');
            temperatureHighDay2Container.textContent = ``;
            temperatureHighDay2Container.appendChild(myThermometerHighIcon2); // Append the image element
            temperatureHighDay2Container.insertAdjacentHTML('beforeend', `${maxTempDay2}°${currentTemperatureUnit}`);

            const myThermometerLowIcon2 = new Image();
            myThermometerLowIcon2.src = thermometerLowIcon;

            const temperatureLowDay2Container = document.getElementById('day2MinTemperature');
            temperatureLowDay2Container.textContent = ``;
            temperatureLowDay2Container.appendChild(myThermometerLowIcon2); // Append the image element
            temperatureLowDay2Container.insertAdjacentHTML('beforeend', `${minTempDay2}°${currentTemperatureUnit}`);

            //document.getElementById('day2MaxTemperature').textContent = 
            //`High: ${maxTempDay2}°${currentTemperatureUnit}`;  
//
            //document.getElementById('day2MinTemperature').textContent = 
            //`Low: ${minTempDay2}°${currentTemperatureUnit}`;  

            document.getElementById('day2Condition').textContent = 
            `${forecast.forecastday[2].day.condition.text}`;  

            const myRainIcon3 = new Image();
            myRainIcon3.src = rainIcon;

            const day2ChanceofRainContainer = document.getElementById('day2ChanceOfRain');
            day2ChanceofRainContainer.textContent = ""; // Clear existing content
            day2ChanceofRainContainer.appendChild(myRainIcon3); // Append the water icon
            day2ChanceofRainContainer.appendChild(document.createTextNode(`${forecast.forecastday[2].day.daily_chance_of_rain}%`)); // Append the precipitation text
        };
    });
}

function resetDOM() {
    const blank = "";
    //Reset everything in the event that the unit or location gets changed to acccess the API again
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
    //Create a form to allow users to input a location to observe its weather forecast
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
    //If the button gets clicked, all units will be converted from metric to imperial
    currentTemperatureUnit = currentTemperatureUnit === 'C' ? 'F' : 'C';
    currentDistanceUnit = currentDistanceUnit === 'mm' ? 'in' : 'mm';
    currentSpeedUnit = currentSpeedUnit === 'kph' ? 'mph' : 'kph';
    updateWeatherData();
});

async function updateWeatherData() {
    //Perform all the functions together to update the page with the correct information
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
    //The API provides the date in YYYY-MM-DD, so this will convert the date format
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