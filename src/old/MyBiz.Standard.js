var MyBiz = (function (my) {
    return my;
} (MyBiz || {}));

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