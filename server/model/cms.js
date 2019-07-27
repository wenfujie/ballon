/*
 * createTime：2018/7/5
 * author：en.chen
 * description: 内容管理模块用于处理前端请求的中间层接口
 */
const fs = require('fs')
const path = require('path')
class cms {
    //  获取默认模板
    static async getCmsTemplateValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas +  '/cms-template-hds', params, ctx.headers).then((res) => {
            return res
        })
    }

    //  获取千人千面模板
    static async getUsrCmsTemplateValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + '/cms-backpage-dt-viptags', params, ctx.headers).then((res) => {
            return res
        })
    }

    //  获取模板内容v2（性能调优标识）
    static async getCmsInfoV2Value(ctx, params) {
        let url = '/cms-template-hds/cms-template-code/' + params.cmsTemplateCode
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.issBas + ctx.optimizeFlag + url, params, ctx.headers).then((res) => {
            return res
        })
    }

    //  获取面包屑
    static async getCrumbsValue(ctx, params) {
        // let lyj = 'http://1.1.6.162:8803'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + '/cms-crumbs', params, ctx.headers).then((res) => {
            return res
        })
    }

    //  获取面包屑子内容（性能调优标识）
    static async getCrumbsDetailValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.issBas + ctx.optimizeFlag + '/cms-crumbs/navigation', params,ctx.headers).then((res) => {
            return res
        })
    }

    //  获取模板导航内容
    static async getNavigationValue(ctx, params) {
        let url = '/iss/bas/cms-navigat-hds/template-navigations/'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.baseService + url, params, ctx.headers).then((res) => {
            return res
        })
    }

    //  获取模板页面模块元素商品列表(现购)
    static async getGoodsListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + '/web-item-goodss/item-goods-batch', params).then((res) => {
            return res
        })
    }

    //  获取模板页面模块元素商品列表(现购列表)
    static async getGoodsItemListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + '/web-item-goodss/item-goods-list', params, ctx.headers).then((res) => {
            return res
        })
    }

    //  获取wxUnionId、firameUrl、companyId
    static async getProperties(ctx, params) {
        let data = fs.readFileSync(path.join(__dirname, '..') + '/properties/constant.json', 'utf8')
        let constData = JSON.parse(data)

        console.log('项目运行环境',process.env)
        let properties = constData.prod

        const env = process.env.NODE_ENV

        if(!!env) {
            console.log('env',env)
            properties = constData[env]
        }else{
            if(ctx.baseUrl.indexOf('dev') != -1){
                properties = constData.dev
            }else if(ctx.baseUrl.indexOf('test') != -1){
                properties = constData.test
            }
        }

        console.log('返回给前端的配置内容',properties)

        return properties
    }
}

module.exports = cms
