import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Quote = ({ quote }) => {
  return (
    <View style={styles.container}>
      <Icon size={48} name={'format-quote-close'} color={'#fff'} />
      <Text style={styles.text}>{quote.message}</Text>
      <Text style={styles.text}>By {quote.author}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#f4a261',
    paddingLeft: 25,
    paddingRight: 25,
  },
  text: {
    color: '#fff',
    fontSize: 30,
  }
});

export default Quote;