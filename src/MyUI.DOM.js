/*
作者： kaicui
依赖： 无
使用说明：用于DOM操作的扩展
版本历史：

2012年3月29日20:08:47      版本创建
//////////////////////////////////////////////////////////////////*/

var MyUI = (function (my) {
    return my;
} (MyUI || {}))

MyUI.DOM = (function (my) {
    //将光标移到输入框末尾
    my.moveToEnd = function (objid) {
        var obj = document.getElementById(objid);
        obj.focus();
        var len = obj.value.length;
        if (document.selection) {
            var sel = obj.createTextRange();
            sel.moveStart('character', len);
            sel.collapse();
            sel.select();
        } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
            obj.selectionStart = obj.selectionEnd = len;
        }
    };
    return my;
} (MyUI.DOM || {}))