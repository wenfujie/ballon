/*
 * createTime：2018/7/2
 * author：en.chen
 * description: 基础模块用于处理前端请求的中间层接口
 */
class base {
    //  获取常数值
    static async getContentValue(ctx) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.systemService + '/constants',{},ctx.headers).then((res) => {
            return res
        })
    }

    //  获取门店列表
    static async getShopListValue(ctx, params) {
        let url = '/cud-dpts/dest-code/' + params.code
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params, ctx.headers).then((res) => {
            return res
        })
    }

    //  获取第三方登录方式列表
    static async getThirdLoginListValue(ctx, params) {
        let url = '/signup-hd/list-buscont'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.systemService + url, params, ctx.headers).then((res) => {
            return res
        })
    }

    //  获取支付方式列表
    static async getPayListValue(ctx, params) {
        let url = '/cud-dpt-dt-payments/map-info/' + params.dptId;
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params, ctx.headers).then((res) => {
            return res
        })
    }

    //  根据用户id查询用户是否创建登录密码
    static async getVipHasPswValue(ctx, params) {
        let url = '/usr-pwds/' + params.usrId;
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params, ctx.headers).then((res) => {
            return res
        })
    }

    //  更新账号的的用户登录名称以及密码
    static async updateUserInfoValue(ctx, params) {
        let url = '/per-usrs/update-login-name';
        return ctx.$putUrl(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params, ctx.headers).then((res) => {
            return res
        })
    }

    //  获取省市区对应的destTypeId
    static async getDestTypeId(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.systemService + '/dict-ids/get-ids-by-codes', params,ctx.headers).then((res) => {
            return res
        })
    }

    //  获取地区信息
    static async getDestnationValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + '/destinations', params,ctx.headers).then((res) => {
            return res
        })
    }

    //  购物平台设置
    static async getPlamsetValue(ctx) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.systemService + '/glb-sp-cfgbasics/logo-url').then((res) => {
            return res
        })
    }

    // 二级域名解析
    static async getCompanyQueryValue(ctx, params) {
        params.ownCompanyId = 1
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.systemService + '/glb-domains', params).then((res) => {
            return res
        })
    }

    // 获取快递公司列表
    static async getExpressCompanies(ctx, params) {
        let url = '/trm-shippings?usrId=' + params.usrId + "&pageNum=" + params.pageNum + "&pageSize=" + params.pageSize + "+&companyId=" + params.companyId;
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.systemService + url, params)
    }

}

module.exports = base