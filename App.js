import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Weather from './components/Weather.js';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Fetching The Weather</Text>
      ) : (
        // <Text>Minimalist The Weather</Text>
        <Weather />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  }
});

export default App;
