/*
作者： kaicui

依赖： 无
使用说明：用于提供最基础的配置项功能，可以使用在其他类库中，提供配置项帮助。

1、提供配置项恢复默认的功能。
2、提供针对给定的定制项，返回一个临时的合并后配置项功能。（不实际修改配置项）
3、提供针对给定的定制项，修改内部当前配置信息，并且返回修改后的配置项功能。
-----------
版本历史：
by kaicui 2012年7月5日 21:12:49      版本创建
//////////////////////////////////////////////////////////////////*/

var MyCore = (function (my) {
    return my;
} (MyCore || {}))

MyCore.Config = (function (my) {

    //类定义
    function _ConfigClass(defaultConfigs) {
        var _defaultConfigs, _nowConfigs; //保存默认配置和当前配置
        var _self = this;
        _defaultConfigs = _nowConfigs = defaultConfigs; //初始化

        //API:恢复配置项为默认值
        _self.resetToDefault = function () {
            _nowConfigs = _defaultConfigs;
        };
        //API:返回当前配置项
        _self.getConfigs = function () {
            var returned = {};
            for (var i in _nowConfigs) {
                returned[i] = _nowConfigs[i];
            }
            return returned;
        };
        //API:修改当前配置项，并返回
        _self.setConfigs = function (configs) {
            if (configs) {
                for (var i in _nowConfigs) {
                    if (configs.hasOwnProperty(i))
                        _nowConfigs[i] = configs[i];
                }
            }
            return _self.getConfigs();
        };
        //API:获取当前配置项被传入定制项覆盖后的对象，并不修改自身配置项，并返回
        _self.getMergedConfigs = function (configs) {
            var tmp = _self.getConfigs();
            if (configs) {
                for (var i in _nowConfigs) {
                    // if (configs[i]!=undefined) 
                    if (configs.hasOwnProperty(i))
                        tmp[i] = configs[i];                    
                }
            }
            return tmp;
        };
    };

    //API:构建一个新的配置管理器
    my.newConfigManager = function (defaultConfigs) {
        return new _ConfigClass(defaultConfigs);
    };
    return my;
} (MyCore.Config || {}));