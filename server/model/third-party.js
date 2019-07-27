/*
 * @Author: yongtian.hong
 * @Date: 2018-09-26 10:49:46
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-09-26 14:00:02
 * @Description: 第三方服务接口
 */
class thirdPartyModel {

    // 获取物流
    static async getLogis(ctx, params) {
        let url = "/expresss?companyId=" + params.companyId;
        return ctx.$post(
            ctx.baseUrl + ctx.serverPortUrl.thirdPartyService + url,
            params,
            ctx.headers
        );
    }

    //获取微信授权
    static async getWxSignature(ctx, params) {
        let url = "/wechat/event/web/get-signature/" + params.wxUUID + "?unAuthorizedUrl=" + params.unAuthorizedUrl;
        return ctx.$post(ctx.baseUrl + url, params);
    }

    //微信第三方登录
    static async getWxLoginValue(ctx, params) {
        let url = '/login/wx-open?companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.thirdPartyService + url, params, ctx.headers);
    }

    //支付宝第三方登录
    static async getAliLoginValue(ctx, params) {
        let url = '/login/alipay-open?companyId=' + params.companyId
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.thirdPartyService + url, params, ctx.headers);
    }

    //qq第三方登录
    static async getQQLoginValue(ctx, params) {
        let url = '/login/qq-open?companyId=' + params.companyId
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.thirdPartyService + url, params, ctx.headers);
    }
}

module.exports = thirdPartyModel;