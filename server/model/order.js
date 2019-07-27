/*
 * createTime：2018/9/5
 * author：en.chen
 * description: 订单模块用于处理前端请求的中间层接口
 */

class order {
    //  获取运费
    static async getFreightValue(ctx, params) {
        let url = "/rtl-ord-inter-hds/freight/" + params.id;
        return ctx
            .$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params, ctx.headers)
            .then(res => {
                return res;
            });
    }

    //  获取订单优惠信息
    static async getDiscountValue(ctx, params) {
        let url = "/rtl-ord-hds/discount/" + params.billCode;
        return ctx
            .$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params)
            .then(res => {
                return res;
            });
    }

    //  获取订单列表（会员整合新增vipInfoHdId、性能调优标识）
    static async getList(ctx, params) {
        let url = "/sp-sales/ord-list";
        return ctx
            .$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params, ctx.headers)
            .then(res => {
                return res;
            });
    }

    //获取订单详情（会员整合新增vipInfoHdId、性能调优标识）
    static async getDetail(ctx, params) {
        let url = "/sp-sales/ord-text";
        return ctx
            .$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params, ctx.headers)
            .then(res => {
                return res;
            });
    }

    //配货单列表
    static async getBillList(ctx, params) {
        let url = "/rtl-shipment-hds/list/" + params.billCode;
        return ctx
            .$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params, ctx.headers)
            .then(res => {
                return res;
            });
    }

    //确认收货前判断该订单是否存在售后申请单子
    static async beforeSignUp(ctx, params) {
        let url = "/rtl-ord-hds/firm-receive-pre/bill-codes";
        return ctx
            .$putUrl(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params, ctx.headers)
            .then(res => {
                return res;
            });
    }

    //确认收货
    static async confirmRcieved(ctx, params) {
        let url = "/rtl-ord-hds/firm-receive/bill-codes";
        return ctx
            .$putUrl(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params, ctx.headers)
            .then(res => {
                return res;
            });
    }

    // 取消订单
    static async cancel(ctx, params) {
        let url =
            "/rtl-ord-hds/cancel-del-recycle/bill-codes?companyId=" +
            params.companyId;
        return ctx
            .$put(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params, ctx.headers)
            .then(res => {
                return res;
            });
    }

    //  保存更新结算
    static async saveCartTempValue(ctx, params) {
        let url =
            "/sp-sales/cart-temp?companyId=" +
            params.companyId +
            "&usrId=" +
            params.usrId +
            "&vipInfoHdId=" +
            params.vipInfoHdId;
        return ctx
            .$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params, ctx.headers)
            .then(res => {
                return res;
            });
    }

    //  执行会员升级 POST
    static async packLvUpValue(ctx, params) {
        let url =
            "/rtl-ord-hds/pack-lv-up-param?companyId=" +
            params.companyId +
            "&usrId=" +
            params.usrId + "&billCode=" + params.billCode;
        return ctx
            .$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params, ctx.headers)
            .then(res => {
                return res;
            });
    }

    //  订单=》锁库存
    static async lockStockValue(ctx, params) {
        let url = "/lock-or-unlock-inv-aggregates/oper-order-inv-by-billcode"
        return ctx.$putUrl(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params, ctx.headers)
            .then(res => {
                return res;
            });
    }

    //  获取订单结算页信息(性能调优标识)
    static async getOrderSettlementValue(ctx, params) {
        let url = "/sp-sales/cart-temp";
        return ctx
            .$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params, ctx.headers)
            .then(res => {
                return res;
            });
    }

    //  获取配送方式
    static async getShipTypeValue(ctx, params) {
        return ctx
            .$get(
                ctx.baseUrl + ctx.serverPortUrl.shoppingCart + "/rtl-ship-mgrs",
                params, ctx.headers
            )
            .then(res => {
                return res;
            });
    }

    //  提交订单(会员整合新增vipInfoHdId)
    static async saveOrderValue(ctx, params) {
        let url =
            "/rtl-ord-hd-aggregates/order-readirect-save?companyId=" +
            params.companyId +
            "&usrId=" +
            params.usrId + "&vipInfoHdId=" + params.vipInfoHdId;
        return ctx
            .$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params, ctx.headers)
            // .$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params, ctx.headers)
            .then(res => {
                return res;
            });
    }

    //  订单促销优惠计算(性能调优标识)
    static async orderPreferCal(ctx, params) {
        let url = `/online-calculate/${params.ordId}`;
        delete params.ordId;
        return ctx
            .$get(ctx.nettyUrl + ctx.serverPortUrl.promotion + ctx.optimizeFlag + url, params, ctx.headers)
            .then(res => {
                return res;
            });
    }

    //  预约量体-工单 聚合
    static async saleCtmmeasureAggregateValue(ctx, params) {
        let url =
            "/sale-ctm-measure-aggregates/" + params.ordHdId + "/sale-measure";
        return ctx
            .$putUrl(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params)
            .then(res => {
                return res;
            });
    }

    //  订单分享信息查询
    static async getShareItem(ctx, params) {
        let url = "/rtl-ord-dt-share-aggregates/get-share-statitem";
        return ctx
            .$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params)
            .then(res => {
                return res;
            });
    }

    //  订单分享信息更新
    static async saveShareItem(ctx, params) {
        let url =
            "/rtl-ord-dt-share-aggregates/save-share-statitem?billCode=" +
            params.billCode +
            "&companyId=" +
            params.companyId +
            "&usrId=" +
            params.usrId;
        params.model.ownCompanyId = params.companyId;
        return ctx
            .$put(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params.model)
            .then(res => {
                return res;
            });
    }

    //  提交订单评价
    static async ordComment(ctx, params) {
        let url = '/rtl-ord-hds/ord-comment/usr-id?companyId=' + params.companyId + '&usrId=' + params.usrId + "&vipInfoHdId=" + params.vipInfoHdId;
        params.model.ownCompanyId = params.companyId;
        return ctx
            .$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params.model)
            .then(res => {
                // return ctx.$post('http://1.1.6.103:8806/rtl-ord-hds/ord-comment/usr-id?companyId='+params.companyId+'&usrId='+params.usrId, params.model).then((res) => {
                return res;
            });
    }

    //  订单分享信息保存
    static async saveShareInfo(ctx, params) {
        let url = "/rtl-ord-dt-share-aggregates/save-share-info";
        return ctx
            .$postUrl(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params)
            .then(res => {
                return res;
            });
    }

    //  订单=》处理会员积分
    static async handlePoints(ctx, params) {
        let url = "/vip-info-hds/deal-with-points";
        return ctx
            .$putUrl(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params)
            .then(res => {
                return res;
            });
    }

    //  获取退单原因列表
    static async getReasonsList(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/rtl-returnsreasons', params, ctx.headers).then(res => {
            return res;
        });
    }

    //  获取用户不同状态订单对应的数量（会员整合新增vipInfoHdId）
    static async getorderNum(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-sales/count-ord-status-nums', params, ctx.headers).then(res => {
            return res;
        });
    }

    // 再次购买（会员整合新增vipInfoHdId）
    static async buyAgain(ctx, params) {
        let url = "/sp-sales/ord-buy-again?billCode=" + params.billCode;
        return ctx.$post(
            ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url,
            params,
            ctx.header
        );
    }

    // 清除订单详情/列表缓存
    static async clearCache(ctx, params) {
        let url = "/sp-sales/clear-ord-cache";
        return ctx.$get(
            ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url,
            params,
            ctx.header
        );
    }
    // 不带参清除全部订单详情/列表缓存
    static async clearAllCache(ctx, params) {
        let url = "/sp-sales/clear-ord-cache-all";
        return ctx.$get(
            ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url,
            params,
            ctx.header
        );
    }
}

module.exports = order;
