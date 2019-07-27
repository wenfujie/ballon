export default [{
    path: '/member',
    name: 'member',
    redirect: '/member-center',
    component: () => import('@/pages/member/member'),
    /* meta: {
        title: '个人中心'
    }, */
    children: [{
        path: '/member-center',
        name: 'memberCenter',
        component: () => import('@/pages/member/member-center'),
        meta: {
            title: '个人中心'
        }
    }, {
        path: '/order-list',
        name: 'orderList',
        component: () => import('@/pages/member/order-list'),
        meta: {
            title: '我的订单'
        },

    }, {
        path: '/my-collection',
        name: 'my-collection',
        component: () => import('@/pages/collection/my-collection'),
        meta: {
            title: '我的收藏'
        }
    }, {
        path: '/band-account',
        name: 'band-account',
        component: () => import('@/pages/safeCollection/band-account'),
        meta: {
            title: '账号绑定'
        }
    }, {
        path: '/member-card',
        name: 'memberCard',
        component: () => import('@/pages/member/member-card'),
        meta: {
            title: '会员卡'
        }
    },
    {
        path: '/buy-card',
        name: 'buyCard',
        component: () => import('@/pages/member/buy-card'),
        meta: {
            title: '购卡中心'
        }
    },

    {
        path: '/amount-body',
        name: 'amountBody',
        component: () => import('@/pages/member/amount-body'),
        meta: {
            title: '我的量体'
        }
    }, {
        path: '/my-reserve',
        name: 'my-reserve',
        component: () => import('@/pages/member/myReserve'),
        meta: {
            title: '我的预约'
        }
    }, {
        path: '/vouchers-list',
        name: 'vouchers-list',
        component: () => import('@/pages/vouchers/vouchers-list'),
        meta: {
            title: '我的优惠券'
        }
    }, {
        path: '/member-info',
        name: 'memberInfo',
        component: () => import('@/pages/member/member-info'),
        meta: {
            title: '个人资料'
        }
    }, {
        path: '/order-detail',
        name: 'orderDetail',
        component: () => import('@/pages/member/order-detail'),
        meta: {
            title: '订单详情'
        }
    },
    {
        path: '/choice-dressed',
        name: 'choice-dressed',
        component: () => import('@/pages/choiceDressed/choiceDressed'),
        meta: {
            title: '选择着装人'
        }
    }, {
        path: '/invoice',
        name: 'invoice',
        component: () => import('@/pages/member/invoice'),
        meta: {
            title: '发票'
        }
    }, {
        path: '/address-list',
        name: 'address-list',
        component: () => import('@/pages/address/address-list'),
        meta: {
            title: '收货地址'
        }
    }, {
        path: '/safe-list',
        name: 'safe-list',
        component: () => import('@/pages/safeCollection/safe-list'),
        meta: {
            title: '安全管理'
        }
    }, {
        path: '/set-password',
        name: 'set-password',
        component: () => import('@/pages/safeCollection/set-password'),
        meta: {
            title: '密码修改'
        }
    }, {
        path: '/alter-phone',
        name: 'alter-phone',
        component: () => import('@/pages/safeCollection/alter-phone'),
        meta: {
            title: '修改手机号'
        }
    },
    {
        path: '/account-integrate',
        name: 'accountIntegrate',
        component: () => import('@/pages/safeCollection/account-integrate'),
        meta: {
            title: '账户整合'
        }
    },
    ]
}, {
    path: '/vouchers-center',
    name: 'vouchers-center',
    component: () => import('@/pages/vouchers/vouchers-center'),
    meta: {
        title: "优惠券中心"
    }
}

];
