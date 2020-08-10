import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import weatherConditions from '../utils/WeatherConditions.js'

const Weather = ({ temperature, weather }) => {
  return (
    <View style={styles.container}>
      <Icon size={48} name={weatherConditions[weather].icon} color={'#fff'} />
      <Text style={styles.text}>{weatherConditions[weather].title}</Text>
      <Text style={styles.text}>{temperature}˚</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9c46a',
  },
  text: {
    color: '#fff',
    fontSize: 35,
  }
});

export default Weather;
