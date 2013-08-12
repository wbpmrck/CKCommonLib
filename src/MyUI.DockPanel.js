/// <reference path="demo/JS/jquery-1.7.1.min.js" />
/// <reference path="MyCore.TagBuilder.js" />
/// <reference path="MyCore.WindowSize.js" />
/*
作者： kaicui
依赖： 依赖jquery,MyCore.TagBuilder,MyCore.WindowSize.js
使用说明：停靠面板，可以浮动定位，打开和折叠。可以用来做控制面板， 或者提示信息。
--------------------------------
版本历史：
2012年6月26日10:05:35      代码重构
1、修改所有对外API首字母小写

2012年6月12日15:11:13  功能添加
1、添加left停靠面板功能，支持停靠在左侧和打开、折叠

2012年6月4日17:25:58       功能添加
1、当创建dockPanel的时候，修改其为可见，这样业务端集成的时候，可以先制定一个不可见的div,就不会出现闪烁的问题

2012年5月22日11:01:35      功能添加
1、添加了Panel的折叠状态变化的时候给外部的回调函数，外部可以根据该回调函数做处理，比如：改变按钮的样式

2012年5月21日14:09:50      版本创建
//////////////////////////////////////////////////////////////////*/

var MyUI = (function (my) {
    return my;
} (MyUI || {}));


MyUI.DockPanel = (function (my) {
    //#region 类定义

    //面板类定义
    function CornelPanel(
    eleID, //元素ID
    mode, //参见_modeEnum定义
    titleSpace, //当折叠状态时，预留给标题栏的高度(或者宽度)
    duration, //显示和隐藏的动画时间
    foldCallback//面板的折叠状态变化时，对外部回调通知
    ) {
        var self = this;
        self.element = $("#" + eleID); //元素对象引用
        self.mode = mode;
        self.titleSpace = titleSpace;
        self.totalSpace = _getTotalSpace();
        self.duration = duration;
        self.foldCallback = foldCallback;

        //信息初始化
        self.folding = true; //默认为折叠状态
        _fireFoldEvent();
        if (self.mode == _modeEnum.RightBottom) {
            self.element.height(self.titleSpace);
        }
        else if (self.mode == _modeEnum.Left) {
            self.element.css('left', (0 - (self.totalSpace - parseInt(self.titleSpace))));
        }
        self.element.show();


        var _showHandle, _hideHandle; //保存显示和隐藏的处理函数引用
        //根据当前模式，获取窗口总高度/宽度(需要变化的那个属性)
        function _getTotalSpace() {
            if (self.mode == _modeEnum.RightBottom) {
                return self.element.height();
            }
            else if (self.mode == _modeEnum.Left) {
                return self.element.width();
            }
        };
        //通知外部折叠状态变化
        function _fireFoldEvent() {
            if (self.foldCallback)
                self.foldCallback(self.folding);
        };

        //API:可以允许外部暂时以一个新的速度打开面板
        self.show = function (tmpDuration) {
            //状态判断
            if (!self.folding)
                return;
            //标记
            self.folding = false;
            _fireFoldEvent();

            var dura = tmpDuration || self.duration;
            if (_showHandle) {
                _showHandle(dura);
            }
            else {
                //根据不同的展现模式，确定不同的效果
                if (self.mode == _modeEnum.RightBottom) {
                    //修改函数引用，下次调用就不需要再次判断
                    _showHandle = function (tmpdual) {
                        self.element.animate({ height: self.totalSpace }, tmpdual);
                    }
                }
                else if (self.mode == _modeEnum.Left) {
                    //修改函数引用，下次调用就不需要再次判断
                    _showHandle = function (tmpdual) {
                        self.element.animate({ left: 0 }, tmpdual);
                    }
                }
                _showHandle(dura);
            }
        };
        //API:可以允许外部暂时以一个新的速度隐藏面板
        self.hide = function (tmpDuration) {
            //状态判断
            if (self.folding)
                return;
            //标记
            self.folding = true;
            _fireFoldEvent();
            var dura = tmpDuration || self.duration;
            if (_hideHandle) {
                _hideHandle(dura);
            }
            else {
                //根据不同的展现模式，确定不同的效果
                if (self.mode == _modeEnum.RightBottom) {
                    //修改函数引用，下次调用就不需要再次判断
                    _hideHandle = function (tmpdual) {
                        self.element.animate({ height: self.titleSpace }, tmpdual);
                    }
                }
                else if (self.mode == _modeEnum.Left) {
                    //修改函数引用，下次调用就不需要再次判断
                    _hideHandle = function (tmpdual) {
                        self.element.animate({ left: (0 - (self.totalSpace - parseInt(self.titleSpace))) }, tmpdual);
                    }
                }
                _hideHandle(dura);
            }
        };
        //API:开启面板
        self.open = function () {
            self.element.show();
        };
        //API:关闭面板
        self.close = function () {
            self.element.hide();
        };

    };

    //#endregion

    //#region 重要变量
    var _config = { duration: 1000, z_index: 50 };
    var _modeEnum = { Right: 1, Bottom: 2, Left: 3, Top: 4, RightBottom: 5 };
    var _count = 0; //提示框个数(用于生成ID)

    //#endregion

    //#region 内部函数

    var _cornelTip = function () {
    };
    //填充HTML,返回元素ID.[ps;titleHeight在不同模式下代表的意思不同，在左右侧停靠时，代表的是标题栏宽度，在上下侧停靠时，表示标题栏高度]
    var _fillContent = function (existID, content, zIndex, mode, titleHeight) {
        var id = '_myDockPanelWrap_' + (_count++), styleAttr = {}, _nsTB = MyCore.TagBuilder, existObj = $("#" + existID);
        styleAttr["z-index"] = zIndex;
        styleAttr["position"] = 'fixed';
        styleAttr["overflow-x"] = 'hidden';
        styleAttr["overflow-y"] = 'hidden';
        styleAttr["display"] = 'block';
        //根据不同的停靠模式，生成不同的Html元素
        if (mode == _modeEnum.RightBottom) {
            styleAttr["right"] = '0px';
            styleAttr["bottom"] = '0px';
            styleAttr["display"] = 'none';
            styleAttr["height"] = existObj.height();
        }
        else if (mode == _modeEnum.Left) {

            //居中停靠
            var topPixel = (MyCore.WindowSize.getViewportHeight() - existObj.height()) / 2;
            styleAttr["top"] = topPixel + 'px';
            styleAttr["display"] = 'none';
            styleAttr["width"] = existObj.width();
        }
        //如果传入的元素ID存在，则直接包裹元素
        if (existObj) {
            //            if (mode == _modeEnum.RightBottom) {
            //                styleAttr["height"] = existObj.height();
            //            }
            //            else if (mode == _modeEnum.Left) {
            //                styleAttr["width"] = existObj.width();
            //            }
            var eleHtml = _nsTB.createTag({
                TagName: 'div',
                ID: id,
                Style: styleAttr
            });
            existObj.wrap(eleHtml.toString());
        }
        //否则创建新的元素插入文档
        else {
            //用生成的DIV包裹传入的面板内容
            var eleHtml = _nsTB.createTag({
                TagName: 'div',
                ID: id,
                Style: styleAttr,
                InnerHtml: content
            });
            $('body').append(eleHtml.toString());
        }
        existObj.show();
        return id;
    };

    //#endregion

    //#region API
    //修改配置信息
    my.ConfigSetting = function (setting) {
        _config.duration = setting.Duration || _config.duration;
        _config.z_index = setting.ZIndex || _config.z_index;
    };
    //api:新建一个右下角提示框
    //参数：{ID:[已经存在的Html元素的ID],Content:[表示内容的Html文本],TitleHeight:[表示标题栏的高度，该高度决定了面板处于停靠状态时，多少部分显示在可视区域内部]}
    my.rightBottomPanel = function (para) {
        if (!para.ID && !para.Content)
            return;
        //如果传入了内容，则创建内容元素，如果有ID,则初始化元素状态
        eleID = _fillContent(para.ID, para.Content, para.Z_Index || _config.z_index, _modeEnum.RightBottom, para.TitleHeight || '0px');

        var obj = new CornelPanel(eleID, _modeEnum.RightBottom, para.TitleHeight || '0px', para.Duration || _config.duration, para.FoldCallback);
        return obj;
    };

    //api:新建一个左侧提示框
    //参数：{ID:[已经存在的Html元素的ID],Content:[表示内容的Html文本],TitleWidth:[表示标题栏的宽度，决定了面板处于停靠状态时，多少部分显示在可视区域内部]}
    my.leftPanel = function (para) {
        if (!para.ID && !para.Content)
            return;
        //如果传入了内容，则创建内容元素，如果有ID,则初始化元素状态
        eleID = _fillContent(para.ID, para.Content, para.Z_Index || _config.z_index, _modeEnum.Left, para.TitleWidth || '0px');

        var obj = new CornelPanel(eleID, _modeEnum.Left, para.TitleWidth || '0px', para.Duration || _config.duration, para.FoldCallback);
        return obj;
    };
    //#endregion
    return my;
} (MyUI.DockPanel || {}));

