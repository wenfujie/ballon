/*
 * createTime：2018/7/25
 * author：en.chen
 * description: 会员模块-地址功能模块用于处理前端请求的中间层接口
 */

class userAddr {

    //  获取用户地址列表（会员整合新增vipInfoHdId）
    static async getAddrListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-dt-addss', params, ctx.headers).then((res) => {
            return res
        });
    }

    //  新增/修改用户地址信息（会员整合新增vipInfoHdId、性能调优标识）
    static async changeAddrValue(ctx, params) {
        let url = `/vip-info-dt-addss/dest-code?companyId=${params.companyId}&usrId=${params.usrId}&destCode=${params.destCode}`
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag + url, params, ctx.headers).then((res) => {
            return res.data
        });
    }

    //  删除用户地址
    static async deleteAddrListValue(ctx, params) {
        return ctx.$delete(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-dt-addss' + '?companyId=' + params.companyId + '&usrId=' + params.usrId + '&ids=' + params.ids, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  获取地址详情
    static async addressDetailValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-dt-addss/receive-adds-info/id', params, ctx.headers).then((res) => {
            return res
        });
    }
}

module.exports = userAddr
