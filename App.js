import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import Weather from './components/Weather.js';
import Quote from './components/Quote.js';
import Business from './components/Business.js'

import WEATHER_API_KEY from './utils/WeatherApiKey.js';
import YELP_API_KEY from './utils/YelpApiKey.js';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [temperature, setTemperature] = useState(0);
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [business, setBusiness] = useState({ name: '', image_url: '', url: '' });
  const [error, setError] = useState(null);

  const fetchWeather = (lat = 25, lon = 25) => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`)
      .then(response => response.json())
      .then(json => {
        setTemperature(json.main.temp);
        setWeatherCondition(json.weather[0].main);
        setIsLoading(false);
      });
  };

  const fetchQuote = () => {
    fetch(`http://quotes.rest/qod`)
      .then(response => response.json())
      .then(json => {
        setQuote(json.contents.quotes[0].quote);
        setAuthor(json.contents.quotes[0].author);
      });
  };
  const fetchBusiness = (lat = 25, lon = 25) => {
    fetch(`https://api.yelp.com/v3/businesses/search?term=coffee&latitude=${lat}&longitude=${lon}&limit=1`, {
      headers: new Headers({
        'Authorization': 'Bearer ' + YELP_API_KEY
      })
    })
      .then(response => response.json())
      .then(json => {
        setBusiness({
          name: json.businesses[0].name,
          image_url: json.businesses[0].image_url,
          url: json.businesses[0].url
        });
      });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
        fetchQuote();
        fetchBusiness(position.coords.latitude, position.coords.longitude);
      },
      error => {
        setError('Error Getting Weather Conditions');
      }
    );
  }, []);

  return (
    <Swiper style={styles.wrapper}>
      <View style={styles.container}>
        {isLoading ? (
          <Text>Fetching The Weather</Text>
        ) : (
          <Weather temperature={temperature} weather={weatherCondition} />
        )}
      </View>
      <View style={styles.container}>
        <Quote quote={quote} author={author} />
      </View>
      <View style={styles.container}>
        <Business business={business} />
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapper: {}
});

export default App;
