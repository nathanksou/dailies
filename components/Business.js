import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Business = ({ business }) => {
  return (
    <View style={styles.container}>
      <Icon size={48} name={'food-fork-drink'} color={'#fff'} />
      <Button
        title={business.name}
        titleStyle={{
          color: "#fff",
          fontSize: 30,
        }}
        buttonStyle={{
          backgroundColor: "#E76F51",
        }}
        onPress={() => {
          Linking.openURL(business.url);
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
    backgroundColor: '#E76F51',
  },
  text: {
    color: '#fff',
    fontSize: 35,
  }
});

export default Business;