/*
* createTime：2018/10/9
* author：en.chen
* description: 
*/

import http from '../../utils/http'

/**
 * 订单支付
 * @param config
 * var param = {
    *usrId: 用户id,
    *paymentCode: "D_WEIXIN",
    *tradeTypeCode: "JSAPI",
    *paymentTypeCode: "D_FULL", ("D_INPOUR"用于资金充值)
    domainName: info.domainName,
    *shopCode: 店铺code,
    *orderList: 订单号,
    *openId: 微信用户openid,
    *orderType: '订单类型' (D_CARDORD会员卡购买订单,D_COUPONSORD优惠券购买订单,D_MASORD商品购买订单  ,D_MSRORD预约量体订单)
    }
 * @returns {*}
 */

export const payOrder = (config) => {return http.post('payment/orderPayment',config); }

/**
 * 根据paymentUid查询订单支付状态
 * @param config
 * var param = {
    *paymentUid: 支付id,
    * companyId：公司id
    }
 * @returns {*}
 */

export const getBillState = (config) => {return http.get('payment/getBillState',config); }