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

## Android 平台的適配

Android 的適配工作更繁重，情況也更複雜。因為，相比封閉的 iOS 平台，Android 平台無論是硬件和軟件們都是開放的，所以市場上 Android 設備種類更多。

### 適配原理

打開 Android Studio 打開 ECApp 的 Android 文件夾。

Android 適配是基於文件夾的，不同分辨率和尺寸的屏幕會自動適配相應文件夾下的佈局或資源文件。但是，想要進一步理解 Android 的適配，有必要先了解 Android 適配的一些基本概念。

- 屏幕尺寸：屏幕尺寸是指手機屏幕對角線的英吋數
- 屏幕分辨率：屏幕分辨率是指屏幕寬、高像素度
- 屏幕像素密度：屏幕像素密度是指手機屏幕對角線上單位英吋內的像素數

另外，編寫代碼時常用的尺寸單位如下：

- px：像素
- dp (dip 縮寫)：規定密度為 160 的屏幕上，1 像素對應尺寸為 1dp。320 密度的屏幕上，一像素對應 0.5dp，依此類推。在密度 160 的屏幕上，1 英吋有 160 個像素，那麼 1px 對應的尺寸=1/160 英吋，即 dp 是個物理尺寸，跟像素無關。所以，100dp 的尺寸在不同手機上顯示出來，物理尺寸看上去基本是一樣的。
- sp (Scale-independent Pixel)，即與縮放無關的抽象像素。sp 和 dp 很類似，唯一的區別是，Android 系統允許用戶自定義文字尺寸大小 (小、正常、大、超大等)，當文字尺寸是 “正常” 時，1sp=1dp=0.00625 英吋，而當文字尺寸是“大”或“超大”時，1sp>1dp=0.00625 英吋

在創建項目的時候，會自動創建不同的 mipmap 或 layout 文件夾 (在不同像素密度上提供不同的圖片)，文件夾的後綴表明了該佈局或資源像素密度 (dp) 範圍，對應關係如表：

| 後綴     | 像素密度 (dp) 的範圍 |
|:--------|:-------------------|
| mdpi    | 120dp ~ 160dp      |
| hdpi    | 160dp ~ 240dp      |
| xhdpi   | 240dp ~ 320dp      |
| xxhdpi  | 320dp ~ 480dp      |
| xxxhdpi | 480dp ~ 640dp      |

對於 Android 項目中的 mipmap 文件夾，Android 的適配機制：系統會先到後綴與設備匹配的 mipmap 目錄下找對應的圖片，當找不到的時候會去更高一級的目錄找，如再找不到，則繼續往高一級的目錄找，如果還是找不到，就退而求其次去低一級目錄找，依此類推。

當找到對應的圖片支援，系統會按密度對圖片做縮放處理，然後再顯示到屏幕上。所以如果圖片放的目錄不正確的話，有可能造成圖片因縮放而變得模糊。

另外，用於存放佈局文件的 layout 目錄也是透過後綴名來適配的，只不過 layout 文件夾通常添加設備分辨率作為後綴，如：layout-1280x720、layout-1920x1080 及 layout-land-1280x720 等。

不難看出，以上適配方法和上述 iOS 開發中的 Size Class 是類似的，即用於分類適配。

### 常用的適配屬性

在 Android 實際編碼中，為了支持不同屏幕尺寸，使用如下屬性：

1. wrap_content 方式

  wrap_content 佈局元素將根據內容更改大小

2. match_parent 方式

  match_parent 自動填滿整個父元素的空間

3. ConstrainLayout 方式

  Android 平台從 Android Studio 2.2 版本開始加入了一種全新的佈局方法 ConstraintLayout。簡單來說，這種佈局方式和 iOS 自動佈局 (Auto Layout) 有相似之處，即描述的都是視圖或組件之間的關係。

## Android 平台的調試技巧

打開源碼 MainActivity.java，然後可進行斷點的添加，接著選擇菜單 Debug -> Debug ‘app’ 選項，即可調試 Android 應用。

如果要調適原生項目的實現和邏輯，可使用上述方法；如果要調適 Android 的佈局，可使用 React Native 的調適選項 Toggle Inspector。

## 小結

平台的適配一直是創始人或 CTO 最關心的問題，這涉及開發成本和開發週期，所以本章的內容對創業者很關鍵。