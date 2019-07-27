/*
* createTime：2019/1/16
* author：en.chen
* description: 购物车路由
*/

export default [
    {
        path: '/shopping-cart',
        name: 'shoppingCart',
        component: () => import ('@/pages/cart/shopping-cart'),
        meta: {
            title: '我的购物车'
        }
    }
]