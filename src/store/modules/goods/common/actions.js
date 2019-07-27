/*
* createTime：2019/5/21
* author：en.chen
* description:
*/

import http from "../../../../utils/http"
import {Goods, ShoppingCart, Order} from "../../../../api/service";
import Storage from "../../../../utils/storage";

export default {

    //  上下架
    async getGoodsSellState({}, params) {
        let data = {
            spPartGoodsSearchDtoList: params
        }
        return Goods.getGoodsSellState(data)
    },

    //  库存
    async getGroupGoodsStockCust({}, params) {
        return Goods.getGroupGoodsStockCust(params)
    },

    //  购买商品，生成订单中间表
    async buyGoods({ state,commit }) {
        let params = state.operationParams
        let vm = params.vm
        let data = Object.assign({
            ctmUsrId: Storage.get("USER_INFO").usrId,
            cookieId: Storage.get("USER_INFO").usrId,
            shopCode: Storage.get("properties").shopCode,
            usrKey: Storage.get("USER_INFO").usrId
        },params.orderData)
        Order.saveCartTemp(data).then((res) => {
            return Order.orderPreferCal({
                ordId: res
            }).then(() => {
                c_showLoading(false)
                commit('setData',{ storeKey: 'operationType', storeValue: null})
                commit('setData',{ storeKey: 'operationParams', storeValue: null})
                vm.$router.push("/order-settle?orderHdId=" + res);
            },() => {})
        }, (err) => {
            c_showLoading(false)
            vm.$message(err.errorMsg)
        });
    },

    //  保存购物车
    async saveCart({ state,commit }) {
        let params = state.operationParams
        let vm = params.vm
        let data = Object.assign({
            cookieId: Storage.get("USER_INFO").usrId,
            ctmUsrId: Storage.get("USER_INFO").usrId,
        },params.cartData)
        ShoppingCart.saveCart(data).then(() => {
            vm.$store.dispatch('user/updateShoppingCart')
            vm.$message('加入购物车成功~')
            commit('setData',{ storeKey: 'operationType', storeValue: null})
            commit('setData',{ storeKey: 'operationParams', storeValue: null})
            c_showLoading(false)
        })
    },

    // 立即购买/加入购物车前置判断（上下架、库存校验）
    async goodsHandle({state,dispatch}) {

        let params = state.operationParams

        let vm = params.vm
        c_showLoading()

        let res = await http.requestAll([

            // 上下架
            dispatch('getGoodsSellState', params.spPartGoodsSearchDtoList),
            // Goods.getGoodsSellState({
            //     spPartGoodsSearchDtoList: params.spPartGoodsSearchDtoList
            // }),

            //  库存
            dispatch('getGroupGoodsStockCust', params.inventoryJudgeDtos),
            // Goods.getGroupGoodsStockCust({
            //     shopId: Storage.get('properties').shopId,
            //     inventoryJudgeDtos: params.inventoryJudgeDtos
            // })
        ])

        let shelvesRes = res[0]
        let stockRes = res[1]

        if(JSON.stringify(res[0]).indexOf('errorMsg') !== -1) {
            vm.$message(res[0].errorMsg)
            c_showLoading(false)
            return
        }else if(JSON.stringify(res[1]).indexOf('errorMsg') !== -1) {
            vm.$message(res[1].errorMsg)
            c_showLoading(false)
            return
        }else{

            // 需求确认优先判断上下架，下架情况不提示库存是否足够
            if (!!shelvesRes[0].sellFlag && shelvesRes[0].sellFlag === 1 && shelvesRes[0].skuSellFlag === 1) {
                if (stockRes.enoughAll < 1) {
                    vm.$message('商品库存不足~')
                    c_showLoading(false)
                    return
                } else {
                    //  type为0代表保存购物车,为1代表购买
                    if(params.type === 1) {
                        dispatch('buyGoods')
                    }else if(params.type === 0){
                        dispatch('saveCart')
                    }
                }
            } else {
                vm.$message('商品已下架~')
                c_showLoading(false)
                return
            }
        }

    },

};
