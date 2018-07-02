# Chap05. 原生平台的調配和調試

使用 React Native 開發應用時，通常只需要了解 React Native 的相關知識即可，例如，之前介紹過的

- React Native 調適
- Flexbox 佈局和適配
- React Native 組件
- 第三方組件的使用

但在一些情況下，了解一些原生平台的知識有助於快速定位和解決問題，如第三章完善首頁功能和樣式時遇到第四章沒註冊的錯誤問題。所以，這裡會介紹一些平台適配問題：

- iOS 平台的適配和調適
- Android 平台的適配和調適

## iOS 平台的適配

使用 XCode 打開 ios 文件夾下的 ch04.xcodeproj 文件

除了使用源碼方式實現調配之外，iOS 工程中用於調配的相關資源主要有 Images.xcassets、LaunchScreen.xib 以及工程中暫未使用的 storyboard 文件。

### Images.xcassets 適配

Images.xcassets 已經為開發者定義好了所需資源的尺寸和用途，只需要按照說明添加響應的圖片資源即可。

在 xib 或 storyboard 文件中，iOS 適配的技術基於自動佈局 (Auto Layout) 系統，自動佈局描述的是視圖或組件之間的相對位置關係，它可以在應用運行時根據設備的屏幕尺寸動態改變各個視圖或組件的尺寸。

### 自動佈局 Auto Layout

在 React Native 開發中，想要實現類似 iOS 平台自動佈局的方式，可以使用 Flexbox 佈局，而 iOS 平台實現自動佈局的方法是約束。約束既可以定義佈局屬性的具體值，也可以定位佈局屬性之間的關係。例如，可以為視圖或組件添加如下約束：視圖的高度是 4、兩個視圖之間的垂直距離是 10、這些視圖的寬度相等。

常見的約束屬性：

- Left
- Right
- Top
- Bottom
- Leading
- Trailing
- Width
- Height
- CenterX
- CenterY
- Baseline

可以查看 iOS 工程中 Auto Layout 的例子，單擊 iOS 工程 LaunchScreen.xib 文件中的標題 ECApp，看到約束的右側視窗。

透過 CenterX 和 CenterY 設置該視圖或組件相對於其 SuperView 位置的比例，就實現了不同尺寸屏幕的適配。

### Size Class 適配

雖然 Auto Layout 解決了屏幕適配的問題，但在實際開發過程中，不同設備的佈局需求可能不完全相同。例如，在實現 iPhone 和 iPad 適配的時候，一個頁面需要配置多個 xib 進行進行開發還是件很頭疼的事情。好在從 iOS 8 開始，蘋果引入了 Size Class。

使用 Size Class 之後，可以把各種尺寸屏幕的適配工作放在一個文件中完成，然後可以透過不同類別的 Size 來定製各種尺寸的界面。換句話說，xib 或 storyboard 文件不是一個普通的 xib 或 storyboard 文件，而是一個由多個不同佈局合一的 xib 或 storyboard，可以管理多種類型的屏幕。

## iOS 開發的調試技巧

了解了 iOS 平台的調配方法之後，下面再來介紹一些 iOS 開發的調試技巧。

菜單 Product -> Run，和 react-native run-ios 命令的效果一樣，也可運行 iOS App。在 iOS App 啟動前，單擊 AppDelegate.m 文件中代碼行數 23，可添加斷點，啟動 iOS App 後，應用會停止在剛才添加斷點的代碼處。

此時也可以查看當前應用運行的相關信息：線程信息及局部變量的值。

iOS 平台還提供了 UI 測試的小工具，打開 iOS 模擬器的菜單 Debug -> Color Blended Layers 選項，可查看當前頁面所有組件的位置和佈局。

> Top！ 除了 iOS UI 調適，還有一些優秀的第三方工具，例如 Facebook chisel 還有一款付費軟件 Reveal，它們可以在應用運行時動態地查看和調整 UI，從而大大提供佈局開發的效率。