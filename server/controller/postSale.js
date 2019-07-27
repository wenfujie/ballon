/*
 * @Author: yongtian.hong
 * @Date: 2018-09-25 14:57:29
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-27 13:38:39
 * @Description: 售后申请
 */

const postSale = require("../model/post-sale");
const base = require("../model/base");
const pingyin = require("../util/pinyin");

class postSaleController {

    // 获取申请单列表
    static async getList(ctx) {
        let params = {
            usrId: ctx.params.usrId,
            ctmUsrId: ctx.params.usrId,
            companyId: ctx.params.companyId,
            pageSize: ctx.params.pageSize,
            pageNum: ctx.params.pageNum,
            ownCompanyId: ctx.params.ownCompanyId
        };
        let result = await postSale.getList(ctx, params);
        ctx.body = {
            data: result.data,
            statusCode: 200
        };
    }

    // 取消售后申请单
    static async cancelApply(ctx) {
        let params = {
            usrId: ctx.params.usrId,
            reApplyCode: ctx.params.reApplyCode,
            companyId: ctx.params.companyId,
            ownCompanyId: ctx.params.ownCompanyId
        };
        let result = await postSale.cancelApply(ctx, params);
        if (result === 1) result = 200;
        ctx.body = {
            statusCode: result
        };
    }

    // 提交售后申请
    static async submitApply(ctx) {

        let result = await postSale.submitApply(ctx, ctx.params);

        if (result.status === 500) {
            result.code = 500;
        } else if (result.msg) {
            result.code = 200;
            result.data = result.msg
        }
        ctx.body = {
            status: result.code,
            data: result.data
        };
    }

    // 获取售后原因
    static async getReason(ctx) {
        let result = await postSale.getReason(ctx, ctx.params);
        ctx.body = {
            data: result.data,
            status: result.status
        }
    }

    // 获取售后类型
    static async getPostSaleWay(ctx) {
        let result = await postSale.getPostSaleWay(ctx, ctx.params);
        ctx.body = {
            status: result.status,
            data: result.data
        };
    }

    // 获取售后申请单详情
    static async getPostSaleDetail(ctx) {
        let result = await postSale.getPostSaleDetail(ctx, ctx.params);
        ctx.body = {
            data: result.data
        }
    }

    // 获取快递公司列表
    static async getExpressCompanies(ctx) {
        let result = await base.getExpressCompanies(ctx, ctx.params);
        let list = pingyin.sortByFirstLetter(result.data.list, "shippingName")
        // console.log('resutl', list)
        ctx.body = {
            data: list
        }
    }

    // 保存售后物流
    static async savePostSaleLogis(ctx) {
        let result = await postSale.savePostSaleLogis(ctx, ctx.params).catch(err => {
            return {
                data: 500
            };
        });
        ctx.body = result.data
    }

    // 获取可申请售后数量
    static async getApplyNum(ctx) {
        let params = Object.assign(ctx.params, {
            ownCompanyId: ctx.params.companyId
        })
        let result = await postSale.getApplyNum(ctx, params);
        ctx.body = {
            applyNum: result.data,
            status: result.status
        }
    }
}
module.exports = postSaleController;
