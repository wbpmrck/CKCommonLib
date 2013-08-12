/*
作者： kaicui
依赖： 
使用说明：
版本历史：

2012年3月29日20:08:47      版本创建
//////////////////////////////////////////////////////////////////*/

var MyUI = (function (my) {
    return my;
} (MyUI || {}))

MyUI.ValidateHelper = (function (my) {
    return my;
} (MyUI.ValidateHelper || {}));
MyUI.ValidateHelper.TextArea = (function (my) {
    my.limitChar = function (eleid, count, callback) {
        var obj, JQObj, maxCount, CallBack;
        my.handleTextChange = function () {
            if (obj.value.length > maxCount) {
                obj.value = obj.value.substr(0, maxCount);
            }
            var canInputNum = maxCount - obj.value.length;
            if (CallBack)
                CallBack(canInputNum);
        };
        obj = document.getElementById(eleid);
        JQObj = $(obj);
        maxCount = count;
        CallBack = callback;
        //绑定事件
        if ($.browser.msie) {
            obj.onpropertychange = my.handleTextChange;
        } else {
            obj.addEventListener("input", my.handleTextChange, false);
        }
        JQObj.attr({
            onpaste: "MyCore.Validate.TextArea.handleTextChange()",
            onchange: "MyCore.Validate.TextArea.handleTextChange()",
            onpropertychange: "MyCore.Validate.TextArea.handleTextChange()",
            onkeydown: "MyCore.Validate.TextArea.handleTextChange()"
        });
    };
    return my;
} (MyUI.ValidateHelper.TextArea || {}));

//为输入框控件提供验证辅助功能
MyUI.ValidateHelper.InputHelper = (function (my) {
    //给输入框绑定验证逻辑，以及需要显示验证信息的元素。当验证结果为false时，元素被展示，否则元素被隐藏
    //验证支持光标移出验证，也支持调用对象的forceValid方法强行触发验证，得到验证结果
    //参数用法：
    //1:validFunc   负责进行参数验证，比如function(val){if(val.leng<2) return {isValid:false,validMsg:'长度不能小于2'}}
    //2:setTipFunc  负责将验证结果放入提升元素 比如 function(ele,msg){ele.text(msg); }
    my.bindValidationAndTip = function (validFunc, validElementid, tipElementid, setTipFunc) {
        var toValid = $("#" + validElementid);
        var tip = $("#" + tipElementid);
        var blurDo = function () {
            if (validFunc) {
                var result = validFunc(toValid.val());
                if (result.isValid) {
                    tip.hide();
                }
                else {
                    if (setTipFunc)
                        setTipFunc(tip, result.validMsg);
                    tip.show();
                }
                return result.isValid;
            }
            return false;
        };
        //光标移出的时候验证
        toValid.blur(blurDo);
        //返回控制对象
        return {
            forceValid: function () {
                return blurDo();
            },
            setTipMsg: function (msg) {
                if (setTipFunc)
                    setTipFunc($("#" + tipElementid).show(), msg);
            }
        };
    };
    return my;
} (MyUI.ValidateHelper.InputHelper || {}));