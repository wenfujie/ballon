/*
* createTime：2019/4/16
* author：en.chen
* description: 商品模块状态管理
*/

import goodsList from "./list";
import common from "./common";

export default {
    namespaced: true,
    state: Object.assign(goodsList.state,common.state),
    mutations: Object.assign(goodsList.mutations,common.mutations),
    actions: Object.assign(goodsList.actions,common.actions),
    getters: Object.assign(goodsList.getters,common.getters)
}
