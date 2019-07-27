/**
 *  本地缓存
 * Created by en.chen on 2018-05-22.
 */
import Store from '@/store/index'
var STORAGE_EXPIRE_MAP = 'STORAGE_EXPIRE_MAP'
// const storage = (process.env.NODE_ENV == "development" ? localStorage : localStorage)
const storage = window.localStorage;

var Storage = {
    /**
     * 获取缓存
     * @param key 键名
     * @returns {Object}
     */
    get: function (key) {
        let value = JSON.parse(storage.getItem(key))

        // 用户信息local无则从session获取
        if(!value && key === 'USER_INFO' && !storage.getItem('logOut')){
            value = sStorage.get(key)
            this.set(key, value,3600)
        }
        try {
            return value
        } catch (e) {
            return null
        }
    },
    /**
     * 设置缓存
     * @param key 键名
     * @param object 键值
     * @param expire 有效时长（秒）
     */
    set: function (key, object, expire) {
        if (object !== null && object !== undefined) {
            let value = object
            if (typeof value !== 'string') {
                try {
                    value = JSON.stringify(object)
                } catch (e) {
                    value = null
                }
            }
            if (value !== null) {
                storage.setItem(key, value)
                // 用户信息local无则从session获取
                if(key === 'USER_INFO'){
                    storage.removeItem('logOut')
                    sStorage.set(key, value, expire)
                }
                if (expire && expire > 0) {
                    let expireAt = new Date().getTime() + expire * 1000
                    addExpire(key, expireAt)
                }
            }
        }
    },
    /**
     * 移除
     * @param key
     */
    remove: function (key) {
        try {
            storage.removeItem(key)
        } catch (e) {
            throw new Error(e.message)
        }
    },
    /**
     * 清理
     */
    clear: function () {
        storage.clear()
    }
}

/**
 * 设置过期
 * @param key
 * @param expireAt
 */
function addExpire (key, expireAt) {
    var map = Storage.get(STORAGE_EXPIRE_MAP) || {}
    map[key] = expireAt
    Storage.set(STORAGE_EXPIRE_MAP, map)
}

/**
 * 清理过期
 */
async function clearExpire () {
    var map = Storage.get(STORAGE_EXPIRE_MAP) || {}
    var now = new Date().getTime()
    let removedKeys = [];// 记录被删key
    for (let key in map) {
        if (map[key] * 1 < now) {
            removedKeys.push(key);
            Storage.remove(key)
            delete map[key]
        }
    }
    Storage.set(STORAGE_EXPIRE_MAP, map)
    return removedKeys;
}

/**
 * 过期轮询(每10分钟轮询一次)
 */
setInterval(function () {
    clearExpire().then(removedKeys=>{
        afterClear(removedKeys);
    })
}, 600000)

// 初始化 清理过期缓存
clearExpire().then(removedKeys=>{
    afterClear(removedKeys);
})

// 清理过期缓存后操作
function afterClear(keys){
    if(keys.indexOf('USER_INFO') !== -1){
        Store.commit('user/setData',{storeKey: 'userInfo',storeValue: null});
        Store.commit('user/setData',{storeKey: 'shoppingCartNum',storeValue: null});
    }
}

export default Storage
