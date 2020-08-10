import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const News = ({ news }) => {
  return (
    <View style={styles.container}>
      <Icon size={48} name={'newspaper'} color={'#fff'} />
      <Button
        title={`${news.title}`}
        titleStyle={{
          color: "#fff",
          fontSize: 30,
        }}
        buttonStyle={{
          backgroundColor: "#264653",
        }}
        onPress={() => {
          Linking.openURL(news.url);
        }}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#264653',
    paddingLeft: 25,
    paddingRight: 25
  },
  text: {
    color: '#fff',
    fontSize: 30,
  }
});

export default News;