/**
 * @Created by kaicui(https://github.com/wbpmrck).
 * @Date:2013-08-16 16:10
 * @Desc: descriptions
 * 1、
 * 2、
 * @Change History:
 --------------------------------------------
 @created：|kaicui| 2013-08-16 16:10.
 --------------------------------------------
 */

define('Demo.Index', ['jQuery','ko'], function (require, exports, module) {

    var $ = require('jQuery'),ko = require('ko'),_viewModel;

    function Module(moduleName,desc,linkEnable,isCur){
        var self = this;//save the this ref

        self.moduleName=moduleName;
        self.desc=desc;
        self.linkEnable=linkEnable;
        self.isCur=ko.observable(isCur);
    }
    function ViewModel(){
        var self = this;//save the this ref

        self.projectName='OneLib 演示站点';

        self.firstVisibleIndex=ko.observable(-1);

        self.demos=[];

        self.showCount=5;

        self.demosVisible = ko.computed(function(){
            var idx = this.firstVisibleIndex();
            var r =[],s=self.showCount;
            while(s--){
                r.push(this.demos[idx+ r.length]);
            }
            return r;
        },self);

        self.curDemo=ko.observable(self.demos[0]);

        self.demoClick = function(demo){
            self.curDemo().isCur(false);
            demo.isCur(true);
            self.curDemo(demo);
        };

        self.canRollLeft = ko.computed(function(){
            return self.firstVisibleIndex()>0;
        },self);

        self.canRollRight = ko.computed(function(){
            return self.demos.length-self.firstVisibleIndex()-self.showCount>0;
        },self);

        self.rollLeft = function(){
            self.canRollLeft()&& self.firstVisibleIndex(self.firstVisibleIndex()-1);
        };
        self.rollRight = function(){
            self.canRollRight()&& self.firstVisibleIndex(self.firstVisibleIndex()+1);
        };
    }

    exports.vm = _viewModel=new ViewModel();

    //获取模块列表数据，并开始页面绑定
    $.ajax({
        url: "/demo/demoData/modules.js",
        cache: false,
        dataType:'json',
        success: function(data){
            for(var i=0,j=data.length;i<j;i++){
                var _item = data[i];
                //设置viewModel
                _viewModel.demos.push(new Module(_item.moduleName,_item.desc,_item.linkEnable,i===0));
            }

            _viewModel.curDemo(_viewModel.demos[0]);
            _viewModel.firstVisibleIndex(0);
            //页面绑定
            ko.applyBindings(exports.vm,document.getElementById("root"));
        }
    });

});