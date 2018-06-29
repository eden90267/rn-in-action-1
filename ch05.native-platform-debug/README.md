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

在 React Native 開發中，想要實現類似 iOS 平台自動佈局的方式，可以使用 Flexbox 佈局，而 iOS 平台實現自動佈局的方法是約束。約束既可以定義佈局屬性的具體值，也可以定位佈局屬性之間的關係