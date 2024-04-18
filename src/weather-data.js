const weather = document.querySelector('.container');

let location = "vancouver";
let currentWeatherURL = 'https://api.weatherapi.com/v1/current.json?key=9d73c117f8704d6c91f235638241604&q=' + location;
let forecastURL = 'https://api.weatherapi.com/v1/forecast.json?key=9d73c117f8704d6c91f235638241604&q=' + location + '&days=3'
let cachedCurrentWeatherData = null;
let cachedForecastData = null;

async function getCurrentWeather() {
  if (cachedCurrentWeatherData !== null) return cachedCurrentWeatherData;
  try {
    const response = await fetch(currentWeatherURL, {mode: 'cors'});
    const weatherData = await response.json();
    console.log(weatherData);
    cachedCurrentWeatherData = weatherData;
    return weatherData
  } catch (error) {
    console.log('Failed to fetch weather data:', error);
  };
};

async function getForecast() {
  if (cachedForecastData !== null) return cachedForecastData; 
  try {
    const response = await fetch(forecastURL, {mode: 'cors'});
    const weatherData = await response.json();
    cachedForecastData = weatherData;
    console.log(weatherData);
  } catch (error) {
    console.log('Failed to fetch weather data:', error);
  };
};

//async function getLocationData() {
//    try {
//        const data = await getCurrentWeather();
//        console.log("Forecast location", data.location.name);
//    } catch (error) {
//        console.error("Error handling in calling function", error);
//    };
//   };

export {
    getCurrentWeather,
    getForecast
}
 //   getLocationData
//}