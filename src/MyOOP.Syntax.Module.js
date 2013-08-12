/// <reference path="MyOOP.Utils.js" />
/// <reference path="MyCore.Log.js" />

/*
作者： kaicui
依赖： MyOOP.Utils,MyCore.Log
全局侵入性：有侵入
侵入项目：
1、require 关键字用作导入模块
2、define 关键字用作定义、扩展模块
--------------------------------------
使用说明：
1、实现OO编程的语法扩展，提供js语法支持，编写Module模式更加方便。
2、满足CommonJS规范，代码在这种风格下更方便迁移到其他平台如：nodejs,requireJS等
3、支持灵活的日志配置功能，可以随时跟踪内部处理细节（该功能可被log开关控制）
4、支持跟踪function(只有函数可以跟踪)的定义履历，可以方便的知道某个api或数据是在哪被定义的，为什么被定义的。（该功能可被开关enableDefineTag控制）
5、同样的数据会被记录在对象自身的同样的字段里，表示该对象最后一次被修改时候的Tag信息

----------------------------------------------------
            模块定义和编写规范：
----------------------------------------------------
1、模块名(包括子模块)首字母大写，比如：BizHome, BizHome.Index,BizHome.Detail
2、模块内公开的API,首字母小写，比如：BizHome.loginDo,BizHome.logOut
[注]:这样的话可以避免扩展模块的时候把之前的api冲掉，因为js大小写敏感
3、模块内私有变量、函数一律以'单下划线'_开头，比如 var _count=0;var _getDate=function(){...};
4、需要使用外部函数库时，使用context.imports['libName']或者context.imports.libs[idx]
5、需要访问自身公开API或属性时，使用context.self.xx即可
6、访问自身私有属性、方法，直接访问即可，因为在闭包内
7、需要导出公开方法、属性，使用context.exports=aaa即可
8、需要导入外部模块、库，在define的第二个参数数组中列出依赖库即可，比如：define('Test', ['MyOOP.Utils'], function (context) {

----------------------------------------------------
            Vs2010集成Tips：
----------------------------------------------------
1、一般情况下，建议一个js文件只保留一个define块，这样也与CommonJS规范符合，vs对这种方式支持智能感知
[注]：一个js文件中出现多个define块的话，不影响功能，但是智能感知会受到影响。
2、如果无法保证，则可以在需要扩展模块的时候，在该模块下建立一个js文件，以[模块名.日期.js]命名，每个扩展单独使用一个js文件
这样可以获得vs最好的智能感知支持。待编码完成后，再将[模块名.日期.js]文件内容拷贝到原始模块后面，作为扩展模块
-------------------------------------------------

版本历史：
2012年5月31日11:17:32      功能添加
1、改进跟踪日志：
    a)添加define模块时，导入外部模块的提示，可以提示哪些模块正确导入，哪些错误导入
    b)重点关键字[]括起，突出重点
    c)方法名使用>>name表示，醒目

2012年5月31日9:22:53       功能添加
使用过程中发现有时候定义的模块要可以访问自身输出的属性或者方法，由于context.exports并不是直接指向模块本身，而只是一个副本，所以
直接使用context.exports.xx是有问题的。所以增加了以下功能：
1、context中原本只有imports和exports2个属性，再增加一个self属性，指向定义的模块自身。使用context.self,可以：
    a)访问自身的属性
    b)重写自身的属性(isReWrite开关打开)


2012年5月29日18:35:55      功能添加
1、在define的模块内，所有公开的属性，添加子属性_myDefineTag(具体名字依赖配置),默认为''.表示该属性被defined的时候，是由于什么原因。
2、在define.configs里，
    添加配置项：enableDefineTag，默认为false,用于标识是否启用定义备注跟踪功能。
    添加配置项：defineTagKey:默认_myDefineTag,用于标识记录tag的变量名。
3、在define函数参数中添加一个附加参数对象，把之前的‘复写标记’也放进去，另外添加一个‘defineTag参数’，表示本次定义
的备注信息。如果该参数传入，且enableDefineTag打开。则本次define如果对外部export了数据，则所有数据会带着这个标记。方便找问题
4、将defineTag的检查函数写成自修改的，如果配置为false,则永远也不会再记录和检查Tag,除非修改代码

2012年5月29日11:51:58      版本创建
1、提供常用的Module模式语法糖（兼容CommonJS），主要包括：
    a)require Module功能：
        根据传入的字符，解析需要引入的对象，并且返回。
        比如：require('MyUI.Slider')
            1:检查MyUI是否存在，MyUI.Slider是否存在
            2：返回该模块,不存在则返回undefined

    b)define module功能，定义一个新模块，如果该模块名字已存在，会导入进来，并不覆盖：
        define('ModuleName',['MyUI.Slider'],function(Slider,exports){
            exports.a=1;//这是模块对外公开的属性
            var b=1;//这是私有属性
        });
    结果是：
        1、产生一个ModuleName组件，如果name使用.号分开，则产生层级对象，除了最后一级为复写以外，其他层级都是导入已存在的
            比如：define('M1.M2.Module',['MyUI.Slider'],function(context){
                var a=context.imports['MyUI.Slider'];//a就是该js库模块
                    });
            如果M1和M2、Module已存在，则M1和M2、Module原来的数据不被破坏

    c)扩展module功能，扩展一个新module，覆盖当前Module（但是不覆盖Module的上层）,和define方法一样，只不过最后多一个参数true
     define('ModuleName',['MyUI.Slider'],function(context){
                var a=context.imports['MyUI.Slider'];//a就是该js库模块
                var a=context.imports.libs[0];//支持索引下标访问
            context.exports.a=1;//这是模块对外公开的属性
            var b=1;//这是私有属性
        },
        true//传入true为覆盖方法，也就是说exports里如果有之前库里已有的对象，则覆盖之。不传入或者传入false为导入并存
        );
    d)想使用之前定义的组件的功能，并同时扩展其功能？只需要把之前定义的组件当做require库导入进来即可使用。比如：
     define('ModuleName',['ModuleName','MyUI.Slider'],function(context){
                var base=context.imports['ModuleName'];//base是扩展前的模块
        },
        true//传入true为覆盖方法，也就是说exports里如果有之前库里已有的对象，则覆盖之。不传入或者传入false为导入并存
        );


2、API风格兼容CommonJS规范：
    每个模块里面都应当有个函数叫require;
    1.1 require接收模块描述符作为参数
    1.2 require的返回值就是那个描述符描述的模块导出(export)的api
    1.3 如果存在循环依赖,那么require返回的应当是那个模块在循环依赖产生前已经可以导出的api;
    1.4 如果那个模块有问题,要抛出个错误来,就是说别悄没声的装作完事了;要大喊一声你有病啊;
    2. 每个模块都应当有个叫exports的变量,好把自己的api都塞进去;
    3. 模块必须把exports作为导出api的唯一方法;
//////////////////////////////////////////////////////////////////*/

function require(moduleName) {
    MyCore.Log.writeConsole('>>require:: [' + moduleName + '] begin...');
    var result = MyOOP.Utils.getModule(moduleName);
    MyCore.Log.writeConsole('>>require:: [' + moduleName + '] end...');
    return result.module;
}
function define(
name, //新模块名字，支持xx.xx.xx语法
requireArray, //数组，需要导入的外部库列表，比如：['MyUI','MyBiz']
funcInOut, //函数，定义主体，有1个参数context，下面有属性imports 和 exports,分别表示导入进来的库和导出外部的公开API.其中imports为数组，个数与requireArray一致，没找到的库值为undefined
paras//对象，含有参数：1:isReWrite:bool值，默认false,是否重写模块。为true时覆盖原模块实现  2:tag,标识一个备注信息，默认为GMT时间，开关开启时会带在属性内部，可用来跟踪找问题
) {
    //#region 内部函数
    //合并源组件和目标组件定义
    function _mergeDefine(module, exports, reWrite) {
        if (reWrite) {
            //循环处理export属性，添加到module中
            for (var item in exports) {
                var tip = module[item] ? " [rewrite] with " : " [imported] with";
                module[item] = exports[item];
                _addDefineTag(module[item]);
                MyCore.Log.writeConsole('>>define:: module:[' + name + '] has ' + tip + ' attr:[' + item + ']  tag is:[' + paras.tag+']');
            }
        }
        else {
            //循环处理export属性，只把原先没有的添加到module中
            for (var item in exports) {
                if (!module[item]) {
                    module[item] = exports[item];
                    _addDefineTag(module[item]);
                    MyCore.Log.writeConsole('>>define:: module:[' + name + '] has [imported] with attr:[' + item + ']    tag is:[' + paras.tag + ']');
                }
            }
        }
    };
    //检查是否需要添加defineTag方便追踪
    function _addDefineTag(property) {
        if (define.configs.enableDefineTag && property) {
            property[define.configs.defineTagKey] = paras.tag;
        }
        else {
            _addDefineTag = function () { };
        }
    };
    //重新整理传入参数对象
    function _resetParas() {
        paras = paras || {};
        paras.isReWrite = paras.isReWrite || false;
        paras.tag = paras.tag || new Date().toGMTString();
    };
    //#endregion
    //step0:参数规整
    _resetParas();
    //step1:获取namespace和module对象
    MyCore.Log.writeConsole('>>define:: ' + 'try create module:[' + name + ']...');
    var module = MyOOP.Utils.getNameSpace(window, name);
    MyCore.Log.writeConsole('>>define:: ' + 'module:[' + name + '] has ready');

    //step2:获取依赖库
    MyCore.Log.writeConsole('>>define:: ' + 'import libs:[' + requireArray.length + ']...');
    var libs = MyOOP.Utils.getModules(requireArray);
    MyCore.Log.writeConsole('>>define:: [' + libs.libs.length + ']libs imported');
    //step3:执行模块定义，准备上下文
    var context = { imports: libs, exports: {},self:module };
    funcInOut(context);
    //step4:模块定义成功，根据标记选择是否替换
    var exports = context.exports;
    _mergeDefine(module, exports, paras.isReWrite);
    //step5:组件自身记录Tag
    if (define.configs.enableDefineTag)
        module[define.configs.defineTagKey] = module[define.configs.defineTagKey] + '>>' + paras.tag;
};

//#region configs
define.configs = {
    enableDefineTag:false,//是否启用定义备注跟踪功能
    defineTagKey: '_myDefineTag'//标识defineTag字段名称
};
define.Config = function (configs) {
    for (var i in configs) 
        define.configs[i] = configs[i];
};
//#endregion

