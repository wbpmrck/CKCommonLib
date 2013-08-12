/*
作者： kaicui
依赖： 无
使用说明：提供一些通用的操作函数

版本历史：
2013年2月27日11:50:16       功能添加
1、添加方法：
    mix:合并对象属性
    flat:扁平化

2013年2月27日9:50:42      版本创建
//////////////////////////////////////////////////////////////////*/

var MyCore = (function (my) {
    return my;
} (MyCore || {}));

MyCore.ObjectUtil = (function (my) {
   
    var has = Object.prototype.hasOwnProperty;

    //将多个对象合并到第一个对象参数中，并返回。
    my.mix = function(receiver, supplier) {
        var args = Array.apply([], arguments),
            i = 1,
            key, //如果最后参数是布尔，判定是否覆写同名属性
            ride = typeof args[args.length - 1] == "boolean" ? args.pop() : true;
        if(args.length === 1) { //处理$.mix(hash)的情形
            receiver = !this.window ? this : {};
            i = 0;
        }
        while((supplier = args[i++])) {
            for(key in supplier) { //允许对象糅杂，用户保证都是对象
                if(has.call(supplier, key) && (ride || !(key in receiver))) {
                    receiver[key] = supplier[key];
                }
            }
        }
        return receiver;
    };
    my.flat =function(obj,spliter){
        /**
         *处理一个对象的扁平化，返回扁平化后的属性数组
         * @param parentScope
         * @param obj
         * @private
         * @return {Dic}
         */
        function _innerFlatter(parentScope,obj,_spliter){
            var _innerFlatted={};
            for(var i in obj){
                var _val = obj[i],_curScope=parentScope?parentScope+_spliter:'';
                //如果属性又是对象，则返回该对象的扁平化数据
                if(typeof(_val)==='object' && _val.constructor === Object){
                    var _result=_innerFlatter(_curScope+i,_val,_spliter);
                    for(var j in _result){
                        _innerFlatted[j] = _result[j];
                    }
                }
                //否则加入到当前扁平化成果中
                else{
                    _innerFlatted[_curScope+i] = _val;
                }
            }
            return _innerFlatted;
        }
        return _innerFlatter('',obj,spliter===undefined?'.':spliter.toString());
    };
    return my;
} (MyCore.ObjectUtil || {}));

