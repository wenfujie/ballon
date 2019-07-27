/*
 * createTime：2019/1/28
 * author：fujie.wen
 * description: 资金模块
 */

const fund = require('../model/fund');

class fundController{

    // 获取账户资金
    static async getFund(ctx) {
        let res = await fund.getFund(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取资金详情列表
    static async getFundsList(ctx) {
        let res = await fund.getFundsList(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 微信充值
    static async wxCharge(ctx) {
        let res = await fund.wxCharge(ctx, ctx.params);
        ctx.body = res;
    }

    // 获取微信充值列表
    static async getChargeTypeList(ctx) {
        let res = await fund.getChargeTypeList(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取可以使用充值卡列表
    static async getChargeCardList(ctx) {
        let res = await fund.getChargeCardList(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 通过卡号密码充值
    static async chargeByCardNum(ctx) {
        let res = await fund.chargeByCardNum(ctx, ctx.params);
        ctx.body = res;
    }

    // 校验充值卡是否需要密码
    static async getCardInfoForCheck(ctx) {
        let res = await fund.getCardInfoForCheck(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 根据充值卡id充值
    static async chargeByCardId(ctx) {
        let res = await fund.chargeByCardId(ctx, ctx.params);
        ctx.body = res.data;
    }
}

module.exports = fundController;
