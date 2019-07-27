/*
 * createTime：2018/7/27
 * author：en.chen
 * description: 会员模块-会员基础功能模块用于处理前端请求的中间层接口
 */
class userBase {
    //  校验手机号是否绑定
    static async checkPhoneValue(ctx, params) {
        let url = '/vip-info-hds/check-bind/' + params.usrId
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  获取手机验证码的先置条件
    static async getCaptchaValue(ctx, params) {
        let url = '/vip-info-hds/get-verify-code-v2'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  通过mobileMsg发送短信
    static async sendCaptchaValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + '/sms/sms/send', params, ctx.headers).then((res) => {
            return res
        });
    }

    //  绑定手机号（会员整合新增vipInfoHdId、性能调优标识）
    static async bindMobileValue(ctx, params) {
        let url = '/vip-info-hds/binding-usr-mobile'
        return ctx.$putUrl(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag + url, params).then((res) => {
            return res
        });
    }

    //  验证手机验证码是否正确（会员整合新增vipInfoHdId）
    static async checkCaptchaValue(ctx, params) {
        let url = '/vip-info-hds/verify-usr-mobile-v2?companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  更换绑定手机号
    static async changePhoneValue(ctx, params) {
        let url = '/vip-info-hds/mobile/' + params.usrId
        return ctx.$putUrl(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  用户注册
    static async vipRegisterValue(ctx, params) {
        let url = '/vip-info-hds/vip-register'
        return ctx.$postUrl(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  会员登录（账号密码）
    static async vipLoginValue(ctx, params) {
        let url = '/usr-pwds/vip-verify-pwd'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  会员登录（手机验证码）
    static async vipCodeLoginValue(ctx, params) {
        let url = '/vip-info-hds/vip-verify-mobile'
        return ctx.$postUrl(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  会员登录（手机验证码）
    static async retrievePasswordValue(ctx, params) {
        let url = '/vip-info-hds/retrieve-password'
        return ctx.$postUrl(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  安全管理（获取原始密码）
    static async getPasswordValue(ctx, params) {
        let url = '/usr-pwds/uesr?usrId=' + params.usrId + '&companyId=' + params.companyId
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params, ctx.headers).then((res) => {
            return res
        });
    }
    //  安全管理（修改密码）
    static async changePasswordValue(ctx, params) {
        let url = '/usr-pwds/update/newpwd'
        return ctx.$putUrl(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params, ctx.headers).then((res) => {
            return res
        });
    }
    //  安全管理（设置密码）
    static async setPasswordValue(ctx, params) {
        let url = '/usr-pwds/insert?usrId=' + params.usrId + '&companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params, ctx.headers).then((res) => {
            return res
        });
    }
    //  查询用户账号是否已存在
    static async findUserNameValue(ctx, params) {
        let url = '/per-usrs/exists'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params, ctx.headers).then((res) => {
            return res
        });
    }
    //  获取会员整合用户列表
    static async memberCartListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + `/card-info-hds/vip-cards-for-pay/${params.vipInfoHdId}`, params).then((res) => {
            return res
        });
    }
}

module.exports = userBase
