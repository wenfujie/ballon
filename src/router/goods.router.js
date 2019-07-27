/*
 * createTime：2019/1/23
 * author：en.chen
 * description: 商品模块路由
 */

export default [{
        path: '/goods-list',
        name: 'goodsList',
        component: () => import('@/pages/goods/goods-list'),
        meta: {
            title: '商品列表',
        }
    },
    {
        path: '/goods-detail',
        name: 'goodsDetail',
        component: () => import('@/pages/goods/goods-detail'),
        meta: {
            title: '商品详情'
        }
    },
    {
        path: '/goods-design',
        name: 'goodsDesign',
        component: () => import('@/pages/goods/goods-design'),
        meta: {
            title: '3D定制'
        }
    }
]