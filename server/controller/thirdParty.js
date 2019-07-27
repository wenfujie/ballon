/*
 * @Author: yongtian.hong
 * @Date: 2018-09-26 11:33:16
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-09-26 14:11:25
 * @Description: 第三方服务
 */

const thirdParty = require("../model/third-party");

class thirdPartyController {

    // 获取物流
    static async getLogis(ctx) {
        let params = {
            ownCompanyId: ctx.params.companyId,
            companyId: ctx.params.companyId,
            expressCode: ctx.params.expressCode,
            logisticCode: ctx.params.logisticCode
        };
        let logis = await thirdParty.getLogis(ctx, params);
        ctx.body = logis.data
    }

    // 微信第三方登录
    static async getWxLogin(ctx) {
        let res = await thirdParty.getWxLoginValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 第三方登录接口聚合（微信、qq、支付宝）
    static async getThirdLogin(ctx) {
        let res = {};
        switch (ctx.params.signupTypeCode){
            case 'D_WECHAT':// 微信
                res = await thirdParty.getWxLoginValue(ctx, ctx.params);
                break;
            case 'D_ALI':// 支付宝
                res = await thirdParty.getAliLoginValue(ctx, ctx.params);
                break;
            case 'D_QQ':// qq
                res = await thirdParty.getQQLoginValue(ctx, ctx.params);
                break;
        }
        ctx.body = res.data;
    }
}

module.exports = thirdPartyController;
