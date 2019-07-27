/*
 * createTime：2019/2/21
 * author：en.chen
 * description: 数据仓库
 */

import Vue from "vue";
import Vuex from "vuex";

require('babel-polyfill')

// 数据持久化
// import createPersistedState from "vuex-persistedstate";

//  用户信息
import user from "./modules/user/index";

//  订单信息
import order from "./modules/order/index";

//  用户信息
import dressed from "./modules/order/dressed";

//  商品信息
import goods from "./modules/goods/index";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        order,
        dressed,
        goods
    },
    plugins: [
        // createPersistedState({
        //     key: "Store",
        //     storage: window.sessionStorage,
        //     reducer(val) {
        //         return {
        //             // 用于存储state中特定的数据
        //             userInfo: val.user.userInfo
        //         }
        //     }
        // })
    ]
});
