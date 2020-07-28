import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import config from './utils/config.js';
import Weather from './components/Weather.js';
import Quote from './components/Quote.js';
import Business from './components/Business.js';
import News from './components/News.js';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [temperature, setTemperature] = useState(0);
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [quote, setQuote] = useState({ message: '', author: ''});
  const [business, setBusiness] = useState({ name: '', image_url: '', url: '' });
  const [news, setNews] = useState({ source: '', title: '', author: '', description: '', url: '', urlToImage: '' });
  const [error, setError] = useState(null);

  const fetchWeather = (lat = 25, lon = 25) => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.WEATHER_API_KEY}&units=imperial`)
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
        setQuote({
          message: json.contents.quotes[0].quote,
          author: json.contents.quotes[0].author
        });
      });
  };

  const fetchBusiness = (lat = 25, lon = 25) => {
    fetch(`https://api.yelp.com/v3/businesses/search?term=coffee&latitude=${lat}&longitude=${lon}&limit=1`, {
      headers: new Headers({
        'Authorization': 'Bearer ' + config.YELP_API_KEY
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

  const fetchNews = (lat = 25, lon = 25) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${config.GOOGLE_API_KEY}&result_type=country`)
      .then(response => response.json())
      .then(json => {
        const country = json.results[0].address_components[0].short_name.toLowerCase();
        fetch(`https://newsapi.org/v2/top-headlines?country=${country}`, {
          headers: new Headers({
            'Authorization': config.NEWS_API_KEY
          })
        })
          .then(response => response.json())
          .then(json => {
            setNews({
              source: json.articles[0].source.name,
              author: json.articles[0].author,
              title: json.articles[0].title,
              description: json.articles[0].description,
              url: json.articles[0].url,
              urlToImage: json.articles[0].urlToImage
            });
          });
      });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
        fetchQuote();
        fetchBusiness(position.coords.latitude, position.coords.longitude);
        fetchNews(position.coords.latitude, position.coords.longitude);
      },
      error => {
        setError('Error Fetching Data');
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
        <Quote quote={quote} />
      </View>
      <View style={styles.container}>
        <Business business={business} />
      </View>
      <View style={styles.container}>
        <News news={news} />
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
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
});

export default App;
