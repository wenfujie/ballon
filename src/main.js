import Vue from 'vue'
import App from './App.vue'
import store from './store'
import i18n from './i18n/i18n'
import VueLazyload from 'vue-lazyload'  //  图片懒加载
import router from './router/index.router'
import './utils/common' // 全局参数
import './utils/elementUi'
import './utils/globalFun' // 全局函数
import Storage from './utils/storage'  // 浏览器本地缓存
import './utils/commonVueFilter'
import 'babel-polyfill'
import http from './utils/http'

Vue.use(VueLazyload, {
    preLoad: 1.1,  // 预加载高度比例
    error: require('./assets/images/common/error.png'),  // 图片路径错误时加载图片
    loading: require('./assets/images/common/loading.png'),  // 预加载图片
    attempt: 2 // 尝试计数
})

Vue.config.productionTip = false
Vue.prototype.Storage = Storage
Vue.prototype.getImg = global.getImg
Vue.prototype.errImg = global.errImg
Vue.prototype.getVideo = global.getVideo
Vue.prototype.formatTime = global.formatTime
Vue.prototype.$all = http.requestAll

new Vue({
    router,
    i18n,
    store,
    render: h => h(App),
    mounted() {
        document.dispatchEvent(new Event('render-event'))
    }
}).$mount('#app')
