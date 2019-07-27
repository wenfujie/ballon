/*
* createTime：2018/7/16
* author：en.chen
* description: 中间层提供给前端的购物车模块api
*/
const shoppingCartModule = require('../controller/shoppingCart')
//  批量转移购物车
// const cartTransfer = require('../controller/shopping-cart/transfer')
//
// //  删除购物车
// const deleteCart = require('../controller/shopping-cart/delete')
//
// //  保存购物车列表
// const saveCart = require('../controller/shopping-cart/save')
//
// //  获取购物车列表
// const getCartList = require('../controller/shopping-cart/get-list')
//
// //  获取购物车数量
// const getCartCount = require('../controller/shopping-cart/count')

module.exports = {
    // "PUT/transfer": cartTransfer,
    "DELETE/deleteCart": shoppingCartModule.deleteCart,// 删除购物车
    "POST/saveCart": shoppingCartModule.saveCart,// 保存购物车列表
    "GET/cartList": shoppingCartModule.getCartList,// 获取购物车列表
    "PUT/saveCartNum": shoppingCartModule.saveCartNum,// 保存购物车数量
    "GET/cartCount": shoppingCartModule.getCartCount,  // 查询购物车数量
}
