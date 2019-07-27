/*
 * createTime：2019/2/21
 * author：en.chen
 * description:  用户信息仓库
 */

import {
    UserService,
    ShoppingCart
} from "../../../api/service";
import Storage from '../../../utils/storage'

export default {

    namespaced: true,

    state: {
        userInfo: null, // 用户信息
        shoppingCartNum: null, // 用户购物车商品数量
        loginDialogFlag: false, // 控制app.vue中登录弹窗显示
        mergeDialogFlag: false, // 控制app.vue中会员整合弹窗显示
    },

    actions: {

        //  获取用户信息
        async getUserInfo({
            commit,
            state
        }) {
            if (state.userInfo) {
                return state.userInfo
            } else {
                if (!Storage.get('USER_INFO')) return
                let res = await UserService.getUserInfo()
                let data = {
                    storeKey: 'userInfo',
                    storeValue: res
                }
                Storage.set("CARDNO", {
                    cardNo: res.cardNo
                });
                commit("setData", data)
                return res;
            }
        },

        //  更新用户信息
        async updateUserInfo({
            commit
        }) {
            let res = await UserService.getUserInfo()
            let data = {
                storeKey: 'userInfo',
                storeValue: res
            }
            commit("setData", data)
        },

        //  获取购物车数量信息
        async getShoppingCart({
            commit,
            state
        }) {
            if (state.shoppingCartNum) {
                return state.shoppingCartNum
            } else {
                if (Storage.get('USER_INFO')) {
                    let res = await ShoppingCart.getCartCount({})
                    let data = {
                        storeKey: 'shoppingCartNum',
                        storeValue: res
                    }
                    commit("setData", data)
                    return res;
                } else {
                    return state.shoppingCartNum
                }
            }
        },

        //  更新购物车数量信息
        async updateShoppingCart({
            commit
        }) {
            let res = await ShoppingCart.getCartCount({})
            let data = {
                storeKey: 'shoppingCartNum',
                storeValue: res
            }
            commit("setData", data)
        }
    },

    mutations: {
        //  设置数据
        setData(state, data) {
            state[data.storeKey] = data.storeValue
        },
        //  退出登陆
        logout(state) {
            state.userInfo = null
            state.shoppingCartNum = null
            Storage.remove('USER_INFO')
            Storage.remove('POSITION')
            Storage.remove("CARDNO");
        }
    }
};
