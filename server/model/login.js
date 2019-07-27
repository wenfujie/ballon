/*
 * createTime：2018/7/11
 * author：en.chen
 * description:  登陆模块用于处理前端请求的中间层接口
 */

class userLogin {

    //  获取用户授权的url
    static async getAuthorizeUrlValue(ctx, params) {
        return ctx.$postUrl(ctx.baseUrl + ctx.serverPortUrl.baseService + '/wechat/event/web/get-authorize-url/' + params.wxUUID, params).then((res) => {
            return res
        });
    }

    //  通过code值获取用户信息
    static async getAuthorizeInfoValue(ctx, params) {
        return ctx.$postUrl(ctx.baseUrl + ctx.serverPortUrl.baseService + '/wechat/event/web/get-user-info/' + params.wxUUID, params).then((res) => {
            return res
        });
    }

    //  传递code，获取微信端用户信息，pc使用
    static async getAuthorizeInfoPcValue(ctx, params) {
        return ctx.$postUrl(ctx.baseUrl + ctx.serverPortUrl.thirdPartyService + '/login/wx-user-info', params,ctx.headers).then((res) => {
            return res
        });
    }

    //  传递code，获取支付宝用户信息
    static async getAliUserInfoValue(ctx, params) {
        return ctx.$postUrl(ctx.baseUrl + ctx.serverPortUrl.thirdPartyService + '/login/alipay-user-info', params,ctx.headers).then((res) => {
            return res
        });
    }

    //  传递code，获取qq用户信息
    static async getQQUserInfoValue(ctx, params) {
        return ctx.$postUrl(ctx.baseUrl + ctx.serverPortUrl.thirdPartyService + '/login/qq-user-info', params,ctx.headers).then((res) => {
            return res
        });
    }

    //  联合登陆
    static async getUesrLoginValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag + '/vip-info-hds/system/usr-logins', params,ctx.headers).then((res) => {
            return res
        })
    }

    //  通过openId和unionid获取用户信息
    static async isExistUserMm(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/mm-offacts-dtt-usrs/usr-id', params).then(async (res) => {
            if(!res.data){
               let per = await this.isExistUserPer(ctx, params)
               return per
            } else {
                return res
            }
        })
    }

    //  通过openId和unionid获取用户信息
    static async isExistUserPer(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + '/per-usr-dt-unoins/usr-id', params).then((res) => {
            return res
        })
    }
}

module.exports = userLogin
