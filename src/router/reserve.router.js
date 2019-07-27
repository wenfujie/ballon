export default [
    {
        path: '/my-reserve',
        name: 'my-reserve',
        component: () => import ('@/pages/reserve/myReserve'),
        meta: {
            title: '我的预约'
        }
    }
]