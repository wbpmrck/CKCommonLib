﻿/*
作者： kaicui

依赖： Jquery
使用说明：
1、自定义的对事件处理进行扩展的核心类
-----------
版本历史：
2012年3月23日9:58:10       添加了对触屏单机事件的支持：touchClick。可以区分单击和touchend了。

2012年3月16日10:10:09      添加对鼠标左移和右移的处理
1由于IE浏览器目前对标准支持的不好，所以不支持触屏滑动事件的处理
2、提供API进行触屏通用事件的绑定，以及左滑和右滑事件绑定
3、左滑和右滑函数，可以在回调中获得当前滑动位置以及滑动方向{ PagePos: {X:1,Y:1}, Direction: "left"/"right" }，设置滑动的横向和纵向敏感度等。
4、但是要注意目前的实现方式，所有参数都是最后一次设置的为准。

2012年3月12日  9:14:12      版本创建
//////////////////////////////////////////////////////////////////*/


//对Jquery进行扩展，提供对触屏事件的扩展
jQuery.fn.extend({
    touchstart: function (handler, buble) {
        buble = buble || true;
        this.each(function () {
            if (this.addEventListener) {
                this.addEventListener('touchstart', handler, buble);
            }
        });
    },
    touchmove: function (handler, buble) {
        buble = buble || true;
        this.each(function () {
            if (this.addEventListener) {
                this.addEventListener('touchmove', handler, buble);
            }
        });
    },
    touchend: function (handler, buble) {
        buble = buble || true;
        this.each(function () {
            if (this.addEventListener) {
                this.addEventListener('touchend', handler, buble);
            }
        });
    },
    touchcancel: function (handler, buble) {
        buble = buble || true;
        this.each(function () {
            if (this.addEventListener) {
                this.addEventListener('touchcancel', handler, buble);
            }
        });
    },
    touchClick: function (handler, buble) {
        buble = buble || true;
        var _pushPos = { X: 0, Y: 0 }; //记录按下的位置
        var _upPos = { X: 0, Y: 0 }; //记录弹起的位置
        //获取 event事件里的坐标对象
        var _getEvtPt = function (evt) {
            if (evt.touches.length > 0) {
                var touchobj = evt.touches[0];
                return {
                    X: touchobj.pageX,
                    Y: touchobj.pageY
                };
            }
            else if (evt.changedTouches.length > 0) {
                var touchchangeobj = evt.changedTouches[0];
                return {
                    X: touchchangeobj.pageX,
                    Y: touchchangeobj.pageY
                };
            }
            else
                return { X: 0, Y: 0 };
        };
        var _judgeClick = function () {
            if (Math.abs(_pushPos.X - _upPos.X) < 10 && Math.abs(_pushPos.Y - _upPos.Y) < 10)
                return true;
            else
                return false;
        };
        var _dealstart = function (evt) {
            if (evt.touches.length > 0) {
                _pushPos = _getEvtPt(evt);
            }
        };
        var _dealend = function (evt) {
            _upPos = _getEvtPt(evt);
            //            MyCore.Log.writeConsole(_pushPos.X + ',' + _pushPos.Y);
            //            MyCore.Log.writeConsole(_upPos.X + ',' + _upPos.Y);
            if (_judgeClick()) {
                if (handler)
                    handler.call(this);
            }
        };
        this.each(function () {
            if (this.addEventListener) {
                this.addEventListener('touchend', _dealend, buble);
                this.addEventListener('touchstart', _dealstart, buble);
            }
        });
    },
    //触屏滑动事件[direcction：1左 2右 3左+右]
    swipe: function (direction, handler, sensitiveH, sensitiveV, buble) {
        buble = buble || true;
        sensitiveH = sensitiveH || 30; //水平方向最小敏感宽度
        sensitiveV = sensitiveV || 80; //竖直方向最大误差。再大则不认为是滑动

        //获取 event事件里的坐标对象
        var _getEvtPt = function (evt) {
            if (evt.touches.length > 0) {
                var touchobj = evt.touches[0];
                return {
                    X: touchobj.pageX,
                    Y: touchobj.pageY
                };
            }
            else
                return { X: 0, Y: 0 };
        };
        //清空参数
        var _clearPara = function (para) {
            if (para) {
                para.originPos.X = 0;
                para.originPos.Y = 0;
                para.originPos.isSwipeing = false;
            }
        };
        //获取元素上存储的滑动相关数据
        var _getParams = function (obj) {
            var jqo = $(obj);
            var para = {};
            if (jqo.data) {
                return jqo.data('MyCore.Event.Swipe');
                //                if (!para) {
                //                    para = { sensitiveH: 30, sensitiveV: 30, originPos: { X: 0, Y: 0 }, isSwipeing: false, handler: function () { alert("not defined handler for swipe! by kaicui"); } };
                //                }
            }
            //            return para;
        };

        //设置滑动相关数据
        var _setParams = function (obj, para) {
            var jqo = $(obj);
            if (jqo.data) {
                jqo.data('MyCore.Event.Swipe', para);
            }
        };
        //当多次设置滑动时，可能合并滑动标记
        var _mergeDirection = function (d1, d2) {
            if (d1 != d2)
                return 3;
            else
                return d1;
        };
        //初始化参数
        var _init = function (obj, sH, sV, evtHandler, direction) {
            var jqo = $(obj);
            var binded = false; //标识是否已经进行过绑定
            if (jqo.data) {
                var para = _getParams(obj); //看是否已经设置了滑动
                var newDirect = direction;
                if (para) {
                    binded = true;
                    newDirect = _mergeDirection(para.direct, direction);
                }
                para = { sensitiveH: sH, sensitiveV: sV, originPos: { X: 0, Y: 0 }, isSwipeing: false, handler: evtHandler, direct: newDirect };
                jqo.data('MyCore.Event.Swipe', para);
            }
            return binded;
        };
        var _dealstart = function (evt) {
            evt.preventDefault();
            if (evt.touches.length > 0) {
                var nowPt = _getEvtPt(evt);
                var para = _getParams(this);
                para.originPos.X = nowPt.X;
                para.originPos.Y = nowPt.Y; //记录滑动开始位置，用于判断是否左右滑动使用
                para.isSwipeing = true; //滑动模式为开启
                _setParams(this, para);
            }
        };
        var _dealmove = function (evt) {
            evt.preventDefault();
            //获取数据
            var para = _getParams(this);
            //判断是否滑动模式
            if (para.isSwipeing) {
                //判断纵向偏移是否越界
                var nowPt = _getEvtPt(evt);
                var Ydis = Math.abs(nowPt.Y - para.originPos.Y);
                if (Ydis > para.sensitiveV) {
                    _clearPara(para);
                    _setParams(this, para);
                    return;
                }
                else {
                    var Xdis = (nowPt.X - para.originPos.X);
                    var XdisAbs = Math.abs(Xdis);
                    var nowDirection = Xdis < 0 ? "left" : "right";
                    //判断横向或者偏移量是否足够，根据当前的方向设定
                    if (para.direct == 3) {
                        //                        alert("direct == 3 XdisAbs=" + XdisAbs);
                        if (XdisAbs > para.sensitiveH) {
                            if (para.handler)
                                para.handler({ PagePos: nowPt, Direction: nowDirection }); //将当前坐标作为回调参数
                        }
                    }
                    else if (para.direct == 1) {
                        //                        alert("direct == 1 Xdis=" + Xdis);
                        if (XdisAbs > para.sensitiveH && Xdis < 0) {
                            if (para.handler)
                                para.handler({ PagePos: nowPt, Direction: nowDirection }); //将当前坐标作为回调参数
                        }
                    }
                    else {
                        //                        alert("direct == 2 Xdis=" + Xdis);
                        if (XdisAbs > para.sensitiveH && Xdis > 0) {
                            if (para.handler)
                                para.handler({ PagePos: nowPt, Direction: nowDirection }); //将当前坐标作为回调参数
                        }
                    }
                }
            }
        };
        var _dealend = function (evt) {
            var para = _getParams(this);
            _clearPara(para); //滑动模式结束
            _setParams(this, para);
        };
        this.each(function () {
            //左侧滑动的条件：touchstart后，move了超过sensitive像素.touchend或者touchcancel的时候结束
            if (this.addEventListener) {
                var binded = _init(this, sensitiveH, sensitiveV, handler, direction); //init函数，不仅负责初始化数据，还负责检测用户是否已经绑定了监听事件，有的话就不重复绑定
                if (!binded) {
                    this.addEventListener('touchcancel', _dealend, buble);
                    this.addEventListener('touchend', _dealend, buble);
                    this.addEventListener('touchmove', _dealmove, buble);
                    this.addEventListener('touchstart', _dealstart, buble);
                }
            }
        });
    },
    //触屏右滑事件
    swiperight: function (handler, sensitiveH, sensitiveV, buble) {
        this.swipe(2, handler, sensitiveH, sensitiveV, buble);
    },
    //触屏左滑事件
    swipeleft: function (handler, sensitiveH, sensitiveV, buble) {
        this.swipe(1, handler, sensitiveH, sensitiveV, buble);
    }
});


var MyCore = (function (my) {
    return my;
} (MyCore || {}))

MyCore.Event = (function (my) {
    //事件绑定
    my.addEvent = document.addEventListener ?
  function (element, type, fn) {
      element.addEventListener(type, fn, false);
  } :
 function (element, type, fn) {
     element.attachEvent("on" + type, fn);
 },

    //事件解除绑定
    my.removeEvent = document.removeEventListener ?
  function (element, type, fn) {
      element.removeEventListener(type, fn, false);
  } :

  function (element, type, fn) {
      element.detachEvent("on" + type, fn);
  };
    return my;
} (MyCore.Event || {}))