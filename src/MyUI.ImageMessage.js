
/// <reference path="demo/JS/jquery-1.7.1.min.js" />
/// <reference path="MyOOP.Utils.js" />
/// <reference path="MyOOP.Syntax.Module.js" />
/// <reference path="MyCore.WindowSize.js" />
/// <reference path="MyUI.Util.js" />
/// <reference path="MyCore.Config.js" />
/// <reference path="MyCore.TagBuilder.js" />

/*
作者： kaicui
依赖： JQuery,MyCore.WindowSize.js,MyCore.TagBuilder.js,MyUI.Util.js,MyCore.Config.js,MyOOP（内含开源组件BlockUI）
使用说明：
1、提供图片消息功能，常见的应用就是类似qq表情的功能
2、主要提供图片的配置、图片信息与对应的字符码的关系、以及提供可扩展的分类、展示配置，获取用户选中的图片，并返回其对象
3、支持配置Html,以及传入一个初始化函数，用来初始化表情的排列

--------------------------------------
版本历史：
2012年7月12日9:07:54       添加功能
1、添加内置对弹出框自动关闭的支持
2、给表情组添加属性：
    表情匹配正则。用于从字符串中过滤出表情正则。
    howToFind:框架调用的回调函数，传入为item对象和匹配上的关键字符，如果该函数返回true,则表示该item对象表示该关键字符的表情
    howToReplace:一个回调函数(finded,keyWord,_item)，传入：待替换文本，匹配的item对象，待替换的关键字，传出一段HTML,框架拿这段HTML去替换字符串中匹配上的部分

2012年7月11日17:42:36     版本创建
//////////////////////////////////////////////////////////////////*/

define('MyUI.ImageMessage', ['MyCore.WindowSize', 'MyCore.Config', 'MyCore.TagBuilder'], function (context) {
    var self = context.self;
    var windowSizeModule = context.imports['MyCore.WindowSize'];
    var configModule = context.imports['MyCore.Config'];
    var tagBuilderModule = context.imports['MyCore.TagBuilder'];

    //#region 内部变量、函数
    var _configManager = configModule.newConfigManager({
        choosedCallback: undefined, //弹出表情框关闭后的回调函数
        //自动关闭相关的配置
        autoClose: {
            enable: false,
            interval: 3000
        },
        dialogSize: {
            width: 0,
            height: 0
        }, //弹出的选择框的大小（包括边框等，用于插件计算弹框的位置）
        funcToGenerateGroupHtml: function (groupIndex, itemsArray) {
            alert('funcToGenerateGroupHtml not implement!');
        }, //回调函数，传入：表情对象数组   框架将组对象、组内所有表情对象作为数组传入，用于定义如何生成每一组表情的Html（该函数在执行showDialog的时候，会检查每个组是否都已经生成好html,不会重复生成。主要用于产生展示表情的内容区域）
        beforeAppendDialog: function (distance, html) {
            alert('beforeAppendDialog not implement!');
        }, //回调函数，传入：distance,组内的HTML   当用户调用showDialog的时候，框架会取出默认展示的组的html,并计算当前offSet到屏幕四个方向的距离，连带offSet一起（这个区域外部用来决定在哪里放置该弹框，以及使用什么样的UI），作为参数传入该回调函数，并取该回调函数的返回结果作为最终的HTML,然后生成一个DOM插入到文档中，这个API主要用来给外部针对不同的弹框方向进行修饰元素的附加，比如小箭头)
        beforeShowDialog: function (wrapperID, posOffset, distance, dialogSize, wndSize) {
            alert('beforeShowDialog not implement!');
        }, //回调函数，传入：wrapper对象的ID,offset,distance,dialogSize,windowSize  当框架调beforeAppendDialog并获取HTML插入到文档中后，紧接着调这个API,传入插入到文档后的wrapper的id，用于在“插入文档”后和“显示出来”前，给用户一个再次调整的机会。比如针对不同的弹框方向进行位置的修改(一般不再修改DOM结构))
        afterShowDialog: function (wrapperID) {
        }, //回调函数，在wrapper显示过后，再调用该函数。传入：wrapper对象的ID
        howToShow: function (id) {
            $("#" + id).show();
        }, //回调函数，当框架调 beforeShowDialog 后调用，传入的参数是wrapper的ID 用于展示弹出框，默认就是show
        howToClose: function (id) {
            $("#" + id).remove();
        }, //回调函数，当框架调 closeDialog 后调用，传入的参数是wrapper的ID 用于展关闭弹出框，默认就是remove
        urlRoot: undefined//所有图片的根目录，如果设置，则图片的地址将会根据该root+item.url来展示

    });
    var _wrapperID = '_ckImageMessageWrapper'; //最外层的wrapper的ID
    var _groups = []; //所有图片消息组集合
    var _autoCloseTimer = undefined; //用于控制自动关闭的计时器
    //#endregion

    //#region 类定义
    function _ImageMessageGroup(name, itemsObjArray, regexMatch, howToReplace, howToFind) {
        var my = this;
        my.index = undefined; //表情组在数组中的下标，在添加组的时候自动指定
        my.name = name; //对象名称，比如：大笑

        my.regexMatch = regexMatch; //如何匹配关键字的正则，比如[晕/]对应的是 /(\[[\u4e00-\u9fa5]*\w*\/\])*/g;
        my.howToFind = howToFind; //框架调用的回调函数，传入为item对象和匹配上的关键字符，如果该函数返回true,则表示该item对象表示该关键字符的表情
        my.howToReplace = howToReplace; //匹配上关键字后，，传入：待替换文本，匹配的item对象，待替换的关键字,业务端灵活控制前端的展示

        //在给定的文本中查找是否有本组的表情，有的话进行定制替换
        my.searchAndReplace = function (text) {
            var rs = text.match(my.regexMatch), finded = text;
            for (i = 0, j = rs.length; i < j; i++) {
                for (n = 0, m = my.itemsObjArray.length; n < m; n++) {
                    var _item = my.itemsObjArray[n], keyWord = rs[i];
                    if (my.howToFind(_item, keyWord)) {
					finded=my.howToReplace(finded,keyWord,_item);
                        //var newHtml = my.howToReplace(_item);
                        //finded = finded.replace(keyWord, newHtml);
                    }
                }
            }
            return finded;
        };


        my.itemsObjArray = []; //_ImageMessageItem对象数组，可以在定义组的时候直接初始化
        my.itemsObjDic = {}; //_ImageMessageItem对象字典，{id:{},id:{}}
        my.addItem = function (id, name, code, url) {
            var item = new _ImageMessageItem(id, name, code, url);
            my.itemsObjArray.push(item);
            my.itemsObjDic[id.toString()] = item;
        };
        //ar格式：[{id:xx,name:xx,code:xx,url:xx},{id:xx,name:xx,code:xx,url:xx}]
        my.addItems = function (ar) {
            if (ar && ar instanceof Array) {
                for (var i in ar) {
                    var ele = ar[i];
                    my.addItem(ele.id, ele.name, ele.code, ele.url);
                }
            }
        };
        //init:
        my.addItems(itemsObjArray);
        my.generatedHTML = undefined; //生成好的表情列表HTML
        //开始生成HTML
        my.generate = function () {
            if (!my.generatedHTML)
                my.generatedHTML = _configManager.getConfigs().funcToGenerateGroupHtml(my.index, my.itemsObjArray);
        };

    };

    //图片消息对象
    function _ImageMessageItem(id, name, code, url) {
        var my = this;
        my.index = undefined; //表情在所属组内数组中的下标，在添加组的时候自动指定
        my.id = id; //对象id
        my.name = name; //对象名称，比如：大笑
        my.code = code; //消息符号，比如：[/大笑]
        my.url = _configManager.getConfigs().urlRoot + url; //图片地址
    };

    //#endregion

    //输出API
    context.exports = {
        //配置弹出层配置项
        config: function (newConfigs) {
            _configManager.setConfigs(newConfigs);
        },
        //API:展示表情选择窗口，传入要展示表情的位置（通常是被点击的按钮坐标）如{left: 1116,top: 256}
        //之所以考虑API传入的是坐标，是为了支持更多的使用场景，而不一定是某个元素的click事件
        showDialog: function (posOffset) {
            //检查wrapper是否存在，存在的话先关闭
            var wrapper = $("#" + _wrapperID);
            if (wrapper.length > 0)
                self.closeDialog();
            //检查是否所有类型都已经完成了表情HTML的生成，如果有没完成的，生成一次
            for (var i in _groups) {
                _groups[i].generate();
            }
            var _cfgs = _configManager.getConfigs();
            //根据dialogSize，posOffset和windowSize,计算当前offSet到屏幕四个方向的距离{left,right,up,down}
            var wndSize = { width: windowSizeModule.getViewportWidth(), height: windowSizeModule.getViewportHeight() };
            var dialogSize = _cfgs.dialogSize;
            var distance = {
                left: posOffset.left,
                right: wndSize.width - posOffset.left - dialogSize.width,
                up: wndSize.height - posOffset.top,
                down: wndSize.height - posOffset.top - dialogSize.height
            };
            //调beforeAppendDialog，获取返回的HTML.插入到文档中
            var html = _cfgs.beforeAppendDialog(distance, _groups[0].generatedHTML);
            wrapper = tagBuilderModule.createTag({
                TagName: 'div',
                InnerHtml: html,
                ID: _wrapperID,
                Name: _wrapperID,
                Style: {
                    display: 'none',
                    position: 'absolute',
                    top: posOffset.top + 'px',
                    left: posOffset.left + 'px'
                }
            });
            $("body").append(wrapper.toString());
            //调用beforeShowDialog，进行展示前的再次调整
            _cfgs.beforeShowDialog(_wrapperID, posOffset, distance, dialogSize, wndSize);
            _cfgs.howToShow(_wrapperID);
            _cfgs.afterShowDialog(_wrapperID);
        },
        //API:关闭表情选择窗口，业务组件可以在自己需要的时候关闭该表情框
        closeDialog: function () {
            var wrapper = $("#" + _wrapperID);
            if (wrapper.length > 0)
                _configManager.getConfigs().howToClose(_wrapperID);
        },
		//API:根据当前是显示还是隐藏，来进行相反的操作
		toggleShowDialog:function(posOffset){
			var wrapper = $("#" + _wrapperID);
            if (wrapper.length > 0)
				self.closeDialog();
			else
				self.showDialog(posOffset);
		},
        //API:选择表情，通常在框架调用funcToGenerateGroupHtml方法生成表情展示HTML的时候，就应该生成调用本API的HTML.业务组件也可以自己进行事件绑定，来调该API
        //这个API可以立即给callback一个返回，传入获取到的表情对象
        chooseItem: function (groupIndex, itemId) {
            //获取选中的表情对象
            var choosedItem = _groups[groupIndex].itemsObjDic[itemId];
            //调用回调
            _configManager.getConfigs().choosedCallback(choosedItem);

        },
        //API:传入含有表情关键字的文本，经过解析，返回解析后的HTML
        translateFrom: function (text) {
            var result = text;
            for (var i in _groups) {
                result = _groups[i].searchAndReplace(result);
            }
            return result;
        },
        //添加一个表情对象组
        addMessageItemGroup: function (name, itemsObjArray, regexMatch, howToReplace, howToFind) {
            var group = new _ImageMessageGroup(name, itemsObjArray, regexMatch, howToReplace, howToFind);
            _groups.push(group);
            group.index = _groups.length - 1; //追加index属性
        }
    };

}, { tag: '【 图片消息 组件】by kaicui 2012年7月11日 19:09:52' });