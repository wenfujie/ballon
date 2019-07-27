/*
* createTime：2018/10/9
* author：en.chen
* description:  订单支付
*/

class paymentFun {

    //  订单支付(性能调优标识)
    static async payOrder(ctx, params) {
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.payment + ctx.optimizeFlag +  '/order-pay', params,ctx.headers).then((res) => {
            return res
        });
    }

    //  查询订单支付状态
    static async billStateValue(ctx, params) {
        let url = `/rtl-ord-payments/feedback_flag/${params.paymentUid}`;
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params,ctx.headers).then((res) => {
            return res
        });
    }

}

module.exports = paymentFun
