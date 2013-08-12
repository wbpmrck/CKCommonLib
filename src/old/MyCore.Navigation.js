/*
作者： kaicui
依赖： MyCore.Url.js
使用说明：关于浏览器导航相关的功能类库
-------------------------------------------------------------
版本历史：
2012年6月26日9:54:57       代码重构
1、更新方法名为首字母小写，更新Demo

2012年3月29日20:08:47      版本创建
1、添加newWindow 方法，用于打开一个新窗口
//////////////////////////////////////////////////////////////////*/

var MyCore = (function (my) {
    return my;
} (MyCore || {}))

MyCore.Navigation = (function (my) {
    //浏览器刷新
    my.refresh = function () {
        window.location.reload();
    };
    //浏览器回退
    my.back = function () {
        window.history.back();
    };
    //浏览器打开新窗口
    my.newWindow = function (url, name, features, replace) {
        window.open(url, name, features, replace);
    };
    //浏览器前进
    my.forward = function () {
        window.history.forward();
    };
    //跳转到某个地址
    my.redirectTo = function (url) {
        window.location.href = url;
    };
    //获取浏览器地址
    my.getCurUrl = function () {
        return window.location.href.toString();
    };
    //跳转到指定Action,支持传入参数对象,并对参数进行编码
    my.redirectToAction = function (action, controller, paras) {
        var url = MyCore.Url.action(action, controller, paras);
        my.redirectTo(url);
    };
    return my;
} (MyCore.Navigation || {}))