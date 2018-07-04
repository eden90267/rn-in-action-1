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

http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<h1>Hello Node.js!</h1>');
  res.end('<p>The End</p>');
}).listen(8888);

console.log('HTTP server is running at http://127.0.0.1:8888/');
```

此程序並沒有結束退出，透過 createServer 創建的 server，調用 listen() 方法會一直監聽指定的端口號 8888。

打開瀏覽器訪問就可看到 Node 回應的網頁

## 服務端接口的設計：RESTful

RESTful  API 規範，首先令人不解的應該就是 REST 的含義了。

REST (Representational State Transfer 的縮寫) 即表述性狀態轉移，是 Roy Fielding 博士在 2000 年的博士論文中提出來的一種軟件架構風格。表述性狀態轉移是一組架構約束條件和原則，滿足這些約束條件和原則的應用程序或設計就是 RESTful。

按照 RESTful 的設計原則即每一個網址代表一種資源，所以地址中一般只是用名詞，而不用動詞，例如：

- [http://127.0.0.1:8888/advertisements]()：表示廣告 API
- [http://127.0.0.1:8888/products]()：表示商品 API

而對資源的不同操作，透過 HTTP 協議定義的方法來區分。其中，HTTP 協議定義的常用方法如下：

- GET：請求獲取指定資源
- POST：向指定資源提交數據
- PUT：請求服務器存儲一個資源
- DELETE：請求服務器刪除指定資源
- HEAD：請求指定資源的響應頭
- OPTIONS：返回服務器支持的 HTTP 請求方法

RESTful API 主要使用以下 4 種 HTTP 方法操作資源：

- GET：請求獲取制定資源，即查詢操作
- POST：請求服務器新建資源，即新建操作
- PUT：請求服務器更新資源，即更新操作
- DELETE：請求服務器刪除指定資源，即刪除操作

因此依照 RESTful 規範，商品 API 的設計如下：

- [http://127.0.0.1:8888/products]() GET
- [http://127.0.0.1:8888/products]() POST
- [http://127.0.0.1:8888/products/ID]() PUT
- [http://127.0.0.1:8888/products/ID]() DELETE

如果查詢操作獲取的數量太多，還可以在 API 中添加過濾信息。

- [http://127.0.0.1:8888/products?limit=10]() GET
- [http://127.0.0.1:8888/products?offset=10]() GET
- [http://127.0.0.1:8888/products?page=2&per_page=10]() GET
- [http://127.0.0.1:8888/products?product_type=1]() GET

以上只是對 RESTful 規範做一個簡單的介紹，實際開發中還需要考慮 Web 頁面和 API 的分離、API 版本控制以及 HTTP 狀態碼等。

## 實現電商 App 的服務器端接口

Node 提供的 HTTP 模組僅僅是對 HTTP 服務器內核進行了封裝，但是實際開發的 Web 服務器，不僅僅需要處理 HTTP 請求，還包括 Cookie 和會話管理、路由控制以及模板渲染等。因此，可以使用第三方 Web 框架來加快服務器開發。

### Express 框架

Express：目前最穩定，功能最強大而且使用也最廣泛的 Node 框架

Express 除了為 HTTP 模組提供了封裝之外，還實現了 Web 開發中常用的如下功能：

- 用戶會話
- 路由控制
- 模板解析
- 靜態文件服務
- 錯誤控制器
- 訪問日誌
- 緩存
- 插件

這裡需要關注的是插件的支持。這是源於 Express 的設計：做一個輕量級的 Web 框架。例如，Express 並不支持例如常見的 ORM，但是 Express 支持並擁有大量的第三方插件，添加插件同樣可以實現 ORM。這種插件化設計，大大降低了耦合性，是一種值得借鑒的設計理念。

> Top！耦合性 (Coupling) 也叫藕合度，是對模組間關聯程度的度量。模組間耦合度是指模組之間的依賴關係，包括控制關係、調用關係、數據傳遞關係。模組間聯繫越多，其耦合性越強，同時表明其獨立性越差。軟件設計中通常用耦合度和內聚度作為衡量模組獨立程度的標準。劃分模組的一個準則就是高內聚低耦合。

#### 1. 安裝和使用 Express

```shell
$ npm i express-generator -g
```

```shell
$ express --ejs ECServer
```

```shell
$ cd ECServer
$ npm i
```

```shell
$ npm start
```

就可看到 Express 頁面了

若想修改端口號：`PORT=8888 npm start`

#### 2. Express 項目結構

- bin：可執行文件，用於配置和啟動工程入口文件
- public：靜態資源目錄
- routes：路由目錄
- views：模板文件
- app.js：入口文件
- package.json：工程配置文件，描述工程所有信息以及第三方庫的依賴關係

這裡不需要瞭解與頁面渲染相關的目錄與文件，這裡主要涉及的目錄或文件如下：

- public 目錄：用於存放圖片資源
- routes 目錄：用於實現路由 API
- app.js 文件：用於配置整個項目，包括路由控制

#### 3. Express 路由機制


首先來了解下設計和實現 API 的基礎：Express 的路由機制

```javascript
// app.js

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use('/', index);
app.use('/users', users);
```

"/" 的路徑就交給 `./routes/index.js` 文件處理：

```javascript
// index.js

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
```

router 的 get 方法用來處理 GET 請求，該方法的回調函數處理和返回 HTTP 響應 res，res 的 render() 方法用來渲染模板文件 index.ejs，模板文件 index.ejs 的內容如下：

```ejs
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1><%= title %></h1>
    <p>Welcome to <%= title %></p>
  </body>
</html>
```

渲染模板文件時，會將模板中的 `<%= title %>` 替換成 render() 方法中傳遞的字典 `{title: 'Express'}`。最終，渲染模板文件後得到的 HTML 頁面就返回給瀏覽器。

#### 1. 添加接口

```javascript
// app.js

var index = require('./routes/index');
var products = require('./routes/products');
var users = require('./routes/users');

var app = express();


app.use('/', index);
app.use('/products', products);
app.use('/products/:id', products);
app.use('/users', users);
```

`routes/products.js`：

```javascript
// routes/products.js

var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.send('商品列表');
});

module.exports = router;
```

send() 方法直接返回一個字符串。

至此，商品 API 就已經算是正式上線了。

#### 2. 添加數據

將圖片資源複製到 public/images 目錄下

然後將 React Native 應用中使用的商品數據都添加到服務器中，修改 products.js 文件的代碼如下：

```javascript
var express = require('express');
var router = express.Router();

var products = [
  {
    image: './images/advertisement-image-01.jpg',
    title: '商品 1',
    subTitle: '描述 1'
  },
  {
    image: './images/advertisement-image-01.jpg',
    title: '商品 2',
    subTitle: '描述 2'
  },
  {
    image: './images/advertisement-image-01.jpg',
    title: '商品 3',
    subTitle: '描述 3'
  },
  {
    image: './images/advertisement-image-01.jpg',
    title: '商品 3',
    subTitle: '描述 3'
  },
  {
    image: './images/advertisement-image-01.jpg',
    title: '商品 4',
    subTitle: '描述 4'
  },
  {
    image: './images/advertisement-image-01.jpg',
    title: '商品 5',
    subTitle: '描述 5'
  },
  {
    image: './images/advertisement-image-01.jpg',
    title: '商品 6',
    subTitle: '描述 6'
  },
  {
    image: './images/advertisement-image-01.jpg',
    title: '商品 7',
    subTitle: '描述 7'
  },
  {
    image: './images/advertisement-image-01.jpg',
    title: '商品 8',
    subTitle: '描述 8'
  },
  {
    image: './images/advertisement-image-01.jpg',
    title: '商品 9',
    subTitle: '描述 9'
  },
  {
    image: './images/advertisement-image-01.jpg',
    title: '商品 10',
    subTitle: '描述 10'
  }
];

router.get('/', function (req, res, next) {
  res.send(JSON.stringify(products));
});

module.exports = router;
```

此時。商品的查詢接口就實現了

#### 3. HTTP API 調適利器 Postman

實際開發應用中，應該使用告高效的 HTTP 調試工具：Postman。