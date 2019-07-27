/*
* createTime：2018/10/16
* author：en.chen
* description: 前端发票模块api聚合
*/

import http from '../../utils/http'


/**
 * 获取发票设置(是否可以开发票)
 * params: { companyId: 公司id }
 * @returns {*} ("invoiceStateCode" === "D_INV_REFULE" 为不可开发票 , "D_INV_ORDSAVE"为订单结算 ,
 * "D_INV_ORDPAY"为订单支付, "D_INV_SHIP"为订单发货,"D_INV_CONF"为确认收获, "D_INV_COMENT"为评价后)
 */

export const canSetInvoice = (params) => { return http.get('invoice/setInvoice',params); }

/**
 * 获取发票类型、抬头
 * params: { type: 'D_INVOICETYPE'(类型)，'D_INVTITLETYPE'(抬头) }
 */

export const getInvoiceType = (params) => { return http.get('invoice/type',params); }

/**
 * 提交发票申请
 * var param = {
    billCode: 订单编号,
    invoiceTypeCode: 发票类型编码,
    invoiceTitle: 发票抬头,
    invoiceTaxAlias: 纳税别号，
    companyId: 公司id,
    invoiceAddrId: 纸质发票的收货地址(选填),
    invoiceCompany: 发票公司名称,(选填),
    cookieId: cookieId,
    ctmUsrId: 用户id
   }
 * @returns {*}
 */

export const putInvoice = (params) => { return http.post('invoice/putInvoice',params); }

/**
 * 查看发票申请
 * var param = {
    cookieId: cookieId,
    ctmUsrId: 用户id,
    billCode: 订单号,
    companyId: 公司编号
   }
 * @returns {*}
 */

export const getDetail = (params) => { return http.get('invoice/detail',params); }

/**
 * 取消发票
 * @param params
 * @returns {*|Promise}
 */
export const cancelInvoice = (params) => { return http.put('invoice/cancelInvoice',params); }


/**
 * 查看个人发票列表
 * var param = {
    *pageNum: 1,
    *pageSize: 5,
    *companyId: 公司编号,
    *usrId: 用户id,
    invoiceStatusCode: '状态编码',(非必传,状态及编码在个人中心-我的发票),
   }
 * @returns {*}
 */

export const getList = (params) => { return http.get('invoice/getList',params); }