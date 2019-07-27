//  全局依赖注入

import Vue from 'vue'
import Router from 'vue-router'
import MetaInfo from 'vue-meta-info'

import store from '@/store/index'

//  路由模块注入

import common from '@/router/common.router'    //  通用模块

import cart from '@/router/cart.router'    //  购物车模块

import goods from '@/router/goods.router'    //  商品模块

import order from '@/router/order.router'    //  订单模块

import login from '@/router/login.router'

import member from '@/router/member.router'    //  模块

import pay from '@/router/pay.router'    //  身材数据模块

//  挂载依赖组件
Vue.use(Router)
Vue.use(MetaInfo)

const router = new Router({
    mode: 'history',
    // base: baseConstant.pathProjectName,
    routes: [
        {   // 因为预渲染的原因不使用重定向
            path: '/',
            /* name: 'index',
            meta:{
                title: '首页',
                keepAlive: true
            },
            component: () => import ('@/pages/index/index') */
            redirect: {
                name: 'index'
            }
        },
        {
            path: '/index',
            name: 'index',
            meta:{
                title: '首页'
            },
            component: () => import ('@/pages/index/index')
        },
        //  购物车模块
        ...cart,
        ...member,
        //  商品模块
        ...goods,
        //  订单模块
        ...order,
        ...pay,
        ...common,
        ...login
    ]
})

/**
 * 路由拦截器
 * @param to 路由to参数
 * @param next 路由next参数
 * @returns {boolean}  true:不拦截；false:路由被拦截; string:不拦截，根据该string跳转
 */
let routerIntercept = function  (to,next) {
    let userInfo = Storage.get('USER_INFO');
    // 无需用户信息页
    let unLimitPages = ['/index','/goods-detail','/goods-design','/goods-list','/login','/find-password','/register'];

    // 处理local缓存和vuex用户信息不同步
    if(!store.state.user.userInfo && userInfo){
        store.dispatch('user/updateUserInfo')
        store.dispatch('user/updateShoppingCart')
    }
    if(store.state.user.userInfo && !userInfo){
        store.commit('user/setData',{storeKey: 'userInfo',storeValue: null});
        store.commit('user/setData',{storeKey: 'shoppingCartNum',storeValue: null});
    }

    // 是无需授权页
    if(unLimitPages.indexOf(to.path) !== -1){
        // 登录后 登录页拦截到首页
        if(to.path === '/login' && userInfo){
            next('/index');
            return;
        }
        next();
    }else{// 需要授权页
        if(userInfo && userInfo.usrId){
            next();
        }else{
            next(`/login?successUrl=${encodeURIComponent(to.fullPath)}`);
            // store.commit('user/setData',{storeKey: 'loginDialogFlag', storeValue: true});
            return;
        }
    }
}

router.beforeEach((to, form, next) => { /* 监听路由变化 */
    routerIntercept(to,next);
})

router.afterEach((to, from) => {
    window.scroll(0,0)
    if (to.meta.title) {
        document.title = to.meta.title
    }
})

export default router
