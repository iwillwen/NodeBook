# Web.js: Simple HTTP / TCP development framework. #

For detailed information about this, please visit the [Web.js homepage]. 如果想获得详细的关于Web.js的信息，请浏览官方网页。

# Install #
```
$ npm install webjs
```
# Quick Start #
```javascript
var web = require('webjs');

var urlRouter = {                   //URL路由功能(包括文件映射和域名跳转)
        '^(.*)' : 'page.html', //Return the 'page.html' data. 返回 'page.html' 的数据。(支持正则表达式)
        '^google' : 'http://www.google.com' //When the path name is 'google', the browser will redirect to Google homepage.  当访问/google时，浏览器自动跳转到Google首页。
        },
    getRouter = {                   //GET方法服务器响应
        'getsomething' : function (req, res) {
                    for (var key in req.qs) {
                        res.send(key + ' : ' + req.qs[key], true);      //res.send 方法接受两个参数，第一个是需要传输的数据，第二个是确定是否保持通讯不中断，以供继续传输。
                    }
                    res.send('That all');
                }
        },
    postRouter = {
        'postsomething' : function (req, res) {   //POST方法服务器响应
                    res.send('Post success<br />' + JSON.stringify(req.data));
                }
        };
web.run(urlRouter, 80)  //启动首个服务器，并传入传入URL映射规则
    .get(getRouter) //传入GET方法规则
    .post(postRouter);  //传入POST方法规则
```
# 简单化部署 Simple Deployment #

如果你只想在某个文件夹内建立一个简单的文件服务器，那是非常简单的。 If you only want to deploy a simple file server, that's very easy!
```javascript
require('webjs').run()
```
没错的，就是这么简单。

# URL路由映射 #

## Web.js提供了十分简单的URL路由映射方法  ##
```javascript
var web = require('webjs');

var urlRouter = {
        '\:year\:mouth\:day\:id.jpg' : '$1-$2-$3-$4.jpg',  // YYYY/MM/DD/NUM.jpg -> YYYY-MM-DD-NUM.jpg
        '\:action' : 'main.html?action=$1'                // /get -> main.html?action=get
        };
web.run(urlRouter, 8888);
```
# HTTP方法 #

## GET ##
```javascript
var web = require('webjs');

var getRouter = {
        'getQuerystring' : function (req, res) {            //传入三个参数，分别为Request, Response, QueryString
                    res.sendJSON(req.qs);           //res.sendJSON()方法可以直接传入Array, Object, String的JSON对象
                },
        'getQueryURL' : function (req, res) {
                    res.send(req.url);          //res.send()方法可以只能传入String数据
                },
        'getFile' : function (req, res) {
                    res.sendFile(req.qs.file);          //res.sendFile()方法只能传入含有文件名的String对象，不需要'./'
                }
        };                              //GET方法规则的Key也支持正则表达式，但不建议使用

web.run({}, 8888)                               //传入空URL路由规则
    .get(getRouter);                            //传入GET方法规则
```
## POST ##
```javascript
var web = require('webjs');

var postRouter = {
        'postHello' : function (req, res) {           //与GET方法规则相同，data为POST请求的数据，并非QueryString
                    res.send('Hello ' + req.data.name + '!');
                }
        };

web.run({}, 8888)
    .post(postRouter);                          //传入POST方法规则
```
## HTTPS ##

HTTPS方法与HTTP方法相同
```javascript
var web = require('webjs');
var urlRouter = {
        '^(.*)' : 'page.html',
        '^google' : 'http://www.google.com'
        },
    getRouter = {
        'getQuerystring' : function (req, res) {
                    res.sendJSON(req.qs);
                },
        'getQueryURL' : function (req, res) {
                    res.send(req.url);
                },
        'getFile' : function (req, res) {
                    res.sendFile(req.qs.file);  
                }
        },
    postRouter = {
        'postHello' : function (req, res) {
                    res.send('Hello ' + req.data.name + '!');
                }
        };
web.runHttps(urlRouter, 8888)
    .get(getRouter)
    .post(postRouter);
```

## 404 Page ##
```javascript
web.set404('404.html');                             //传入一个文件名
```
## noMimes 禁止某些文件类型 ##
```javascript
var noMimes = {
        'php' : function (req, res){                    //只传入Request和Response
                res.send('You can`t request any PHP files');
            },
        'exe' : function (req, res){
                res.send('You can`t request any EXE files');
            },
        'sh' : function (req, res){
                res.send('You can`t request any SH files');
            }
        };
web.noMimes(noMimes);
```
自定义 MIME 类型

```javascript
web.reg('webp', 'image/webp');
```
详细文档正在编写中