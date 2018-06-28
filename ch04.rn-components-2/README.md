# Chap 04. React Native 的組件 (2)

截至目前，我們使用的組件已經有：

- View
- Text
- TextInput
- Button
- ScrollView
- ListView
- Alert
- TouchableHighlight
- StatusBar
- RefreshControl
- Image
- Navigator
- TouchableOpacity

不過這些只是 React Native 廣大組件庫的 “冰山一角”，因此，本章來學習更多的組件使用情況。

本章主要內容有：

- 介紹更多 React Native 自帶的組件
- 學會使用第三方組件

## 只支持特定平台的組件

### 實現多頁面分頁 TabBarIOS / ViewPagerAndroid

只支持特定平台的組件，例如以下兩種。

- 只支持 iOS 的組件：DatePickerIOS、ImagePickerIOS、PickerIOS、ProgressViewIOS、SegmentedControlIOS 以及 TabBarIOS 等
- 只支持 Android 的組件：DrawerLayoutAndroid、ProgressBar、ToolbarAndroid 以及 ViewPagerAndroid 等

這裡以 TabBarIOS 和  ViewPagerAndroid 為例，雖然它們是支持不同平台的 React Native 組件，但是實現的功能是類似的，即實現多頁面分頁的效果

1. 新建 Main.ios.js 和 Main.android.js 兩個文件，給這兩個文件添加如下代碼：

```javascript
import React, {Component} from 'react';

import Home from './Home';

export default class Main extends Component<{}> {

  render() {
    return (
      <Home navigator={this.props.navigator} />
    )
  }

}
```

2. 將 App.js 文件的 home 組件替換成 main 組件。修改 App.js 代碼如下：

```javascript
import React, {Component} from 'react';
import {
  View
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import Main from "./Main";

export default class App extends Component<{}> {

  render() {
    return (
      <Navigator
        initialRoute={{
          name: 'main',
          component: Main
        }}
        configureScene={(route) => {
          return Navigator.SceneConfigs.FloatFromRight;
        }}
        renderScene={(route, navigator) => {
          const Component = route.component;
          return <Component {...route.params} navigator={navigator}/>
        }}
      />
    )
  }

}
```

這裡讀者可能會感到好奇，Main 組件的文件名不是 Main.ios.js 和 Main.android.js 嗎？React Native 如何正確找到 Main 組件？

原來 React Native 會自動檢測某個文件是否具有 .ios. 或是 .android. 的擴展名，然後根據當前運行的平台加載正確對應的文件。

這樣命名組件後就可以在其他組件中直接引用，而無需關心當前運行的平台是哪個平台。React
Native 會根據運行平台的不同引入正確對應的組件。

添加一個新的 ”更多“ 頁面，新建 more.js 文件並添加代碼如下：

```javascript
import React, {Component} from 'react';

import {StyleSheet, Text, View} from 'react-native';

export default class MyComponent extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          更多頁面
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20
  }
});
```

有了更多頁面，就很容易添加 TabBarIOS 組件了，修改 main.ios.js：

```javascript
import React, {Component} from 'react';
import {TabBarIOS} from "react-native";

import Home from './Home';
import More from "./More";


export default class Main extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'home'
    }
  }

  render() {
    return (
      <TabBarIOS unselectedTintColor="gray"
                 tintColor="white"
                 barTintColor="orange">
        <TabBarIOS.Item title="首頁"
                        icon={require('./images/icon-home.png')}
                        selected={this.state.selectedTab === 'home'}
                        onPress={() => {
                          this.setState({selectedTab: 'home'})
                        }}>
          <Home navigator={this.props.navigator}/>
        </TabBarIOS.Item>
        <TabBarIOS.Item systemIcon="more"
                        badge={2}
                        selected={this.state.selectedTab === 'more'}
                        onPress={() => {
                          this.setState({selectedTab: 'more'})
                        }}>
          <More navigator={this.props.navigator}/>
        </TabBarIOS.Item>
      </TabBarIOS>
    )
  }

}
```

接下來看看 viewPagerAndroid 組件的效果。修改 main.android.js：

```javascript
import React, {Component} from 'react';

import Home from './Home';
import {StyleSheet, View, ViewPagerAndroid} from "react-native";
import More from "./More";

export default class Main extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'home'
    }
  }

  render() {
    return (
      <ViewPagerAndroid style={styles.viewPager} initialPage={0}>
        <View style={styles.pageStyle}>
          <Home navigator={this.props.navigator} />
        </View>
        <View style={styles.pageStyle}>
          <More navigator={this.props.navigator}/>
        </View>
      </ViewPagerAndroid>
    )
  }

}

const styles = StyleSheet.create({
  viewPager: {
    flex: 1
  }
})
```

透過上述 TabBarIOS / ViewPagerAndroid 的例子，React Native 開發首先必須要考慮平台複用性，但是在一些情況下，針對不同平台仍然會有差異性的實現，在保證設計和邏輯儘可能複用的前提下，React Native 對於跨平台的開發成本相對於原生開發來說還是比較小的。

### 加載指示器 —— ActivityIndicator

ActivityIndicator 組件是一個加載指示器，俗稱 “轉菊花”。其實 RefreshControl 組件中就包含了 ActivityIndicator，這裏單獨添加 ActivityIndicator 看一下效果，修改 more.js 代碼如下：

```javascript
export default class MyComponent extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="purple" size="large"/>
      </View>
    );
  }
}
```

這裡要注意一下，ActivityIndicator 組件在不同平台的表現是不盡相同的。

### 地圖 —— MapView

地圖是應用中一個很常用的功能，React Native 為開發者提供了 MapView 組件來實現地圖功能。修改 more.js 如下：

```javascript
import React, {Component} from 'react';

import {StyleSheet, View, Dimensions} from 'react-native';
import MapView from "react-native-maps";
import {Marker} from 'react-native-maps';

export default class MyComponent extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      isFirstLoad: true,
      mapRegion: undefined,
      mapRegionInput: undefined,
      markers: []
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.map}
                 onRegionChange={this._onRegionChange}
                 onRegionChangeComplete={this._onRegionChangeComplete}
                 region={this.state.mapRegion}>
          {
            this.state.markers.map((marker, index) => (
              <Marker key={index} coordinate={marker.latlng}
                      title={marker.title}/>
            ))
          }
        </MapView>
      </View>
    );
  }

  _onRegionChange = (region) => {
    this.setState({mapRegionInput: region});
  };

  _onRegionChangeComplete = (region) => {
    if (this.state.isFirstLoad) {
      this.setState({
        mapRegionInput: region,
        markers: this._getMarkers(region),
        isFirstLoad: false
      });
    }
  };

  _getMarkers = (region) => {
    return [
      {
        latlng: {
          longitude: region.longitude,
          latitude: region.latitude
        },
        title: '你的位置'
      }
    ];
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});
```

- region 屬性用來設置顯示的地圖區域
- onRegionChange 是在位置發生改變時的回調，回調中包含了最新的位置信息，用於更新地圖
- 這裡使用 React Native 0.42 版本後 MapView 被廢棄的替代方案：react-native-maps

### 渲染 —— Picker

Picker 組件可在 iOS 和 Android 平台上渲染原生的選擇器 (Picker)。修改 more.js 代碼如下：

```javascript
import React, {Component} from 'react';
import {StyleSheet, View, Picker} from 'react-native';

export default class MyComponent extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      language: 'java'
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Picker style={styles.picker}
                selectedValue={this.state.language}
                onValueChange={(lang) => this.setState({language: lang})}>
          <Picker.Item label="Java" value="java"/>
          <Picker.Item label="JavaScript" value="javascript"/>
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  picker: {
    width: 200,
    height: 200
  }
});
```

Picker 組件在 iOS 和 Android 平台效果有所不同。

### 選擇範圍 —— Slider

Slider 是一個用於選擇範圍的組件，用法比較簡單。修改 more.js 代碼如下：

```javascript
import React, {Component} from 'react';
import {StyleSheet, View, Slider, Text} from 'react-native';

export default class MyComponent extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      sliderValue: 5
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Slider minimumValue={0}
                style={{width: 200}}
                step={1}
                maximumTrackTintColor="red"
                minimumTrackTintColor="blue"
                maximumValue={10}
                value={this.state.sliderValue}
                onValueChange={(value) => this.setState({sliderValue: value})}/>
        <Text>Slider 值：{this.state.sliderValue}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  picker: {
    width: 200,
    height: 200
  }
});
```

### 開關組件 —— Switch

Switch 是用來進行兩個狀態切換的組件，俗稱開關組件，下面代碼來看看 Switch 具體用法：

```javascript
import React, {Component} from 'react';
import {StyleSheet, View, Switch} from 'react-native';

export default class MyComponent extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      isOn: false
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Switch onTintColor="blue"
                thumbTintColor="green"
                tintColor="black"
                onValueChange={() => this.setState({isOn: !this.state.isOn})}
                value={this.state.isOn === true}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
```

### 打開網頁 —— WebView

WebView 就像一個簡單的手機瀏覽器，可用來打開網頁：

```javascript
import React, {Component} from 'react';
import {StyleSheet, View, Switch, WebView} from 'react-native';

export default class MyComponent extends Component<{}> {

  render() {
    return (
      <View style={styles.container}>
        <WebView source={{uri: 'https://sina.cn'}}
                 style={styles.web}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  web: {
    width: 200,
    height: 200
  }
});
```

## 第三方組件

React Native 提供大量的原生組件，但是為了進一步提升開發質量和效率，也可以用第三方組件，例如 react-native-maps 替代原生組件 MapView

這裡推薦兩個尋找優秀第三方組件的網站：

- GitHub
- JS.COACH

### react-native-swiper 的使用

對於輪播廣告，除了使用 React Native 自帶的 ScrollView 組件之外，就有一個優秀第三方替代方案 react-native-swiper。

安裝：

```shell
$ npm i react-native-swiper --save
```

home.js 代碼：

```javascript
import Swiper from 'react-native-swiper'

export default class Home extends Component<{}> {
  
  render() {
    return (
      <View style={styles.container}>
        {/* ... */}
        <View style={styles.advertisement}>
          <Swiper loop={true} height={190} autoplay={true}>
            {this.state.advertisements.map((advertisement, index) => {
              return (
                <TouchableHighlight key={index} onPress={() => Alert.alert('你單擊了輪播圖', null, null)}>
                  <Image style={styles.advertisementContent} source={advertisement.image}/>
                </TouchableHighlight>
              )
            })}
          </Swiper>
        </View>
        {/* ... */}
      </View>
    );
  }
  
}
```

要把定時器操作 ScrollView 相關的 code 拿掉，只要做簡單的配置 ("loop={true} autoplay={true}") 就可以達到效果。

### NativeBase 的使用

NativeBase 是一個優秀的 React Native 組件庫，它同時被微軟和 Awesome React Native 推薦，詳見 [https://github.com/GeekyAnts/NativeBase](https://github.com/GeekyAnts/NativeBase)。當然，在使用過後或許會發現，這哪裡僅僅是一個第三方組件，完全是一種要替代 React Native 原生 UI 組件的姿態。這裡就趕快來體驗一下吧：

```shell
$ yarn add native-base
```

由於 NativeBase 依賴於 react-native-vector-icons，所以還需要使用：

```shell
$ npm i react-native-vector-icons --save
```

P.S. 有時會發生第三包安裝的錯誤，可先停止 React Native 服務，然後再刪除 node_modules 文件夾，接著使用 npm install 重新安裝所有依賴庫，最後再運行 React Native 服務和應用。

下面就可以將原有的實現替換成 NativeBase 的相應組件了，這裡以首頁為例：

1. 首頁的佈局

按照 NativeBase 的 Header 和 Content 佈局方式調整首頁的佈局結構：NativeBase 的所有組件都是放在 Container 組件中的，其中，Header 是導航欄組件，Content 組件用於實現頁面正文。修改 home.js 如下：

```javascript
export default class Home extends Component<{}> {
  
  render() {
    return (
      <Container>
        <Header>
          <View style={styles.searchbar}>
            <TextInput style={styles.input} placeholder="搜索商品" onChangeText={(text) => {
              this.setState({searchText: text});
              console.log('輸入的內容是 ' + this.state.searchText);
            }}/>
            <Button style={styles.button} title="搜索"
                    onPress={() => Alert.alert('搜索內容 ' + this.state.searchText, null, null)}/>
          </View>
        </Header>
        <Content>
          <View style={styles.advertisement}>
            <Swiper loop={true} height={190} autoplay={true}>
              {this.state.advertisements.map((advertisement, index) => {
                return (
                  <TouchableHighlight key={index} onPress={() => Alert.alert('你單擊了輪播圖', null, null)}>
                    <Image style={styles.advertisementContent} source={advertisement.image}/>
                  </TouchableHighlight>
                )
              })}
            </Swiper>
          </View>
          <View style={styles.products}>
            <ListView dataSource={this.state.dataSource}
                      renderRow={this._renderRow}
                      renderSeparator={this._renderSeparator}
                      refreshControl={this._renderRefreshControl()}/>
          </View>
        </Content>
      </Container>
    );
  }
  
}
```

2. 搜索框的樣式

NativeBase 提供了一套組件，這套組件的功能和樣式是經過測試驗證的，但是 NativeBase 組件與其他組件的兼容性需要調整，為了解決上述問題，最高效的辦法就是使用 NativeBase 組件來實現搜索框，而非自己定義組件和佈局。想要使用 NativeBase 實現搜索框功能，只需要為 Header 組件添加 searchBar 屬性即可：

```javascript

```

