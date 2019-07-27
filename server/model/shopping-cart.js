/*
 * createTime：2018/7/16
 * author：en.chen
 * description: 购物车模块用于处理前端请求的中间层接口
 */

class cart {
    //  批量转移本地购物车
    static async transferValue(ctx, params) {
        let url = '/rtl-cart-hd-aggregates/transfer?companyId=' + params.companyId
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  删除购物车（会员整合新增vipInfoHdId）
    static async deleteCartValue(ctx, params) {
        return ctx.$delete(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/rtl-cart-hds/usr-id', params,ctx.headers).then((res) => {
            return res
        });
    }

    //  保存购物车列表（会员整合需要新增vipInfoHdId,性能调优标识）
    static async saveCartValue(ctx, params) {
        let url = '/rtl-cart-hd-aggregates?companyId=' + params.companyId + '&flag=' + params.flag
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params,ctx.headers).then((res) => {
            return res
        });
    }

    //  查询购物车列表(会员整合新增vipInfoHdId)
    static async getCartListValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + '/rtl-cart-hd-aggregates', params, ctx.headers).then((res) => {
            return res
        });
    }

    //  保存购物车数量
    static async saveCartNumValue(ctx, params) {
        return ctx.$putUrl(ctx.baseUrl + ctx.serverPortUrl.shoppingCart +
                '/sp-goods/modify-cart-count/' + params.cartId, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  查询购物车数量（会员整合修改路径）
    static async getCartCountValue(ctx, params) {
        let url = '/rtl-cart-hds/count/' + params.vipInfoHdId
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params, ctx.headers).then((res) => {
            return res
        });
    }
}

module.exports = cart
