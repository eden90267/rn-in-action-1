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