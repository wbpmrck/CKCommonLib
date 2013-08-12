/*
/*
作者： kaicui
依赖： 
使用说明：用于异步加载javascript脚本
计划实现：
1、统一的异步下载接口，通过配置可分别使用不同的方式动态加载js文件：
	a)动态script外链
	b)动态xhr下载，内联script标签
2、能够支持按顺序加载
3、能够与模块管理组件集成
4、能够识别模块依赖链

问题：
1、目前还未完成兼容性测试
--------------------------------------
版本历史：
2012年12月29日14:18:31	添加动态加载外链script标签来实现异步加载

2012年12月29日9:01:12      版本创建
//////////////////////////////////////////////////////////////////*/

var MyCore = (function (my) {
    return my;
} (MyCore || {}))

MyCore.ScriptLoader = (function (my) {

	my.loadScript = function(url,callback){
		var _script = document.createElement('script');
		_script.type ='text/javascipt';
		if (_script.readyState) {//IE
			_script.onreadystatechange =function(){
				if (_script.readyState=='loaded'||_script.readyState=='complete') {
					_script.onreadystatechange == null;
					if(callback)
						callback();
				};

			}
		}
		else{
			_script.onload = function(){
				if (callback) 
					callback();
			};
		}
		//append a script tag into the html document's body tag.and download the script
		_script.src=url;
		document.getElementsByTagName('head')[0].appendChild(_script);
	};
    return my;
} (MyCore.ScriptLoader || {}));