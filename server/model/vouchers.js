/*
 * createTime：2018/8/22
 * author：en.chen
 * description: 优惠券模块用于处理前端请求的中间层接口
 */

class vouchersFunc {
  //  获取领取优惠券列表（会员整合新增vipInfoHdId、性能调优标识）
  static async getVouchersListValue(ctx, params) {
    return ctx
      .$get(
        ctx.nettyUrl +
          ctx.serverPortUrl.memberService +
          ctx.optimizeFlag +
          "/coupons-aggregates/available-coupons",
        params,ctx.headers
      )
      .then(res => {
        return res;
      });
  }

  //  获取我的优惠券列表（会员整合新增vipInfoHdId、性能调优标识）
  static async getUserVouchersListValue(ctx, params) {
    return ctx
      .$get(
        ctx.nettyUrl +
          ctx.serverPortUrl.memberService +
          ctx.optimizeFlag +
          "/value-card-hds/get-usr-coupons-info",
        params,
        ctx.headers
      )
      .then(res => {
        return res;
      });
  }

  //  领取优惠券（会员整合新增vipInfoHdId）
  static async saveCouponsValue(ctx, params) {
    let url =
      "/coupons-aggregates?usrId=" +
      params.usrId +
      "&companyId=" +
      params.companyId + "&vipInfoHdId=" + params.vipInfoHdId;
    return ctx
      .$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params, ctx.headers)
      .then(res => {
        return res;
      });
  }

  //  购买优惠券（会员整合新增vipInfoHdId、netty修改）
  static async buyCouponsValue(ctx, params) {
    let url = "/sp-ord-level-hds/buying-coupon?companyId=" + params.companyId + "&vipInfoHdId=" + params.vipInfoHdId + '&usrId=' + params.usrId;
    return ctx
      .$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params, ctx.headers)
      .then(res => {
        return res;
      });
  }

  //  清空优惠券
  static async deleteCouponsValue(ctx, params) {
    let url =
      "/vip-cher-infos/waste-card/" +
      params.usrId +
      "?couponCategory=" +
      params.couponCategory +
      "&companyId=" +
      params.companyId;
    return ctx
      .$putUrl(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params)
      .then(res => {
        return res;
      });
  }

  //  获取结算可用优惠券信息 （超鸿）
  static async getSettlementDiscountValue(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl + ctx.serverPortUrl.memberService + "/valuecard-cards/cher",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  获取订单结算页面促销赠品信息
  static async getOrderPromotionValue(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl +
          ctx.serverPortUrl.promotion +
          "/online-hds/cart-temp-id/order-promotions",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  获取商品促销活动
  static async getGoodsPromotionValue(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl +
          ctx.serverPortUrl.shoppingCart +
          "/sp-part-goodss/goods/promotion",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  获取促销标识
  static async getGoodspmFlagValue(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl +
          ctx.serverPortUrl.promotion +
          "/online-hds/get-promotion-pic",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  获取促销赠品sku
  static async getPromotionGoodskuValue(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl + ctx.serverPortUrl.promotion + "/promotion-goods-skus",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  获取促销赠品库存
  static async getPromotionGoodsInventory(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl +
          ctx.serverPortUrl.promotion +
          "/online-dtt-gifts/inventory",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  获取结算可用优惠券列表 (季老师，新版)   旧版为/valuecard-hds/ord-usable-coupons
  static async getCouponsListValue(ctx, params) {
    return ctx
      .$get(
        ctx.nettyUrl +
          ctx.serverPortUrl.memberService + ctx.optimizeFlag +
          "/valuecard-hds/ord-usable-coupons-hans",
        params, ctx.headers
      )
      .then(res => {
        return res;
      });
  }

  //  根据卡编号 获取卡id
  static async getCouponsIdValue(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl +
          ctx.serverPortUrl.memberService +
          "/valuecard-hds/card-id",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  选券后获取可用券id列表
  static async getCanUseCouponsListValue(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl +
          ctx.serverPortUrl.memberService +
          "/valuecard-hds/ord-usable-coupons-simple",
        params,ctx.headers
      )
      .then(res => {
        return res;
      });
  }

  //  结算页面优惠金额
  static async getOrderDiscountValue(ctx, params) {
    return ctx
      .$postUrl(
        ctx.baseUrl +
          ctx.serverPortUrl.shoppingCart +
          "/rtl-online-result-hds/preferential-amount",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  结算页面优惠金额(性能调优标识、url拼接参数)
  static async getOrderDiscountPointValue(ctx, params) {
    return ctx
      .$postUrl(
        ctx.nettyUrl +
          ctx.serverPortUrl.shoppingCart +
          ctx.optimizeFlag +
          "/rtl-online-result-hds/preferential-amount-point" +
          `?companyId=${params.companyId}&usrId=${params.usrId}&vipInfoHdId=${params.vipInfoHdId}&rtlOrdInterHdId=${params.rtlOrdInterHdId}&pointFlag=${params.pointFlag}&ownCompanyId=${params.ownCompanyId}&cardIds=${params.cardIds}` +
          `&vipCardHdId=${params.vipCardHdId}`,
        params,
              ctx.headers
      )
      .then(res => {
        return res;
      });
  }

  //  获取优惠券加入微信卡包参数
  static async getWxConfig(ctx, params) {
    return ctx
      .$post(
        ctx.baseUrl + ctx.serverPortUrl.wxService + "/wxcards/getCardExt",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  会员登录触发发卡发券
  static async sendCardCoupons(ctx, params) {
    return ctx
      .$putUrl(
        ctx.baseUrl +
          ctx.serverPortUrl.shoppingCart +
          "/rtl-ord-hds/send-card-coupons",
        params,ctx.headers
      )
      .then(res => {
        return res;
      });
  }

  //  获取商品可使用一次性储值卡(性能调优标识)
  static async getUsableVlaueCard(ctx, params) {
    return ctx
      .$get(
        ctx.nettyUrl +
          ctx.serverPortUrl.memberService +
          ctx.optimizeFlag +
          "/valuecard-hds/get-available-stored-cards",
        params
      )
      .then(res => {
        return res;
      });
  }
}

module.exports = vouchersFunc;
