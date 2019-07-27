/*
 * createTime: 2019/7/9 9:39
 * author: en.chen
 * description: 中间层收藏模块整合
 */

const collect = require('../model/collect');

class collectController {

    // 加入收藏
    static async addCollection(ctx) {
        let res = await collect.addCollectionValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 批量加入收藏
    static async batchCollection(ctx) {
        let res = await collect.batchCollectionValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 取消收藏
    static async deleteCollection(ctx) {
        let res = await collect.deleteCollectionValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 收藏模块加入收藏功能(组合商品)
    static async addCollectionComb(ctx) {
        let res = await collect.addCollectionCombValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 收藏模块查询收藏商品列表
    static async getCollectionList(ctx) {
        let res = await collect.getCollectionListValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 收藏模块查询收藏商品列表
    static async deleteCollectionComb(ctx) {
        let res = await collect.deleteCollectionCombValue(ctx, ctx.params);
        ctx.body = res.data;
    }
}

module.exports = collectController;
