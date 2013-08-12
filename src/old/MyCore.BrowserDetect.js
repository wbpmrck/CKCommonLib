/*
作者： kaicui
依赖：无
使用说明：检测浏览器版本
-------------------------------------------------------------
版本历史：

2012年7月25日14:39:39      版本创建
//////////////////////////////////////////////////////////////////*/

var MyCore = (function (my) {
    return my;
} (MyCore || {}))

MyCore.BrowserDetect = (function (my) {
    my.browser = "";
    my.version = "";
    my.OS = "";
    my.versionSearchString = "";
    my.init = function () {
        my.browser = my.searchString(my.dataBrowser) || "An unknown browser";
        my.version = my.searchVersion(navigator.userAgent)
			|| my.searchVersion(navigator.appVersion)
			|| "an unknown version";
        my.OS = my.searchString(my.dataOS) || "an unknown OS";
    };
    my.searchString = function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            my.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    };
    my.searchVersion = function (dataString) {
        var index = dataString.indexOf(my.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + my.versionSearchString.length + 1));
    };
    my.dataBrowser = [
		{
		    string: navigator.userAgent,
		    subString: "Chrome",
		    identity: "Chrome"
		},
		{ string: navigator.userAgent,
		    subString: "OmniWeb",
		    versionSearch: "OmniWeb/",
		    identity: "OmniWeb"
		},
		{
		    string: navigator.vendor,
		    subString: "Apple",
		    identity: "Safari",
		    versionSearch: "Version"
		},
		{
		    prop: window.opera,
		    identity: "Opera",
		    versionSearch: "Version"
		},
		{
		    string: navigator.vendor,
		    subString: "iCab",
		    identity: "iCab"
		},
		{
		    string: navigator.vendor,
		    subString: "KDE",
		    identity: "Konqueror"
		},
		{
		    string: navigator.userAgent,
		    subString: "Firefox",
		    identity: "Firefox"
		},
		{
		    string: navigator.vendor,
		    subString: "Camino",
		    identity: "Camino"
		},
		{		// for newer Netscapes (6+)
		    string: navigator.userAgent,
		    subString: "Netscape",
		    identity: "Netscape"
		},
		{
		    string: navigator.userAgent,
		    subString: "MSIE",
		    identity: "Explorer",
		    versionSearch: "MSIE"
		},
		{
		    string: navigator.userAgent,
		    subString: "Gecko",
		    identity: "Mozilla",
		    versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
		    string: navigator.userAgent,
		    subString: "Mozilla",
		    identity: "Netscape",
		    versionSearch: "Mozilla"
		}
	];
    my.dataOS = [
		{
		    string: navigator.platform,
		    subString: "Win",
		    identity: "Windows"
		},
		{
		    string: navigator.platform,
		    subString: "Mac",
		    identity: "Mac"
		},
		{
		    string: navigator.userAgent,
		    subString: "iPhone",
		    identity: "iPhone/iPod"
		},
		{
		    string: navigator.platform,
		    subString: "Linux",
		    identity: "Linux"
		}
	];

    my.init();
    return my;
} (MyCore.BrowserDetect || {}));