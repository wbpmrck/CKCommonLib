/*
作者： kaicui

依赖： Jquery
使用说明：
1、自定义的对文档和窗口大小进行获取的类
-----------
版本历史：


2012年3月25日10:18:02      版本创建
//////////////////////////////////////////////////////////////////*/

var MyCore = (function (my) {
    return my;
} (MyCore || {}))

MyCore.WindowSize = (function (my) {
    //查询浏览器窗口在电脑桌面的坐标（但经测试发现，在IE和Opera下为可视化窗口在电脑桌面坐标）
    //IE,safari,opera
    if (window.screenLeft != undefined) {
        my.getWindowX = function () { return window.screenLeft; };
        my.getWindowY = function () { return window.screenTop; };
    }
    //firefox,safari
    else if (window.screenX != undefined) {
        my.getWindowX = function () { return window.screenX; };
        my.getWindowY = function () { return window.screenY; };
    }

    //查询可视化窗口大小，文档的水平垂直滚动距离
    //all browser but IE
    if (window.innerWidth != undefined) {
        my.getViewportWidth = function () { return window.innerWidth; };
        my.getViewportHeight = function () { return window.innerHeight; };
        my.getHorizontalScroll = function () { return window.pageXOffset; };
        my.getVerticalScroll = function () { return window.pageYOffset; };
    }
    //IE
    else if (document.documentElement != undefined && document.documentElement.clientWidth != undefined) {
        my.getViewportWidth = function () { return document.documentElement.clientWidth; };
        my.getViewportHeight = function () { return document.documentElement.clientHeight; };
        my.getHorizontalScroll = function () { return document.documentElement.scrollLeft; };
        my.getVerticalScroll = function () { return document.documentElement.scrollTop; };
    }
    //IE6 without a DOCTYPE
    else if (document.body.clientWidth != undefined) {
        my.getViewportWidth = function () { return document.body.clientWidth; };
        my.getViewportHeight = function () { return document.body.clientHeight; };
        my.getHorizontalScroll = function () { return document.body.scrollLeft; };
        my.getVerticalScroll = function () { return document.body.scrollTop; };
    }

    //查询文档的实际高度和宽度
    if (document.documentElement != undefined && document.documentElement.scrollWidth != undefined) {
        my.getDocumentWidth = function () { return document.documentElement.scrollWidth; };
        my.getDocumentHeight = function () { return document.documentElement.scrollHeight; };
    }
    else if (document.body.scrollWidth != undefined) {
        my.getDocumentWidth = function () { return document.body.scrollWidth; };
        my.getDocumentHeight = function () { return document.body.scrollHeight; };
    }
    return my;
} (MyCore.WindowSize || {}))