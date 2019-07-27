/*
* createTime：2019/1/28
* author：fuejie.wen
* description: 订单模块路由
*/

export default [
    {
        path: '/order-settle',
        name: 'orderSettle',
        component: () => import ('@/pages/order/order-settle.vue'),
        meta: {
            title: '订单结算'
        }
    }
]

