const weather = document.querySelector('.container');

let location = "vancouver";
let currentWeatherURL = 'https://api.weatherapi.com/v1/current.json?key=9d73c117f8704d6c91f235638241604&q=' + location;
let forecastURL = 'https://api.weatherapi.com/v1/forecast.json?key=9d73c117f8704d6c91f235638241604&q=' + location + '&days=3'

async function getCurrentWeather() {
  try {
    const response = await fetch(currentWeatherURL, {mode: 'cors'});
    const weatherData = await response.json();
    console.log(weatherData);
  } catch (error) {
    console.log('Failed to fetch weather data:', error);
  };
};

async function getForecast() {
  try {
    const response = await fetch(forecastURL, {mode: 'cors'});
    const weatherData = await response.json();
    console.log(weatherData);
  } catch (error) {
    console.log('Failed to fetch weather data:', error);
  };
};

export {
    getCurrentWeather,
    getForecast,
}