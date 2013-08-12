/*
作者： kaicui
依赖： 无
使用说明：用于Url地址的扩展，方便指定各种Url如MVC的Url格式

PS:由于需拼接服务端action地址，所以需要知道服务端虚拟目录路径。有两种方式配置服务端虚拟目录路径：
1、在页面内放一个id为‘rootUrl’的元素，里面存放的是服务端的根目录地址。
2、直接调用

版本历史：
2012年6月26日9:46:04       功能添加
1、添加方法：setRoot，用于手工指定服务器的根目录地址
2、格式化API:所有方法都首字母小写，只有类名、模块名首字母大写，更新对应Demo

2012年3月29日20:08:47      版本创建
//////////////////////////////////////////////////////////////////*/

var MyCore = (function (my) {
    return my;
} (MyCore || {}));

MyCore.Url = (function (my) {
    my.root = "";
    my.setRoot = function (root) {
        my.root = root;
    };
    my.getRoot = function () {

        if (my.root === "") {
            var ele = document.getElementById("rootUrl");
            if (ele)
                my.root = ele.innerText;
            else
                my.root = "need a hidden <p> tag in the page named:rootUrl";
        };
        return my.root;
    };
    my.action = function (action, controller, paras) {
        //        return controller + "/" + action;
        var rootUrl = my.getRoot();
        var paraString = my.getQueryStrFromObj(paras);
        return rootUrl + "/" + controller + "/" + action + paraString;
    };
    //根据传入的url，分析出查询字符串，返回对象
    my.getQueryStrObj = function (url) {
        var name, value, i;
        var str = url || location.href;
        var num = str.indexOf("?")
        str = str.substr(num + 1);
        var arrtmp = str.split("&");
        var obj = {};
        for (i = 0; i < arrtmp.length; i++) {
            num = arrtmp[i].indexOf("=");
            if (num > 0) {
                name = arrtmp[i].substring(0, num);
                value = arrtmp[i].substr(num + 1);
                obj[name] = value;
            }
        }
        //将所有键值转化为url
        obj.toString = function () {
            var s = "?";
            for (var i in this) {
                if (!this[i].prototype)
                    s += i + "=" + this[i] + "&";
            }
            if (s.length > 1)
                s = s.substring(0, s.length - 1);
            else
                s = "";
            return s;
        };
        return obj;
    };
    //返回当前Url对象，可以对url的参数进行修改，转化为新的url
    my.getNowUrlObj = function () {
        var nowurl = window.location.href,
        server_port = window.location.host,
        protocol = window.location.protocol,
        pathName = window.location.pathname,
        query = my.getQueryStrObj(window.location.search);
        return {
            RawUrl: nowurl,
            Server: server_port,
            Protocol: protocol,
            Path: pathName,
            QueryStr: query,
            toString: function () {
                return this.Protocol + "//" + this.Server + this.Path + this.QueryStr.toString();
            }
        };
    };
    //根据传入的参数对象，拼出querystring
    my.getQueryStrFromObj = function (paras) {
        var paraString = "";
        if (paras) {
            for (var i in paras) {
                paraString += i + "=" + encodeURIComponent(paras[i]) + "&";
            }
            if (paraString.length > 0) {
                paraString = "?" + paraString.substr(0, paraString.length - 1); //去掉最后一个&
            }
        }
        return paraString;
    };
    return my;
} (MyCore.Url || {}));

MyCore.Url.setRoot('');