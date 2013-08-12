
/// <reference path="demo/JS/jquery-1.7.1.min.js" />
/*
作者： kaicui
依赖： JQuery
使用说明：
------------------------
版本历史：
2012年6月26日10:05:35      代码重构
1、修改所有对外API首字母小写

2012年4月25日18:31:31      添加功能
1、	在一定时间范围内修改元素的属性，在规定时间到了之后，还原元素的属性

2012年3月31日19:56:50      添加功能
1、添加bgFlick：给指定元素设定点击后短时间内高亮提示的功能。多用于手机上，显示用户点击了某个区域

2012年3月31日19:56:44      版本创建
//////////////////////////////////////////////////////////////////*/

var MyUI = (function (my) {
    return my;
} (MyUI || {}))

MyUI.Effect = (function (my) {
    var _bgFlick = function (ele, color, time, callback) {
        if (!ele)
            return;
        var eleObj = $(ele);
        //如果已经在做动画，则退出
        var isDo = eleObj.data("_bgFlick_isDo");
        if (isDo) {
            return;
        }
        eleObj.data("_bgFlick_isDo", true);
        //记下当前背景色
        var nowColor = eleObj.css('backgroundColor');
        //更换元素背景色
        eleObj.css('backgroundColor', color);
        //一段时间后恢复背景色
        setTimeout(function () { eleObj.css('backgroundColor', nowColor); eleObj.data("_bgFlick_isDo", false); if (callback) callback(); }, time * 1000);

    };
    //元素闪烁API:改变元素的背景色，持续一段时间还原
    my.bgFlick = function (para) {
        return _bgFlick(
        para.ele, //dom元素
        para.color || "#green", //背景色
        para.time || 1, //持续时间
        para.callback || undefined); //效果结束后回调
    };
    //滚动到页面最顶部
    my.scrollToTop = function () {
        window.scrollTo(0);
    };
    //向上滚动
    my.scrollUp = function (y) {
        window.scrollBy(0, -y);
    };
    //向下滚动
    my.scrollDown = function (y) {
        window.scrollBy(0, y);
    };
    //向上滚动到y
    my.scrollUpTo = function (y) {
        window.scrollTo(0, y);
    };
    //在指定时间内修改元素的指定属性，时间到期后还原
    my.changeForSeconds = function (eleID, changeAttr,changeCss, seconds, callback) {
        var leftTime = seconds;
        var obj = $("#" + eleID);
        var attrSaver = {}; //保存修改前的属性
        var styleSaver = {}; //保存修改前的样式
        //还原对象属性
        var _reset = function () {
            for (var item in attrSaver) {
                obj.attr(item, attrSaver[item]);
            }
            for (var item in styleSaver) {
                obj.css(item, styleSaver[item]);
            }
            clearInterval(timer);
            if (callback)
                callback(0);
        };
        //修改对象属性
        var _set = function () {
            if (changeAttr) {
                for (var item in changeAttr) {
                    attrSaver[item] =  obj.attr(item);
                    obj.attr(item, changeAttr[item]);
                }
            }
            if (changeCss) {
                for (var item in changeCss) {
                    styleSaver[item] = obj.css(item);
                    obj.css(item, changeCss[item]);
                }
            }
        };
        var _perSecondsDo = function () {
            leftTime--;
            if (leftTime == 0) {
                _reset();
            }
            if (callback)
                callback(leftTime);
        };
        _set();
        var timer = setInterval(_perSecondsDo, 1000);
        if (callback)
            callback(leftTime);
        //返回控制对象
        return {
            Reset: function () {
                _reset();
            }
        };
    };
    return my;
} (MyUI.Effect || {}))