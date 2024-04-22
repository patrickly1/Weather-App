const weather = document.querySelector('.container');

async function getCurrentWeather(location) {
  const currentWeatherURL = 'https://api.weatherapi.com/v1/current.json?key=9d73c117f8704d6c91f235638241604&q=' + location;  

  try {
    const response = await fetch(currentWeatherURL, {mode: 'cors'});
    const weatherData = await response.json();
    console.log(weatherData, currentWeatherURL);
    return weatherData
  } catch (error) {
    console.log('Failed to fetch weather data:', error);
  };
};

async function getForecast(location) {
  const forecastURL = forecastURL = `https://api.weatherapi.com/v1/forecast.json?key=9d73c117f8704d6c91f235638241604&q=${location}&days=3`; 
  
  try {
    const response = await fetch(forecastURL, {mode: 'cors'});
    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.log('Failed to fetch weather data:', error);
  };
};

export {
    getCurrentWeather,
    getForecast
}