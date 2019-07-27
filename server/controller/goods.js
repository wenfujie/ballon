/*
 * createTime：2019/1/18
 * author：en.chen
 * description: 中间层商品模块整合
 */

const goods = require('../model/goods');

class goodsController {

    // 获取面包屑查询条件ids的前置接口
    static async getCrumbsGoodsIds(ctx) {
        let res = await goods.getCrumbsGoodsIds(ctx, ctx.params);
        ctx.body = res;
    }

    // 商品墙
    static async getGoodsList(ctx) {
        let res = await goods.getGoodsListValue(ctx, ctx.params);
        ctx.body = res;
    }

    // 商品详情
    static async getGoodsInfo(ctx) {
        let res = await goods.getGoodsInfoValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 热门商品
    static async getHotGoods(ctx) {
        let res = await goods.getHotGoodsValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 查询商品库存(大货)
    static async getGoodsStock(ctx) {
        let res = await goods.getGoodsStockValue(ctx, ctx.params);
        ctx.body = res.data;
    }
    //
    // // 查询商品库存(定制单品)
    // static async getGoodsStockCust(ctx) {
    //     let res = await goods.getGoodsStockCustValue(ctx, ctx.params);
    //     ctx.body = res.data;
    // }

    // 批量获取商品库存（单品、组合、大货）
    static async getCommonStockCust(ctx) {
        let res = await goods.getCommonStockCustValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 某件商品的商品分类层级展示信息
    static async getGoodsTree(ctx) {
        let res = await goods.getGoodsTreeValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 大货商品详情优惠促销信息
    static async getGoodsPromotion(ctx) {
        let res = await goods.getGoodsPromotion(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品目录(富文本详情)
    static async getGoodsTitle(ctx) {
        let res = await goods.getGoodsTitleValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取商品是否上架
    static async getSellState(ctx) {
        let res = await goods.getSellStateValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取商品是否上架
    static async getIsShelves(ctx) {
        let res = await goods.getIsShelvesValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 一级面包屑分类
    static async getGoodsClass(ctx) {
        let res = await goods.getGoodsClassValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取平台运营分类
    static async getPlatformList(ctx) {
        let res = await goods.getPlatformListValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品分类
    static async getGoodsLayerClass(ctx) {
        let res = await goods.getGoodsLayerClassValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品分类
    static async getPutGoods(ctx) {
        let res = await goods.getPutGoodsValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取商品图片
    static async getGoodsCoverList(ctx) {
        let res = await goods.getGoodsCoverList(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取商品是否上架、有库存
    static async getUseableGood(ctx) {
        /** 调用接口前参数处理 **/
        let params = ctx.params;
        params.goodList.forEach((item)=>{
            item.ptiPartHdCode = item.goodsCode;
            item.count = item.amount;
            item.ptiPartDtskuId = item.ptiPartDtSkuId;// 上下架需要
        })
        params.spPartGoodsSearchDtoList = params.goodList;
        params.inventoryJudgeDtos = params.spPartGoodsSearchDtoList;
        delete params.goodList;

        let mergeRes = await ctx.$requestAll([
            goods.getSellStateValue(ctx, ctx.params),
            goods.getCommonStockCustValue(ctx, ctx.params)
        ]);

        let sellRes = mergeRes[0].data;// 校验下架 返回值
        let stockRes = mergeRes[1].data;// 校验库存 返回值

        /** 错误抛错 **/
        if(sellRes.statusCode == 500){
            ctx.body = sellRes;
            return;
        }
        if(stockRes.statusCode == 500){
            ctx.body = stockRes;
            return;
        }

        /** 处理返回数据 抛回前端 **/
        let sellArr = [],// 上架列表
                stockArr = [],// 有库存列表
                unStockArr = [];// 无库存列表
        let orderFlag = 1;

        // 下架列表
        let unSellArr = sellRes.filter(item=>{
            if(item.sellFlag != 1 || item.skuSellFlag != 1){
                return true;
            }else{
                sellArr.push(item);
            }
        })
        stockRes.partEnoughInfoDtos.forEach(item=>{
            orderFlag = 1;// 定制不进入以下判断
            for(let i=0;i<stockRes.partEnoughSkuInfoDtos.length;i++){
                if(item.ptiPartHdCode == stockRes.partEnoughSkuInfoDtos[i].ptiPartHdCode){
                    orderFlag = 0;// 进入判断代表是大货
                    if(stockRes.partEnoughSkuInfoDtos[i].enough == 1){
                        stockArr.push(stockRes.partEnoughSkuInfoDtos[i]);
                    }else{
                        unStockArr.push(stockRes.partEnoughSkuInfoDtos[i]);
                    }
                    stockRes.partEnoughSkuInfoDtos.splice(i,1);
                }
            }
            if(orderFlag == 1){
                if(item.enough == 1){
                    stockArr.push(item);
                }else{
                    unStockArr.push(item);
                }
            }
        })

        // 过滤出上架且有库存商品
        stockArr = stockArr.filter(item=>{
            for(let j=0;j<sellArr.length;j++){
                if(item.ptiPartHdCode == sellArr[j].goodsCode){
                    if(item.ptiPartSkuId){
                        if(item.ptiPartSkuId == sellArr[j].ptiPartDtSkuId){
                            return true;
                        }
                    }else{
                        return true;
                    }
                }
            }
        })

        let sellAll = sellArr.length == sellRes.length ? 1 : 0;

        ctx.body = {
            sellAll: sellAll,
            unSellList: unSellArr,
            sellList: sellArr,
            stockAll: sellAll == 1 && stockRes.enoughAll == 1 ? 1 : 0,
            stockList: stockArr,
            unStockList: unStockArr
        };
    }

    // 获取购买可选套餐
    static async getBuyablePackages(ctx) {
        let res = await goods.getBuyablePackagesValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取绣花图片列表
    static async getEmbPicList(ctx) {
        let res = await goods.getEmbPicListValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取绣花图片列表
    static async getCombGoodsInfoValue(ctx) {
        let res = await goods.getCombGoodsInfoValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品模块查询商品评价
    static async getGoodsComments(ctx) {
        let res = await goods.getGoodsCommentsValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取商品部件信息，主面料id
    static async getMainFabricInfo(ctx) {
        let res = await goods.getMainFabricInfoValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品模块查询商品列表/商品墙 (过滤orderFlag=1数据)
    static async getFilterGoodsList(ctx) {
        let res = await goods.getFilterGoodsListValue(ctx, ctx.params);
        ctx.body = res;
    }

    // 获取商品部件信息，主面料id
    static async getEmbFontColorList(ctx) {
        let res = await goods.getEmbFontColorListValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品评价综合得分
    static async getGoodsScore(ctx) {
        let res = await goods.getGoodsScoreValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品模块获取商品尺寸大小
    static async getGoodsSize(ctx) {
        let res = await goods.getGoodsSizeValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品模块查询商品sku
    static async getGoodsSku(ctx) {
        let res = await goods.getGoodsSkuValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 查询商品详情（组合2D展示）
    static async getGroupGoodsInfoCus(ctx) {
        let res = await goods.getGroupGoodsInfoCusValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品模块查询商品详情(定制)
    static async getGoodsInfoCus(ctx) {
        let res = await goods.getGoodsInfoCusValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品模块获取风格选择列表
    static async getGoodsPropList(ctx) {
        let res = await goods.getPropListValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品模块查询平台商品的推荐商品列表
    static async goodsRecommend(ctx) {
        let res = await goods.getGoodsRecommendValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 查询单品推荐套餐
    static async getRecommendPackages(ctx) {
        let res = await goods.getRecommendPackagesValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取商品可绣花、绣字部位
    static async getUseablePart(ctx) {
        let res = await goods.getUseablePartValue(ctx, ctx.params);
        ctx.body = res.data;
    }
}

module.exports = goodsController;
