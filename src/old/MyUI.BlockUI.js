
/// <reference path="demo/JS/jquery-1.7.1.min.js" />
/// <reference path="MyOOP.Utils.js" />
/// <reference path="MyOOP.Syntax.Module.js" />
/// <reference path="MyCore.WindowSize.js" />
/// <reference path="MyUI.Util.js" />
/// <reference path="MyCore.Config.js" />


/*
作者： kaicui
依赖： MyCore.WindowSize.js,MyUI.Util.js,MyCore.Config.js,MyOOP（内含开源组件BlockUI）
使用说明：
提供对页面进行遮罩的功能
1、支持弹出遮罩本地元素
2、弹出遮罩给定Html
3、取消遮罩
4、可以倒计时自动关闭,并订阅倒计时处理函数，也可以给整个弹出框添加关闭事件处理函数
5、可以异步加载远程文件，并自动计算大小居中显示
6、支持配置等待元素，在加载过程中显示等待元素。

--------------------------------------
版本历史：
2013年2月25日15:36:22    功能添加
1、在每个操作开始的时候，初始化config的callback为空

2012年9月5日19:26:33     功能添加
1、修改unBlock方法，支持传入mode,在回调函数中直接回传mode,让客户端自定义按钮代码.系统自动关闭统一传0

2012年8月30日13:59:57     功能添加
1、支持DOM加载完成事件

2012年7月5日19:47:48       代码重构
1、重构blockUIWrapper的功能，使用OOP格式编写，提供最基础的遮罩和异步加载远程页面、无缝弹出层切换功能
2、支持自定义：
a)等待图标元素ID
b)自定义不同格式的弹出框Html样式

2012年6月26日10:05:35      代码重构
1、修改所有对外API首字母小写

2012年4月24日15:24:09      添加功能
1、添加了对元素进行遮罩并在指定时间后自动解开的功能，支持传入回调函数来根据剩余描述修改UI


2012年3月29日17:33:33      版本创建
1、添加第一个功能：buttonTipBlock,对页面进行局部遮罩，并且可以修改某个按钮Div的text(通常是个等待文本),并且记录下该
按钮之前的文本。当用户需要取消遮罩时，再还原其文本
//////////////////////////////////////////////////////////////////*/

//#region BlockUI插件源码(修改强化版)

/*!
 * jQuery blockUI plugin
 * Version 2.38 (29-MAR-2011)
 * @requires jQuery v1.2.3 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2010 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 update by kaicui 2012年3月27日 14:46:32
 1、修改遮罩层高度的获取方式，根据不同的模式进行获取。同时考虑到遮罩层也用于局部遮罩，所以在获取高度的时候考虑局部遮罩的情况。

 update by kaicui 2012-1-16 19:01:17 
 purpose:
 1、将元素移出钱，在元素后面插入一个隐藏的有id的span,作为标记，记录元素的父亲，以及后面那个的span，当要显示新的层，或者关闭当前层的时候，需要将该元素移动回原处。
 */

;(function($) {

if (/1\.(0|1|2)\.(0|1|2)/.test($.fn.jquery) || /^1.1/.test($.fn.jquery)) {
	alert('blockUI requires jQuery v1.2.3 or later!  You are using v' + $.fn.jquery);
	return;
}

$.fn._fadeIn = $.fn.fadeIn;

var noOp = function() {};

// this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
// retarded userAgent strings on Vista)
var mode = document.documentMode || 0;
var setExpr = $.browser.msie && (($.browser.version < 8 && !mode) || mode < 8);
var ie6 = $.browser.msie && /MSIE 6.0/.test(navigator.userAgent) && !mode;


// global $ methods for blocking/unblocking the entire page
$.blockUI   = function(opts) { install(window, opts); };
$.unblockUI = function(opts) { remove(window, opts); };

// convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
$.growlUI = function(title, message, timeout, onClose) {
	var $m = $('<div class="growlUI"></div>');
	if (title) $m.append('<h1>'+title+'</h1>');
	if (message) $m.append('<h2>'+message+'</h2>');
	if (timeout == undefined) timeout = 3000;
	$.blockUI({
		message: $m, fadeIn: 700, fadeOut: 1000, centerY: false,
		timeout: timeout, showOverlay: false,
		onUnblock: onClose, 
		css: $.blockUI.defaults.growlCSS
	});
};

// plugin method for blocking element content
$.fn.block = function(opts) {
	return this.unblock({ fadeOut: 0 }).each(function() {
		if ($.css(this,'position') == 'static')
			this.style.position = 'relative';
		if ($.browser.msie)
			this.style.zoom = 1; // force 'hasLayout'
		install(this, opts);
	});
};

// plugin method for unblocking element content
$.fn.unblock = function(opts) {
	return this.each(function() {
		remove(this, opts);
	});
};

$.blockUI.version = 2.38; // 2nd generation blocking at no extra cost!

// override these in your code to change the default behavior and style
$.blockUI.defaults = {
	// message displayed when blocking (use null for no message)
	message:  '<h1>Please wait...</h1>',

	title: null,	  // title string; only used when theme == true
	draggable: true,  // only used when theme == true (requires jquery-ui.js to be loaded)
	
	theme: false, // set to true to use with jQuery UI themes
	
	// styles for the message when blocking; if you wish to disable
	// these and use an external stylesheet then do this in your code:
	// $.blockUI.defaults.css = {};
	css: {
		padding:	0,
		margin:		0,
		width:		'30%',
		top:		'40%',
		left:		'35%',
		textAlign:	'center',
		color:		'#000',
		border:		'3px solid #aaa',
		backgroundColor:'#fff',
		cursor:		'wait'
	},
	
	// minimal style set used when themes are used
	themedCSS: {
		width:	'30%',
		top:	'40%',
		left:	'35%'
	},

	// styles for the overlay
	overlayCSS:  {
		backgroundColor: '#000',
		opacity:	  	 0.6,
		cursor:		  	 'wait'
	},

	// styles applied when using $.growlUI
	growlCSS: {
		width:  	'350px',
		top:		'10px',
		left:   	'',
		right:  	'10px',
		border: 	'none',
		padding:	'5px',
		opacity:	0.6,
		cursor: 	'default',
		color:		'#fff',
		backgroundColor: '#000',
		'-webkit-border-radius': '10px',
		'-moz-border-radius':	 '10px',
		'border-radius': 		 '10px'
	},
	
	// IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
	// (hat tip to Jorge H. N. de Vasconcelos)
	iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',

	// force usage of iframe in non-IE browsers (handy for blocking applets)
	forceIframe: false,

	// z-index for the blocking overlay
	baseZ: 1000,

	// set these to true to have the message automatically centered
	centerX: true, // <-- only effects element blocking (page block controlled via css above)
	centerY: true,

	// allow body element to be stetched in ie6; this makes blocking look better
	// on "short" pages.  disable if you wish to prevent changes to the body height
	allowBodyStretch: true,

	// enable if you want key and mouse events to be disabled for content that is blocked
	bindEvents: true,

	// be default blockUI will supress tab navigation from leaving blocking content
	// (if bindEvents is true)
	constrainTabKey: true,

	// fadeIn time in millis; set to 0 to disable fadeIn on block
	fadeIn:  200,

	// fadeOut time in millis; set to 0 to disable fadeOut on unblock
	fadeOut:  400,

	// time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
	timeout: 0,

	// disable if you don't want to show the overlay
	showOverlay: true,

	// if true, focus will be placed in the first available input field when
	// page blocking
	focusInput: true,

	// suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
	applyPlatformOpacityRules: true,
	
	// callback method invoked when fadeIn has completed and blocking message is visible
	onBlock: null,

	// callback method invoked when unblocking has completed; the callback is
	// passed the element that has been unblocked (which is the window object for page
	// blocks) and the options that were passed to the unblock call:
	//	 onUnblock(element, options)
	onUnblock: null,

	// don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
	quirksmodeOffsetHack: 4,

	// class name of the message block
	blockMsgClass: 'blockMsg'
};

//add by kaicui 2012年3月25日 10:37:26 begin
var _platForm='pc';
$.blockUI.SetPlatForm=function(plat){
_platForm=plat;
};
var _getFixedClassByPlatForm =function(){
if (_platForm =='pc')
    return 'fixed';
    else
    return 'absolute';
};
var _getDocHeightByPlatForm =function(isFull){
if (_platForm =='pc'||!isFull)
    return '100%';
else{
    if (document.body.scrollWidth != undefined)
       return document.body.scrollHeight+'px'; 
       else
       return document.documentElement.scrollHeight+'px';
}
};
//add by kaicui 2012年3月25日 10:37:26 end
//add by kaicui 2012-1-17 11:14:56  begin
//get if the page is blocked now
$.blockUI.IsPageBlocked = function(){
return pageBlock;
};
//if now blocking,move the blocked content to the raw position
$.blockUI.MoveContentBack = function(isFade){
if(pageBlock!=null){
    //if a native element was shown as block content,move it back to where it was
	var data = $(window).data('blockUI.history');
    if (data && data.el) {
		data.el.style.display = data.display;
		data.el.style.position = data.position;
        $(data.el).insertBefore("#ckblockUItag");
        $("#ckblockUItag").remove();//remove the tag whitch to notify where the element position
//		$(el).removeData('blockUI.history');update by kaicui 2012年7月8日 13:29:28
		$(window).removeData('blockUI.history');
        //notice that we have not remove the content just shown,the client can remove it by themself
	}
}
};
//move  the block content position
$.blockUI.MovePosition = function(topNew,leftNew){
    $(".blockPage").css("left", leftNew);
    $(".blockPage").css("top", topNew);
};
//add by kaicui 2012-1-17 11:14:56  end

// private data and functions follow...

var pageBlock = null;
var pageBlockEls = [];

function install(el, opts) {
	var full = (el == window);
	var msg = opts && opts.message !== undefined ? opts.message : undefined;
	opts = $.extend({}, $.blockUI.defaults, opts || {});
	opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
	var css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
	var themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
	msg = msg === undefined ? opts.message : msg;

	// remove the current block (if there is one)
	if (full && pageBlock)
		remove(window, {fadeOut:0});

	// if an existing element is being used as the blocking content then we capture
	// its current place in the DOM (and current display style) so we can restore
	// it when we unblock
	if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
		var node = msg.jquery ? msg[0] : msg;
		var data = {};
		$(el).data('blockUI.history', data);//save the raw status of the node to display [explain by kaicui 2012-1-16 19:26:06 ]
		data.el = node;
		data.parent = node.parentNode;
		data.display = node.style.display;
		data.position = node.style.position;
        //add by kaicui 2012-1-16 19:26:34  begin
		if (data.parent)
        $(node).after('<span id="ckblockUItag" style="display:none;">just a tag</span>');
        //add by kaicui 2012-1-16 19:26:40  end
		if (data.parent)
			data.parent.removeChild(node);
	}

	var z = opts.baseZ;

	// blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
	// layer1 is the iframe layer which is used to supress bleed through of underlying content
	// layer2 is the overlay layer which has opacity and a wait cursor (by default)
	// layer3 is the message content that is displayed while blocking

	var lyr1 = ($.browser.msie || opts.forceIframe) 
//		? $('<iframe class="blockUI" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+opts.iframeSrc+'"></iframe>')
		? $('<iframe class="blockUI" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:'+_getDocHeightByPlatForm(full)+';top:0;left:0" src="'+opts.iframeSrc+'"></iframe>')
		: $('<div class="blockUI" style="display:none"></div>');
	
	var lyr2 = opts.theme 
	 	? $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+ (z++) +';display:none"></div>')
	 	: $('<div class="blockUI blockOverlay" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;width:100%;height:'+_getDocHeightByPlatForm(full)+';top:0;left:0"></div>');

	var lyr3, s;
	if (opts.theme && full) {
    //update by kaicui 2012年3月25日 10:41:25
//		s = '<div id="ckBlockUILayer" class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+z+';display:none;position:fixed">' +
		s = '<div id="ckBlockUILayer" class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+z+';display:none;position:'+_getFixedClassByPlatForm()+'">' +
				'<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>' +
				'<div class="ui-widget-content ui-dialog-content"></div>' +
			'</div>';
	}
	else if (opts.theme) {
		s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+z+';display:none;position:absolute">' +
				'<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>' +
				'<div class="ui-widget-content ui-dialog-content"></div>' +
			'</div>';
	}
	else if (full) {
//		s = '<div id="ckBlockUILayer"  class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:'+z+';display:none;position:fixed"></div>';
		s = '<div id="ckBlockUILayer"  class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:'+z+';display:none;position:'+_getFixedClassByPlatForm()+'"></div>';
	}			
	else {
		s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:'+z+';display:none;position:absolute"></div>';
	}
	lyr3 = $(s);

	// if we have a message, style it
	if (msg) {
		if (opts.theme) {
			lyr3.css(themedCSS);
			lyr3.addClass('ui-widget-content');
		}
		else 
			lyr3.css(css);
	}

	// style the overlay
	if (!opts.theme && (!opts.applyPlatformOpacityRules || !($.browser.mozilla && /Linux/.test(navigator.platform))))
		lyr2.css(opts.overlayCSS);
//	lyr2.css('position', full ? 'fixed' : 'absolute');
	lyr2.css('position', full ? _getFixedClassByPlatForm() : 'absolute');

	// make iframe layer transparent in IE
	if ($.browser.msie || opts.forceIframe)
		lyr1.css('opacity',0.0);

	//$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
	var layers = [lyr1,lyr2,lyr3], $par = full ? $('body') : $(el);
	$.each(layers, function() {
		this.appendTo($par);
	});
	
	if (opts.theme && opts.draggable && $.fn.draggable) {
		lyr3.draggable({
			handle: '.ui-dialog-titlebar',
			cancel: 'li'
		});
	}

	// ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
	var expr = setExpr && (!$.boxModel || $('object,embed', full ? null : el).length > 0);
	if (ie6 || expr) {
		// give body 100% height
		if (full && opts.allowBodyStretch && $.boxModel)
			$('html,body').css('height','100%');

		// fix ie6 issue when blocked element has a border width
		if ((ie6 || !$.boxModel) && !full) {
			var t = sz(el,'borderTopWidth'), l = sz(el,'borderLeftWidth');
			var fixT = t ? '(0 - '+t+')' : 0;
			var fixL = l ? '(0 - '+l+')' : 0;
		}

		// simulate fixed position
		$.each([lyr1,lyr2,lyr3], function(i,o) {
			var s = o[0].style;
			s.position = 'absolute';
			if (i < 2) {
				full ? s.setExpression('height','Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.boxModel?0:'+opts.quirksmodeOffsetHack+') + "px"')
					 : s.setExpression('height','this.parentNode.offsetHeight + "px"');
				full ? s.setExpression('width','jQuery.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"')
					 : s.setExpression('width','this.parentNode.offsetWidth + "px"');
				if (fixL) s.setExpression('left', fixL);
				if (fixT) s.setExpression('top', fixT);
			}
			else if (opts.centerY) {
				if (full) s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
				s.marginTop = 0;
			}
			else if (!opts.centerY && full) {
				var top = (opts.css && opts.css.top) ? parseInt(opts.css.top) : 0;
				var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + '+top+') + "px"';
				s.setExpression('top',expression);
			}
		});
	}

	// show the message
	if (msg) {
		if (opts.theme)
			lyr3.find('.ui-widget-content').append(msg);
		else
			lyr3.append(msg);
		if (msg.jquery || msg.nodeType)
			$(msg).show();
	}

	if (($.browser.msie || opts.forceIframe) && opts.showOverlay)
		lyr1.show(); // opacity is zero
	if (opts.fadeIn) {
		var cb = opts.onBlock ? opts.onBlock : noOp;
		var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
		var cb2 = msg ? cb : noOp;
		if (opts.showOverlay)
			lyr2._fadeIn(opts.fadeIn, cb1);
		if (msg)
			lyr3._fadeIn(opts.fadeIn, cb2);
	}
	else {
		if (opts.showOverlay)
			lyr2.show();
		if (msg)
			lyr3.show();
		if (opts.onBlock)
			opts.onBlock();
	}

	// bind key and mouse events
	bind(1, el, opts);

	if (full) {
		pageBlock = lyr3[0];
		pageBlockEls = $(':input:enabled:visible',pageBlock);
		if (opts.focusInput)
			setTimeout(focus, 20);
	}
	else
		center(lyr3[0], opts.centerX, opts.centerY);

	if (opts.timeout) {
		// auto-unblock
		var to = setTimeout(function() {
			full ? $.unblockUI(opts) : $(el).unblock(opts);
		}, opts.timeout);
		$(el).data('blockUI.timeout', to);
	}
};

// remove the block
function remove(el, opts) {
	var full = (el == window);
	var $el = $(el);
	var data = $el.data('blockUI.history');
	var to = $el.data('blockUI.timeout');
	if (to) {
		clearTimeout(to);
		$el.removeData('blockUI.timeout');
	}
	opts = $.extend({}, $.blockUI.defaults, opts || {});
	bind(0, el, opts); // unbind events
	
	var els;
	if (full) // crazy selector to handle odd field errors in ie6/7
		els = $('body').children().filter('.blockUI').add('body > .blockUI');
	else
		els = $('.blockUI', el);

	if (full)
		pageBlock = pageBlockEls = null;

	if (opts.fadeOut) {
		els.fadeOut(opts.fadeOut);
		setTimeout(function() { reset(els,data,opts,el); }, opts.fadeOut);
	}
	else
		reset(els, data, opts, el);
};

// move blocking element back into the DOM where it started
function reset(els,data,opts,el) {
	els.each(function(i,o) {
		// remove via DOM calls so we don't lose event handlers
		if (this.parentNode)
			this.parentNode.removeChild(this);
	});

	if (data && data.el) {
		data.el.style.display = data.display;
		data.el.style.position = data.position;
        //update by kaicui 2012-1-16 19:53:53 begin
//		if (data.parent)
//			data.parent.appendChild(data.el);
        $(data.el).insertBefore("#ckblockUItag");
        $("#ckblockUItag").remove();
        //update by kaicui 2012-1-16 19:53:53 end
		$(el).removeData('blockUI.history');
	}

	if (typeof opts.onUnblock == 'function')
		opts.onUnblock(el,opts);
};

// bind/unbind the handler
function bind(b, el, opts) {
	var full = el == window, $el = $(el);

	// don't bother unbinding if there is nothing to unbind
	if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
		return;
	if (!full)
		$el.data('blockUI.isBlocked', b);

	// don't bind events when overlay is not in use or if bindEvents is false
	if (!opts.bindEvents || (b && !opts.showOverlay)) 
		return;

	// bind anchors and inputs for mouse and key events
	var events = 'mousedown mouseup keydown keypress';
	b ? $(document).bind(events, opts, handler) : $(document).unbind(events, handler);

// former impl...
//	   var $e = $('a,:input');
//	   b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
};

// event handler to suppress keyboard/mouse events when blocking
function handler(e) {
	// allow tab navigation (conditionally)
	if (e.keyCode && e.keyCode == 9) {
		if (pageBlock && e.data.constrainTabKey) {
			var els = pageBlockEls;
			var fwd = !e.shiftKey && e.target === els[els.length-1];
			var back = e.shiftKey && e.target === els[0];
			if (fwd || back) {
				setTimeout(function(){focus(back)},10);
				return false;
			}
		}
	}
	var opts = e.data;
	// allow events within the message content
	if ($(e.target).parents('div.' + opts.blockMsgClass).length > 0)
		return true;

	// allow events for content that is not being blocked
	return $(e.target).parents().children().filter('div.blockUI').length == 0;
};

function focus(back) {
	if (!pageBlockEls)
		return;
	var e = pageBlockEls[back===true ? pageBlockEls.length-1 : 0];
	if (e)
		e.focus();
};

function center(el, x, y) {
	var p = el.parentNode, s = el.style;
	var l = ((p.offsetWidth - el.offsetWidth)/2) - sz(p,'borderLeftWidth');
	var t = ((p.offsetHeight - el.offsetHeight)/2) - sz(p,'borderTopWidth');
	if (x) s.left = l > 0 ? (l+'px') : '0';
	if (y) s.top  = t > 0 ? (t+'px') : '0';
};

function sz(el, p) {
	return parseInt($.css(el,p))||0;
};

})(jQuery);


//#endregion


define('MyUI.BlockUIBase', ['MyCore.WindowSize.js', 'MyCore.Config'], function (context) {
    var self = context.self;
    var windowSizeModule = context.imports['MyCore.WindowSize'];
    var configModule = context.imports['MyCore.Config'];

    //#region 内部变量、函数
    var _configManager = configModule.newConfigManager({
        onLoadFunc: undefined, //Html加载完毕后的回调函数
        callback: undefined, //弹出层关闭后的回调函数
        waiterID: undefined, //作为等待图标的元素,优先级高
        waiterHtml: undefined, //作为等待图标的Html，优先级低
        fadeMilliseconds: 200, //默认fade效果的毫秒数
        platform: 'pc', //默认平台[pc,mobile]
        showOverlay: true, //是否显示遮罩背景（模态弹出框）
        priority: 0, //默认的弹出框优先级
        clickOverlayToClose: false, //点击遮罩处是否关闭弹出框
        isCache: false, //请求远程url地址是否缓存
        //默认样式
        defaultCss: { padding: 0,
            margin: 0,
            border: 'none',
            cursor: 'auto',
            width: 'auto',
            baseZ: 99999,
            'text-align': 'left',
            background: 'none'
        },
        //遮罩层样式
        overlayCSS: {
            backgroundColor: '#000',
            cursor: 'normal',
            opacity: 0.3
        },
        //自动关闭相关配置
        autoClose: {
            enable: false, //是否开启自动关闭功能
            autoCloseSeconds: 3, //自动关闭的时间
            callback: undefined//自动关闭每次倒计时的回调函数(会给出当前剩余秒数)
        }
    });

    $.blockUI.SetPlatForm('pc'); //指定blockUI使用的平台

    var _internalDivs = 0;  //用于生成测试用div的计数器
    var _nowCallBack = undefined; //窗口关闭后的回调函数

    var _autoCloseSecondsLeft; //还有多少秒自动关闭
    var _autoCloseController; //控制自动关闭的计时器

    var _lastPriority = 0; //正在block的页面的优先级



    //callBack to the caller
    function _processCallback(result, configs) {
        var _nowCallBack = configs.callback;
        if (_nowCallBack && typeof _nowCallBack === 'function') {
        	_configManager.setConfigs({ callback: undefined }); //调用完一次之后，取消对该回调函数的记录
            _nowCallBack(result);
        }
    };

    //if the page is now blocked
    function _isBlocked() {
        var isblock = $.blockUI.IsPageBlocked();
        return isblock == null ? false : true;
    };
    //    //check if there is any content be shown,if has,remove content and call back
    //    function _checkAndRemoveBlockContent(checkedCallback) {
    //        var nowConfigs = _configManager.getConfigs();
    //        if (_isBlocked()) {
    //            $(".blockPage").fadeOut(nowConfigs.fadeMilliseconds);
    //            setTimeout(function () {
    //                $.blockUI.MoveContentBack();
    //                checkedCallback();
    //            }, nowConfigs.fadeMilliseconds);
    //        }
    //        else {
    //            checkedCallback();
    //        }
    //    };
    //根据传入的配置信息，决定是否调用载入回调功能
    function _detectOnLoad(configs) {
        var _onLoadFunc = configs.onLoadFunc;
        if (_onLoadFunc && typeof _onLoadFunc === 'function') {
            setTimeout(_onLoadFunc, configs.fadeMilliseconds);
        }
    };

    //判断优先级
    function _judgePriority(configs) {
        return configs.priority >= _lastPriority;
    };

    //根据传入的配置信息，决定是否启用自动关闭功能
    function _detectAutoClose(configs) {
        //如果启用自动关闭功能
        if (configs.autoClose.enable) {
            _autoCloseSecondsLeft = configs.autoClose.autoCloseSeconds;
            //重置当前计时器
            if (_autoCloseController)
                clearInterval(_autoCloseController);
            _autoCloseController = setInterval(function () { _updateAutoClose(configs); }, 1000);
        }
        //如果不启用自动关闭，则取消之前可能存在的自动关闭回调
        else {
            //重置当前计时器
            if (_autoCloseController)
                clearInterval(_autoCloseController);
        }
    };

    //自动更新剩余关闭时间并处理关闭
    function _updateAutoClose(configs) {
        var _autoCloseCounterCallback = configs.autoClose.callback;
        if (_autoCloseSecondsLeft > 0) {
            if (_autoCloseCounterCallback && typeof _autoCloseCounterCallback === 'function')
                _autoCloseCounterCallback(_autoCloseSecondsLeft);
            _autoCloseSecondsLeft--;
        }
        else
            _buttonClick(0, configs);
    };
    //当弹出框有按钮被点击时处理：buttonType{0:关闭按钮 1：确认按钮 2：取消按钮 【此处为用户自己传入，也可以不这么定义】}
    function _buttonClick(buttonType, configs) {
        //add by kaicui 2012年3月22日 21:15:30【关闭窗口之前，取消计时器】
        if (_autoCloseController)
            clearInterval(_autoCloseController);
        //关闭窗口
        $.unblockUI();
        setTimeout(function () { _processCallback(buttonType, configs); }, configs.fadeMilliseconds);
        //        if (buttonType == undefined) {
        //            $.unblockUI();
        //            setTimeout(function () { _processCallback(false, configs); }, configs.fadeMilliseconds);
        //        }
        //        else if (buttonType == 0) {
        //            $.unblockUI();
        //            setTimeout(function () { _processCallback(false, configs); }, configs.fadeMilliseconds);
        //        }
        //        else if (buttonType == 1) {
        //            $.unblockUI();
        //            setTimeout(function () { _processCallback(true, configs); }, configs.fadeMilliseconds);
        //        }
        //        else if (buttonType == 2) {
        //            $.unblockUI();
        //            setTimeout(function () { _processCallback(false, configs); }, configs.fadeMilliseconds);
        //        }
    };

    //内部函数，根据当前模式获取弹出窗定位母窗口的大小
    function _getClientSizeByMode() {
        var size = { Width: windowSizeModule.getViewportWidth(), Height: 0 };
        var _platform = _configManager.getConfigs().platform;
        if (_platform == 'pc') {
            size.Height = windowSizeModule.getViewportHeight();
        }
        else {
            size.Height = windowSizeModule.getDocumentHeight();
        }
        return size;
    };

    //内部函数，根据当前模式、窗口大小和内容大小，获取弹出窗定位位置
    function _getLayerPos(clientSize, contentSize) {
        var pos = {}, _platform = _configManager.getConfigs().platform;
        if (_platform == 'pc') {
            pos.left = (clientSize.Width - contentSize.Width) / 2 + "px";
            pos.top = (clientSize.Height - contentSize.Height) / 2 + "px";
        }
        else {
            var viewH = windowSizeModule.getViewportHeight();
            var scrollH = windowSizeModule.getVerticalScroll();
            pos.left = (clientSize.Width - contentSize.Width) / 2;
            var newTop = (viewH - contentSize.Height) / 2;
            newTop = newTop < 0 ? 0 : newTop;
            pos.top = scrollH + newTop + "px";
        }
        return pos;
    };

    //resize the wrap div to the middle of the screen
    //根据传入的html内容(或者已经存在的元素JQ对象)，计算该内容应该摆放在屏幕的位置，并给出回调
    function _getWrapMiddleSize(contentOrJQObj, sizeGetCallback) {
        var div;
        _internalDivs++;
        //get the content size
        var contentWidth = 0;
        var contentHeight = 0;
        var clientSize = _getClientSizeByMode();
        //get the content infact size and callback to the client user
        function _calculateSize() {
            contentWidth = parseInt($("#" + divid).width());
            contentHeight = parseInt($("#" + divid).height());
            $("#" + divid).remove();
            sizeGetCallback(contentOrJQObj, _getLayerPos(clientSize, { Width: contentWidth, Height: contentHeight }));
        }
        //如果传入的直接是一个jq对象，则表示要计算的元素已经存在
        if (typeof contentOrJQObj === 'object') {
            sizeGetCallback(contentOrJQObj, _getLayerPos(clientSize, { Width: parseInt(contentOrJQObj.width()), Height: parseInt(contentOrJQObj.height()) }));
        }
        //否则需要建立虚拟元素辅助测量大小
        else {
            //generate a hidden div to measure the content size
            var divid = "ckMeasureDiv" + _internalDivs;
            div = ['<div id="', divid, '" style="display:none">', contentOrJQObj, '</div>'].join('');
            $("body").append(div);
            //      $("body").after(div);//this cannot work in 360,because 360 doesn't display a div out of body
            //delay 0.1s to let the browser measure the content
            setTimeout(_calculateSize, 100);
        }
    };
    //获得当前弹出层应该设置的样式
    function _getCss(newSize) {
        var _defaultCss = _configManager.getConfigs().defaultCss;
        return {
            padding: _defaultCss.padding,
            margin: _defaultCss.margin,
            border: _defaultCss.border,
            cursor: _defaultCss.cursor,
            width: _defaultCss.width,
            baseZ: _defaultCss.baseZ,
            background: _defaultCss.background,
            'text-align': _defaultCss['text-align'],
            left: newSize.left,
            top: newSize.top
        }
    };
    //展示Html内容
    function _showContent(html, configs, size) {
        if (_isBlocked()&&!_judgePriority(configs))
            return;
        _detectAutoClose(configs);
        if (_isBlocked()) {
            $.blockUI.MovePosition(size.top, size.left);
            $(".blockPage").fadeIn(200);
            $(".blockPage").html(html);
            if (configs.clickOverlayToClose) {
                $('.blockOverlay').css('cursor', 'pointer').click(function () { _buttonClick(0, configs); });
            }
        }
        else {
            $.blockUI(
                {
                    message: html,
                    fadeIn: configs.fadeMilliseconds,
                    fadeOut: configs.fadeMilliseconds,
                    showOverlay: configs.showOverlay,
                    css: _getCss(size),
                    overlayCSS: configs.overlayCSS
                }
            );
            _lastPriority = configs.priority;
            //            _detectOnLoad(configs);
            if (configs.clickOverlayToClose) {
                $('.blockOverlay').css('cursor', 'pointer').click(function () { _buttonClick(0, configs); });
            }
        }
    };
    //显示本地元素或者对象
    function _showNative(idOrDOM, configs, size) {
        if (_isBlocked() && !_judgePriority(configs))
            return;
        _detectAutoClose(configs);
        var _obj;
        if (typeof (idOrDOM) == 'string') {
            _obj = $("#" + idOrDOM);
        }
        else if (typeof (idOrDOM) == 'object') {
            _obj = $(idOrDOM);
        }
        //只有当本地对象存在
        if (_obj.length > 0) {
            if (_isBlocked()) {
                $.blockUI.MovePosition(size.top, size.left);
                $(".blockPage").fadeIn(200);
                $(".blockPage").html(_obj[0].outerHTML); //如果已存在遮罩，则无刷新的将html移入遮罩
                if (configs.clickOverlayToClose) {
                    $('.blockOverlay').css('cursor', 'pointer').click(function () { _buttonClick(0, configs); });
                }
            }
            else {
                $.blockUI({
                    message: _obj,
                    fadeIn: configs.fadeMilliseconds,
                    fadeOut: configs.fadeMilliseconds,
                    showOverlay: configs.showOverlay,
                    css: configs.defaultCss,
                    overlayCSS: configs.overlayCSS
                });
                _lastPriority = configs.priority;
                //                _detectOnLoad(configs);
                if (configs.clickOverlayToClose) {
                    $('.blockOverlay').css('cursor', 'pointer').click(function () { _buttonClick(0, configs); });
                }
            }
        }
    };

    //#endregion

    //#region 类定义



    //#endregion

    //输出API
    context.exports = {
        //配置弹出层配置项
        config: function (newConfigs) {
            _configManager.setConfigs(newConfigs);
        },
        //关闭弹出层{0:关闭    1:确认    2：取消} 该code可以由外部指定
        unBlock: function (mode) {
            _buttonClick(mode, _configManager.getConfigs());
        },
        //直接使用传入的 本地元素ID或者DOM对象 进行遮罩
        blockWith: function (idOrDOM, configs, isInnercall) {
        _configManager.setConfigs({ callback: undefined }); 
            //如果有回调函数，则直接更新配置项的回调函数
            if (configs && configs.callback)
                _configManager.setConfigs({ callback: configs.callback });
            //
            var _obj, _nowConfigs = _configManager.getMergedConfigs(configs);
            _getWrapMiddleSize(idOrDOM, function (item, positionCalculated) {
                _showNative(item, _nowConfigs, positionCalculated);
                if (!isInnercall)
                    _detectOnLoad(_nowConfigs);
            });
            return _nowConfigs;
        },
        //直接使用传入的html文本进行遮罩
        blockWithHtml: function (html, configs, isInnercall) {
        _configManager.setConfigs({ callback: undefined }); 
            //如果有回调函数，则直接更新配置项的回调函数
            if (configs && configs.callback)
                _configManager.setConfigs({ callback: configs.callback });
            var _obj, _nowConfigs = _configManager.getMergedConfigs(configs);
            _getWrapMiddleSize(html, function (item, positionCalculated) {
                _showContent(item, _nowConfigs, positionCalculated);
                if (!isInnercall)
                    _detectOnLoad(_nowConfigs);
            });
            return _nowConfigs;
        },
        //使用指定url返回的html进行遮罩
        blockWithUrl: function (url, configs) {
        _configManager.setConfigs({ callback: undefined }); 
            //如果有回调函数，则直接更新配置项的回调函数
            if (configs && configs.callback)
                _configManager.setConfigs({ callback: configs.callback });

            var _obj, _nowConfigs = _configManager.getMergedConfigs(configs);

            /*            
            waiterID: undefined, //作为等待图标的元素,优先级高
            waiterHtml: undefined, //作为等待图标的Html，优先级低
            */
            //先加载等待界面
            if (_nowConfigs.waiterID)
                self.blockWith(_nowConfigs.waiterID, _nowConfigs, true);
            else if (_nowConfigs.waiterHtml)
                self.blockWithHtml(_nowConfigs.waiterHtml, _nowConfigs, true);

            $.ajax({
                url: url,
                cache: _nowConfigs.isCache,
                success: function (data) {
                    _getWrapMiddleSize(data, function (item, positionCalculated) {
                        _showContent(item, _nowConfigs, positionCalculated);
                        _detectOnLoad(_nowConfigs);
                    });
                }
            });
            return _nowConfigs;
        }
    };


}, { tag: '【遮罩基础组件】by kaicui 2012年7月5日 19:54:02' });



/*
作者： kaicui
依赖： MyCore.BlockUIBase.js,MyCore.Config.js,MyOOP
使用说明：
提供对页面进行局部遮罩的功能
1、支持对局部元素进行遮罩
2、支持同时遮罩几块区域，并分别倒计时、关闭

--------------------------------------
版本历史：

2012年10月19日15:15:38      版本创建

//////////////////////////////////////////////////////////////////*/

define('MyUI.BlockRegion', ['MyUI.BlockUIBase', 'MyCore.Config'], function (context) {
    var self = context.self;
    var configModule = context.imports['MyCore.Config'];

    //#region 内部变量、函数
    var _regionBlockers = {}; //blocker字典，containerID:obj

    var _afterUnBlock = function (containerID) {
        if (containerID && _regionBlockers.hasOwnProperty(containerID)) {
            delete _regionBlockers[containerID];
        }
    };
    //#endregion

    //#region 类定义

    function RegionBlockTask(containerID, configs) {
        var my = this;

        my.containerID = containerID; //遮罩的元素ID

        var _configManager = configModule.newConfigManager({

            onClose: undefined, //遮罩层关闭后的回调函数
            html: '<h1>waiting...</h1>', //作为遮罩部分的文本

            showOverlay: true, //是否显示遮罩背景（模态弹出框）
            overlayCSS: {
                backgroundColor: '#000',
                cursor: 'normal',
                opacity: 0.3
            },

            //默认样式
            css: {
                border: 'none'
            },
            //自动关闭相关配置
            autoClose: {
                enable: false, //是否开启自动关闭功能
                autoCloseSeconds: 3, //自动关闭的时间
                onTick: undefined//自动关闭每次倒计时的回调函数(会给出当前剩余秒数)
            }
        });


        //更新配置
        if (configs)
            _configManager.setConfigs(configs);

        var _nowCallBack = undefined; //遮罩关闭后的回调函数
        var _autoCloseSecondsLeft; //还有多少秒自动关闭
        var _autoCloseController; //控制自动关闭的计时器


        //callBack to the caller
        function _processCallback() {
            var _nowCallBack = _configManager.getConfigs().onClose;
            if (_nowCallBack && typeof _nowCallBack === 'function') {
                _nowCallBack();
            }
        };


        //根据传入的配置信息，决定是否启用自动关闭功能
        function _detectAutoClose() {
            //如果启用自动关闭功能
            if (_configManager.getConfigs().autoClose.enable) {
                _autoCloseSecondsLeft = _configManager.getConfigs().autoClose.autoCloseSeconds;
                //重置当前计时器
                if (_autoCloseController)
                    clearInterval(_autoCloseController);
                _autoCloseController = setInterval(function () { _updateAutoClose(); }, 1000);
            }
        };

        //自动更新剩余关闭时间并处理关闭
        function _updateAutoClose() {
            var _autoCloseCounterCallback = _configManager.getConfigs().autoClose.onTick;
            if (_autoCloseSecondsLeft > 0) {
                if (_autoCloseCounterCallback && typeof _autoCloseCounterCallback === 'function')
                    _autoCloseCounterCallback(_autoCloseSecondsLeft);
                _autoCloseSecondsLeft--;
            }
            else
                _regionUnblock();
        };

        //取消局部遮罩
        function _regionUnblock() {
            //add by kaicui 2012年3月22日 21:15:30【关闭窗口之前，取消计时器】
            if (_autoCloseController)
                clearInterval(_autoCloseController);
            $("#" + my.containerID).unblock();
            _processCallback();
            _afterUnBlock(my.containerID);
        };


        //区域遮罩
        my.block = function () {
            $("#" + my.containerID).block({
                message: _configManager.getConfigs().html,
                css: _configManager.getConfigs().css,
                overlayCSS: _configManager.getConfigs().overlayCSS,
                showOverlay: _configManager.getConfigs().showOverlay
            });
            _detectAutoClose();
        };
        //解除遮罩
        my.unBlock = function () {
            _regionUnblock();
        };
    }



    //#endregion

    //输出API
    context.exports = {
        //关闭    某个元素的局部遮罩
        unBlock: function (containerID) {
            if (containerID && _regionBlockers.hasOwnProperty(containerID)) {
                _regionBlockers[containerID].unBlock();
                delete _regionBlockers[containerID];
            }
        },
        //关闭    某个元素的局部遮罩,返回遮罩是否成功
        block: function (containerID, configs) {
            if (containerID) {
                if (_regionBlockers.hasOwnProperty(containerID)) {
                    return false;
                }
                else {
                    _regionBlockers[containerID] = new RegionBlockTask(containerID, configs);
                    _regionBlockers[containerID].block();
                }
            }
            else
                return false;
        }
    };


}, { tag: '【局部遮罩  基础组件】by kaicui 2012-10-19 15:32:30 ' });