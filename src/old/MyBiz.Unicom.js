var MyBiz = (function (my) {
    return my;
} (MyBiz || {}));
//联通相关业务通用代码
MyBiz.Unicom = (function (my) {
    //验证号码是否符合联通用户号码特点
    my.isPhoneValid = function (phone) {
        var reg = /^1((30)|(31)|(32)|(55)|(56)|(85)|(86)|(45))[0-9]{8}$/;
        return reg.test(phone);
    };
    return my;
} (MyBiz.Unicom || {}));