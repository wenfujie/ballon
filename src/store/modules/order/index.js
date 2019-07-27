/*
* createTime：2019/2/25
* author：en.chen
* description: 订单模块仓库
*/

import { Order } from "../../../api/service";
// import Storage from '../../../utils/storage'
// import detail from './detail'

export default {

    namespaced: true,

    state: {
        //  物流进度文案
        deliveryText: {
            // 门店自取
            mdzq: [
                {
                    name: "下单",
                    time: ""
                },
                {
                    name: "支付",
                    time: " "
                },
                // {
                //     name: "备货中",
                //     time: ""
                // },
                // {
                //     name: "备货完成",
                //     time: ""
                // },
                {
                    name: "备货",
                    time: ""
                },
                {
                    name: "签收",
                    time: ""
                }
                ],

            // 快递配送
            kdps: [
                {
                    name: "下单",
                    time: ""
                },
                {
                    name: "支付",
                    time: ""
                },
                {
                    name: "发货",
                    time: ""
                },
                // {
                //     name: "发货",
                //     time: ""
                // },
                {
                    name: "签收",
                    time: ""
                }
            ]
        },

        // 不同订单状态对应数量
        orderCount: {
            unPayOrderNum: null,  // 待支付
            unShippingOrderNum: null,  // 待发货
            unReceivingGoodsOrderNum: null,  // 待收货
            unEvaluateOrderNum: null,  // 待评价
        }
    },

    getters: {
        getdeliveryText(state,data) {
            return state.deliveryText[data.type]
        },
    },

    actions: {
        // 获取不同状态订单对应的数量
        async getOrderNum({commit, state}){
            let params = {}
            let res = await Order.getOrderNum(params)
            let data = {
                storeKey: 'shoppingCartNum',
                storeValue: res
            }
            commit("setData", data)
            return state.orderCount
        },
    },

    mutations: {
        //  设置数据
        setData(state,data) {
            state[data.storeKey] = data.storeValue
        },
    },

    modules:{
        // detail
    }
};
