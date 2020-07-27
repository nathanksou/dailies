import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Quote = ({ quote, author }) => {
  return (
    <View style={styles.slide}>
      <Text style={styles.text}>{quote}</Text>
      <Text style={styles.text}>By {author}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
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

export default Quote;