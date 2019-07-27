/**
 *  本地缓存
 * Created by en.chen on 2018-05-22.
 */
import Store from '@/store/index'
var STORAGE_EXPIRE_MAP = 'STORAGE_EXPIRE_MAP'
// const storage = (process.env.NODE_ENV == "development" ? localStorage : localStorage)

class Storage {

    constructor (store){
        this.storage = store || window.localStorage;
        loop (this);
    }
    /**
     * 获取缓存
     * @param key 键名
     * @returns {Object}
     */
    get (key) {
        let value = this.storage.getItem(key)
        try {
            return JSON.parse(value)
        } catch (e) {
            return null
        }
    }
    /**
     * 设置缓存
     * @param key 键名
     * @param object 键值
     * @param expire 有效时长（秒）
     */
    set(key, object, expire) {
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
                this.storage.setItem(key, value)
                if (expire && expire > 0) {
                    let expireAt = new Date().getTime() + expire * 1000
                    addExpire(key, expireAt, this)
                }
            }
        }
    }
    /**
     * 移除
     * @param key
     */
    remove (key) {
        try {
            this.storage.removeItem(key)
        } catch (e) {
            throw new Error(e.message)
        }
    }
    /**
     * 清理
     */
    clear () {
        this.storage.clear()
    }

}

/**
 * 设置过期
 * @param key
 * @param expireAt
 */
function addExpire (key, expireAt, store) {
    var map = store.get(STORAGE_EXPIRE_MAP) || {}
    map[key] = expireAt
    store.set(STORAGE_EXPIRE_MAP, map)
}

/**
 * 清理过期
 */
async function clearExpire (store) {
    var map = store.get(STORAGE_EXPIRE_MAP) || {}
    var now = new Date().getTime()
    let removedKeys = [];// 记录被删key
    for (let key in map) {
        if (map[key] * 1 < now) {
            removedKeys.push(key);
            store.remove(key)
            delete map[key]
        }
    }
    store.set(STORAGE_EXPIRE_MAP, map)
    return removedKeys;
}

/**
 * 过期轮询(每10分钟轮询一次)
 */

function loop (store) {
    let func = ()=>{
        clearExpire(store).then(removedKeys=>{
            if(removedKeys.indexOf('USER_INFO') !== -1){
                Store.commit('user/setData',{storeKey: 'userInfo',storeValue: null});
                Store.commit('user/setData',{storeKey: 'shoppingCartNum',storeValue: null});
            }
        })
    }

    // 清除过期缓存
    func();
    setInterval(function () {
        func();
    }, 600000)
}


// 初始化 清理过期缓存
// clearExpire().then(removedKeys=>{
//     afterClear(removedKeys);
// })

// 清理过期缓存后操作
// function afterClear(keys){
//     if(keys.indexOf('USER_INFO') !== -1){
//         Store.commit('user/setData',{storeKey: 'userInfo',storeValue: null});
//         Store.commit('user/setData',{storeKey: 'shoppingCartNum',storeValue: null});
//     }
// }

export default Storage
