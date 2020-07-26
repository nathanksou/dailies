import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Weather from './components/Weather.js';
import WEATHER_API_KEY from './utils/WeatherApiKey.js';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [temperature, setTemperature] = useState(0);
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeather = (lat = 25, lon = 25) => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`)
      .then(result => result.json())
      .then(json => {
        setTemperature(json.main.temp);
        setWeatherCondition(json.weather[0].main);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      error => {
        setError('Error Getting Weather Conditions');
      }
    );
  });

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Fetching The Weather</Text>
      ) : (
        <Weather temperature={temperature} weather={weatherCondition} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});

export default App;
