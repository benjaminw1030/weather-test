import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import WeatherService from './services/weather-service.js';
import GiphyService from './services/giphy-service';

function clearFields() {
  $('#location').val("");
  $('.showErrors').text("");
  $('.showHumidity').text("");
  $('.showK').text("");
  $('.showC').text("");
  $('.showf').text("");
}

function kelvinToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(1)
}

function kelvinToFahrenheit(kelvin) {
  return (kelvinToCelsius(kelvin) * 9 / 5 + 32).toFixed(1)
}

function displayWeatherDescription(description) {
  $('.weather-description').text(`The weather is ${description}!`);
}

function displayGif(response) {
  const url = response.data[0].images.downsized.url;
  $('.show-gif').html(`<img src='${url}'>`);
}

function displayErrors(error) {
  $('.show-errors').text(`${error}`);
}

function getElements(response) {
  if (response.main) {
    $('.showHumidity').text(`The humidity in ${response.name} is ${response.main.humidity}%`);
    $('.showK').text(`The temperature in Kelvins is ${response.main.temp} degrees.`);
    $('.showC').text(`The temperature in Celsius is ${kelvinToCelsius(response.main.temp)} degrees.`);
    $('.showF').text(`The temperature in Fahrenheit is ${kelvinToFahrenheit(response.main.temp)} degrees.`);
  } else {
    $('.showErrors').text(`There was an error: ${response}`);
  }
}

$(document).ready(function () {
  $('#weatherLocation').click(function () {
    let city = $('#location').val();
    clearFields();
    WeatherService.getWeather(city)
      .then(function (weatherResponse) {
        if (weatherResponse instanceof Error) {
          throw Error(`OpenWeather API error: ${weatherResponse.message}`);
        }
        getElements(weatherResponse);
        const weatherDescription = weatherResponse.weather[0].description;
        displayWeatherDescription(weatherDescription);
        return GiphyService.getGif(weatherDescription);
      })
      .then(function (giphyResponse) {
        if (giphyResponse instanceof Error) {
          throw Error(`Giphy API error: ${giphyResponse.message}`);
        }
        displayGif(giphyResponse);
      })
      .catch(function (error) {
        displayErrors(error.message);
      });
  });
});