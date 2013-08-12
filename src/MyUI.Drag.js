/*
作者： kaicui

依赖： 无
使用说明：
1、支持对界面上元素进行拖动的功能
-----------
版本历史：
2012年6月26日10:05:35      代码重构
1、修改所有对外API首字母小写

2012年3月12日  9:14:12      版本创建
//////////////////////////////////////////////////////////////////*/
// namespace of the UI Module by kaicui 2012-2-28 16:43:50
var MyUI = (function (my) {
    return my;
} (MyUI || {}))

// namespace of the UI.Drag SubModule by kaicui 2012-2-28 16:43:50
MyUI.Drag = (function (my) {
    my.setDragable = function (
    triggerID, //the ele id which used to drag,like the title in winform
    draggedID//the ele which to be moved,often set to the dialog div
    ) {
        var isMove = false; //if true,means now can move
        var eleTrigger = document.getElementById(triggerID);
        var eleDragger = document.getElementById(draggedID);

        var prePosTrigger = { left: eleTrigger.style.left, top: eleTrigger.style.top }; //save the last positon of the container
        var prePosDragger = { left: eleDragger.style.left, top: eleDragger.style.top }; //save the last positon of the container

        //设置绝对定位
        eleDragger.style.position = "absolute";
        eleTrigger.onmousedown = function (event) {
            event = event ? event : window.event;
            var which = navigator.userAgent.indexOf('MSIE') > 1 ? event.button == 1 ? 1 : 0 : event.which == 1 ? 1 : 0;
            if (which) {
                isMove = true;
               
                //writeConsole('x:' + event.clientX + 'y:' + event.clientY);
                //                prePosTrigger.left = event.clientX - parseInt(eleTrigger.style.left);
                //                prePosTrigger.top = event.clientY - parseInt(eleTrigger.style.top);
                prePosTrigger.left = event.clientX;
                prePosTrigger.top = event.clientY;
            }
        };
        document.onmousemove = function (event) {
            event = event ? event : window.event;
            if (isMove) {
                var x = event.clientX - prePosTrigger.left;
                var y = event.clientY - prePosTrigger.top;
                // prePosDragger.left=eleDragger.style.left = parseInt(prePosDragger.left) + x + 'px';
                // prePosDragger.top=eleDragger.style.top = parseInt(prePosDragger.top) + y + 'px';
                eleDragger.style.left = eleDragger.offsetLeft + x + 'px';
                eleDragger.style.top = eleDragger.offsetTop + y + 'px';
                prePosTrigger.left = event.clientX;
                prePosTrigger.top = event.clientY;
            }
        };
        document.onmouseup = function () { isMove = false; };
    };
    return my;
} (MyUI.Drag || {}))