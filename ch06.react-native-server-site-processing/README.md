# Chap 06. React Native 的服務器端處理

應用內的實際數據往往都是從服務器動態獲取的。因此，本章將擴展一個新的開發角度：結合服務端來完善我們的 React Native 應用。

本章主要內容有：

- 掌握 Node.js 的原理和開發流程
- 學習服務器端接口設計規範 RESTful
- 了解網絡前後端交互的原理
- 實現 App 從服務器獲取數據
- 實現 App 數據的本地化存儲

## 學習 Node.js

### 什麼是 Node.js

JavaScript 是一門腳本語言，腳本語言都需要一個解析器才能運行。對於寫在 HTML 頁面的 JavaScript，瀏覽器充當了解析器的角色。而對於獨立運行的 JavaScript 代碼，Node.js 就是它的解析器。

所以簡單來說，Node.js 就是一個讓 JavaScript 運行在服務端的開發平台，它讓 JavaScript 成為腳本語言世界的一等公民，在服務端堪與 Ruby、Python、PHP 平起平坐。Node.js 基於 Google V8 JavaScript 引擎，V8 引擎執行 JavaScript 的速度非常快，性能非常好。

P.S. 服務端，指的是 C-S (Client-Server) 架構，使用 React Native 開發應用時，首先也會運行一個 Node.js 服務來監聽和響應應用的請求，所以 React Native 是使用 Node.js 開發移動端應用這點是沒有矛盾的。

### 為什麼選擇 Node.js？

為什麼選擇 Node.js？或者說 Node.js 都有哪些優勢呢？

#### 1. 統一的開發語言

掌握一門開發語言，就可以開發不同平台不同場景的程序

#### 2. 簡單易學

從原理看，Node.js 保持了 JavaScript 在瀏覽器中單線程的特點。單線程最大好處是不用像多線程編程那樣過多地考慮同步問題，這裡沒有死鎖的存在，也沒有線程上下文交換所帶來的性能上的開銷。

在 Node 中，絕大多數的操作都以異步的方式進行調用。

#### 3. 高性能

Node 使用異步 I/O 和事件驅動代替多線程，帶來了很大的性能提升。另外，Node 在使用強大的 Google V8 JavaScript 引擎的同時，還使用了高效的 libev 和 libeio 庫支持事件驅動和異步 I/O。

#### 4. 跨平台

除支援主流 Windows、macOS、Linux 外，還可下載源碼自行編譯安裝。

Node 底層核心模組主要由 C/C++ 語言編寫，因此，很容易做到跨平台。Node 基於 libuv 架構與主流 Windows、Linux 與 macOS 平台溝通。

#### 5. 社區活躍

Node 有著非常廣大的開發者社區和很高的活耀度，Node 項目在 Github 上的關注度和更新頻率也非常高。

同時，圍繞 npm 建立起來的廣大的第三方包生態圈，大大提高了 Node 開發的效率。

### 安裝和使用 nvm

實際開發中常常需要一個版本管理工具，nvm 就是這樣一個 Node 版本管理器。

> Top！除了 nvm 外，Node 的版本管理器還有 n。

(以下安裝過程略過，可參考 [nvm 官網](https://github.com/creationix/nvm))

### Node.js 開發流程

#### 1. 新建工程

```shell
$ mkdir Node
$ cd Node
$ touch hellonode.js
```

在 hellonode.js 添加如下代碼：

```javascript
console.log('Hello Node.js');
```

執行 Node 程序

```shell
$ node hellonode.js
```

再來看看 Node 讀取文件的實現：

```shell
$ echo 文件 1 > file1
$ echo 文件 2 > file2
```

新建 readfile.js，並添加以下代碼：

```javascript
const fs = require('fs');

fs.readFile('file1', function(err, file) {
  console.log('文件 1 的內容：' + file);
});

fs.readFile('file2', function(err, file) {
  console.log('文件 2 的內容：' + file);
});

console.log('讀取文件 1 和文件 2');
```

執行

```shell
$ node readfile.js
```

打印可看出，Node 不需要等待文件讀取完，就會在讀取文件時同時執行下面的代碼，從而大大提高了程序的性能。另外，由於異步操作是非阻塞的，所以 Node 會使用回調函數來傳遞文件讀取的結果。

####  2. HTTP 服務器

Node 可以說是為網絡開發而生的平台，下面使用 Node 開發一個服務端程序。

Node 別於 Java 或 PHP 的語言 (瀏覽器 - HTTP 服務器 - PHP 解釋器 結構)，它實現了應用，還實現了 HTTP 服務器，即 Node 將 HTTP 服務器剝離開，讓服務端的結構簡化成 “瀏覽器 - Node”。

新建 server.js 文件：

```javascript
const fs = require('fs');

http.createServer
```
