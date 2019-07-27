/*
 * createTime：2018/7/14
 * author：en.chen
 * description: 商品模块用于处理前端请求的中间层接口
 */

class goods {

    //  获取面包屑查询条件ids的前置接口
    static async getCrumbsGoodsIds(ctx, params) {
        // let lyj = 'http://1.1.6.162:8806'
        params.orderFlags = JSON.parse(params.orderFlags)
        if (!params.platformCode) params.platformCode = ""
        let url = '/sp-goods-list/part-class-ids?busContsCode=' + params.busContsCode + '&companyId=' + params.companyId + '&queryNullBusFlag=1&shopId=' + params.shopId + '&platformCode=' + params.platformCode
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params, ctx.headers).then((res) => {
            return res.data
        });
    }

    //  商品墙/商品列表(原金毅接口,金峰修改,原url地址为/sp-goods-list)(金毅再次修改，新增orderFlags传参，接口宣布封版)
    static async getGoodsListValue(ctx, params) {
        params.orderFlags = JSON.parse(params.orderFlags)
        if (!params.platformCode) params.platformCode = ""
        let url = '/sp-goods-list/combgood_goods2?busContsCode=' + params.busContsCode + '&companyId=' + params.companyId + '&queryNullBusFlag=1&shopId=' + params.shopId + '&platformCode=' + params.platformCode
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params, ctx.headers).then((res) => {
            return res.data
        });
    }

    //  商品墙/商品列表 过滤掉orderFlag=1的大件商品
    static async getFilterGoodsListValue(ctx, params) {
        let url = '/sp-goods-list/combgood_goods?busContsCode=' + params.busContsCode + '&platformCode=' + params.platformCode + '&companyId=' + params.companyId + '&queryNullBusFlag=1&shopId=' + params.shopId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  热门商品列表
    static async getHotGoodsValue(ctx, params) {
        let url = '/iss/bas/cms-searchword-hds?companyId=' + params.companyId
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.baseService + url, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  获取绣字颜色、字体列表(性能调优标识)
    static async getEmbFontColorListValue(ctx, params) {
        let url = '/ict-emb-hds-aggregate/fonnts-and-colors'
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.goodsService + ctx.optimizeFlag + url, params).then((res) => {
            return res
        });
    }

    //  获取商品可绣花、绣字部位
    static async getUseablePartValue(ctx, params) {
        let url = '/part-reg-ass-fabs/mtl-area'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params).then((res) => {
            return res
        });
    }

    //  获取推荐商品(性能调优标识)
    static async getPutGoodsValue(ctx, params) {
        let url = '/sp-goods/what-you-want'
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  查询单品推荐套餐
    static async getRecommendPackagesValue(ctx, params) {
        let url = '/pti-combpart-rela-dtts/show-list'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params).then((res) => {
            return res
        });
    }

    //  获取购买可选套餐
    static async getBuyablePackagesValue(ctx, params) {
        let url = '/pti-combpart-rela-dts/eff-list'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params).then((res) => {
            return res
        });
    }

    //  查询平台商品的推荐商品列表
    static async getGoodsRecommendValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-goods/goods-recommend', params).then((res) => {
            return res
        });
    }

    //  查询商品详情
    static async getGoodsInfoValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + '/sp-part-goodss', params, ctx.headers).then((res) => {
            return res
        });
    }

    //  查询组合商品详情
    static async getCombGoodsInfoValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-combgood-goodss/comb-code', params).then((res) => {
            return res
        });
    }

    //  查询商品详情(定制)
    static async getGoodsInfoCusValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.goodsService + ctx.optimizeFlag + '/part-hd-aggregates/good-info', params).then((res) => {
            return res
        });
    }

    //  获取绣花图片列表
    static async getEmbPicListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-goods/part-emb-prints', params).then((res) => {
            return res
        });
    }

    //  查询商品详情（组合2D展示）
    static async getGroupGoodsInfoCusValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.goodsService + ctx.optimizeFlag + '/pti-combgood-hd-aggregates/combgood-info', params).then((res) => {
            return res
        });
    }

    //  查询商品详情目录列表
    static async getGoodsTitleValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-part-goods-descs', params, ctx.headers).then((res) => {
            return res
        });
    }

    //  获取商品分类
    static async getGoodsClassValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + '/part-class/simple-list', params, ctx.headers).then((res) => {
            return res
        });
    }

    //  获取商品sku属性
    static async getGoodsSkuValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-part-goodss/goods-sku-infos/skus', params).then((res) => {
            return res
        });
    }

    //  获取平台运营分类列表
    static async getPlatformListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + '/cms-busconcla-hds', params, ctx.headers).then((res) => {
            return res
        });
    }

    //  获取商品评价综合评分
    static async getGoodsScoreValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-part-goodss/goods/comments/score', params).then((res) => {
            return res
        });
    }

    //  获取商品评价信息
    static async getGoodsCommentsValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + '/sp-part-goodss/goods/comments', params).then((res) => {
            return res
        });
    }

    //  获取风格选择列表
    static async getPropListValue(ctx, params) {
        let url = '/prop-hds/part-goods/' + params.code
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params).then((res) => {
            return res
        });
    }

    //  获取商品尺寸列表
    static async getGoodsSizeValue(ctx, params) {
        let url = '/sp-part-goods-sizes/' + params.goodsCode + '/' + params.busContsCode
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  获取商品库存
    static async getGoodsStockValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.goodsService + ctx.optimizeFlag + '/part-hds/whse-qty/goods-codes', params, ctx.headers).then((res) => {
            return res
        });
    }

    //  获取商品库存(定制单品)
    static async getGoodsStockCustValue(ctx, params) {
        let url = `/sp-goods/fabinvy-judge`
        return ctx.$postUrl(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  商品模块查询商品库存(单品、组合)
    static async getCommonStockCustValue(ctx, params) {
        let url = `/sp-goods/inventory-judge?shopId=${params.shopId}&usrId=${params.usrId}&companyId=${params.companyId}`
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  商品分类等级查询
    static async getGoodsLayerClassValue(ctx, params) {
        let url = `/cms-busconcla-hds/layer`
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  获取商品部件信息，主面料id
    static async getMainFabricInfoValue(ctx, params) {
        let url = '/link-cfg-dts/gct-default-detail/part-code'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params).then((res) => {
            return res
        });
    }

    //  获取某件商品的商品分类层级展示信息
    static async getGoodsTreeValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + '/cms-busconcla-hds/busconst-class-props/top/part-code', params, ctx.headers).then((res) => {
            return res
        });
    }

    //  大货商品详情优惠促销信息
    static async getGoodsPromotion(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/coupons-aggregates/coupons-gifts', params, ctx.headers).then((res) => {
            return res
        });
    }

    //  获取商品是否上架
    static async getSellStateValue(ctx, params) {
        let url = '/sp-part-goodss/batch-get-sell-flags?companyId=' + params.companyId;
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params.spPartGoodsSearchDtoList, ctx.headers).then((res) => {
            return res
        });
    }

    //  获取商品是否上架
    static async getIsShelvesValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + '/sp-part-goodss/simple/' + params.goodsCode, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  获取商品图片
    static async getGoodsCoverList(ctx, params) {
        let url = `/sp-goods-list/goods/color-pics?companyId=${params.companyId}&count=${params.count}`
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params.partIds, ctx.headers).then((res) => {
            return res
        });
    }
}

module.exports = goods
