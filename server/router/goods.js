/*
* createTime：2018/7/14
* author：en.chen
* description: 中间层提供给前端的商品模块api
*/

//  商品模块整合
const goodsModule = require('../controller/goods')

// //  商品墙/商品列表
// const getGoodsList = require('../controller/goods/goods-list')
//
// //  商品墙/商品列表(过滤掉orderFlag=1的大件商品)
// const getFilterGoodsList = require('../controller/goods/goods-filter')
//
// //  推荐商品列表
// const getGoodsRecommend = require('../controller/goods/recommend')
//
// //  商品详情
// const getGoodsInfo = require('../controller/goods/info')
//
// //  组合商品详情
// const goodsCombgoodInfo = require('../controller/goods/goods-combgood-info')
//
// //  商品详情（定制）
// const getGoodsInfoCusValue = require('../controller/goods/info-cus')
//
// //  查询商品详情（组合2D展示）
// const getGroupGoodsInfoCusValue = require('../controller/goods/group-info-cus')
//
// //  查询商品分类
// const getGoodsClass = require('../controller/goods/goods-class')
//
// //  查询商品sku属性
// const getGoodsSku = require('../controller/goods/goods-sku')
//
// //  获取平台运营分类列表
// const getPlatformList = require('../controller/goods/platformList')
//
// //  获取商品评价
// const getGoodsComments = require('../controller/goods/goods-comments')
//
// //  获取风格选择列表
// const goodsPropList = require('../controller/goods/prop-list')
//
// //  获取商品尺寸大小
// const getGoodsSize = require('../controller/goods/goods-size')
//
// //  获取商品库存(大货)
// const getGoodsStock = require('../controller/goods/goods-stock')
//
// //  获取商品库存(定制单品)
// const getGoodsStockCust = require('../controller/goods/goods-stockcust')
//
// //  获取商品库存（单品、组合）
// const getCommonStockCust = require('../controller/goods/common-stock-cust')
//
// //  获取热门商品
// const getHotGoods = require('../controller/goods/hot-goods')
//
// //  获取推荐商品
// const getPutGoods = require('../controller/goods/getPutGoodsValue')
//
// //  获取商品评价综合评分
// const getGoodsScore = require('../controller/goods/goods-score')
//
// //  获取商品分类
// const getGoodsLayerClass = require('../controller/goods/layer-class')
//
// //  获取商品部件信息，主面料id
// const getMainFabricInfo = require('../controller/goods/goods-fabric-info')
//
// //  获取商品部件信息，主面料id
// const getRecommendPackages = require('../controller/goods/recommend-packages')
//
// //  获取购买可选套餐
// const getBuyablePackages = require('../controller/goods/buyable-packages')
//
// //  获取绣字颜色、字体列表
// const getEmbFontColorList = require('../controller/goods/goods-font-color')
//
// //  获取绣花图片列表
// const getEmbPicList = require('../controller/goods/emb-picture')
//
// //  获取商品可绣花、绣字部位
// const getUseablePart = require('../controller/goods/useable-part')

module.exports = {
    "GET/getCrumbsGoodsIds": goodsModule.getCrumbsGoodsIds,  // 获取面包屑查询条件ids的前置接口(毅杰)
    "GET/list": goodsModule.getGoodsList,  //  商品墙
    "GET/info": goodsModule.getGoodsInfo,  //  商品详情
    // "GET/recommend": getGoodsRecommend,
    // "GET/info": getGoodsInfo,
    // "GET/goodsCombgoodInfo": goodsCombgoodInfo,
    // "GET/infoTitle": getGoodsTitle,
    "GET/goodsClass": goodsModule.getGoodsClass,  // 获取一级面包屑分类
    // "GET/goodsSku": getGoodsSku,
    "GET/platformList": goodsModule.getPlatformList,  // 获取平台运营分类
    // "GET/comments": getGoodsComments,
    // "GET/propList": goodsPropList,
    // "GET/goodsSize": getGoodsSize,
    "GET/goodsStock": goodsModule.getGoodsStock,
    // "POST/goodsStockCust": goodsModule.getGoodsStockCust,
    "GET/hotGoods": goodsModule.getHotGoods,
    "GET/getPutGoods": goodsModule.getPutGoods,
    // "GET/filterGoods": getFilterGoodsList,
    // "GET/infoCus": getGoodsInfoCusValue,
    // "GET/groupInfoCus": getGroupGoodsInfoCusValue,
    // "GET/score": getGoodsScore,
    "GET/layer-class": goodsModule.getGoodsLayerClass,
    // "GET/fabricInfo": getMainFabricInfo,
    // "GET/recommendPackages": getRecommendPackages,
    // "GET/buyablePackages": getBuyablePackages,
    // "GET/fontColorList": getEmbFontColorList,
    // "GET/embPicList": getEmbPicList,
    // "GET/useablePart": getUseablePart,
    // "POST/commonStockCust": getCommonStockCust
    "GET/goodsClassTree": goodsModule.getGoodsTree,  //  某件商品的商品分类层级展示信息(因配置问题改成对接金峰)
    "GET/promotion": goodsModule.getGoodsPromotion,  //  大货商品详情优惠促销信息(少敏)
    "GET/infoTitle": goodsModule.getGoodsTitle,  // 获取商品目录-详情富文本
    "POST/commonStockCust": goodsModule.getCommonStockCust,
    "POST/getSellState": goodsModule.getSellState, //  获取商品是否上架（建荣）
    "GET/isShelves": goodsModule.getIsShelves, //  获取商品是否上架
    "POST/getUseableGood": goodsModule.getUseableGood, //  获取商品是否上架（建荣）
    "POST/goodsCoverList": goodsModule.getGoodsCoverList //  获取商品图片
};
