/*
 * createTime：2018/8/29
 * author：en.chen
 * description: 会员模块-会籍会员功能模块用于处理前端请求的中间层接口
 */
class userBenefit {

    //  获取会籍会员列表
    // static async getCardListValue(ctx, params) {
    //     return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-levels/card', params,ctx.headers).then((res) => {
    //         return res
    //     });
    // }
    // 获取会员卡列表（新增）

    static async getMemCardListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/card-info-hds/vip-cards/' + params.vipInfoHdId + '?shopCode=' + params.shopCode + '&companyId=' + params.companyId, ctx.headers).then((res) => {
            return res
        });
    }
    // 获取购买会员卡列表
    static async getBuyCardListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-levels/card-detail-list', params, ctx.headers).then((res) => {
            return res
        });
    }


    //  获取会籍会员详情（性能调优标识）
    static async getCardDetailValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag + '/vip-levels/card-code', params).then((res) => {
            return res
        });
    }

    //  获取积分余额
    static async getPointValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-dt-funds/point-fund', params).then((res) => {
            return res
        });
    }

    //  获取我的会籍会员
    static async getVipcardinfoValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag + '/vip-info-aggregates/getMyVipInfo', params).then((res) => {
            return res
        });
    }

    //  获取会员卡促销
    static async getCardVouchersValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag + '/vip-info-aggregates/card-vouchers', params).then((res) => {
            return res
        });
    }

    //  购买会籍会员卡
    static async buyCard(ctx, params) {
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-hds/buy-card-level', params, ctx.headers).then((res) => {
            return res.data
        });
    }

}

module.exports = userBenefit
