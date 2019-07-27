/*
* createTime：2019/2/14
* author：fujie.wen
* description: 支付路由
*/

export default [
    {
        path: '/pay-mode',
        name: 'payMode',
        component: () => import ('@/pages/pay/pay-mode'),
        meta: {
            title: '支付方式'
        }
    },{
        path: '/pay-wx',
        name: 'payWx',
        component: () => import ('@/pages/pay/pay-wx'),
        meta: {
            title: '微信支付'
        }
    },{
        path: '/pay-state',
        name: 'payState',
        component: () => import ('@/pages/pay/pay-state'),
        meta: {
            title: '支付状态'
        }
    }

]