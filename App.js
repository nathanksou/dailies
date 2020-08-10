import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Linking, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import { firebaseConfig } from './utils/firebase.js';
import config from './utils/config.js';
import Weather from './components/Weather.js';
import Quote from './components/Quote.js';
import Business from './components/Business.js';
import News from './components/News.js';

firebase.initializeApp(firebaseConfig);

const HomeScreen = () => {
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
        fetchBusiness(position.coords.latitude, position.coords.longitude);
        fetchNews(position.coords.latitude, position.coords.longitude);
      },
      error => {
        setError('Error Fetching Data');
      }
    );
    fetchQuote();
  }, []);

  return (
    <Swiper style={styles.wrapper} activeDotColor="#fff">
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Icon size={48} name={'balloon'} color={'#fff'} />
          <Text style={styles.text}>Welcome back, Nate!</Text>
        </View>
      </View>
      <View style={styles.container}>
        <Quote quote={quote} />
      </View>
      <View style={styles.container}>
          <Weather temperature={temperature} weather={weatherCondition} />
      </View>
      <View style={styles.container}>
        <News news={news} />
      </View>
      <View style={styles.container}>
        <Business business={business} />
      </View>
    </Swiper>
  );
};

const LoginScreen = ({ navigation }) => {
  const isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          return true;
        }
      }
    }
    return false;
  }

  const onSignIn = googleUser => {
    var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
      unsubscribe();
      if (!isUserEqual(googleUser, firebaseUser)) {
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken, googleUser.accessToken);
        firebase.auth().signInWithCredential(credential)
        .then(function(result) {
          if (result.additionalUserInfo.isNewUser) {
            firebase.database().ref('/users/' + result.user.uid)
            .set({
              gmail: result.user.email,
              profile_picture: result.additionalUserInfo.profile.picture,
              locale: result.additionalUserInfo.profile.locale,
              first_name: result.additionalUserInfo.profile.given_name,
              created_at: Date.now()
            })
          } else {
            firebase.database().ref('/users/' + result.user.uid)
            .update({
              last_logged_in: Date.now()
            })
          }
        })
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
        });
      }
    });
  }

  const signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        iosClientId: config.GOOGLE_IOS_CLIENT_ID,
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Login"
        onPress={() => signInWithGoogleAsync()}
      />
    </View>
  );
}

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    checkIfLoggedIn();
  },[])

  const checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        navigation.navigate('Home')
      } else {
        navigation.navigate('Login')
      }
    })
  }

  return (
    <View style={styles.container}></View>
  )
}

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ title: 'Loading', headerLeft: () => (<View></View>) }}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Your Dailies', headerLeft: () => (<View></View>) }}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login', headerLeft: () => (<View></View>) }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a9d8f',
  },
  text: {
    color: '#fff',
    fontSize: 30,
  }
});

export default App;
