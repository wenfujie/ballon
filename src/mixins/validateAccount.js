import {
    UserService
} from '@/api/service';

const validateAccount = {
    methods: {
        // 校验用户账号
        validateAccount(rule, value, callback) {
            let reg = /^[a-zA-Z][a-zA-Z0-9_]{1,12}$/;
            if (!reg.exec(value)) {
                return callback(new Error(this.$t("validateRules.account.errorOne")));
            } else {
                // 同名校验
                UserService.findUserName({
                    usrname: value
                }).then(res => {
                    if (res > 0) {
                        return callback(new Error(this.$t("validateRules.account.errowTwo")));
                    } else {
                        callback();
                    }
                })
            }
        },
        // 校验手机号
        validatePhone(rule, value, callback) {

            let phoReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
            let regPho = new RegExp(phoReg);
            if (!value) {
                return callback(new Error(this.$t("validateRules.phone.errorOne")));
            } else if (regPho.test(value)) {
                callback();
            } else {
                return callback(new Error(this.$t("validateRules.phone.errowTwo")));
            }
        },
        // validatedptName( rule, value, callback){
        //     console.log(value,'valuevaluevaluevaluevaluevalue')
        //     if(!value){

        //         return callback(new Error(this.$t("bookingAlert.rulesDptName")))
        //     }
        // },
        validateAdrressDetail(rule, value, callback) {
            if (!value) {
                return callback(new Error(this.$t("validateRules.adrressDetail.errorOne")));
            } else if (value.length < 5 || value.length > 120) {
                return callback(new Error(this.$t("validateRules.adrressDetail.errowTwo")));
            } else {
                callback();
            }
        },
        // 密码校验(包含密码强度等级)
        validatePassword(rule, s, callback) {
            if(s.length < 6){
                return callback(new Error(this.$t("validateRules.password.errorOne")));
            }
            let ls = 0;// 密码强度等级

            if (s.match(/([a-z])+/)) {
                ls++;
            }
            if (s.match(/([0-9])+/)) {
                ls++;
            }
            if (s.match(/([A-Z])+/)) {
                ls++;
            }
            if (s.match(/[^a-zA-Z0-9]+/)) {
                ls++;
            }
            if (ls < 2) {
                return callback(new Error(this.$t("validateRules.password.errorOne")));
            } else {
                let reg = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*_.]+$)[a-zA-Z\d!@#$%^&*_.]+$/;
                if (reg.exec(s)) {
                    callback();
                } else {
                    return callback(new Error(this.$t("validateRules.password.errowTwo")));
                }
            }
        },
        // 校验邮箱
        validateEmail(rule, value, callback) {
            let emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/i;
            let regEmail = new RegExp(emailReg);
            if (!value) {
                return callback(new Error(this.$t("validateRules.email.errorOne")));
            } else if (regEmail.test(value)) {
                callback();
            } else {
                return callback(new Error(this.$t("validateRules.email.errowTwo")));
            }
        },
        // 短信验证码校验
        validateVerificationCode(rule, s, callback) {
            let numReg = /^[0-9]*$/;
            if (!numReg.test(s) || s.length !== 6) {
                return callback(new Error(this.$t("validateRules.verificationCode.errorOne")));
            } else {
                callback();
            }
        },
        // 图形验证码校验
        validateImgCode(rule, s, callback) {
            let numReg = /^[0-9]*$/;
            if (!numReg.test(s) || s.length !== 4) {
                return callback(new Error(this.$t("validateRules.code.errorOne")));
            } else {
                callback();
            }
        },
    }
};
export {
    validateAccount
};
