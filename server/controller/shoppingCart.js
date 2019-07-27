/*
* createTime：2019/1/24
* author：fujie.wen
* description: 中间层购物车模块整合
*/

const shoppingCart = require('../model/shopping-cart');

class shoppingCartController {

    // 删除购物车
    static async deleteCart (ctx) {
        let res = await shoppingCart.deleteCartValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 保存购物车列表
    static async saveCart (ctx) {
        let res = await shoppingCart.saveCartValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 查询购物车列表
    static async getCartList (ctx) {
        let res = await shoppingCart.getCartListValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 保存购物车数量
    static async saveCartNum (ctx) {
        let res = await shoppingCart.saveCartNumValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取购物车数量
    static async getCartCount(ctx) {
        let res = await shoppingCart.getCartCountValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 批量转移本地购物车
    static async cartTransfer(ctx) {
        let res = await shoppingCart.transferValue(ctx, ctx.params);
        ctx.body = res.data;
    }
}

module.exports = shoppingCartController;
