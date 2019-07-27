/*
 * createTime：2018/10/16
 * author：en.chen
 * description: 发票功能api
 */

const invoice = require('../model/invoice');

class invoiceController {

    // 提交发票
    static async putInvoice(ctx) {
        let res = await invoice.putInvoice(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取发票类型
    static async getInvoiceInfo(ctx) {
        let res = await invoice.getInvoiceInfo(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取发票设置
    static async canSetInvoice(ctx) {
        let res = await invoice.canSetInvoice(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取发票详情
    static async getDetail(ctx) {
        let res = await invoice.getDetail(ctx, ctx.params);
        ctx.body = res.data
    }

    // 取消发票
    static async cancelInvoice(ctx) {
        let res = await invoice.cancelInvoice(ctx, ctx.params);
        ctx.body = res
    }

    // 获取个人发票列表
    static async getList(ctx) {
        let res = await invoice.getList(ctx, ctx.params);
        if(!!res.data.list.length && res.data.list.length >0) {
            res.data.list.forEach((item) => {
                //  普通发票添加物流信息
                if(item.typeCode === 'D_INVOICE_COMMON') {
                    item.showLogistics = false  //  是否显示物流变量，和产品沟通按需加载，默认为false
                    item.logisticsList = []  //  初始化物流信息列表
                }
            })
        }
        ctx.body = res.data
    }
}

module.exports = invoiceController;
