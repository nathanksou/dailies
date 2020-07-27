import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import Weather from './components/Weather.js';
import WEATHER_API_KEY from './utils/WeatherApiKey.js';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [temperature, setTemperature] = useState(0);
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState(null);

  const fetchWeather = (lat = 25, lon = 25) => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`)
      .then(result => result.json())
      .then(json => {
        setTemperature(json.main.temp);
        setWeatherCondition(json.weather[0].main);
        setIsLoading(false);
      });
  };

  const fetchQuote = () => {
    fetch(`http://quotes.rest/qod`)
      .then(result => result.json())
      .then(json => {
        setQuote(json.contents.quotes[0].quote);
        setAuthor(json.contents.quotes[0].author);
      });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
        fetchQuote();
      },
      error => {
        setError('Error Getting Weather Conditions');
      }
    );
  });

  return (
    <Swiper style={styles.wrapper}>
      <View style={styles.container}>
        {isLoading ? (
          <Text>Fetching The Weather</Text>
        ) : (
          <Weather temperature={temperature} weather={weatherCondition} />
        )}
      </View>
      <View style={styles.slide2}>
        <Text style={styles.text}>{quote}</Text>
        <Text style={styles.text}>By {author}</Text>
      </View>
      <View style={styles.slide3}>
        <Text style={styles.text}>And simple</Text>
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
});

export default App;
