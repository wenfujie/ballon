/*
* createTime：2019/4/16
* author：en.chen
* description: 
*/

export default {
    //  设置商品颜色图缓存数据
    setCrumbsCache(state, params) {
        state.crumbs = params
    },
    //  设置商品颜色图缓存数据
    setCoverCache(state, params) {
        state.coverCache[params.id] = params.list
    },
};