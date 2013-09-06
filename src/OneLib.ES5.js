/**
 * @Created by kaicui(https://github.com/wbpmrck).
 * @Date:2013-08-27 19:56
 * @Desc: 实现部分ECMAScript 5里新增的实用功能
 * 1、部分功能可能会对已有的Built-in对象进行侵入
 * 2、检测到浏览器已经支持的话，会什么都不做
 * @Change History:
 --------------------------------------------
 @created：|kaicui| 2013-08-27 19:56.
 --------------------------------------------
 */
;
//Array
if(!Array.prototype.forEach){
    /**
     @param {Function} iterator
     @param {Object} [thisObject]
     @return void
     */
    Array.prototype.forEach = function(iterator,thisObject){
        for(var i=0,j=this.length;i<j;i++){
            var _item = this[i];
            iterator&&iterator.call(thisObject||this,_item,i,this)
        }
    }
}
if(!Array.prototype.filter){
    /**
     *
     * @param filter
     * @param thisObject
     * @return {Array}
     */
    Array.prototype.filter = function(filter,thisObject){
        var _result =[];
        for(var i=0,j=this.length;i<j;i++){
            var _item = this[i];
            if(filter&&filter.call(thisObject||this,_item,i,this)){
                _result.push(_item);
            }
        }
        return _result;
    }
}
if(!Array.prototype.isArray){
    Array.prototype.isArray = function(obj){
       return Object.prototype.toString.apply(obj) === '[object Array]';
    }
}

//Function(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FFunction%2Fbind)
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                    ? this
                    : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}