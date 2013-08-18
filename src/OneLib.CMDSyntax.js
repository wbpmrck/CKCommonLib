/*
 作者： kaicui

 依赖： OneLib.Log,OneLib.ScriptLoader
 使用说明：
 1、与seajs的CMD规范完全兼容
 2、其他所有的模块依赖本模块，使用CMD的格式来书写
 -----------
 版本历史：

by kaicui 2013-8-17 13:48:31       版本创建
 //////////////////////////////////////////////////////////////////*/
var OneLib = (function (my) {return my;} (OneLib || {}));

OneLib.CMDSyntax = (function (my,global) {
    if(!OneLib.hasOwnProperty('Log')){
        throw new Error('need OneLib.Log Module!');
    }
    if(!OneLib.hasOwnProperty('ScriptLoader')){
        throw new Error('need OneLib.ScriptLoader Module!');
    }
    var _copy=function(obj){
        var _dump ={};
        for(var i in obj){
            _dump[i] = obj[i];
        }
        return _dump;
    };
    var _queryString = function(item){
        var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
        return svalue ? svalue[1] : svalue;
    };

    function _Module(name,dependency,factory,/*optional*/exports){
        var self = this;//save the this ref

        self.id=self.name = name;
        self.dependencies =_transAlias(dependency);
        self.dependenciesDic = {};
        for(var i=0,j=self.dependencies.length;i<j;i++){
            self.dependenciesDic[self.dependencies[i]]=undefined;
        }

        self.factory = factory;

        self.exports =exports||{};

        self.init();
    }

    /**
     * 返回exports的一个副本
     * @param name
     */
    _Module.prototype.getExportsCopy = function(){
       return _copy(this.exports);
    };
    _Module.prototype.init = function(){
        var self = this;//save the this ref
        //给factory准备模块
        var _innerModule =  {
            id:self.id,
            name:self.name,
            dependencies:self.dependencies.slice(),
            exports:{}
        };


        //如果factory使用return返回了对象，则使用该返回值作为模块的返回
        var _ret = self.factory.call(_innerModule,function _require(dependentName){
            dependentName = _transAlias(dependentName);
            //如果在自己声明的依赖项中，则去获取
            if(self.dependenciesDic.hasOwnProperty(dependentName)){
                var _getted = self.dependenciesDic[dependentName];
                if(!_getted){
                    var m = _getRealModule(dependentName);
                    if(m){
                        _getted = self.dependenciesDic[dependentName] = m.getExportsCopy();
                        _log('>>require:: [' + dependentName + '] required by ['+self.name+']...');
                    }
                    else{
                        _log('>>require:: [' + dependentName + '] required by ['+self.name+'](failed,not exist)...');
                    }
                }
                else{
                    _log('>>require:: [' + dependentName + '] required by ['+self.name+'](from cache)...');
                }
                return _getted;
            }
            else{
                throw new Error('Required Module:['+dependentName+'] must be declared in dependencies array!');
            }
        },_innerModule.exports,_innerModule);
        if(_ret!==undefined){
            self.exports = _ret;
        }
        else{
            self.exports =_innerModule.exports;
        }
    };

    var _logger = new OneLib.Log.Logger(false),
        _scriptLoader = OneLib.ScriptLoader,
        _log=function(msg){
            _logger.writeLine(msg);
        },
        //保留名字
        _reserved={'global':1,'window':1},
        //已经加载的模块
        _modules={
          'global':global//模块载入的时候，把window缓存起来备用
        },
        //配置项
        _configs={
            //配置:别名
            alias:{
                '_Log':'OneLib.Log',//OneLib 日志模块
                '_log':'OneLib.Log',//OneLib 日志模块
                '_scriptLoader':'OneLib.ScriptLoader',//脚本异步加载模块
                '_loader':'OneLib.ScriptLoader',//脚本异步加载模块
                'window':'global'//全局变量
            }
        },
        _transAlias = function(moduleNameOrArray){
            if(moduleNameOrArray.constructor===Array){
                for(var m=0,j=moduleNameOrArray.length;m<j;m++){
                    var _item = moduleNameOrArray[m];
                    if(_configs.alias[_item]){
                        moduleNameOrArray[m]=_configs.alias[_item];
                    }
                }
                return moduleNameOrArray;
            }
            else{
                return _configs.alias[moduleNameOrArray]||moduleNameOrArray;
            }
        },
    //检查模块名，可以使用则返回true,否则抛出异常
        _checkNameAndThrow = function(name){
          if(_reserved[name]||_modules.hasOwnProperty(name)){
              throw new Error('ModuleName:['+name+'] has been used!');
          }
          else if(name===null||name==undefined||name===''){
              throw new Error('ModuleName cannot be empty!');
          }
            return true;
        },

        _getRealModule = function(moduleName){
            moduleName = _transAlias(moduleName);
            return _modules[moduleName];
        };

    /**
     * 添加/重写别名，系统保护的别名不允许重写。
     * @param alias
     */
    my.addAlias = function (alias) {
        for (var i in alias){
            if(_checkNameAndThrow(i)){
                _configs.alias[i] = alias[i];
            }
        }
    };
    global['define']=my.define = function(moduleName,dependency,factory){
        _log('>>define:: [' + moduleName + '] begin...');
        if(_checkNameAndThrow(moduleName)){
            _modules[moduleName] =  new _Module(moduleName,dependency,factory);
        }
        _log('>>define:: [' + moduleName + '] end(success)...');
    };
    /**
     * 通过此API可以直接从外部获取任意一个Module(通常是调试错误的时候使用)
     * @param moduleName
     * @return {*}
     */
    my.require = function (moduleName) {
        _log('>>!!>>require(global):: [' + moduleName + '] has been called!');
        return _getRealModule(moduleName);
    };

    /**
     * 可以把一个已经存在的对象封装成一个模块，该对象自身作为模块的exports
     * @param moduleName
     * @param exports
     */
    my.wrapToModule = function(moduleName,exports){
        _log('>>wrapToModule:: [' + moduleName + '] begin...');
        if(_checkNameAndThrow(moduleName)){
            _modules[moduleName] =  new _Module(moduleName,[],function(){
                return exports;
            },exports);
        }
        _log('>>wrapToModule:: [' + moduleName + '] end(success)...');
    };

    /**
     * 从内部移出一个模块(可以使用别名)
     * @param moduleName
     * @return {Boolean}
     */
    my.removeModule = function(moduleName){
        _log('>>!!>>removeModule:: [' + moduleName + '] begin...');

        moduleName = _transAlias(moduleName);
        if(_modules.hasOwnProperty(moduleName)){
            delete _modules[moduleName];
            _log('>>!!>>removeModule:: [' + moduleName + '] end(success)...');
            return true;
        }
        else{
            _log('>>!!>>removeModule:: [' + moduleName + '] end(no such module)...');
            return false;
        }
    };
    my.logOn = function(){
        _logger.enable = true;
    };
    my.logOff = function(){
        _logger.enable = false;
    };
    /**
     * 移除所有的Module(慎用，多用于测试时)
     */
    my.removeAllModulesExcept = function(except){
        except = _transAlias(except);
        var  _exceptDic= {};
        if(except.constructor === Array){
            for(var i=0,j=except.length;i<j;i++){
                _exceptDic[except[i]]=1;
            }
        }
        else{
            _exceptDic[except]=1;
        }

        _log('>>!!>>removeAllModules except:: [' + except + '] begin...');
        for(i in _modules){
            if(!_exceptDic[i]){
                my.removeModule(i);
            }
        }
        _log('>>!!>>removeAllModules except:: [' + except + '] end(success)...');
    };

    //使用console输出信息
    _logger.setMode(0);
    my.wrapToModule('OneLib.Log',OneLib.Log);
    my.wrapToModule('OneLib.ScriptLoader',OneLib.ScriptLoader);
    //根据浏览器queryString是否含有 CMDSyntaxDebug 选项，来决定是否开启日志
    if(_queryString('CMDSyntaxDebug')){
        _logger.logOn();
    }

    return my;
} (OneLib.CMDSyntax || {},window));
