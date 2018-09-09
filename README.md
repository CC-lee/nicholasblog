# nicholasblog SPA动态博客
在线预览：

博客展示页面：http://www.nicholasblog.site

博客管理页面：http://www.nicholasblog.site/adminback

## 简介

​	一个前后端完全分离的单页应用动态博客，前端展示页面采用Vue全家桶，前端管理页面采用Angular，后端采用Express+MongoDB。



## 特点

### 页面划分

- 主页：博客文章预览页面，点击预览框中的文章标题进入文章页面，支持搜索功能。

- 标签：点击不同的标签，查看不同分类的文章预览，支持搜索功能。

- 留言板：查看注册用户留言，采用[Froala](https://www.froala.com/wysiwyg-editor)作为留言发送编辑器，采用[Dropzone](http://www.dropzonejs.com)作为留言图片发送工具，发送留言时可通过'@'通知其他注册用户，留言板与留言页面之间的切换形式部分模仿推特推文。

- 相册：懒加载式相册，图片与相册页面之间的切换形式部分模仿Instagram。

- 商店：模拟小型商店功能，具有选项选择、放入购物车，生成订单功能。

- 关于：个人简历、网站简介、JS插件简介，后台可编辑。
- 注册用户：注册用户相关操作页面，包括用户资料、修改密码、用户通知、购物车、购物订单。

- 管理系统：基于[ng2-admin](https://github.com/akveo/ng2-admin)界面的管理系统，管理前台展示页面的内容，采用Froala作为编辑器，采用Dropzone作为图片拖拽上传工具。



### 功能设置

- 粘黏吸顶导航栏
- 滚动条监听式内容加载
- 可手动变更页面背景
- 连接网易云音乐外链播放器
- 博客文章带略缩图预览
- 最新留言滚动预览
- 支持代码高亮
- 支持移动端界面自适应
- 滑动移动端菜单
- 评论功能
- 点赞功能
- 部分功能只对注册用户开放
- 标签搜索功能
- 文章模糊搜索匹配功能
- 留言模糊搜索搜索功能
- 图片文件上传功能
- 商店下单及查看用户订单功能
- 管理用户留言
- tab式动态简历
- 服务端MVC形式的RESTful API 

- 服务端token验证拦截功能

- 服务端多个不同内容的编辑页面同时工作，图片文件的操作互不干扰

  

### 功能展示

#### 前台展示页面演示

#### 

#### 移动端页面演示



#### 用户通知演示



#### 发送留言演示



#### 管理页面演示



## 技术栈

### 展示页面

- Vue2.0 (页面框架)

- Vue-Router (路由)

- Vuex (状态管理)

- axios (ajax数据交互)

- bootstrap-vue (UI插件)

- highlight.js (代码高亮)

- lodash (数据处理)

- jquery (部分动态数据渲染、部分UI插件)
- dropzone (图片上传)
- vue-froala-wysiwyg (编辑器)
- proxylistenerjs (数据变化及函数执行监听)
- v-autocomplete (文章分类标签自动补全搜索)

- at.js (留言板@功能)



### 管理页面

- Angular4 (页面框架)

- ng2-admin (页面UI骨架)

- ng-bootstrap (UI插件)

- ng2-completer (文章分类标签自动补全搜索)

- ng2-smart-table (数据表格)
- jquery (部分动态数据渲染、部分UI插件)

- ngx-dropzone-wrapper  (图片上传)

- rxjs (ajax数据交互、函数式编程)

- proxylistenerjs (数据变化及函数执行监听)

- lodash (数据处理)

- angular-froala-wysiwyg(编辑器)

  

### 工程化

#### 兼容性

- autoprefixer  (CSS前缀添加)

- core-js (JS兼容性库)

- flexibility (flexbox兼容性库)



#### Webpack优化设置

- 根据不同环境变量进行动态设置

- gzip压缩文件

- CSS文件分离提取

- 第三方类库分离提取

- 异步加载chunks

- 文件名添加hash



### 服务端

- express(服务端框架)
- jsonwebtoken (token操作)
- multer (dropzone上传图片文件储存)
- wysiwyg-editor-node-sdk (froala上传图片文件储存)
- mongoose (MongoDB操作的Dao层封装)

- moment (时间格式)
- lodash (数据处理)
- sharp (生成略缩图)
- fs-extra (文件夹操作)
- fs-jetpack (文件夹操作)
- sha1 (数据hash加密)



## 项目结构概览

- 展示页面

```shell
├─build // webpack 相关配置文件
├─config
|-dist  //目标文件夹
└─src // 客户端程序目录
    ├─api // ajax api 文件
    │  └─module 模块文件夹
    ├─assets
    │  ├─css
    │  │  ├─frontend
    │  │  └─img
    │  ├─img
    │  │  └─frontend
    │  └─js
    │      └─highlight.js
    ├─fonts
    ├─lib // 公共工具文件夹
    ├─pages // 页面组件文件夹
    │  ├─about
    │  ├─album
    │  │  ├─Album
    │  │  └─Image
    │  ├─article
    │  ├─components // 页面公共部分文件夹
    │  │  ├─aboutme
    │  │  ├─actions
    │  │  ├─background
    │  │  ├─backtop
    │  │  ├─comments
    │  │  ├─music
    │  │  ├─sendmessage
    │  │  ├─updateinfo
    │  │  ├─vfooter
    │  │  └─vheader
    │  ├─home
    │  │  └─ArticleShowList
    │  ├─messageboard
    │  │  ├─Message
    │  │  └─Messagebaord
    │  ├─shop
    │  │  ├─Item
    │  │  ├─Shop
    │  │  └─Shopcart
    │  ├─tags
    │  └─user
    │      ├─components
    │      ├─UserAccount
    │      ├─UserLogin
    │      ├─UserNotify
    │      ├─UserOrder
    │      ├─UserOrderList
    │      ├─UserPassword
    │      └─UserReg
    ├─routes // 路由配置文件夹
    ├─store  // vuex 相关文件夹
    │  └─module // vuex 模块文件夹
    └─template  // 初始模版
```

- 管理页面

```
├─e2e
|-dist  //目标文件夹
└─src // 客户端程序目录
    ├─app
    │  ├─components // 插件文件夹
    │  │  ├─ng2-comments
    │  │  └─ng2-smart-table
    │  ├─lib // 公共工具文件夹
    │  ├─pages // 页面组件文件夹
    │  │  ├─album
    │  │  ├─article
    │  │  ├─class
    │  │  ├─login
    │  │  ├─message
    │  │  ├─profile
    │  │  ├─register
    │  │  ├─shop
    │  │  └─user
    │  └─theme
    ├─assets
    ├─environments
    └─meta
            

```

- 服务端


```
├─api // api 相关处理文件
│  ├─controller // C层文件
│  │  ├─about
│  │  ├─admin
│  │  ├─album
│  │  ├─article
│  │  ├─class
│  │  ├─message
│  │  ├─shop
│  │  └─user
│  └─dao // Dao层文件
│      ├─admin
│      ├─album
│      ├─article
│      ├─class
│      ├─message
│      ├─shop
│      └─user
├─middleware // 中间件文件
│  ├─image-common
│  └─lib
│      └─wysiwyg-editor-node-sdk
├─model // M层文件
│  └─module
├─routes // 路由文件
│  ├─admin
│  ├─album
│  ├─article
│  ├─message
│  ├─shop
│  └─user
└─uploads // 图片文件储存
```



## 使用

通过修改wholeConf.js文件变更设置不同环境下的相关参数。如域名、文件夹路径与名称等。

### 开发环境

```shell
# 获取项目
git clone https://github.com/CC-lee/nicholasblog.git
# 进入展示页面项目
$ cd ./nicholasblog
# 安装依赖
$ npm install
# 启动展示页面
$ npm run dev
# 新建另一个控制台，进入管理系统页面项目
$ cd ./nicholasblog-admin
# 安装依赖
$ npm install
# 启动管理系统页面
$ npm start
# 进入服务端项目
$ cd ./nicholasblog-server
# 安装依赖
$ npm install
# 启动服务端（需预先安装Node.js（v8以上）及MongoDB）
$ npm run dev
```



### 本地生产环境

- 生成前端生产环境文件夹

```shell
# 进入展示页面项目
$ cd ./nicholasblog
# 启动生产文件
$ npm run build
# 新建另一个控制台，进入管理系统页面项目
$ cd ./nicholasblog-admin
# 启动生产文件
$ npm run build
```

- 把nicholasblog/dist路径及nicholasblog-admin/dist路径下的文件移动到dist文件夹中，然后启动生产环境下的项目。

```shell
# 安装依赖
$ npm install
# 启动展示页面
$ npm start
```



### 部署环境

```shell
# 进入展示页面项目
$ cd ./nicholasblog
# 启动部署文件
$ npm run build-d
# 新建另一个控制台，进入管理系统页面项目
$ cd ./nicholasblog-admin
# 启动部署文件
$ npm run build-d
```



## License

MIT