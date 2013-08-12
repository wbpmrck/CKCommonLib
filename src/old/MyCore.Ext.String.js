/*
作者： kaicui
依赖： 无
使用说明：对js内置对象String的prototype进行扩展。提供更多通用功能
版本历史：

2012年4月25日12:03:37 功能添加
1、添加判断字符串是否数字，以及长度范围的方法
2012年4月7日18:17:39   功能添加
1、添加trim、paddLeft方法
2、添加和文件名相关的方法：fileNameWithoutExt，extName，replaceExt

2012年3月29日20:08:47      版本创建
//////////////////////////////////////////////////////////////////*/

//字符串trim
String.prototype.trim = function () {
    var str = this,
  str = str.replace(/^\s\s*/, ''),
  ws = /\s/,
  i = str.length;
    while (ws.test(str.charAt(--i)));
    return str.slice(0, i + 1);
}
String.prototype.replaceAll = function(s1,s2) { 
	var text=this;
	while(text.indexOf(s1)>-1)
		text=text.replace(s1,s2);
    return text; 
}
//获取除了扩展名以外的文件名部分(不含.)
String.prototype.fileNameWithoutExt = function () {
    var url = this;
    if (url) {
        var id1 = url.lastIndexOf('.');
        var id2 = url.lastIndexOf('/');
        if (id1 > id2)
            return url.substring(id2+1, id1);
        else
            return "";
    }
    return "";
}
//获取扩展名(含.，如：.mp3)
String.prototype.extName = function () {
    var url = this;
    if (url) {
        var id1 = url.lastIndexOf('.');
        if (id1 >-1)
            return url.substring(id1);
        else
            return "";
    }
    return "";
}
//替换扩展名(参数不含.)
String.prototype.replaceExt = function (newExt) {
    var url = this;
    if (url) {
        var id1 = url.lastIndexOf('.');
        if (id1 > -1)
            return (url.substring(0, id1 + 1) + newExt);
        else
            return "";
    }
    return "";
}
//给字符串左补字符，str:要补位的字符，n表示总长度
String.prototype.paddLeft = function (str, n) {
    var selfstr = this;
    var len = selfstr.toString().length;
    while (len < n) {
        selfstr = str + selfstr;
        len++;
    }
    return selfstr;
};
//add by kaicui 2012年4月25日 11:46:04 判断字符串是否为纯数字（支持传入位数范围判断）
String.prototype.isNumber = function (para) {
    var selfstr = this;
    para = para || {};
    var lengMin = para.minLength, lengMax = para.maxLength;
    //不限制长度的纯数字
    if (!(lengMin || lengMax))
        return /^[0-9]+$/.test(selfstr);
    else {
        var expression = '/^[0-9]{' + (lengMin || "0") + ',' + (lengMax || "") + '}$/';
        return eval(expression).test(selfstr);
    }
};

