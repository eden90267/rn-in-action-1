# Chap 03. React Native 的組件 (1)

## 創建新的電商 App

### 移植舊電商項目

若要進行 index.ios.js、index.android.js 與 app.js 移值，要注意註冊名稱必須與 react-native 命令行工具生成的應用名稱相符

```javascript
AppRegistry.registerComponent('ECApp', () => App);
```

iOS 的 AppDelegate.m 文件：

```objective-c
RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                    moduleName:@"ECApp"
                                             initialProperties:nil
                                                 launchOptions:launchOptions];
```

android 的 MainActivity.java 文件：

```java
public class MainActivity extends ReactActivity {

    @Override
    protected String getMainComponentName() {
        return "ECApp";
    }
}
```

> Top! 通常情況下不需要修改原生代碼，只要簡單瞭解即可。

### 重構現有的代碼

只有不斷地重構然後添加新功能，代碼的可維護性才會越好，這也是應用穩定性和擴展性的重要保證。

現在 App.js 代碼，ScrollView 組件下所有子組件的樣式都是類似的，導致很多冗余代碼：

```javascript
// app.js
export default class App extends Component<{}> {
  
  // ...

  render() {
    return (
      <View style={styles.container}>
        {/* ... */}
        <View style={styles.advertisement}>
          <ScrollView ref="scrollView"
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      pagingEnabled={true}>
            <TouchableHighlight onPress={() => Alert.alert('你單擊了輪播圖', null, null)}>
              <Text style={{
                width: Dimensions.get('window').width,
                height: 180,
                backgroundColor: 'gray'
              }}>廣告 1</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => Alert.alert('你單擊了輪播圖', null, null)}>
              <Text style={{
                width: Dimensions.get('window').width,
                height: 180,
                backgroundColor: 'orange'
              }}>廣告 2</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => Alert.alert('你單擊了輪播圖', null, null)}>
              <Text style={{
                width: Dimensions.get('window').width,
                height: 180,
                backgroundColor: 'yellow'
              }}>廣告 3</Text>
            </TouchableHighlight>
          </ScrollView>
        </View>
        {/* ... */}
      </View>
    );
  }

  // ...
}
```

如果想要更新輪播廣告高度，要修改多處代碼 `height: 180`。可嘗試將重複的樣式代碼抽離出來：

```javascript
// app.js
export default class App extends Component<{}> {
  
  // ...

  render() {
    return (
      <View style={styles.container}>
        {/* ... */}
        <View style={styles.advertisement}>
          <ScrollView ref="scrollView"
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      pagingEnabled={true}>
            <TouchableHighlight onPress={() => Alert.alert('你單擊了輪播圖', null, null)}>
              <Text style={[
                styles.advertisementContent, {
                  backgroundColor: 'gray'
                }
              ]}>廣告 1</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => Alert.alert('你單擊了輪播圖', null, null)}>
              <Text style={[
                styles.advertisementContent, {
                  backgroundColor: 'orange'
                }
              ]}>廣告 2</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => Alert.alert('你單擊了輪播圖', null, null)}>
              <Text style={[
                styles.advertisementContent, {
                  backgroundColor: 'yellow'
                }
              ]}>廣告 3</Text>
            </TouchableHighlight>
          </ScrollView>
        </View>
        {/* ... */}
      </View>
    );
  }

  _renderRow = (rowData, sectionID, rowID) => {
    return (
      <TouchableHighlight onPress={() => Alert.alert('你單擊了商品列表', null, null)}>
        <View style={styles.row}>
          <Text>{rowData}</Text>
        </View>
      </TouchableHighlight>
    )
  }
  
}

const styles = StyleSheet.create({
  // ...
  advertisementContent: {
    width: Dimensions.get('window').width,
    height: 180
  },
  // ...
});
```

再來做 TouchableHighlight 組件和單擊事件重複的優化：

```javascript
// app.js
export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      // ...
      advertisements: [ // 輪播廣告陣列
        {
          title: '廣告 1',
          backgroundColor: 'gray'
        },
        {
          title: '廣告 2',
          backgroundColor: 'orange'
        },
        {
          title: '廣告 2',
          backgroundColor: 'yellow'
        }
      ]
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {/* ... */}
        <View style={styles.advertisement}>
          <ScrollView ref="scrollView"
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      pagingEnabled={true}>
            {this.state.advertisements.map((advertisement, index) => {
              return (
                <TouchableHighlight key={index} onPress={() => Alert.alert('你單擊了輪播圖', null, null)}>
                  <Text style={[
                    styles.advertisementContent,
                    {backgroundColor: advertisement.backgroundColor}
                  ]}>{advertisement.title}</Text>
                </TouchableHighlight>
              );
            })}
          </ScrollView>
        </View>
        {/* ... */}
      </View>
    );
  }

  _renderRow = (rowData, sectionID, rowID) => {
    return (
      <TouchableHighlight onPress={() => Alert.alert('你單擊了商品列表', null, null)}>
        <View style={styles.row}>
          <Text>{rowData}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  // ...
}
```

## 完善搜索框功能 —— TextInput 組件

可使用 TextInput 組件的 onChangeText() 方法。當輸入框內容變化會調用此回調函數，改變後的文本內容作為參數傳遞，然後使用 this.state.searchText 保存此時的輸入結果。代碼如下：

```javascript
// app.js
export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      // ...
      searchText: '',
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {/* ... */}
        <View style={styles.searchbar}>
          <TextInput style={styles.input} placeholder="搜索商品" onChangeText={(text) => {
            this.setState({searchText: text});
          }}/>
          <Button style={styles.button} title="搜索" onPress={() => Alert.alert('搜索內容 ' + this.state.searchText, null, null)}/>
        </View>
        {/* ... */}
      </View>
    );
  }

  // ...
}
```

### 調試搜索結果

除了使用提示框查看搜索內容的方法之外，這裡再介紹另一種高效的調適方法：console.log，代碼如下：

```javascript
// app.js
export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      // ...
      searchText: '',
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {/* ... */}
        <View style={styles.searchbar}>
          <TextInput style={styles.input} placeholder="搜索商品" onChangeText={(text) => {
            this.setState({searchText: text});
            console.log('輸入的內容是 ' + this.state.searchText);
          }}/>
          <Button style={styles.button} title="搜索" onPress={() => Alert.alert('搜索內容 ' + this.state.searchText, null, null)}/>
        </View>
        {/* ... */}
      </View>
    );
  }

  // ...
}
```

然後打開調試選項 Debug JS Remotely，選擇 Chrome Browser 的 Console 即可看到效果。

### 優化搜索框樣式

將輸入框邊角帶有一定弧度：

```javascript
const styles = StyleSheet.create({
  // ...
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 10
  },
  // ...
});
```

## 完善輪播廣告 —— Image 組件

Image 組件可顯示多種不同類型圖片，包括：

- 網絡圖片
- 靜態資源
- 臨時的本地圖片
- 本地磁盤上的圖片

### 使用網絡圖片

```javascript
// app.js
export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      // ...
      advertisements: [ // 輪播廣告陣列
        {
          url: 'https://raw.githubusercontent.com/eden90267/learnreactnative-sourcecode/master/ch04/ch04/images/advertisement-image-01.jpg'
        },
        {
          url: 'https://raw.githubusercontent.com/eden90267/learnreactnative-sourcecode/master/ch04/ch04/images/advertisement-image-02.jpg'
        },
        {
          url: 'https://raw.githubusercontent.com/eden90267/learnreactnative-sourcecode/master/ch04/ch04/images/advertisement-image-03.jpg'
        }
      ],
      // ...
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {/* ... */}
        <View style={styles.advertisement}>
          <ScrollView ref="scrollView"
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      pagingEnabled={true}>
            {this.state.advertisements.map((advertisement, index) => {
              return (
                <TouchableHighlight key={index} onPress={() => Alert.alert('你單擊了輪播圖', null, null)}>
                  <Image style={styles.advertisementContent} source={{uri: advertisement.url}}/>
                </TouchableHighlight>
              );
            })}
          </ScrollView>
        </View>
        {/* ... */}
      </View>
    );
  }
}
```

### 使用本地圖片

引用本地圖片可以直接設置 Image 組件的 source 屬性，圖片透過 require 方式加載，修改後代碼：

```javascript
// app.js
export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      // ...
      advertisements: [ // 輪播廣告陣列
        {
          image: require('./images/advertisement-image-01.jpg')
        },
        {
          image: require('./images/advertisement-image-02.jpg')
        },
        {
          image: require('./images/advertisement-image-03.jpg')
        }
      ],
      // ...
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {/* ... */}
        <View style={styles.advertisement}>
          <ScrollView ref="scrollView"
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      pagingEnabled={true}>
            {this.state.advertisements.map((advertisement, index) => {
              return (
                <TouchableHighlight key={index} onPress={() => Alert.alert('你單擊了輪播圖', null, null)}>
                  <Image style={styles.advertisementContent} source={advertisement.image}/>
                </TouchableHighlight>
              );
            })}
          </ScrollView>
        </View>
        {/* ... */}
      </View>
    );
  }
}
```

### 添加指示器組件

給輪播廣告換上了漂亮的圖片之後，還差一個效果：當前頁面指示器。

1. 首先定義指示器中圓點的尺寸，修改代碼：

```javascript
// app.js
const circleSize = 8;
const circleMargin = 5;

export default class App extends Component<{}> {
```

2. 在 render() 函數中的輪播廣告中添加指示器組件，代碼如下：

```javascript
// app.js
export default class App extends Component<{}> {

  render() {
    const advertisementCount = this.state.advertisements.length;
    const indicatorWidth = circleSize * advertisementCount + circleMargin * advertisementCount * 2;
    const left = (Dimensions.get('window').width - indicatorWidth) / 2;

    return (
      <View style={styles.container}>
        {/* ... */}
        <View style={styles.advertisement}>
          <ScrollView ref="scrollView"
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      pagingEnabled={true}>
            {this.state.advertisements.map((advertisement, index) => {
              return (
                <TouchableHighlight key={index} onPress={() => Alert.alert('你單擊了輪播圖', null, null)}>
                  <Image style={styles.advertisementContent} source={advertisement.image}/>
                </TouchableHighlight>
              );
            })}
          </ScrollView>
          <View style={[styles.indicator, {left}]}>
            {this.state.advertisements.map((advertisement, index) => {
              return (<View key={index}
                            style={(index === this.state.currentPage)
                              ? styles.circleSelected
                              : styles.circle}></View>)
            })}
          </View>
        </View>
        {/* ... */}
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  // ...
  indicator: {
    position: 'absolute',
    top: 160,
    flexDirection: 'row'
  },
  circle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize/2,
    backgroundColor: 'gray',
    marginHorizontal: circleMargin
  },
  circleSelected: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize/2,
    backgroundColor: 'white',
    marginHorizontal: circleMargin
  },
  // ...
});
```

這裡使用絕對佈局，在實際開發中，使用絕對佈局組件的 top、left、width、height 屬性往往是透過計算動態得到的，千萬不要固定值，否則將無法支持不同屏幕的適配。

## 完善商品列表 —— ListView 組件

### 對圖片資源進行重構

將 image 相關圖片拉到 images 文件夾中，讓目錄結構不會因為增加圖片而變得糟糕。

### 重新定義商品模型

```javascript
// app.js
export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      // ...
      dataSource: ds.cloneWithRows([ // 為數據源傳遞一個數組
        {
          image: require('./images/advertisement-image-01.jpg'),
          title: '商品 1',
          subTitle: '描述 1'
        },
        {
          image: require('./images/advertisement-image-01.jpg'),
          title: '商品 2',
          subTitle: '描述 2'
        },
        {
          image: require('./images/advertisement-image-01.jpg'),
          title: '商品 3',
          subTitle: '描述 3'
        },
        {
          image: require('./images/advertisement-image-01.jpg'),
          title: '商品 3',
          subTitle: '描述 3'
        },
        {
          image: require('./images/advertisement-image-01.jpg'),
          title: '商品 4',
          subTitle: '描述 4'
        },
        {
          image: require('./images/advertisement-image-01.jpg'),
          title: '商品 5',
          subTitle: '描述 5'
        },
        {
          image: require('./images/advertisement-image-01.jpg'),
          title: '商品 6',
          subTitle: '描述 6'
        },
        {
          image: require('./images/advertisement-image-01.jpg'),
          title: '商品 7',
          subTitle: '描述 7'
        },
        {
          image: require('./images/advertisement-image-01.jpg'),
          title: '商品 8',
          subTitle: '描述 8'
        },
        {
          image: require('./images/advertisement-image-01.jpg'),
          title: '商品 9',
          subTitle: '描述 9'
        },
        {
          image: require('./images/advertisement-image-01.jpg'),
          title: '商品 10',
          subTitle: '描述 10'
        }
      ]),
      // ...
    };
  }
  
  // ...

  _renderRow = (rowData, sectionID, rowID) => {
    return (
      <TouchableHighlight onPress={() => Alert.alert('你單擊了商品列表', null, null)}>
        <View style={styles.row}>
          <Image source={rowData.image} style={styles.productImage}/>
          <Text style={styles.productTitle}>{rowData.title}</Text>
          <Text style={styles.productSubTitle}>{rowData.subTitle}</Text>
        </View>
      </TouchableHighlight>
    )
  }
  
  // ...
}

const styles = StyleSheet.create({
  // ...
  row: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center'
  },
  productImage: {
    marginLeft: 10,
    width: 40,
    height: 40
  },
  productText: {},
  productTitle: {},
  productSubTitle: {}
});
```

### 商品佈局的優化

```javascript
_renderRow = (rowData, sectionID, rowID) => {
  return (
    <TouchableHighlight onPress={() => Alert.alert('你單擊了商品列表', null, null)}>
      <View style={styles.row}>
        <Image source={rowData.image} style={styles.productImage}/>
        <View style={styles.productText}>{/* flexDirection 默認為 "column" */}
          <Text style={styles.productTitle}>{rowData.title}</Text>
          <Text style={styles.productSubTitle}>{rowData.subTitle}</Text>
        </View>
      </View>
    </TouchableHighlight>
  )
}
```

接著優化樣式：

```javascript
const styles = StyleSheet.create({
  // ...
  row: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  productImage: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginRight: 10,
    alignSelf: 'center'
  },
  productText: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10
  },
  productTitle: {
    flex: 3,
    fontSize: 16
  },
  productSubTitle: {
    flex: 2,
    fontSize: 14,
    color: 'gray'
  }
});
```

最後，為列表添加分割線。ListView 已經為開發者提供了方法，renderSeparator() 函數，只要實現該函數即可：

```javascript
// app.js
export default class App extends Component<{}> {

  // ...
  
  render() {
    const advertisementCount = this.state.advertisements.length;
    const indicatorWidth = circleSize * advertisementCount + circleMargin * advertisementCount * 2;
    const left = (Dimensions.get('window').width - indicatorWidth) / 2;

    return (
      <View style={styles.container}>
        {/* ... */}
        <View style={styles.products}>
          <ListView dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}/>
        </View>
      </View>
    );
  }
  
  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.divider}/>
    )
  }
  
  // ...
  
}

const styles = StyleSheet.create({
  // ...
  divider: {
    height: 1,
    width: Dimensions.get('window').width - 5,
    marginLeft: 5,
    backgroundColor: 'lightgray'
  }
});
```

至此，電商 App 的首頁已經煥然一新。

## 拖曳刷新列表 —— RefreshControl 組件

該 App 還缺少一個常用的功能，那就是拖曳刷新。添加按鈕會讓用戶體驗沒那麼好，畢竟現在移動開發屏幕小，額外添加按鈕對介面設計影響較大？

為實現拖曳刷新列錶效果，需使用新的 React Native
組件：RefreshControl。RefreshControl 組件用在 ScrollView 或 ListView
內部，為其添加下拉刷新的功能。

在使用 RefreshControl 組件前，首先要在 this.state 中添加一個是否正在刷新中的標誌：

```javascript
// app.js
export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      // ...
      isRefreshing: false
    };
  }
  
  // ...
  
}
```

在 ListView 組件中添加 RefreshControl。修改 ListView 相關代碼如下：

```javascript
// app.js
export default class App extends Component<{}> {

  // ...

  render() {
    // ...

    return (
      <View style={styles.container}>
        {/* ... */}
        <View style={styles.products}>
          <ListView dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}
                    refreshControl={this._renderRefreshControl()}/>
        </View>
      </View>
    );
  }
  _renderRefreshControl() {
    return (
      <RefreshControl
        refreshing={this.state.isRefreshing}
        tintColor={'#FF0000'}
        title={'正在刷新數據，請稍候...'}
        titleColor={'#0000FF'}>
      </RefreshControl>
    )
  }
  
  // ...
  
}
```

接著需要為 RefreshControl 添加狀態變化的邏輯：

```javascript
// app.js
export default class App extends Component<{}> {
  
  // ...
  
  _renderRefreshControl() {
    return (
      <RefreshControl
        refreshing={this.state.isRefreshing}
        onRefresh={this._onRefresh}
        tintColor={'#FF0000'}
        title={'正在刷新數據，請稍候...'}
        titleColor={'#0000FF'}>
      </RefreshControl>
    )
  }

  _onRefresh = () => {
    this.setState({isRefreshing: true});

    setTimeout(() => {
      this.setState({isRefreshing: false});
    }, 2000);
  };
  
  // ...
  
}
```

不過 RefreshControl 在不同平台下效果也是完全不同的。

完成拖曳刷新後，還可進一步完善：更新商品數據，並刷新列表：

```javascript
// app.js
export default class App extends Component<{}> {
  
  // ...
  
  _onRefresh = () => {
    this.setState({isRefreshing: true});
  
    setTimeout(() => {
      const products = Array.from(new Array(10)).map((value, index) => ({
        image: require('./images/advertisement-image-01.jpg'),
        title: '新商品' + index,
        subTitle: '新商品描述' + index
      }));
      this.setState({isRefreshing: false, dataSource: ds.cloneWithRows(products)});
    }, 2000);
  };
  
  // ...
  
}
```

## 添加頁面跳轉功能 —— Navigator 組件

React Native 實現頁面跳轉的組件有 Navigator 以及 NavigatorIOS，和前面介紹過的
ViewPagerAndroid 問題一樣，為考慮平台兼容性和代碼複用性，這裡使用 Navigator 組件。

這裡先將首頁的實現移植到 home.js 新建的文件。

```javascript
export default class home extends Component<{}> {
```

修改 app.js 代碼如下：

```javascript
import React, {Component} from 'react';
import {
  View
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import Home from "./Home";

export default class App extends Component<{}> {

  render() {
    return (
      <Navigator
        initialRoute={{
          name: 'home',
          component: Home
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

重新加載運用，保證運行效果和重構前完全一致。

這裡來一一說明上述代碼：

- initialRoute 屬性：定義了應用啟動時加載的路由 (route)，而路由是 Navigator
  組件用來識別渲染場景的一個對象，簡單說，initialRoute
  中定義的組件就是應用第一個要顯示的頁面，這就是首頁 home.js
- configureScene 屬性：定義了頁面之間跳轉的動畫，包括：
  - FloatFromRight
  - FloatFromLeft
  - FloatFromBottom
  - FloatFromBttomAndroid
  - FadeAndroid
  - HorizontalSwipeJump
  - HorizontalSwipeJumpFromRight
  - VerticalUpSwipeJump
- renderScene() 函數可透過 React Native 調試來一看究竟。route 參數的 name 和
  component 就是在 initialRoute 屬性中傳遞的 home 和 home 組件，所以 app.js
  文件中運行代碼：

  ```javascript
  return <Component {...route.params} navigator={navigator}/>
  ```

  的作用就是返回 home 組件。當然，這裏也將 navigator 參數也傳遞了 home
  組件：透過 `{...route.params}` 以及 `navigator={navigator}`，於是，在
  home 組件中就可以使用 this.props.navigator 來獲取 navigator。

## 二級頁面的跳轉 —— TouchableOpacity 組件

理解了 Navigatore 的基本用法之後，下一步，添加一個新的組件，以便實現二級頁面跳轉的效果。

1. 添加新的文件 detail.js，代碼：

```javascript
import React, {Component} from 'react';
import {StyleSheet, Text, View} from "react-native";

export default class Detail extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          詳情頁面
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20
  }
});
```

2. 在首頁修改按鈕響應，添加跳轉到下一個頁面的入口。

```javascript
export default class Home extends Component<{}> {
  
  // ...
  
  _renderRow = (rowData, sectionID, rowID) => {
    return (
      <TouchableHighlight onPress={() => {
        const {navigator} = this.props;
        if (navigator) {
          navigator.push({name: 'detail', component: Detail})
        }
      }}>
        <View style={styles.row}>
          <Image source={rowData.image} style={styles.productImage}/>
          <View style={styles.productText}>{/* flexDirection 默認為 "column" */}
            <Text style={styles.productTitle}>{rowData.title}</Text>
            <Text style={styles.productSubTitle}>{rowData.subTitle}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  };
  
  // ...

}
```

可使用 Navigator 的如下接口來進行場景的切換：

- push(route)：跳轉到新的場景，並且將場景入棧
- pop：跳轉到上一個場景，並且將當前場景出棧
- popToRoute(route)：pop 到路由指定的場景，在整個路由棧中，處於指定場景之後的場景都將會被卸載
- popToTop()：pop 到棧中第一個場景，卸載其他的所有場景
- replace(route)：用一個新的路由替換掉當前場景
- replaceAtIndex(route, index)：替換指定序號的路由場景
- replacePrevious(route)：替換上一個場景
- 其他方法
  - jumpBack()
  - jumpForward()
  - jumpTo(route)
  - resetTo(route)

3. 如何返回上一個頁面？答案就是 Navigator.pop() 方法，修改 detail.js：

```javascript
// detail.js
export default class Detail extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._pressBackButton.bind(this)}>
          <Text style={styles.back}>返回</Text>
        </TouchableOpacity>
        <Text style={styles.text}>
          詳情頁面
        </Text>
      </View>
    )
  }

  _pressBackButton() {
    const {navigator} = this.props;
    if (navigator) {
      navigator.pop();
    }
  }
}

const styles = StyleSheet.create({
  // ...
  back: {
    fontSize: 20,
    color: 'blue'
  }
});
```

這裡簡單區別一下 Touchable* 組件：

- TouchableHighlight：單擊該組件後，該組件的不透明度會降低同時會看到相應的顏色 (視圖變暗或變亮)
- TouchableOpacity：單擊該組件後，封裝的組件的不透明度會降低。這個過程並不會真正改變組件層級，大部分情況下很容易添加到應用中而不會帶來副作用
- TouchableNativeFeedback：只支持 Android 平台，在 Android 平台上該組件可以使用原生平台的狀態資源來顯示觸摸狀態變化
- TouchableWithoutFeedback：單擊該組件後，該組件沒有任何反應和變化，所以不推薦使用

## 實現頁面間的數據傳遞

跳轉和返回的效果實現了，那麼，如何實現頁面間的數據傳遞和通信呢？

React Native 使用 props 來實現頁面間數據傳遞和通信。在 React Native 中，有兩種方式可以存儲和傳遞數據，即 props 以及 state，其中：

- props 通常在父組件指定，而且一經指定，在被指定的組件的生命週期中則不再改變
- state 通常是用於存儲需要改變的數據，並且當 state 數據發生更新時，React Native 會刷新介面

所以將首頁的數據傳遞給下一個頁面，需使用 props。修改 Home.js 代碼如下：

```javascript
// Home.js
export default class Home extends Component<{}> {
  
  // ...
  
  _renderRow = (rowData, sectionID, rowID) => {
    return (
      <TouchableHighlight onPress={() => {
        const {navigator} = this.props;
        if (navigator) {
          navigator.push({
            name: 'detail',
            component: Detail,
            params: {
              productTitle: rowData.title
            }})
        }
      }}>
        {/* ... */}
      </TouchableHighlight>
    )
  };
  
  // ...
  
}
```

在 detail.js 中可以使用 this.props.productTitle 來獲得首頁傳遞的數據。

```javascript
// Detail.js
export default class Detail extends Component<{}> {
  
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._pressBackButton.bind(this)}>
          <Text style={styles.back}>返回</Text>
        </TouchableOpacity>
        <Text style={styles.text}>
          {this.props.productTitle}
        </Text>
      </View>
    )
  }
  
  // ...

}
```

這樣，一個完整的頁面跳轉和頁面間數據傳遞的功能就實現了。

## 小結

這章我們對已有的應用進行了以下優化：

- 代碼重構：包括組件的復用、邏輯的簡化以及擴展性的優化
- 樣式美化：自定制了組件的樣式
- 功能完善：為輪播廣告添加指示器效果，為商品列表添加圖片和詳細說明，為應用添加更多 React Native 提供的組件

這裡學習了多個組件的使用。
