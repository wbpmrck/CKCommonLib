/*
作者： kaicui
依赖： 无
使用说明：用于组建Html标签元素的类，比如style对象，Div等。

下面是在google chrome中的使用记录：(>>表示语句的输出)
var a =MyCore.TagBuilder.createTag({TagName:'div',ID:'asdad',Name:'ggg',Style:{color:'red'}});
>>undefined

a.toString()
>>"<div id="asdad" name="ggg" class="" style="color:red;"></div>"

a.AutoClose=true
>>true

a.toString()
>>"<div id="asdad" name="ggg" class="" style="color:red;"/>"

a.TagName='input';
>>"input"

a.toString()
>>"<input id="asdad" name="ggg" class="" style="color:red;"/>"

a.AutoClose=false
>>false

a.TagName='div';
>>"div"

a.InnerHtml='<span>123</span>'
>>"<span>123</span>"

a.toString()
>>"<div id="asdad" name="ggg" class="" style="color:red;"><span>123</span></div>"

版本历史：

2012年6月26日9:54:57       代码重构
1、更新方法名为首字母小写，更新Demo

2012年5月21日16:25:33      添加说明
1、添加了InnerHtml的设置，可以为元素指定内部内容
2、目前还不支持嵌套的HtmlTag的处理，以后可以考虑，这样更加灵活

2012年3月29日20:08:47      版本创建
1、可以创建Html标签，包括自闭和的和非自闭和的
2、可以创建Style对象，动态修改Style值
//////////////////////////////////////////////////////////////////*/

var MyCore = (function (my) {
    return my;
} (MyCore || {}))

MyCore.TagBuilder = (function (my) {

    //#region 类定义

    //类：Html中的Style属性
    function StyleAttribute(styles) {
        this.KeyValuePair = styles || {};

        this.AddStyle = function (keyValPair) {
            for (var i in keyValPair) {
                this.KeyValuePair[i] = keyValPair[i];
            }
        };

        //重写toString,生成style内容信息
        this.toString = function () {
            var kvp = '';
            for (var i in this.KeyValuePair) {
                kvp += i + ":" + this.KeyValuePair[i] + ";";
            }
            return _formatAttribute('style', kvp);
        };
    };
    //类：Html中的任意元素
    function HtmlTag(
    tagName, //元素名，比如：div
    autoClose, //是否自关闭，比如<input />
    id, //id属性
    name, //name属性
    className, //class属性
    style, //样式数据对象，比如{color:'red'}
    customAttr, //自定义其他属性
    innerHtml//内部的元素Html
    ) {
        this.TagName = tagName;
        this.AutoClose = autoClose;
        this.ID = id;
        this.Name = name;
        this.ClassName = className;
        this.Style = new StyleAttribute(style);
        this.Attributes = customAttr;
        this.InnerHtml = innerHtml;
        //重写toString方法，根据自身信息生成Html标签
        this.toString = function () {
            var attrs = {}, headAttr = '', head = '', tail = '';
            attrs['id'] = this.ID;
            attrs['name'] = this.Name;
            attrs['class'] = this.ClassName;
            for (var i in this.Attributes) {
                attrs[i] = this.Attributes[i];
            }
            for (var i in attrs) {
                headAttr += ' ' + _formatAttribute(i, attrs[i]);
            }
            headAttr += ' ' + this.Style.toString();
            head = '<' + this.TagName + headAttr + (this.AutoClose ? '' : '>');
            tail = this.AutoClose ? '/>' : '</' + this.TagName + '>';
            return head + this.InnerHtml + tail;
        };
    };
    //#endregion

    //#region 内部数据
    //#endregion

    //#region 内部函数

    //格式化Html属性
    function _formatAttribute(name, val) {
        return name + '="' + val + '"';
    }

    //#endregion

    //#region API

    my.createTag = function (para) {
        return new HtmlTag(
        para.TagName || 'noTagName',
        para.AutoClose || false,
        para.ID || '',
        para.Name || '',
        para.ClassName || '',
        para.Style || {},
        para.CustomAttr || {},
        para.InnerHtml || ''
        );
    };

    //#endregion


    return my;
} (MyCore.TagBuilder || {}))