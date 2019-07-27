/*
* createTime：2019/2/18
* author：en.chen
* description: 常规页面
*/

export default [
    {
        path: '*',
        name: 'NotFound',
        component: () => import ('@/pages/common/page-404'),
        meta: {
            title: '啊咧，该页面不存在'
        }
    },
    {
        path: '/off-shelves',
        name: 'OffShelves',
        component: () => import ('@/pages/common/page-offshelves'),
        meta: {
            title: '商品未上架'
        }
    }
]
