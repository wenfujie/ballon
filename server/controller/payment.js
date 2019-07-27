/*
 * createTime: 2019/7/9 10:14
 * author：en.chen
 * description: 订单支付
 */

const payment = require('../model/payment');

class paymentController {

    // 订单支付
    static async orderPayment(ctx) {
        let res = await payment.payOrder(ctx, ctx.params);
        ctx.body = res.data
    }

    // 查询订单支付状态
    static async billState(ctx) {
        let res = await payment.billStateValue(ctx, ctx.params);
        ctx.body = res.data
    }
}

module.exports = paymentController;
