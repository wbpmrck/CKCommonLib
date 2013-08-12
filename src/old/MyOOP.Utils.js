
/*
作者： kaicui
依赖： MyCore.Log
使用说明：提供支持OOP编程的工具类。

版本历史：
2012年6月4日16:02:02       缺陷修复
1、在IE下，如果请求创建namespace为window的组件，则getNameSpace的时候试图往window.window对象赋值的时候报错：非法赋值。

2012年5月29日11:51:58      版本创建
1、提供了对namespace进行解析的工具类，发现任何节点不存在，则以{}代替，并创建该节点。如果节点已经存在，则使用该节点。
//////////////////////////////////////////////////////////////////*/

var MyOOP = (function (my) {
    return my;
} (MyOOP || {}));

MyOOP.Utils = (function (my) {
    //工具函数，负责获取单个模块，给出获取结果：{module:{},success:bool,msg:''}
    my.getModule = function (moduleName) {
        var _result = {
            module: {},
            success: false,
            msg: ''
        };
        try {
            _result.module = eval(moduleName);
            _result.success = true;
            _result.msg = 'success';
            MyCore.Log.writeConsole('>>getModule:: [' + moduleName + ']  [success]');
            return _result;
        } catch (e) {
            _result.module = undefined;
            _result.success = false;
            _result.msg = e.toString();
            MyCore.Log.writeConsole('>>getModule:: [' + moduleName + ']  [failed]     msg:[' + _result.msg + ']');
            return _result;
        }
    };
    //工具函数，递归解析名称空间，导入模块,如果模块不存在，则创建{}代替之
    my.getNameSpace = function (parent, ns) {
        var nsArray = ns.split('.');
        if ((parent != window || nsArray[0] != 'window') && !parent[nsArray[0]])
            parent[nsArray[0]] = parent[nsArray[0]] || {};
        if (nsArray.length == 1)
            return parent[nsArray[0]];
        else
            return my.getNameSpace(parent[nsArray[0]], nsArray.slice(1).join('.'));
    };
    //工具函数，解析需要的函数库，返回一个对象{module:{},success:bool,msg:''}，可以通过xx[name].module访问库，或者通过.libs数组,如：xx.libs[id].module
    my.getModules = function (arrayLib) {
        var finded = { libs: [] }; //libs that findout
        for (var i = 0, total = arrayLib.length; i < total; i++) {
            finded.libs[i] = finded[arrayLib[i]] = my.getModule(arrayLib[i]).module;
        }
        return finded;
    };
    return my;
} (MyOOP.Utils || {}));