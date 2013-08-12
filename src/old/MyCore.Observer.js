/*
作者： kaicui
依赖： 无
使用说明：用于实现观察者模式
1、emit方法现在最多只支持传入6个参数
版本历史：


2012年10月23日15:43:44      版本创建
//////////////////////////////////////////////////////////////////*/

var MyCore = (function (my) {
    return my;
} (MyCore || {}))

MyCore.Observer = (function (my) {

    function Contructor() {
        var self = this;

        //初始化订阅功能
        self.subscribers = {}; //订阅者集合,结构：{eventID1:[func1,func2,func3],eventID2:[func1,func2,func3]},添加进来的时候，每个func下建立隐藏属性，表示函数所在的对象引用

        //订阅某个事件,
        self.on = function (evtID, callback, thisRef) {
            var subscriberArray = self.subscribers[evtID];
            if (!subscriberArray) {
                this.subscribers[evtID] = subscriberArray = [];
            }

            //否则添加订阅
            callback._subscribeOwnerRef = thisRef;
            subscriberArray.push(callback);

        };
        //退订某个事件(如果不传入callback,则取消所有该事件的订阅)
        self.off = function (evtID, callback) {

            var subscriberArray = self.subscribers[evtID];
            if (!subscriberArray) {
                self.subscribers[evtID] = subscriberArray = [];
            }
            //如果该对象曾经订阅过，则退订
            for (var i = 0, j = subscriberArray.length; i < j; i++) {
                if (!callback || subscriberArray[i] === callback)
                    delete (subscriberArray[i]);
            }
        };
        //触发事件
        self.emit = function (evtID, data1,data2,data3,data4,data5,data6) {
            
            var subscriberArray = self.subscribers[evtID];
            if (!subscriberArray) {
                self.subscribers[evtID] = subscriberArray = [];
            }

            //执行所有事件的订阅函数
            for (var i = 0, j = subscriberArray.length; i < j; i++) {
                var handler = subscriberArray[i];
                if (typeof handler === 'function') {
                    handler.call(handler._subscribeOwnerRef || window, data1, data2, data3, data4, data5, data6);
                }
            }

            //执行订阅了*事件的函数
            var subAllArray = self.subscribers['*'];
            if (!subAllArray) {
                self.subscribers['*'] = subAllArray = [];
            }
            for (var i = 0, j = subAllArray.length; i < j; i++) {
                var handler = subAllArray[i];
                if (typeof handler === 'function') {
                    handler.call(handler._subscribeOwnerRef || window, evtID, data1, data2, data3, data4, data5, data6);
                }
            }
        };
    }

    my.createObserver = function () {
        return new Contructor();
    };
    return my;
} (MyCore.Observer || {}));