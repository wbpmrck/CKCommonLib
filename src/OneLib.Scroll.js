/**
 * @Created by kaicui(https://github.com/wbpmrck).
 * @Date:2013-08-17 13:47
 * @Desc: 封装浏览器滚动相关的操作
 *
 *
 *
 * @Change History:
 --------------------------------------------
 @created：|kaicui| 2013-08-17 13:47.
 --------------------------------------------
 */

define('OneLib.Scroll', [], function (require, exports, module) {
    //滚动到页面最顶部
    exports.scrollToTop = function () {
        window.scrollTo(0);
    };
    //向上滚动
    exports.scrollUp = function (y) {
        window.scrollBy(0, -y);
    };
    //向下滚动
    exports.scrollDown = function (y) {
        window.scrollBy(0, y);
    };
    //向上滚动到y
    exports.scrollUpTo = function (y) {
        window.scrollTo(0, y);
    };
});