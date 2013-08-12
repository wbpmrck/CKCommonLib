/// <reference path="MyOOP.Utils.js" />
/// <reference path="MyOOP.Syntax.Module.js" />
/// <reference path="MyOOP.Method.js" />
/*
作者： kaicui
用于测试智能感知
*/

define('BizShared', ['MyOOP.Utils.js', 'MyOOP.Method'], function (context) {
    var a = context.imports['MyOOP.Utils']; //a就是该js库模块
    var b = context.imports.libs[1]; //支持索引下标访问
    
    context.exports.a = 2; //当前无法覆盖a属性
    context.exports.b = 2; //新属性是可以的
    context.exports.ff = function () {
        alert('这是第2次定义的模块内的方法'); //当前无法覆盖ff方法
    };
    var b = 1; //这是私有属性
});
BizShared.ff();

//var BizShared = (function (my) {
//    //电信中音SSO登录，支持在彩铃DIY网站登录成功后跳转至彩铃门户无需再次进行登录 by zrpeng 2012-5-4
//    my.GotoGroupSSO = function () {
//        var url = UrlJSHelper.Action("GotoGroupSSO", "SSO");
//        $.ajax({
//            url: url,
//            cache: false,
//            success: function (data) {
//                //            window.location.href = data.Html;
//                window.open(data.Html);
//            }
//        });

//    }
//    return my;
//} (BizShared || {}));


