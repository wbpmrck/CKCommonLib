创建时间：2012年3月13日14:38:00
创建人：	崔凯
功能：	常用的一些功能库

PS:有一些库未完成，待补充完整。
-----------------------------------------------
代码说明：

1	MyUI.js

包含UI相关的所有类库
------1.1	MyUI.Drag.js
			实现元素拖动功能
------1.2	MyUI.Slider.js
			实现元素滑动效果功能，支持循环滑动
------1.3	MyUI.WaterMark.js
			实现文本框水印效果
------1.4	MyUI.Block.js
			实现遮罩相关效果
------1.5	MyUI.Effect.js
			UI相关的特殊效果
------1.6	MyUI.AnimateBase.js
			UI所使用的动画特效基础类
------1.7	MyUI.TabControl.js
			标签页操作类，可以自定义标签组和标签，控制他们的行为
------1.8	MyUI.DockPanel.js
			停靠面板，可以浮动定位，打开和折叠。可以用来做控制面板， 或者提示信息。
------1.9	MyUI.BlockUIBase.js
			弹出层和遮罩层基本组件。
------1.10	MyUI.Util.js
			UI需要用到的基础功能。
------1.11	MyUI.ImageMessage.js
			UI插件，用于实现图片消息类功能，比如类似qq表情。
------1.12	MyUI.ValidateHelper.js
			用于方便的控制UI元素结合验证逻辑进行页面的验证工作。
			

2	MySecure.js  包含安全性相关的类库
------2.1	MySecure.MD5.js
			关于MD5加密相关的功能。
------2.2	MySecure.DES.js
			关于DES加密相关的功能。
------2.3	MySecure.Encoding.js
			关于各种其他编码加密相关的功能。

3	MyCore.js
包含所有核心功能类库。
------3.1	MyCore.Event.js
			自定义的对事件处理进行扩展的核心类，包括对手机浏览器的触屏事件扩展
------3.2	MyCore.WindowSize.js
			自定义的对窗口和文档大小进行获取的类库。
------3.3	MyCore.Log.js
			开发测试时候进行日志输出的类库。
------3.4	MyCore.Validate.js
			用于验证控制核心逻辑的类库。
------3.4.2	MyCore.FluentValidation.js
			用于实现链式调用进行参数验证的类库。

=====================================已经删除，转移到MyUI.DOM
------3.5	MyCore.DOM.js			=
			用于DOM操作的扩展。		=
=====================================


------3.6	MyCore.Url.js
			用于Url地址的扩展，方便指定各种Url如MVC的Url格式。
------3.7	MyCore.Page.js
			用于页面的加载和阻塞等效果。
------3.8	MyCore.Navigation.js
			关于浏览器导航相关的功能类库。
------3.9	MyCore.Ext.String.js
			对js内置对象String的prototype进行扩展。
------3.10	MyCore.Char.js
			字符串相关的操作类，比如简繁体转换等。
------3.11	MyCore.TagBuilder.js
			用于组建Html标签元素的类，比如style对象，Div等。
------3.12	MyCore.Config.js
			用于提供最基础的配置项功能，可以使用在其他类库中，提供配置项帮助。
------3.13	MyCore.BrowserDetect.js
			用于提供浏览器版本检测功能。
------3.14	MyCore.IframeMessage.js
			用于提供跨iframe进行消息通信的功能，在ie6的某些版本上有兼容性问题，其他OK。
------3.15	MyCore.Observer.js
			用于在对象上实现观察者模式，通过on和emit订阅和发布消息。
------3.16	MyCore.ScriptLoader.js
			用于动态加载js。
------3.17	MyCore.ObjectUtil.js
			用于在对象上进行一些通用的操作，如扁平化、属性合并等。
------3.18	MyCore.ImageLoader.js
			用于处理图片的加载、预加载功能。
			
			

			

			
4	MyBiz.js
包含所有业务相关的功能类库。
------4.1	MyBiz.Mobile.js
			中国移动相关业务处理
------4.2	MyBiz.Unicom.js
			中国联通相关业务处理
------4.3	MyBiz.TeleCom.js
			中国电信相关业务处理
			
5	MyOOP.js
包含所有支持js面向对象编程扩展功能的类库。
------5.1	MyOOP.Utils.js
			通用组件，用于辅助OOP编程。
------5.2	MyOOP.Syntax.Module.js
			实现OO编程的语法扩展，提供js语法糖，编写Module模式更加方便。
