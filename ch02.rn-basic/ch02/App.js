/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  Button,
  Platform, ScrollView,
  StyleSheet,
  Text, TextInput,
  View,
  Dimensions,
  ListView
} from 'react-native';

const ds = new ListView.DataSource({ // 創建 ListView.DataSource 數據源
  rowHasChanged: (r1, r2) => r1 !== r2
});

export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      dataSource: ds.cloneWithRows([ // 為數據源傳遞一個數組
        '商品 1',
        '商品 2',
        '商品 3',
        '商品 4',
        '商品 5',
        '商品 6',
        '商品 7',
        '商品 8',
        '商品 9',
        '商品 10',
      ])
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchbar}>
          <TextInput style={styles.input} placeholder="搜索商品"/>
          <Button style={styles.button} title="搜索" onPress={f => f}/>
        </View>
        <View style={styles.advertisement}>
          <ScrollView ref="scrollView"
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      pagingEnabled={true}>
            <Text style={{
              width: Dimensions.get('window').width,
              height: 180,
              backgroundColor: 'gray'
            }}>廣告 1</Text>
            <Text style={{
              width: Dimensions.get('window').width,
              height: 180,
              backgroundColor: 'orange'
            }}>廣告 2</Text>
            <Text style={{
              width: Dimensions.get('window').width,
              height: 180,
              backgroundColor: 'yellow'
            }}>廣告 3</Text>
          </ScrollView>
        </View>
        <View style={styles.products}>
          <ListView dataSource={this.state.dataSource} renderRow={this._renderRow}/>
        </View>
      </View>
    );
  }

  _renderRow = (rowData, sectionID, rowID) => {
    return (
      <View style={styles.row}>
        <Text>{rowData}</Text>
      </View>
    )
  }

  componentDidMount() {
    this._startTimer();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  _startTimer() {
    this.interval = setInterval(() => {
      let nextPage = this.state.currentPage + 1;
      if (nextPage >= 3) {
        nextPage = 0;
      }
      this.setState({currentPage: nextPage});
      const offsetX = nextPage * Dimensions.get('window').width; // 計算 ScrollView 滾動的 X 軸偏移量 (因為是橫向滾動)
      this.refs.scrollView.scrollResponderScrollTo({x: offsetX, y: 0, animated: true});
    }, 2000);
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
    flexDirection: 'row'
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 2
  },
  button: {
    flex: 1
  },
  advertisement: {
    height: 180
  },
  products: {
    flex: 1,
  },
  row: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
