import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import WeatherService from './js/weather-service.js';

function clearFields() {
  $('#location').val("");
  $('.showErrors').text("");
  $('.showHumidity').text("");
  $('.showTemp').text("");
}

function kelvinToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(1)
}

function kelvinToFahrenheit(kelvin) {
  return (kelvinToCelsius(kelvin) * 9 / 5 + 32).toFixed(1)
}


function getElements(response) {
  if (response.main) {
    $('.showHumidity').text(`The humidity in ${response.name} is ${response.main.humidity}%`);
    $('.showK').text(`The temperature in Kelvins is ${response.main.temp} degrees.`);
    $('.showC').text(`The temperature in Celsius is ${kelvinToCelsius(response.main.temp)} degrees.`);
    $('.showF').text(`The temperature in Fahrenheit is ${kelvinToFahrenheit(response.main.temp)} degrees.`);
  } else {
    $('.showErrors').text(`There was an error processing your request: ${response.message}`);
  }
}

$(document).ready(function () {
  $('#weatherLocation').click(function () {
    let city = $('#location').val();
    clearFields();
    WeatherService.getWeather(city)
      .then(function (response) {
        getElements(response);
      });
  });
});