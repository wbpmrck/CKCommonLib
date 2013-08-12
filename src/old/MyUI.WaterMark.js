/*
作者： kaicui
依赖： MyCore.Event
使用说明：
实现给文本框添加水印。主要基于添加额外的元素加绝对定位实现，而不是修改input的value实现
-----------
版本历史：
2012年4月25日14:26:05  功能更新
1、添加参数PaddingTop,允许从外部调整水印的位置
2、水印span添加margin-top和margin-bottom,与被遮盖的元素一致

2012年3月29日9:03:14      版本创建
//////////////////////////////////////////////////////////////////*/

var MyUI = (function (my) { return my;} (MyUI || {}))

MyUI.WaterMark = (function (my) {


    /* 文本框水印/占位符 */
    my.watermark = function (element, text, paddingTop) {
        if (!(this instanceof my.watermark))
            return new my.watermark(element, text, paddingTop);
        var addEvent = MyCore.Event.addEvent;
        var removeEvent = MyCore.Event.removeEvent;

        var place = document.createElement("span"); //提示信息标记
        element.parentNode.insertBefore(place, element); //插入到表单元素之前的位置
        place.className = "w-label";
        place.innerHTML = text;
        place.style.height = place.style.lineHeight = element.offsetHeight + "px"; //设置高度、行高以居中
        //add by kaicui 2012年4月25日 14:08:19 begin
        place.style.marginBottom = element.style.marginBottom;
        place.style.marginTop = element.style.marginTop;
        place.style.paddingTop = paddingTop || 0;
        //add by kaicui 2012年4月25日 14:19:32 end
        element.place = this;

        function hideIfHasValue() {
            if (element.value && place.className.indexOf("w-hide") == -1)
                place.className += " w-hide";
        }

        function onFocus() {
            hideIfHasValue()
            if (!element.value && place.className.indexOf("w-active") == -1)
                place.className += " w-active";
        }

        function onBlur() {
            if (!element.value) {
                place.className = place.className.replace(" w-active", "");
                place.className = place.className.replace(" w-hide", "");
            }
        }

        function onClick() {
            hideIfHasValue();
            try {
                element.focus && element.focus();
            } catch (ex) { }
        }

        // 注册各个事件
        hideIfHasValue();
        addEvent(element, "focus", onFocus);
        addEvent(element, "blur", onBlur);
        addEvent(element, "keyup", hideIfHasValue);
        addEvent(place, "click", onClick);

        // 取消watermark
        this.unload = function () {
            removeEvent(element, "focus", onFocus);
            removeEvent(element, "blur", onBlur);
            removeEvent(element, "keyup", hideIfHasValue);
            removeEvent(place, "click", onClick);
            element.parentNode.removeChild(place);
            element.place = null;
        };
    },

    /* 对于不支持html5 placeholder特性的浏览器应用watermark */
my.placeHolderForm = function (form) {
    var ph, elems = form.elements,
    html5support = "placeholder" in document.createElement("input");

    if (!html5support) {
        for (var i = 0, l = elems.length; i < l; i++) {
            ph = elems[i].getAttribute("placeholder");
            if (ph) elems[i].ph = my.watermark(elems[i], ph);
        }
    }
};
    return my;
} (MyUI.WaterMark || {}))