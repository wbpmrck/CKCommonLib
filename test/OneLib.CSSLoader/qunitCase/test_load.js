define('test_cssload', ['OneLib.CSSLoader', '_log'], function (require, exports, _module) {

    var loader = require('OneLib.CSSLoader'),logger = require('_log');

    module( "group 1:加载外部css,并且有回调", {
        setup: function() {
            // prepare something for all following tests
        },
        teardown: function() {
            // clean up after each test
        }
    });

    asyncTest( "loader.loadCSS", function() {
        expect(3);
        var _logger = new OneLib.Log.Logger(true);
        _logger.writeLine('begin load');
        //从博客园下载几个css
        var _cssLoaded=[],
            _cssToLoad = [
            'http://common.cnblogs.com/css/reset.css',
            'http://www.cnblogs.com/css/aggsite.css?id=20130817',
            'http://common.cnblogs.com/blog/css/common2.css'
        ];
        var cssOK = function(url){
            for(var i=0,j=_cssToLoad.length;i<j;i++){
                var _item = _cssToLoad[i];
                if(url === _item){
                    return true;
                }
            }
            return false;
        }

        for(var i=0,j=_cssToLoad.length;i<j;i++){
            var _item = _cssToLoad[i];
            loader.loadCSS(_item,function(loadedUrl){
                _cssLoaded.push(loadedUrl);

                if(_cssLoaded.length === _cssToLoad.length){

                    //由于css加载顺序不一定严格，所以要查找在不在
                    for(var m=0,n=_cssLoaded.length;m<n;m++){
                        var _loadedCSS = _cssLoaded[m];
                        equal(cssOK(_loadedCSS),true,'must equal!');
                    }
                    start();
                }
            });
        }
    });

});
