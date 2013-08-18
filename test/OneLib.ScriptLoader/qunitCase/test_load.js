define('test_jsLoad', ['OneLib.ScriptLoader', '_log'], function (require, exports, _module) {

    var loader = require('OneLib.ScriptLoader'),logger = require('_log');



    module( "group 1:加载外部js,并且有回调", {
        setup: function() {
            // prepare something for all following tests
            $(".__log__").remove();
        },
        teardown: function() {
            // clean up after each test
        }
    });

    asyncTest( "loader.loadScript", function() {
        expect(3);
        var _logger = new OneLib.Log.Logger(true);
        _logger.writeLine('begin load');

        //从博客园下载几个js
        var _loaded=[],
            _toLoad = [
            'http://localhost:9527/src/old/MyCore.ImageLoader.js',
            'http://localhost:9527/src/old/MyCore.Navigation.js',
            'http://localhost:9527/src/old/MyCore.Url.js'
        ];
        var loadOK = function(url){
            for(var i=0,j=_toLoad.length;i<j;i++){
                var _item = _toLoad[i];
                if(url === _item){
                    return true;
                }
            }
            return false;
        }

        for(var i=0,j=_toLoad.length;i<j;i++){
            var _item = _toLoad[i];
            loader.loadScript(_item,function(loadedUrl,beginAt,endAt){
                _loaded.push(loadedUrl);
                _logger.writeLine('file:'+loadedUrl+'begin load at:'+beginAt+' end at:'+endAt);

                if(_loaded.length === _toLoad.length){

                    //由于css加载顺序不一定严格，所以要查找在不在
                    for(var m=0,n=_loaded.length;m<n;m++){
                        var _loadedJs = _loaded[m];
                        equal(loadOK(_loadedJs),true,_loadedJs+' must right!');
                    }
                    start();
                }
            });
        }
    });


    module( "group 2:使用Queue来并行加载多个文件，同时每个队列内部保持顺序加载(通过console查看文件并行下载timeline)", {
        setup: function() {
            // prepare something for all following tests
            $(".__log__").remove();
        },
        teardown: function() {
            // clean up after each test
        }
    });

    asyncTest( "loader.beginQueue", function() {
        expect(12);
        var _logger = new OneLib.Log.Logger(true);
        _logger.writeLine('begin load');

        var oneFinish =false,twoFinish =false;

        //从博客园下载几个js
        var _loaded=[],
            _toLoad = [
            'http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_a.js',
            'http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_b.js',
            'http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_c.js'
        ];
        var loadOK = function(url){
            for(var i=0,j=_toLoad.length;i<j;i++){
                var _item = _toLoad[i];
                if(url === _item){
                    return true;
                }
            }
            return false;
        };
        var _loaded2=[],
            _toLoad2 = [
            'http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_a2.js',
            'http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_b2.js',
            'http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_c2.js'
        ];
        var loadOK2 = function(url){
            for(var i=0,j=_toLoad2.length;i<j;i++){
                var _item = _toLoad2[i];
                if(url === _item){
                    return true;
                }
            }
            return false;
        };

        var _loaded3=[],
            _toLoad3 = [
            'http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_a3.js',
            'http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_b3.js',
            'http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_c3.js'
        ];
        var loadOK3 = function(url){
            for(var i=0,j=_toLoad3.length;i<j;i++){
                var _item = _toLoad3[i];
                if(url === _item){
                    return true;
                }
            }
            return false;
        };

        //这个队列先完成一批下载，然后再添加3个任务下载
        loader.beginQueue('queueOne').
            load('http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_a.js').
            load('http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_b.js').
            load('http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_c.js').
            onLoadedOne(function(url,beginAt,endAt){
                _loaded.push(url);
                _logger.writeLine('queue1:file:'+url+' begin load at:'+beginAt+' end at:'+endAt);
            }).onFinish(function(beginAt,endAt){
                _logger.writeLine('queue1:all file begin load at:'+beginAt+' end at:'+endAt);
                equal(beginAt!=endAt,true,'beginAt must diff with endAt!');
                //由于css加载顺序不一定严格，所以要查找在不在
                for(var m=0,n=_loaded.length;m<n;m++){
                    var _loadedJs = _loaded[m];
                    equal(loadOK(_loadedJs),true,_loadedJs+' must right!');
                }
                //继续补充几个任务再启动该队列
                loader.theQueue('queueOne').
                    clearCallbacks().
                    load('http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_a3.js').
                    load('http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_b3.js').
                    load('http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_c3.js').
                    onLoadedOne(function(url,beginAt,endAt){
                        _loaded3.push(url);
                        _logger.writeLine('queue1:file:'+url+' begin load at:'+beginAt+' end at:'+endAt);
                    }).onFinish(function(beginAt,endAt){
                        _logger.writeLine('queue1:all file begin load at:'+beginAt+' end at:'+endAt);
                        equal(beginAt!=endAt,true,'beginAt must diff with endAt!');
                        //由于css加载顺序不一定严格，所以要查找在不在
                        for(var m=0,n=_loaded3.length;m<n;m++){
                            var _loadedJs = _loaded3[m];
                            equal(loadOK3(_loadedJs),true,_loadedJs+' must right!');
                        }
                        oneFinish=true;
                        oneFinish&&twoFinish&&start();
                    }).
                    start();
            }).
            start();
        loader.beginQueue('queueTwo').
            load('http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_a2.js').
            load('http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_b2.js').
            load('http://localhost:9527/test/OneLib.ScriptLoader/qunitCase/module_c2.js').
            onLoadedOne(function(url,beginAt,endAt){
                _loaded2.push(url);
                _logger.writeLine('queue2:file:'+url+' begin load at:'+beginAt+' end at:'+endAt);
            }).onFinish(function(beginAt,endAt){
                _logger.writeLine('queue2:all file begin load at:'+beginAt+' end at:'+endAt);
                equal(beginAt!=endAt,true,'beginAt must diff with endAt!');
                //由于css加载顺序不一定严格，所以要查找在不在
                for(var m=0,n=_loaded2.length;m<n;m++){
                    var _loadedJs = _loaded2[m];
                    equal(loadOK2(_loadedJs),true,_loadedJs+' must right!');
                }
                twoFinish = true;
                oneFinish&&twoFinish&&start();
            }).
            start();
    });

});
