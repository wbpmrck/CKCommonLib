/**
 * @Created by kaicui(https://github.com/wbpmrck).
 * @Date:2013-08-26 15:56
 * @Desc: 用于进行浏览器版本检测
 * @Change History:
 --------------------------------------------
 @created：|kaicui| 2013-08-26 15:56.
 --------------------------------------------
 */
define('OneLib.BrowserDetect', [], function (require, exports, module) {

    exports.browser = "";
    exports.version = "";
    exports.OS = "";
    exports.versionSearchString = "";
    exports.init = function () {
        exports.browser = exports.searchString(exports.dataBrowser) || "An unknown browser";
        exports.version = exports.searchVersion(navigator.userAgent)
            || exports.searchVersion(navigator.appVersion)
            || "an unknown version";
        exports.OS = exports.searchString(exports.dataOS) || "an unknown OS";
    };
    exports.searchString = function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            exports.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    };
    exports.searchVersion = function (dataString) {
        var index = dataString.indexOf(exports.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + exports.versionSearchString.length + 1));
    };
    exports.dataBrowser = [
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
    exports.dataOS = [
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
    exports.init();
});