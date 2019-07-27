/*
 * @Author: yongtian.hong
 * @Date: 2018-12-22 13:35:25
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-12-22 14:49:37
 * @Description: 用户账户接口操作
 */

const account = require("../model/account.js");

class accountController {
  //  微信充值
  static async wxCharge(ctx) {
    let res = await account.wxCharge(ctx, ctx.params);
    ctx.body = res;
  }
}

module.exports = accountController;
