var MyBiz = (function (my) {
    return my;
} (MyBiz || {}));
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
