/*
作者： kaicui
依赖： 
使用说明：用于进行核心的基本验证运算功能
版本历史：

2012年3月29日20:08:47      版本创建
//////////////////////////////////////////////////////////////////*/

var MyCore = (function (my) {
    return my;
} (MyCore || {}))

MyCore.Validate = (function (my) {
    my.isNumber = function (text) {
        return !isNaN(text - 0) && text != null;
    };
    return my;
} (MyCore.Validate || {}));