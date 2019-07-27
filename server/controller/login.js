/*
 * createTime: 2019/7/9 9:53
 * author: en.chen
 * description: 中间层商品模块整合
 */

const login = require('../model/login');
const analysis = require('../model/analysis');
const cms = require('../model/cms');

class loginController {

    // 传递code，获取微信端用户信息，pc使用
    static async getAuthorizeInfoPc(ctx) {
        let res = await login.getAuthorizeInfoPcValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 传递code，获取支付宝用户信息
    static async getAliUserInfo(ctx) {
        let res = await login.getAliUserInfoValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 传递code，获取qq用户信息
    static async getQQUserInfo(ctx) {
        let res = await login.getQQUserInfoValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 联合登陆
    static async userLoginService(ctx) {
        let res = await login.getUesrLoginValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 微信登陆后获取用户信息
    static async getAuthorizeInfo(ctx) {
        let res = await login.getAuthorizeInfoValue(ctx, ctx.params);
        ctx.body = res;
    }

    // 微信获取用户授权地址
    static async getAuthorizeUrl(ctx) {
        let res = await login.getAuthorizeUrlValue(ctx, ctx.params);
        ctx.body = res;
    }

    // 微信获取用户授权地址
    static async existUser(ctx) {
        let res = await login.isExistUserMm(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 根据openid和unionid判断用户是否已存在
    static async mergeLogin(ctx) {
        let wechatInfo = await analysis.getWxData(ctx, ctx.params)
        let properties = await cms.getProperties(ctx,ctx.params);
        let userSex = ((wechatInfo.gender == 1) ? 'D_MALE' : 'D_FEMALE')
        let loginData = {
            ownCompanyId: properties.data.companyId,
            companyId: properties.data.companyId,
            shopId: properties.data.shopIds,
            busContsCode: 'D_BUSCONTS_WSC',
            openId: wechatInfo.openId,
            signUpTypeCode: 'D_SMP',
            usrName: wechatInfo.nickName,
            url: wechatInfo.avatarUrl,
            sex: userSex
        }
        if (!!wechatInfo.unionId) loginData.unionId = wechatInfo.unionId
        console.log("##########", loginData)
        let userInfo = await login.getUesrLoginValue(ctx, loginData)
        let loginInfo = {
            openId: wechatInfo.openId,
            companyId: properties.data.companyId,
            shopId: userInfo.data.shopId,
            shopCode: userInfo.data.shopCode,
            usrId: userInfo.data.usrId,
            wxUnionId: properties.data.mpUuid,
            publicAccount: properties.data.publicAccount,
            iframeUrl: encodeURIComponent(properties.data.iframeUrl)
        }
        console.log(loginInfo)
        ctx.body = loginInfo;
    }
}

module.exports = loginController;
