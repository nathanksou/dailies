import React, { useState }from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const App = () => {
  const [location, setLocation] = useState(null);
  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const coordinates = JSON.stringify(position);
        setLocation(coordinates);
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={findCoordinates}>
        <Text style={styles.welcome}>Find My Coords?</Text>
        <Text>Location: {location}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
});

export default App;