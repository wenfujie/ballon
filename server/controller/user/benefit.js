/*
 * createTime：2018/8/29
 * author：en.chen
 * description: 会员模块-会员基本功能api
 */

const userBenefit = require('../../model/user-benefit');

class userBenefitController {

    // 获取会员卡列表
    static async memberCardList(ctx) {
        let res = await userBenefit.getMemCardListValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取购买会籍会员列表
    static async cardLevelList(ctx) {
        let res = await userBenefit.getBuyCardListValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取会籍会员详情
    static async cardLevelDetail(ctx) {
        let res = await userBenefit.getCardDetailValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取积分余额
    static async pointValue(ctx) {
        let res = await userBenefit.getPointValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取我的会籍会员
    static async getVipcardinfo(ctx) {
        let res = await userBenefit.getVipcardinfoValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取会员卡促销
    static async getCardVouchers(ctx) {
        let res = await userBenefit.getCardVouchersValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 购买会籍会员
    static async buyCard(ctx) {
        let res = await userBenefit.buyCard(ctx, ctx.params);
        ctx.body = res
    }
}

module.exports = userBenefitController;
