/*
* createTime：2019/4/16
* author：en.chen
* description:  商品墙仓库
*/

import state from "./state";
import mutations from "./mutations";
import actions from "./actions";
import getter from "./getter";

export default {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions,
    getters: getter
};
