
/// <reference path="demo/JS/jquery-1.7.1.min.js" />
/*
作者： kaicui
依赖： Jquery,开源组件BlockUI
使用说明：
提供对页面进行遮罩的功能

--------------------------------------
版本历史：

2012年6月26日10:05:35      代码重构
1、修改所有对外API首字母小写

2012年4月24日15:24:09      添加功能
1、添加了对元素进行遮罩并在指定时间后自动解开的功能，支持传入回调函数来根据剩余描述修改UI


2012年3月29日17:33:33      版本创建
1、添加第一个功能：buttonTipBlock,对页面进行局部遮罩，并且可以修改某个按钮Div的text(通常是个等待文本),并且记录下该
按钮之前的文本。当用户需要取消遮罩时，再还原其文本
//////////////////////////////////////////////////////////////////*/

var MyUI = (function (my) {
    return my;
} (MyUI || {}))

MyUI.Block = (function (my) {
    //此功能用于遮罩一个元素，并持续若干秒后自动解锁。期间每秒钟都会向外部发送通知，用于外部更新UI
    //回调函数参数：seconds[剩余秒数]
    //PS:使用时需要注意：遮罩元素最好用一个容器包裹起来，传入ele为容器id.如果只有元素自身，则遮盖后仍然是可以点击的。（遮罩只能盖住元素内部的东西）
    my.blockForSeconds = function (eleID, seconds, callback) {
        var leftTime = seconds;
        var _perSecondsDo = function () {
            leftTime--;
            if (leftTime == 0) {
                DiyblockUIWrap.RegionUnblock(eleID);
                clearInterval(timer);
            }
            if (callback)
                callback(leftTime);
        };
        DiyblockUIWrap.RegionBlock(eleID);
        var timer = setInterval(_perSecondsDo, 1000);
        if (callback)
            callback(leftTime);
        //返回控制对象
        return {
            Disable: function () {
                DiyblockUIWrap.RegionUnblock(eleID);
                clearInterval(timer);
            }
        };
    };
    //此功能用于遮罩一个容器元素，并且利用另外一个元素来展示提示信息。通常用户在登录或者后台业务处理时，改变一个提示文本，然后
    //等功能处理完成后，取消block
    var _btnTipBlockDo = function (containerid, tipBtnid, msg) {
        var Container = $("#" + containerid), Btn = $("#" + tipBtnid);
        var oldText = Btn.length > 0 ? Btn.text() : "";
        var _btnTipUnBlockDo = function () {
            DiyblockUIWrap.RegionUnblock(containerid);
            if (Btn.length > 0)
                Btn.text(oldText);
        };
        //如果需要提示按钮，则在按钮上进行提示
        if (Btn.length > 0)
            Btn.text(msg);
        DiyblockUIWrap.RegionBlockAndWaiting(containerid);
        return {
            UnBlock: function () {
                _btnTipUnBlockDo();
            }
        };
    };
    //    var _btnTipUnBlockDo = {};
    my.btnTipBlock = function (para) {
        return _btnTipBlockDo(para.ContainerID, para.TipBtnID, para.Msg);
    };
    return my;
} (MyUI.Block || {}))