var MyBiz = (function (my) {
    return my;
} (MyBiz || {}));

//移动相关业务通用代码
MyBiz.Mobile = (function (my) {
    //验证号码是否符合移动用户号码特点
    my.isPhoneValid = function (phone) {
        var reg = /^1((34)|(35)|(36)|(37)|(38)|(39)|(50)|(51)|(52)|(54)|(57)|(58)|(59)|(87)|(88))[0-9]{8}$/;
        return reg.test(phone);
    };
    return my;
} (MyBiz.Mobile || {}));