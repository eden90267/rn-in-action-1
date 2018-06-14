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

