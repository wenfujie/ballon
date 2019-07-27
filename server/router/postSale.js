/*
 * @Author: yongtian.hong
 * @Date: 2018-09-25 15:10:30
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-26 11:29:21
 * @Description: 售后服务路由适配
 */
const postSaleService = require("../controller/postSale");

module.exports = {
  "GET/getList": postSaleService.getList,
  "PUT/cancelApply": postSaleService.cancelApply,
  "POST/submitApply": postSaleService.submitApply,
  "GET/getReason": postSaleService.getReason,
  "GET/getWays": postSaleService.getPostSaleWay,
  "GET/getDetail": postSaleService.getPostSaleDetail,
  "GET/getExpressCompanies": postSaleService.getExpressCompanies,
  "POST/savePostSaleLogis": postSaleService.savePostSaleLogis,
  "GET/getApplyNum": postSaleService.getApplyNum

};
