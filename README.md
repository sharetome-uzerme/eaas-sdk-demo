# **EaaS SDK 二次开发手册(入门)**
欢迎使用桐享EaaS 开发者工具套件（SDK），桐享EaaS SDK让您不用复杂编程即可实现业务系统与在线编辑服务EaaS的集成，让业务系统实现真正的文档在线编辑，全程安全。  

如果您在使用SDK的过程中遇到任何问题，欢迎加入桐享官方SDK客户群（QQ群：592678741、257411520）咨询。

# 什么是 EaaS SDK（在线编辑服务）？
> Editing as a Service (EaaS)是由上海谐桐信息技术有限公司开发的一款无需安装、无需插件、通过浏览器即可在线使用各种软件的（比如Office系列、Photoshop、AutoCAD以及企业定制应用）的软件服务平台。
> EaaS SDK 是将在线编辑服务以SDK的形式开放出来，供企业、团队研发的业务系统进行集成，实现业务系统无插件在线编辑文档的需求。

# 环境准备
- 线上使用EaaS，您需要预先下载桐享官方提供的demo程序；
- 您需要在本地运行web容器，常见容器有Httpd、Apache、IIS、NodeJS、 Nginx；
- 测试浏览器需要支持[WebRTC技术](https://baike.baidu.com/item/WebRTC/5522744)，浏览器支持情况参考[这些文章](https://blog.csdn.net/haibin8805/article/details/80620417)

# 获得 SDK
> 1. 通过官网下载, 地址: http://www.sharetome.com/eaas-sdk-demo.zip
> 2. 通过添加EaaS SDK二次开发群文件获取,QQ群:257411520 ;
> 3. 通过Github获取, 地址: https://github.com/haibin05/eaas-sdk-demo.git
> 4. 通过码云获取, 地址: https://gitee.com/sharetome/eaas-sdk-demo.git

# 使用 EaaS SDK
### 以下代码示例展示了前端JavaScript调用 EaaS SDK的主要步骤，前端UI开发有2种方式，分别介绍:
---
> ### 默认编辑页面 (无需关心SDK的调用，快速搭建，推荐使用)
> 目录结构
> >root  
> > │  index.html  
> > ├─css  
> > │      bootstrap.min.css  
> > │      sample.css  
> > └─js  
> >     ├─demo  
> >     │      sample.js  
> >     └─util  
> >             base64.min.js  
> >             encoding-indexes.js  
> >             encoding.js  
> >             jquery-3.2.1.min.js  


1. 页面参数准备(index.html)
```
<div class="card-body">
  <div class="form-group">
    <label for="appid">App ID (默认打开Word2010)</label>
    <input type="text" id="appid" name="appid" value="APP00001" class="form-control">
  </div>
  
  <div class="form-group">
    <label for="">User ID</label>
    <input type="text" id="userid" name="userid" value="eaas-sdk" class="form-control">
  </div>

  <div class="form-group">
    <button id="btn-start" class="btn btn-primary btn-block">启动线上Word</button>
  </div>
</div>
```
2. 编辑会话启动准备（sample.js）
```
$('#btn-start').click(function () {
var appId = $('#appid').val();
var userId = $('#userid').val();

var qs = {
  appId: appId,     // EaaS 分配给Client的APP信息，定制请联系谐桐管理员
  userId: userId    // 业务系统中的用户ID
};
$.ajax({
  type: "POST",
  url: __OPEN_APP_URL,
  dataType: 'json',
  data: JSON.stringify(qs),
  headers: {
    "content-type": 'application/json'
  }
}).done(function (json) {
...
```
3. 打开独立编辑页面（sample.js）
```
...
if (json.success) {
var info = json.data;

// 数据格式固定， EaaS必须参数
var params = JSON.stringify({
  "isParticipantMode": false,
  "readOnly": info.readOnly,
  "sessionId": info.sessionId,
  "correlatedSessionId": info.correlatedSessionId,
  "gwHost": info.gwHost,
  "gwPort": info.gwPort,
  "mcuUrl": info.mcuUrl,
  "sessionMgrUrl": info.sessionMgrUrl,
  "clientId": info.clientId,
  "clientToken": info.token,
  "userId": userId,
  "userNickname": __EAAS_FAKE_INFO.userNickname,
  "userToken": __EAAS_FAKE_INFO.userToken
});

var code = (Base64.encode(params) + "").replace(/\//g, '_');  // 将服务器返回的数据通过Base64进行编码，作为参数传递给EaaS服务器
var eaas = __EAAS_HOST + '/eaas/workspace/' + code;    // 组装打开在线应用访问地址，访问EaaS服务器
window.location.replace(eaas);
...
```
---
> ### 自定义UI组件（需要了解 SDK 内部实现，深度定制）
- ### Demo页面
---
