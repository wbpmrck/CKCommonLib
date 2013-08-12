/*
作者： kaicui

依赖： 无
使用说明：
1、自定义的日志输出类
-----------
版本历史：
2012年5月29日19:20:13      功能添加
1、增加控制台输出API:writeConsole，方便调试。


2012年3月25日10:18:02      版本创建
//////////////////////////////////////////////////////////////////*/

var MyCore = (function (my) {
    return my;
} (MyCore || {}));

MyCore.Log = (function (my) {
    my.writeConsole = function (msg) {
        if (MyCore.Log.configs.enable && window.console && window.console.log)
            window.console.log(msg);
        else
            my.writeConsole = function () { };
    };
    return my;
} (MyCore.Log || {}));
MyCore.Log.configs = {
    enable: false
};

MyCore.Log.Config = function (configs) {
    for (var i in configs)
        MyCore.Log.configs[i] = configs[i];
};