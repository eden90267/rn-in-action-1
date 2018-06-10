/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchbar}>
          <Text>
            搜索框
          </Text>
        </View>
        <View style={styles.advertisement}>
          <Text>
            輪播廣告
          </Text>
        </View>
        <View style={styles.products}>
          <Text>
            商品列表
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchbar: {
    marginTop: Platform.OS === 'ios'
    ? 20
    : 0,
    height: 40,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  },
  advertisement: {
    height: 180,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center'
  },
  products: {
    flex: 1,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
