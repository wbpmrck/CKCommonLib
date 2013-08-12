var MyBiz = (function (my) {
    return my;
} (MyBiz || {}));
//电信相关业务通用代码
//电信相关业务通用代码
MyBiz.TeleCom = (function (my) {
    //验证号码是否符合天翼用户号码特点
    my.isPhoneValidTianYi = function (phone) {
        var reg = /^1((33)|(53)|(80)|(89))[0-9]{8}$/;
        return reg.test(phone);
    };
    //验证号码是否符合小灵通用户号码特点
    //参数：mode:{1:直接区号+号码   2：只判断区号  3：只判断号码     4：区号-号码格式}
    my.isPhoneValidXLT = function (phone, mode) {
        var reg;
        mode = mode || '1'; //没传的话默认第一种
        if (mode === '1') {
            reg = /^0[0-9]{10,11}$/; //验证直接区号+号码
        }
        else if (mode === '2') {
            reg = /^0[0-9]{2,3}$/; //验证区号
        }
        else if (mode === '3') {
            reg = /^[1-9]{1}[0-9]{6,7}$/; //验证固话
        }
        else if (mode === '4') {
            reg = /^0[0-9]{2,3}-[1-9]{1}[0-9]{6,7}$/; //验证 区号-号码
        }
        return reg.test(phone);
    };

    //验证号码是否符合固话用户号码特点
    //参数：mode:{1:直接区号+号码   2：只判断区号  3：只判断号码     4：区号-号码格式}
    my.isPhoneValidGH = function (phone, mode) {
        var reg;
        mode = mode || '1'; //没传的话默认第一种
        if (mode === '1') {
            reg = /^0[0-9]{10,11}$/; //验证直接区号+号码
        }
        else if (mode === '2') {
            reg = /^0[0-9]{2,3}$/; //验证区号
        }
        else if (mode === '3') {
            reg = /^[1-9]{1}[0-9]{6,7}$/; //验证固话
        }
        else if (mode === '4') {
            reg = /^0[0-9]{2,3}-[1-9]{1}[0-9]{6,7}$/; //验证 区号-号码
        }
        return reg.test(phone);
    };
    //验证密码是否符彩铃密码特点
    my.isColorRingPswdValid = function (pswd) {
        var reg = /^[0-9]{6}$/;
        return reg.test(pswd);
    };
    return my;
} (MyBiz.TeleCom || {}));

//移动相关业务通用代码
MyBiz.Mobile = (function (my) {
    //验证号码是否符合移动用户号码特点
    my.isPhoneValid = function (phone) {
        var reg = /^1((34)|(35)|(36)|(37)|(38)|(39)|(50)|(51)|(52)|(54)|(57)|(58)|(59)|(87)|(88))[0-9]{8}$/;
        return reg.test(phone);
    };
    return my;
} (MyBiz.Mobile || {}));
//联通相关业务通用代码
MyBiz.Unicom = (function (my) {
    //验证号码是否符合联通用户号码特点
    my.isPhoneValid = function (phone) {
        var reg = /^1((30)|(31)|(32)|(55)|(56)|(85)|(86)|(45))[0-9]{8}$/;
        return reg.test(phone);
    };
    return my;
} (MyBiz.Unicom || {}));
//不区分具体运营商的业务通用代码
MyBiz.Standard = (function (my) {
    //验证号码是否符合手机号码特点
    my.isPhoneValid = function (phone) {
        return MyBiz.Mobile.isPhoneValid(phone) || MyBiz.TeleCom.IsPhoneValidTianYi(phone) || MyBiz.Unicom.isPhoneValid(phone);
    };
    //验证号码是否符合固话用户号码特点
    //参数：mode:{1:直接区号+号码   2：只判断区号  3：只判断号码     4：区号-号码格式}
    my.isGHValid = function (phone, mode) {

        return MyBiz.TeleCom.IsPhoneValidGH(phone, mode);
    };
    //验证密码是否符彩铃密码特点
    my.isColorRingPswdValid = function (pswd) {
        return MyBiz.TeleCom.isColorRingPswdValid(pswd);
    };
    return my;
} (MyBiz.Standard || {}));