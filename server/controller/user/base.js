/*
 * createTime：2018/7/27
 * author：en.chen
 * description: 会员模块-会员基本功能api
 */

const userBase = require('../../model/user-base');

class userBaseController {

    // 校验手机号是否绑定
    static async checkPhone(ctx) {
        let res = await userBase.checkPhoneValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 手机验证码先置code
    static async getCaptcha(ctx) {
        let res = await userBase.getCaptchaValue(ctx, ctx.params);
        ctx.body = res.data;
        // let params = {
        //     telphone: ctx.params.mobile,
        //     context: res.data.mobileMsg,
        //     ownCompanyId: ctx.params.ownCompanyId,
        //     companyId: ctx.params.companyId || ctx.params.ownCompanyId,
        //     cmsMesstempHdId: res.data.cmsMesstempHdId, // 短信模板id
        //     companySign: res.data.companySign || null, // 公司签名
        //     templateCode: res.data.templateCode || null, // 验证码模板编号
        //     smsType: res.data.smsType || null // 短信平台类型
        // }
        // let resp = await userBase.sendCaptchaValue(ctx, params)
        // ctx.body = resp.data;
    }

    // 手机验证码
    static async sendCaptcha(ctx) {
        let res = await userBase.sendCaptchaValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 绑定手机号
    static async bindMobile(ctx) {
        let res = await userBase.bindMobileValue(ctx, ctx.params);
        ctx.body = res
    }

    // 验证手机验证码
    static async checkCaptcha(ctx) {
        let res = await userBase.checkCaptchaValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 修改手机号
    static async changePhone(ctx) {
        let res = await userBase.changePhoneValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 用户注册
    static async vipRegister(ctx) {
        let res = await userBase.vipRegisterValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 会员登录（账号密码）
    static async vipLogin(ctx) {
        let res = await userBase.vipLoginValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 会员登录（手机验证码）
    static async vipCodeLogin(ctx) {
        let res = await userBase.vipCodeLoginValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 会员登录（手机验证码）
    static async retrievePassword(ctx) {
        let res = await userBase.retrievePasswordValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 安全管理（获取原始密码）
    static async getPassword(ctx) {
        let res = await userBase.getPasswordValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 安全管理（修改密码）
    static async changePassword(ctx) {
        let res = await userBase.changePasswordValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 安全管理（设置密码）
    static async setPassword(ctx) {
        let res = await userBase.setPasswordValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 查询用户账号是否已存在
    static async findUserName(ctx) {
        let res = await userBase.findUserNameValue(ctx, ctx.params);
        ctx.body = res.data
    }

    //  获取会员卡列表
    static async memberCartList(ctx, next) {
        let res = await userBase.memberCartListValue(ctx, ctx.params)
        ctx.body = res.data
    }
}

module.exports = userBaseController;
