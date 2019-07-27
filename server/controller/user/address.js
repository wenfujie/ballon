/*
 * createTime：2018/7/25
 * author：en.chen
 * description:  会员模块-地址增删改查功能api
 */

const userAddr = require('../../model/user-address');

class userAddrController {

    // 获取地址列表
    static async getAddrList(ctx) {
        let res = await userAddr.getAddrListValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 新增/修改用户地址
    static async changeAddrInfo(ctx) {
        let res = await userAddr.changeAddrValue(ctx, ctx.params);
        ctx.body = res
    }

    // 删除地址列表
    static async deleteAddrList(ctx) {
        let res = await userAddr.deleteAddrListValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取地址详情
    static async addrDetail(ctx) {
        let res = await userAddr.addressDetailValue(ctx, ctx.params);
        ctx.body = res.data
    }
}

module.exports = userAddrController;
