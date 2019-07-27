/*
 * createTime：2019/1/28
 * author：fujie.wen
 * description: 中间层基础模块整合
 */

const base = require('../../model/base');

class baseController {

    // 获取地区信息
    static async getDestnation(ctx) {
        //  优先获取省、市、区对应的编码
        let arr = ['D_DISTRICTPRO','D_DISTRICTCITY','D_DISTRICTCTY']
        let data = {
            codes: arr.join(','),
            ownCompanyId: ctx.params.ownCompanyId
        }
        let cityData = await base.getDestTypeId(ctx, data)
        let res = await base.getDestnationValue(ctx, ctx.params);
        let response = {}
        response.list = res.data
        response.code = cityData.data
        ctx.body = response;
    }

    // 门店列表
    static async getShopList(ctx) {
        let res = await base.getShopListValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取第三方登录方式列表
    static async getThirdLoginList(ctx) {
        let res = await base.getThirdLoginListValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取支付方式列表
    static async getPayList(ctx) {
        let res = await base.getPayListValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 根据用户id查询用户是否创建登录密码
    static async getVipHasPsw(ctx) {
        let res = await base.getVipHasPswValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 更新账号的的用户登录名称以及密码
    static async updateUserInfo(ctx) {
        let res = await base.updateUserInfoValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取常数值
    static async getContent(ctx) {
        let res = await base.getContentValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取购物平台设置
    static async getPlamset(ctx) {
        let res = await base.getPlamsetValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取二级域名解析
    static async getCompanyQuery(ctx) {
        let res = await base.getCompanyQueryValue(ctx, ctx.params);
        ctx.body = res.data;
    }

}

module.exports = baseController;
