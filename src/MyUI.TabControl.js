/*
作者： kaicui
依赖： 依赖jquery
使用说明：用于创建标签组和标签数据结构，实现自定义的标签效果

版本历史：
2012年5月22日16:09:10      功能优化
1、修改了Enable和Disable的逻辑，不需要业务端回调来通知组件，直接修改enable属性，再调业务函数进行效果展示
2、增加了对展示和隐藏处理函数没有传入的提示功能，这样如果没有传入这2个参数，会弹出alert
3、增加API:ActiveTab,用于直接激活某个位置的标签

2012年5月21日14:09:50      版本创建
//////////////////////////////////////////////////////////////////*/

var MyUI = (function (my) {
    return my;
} (MyUI || {}));

//用于控制tab页元素。依赖jquery
MyUI.TabControl = (function (my) {
    //#region 自定义标签组

    //#region 类定义

    //标签页
    function TabPage(
    group, //标签所在组的对象
    headID, //标签头ID
    bodyID)//标签页内容ID 
    {
        var self = this;
        self.PageID = "group_" + group.ID + "_head_" + headID;
        self.Head = $("#" + headID); //标签头
        self.Body = $("#" + bodyID); //标签体
        self.IsEnable = true; //默认非激活

        self.Enable = function () {
            self.IsEnable = true;
            if (group.funcEnable) {
                //调用组内共享方法设置标签激活样式
                group.funcEnable(self.Head, self.Body);
            }
        };
        self.Disable = function () {
            self.IsEnable = false;
            if (group.funcDisable) {
                //调用组内共享方法设置标签激活样式
                group.funcDisable(self.Head, self.Body);
            }
        };
        self.Head.click(function () {
            if (self.Click) {
                self.Click(self); //进行点击回调，并传入标签页作为参数
            }
        });
        self.Click = undefined; //标签被点击时候的回调
    };

    //标签页组
    function TabGroup(
    id,
    fnEnable, //用于激活标签头的函数，参数为2个jquery对象代表标签头和标签内容,以及一个设置完成的回调函数
    fnDisable//用户取消激活标签头的函数，参数为2个jquery对象代表标签头和标签内容，以及一个设置完成的回调函数
    ) {
        var self = this;
        self.ID = id; //组号
        self.Pages = []; //组内页集合
        self.funcEnable = fnEnable || function () { alert('need a funcEnable in the construtor'); }; //用于激活标签头的函数
        self.funcDisable = fnDisable || function () { alert('need a funcDisable in the construtor'); };  //用户取消激活标签头的函数

        //标签互斥处理函数:选中某个标签时处理
        var _selectTab = function (page) {
            //如果已经是选中状态，则不处理：
            if (page.IsEnable)
                return;

            //选择该标签
            page.Enable();
            //取消选择所有其他标签
            for (var i = 0, j = self.Pages.length; i < j; i++) {
                var _page = self.Pages[i];
                //对于所有选中状态的其他标签，更新其选中状态
                if (_page.PageID != page.PageID && _page.IsEnable) {
                    _page.Disable();
                }
            }
        };
        //API:添加标签
        self.AddTab = function (headID, bodyID) {
            var _page = new TabPage(self, headID, bodyID);
            //控制标签头部点击的时候互斥处理
            _page.Click = _selectTab;
            self.Pages.push(_page);
            //add by kaicui 2012年5月22日 16:48:15 默认最新添加的未激活，消除前面标签的激活状态
            _page.Enable();
            if (self.Pages.length > 1) {
                self.Pages[self.Pages.length - 2].Disable();
            }

            return self;
        };
        //API:获取激活的标签index
        self.GetActivePageIndex = function () {
            for (var i = 0, j = self.Pages.length; i < j; i++) {
                var _page = self.Pages[i];
                if (_page.IsEnable)
                    return i;
            }
        };
        //API:激活指定位置的标签[索引从0开始]
        self.ActiveTab = function (idZeroBase) {
            if (self.Pages && self.Pages[idZeroBase]) {
                self.Pages[idZeroBase].Head.click();
            }
        };
    };
    //#endregion

    //#region 变量
    //#endregion

    //#region 内部函数

    //添加一个标签组，返回标签组控制对象
    var _makeTabGroup = function (
    id,
    fnEnable, //用于激活标签头的函数，参数为2个jquery对象代表标签头和标签内容,以及一个设置完成的回调函数
    fnDisable//用户取消激活标签头的函数，参数为2个jquery对象代表标签头和标签内容，以及一个设置完成的回调函数
    ) {
        var group = new TabGroup(id, fnEnable, fnDisable);
        return group;
    };

    //#endregion

    //#region API
    //对外API:构建一个标签组，使用返回对象可以添加标签页
    my.newTabGroup = function (para) {
        return _makeTabGroup(
        para.groupID,
        para.funcEnable,
        para.funcDisable
        );
    };
    //#endregion

    //#endregion
    return my;
} (MyUI.TabControl || {}))

