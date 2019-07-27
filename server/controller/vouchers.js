/*
 * createTime：2018/8/22
 * author：en.chen
 * description: 优惠券模块功能api
 */

const vouchers = require('../model/vouchers');

class vouchersController {

    // 获取领取优惠券列表
    static async vouchersList(ctx) {
        let res = await vouchers.getVouchersListValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取我的优惠券列表
    static async userVouchersList(ctx) {
        let res = await vouchers.getUserVouchersListValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 领取优惠券
    static async saveCoupons(ctx) {
        let res = await vouchers.saveCouponsValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 购买优惠券
    static async buyCoupons(ctx) {
        let res = await vouchers.buyCouponsValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 清空优惠券
    static async deleteCoupons(ctx) {
        let res = await vouchers.deleteCouponsValue(ctx, ctx.params);
        ctx.body = res
    }

    // 获取结算可用优惠券信息 (超鸿)
    static async getSettlementDiscount(ctx) {
        let res = await vouchers.getSettlementDiscountValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取订单结算页面促销赠品信息
    static async getOrderPromotion(ctx) {
        let res = await vouchers.getOrderPromotionValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取商品促销活动
    static async getGoodsPromotion(ctx) {
        let res = await vouchers.getGoodsPromotionValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取促销标识
    static async getGoodspmFlag(ctx) {
        let res = await vouchers.getGoodspmFlagValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取促销赠品sku
    static async getPromotionGoodsku(ctx) {
        let res = await vouchers.getPromotionGoodskuValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取促销赠品库存
    static async promotionGoodsInventory(ctx) {
        let res = await vouchers.getPromotionGoodsInventory(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取结算可用优惠券信息 (季老师)
    static async getCouponsList(ctx) {
        let res = await vouchers.getCouponsListValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 根据卡编号 获取卡id
    static async getCouponsId(ctx) {
        let res = await vouchers.getCouponsIdValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 选券后获取可用券id列表 (季老师)
    static async getCanUseCouponsList(ctx) {
        let res = await vouchers.getCanUseCouponsListValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 结算页面优惠金额
    static async getOrderDiscount(ctx) {
        let res = await vouchers.getOrderDiscountValue(ctx, ctx.params);
        ctx.body = res
    }

    // 结算页面优惠金额(包含积分)
    static async getOrderDiscountPoint(ctx) {
        let res = await vouchers.getOrderDiscountPointValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 结算页面优惠金额
    static async getWxConfig(ctx) {
        let res = await vouchers.getWxConfig(ctx, ctx.params);
        ctx.body = res
    }

    // 会员登录触发发卡发券
    static async sendCardCoupons(ctx) {
        let res = await vouchers.sendCardCoupons(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取商品可使用一次性储值卡
    static async getUsableVlaueCard(ctx) {
        let res = await vouchers.getUsableVlaueCard(ctx, ctx.params);
        ctx.body = res.data
    }
}

module.exports = vouchersController;
