/*
* createTime：2019/2/18
* author：fujie.wen
* description: 登录模块
*/

export default [
    {
        path: '/login',
        name: 'login',
        component: () => import ('@/pages/login/login'),
        meta: {
            title: '登录'
        }
    },{
        path: '/register',
        name: 'register',
        component: () => import ('@/pages/login/register'),
        meta: {
            title: '注册'
        }
    },{
        path: '/find-password',
        name: 'findPassword',
        component: () => import ('@/pages/login/find-password'),
        meta: {
            title: '找回密码'
        }
    },
]