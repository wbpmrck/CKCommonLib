/*
作者： kaicui

依赖： 无
使用说明：
1、支持MD5加密和DES加密
-----------
版本历史：

2013年1月30日9:37:02		兼容性问题修复：修复了ff浏览器中innerText属性不存在的问题，改用textContent

2012年6月26日10:05:35      代码重构
1、修改所有对外API首字母小写

2012年3月12日  9:14:12      版本创建
//////////////////////////////////////////////////////////////////*/
// namespace of the MySecure Module by kaicui 2012-2-23 10:00:51 
var MySecure = (function (my) {
    return my;
} (MySecure || {}));

//namespace of the MySecure.MD5 Module by kaicui 2012-2-23 10:00:52 
MySecure.Encoding = (function (my) {
    //私有属性和方法集合
    var _={
        htmlEncodeDiv:document.createElement('div'), //用于进行htmlEncode的Div
        //编码单双引号
        escapeQuote:function(text){
            return text.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
        },
        //解码单双引号
        unescapeQuote:function(text){
            return text.replace(/&apos;/g, "'").replace(/&quot;/g, '"');
        }
    };

    /**
     *  html编码
     * @param originText:要编码的文本
     * @return {string}:编码后的文本
     */
    my.htmlEncode=function(originText){
        'innerText' in _.htmlEncodeDiv?(_.htmlEncodeDiv.innerText = originText):(_.htmlEncodeDiv.textContent = originText);
        return _.escapeQuote(_.htmlEncodeDiv.innerHTML);
    };

    /**
     * Html解码
     * @param encodedText:要解码的文本
     * @return {string}:解码后的文本
     */
    my.htmlDecode=function(encodedText){
        _.htmlEncodeDiv.innerHTML = encodedText;
        return _.unescapeQuote('innerText' in _.htmlEncodeDiv?_.htmlEncodeDiv.innerText:_.htmlEncodeDiv.textContent);
    };
    return my;
} (MySecure.Encoding || {}));

