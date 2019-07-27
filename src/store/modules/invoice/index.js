/*
* createTime：2019/4/11
* author：en.chen
* description:  发票状态管理
*/

// import Storage from '../../../utils/storage'

export default {

    namespaced: true,

    state: {
        // 发票申请节点
        invoiceInfo: {
            'D_INV_ORDSAVE': { name: '订单结算', code: 'D_INV_ORDSAVE', seq: 1},
            'D_INV_ORDPAY': { name: '订单支付', code: 'D_INV_ORDPAY', seq: 2},
            'D_INV_SHIP': { name: '订单发货', code: 'D_INV_SHIP', seq: 3},
            'D_INV_CONF': { name: '确认收货', code: 'D_INV_CONF', seq: 4},
            'D_INV_COMENT': { name: '评价后', code: 'D_INV_ORDSAVE', seq: 5},
            'D_INV_REFULE': { name: '不允许申请', code: 'D_INV_ORDSAVE', seq: 6},
        },
    },

    getters: {},

    actions: {},

    mutations: {
        //  设置数据
        setData(state,data) {
            state[data.storeKey] = data.storeValue
        },
    }
};