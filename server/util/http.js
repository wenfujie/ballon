/*
 * createTime：2018-06-07
 * author：yongtian.hong
 * description: 封装四种HTTP请求类型
 * */
const axios = require('axios')
// const config = require('../config')
const TokenManager = require('./token-manager')
const moment = require('moment')

// 添加请求拦截器
axios.interceptors.request.use(function (request) {
    // 打印请求发出的时间、请求方式、请求地址、请求参数
    console.log("[" + moment().format('YYYY-MM-DD HH:mm:ss ms') + "][" + request.method.toUpperCase() + " request]" + request.url + ", 参数: " + JSON.stringify(request.params))
    return request;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

/**
 * 返回状态判断(添加响应拦截器)
 */
axios.interceptors.response.use((res) => {
    let resUrl = res.config.url
    let data = JSON.stringify(res.data)
    if (resUrl.indexOf('file/oss') !== -1) { // 过滤图片请求返回的参数
        data = ""
    }
    console.log("[" + moment().format('YYYY-MM-DD HH:mm:ss ms') + "][response]" + resUrl + ", 返回数据: " + data)
    return res
}, (err) => {
    console.error("koa-http-err", {
        errUrl: err.config.url,
        errParams: err.config.params || null,
        errData: err.config.data || null,
        errStatus: err.response.status,
        errMsg: err.response.data.message || err.response.status
    })
    err.response.data.statusCode = err.response.status
    err.response.data.errUrl = err.config.url
    err.response.data.errParams = err.config.params || null
    err.response.data.errData = err.config.data || null
    return err.response
})


class http {
    /*
     * 查询方法
     * options: 设置axios其他参数项
     * */
    static async get(serverUrl, params, options) {

        params = http.filter(params)

        let configObj = Object.assign(    // 合并参数对象和其他axios参数对象（例如headers、responseType）
            {
                params: params
            },
            // options,
            {
                headers: {
                    Authorization: this.headers.authorization,
                    ownCompanyId: this.headers.owncompanyid
                }
            }
        )
        return axios.get(serverUrl, configObj)
    }
    /*
     * 获取图片
     * options:
     * */
    static async getImg(serverUrl, params, options) {
        let token = await TokenManager.getToken()
        let configObj = Object.assign(    // 合并参数对象和其他axios参数对象（例如headers、responseType）
            {
                params: params
            },
            options,
            {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
        )
        return axios.get(serverUrl, configObj)
    }
    /*
     * 获取视频
     * options:
     * */
    static async getVideo(serverUrl, params, options) {
        let token = await TokenManager.getToken()
        let configObj = Object.assign(    // 合并参数对象和其他axios参数对象（例如headers、responseType）
            {
                params: params
            },
            // options,
            {
                headers: {
                    Authorization: 'Bearer ' + token,
                    ownCompanyId: options.owncompanyid,
                    Range: params.range,
                    contentType: "video/mp4;charset=UTF-8",
                    "Accept-Encoding": "xxx"
                }
            }
        )
        return axios.get(serverUrl, configObj)
    }
    /*
     * 新增方法(后台使用body接收参数)
     * */
    static async post(serverUrl, params, options) {

        console.log('post参数',JSON.stringify(params))

        // params = http.filter(params)

        let configObj = Object.assign(
            // options,
            {
                headers: {
                    Authorization: this.headers.authorization,
                    ownCompanyId: this.headers.owncompanyid
                }
            }
        )

        return axios.post(serverUrl, params, configObj).then((res) => {
            return res
        })

    }
    /*
     * 新增方法(用于文件上传)
     * */
    static async postUpload(serverUrl, params, options) {
        let token = TokenManager.getToken()
        let configObj = Object.assign({
            headers: {
                Authorization: 'Bearer ' + token,
                ownCompanyId: params.ownCompanyId
            }
        }, options)
        console.log('post-params', JSON.stringify(params))
        return axios.post(serverUrl, params, configObj).then((res) => {
            return res.data
        })
    }
    /*
     * (后台使用params接收参数)
     * */
    static async postUrl(serverUrl, params, options) {
        return axios.post(serverUrl, params, {
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            // options,
            headers: {
                Authorization: this.headers.authorization,
                ownCompanyId: this.headers.owncompanyid
            }
        }).then((res) => {
            return res
        })
    }
    /*
     *  修改方法(body传参)
     * */
    static async put(serverUrl, params, options) {

        // params = http.filter(params)

        console.log('put-params', JSON.stringify(params))

        return axios.put(serverUrl, params, {
            headers: {
                Authorization: this.headers.authorization,
                ownCompanyId: this.headers.owncompanyid
            }
        }).then((res) => {
            return res
        })
    }
    /*
     *  修改方法(params传参)
     * */
    static async putUrl(serverUrl, params, options) {
        return axios.put(serverUrl, params, {
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                Authorization: this.headers.authorization,
                ownCompanyId: this.headers.owncompanyid
            }
        }).then((res) => {
            return res
        })
    }
    /*
     * 删除方法
     * */
    static async delete(serverUrl, params, options) {

        params = http.filter(params)

        let configObj = Object.assign(
            {
                params: params
            },
            // options,
            {
                headers: {
                    Authorization: this.headers.authorization,
                    ownCompanyId: this.headers.owncompanyid
                }
            }
        )
        return axios.delete(serverUrl, configObj).then((res) => {
            return res
        })
    }

    static async all(...fn) {
        return axios.all(...fn)
    }

    /**
     * 数据过滤
     * @param config
     */
    static filter (data) {
        let _data = {}
        for (let i in data) {
            let val = data[i]

            //  过滤不传的字符串(暂时不对空字符串做处理)
            if (val === null || typeof val === 'undefined') {
                continue
            }

            //  字符串转时间处理
            // if (/\d{4}-\d{1,2}-\d{1,2} {1}\d{1,2}:\d{1,2}:\d{1,2}$/.test(val)) {
            //     val = DateUtil.toDate(val)
            // }
            //
            _data[i] = val
        }
        return _data
    }

}
module.exports = http
