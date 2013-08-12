/**
 * @Created by kaicui(https://github.com/wbpmrck).
 * @Date:2013-04-16 16:53
 * @Desc: 用于实现图片的异步加载
 * @Change History:
 --------------------------------------------


 @created：|kaicui| 2013-04-16 16:53.

1、保证回调执行顺序：error > ready > load；2、回调函数this指向img本身
2、增加图片完全加载后的回调 2、提高性能
 --------------------------------------------
 */

var MyCore = (function (my) {
    return my;
} (MyCore || {}));


MyCore.ImageLoader = (function (my) {
    var list = [], intervalId = null,

    // 用来执行队列
    tick = function () {
        var i = 0;
        for (; i < list.length; i++) {
            list[i].end ? list.splice(i--, 1) : list[i]();
        };
        !list.length && stop();
    },

    // 停止所有定时器队列
    stop = function () {
        clearInterval(intervalId);
        intervalId = null;
    };

    /**
     * 异步加载图片
     * @param url：图片地址
     * @param ready：图片大小获取到的事件(在load之前执行)
     * @param load：图片加载成功事件
     * @param error：图片加载失败事件
     * @param token：回调令牌(在回调中，可以通过image._token获取)
     */
    my.loadImage = function(url, ready, load, error,token){
        var onready, width, height, newWidth, newHeight,
            img = new Image();

        img.src = url;
        img._token = token;

        // 如果图片被缓存，则直接返回缓存数据
        if (img.complete) {
            ready&&ready.call(my,img);
            load && load.call(my,img);
            return;
        };

        width = img.width;
        height = img.height;
//        console.log('width : %s',width);
//        console.log('height : %s',height);
        // 加载错误后的事件
        img.onerror = function () {
            error && error.call(my,img);
            onready.end = true;
            img = img.onload = img.onerror = null;
        };

        // 图片尺寸就绪
        onready = function () {
            newWidth = img.width;
            newHeight = img.height;
//            console.log('newWidth : %s',newWidth);
//            console.log('newHeight : %s',newHeight);
            if (newWidth !== width || newHeight !== height ||
                // 如果图片已经在其他地方加载可使用面积检测
                newWidth * newHeight > 1024
                ) {
                ready&&ready.call(my,img);
                onready.end = true;
            };
        };
        onready();

        // 完全加载完毕的事件
        img.onload = function () {
            // onload在定时器时间差范围内可能比onready快
            // 这里进行检查并保证onready优先执行
            !onready.end && onready();

            load && load.call(my,img);

            // IE gif动画会循环执行onload，置空onload即可
            img = img.onload = img.onerror = null;
        };

        // 加入队列中定期执行:定期检查onready(图片大小的信息可能在onload之前就已经获取到了)
        if (!onready.end) {
            list.push(onready);
            // 无论何时只允许出现一个定时器，减少浏览器性能损耗
            if (intervalId === null) intervalId = setInterval(tick, 40);
        };
    };

    return my;
} (MyCore.ImageLoader || {}));