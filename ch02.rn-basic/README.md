# Chap 02. 全局解析 React Native 開發的基礎技術

## 開發具備的基礎知識說明

本書以典型的電商類移動應用為例，向讀者展示使用 React Native 設計、開發應用的全過程。

不過，在正式開發電商移動應用前，有必要先了解 React Native 開發的基礎知識：

- Git
- JSX
- Flexbox 佈局

  React Native 開發的佈局技術，是 UI 開發的核心

- 調試

  提高 React Native 開發效率的重要手段

### Git 版本控制工具

用於存儲、追蹤目錄 (文件夾) 和文件的修改歷史

git 請自行官網下載

#### 常用指令

- git init
- git add .
- git commit -m "Create test.file"
- git log
- git clone https://github.com/facebook/react-native
- git pull
- git push
- git status
- git diff
- git branch
- git tag

如果對 Git 命令不熟悉，可使用 SourceTree or Tower 等 GUI 工具。

## JSX

一種可以在 JavaScript 代碼中直接書寫 HTML 標籤的語法糖

React / React Native 開發，雖不一定要使用 JSX，JavaScript
也可進行開發，但，強烈建議使用 JSX！因為極大提高開發和維護的效率。

## Flexbox 佈局

無論是移動平台還是 Web 前端開發，佈局技術都是必不可少的。

Flexbox 旨在提供一個更加有效的方式制定、調整和分佈一個容器裡的項目佈局。即使大小是未知且動態。Flexbox
佈局主要思想是讓容器有能力讓其子項目能夠改變其寬度、高度甚至順序，以最佳方式填充可用空間 (主要是為了適應所有類型的顯示設備和屏幕大小)。

目前，主流瀏覽器都已經很好地支持 Flexbox 佈局。

React Native 實現了 Flexbox 佈局的大部分功能，並且在實際應用開發中也使用
Flexbox 來實現佈局。這不僅使 React Native 的 UI 開發變得更加簡單，還很好解決了
iOS、Android 等屏幕適配的問題。

> Top! 注意 React Native 與 Web 的 Flexbox
> 基本一致但有少許差異，例如，默認值不同，React Native 中 flexDirection
> 屬性的默認是 column，alignItems 默認是 stretch 而不是
> flex-start，另外，flex 只能指定一個數字值。

這裡簡單介紹 React Native 開發中 Flexbox 佈局的使用。

Flexbox 佈局所使用的屬性，簡單來說，可以分成以下兩個。

- 決定子組件排列規則的屬性：flexDirection、flexWrap、justifyContent 以及 alignItems 等
- 決定組件自身顯示規則的屬性：alignSelf 以及 flex 等

下面分別簡單介紹這些屬性：

### flexDirection 設置組件的排列

flexDirection 屬性表明組件中子組件的排列方向，取值有 column (default)、row 以及 row-reverse。

### flexWrap 設置是否換行

flexWrap 屬性表明子組件 “溢出” 父組件是否進行換行，取值有 nowrap (default)、wrap 以及 wrap-reverse。

### justifyContent 設置橫向排列位置

justifyContent 屬性表明組件中子組件橫向排列在其父容器的哪個位置，取值有 flex-start、flex-end、center、space-between 以及 space-around。

### alignItems 設置縱向排列位置

alignItems 屬性表明組件中子組件縱向排列在其父容器的哪個位置，取值有 flex-start、flex-end、center、baseline 以及 stretch。

### alignSelf 設置特定組件的排列

alignSelf 屬性表明某個特定組件的排列情況，取值有 auto、flex-start、flex-end、center、stretch。

### flex 設置組件所占空間

flex 屬性可以讓組件動態計算和配置自己所佔用的空間大小，取值是數值。

flex 屬性使用是如此簡單，但表現力卻非常強大，它是 Flexbox 佈局實現自適應設備和屏幕尺寸的核心，讀者需要在後面的 React Native 開發中逐步熟練掌握 flex 屬性的使用。

## 如何調適 React Native 項目

- Debug JS Remotely

  啟動後就會自動打開 Chrome 瀏覽器作為調試工具

  可利用斷點來調適，查看更多相關信息。

## 實戰——設計一個電商 App

### 電商 App 的模組劃分

```shell
$ react-native init ch02
$ cd ch02
$ react-native run-ios
```

復用 app.js 的設計 (index.ios.js 與 index.android.js 整合)

```javascript
// App.js
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
```

> P.S. 筆者使用 0.51.0 的 react-native 版本，已經將此兩檔案結合成 App.js。

就 React Native 開發來說，開發一般流程：

1. 需求

  需求分析 -> 需求設計

2. 設計

  概要設計 -> 詳細設計

3. 開發

  編寫代碼 -> 測試

4. 上線

  發布 -> 更新

> Top! 上述開發流程是基於傳統的
> “瀑布流”，雖是較傳統的開發流程，但當今軟體開發流行的 “敏捷開發” 和 “快速迭代”
> 仍然是基於 “瀑布流” 的，所以了解和熟悉 “瀑布流” 軟體開發流程仍然很有必要。

### 設計首頁佈局

- 狀態欄：顯示設備網絡、時間、電量等信息
- 搜索框：搜索輸入框和按鈕，用於搜索商品
- 輪播廣告：循環播放廣告和推薦訊息
- 商品列表：展示所有商品列表

修改 app.js 文件的代碼如下：

```javascript
// App.js
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
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
    marginTop: 20,
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
```

> 注意：因為狀態欄比較特殊，所以這裡沒有明確配置狀態欄，而使用了默認配置。更多關於狀態欄的使用和詳細配置，將在之後節次詳細介紹。

- 商品列表高度的需求應該是除狀態欄、搜索欄、輪播廣告之外屏幕剩餘的高度，解決辦法就是：
  `flex: 1`

Android App 顯示有點小問題，搜索框跟狀態欄之間空出了一塊區域！

默認情況下，iOS
平台內容顯示區域是從屏幕頂部開始的，為了不和狀態欄重疊，代碼中添加了 `marginTop:
20`；而 Android 平台內容顯示區域預設就是不包括狀態欄的，所以就空出這塊區域。

可用 Platform 來判斷當前運行系統。Platform.OS 在 iOS 系統上會返回
ios。Android 則返回 android。所以可在不同平台上設置不同 marginTop：

```javascript
// App.js
// ...
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
  // ...
});
```

### 實現搜索欄

```javascript
// App.js
export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchbar}>
          <TextInput style={styles.input} placeholder="搜索商品"/>
          <Button style={styles.button} title="搜索" onPress={f => f}/>
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
  // ...
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
  // ...
});
```

### 設計輪播廣告

React Native 提供的 ScrollView 和 ViewPager 組件都可以實現輪播廣告的效果。但是 ViewPager 是 Android 平台特有的組件，為了考慮平台兼容性和代碼復用性，這裡使用 ScrollView 來實現輪播效果。

> 小知識：從組件命名的後綴可以看出哪些組件是哪個平台特有的： XxxIOS、XxxAndroid 等

1. ScrollView 的使用

```javascript
// App.js
export default class App extends Component<{}> {
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
              width: 100,
              height: 180,
              backgroundColor: 'gray'
            }}>廣告 1</Text>
            <Text style={{
              width: 100,
              height: 180,
              backgroundColor: 'orange'
            }}>廣告 2</Text>
            <Text style={{
              width: 100,
              height: 180,
              backgroundColor: 'yellow'
            }}>廣告 3</Text>
          </ScrollView>
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
  // ...
  advertisement: {
    height: 180
  },
  // ...
});
```

2. 完善輪播廣告

設置每一個廣告頁的寬度為屏幕寬度。

同樣，React Native 已經提供了 API：Dimensions 來獲取屏幕的寬高。

將 Text 組件的寬度從 `width: 100` 修改成 `width: Dimensions.get('window').width`：

```javascript
// App.js
export default class App extends Component<{}> {
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
          <Text>
            商品列表
          </Text>
        </View>
      </View>
    );
  }
}
```

3. 讓輪播廣告動起來

```javascript
export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0
    };
  }
  
  render() {
    // ...
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
```

### 展示商品列表

可使用 Reaact Native 提供的 ListView 組件。

ListView 組件是 React Native 開發中常用的組件，也是 React Native 最核心的組件之一，主要用來高效顯示一個可以垂直滾動變化的數據列表。

```javascript
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
        {/* ... */}
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

  // ...
}

const styles = StyleSheet.create({
  // ...
  products: {
    flex: 1,
  },
  row: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
```

使用 ListView 組件必須實現以下兩個屬性：

- dataSource：ListView 組建的數據源。這裏使用 state 來保存數據。提供給數據源的 rowHasChanged() 函數告訴 ListView 組件是否需要重繪某一列，即該列數據發生變化時對該列進行重繪。
- renderRow()：該函數根據數據源中每一條數據，返回列表每一行顯示的組件。它的函數原型：`(rowData, sectionID, rowID) => renderable`

後面還將介紹更多 ListView 的屬性和用法。
