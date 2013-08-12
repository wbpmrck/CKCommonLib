/*
作者： kaicui
依赖： 
使用说明：UI所使用的动画特效基础类
版本历史：
2012年3月31日19:56:50      添加功能
1、添加js缓动动画API

2012年3月31日19:56:44      版本创建
//////////////////////////////////////////////////////////////////*/

var MyUI = (function (my) {
    return my;
} (MyUI || {}))

MyUI.AnimateBase = (function (my) {
    /**
    * @param {HTMLElement/Function} obj 属性时：动画对象; 方法时: 方法引用
    * @param {Object} params 属性时：{属性: 结束值}; 方法时：{startArgs: 初始参数[数组], endArgs: 结束参数[数组]};
    * @param {Number} duration 动画总时长，单位为毫秒
    * @param {String} type 动画类型，默认为linear，具体值参考tween下的属性名
    * @param {Function} callback 动画结束时执行的回调函数
    */
    my.animate = function (obj, params, duration, type, callback) {
        window.requestAnimationFrame = (function () {
            return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (callback) {
              window.setTimeout(callback, 1000 / 60);
          };
        })();

        var tween = {
            linear: function (pos) {
                return 1;
            },
            easeInQuad: function (pos) {
                return Math.pow(pos, 2);
            },
            easeOutQuad: function (pos) {
                return -(Math.pow((pos - 1), 2) - 1);
            },
            easeInOutQuad: function (pos) {
                if ((pos /= 0.5) < 1)
                    return 0.5 * Math.pow(pos, 2);
                return -0.5 * ((pos -= 2) * pos - 2);
            },
            easeInCubic: function (pos) {
                return Math.pow(pos, 3);
            },
            easeOutCubic: function (pos) {
                return (Math.pow((pos - 1), 3) + 1);
            },
            easeInOutCubic: function (pos) {
                if ((pos /= 0.5) < 1)
                    return 0.5 * Math.pow(pos, 3);
                return 0.5 * (Math.pow((pos - 2), 3) + 2);
            },
            easeInQuart: function (pos) {
                return Math.pow(pos, 4);
            },
            easeOutQuart: function (pos) {
                return -(Math.pow((pos - 1), 4) - 1)
            },
            easeInOutQuart: function (pos) {
                if ((pos /= 0.5) < 1)
                    return 0.5 * Math.pow(pos, 4);
                return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
            },
            easeInQuint: function (pos) {
                return Math.pow(pos, 5);
            },
            easeOutQuint: function (pos) {
                return (Math.pow((pos - 1), 5) + 1);
            },
            easeInOutQuint: function (pos) {
                if ((pos /= 0.5) < 1)
                    return 0.5 * Math.pow(pos, 5);
                return 0.5 * (Math.pow((pos - 2), 5) + 2);
            },
            easeInSine: function (pos) {
                return -Math.cos(pos * (Math.PI / 2)) + 1;
            },
            easeOutSine: function (pos) {
                return Math.sin(pos * (Math.PI / 2));
            },
            easeInOutSine: function (pos) {
                return (-.5 * (Math.cos(Math.PI * pos) - 1));
            },
            easeInExpo: function (pos) {
                return (pos == 0) ? 0 : Math.pow(2, 10 * (pos - 1));
            },
            easeOutExpo: function (pos) {
                return (pos == 1) ? 1 : -Math.pow(2, -10 * pos) + 1;
            },
            easeInOutExpo: function (pos) {
                if (pos == 0)
                    return 0;
                if (pos == 1)
                    return 1;
                if ((pos /= 0.5) < 1)
                    return 0.5 * Math.pow(2, 10 * (pos - 1));
                return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
            },
            easeInCirc: function (pos) {
                return -(Math.sqrt(1 - (pos * pos)) - 1);
            },
            easeOutCirc: function (pos) {
                return Math.sqrt(1 - Math.pow((pos - 1), 2))
            },
            easeInOutCirc: function (pos) {
                if ((pos /= 0.5) < 1)
                    return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
                return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
            },
            easeOutBounce: function (pos) {
                if ((pos) < (1 / 2.75)) {
                    return (7.5625 * pos * pos);
                } else if (pos < (2 / 2.75)) {
                    return (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
                } else if (pos < (2.5 / 2.75)) {
                    return (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
                } else {
                    return (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
                }
            },
            easeInBack: function (pos) {
                var s = 1.70158;
                return (pos) * pos * ((s + 1) * pos - s);
            },
            easeOutBack: function (pos) {
                var s = 1.70158;
                return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
            },
            easeInOutBack: function (pos) {
                var s = 1.70158;
                if ((pos /= 0.5) < 1)
                    return 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s));
                return 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
            },
            elastic: function (pos) {
                return -1 * Math.pow(4, -8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
            },
            swingFromTo: function (pos) {
                var s = 1.70158;
                return ((pos /= 0.5) < 1) ? 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s)) : 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
            },
            swingFrom: function (pos) {
                var s = 1.70158;
                return pos * pos * ((s + 1) * pos - s);
            },
            swingTo: function (pos) {
                var s = 1.70158;
                return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
            },
            bounce: function (pos) {
                if (pos < (1 / 2.75)) {
                    return (7.5625 * pos * pos);
                } else if (pos < (2 / 2.75)) {
                    return (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
                } else if (pos < (2.5 / 2.75)) {
                    return (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
                } else {
                    return (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
                }
            },
            bouncePast: function (pos) {
                if (pos < (1 / 2.75)) {
                    return (7.5625 * pos * pos);
                } else if (pos < (2 / 2.75)) {
                    return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
                } else if (pos < (2.5 / 2.75)) {
                    return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
                } else {
                    return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
                }
            },
            easeFromTo: function (pos) {
                if ((pos /= 0.5) < 1)
                    return 0.5 * Math.pow(pos, 4);
                return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
            },
            easeFrom: function (pos) {
                return Math.pow(pos, 4);
            },
            easeTo: function (pos) {
                return Math.pow(pos, 0.25);
            },
            linear: function (pos) {
                return pos
            },
            sinusoidal: function (pos) {
                return (-Math.cos(pos * Math.PI) / 2) + 0.5;
            },
            reverse: function (pos) {
                return 1 - pos;
            },
            mirror: function (pos, transition) {
                transition = transition || tween.sinusoidal;
                if (pos < 0.5)
                    return transition(pos * 2);
                else
                    return transition(1 - (pos - 0.5) * 2);
            },
            flicker: function (pos) {
                var pos = pos + (Math.random() - 0.5) / 5;
                return tween.sinusoidal(pos < 0 ? 0 : pos > 1 ? 1 : pos);
            },
            wobble: function (pos) {
                return (-Math.cos(pos * Math.PI * (9 * pos)) / 2) + 0.5;
            },
            pulse: function (pos, pulses) {
                return (-Math.cos((pos * ((pulses || 5) - .5) * 2) * Math.PI) / 2) + .5;
            },
            blink: function (pos, blinks) {
                return Math.round(pos * (blinks || 5)) % 2;
            },
            spring: function (pos) {
                return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
            },
            none: function (pos) {
                return 0;
            }
        };

        my.animate = function (obj, params, duration, type, callback) {
            var startValue = {}, //初始值
            changeValue = null, //总变化量
            startTime = new Date().getTime(),
            ease = tween[type || 'linear'];

            if (typeof obj !== 'function') {
                obj = obj.style;
                for (var name in params) {
                    startValue[name] = getStyle(obj, name);
                }
                changeValue = {};
                for (name in params) {
                    changeValue[name] = params[name] - startValue[name];
                }
            } else {
                changeValue = [];
                var startArgs = params.startArgs,
                endArgs = params.endArgs,
                toString = Object.prototype.toString;
                for (var i = 0, len = startArgs.length; i < len; i++) {
                    changeValue[i] = endArgs[i] - startArgs[i];
                }
            }

            var run = function () {
                var timeStamp = new Date().getTime() - startTime,
                factor = ease(timeStamp / duration); //增量系数
//                if (!(toString.call(changeValue) === '[object Array]')) {
                    if (!(changeValue.toString() === '[object Array]')) {
                    for (name in params) {
                        obj[name] = (changeValue[name] * factor + startValue[name]) + 'px'; //套公式吧，亲
                    }
                    }else {
                    var curArgs = [];
                    for (i = 0; i < len; i++) {
                        curArgs[i] = changeValue[i] * factor + startArgs[i];
                    }
                    obj.apply(null, curArgs);
                }
                if (factor < 1) {
                    window.requestAnimationFrame(run);
                } else {
                    if (callback) callback();
                }
            };
            window.requestAnimationFrame(run);
        }
        my.animate(obj, params, duration, type, callback);
    };

    var getStyle = function (el, style) {
        var value = null;
        if (window.defaultView) {
            value = window.getComputedStyle(el, null).getPropertyValue(style);
        } else {
            style = style.replace(/\-(\w)/g, function ($0, $1) {
                return $1.toUpperCase();
            });
//            value = el.currentStyle[style];
            value = el[style];
            if (value === 'auto') {
                value = '0';
            }
        }
        return parseFloat(value) || 0;
    };
    return my;
} (MyUI.AnimateBase || {}))