/*
* createTime：2019/1/24
* author：en.chen
* description:  商品详情
*/
<template>
    <div class="wrapper goods-detail" v-cloak>
        <!-- 页面导航 begin -->
        <div class="crumbs">
            <ul class="crumbs-con clearfix" v-if="!!crumbs">
                <router-link to="/" class="crumbs-item" tag="li">
                    <span>{{$t('pages.index')}}</span>
                    <i class="iconfont icon-jiantou"></i>
                </router-link>
                <li class="crumbs-item" v-for="item in crumbs" :key="item.id" @click="goList(item)">
                    <span>{{item.cmsBusconclaHdName}}</span>
                    <i class="iconfont icon-jiantou"></i>
                </li>
            </ul>
        </div>
        <!-- 页面导航 end -->

        <!-- 商品信息 begin -->
        <div class="goods-con clearfix">
            <!-- 商品封面模块 begin -->
            <div class="fl">
                <div class="goods-cover clearfix">
                    <div class="cover-main fl">
                        <img :src="getImg(mainCover.url)" alt="">
                    </div>
                    <div class="cover-list fr">
                        <div
                            class="prev-btn"
                            @click="coverSlider(-1)"
                            v-if="goodsSwipperList.length>5"
                        >
                            <i class="iconfont icon-xiangxiajiantou"></i>
                        </div>
                        <ul>
                            <li
                                v-for="(item,index) in goodsSwipperList"
                                :key="index"
                                class="cover-item"
                                :class="{'selected' : mainCover.index === index}"
                                v-if="index >=imageSlider.minIndex && index < imageSlider.maxIndex"
                                @click="showImg(index)"
                            >
                                <img :src="getImg(item)" alt>
                            </li>
                        </ul>
                        <div
                            class="next-btn"
                            @click="coverSlider(1)"
                            v-if="goodsSwipperList.length>5"
                        >
                            <i class="iconfont icon-xiangxiajiantou"></i>
                        </div>
                    </div>
                </div>
                <div class="goods-ensure">
                    <ul class="clearfix">
                        <li class="ensure-item">
                            <div class="icon-ensure bg-ensure"></div>
                            <span>{{$t('goods.details.assure')}}</span>
                        </li>
                        <li class="ensure-item">
                            <div class="icon-ensure bg-send"></div>
                            <span>{{$t('goods.details.send')}}</span>
                        </li>
                        <li class="ensure-item">
                            <div class="icon-ensure bg-after-sale"></div>
                            <span>{{$t('goods.details.afterSale')}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 商品封面模块 end -->

            <!-- 商品信息 begin -->
            <div class="goods-info fr">
                <h2 class="goods-name">{{goodsInfo.goodsName}}</h2>

                <!-- 商品促销 begin -->
                <div class="goods-panel">
                    <div class="goods-promotional">
                        <!-- 价格 begin -->
                        <div class="goods-price clearfix">
                            <label class="promotion-label">{{$t('goods.details.salePrice')}}：</label>
                            <div class="fl mg-l10">
                                <span class="sale-price">￥{{goodsInfo.salePrice}}</span>
                                <span
                                    class="tag-price mg-l10"
                                    v-if="!!goodsInfo.tagPrice && goodsInfo.tagPrice>0"
                                >￥{{goodsInfo.tagPrice}}</span>
                            </div>
                        </div>
                        <!-- 价格 end -->

                        <!-- 优惠券 begin -->
                        <div class="discount clearfix" v-if="coupons.length>0">
                            <label class="promotion-label">{{$t('goods.details.discount')}}：</label>
                            <!--<ul class="fl mg-l10 clearfix coupons-list" :class="{'all' : !!showAllCoupons}">-->
                            <ul class="fl mg-l10 clearfix coupons-list all">
                                <!--<li @click="goVouchersCenter" class="coupons-item" v-for="(item,index) in coupons"-->
                                <!--:key="item.couponId" v-show="index <= 1">-->
                                <!--&lt;!&ndash;<div class="fl coupons-name">{{item.couponName}}</div>&ndash;&gt;-->
                                <!--&lt;!&ndash;<div class="fl receive-btn">{{$t('goods.details.receive')}}</div>&ndash;&gt;-->
                                <!--<div class="fl coupons-val">{{!!item.discount ? `${(item.discount * 10).toFixed(2)}折折扣券` : `${item.initialValue}元优惠券`}}</div>-->
                                <!--</li>-->
                                <!--<div v-if="coupons.length>2" class="more" @click="showAllCoupons = !showAllCoupons">-->
                                <!--{{btnName}}<i class="fr iconfont icon-jiantou"-->
                                <!--:class="{ 'rotate' : !!showAllCoupons}"></i>-->
                                <!--</div>-->
                                <li
                                    @click="goVouchersCenter"
                                    class="coupons-item"
                                    v-if="!!priceCoupon"
                                >
                                    <div
                                        class="fl coupons-val"
                                    >{{priceCoupon.initialValue}}{{$t('unit.priceUnit')}} {{$t('goods.details.coupons')}}</div>
                                </li>
                                <li
                                    @click="goVouchersCenter"
                                    class="coupons-item"
                                    v-if="!!discountCoupon"
                                >
                                    <div
                                        class="fl coupons-val"
                                    >{{parseFloat((discountCoupon.discount * 10).toFixed(2))}}{{$t('unit.discount')}} {{$t('goods.details.discountCard')}}</div>
                                </li>
                                <div class="more" @click="goVouchersCenter">
                                    {{btnName}}
                                    <i
                                        class="fr iconfont icon-jiantou"
                                        :class="{ 'rotate' : !!showAllCoupons}"
                                    ></i>
                                </div>
                            </ul>
                        </div>
                        <!-- 优惠券 end -->

                        <!-- 赠品 begin -->
                        <!--<div class="gifts clearfix" v-if="promotionList.length>0">-->
                            <!--<label class="promotion-label">{{$t('goods.details.gift')}}：</label>-->
                            <!--<ul class="fl mg-l10 clearfix promotion-list">-->
                                <!--<li class="promotion-item" v-for="item in promotionList" :key>-->
                                    <!--<div class="promotion-cover fl">-->
                                        <!--<img v-lazy="getImg(item.colorUrl)" alt>-->
                                    <!--</div>-->
                                    <!--<div class="fl">-->
                                        <!--<p class="promotion-name">{{item.ptiPartHdName}}</p>-->
                                        <!--<p>-->
                                            <!--<span>{{item.colorName}}</span>-->
                                            <!--<span class="mg-l10">{{item.sizeName}}</span>-->
                                        <!--</p>-->
                                    <!--</div>-->
                                <!--</li>-->
                            <!--</ul>-->
                        <!--</div>-->
                        <!-- 赠品 end -->
                    </div>
                </div>
                <!-- 商品促销 end -->

                <!-- 尺码选择 begin -->
                <div class="size-con clearfix">
                    <label class="con-label font-small text-primary">{{$t('goods.common.size')}}：</label>
                    <ul class="fl mg-l10 clearfix">
                        <li
                            class="size-item"
                            v-for="item in goodsSize"
                            :key="item.sizeId"
                            :class="[{'selected': item.sizeCode===sizeCode},{'disabled': (item.canSelectFlag == 0 || sellFlag == 0 || goodsStock <= 0)}]"
                            @click="choseSize(item)"
                        >{{item.sizeName}}</li>
                    </ul>
                </div>
                <!--尺码选择 end-->

                <!-- 颜色选择 begin -->
                <div class="color-con clearfix">
                    <label class="con-label font-small text-primary">{{$t('goods.common.color')}}：</label>
                    <ul class="fl mg-l10 clearfix">
                        <li
                            class="color-img"
                            v-for="(item,index) in goodsColor"
                            :class="[{'selected': item.colorCode === colorCode},{'disabled': item.canSelectFlag == 0 || sellFlag == 0 || goodsStock <= 0}]"
                            @click="choseColor(item)"
                            :key="item.colorId"
                        >
                            <img v-lazy="getImg(item.urls[0])" :title="item.colorName">
                            <div class="selected-btn" v-if="item.colorCode === colorCode"></div>
                        </li>
                    </ul>
                </div>
                <!-- 颜色选择 end-->

                <!-- 选择商品数量 begin -->
                <div class="amount-con clearfix">
                    <label class="con-label fl font-small text-primary">{{$t('common.quantity')}}：</label>
                    <div class="fl mg-l10 inputNumber">
                        <el-input-number
                            size="small"
                            v-model="amount"
                            @blur="handleBlur"
                            @change="handleChange"
                            :min="1"
                            :max="stock"
                            :placeholder="oldAmount"
                            :disabled="sellFlag == 0"
                        ></el-input-number>
                    </div>
                    <p class="fl font-small $text-secondary mg-l10">{{$t('goods.details.stock')}}：{{this.stock}}</p>
                </div>
                <!-- 选择商品数量 end -->

                <!-- 按钮组 begin -->
                <div class="goods-btns clearfix">
                    <!-- 立即购买 -->
                    <div v-show="!!sellFlag" class="buy-btn" @click="goodsHandle(1)">{{$t('goods.details.buy')}}</div>
                    <!-- 加入购物车 -->
                    <div v-show="!!sellFlag" class="cart-btn" @click="goodsHandle(0)">{{$t('goods.details.joinCart')}}</div>
                    <!-- 已下架 -->
                    <div v-show="sellFlag == 0" class="unshelves-btn">{{$t('goods.details.unShelves')}}</div>
                    <!-- 收藏 -->
                    <!--<div class="handle-btn favor-btn" @click="collectToggle">-->
                    <!--<div class="icon-box"><i class="iconfont" :class="[goodsInfo.collectionFlag === 1 ? 'icon-shoucang' : 'icon-weishoucang']"></i></div>-->
                    <!--<p>{{goodsInfo.collectionFlag === 1 ? $t('goods.details.collected') : $t('goods.details.collect')}}</p>-->
                    <!--</div>-->
                    <!-- 分享 -->
                    <div class="handle-btn share-btn">
                        <div class="bdsharebuttonbox">
                            <a href="#" class="bds_weixin" data-cmd="weixin" title="分享到微信"></a>
                            <!--<a href="#" class="bds_qzone" data-cmd="qzone" title="分享到QQ空间"></a>-->
                            <a
                                href="javascript:void(0)"
                                class="bds_tsina"
                                title="分享到新浪微博"
                                @click="share('xinlang')"
                            ></a>
                            <!-- <a href="" class="bds_tsina" data-cmd="tsina" title="分享到新浪微博"></a> -->
                        </div>
                        <div class="icon-box">
                            <i class="iconfont icon-fenxiang"></i>
                        </div>
                        <p>{{$t('common.share')}}</p>
                    </div>
                </div>
                <!-- 按钮组 end -->
            </div>
            <!-- 商品信息 end-->
        </div>
        <!-- 商品信息 end -->

        <!-- 看了又看 begin -->
        <!--<div class="shop-recommend">-->
        <!--<recommend-list></recommend-list>-->
        <!--</div>-->
        <!-- 看了又看 end -->

        <!-- 商品评价及详情 begin -->
        <div class="goods-info-detail">
            <ul class="detail-tab-con clearfix">
                <li
                    class="tab-item"
                    :class="{'selected': detailType === 0}"
                    @click="detailType = 0"
                >{{$t('goods.details.goodsDetail')}}</li>
                <li
                    class="tab-item"
                    :class="{'selected': detailType === 1}"
                    @click="detailType = 1"
                >{{$t('goods.details.goodsComment')}}</li>
            </ul>

            <!-- 商品富文本信息 begin -->
            <div class="goods-title" v-show="detailType === 0">
                <p class="font-small text-primary" v-show="!hasTitle">{{$t('goods.details.without')}}{{$t('goods.details.goodsDetail')}}~</p>
                <div
                    class="goods-title-con"
                    v-if="goodsTitle.length >0"
                    v-for="item in goodsTitle"
                    :key="item.id"
                >
                    <!--<p>{{item.descName}}</p>-->
                    <div class="tab-content" v-html="item.descContent"></div>
                </div>
            </div>
            <!-- 商品富文本信息 end -->

            <!-- 商品评价 begin -->
            <div class="goods-comment" v-show="detailType === 1">
                <p class="font-small text-primary">{{$t('goods.details.without')}}{{$t('goods.details.goodsComment')}}~</p>
            </div>
            <!-- 商品评价 end -->
        </div>
        <!-- 商品评价及详情 end -->

        <LoginDialog ref="LoginDialog" @generalLoginSuccess="vouchersCallBack" ></LoginDialog>
    </div>
</template>
<script>
import Storage from "../../utils/storage";
import { Goods, ShoppingCart, Order, Collection } from "../../api/service";
import RecommendList from '../../components/RecommendList.vue'
import { mapState } from "vuex";
import LoginDialog from '../../components/login/LoginDialog'
import { Message } from 'element-ui';

export default {
    components: {
        RecommendList,
        'LoginDialog': LoginDialog
    },
    data() {
        return {
            goodsCode: null,  // 路由携带的商品编码
            goodsId: null,  // 路由携带的商品id
            crumbs: null,  // 导航面包屑
            goodsInfo: {},  // 商品详情
            goodsImages: [],  // 商品轮播图
            imageSlider: {  // 控制图片滚动
                minIndex: 0,
                maxIndex: 5
                //                    actIndex: 5
            },
            mainCover: {  // 轮播大图
                url: null,
                index: 0
            },
            goodsSize: [],  // 商品尺寸
            goodsColor: [],  // 商品颜色
            colorCode: '',  // 颜色选择
            sizeCode: '',  // 尺码选择
            sizeId: '',  // 尺码id
            stockList: [],  // 库存列表
            goodsStock: null,  // 大货商品总库存
            coupons: [],  // 优惠券列表
            showAllCoupons: false,  // 显示全部优惠券信息
            promotion: {},  // 赠品信息
            promotionList: [],  // 赠品信息汇总(仅用于展示列表)
            amount: 1,  // 商品数量
            detailType: 0, // 0展示详情,1展示评价
            goodsTitle: [],  // 商品富文本目录
            comments: [],  // 评价列表
            sellFlag: 0,  // 商品上下架标识
            goodsSkuListSellFlag: [],  // 商品sku组合对应的上下架标识
            btnLock: false,  // 按钮锁
            showLogin: false,  // 显示登陆弹窗
            oldAmount: "1",
            goodsSwipperList: [],  // 轮播小图片
            operationsType: null,  // 点击按钮类型
            vouchersFlag: false,  // 未登录点击领券标识
            //                skuId: null  // 选中商品的skuId
        }
    },
    methods: {

        //  获取大货商品详情
        getGoodsInfo() {
            c_showLoading();
            let data = {
                usrId: Storage.get('USER_INFO') ? Storage.get('USER_INFO').usrId : 0,  // 用户未登录传0
                busContsCode: !!baseConstant.busContsCode ? baseConstant.busContsCode : Storage.get('properties').busContsCode,
                goodsCode: this.goodsCode || this.$route.query.goodsCode,
                shopId: Storage.get('properties').shopId,
            }
            Goods.getGoodsInfo(data).then((res) => {
                this.goodsInfo = res
                this.goodsInfo.goodsCode = this.goodsCode
                // 商品封面大图的取图逻辑更换成：存在颜色图，取第一张；不存在颜色图取商品主图，不存在主图展示系统默认图(因左右联动的原因取消本次取图逻辑，后期修改)
                //                    this.mainCover.url = res.url
                //                    if(!!this.goodsInfo.colorsVoList && this.goodsInfo.colorsVoList.length > 0 && !!this.goodsInfo.colorsVoList[0].dtColorUrls){
                //                        this.mainCover.url = !!this.goodsInfo.colorsVoList[0].dtColorUrls[0] ? this.goodsInfo.colorsVoList[0].dtColorUrls[0] : this.goodsInfo.colorsVoList[0].dtColorUrls
                //                    }
                // 获取颜色列表
                let colorList = res.colorsVoList;
                colorList.forEach((item, index) => {
                    item.stucks = ''
                    item.effFlag = ''
                    item.canSelectFlag = 1
                    if (!!item.urls && item.urls.length > 0) {
                        item.urls.forEach((image) => {
                            this.goodsImages.push(image)
                        })
                    } else {
                        item.urls = ['./assets/images/common/error.png']
                    }
                    if (!!item.dtColorUrls && item.dtColorUrls.length > 0) {
                        item.urls.forEach((image) => {
                            this.goodsSwipperList.push(image)
                        })
                    }
                });
                if (this.goodsSwipperList.length > 0) {
                    this.mainCover.url = this.goodsSwipperList[0]
                } else {
                    this.mainCover.url = this.goodsInfo.url
                }
                if (this.goodsColor.length === 0) {
                    this.goodsColor.push(colorList[0]);
                }
                //  去掉重复的颜色选项
                let arr = [];
                colorList.forEach((item) => {
                    this.goodsColor.forEach((colorItem) => {
                        arr.push(colorItem.colorId);
                    });
                    if (arr.indexOf(item.colorId) === -1) {
                        this.goodsColor.push(item);
                    }
                });
                //  获取尺码列表
                let sizeList = res.sizesVoList;
                sizeList.forEach((item) => {
                    item.stucks = '';
                    item.effFlag = '';
                    item.canSelectFlag = 1
                });
                this.goodsSize = sizeList;
                this.$nextTick(() => {
                    this.shareInit()
                })

            }).then(() => {
                if (!!this.goodsInfo.orderGoodsCode) {
                    this.getGoodsInfoTitle()
                }
                this.getGoodsPromotion()
            })
        },

        //  获取商品分类层级展示
        getGoodsTree() {
            let data = {
                partCode: this.goodsCode,
                buscontsCode: Storage.get('properties').busContsCode
            }
            Goods.getGoodsClassTree(data).then((res) => {
                this.crumbs = res
            })
        },

        //  跳转商品墙
        goList(item) {
            if (!!item.cmsBusconclaHdCode) this.goPage('/goods-list?classId=' + item.cmsBusconclaHdCode)
        },

        //  获取商品优惠促销
        getGoodsPromotion() {
            let data = {
                ptiPartHdId: this.goodsId || this.goodsInfo.orderGoodsCode,
                busContsCode: !!baseConstant.busContsCode ? baseConstant.busContsCode : Storage.get('properties').busContsCode,
                shopId: Storage.get('properties').shopId,
            }
            Goods.getGoodsPromotion(data).then((res) => {
                this.coupons = res.couponsCards
                this.promotion = res.giftVos
                if (res.giftVos.length > 0) {
                    this.promotionList = []
                    res.giftVos.forEach((item) => {
                        if (!!item.giftGoodsDtos.length && item.giftGoodsDtos.length > 0) {
                            this.promotionList.push.apply(this.promotionList, item.giftGoodsDtos)
                        }
                    })
                }


            })
        },

        //  查询商品详情目录
        getGoodsInfoTitle() {
            let data = {
                goodsId: this.goodsInfo.orderGoodsCode
            };
            Goods.getGoodsTitle(data).then((res) => {
                res.forEach((item) => {
                    let newStr = item.descContent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (img, src) {
                        let index = src.indexOf('=') + 1
                        let imgData = getImg(src.substring(index, img.length))
                        return '<img src="' + imgData + '" style="width: 100%; display: block; margin: 0;">'
                    })
                    let newPre = newStr.replace(/\<pre\>/gi, function () {
                        return '<pre style="word-wrap: break-word;white-space:pre-wrap;">'
                    })
                    let newP = newPre.replace(/\<p\>/gi, function () {
                        return '<p style="word-wrap: break-word;white-space:pre-wrap;">'
                    })
                    item.descContent = newP
                });
                this.goodsTitle = res;
            });
        },

        //  点击商品轮播
        showImg(index) {
            this.mainCover.index = index
            this.mainCover.url = this.goodsSwipperList[index]
        },

        // 输入框失去焦点
        checkValue(e) {
            if (!e.target.value || e.target._value) {
                e.target.value = 1
                e.target._value = 1
            }
        },

        // 数字校验
        handleBlur() {
            this.amount = parseInt(this.amount)
        },

        //  商品数量变更
        handleChange(value) {
            if (!!value) {
                this.amount = value
                this.oldAmount = this.amount + ""
            } else {
                value = parseInt(this.oldAmount)
                this.amount = value
            }
            //  通过选择的尺码判断颜色库存
            if (!!this.sizeCode) {
                for (let i = 0; i < this.stockList.length; i++) {
                    if (this.stockList[i].sizeCode === this.sizeCode) {
                        this.goodsColor.forEach((colorItem) => {
                            if (colorItem.colorCode === this.stockList[i].colorCode) {
                                colorItem.stucks = this.stockList[i].skuQty;
                                colorItem.effFlag = this.stockList[i].effFlag;
                                if (this.stockList[i].skuQty > 0 && this.stockList[i].skuQty >= this.amount) {
                                    colorItem.canSelectFlag = 1
                                } else {
                                    colorItem.canSelectFlag = 0
                                }
                            }
                        });
                    }
                }
            } else if (!!this.colorCode) {
                for (let i = 0; i < this.stockList.length; i++) {
                    if (this.stockList[i].colorCode === this.colorCode) {
                        this.goodsSize.forEach((sizeItem) => {
                            if (sizeItem.sizeCode === this.stockList[i].sizeCode) {
                                sizeItem.stucks = this.stockList[i].skuQty;
                                sizeItem.effFlag = this.stockList[i].effFlag;
                                if (this.stockList[i].skuQty > 0 && this.stockList[i].skuQty >= this.amount) {
                                    sizeItem.canSelectFlag = 1
                                } else {
                                    sizeItem.canSelectFlag = 0
                                }
                            }
                        });
                    }
                }
            }
        },

        //  商品对应sku的上下架信息
        shelvesInfo() {
            let list = []
            let map = {}
            map.goodsCode = this.goodsCode || this.$route.query.goodsCode
            map.busContsCode = !!baseConstant.busContsCode ? baseConstant.busContsCode : Storage.get('properties').busContsCode
            map.companyId = Storage.get('COMPANYID').company_id
            list.push(map)
            let data = {
                spPartGoodsSearchDtoList: list
            }
            Goods.getGoodsSellState(data).then((res) => {
                if (!!res[0].sellFlag && !!res[0].spPartGoodsSkuList) {
                    this.sellFlag = res[0].sellFlag
                    this.goodsSkuListSellFlag = res[0].spPartGoodsSkuList
                }
                if(this.sellFlag === 0) {
                    this.$toast('商品已下架~')
                }
            }).then(() => {
                this.getGoodsStucks()
            })
        },

        // 查询商品库存
        getGoodsStucks() {
            let data = {
                busContsCode: Storage.get('properties').busContsCode,
                goodsCode: this.goodsCode,
                shopCode: Storage.get('properties').shopCode
            };
            Goods.getGoodsStock(data).then((res) => {
                this.goodsStock = res.goodsQty;
                this.stockList = res.skuList;
                if (this.goodsSkuListSellFlag.length > 0 && !!res.skuList.length && res.skuList.length > 0) {
                    this.stockList.forEach((item) => {
                        this.goodsSkuListSellFlag.forEach((sellItem) => {
                            if (item.skuId === sellItem.ptiPartDtSkuId) {
                                item.effFlag = sellItem.effFlag
                            }
                        })
                    })
                }
            });
        },

        //  num为单次滚动的步长,大于0表示向下加载
        coverSlider(num) {
            if (num > 0) {
                if (num + this.imageSlider.maxIndex > this.goodsSwipperList.length) {  // 当加载的步长超过图片总量，下滑至最大图片数量
                    this.imageSlider.maxIndex = this.goodsSwipperList.length
                    this.imageSlider.minIndex = this.goodsSwipperList.length - 5    // 示图中最多展示5件商品
                } else {
                    this.imageSlider.maxIndex += num
                    this.imageSlider.minIndex += num
                }
            } else {
                if (num + this.imageSlider.minIndex < 0) {  // 当加载的步长返回至第一张图片之前，返回至第一张图片
                    this.imageSlider.maxIndex = 5
                    this.imageSlider.minIndex = 0
                } else {
                    this.imageSlider.maxIndex += num
                    this.imageSlider.minIndex += num
                }
            }
        },

        //  选择商品尺码
        choseSize(item) {
            if (this.goodsStock <= 0 || this.sellFlag === 0 || item.stucks === 0 || item.effFlag === 0 || item.canSelectFlag == 0) {
                this.$toast('该类商品库存不足或已下架')
                return;
            }
            //  选中及反选
            if (item.sizeCode === this.sizeCode) {
                this.sizeCode = ''
                this.goodsColor.forEach((colorItem) => {
                    colorItem.stucks = ''
                    colorItem.effFlag = ''
                    colorItem.canSelectFlag = 1
                });
            } else {
                this.sizeCode = item.sizeCode
                this.sizeId = item.sizeId
            }
            //  通过选择的尺码判断颜色库存
            if (!!this.sizeCode) {
                for (let i = 0; i < this.stockList.length; i++) {
                    if (this.stockList[i].sizeCode === this.sizeCode) {
                        this.goodsColor.forEach((colorItem) => {
                            if (colorItem.colorCode === this.stockList[i].colorCode) {
                                colorItem.stucks = this.stockList[i].skuQty;
                                colorItem.effFlag = this.stockList[i].effFlag;
                                if (this.stockList[i].skuQty >= this.amount && this.stockList[i].effFlag >0) {
                                    colorItem.canSelectFlag = 1
                                } else {
                                    colorItem.canSelectFlag = 0
                                }
                            }
                        });
                    }
                }
            }
        },

        //  选择商品颜色
        choseColor(item) {
            if (this.goodsStock <= 0 || this.sellFlag === 0 || item.stucks === 0 || item.effFlag === 0 || item.canSelectFlag == 0) {
                this.$toast('该类商品库存不足或已下架')
                return;
            }
            //  选中及反选
            if (item.colorCode === this.colorCode) {
                this.colorCode = ''
                this.goodsSize.forEach((sizeItem) => {
                    sizeItem.stucks = ''
                    sizeItem.effFlag = ''
                    sizeItem.canSelectFlag = 1
                });
            } else {
                this.colorCode = item.colorCode
            }
            //  通过选择的尺码判断颜色库存
            if (!!this.colorCode) {
                for (let i = 0; i < this.stockList.length; i++) {
                    if (this.stockList[i].colorCode === this.colorCode) {
                        this.goodsSize.forEach((sizeItem) => {
                            if (sizeItem.sizeCode === this.stockList[i].sizeCode) {
                                sizeItem.stucks = this.stockList[i].skuQty;
                                sizeItem.effFlag = this.stockList[i].effFlag;
                                if (this.stockList[i].skuQty >= this.amount && this.stockList[i].effFlag >0) {
                                    sizeItem.canSelectFlag = 1
                                } else {
                                    sizeItem.canSelectFlag = 0
                                }
                            }
                        });
                    }
                }
            }
        },

        //  获取判断商品上下架参数
        getCheckShelvesParams(){
            let list = []
            let map = {}
            map.goodsCode = this.goodsCode || this.$route.query.goodsCode
            map.busContsCode = !!baseConstant.busContsCode ? baseConstant.busContsCode : Storage.get('properties').busContsCode
            map.companyId = Storage.get('COMPANYID').company_id
            map.ptiPartDtskuId = this.skuId
            list.push(map)
            return list
        },

        //  购买/加入购物车判断商品上下架
        checkShelves() {
            let list = this.getCheckShelvesParams()
            let data = {
                spPartGoodsSearchDtoList: list
            }
            return Goods.getGoodsSellState(data)
        },

        //  获取判断商品库存参数
        getCheckStockParams(){
            let data = {
                shopId: Storage.get('properties').shopId,
                inventoryJudgeDtos: [
                    {
                        "count": this.amount,
                        "orderFlag": 0,
                        "ptiPartDtSkuId": this.skuId,
                        "ptiPartHdCode": this.goodsCode,
                        "ptiPartHdId": this.goodsId || this.goodsInfo.ptiPartHdId
                    }
                ]
            }
            return data
        },

        //  购买/加入购物车判断商品库存
        checkStock() {
            let data = this.getCheckStockParams()
            return Goods.getGroupGoodsStockCust(data)
        },

        //  获取保存购物车所需参数
        getSaveCartParams(){
            let data = {
                amount: this.amount,
                busContsCode: Storage.get('properties').busContsCode,
                dptId: Storage.get("properties").shopId,
                goodsCode: this.goodsCode,
                partDtSkuId: this.skuId,
                newPartDtSkuId: this.skuId,
                salePrice: this.goodsInfo.salePrice,
                flag: 0 // 从商品添加进购物车
            }
            return data
        },

        //  保存购物车
        saveCart() {
            let data = this.getSaveCartParams()
            ShoppingCart.saveCart(data).then(() => {
                this.$store.dispatch('user/updateShoppingCart')
                this.$toast('加入购物车成功~')
                c_showLoading(false)
            }).then(() => {
                this.btnLock = false;
            });
        },

        //  获取立即购买参数
        getBuyGoodsParams() {
            let picId = null
            let colorId = null
            this.goodsColor.forEach((item) => {
                if (item.colorCode === this.colorCode) {
                    picId = item.fileId;
                    colorId = item.colorId
                }
            })
            let orderData = {
                interfaceCode: "SP_SALE_SAVECARTTEMP",
                sourceCode: "D_ORDSHOP",
                skuList: [
                    {
                        amount: this.amount,
                        colorCode: this.colorCode,
                        sizeCode: this.sizeCode,
                        salePrice: this.goodsInfo.salePrice,
                        tagPrice: this.goodsInfo.tagPrice,
                        goodsCode: this.goodsCode,
                        thumb: this.goodsInfo.url,
                        pictFileId: picId,
                        ptiPartDtSkuId: this.skuId,
                        ptiPartHdId: this.goodsInfo.ptiPartHdId,
                        colorId: colorId,
                        sizeId: this.sizeId,
                    }
                ],
                amountOrd: this.amount * this.goodsInfo.salePrice,
            };
            return orderData
        },

        //  立即购买
        buyGoods() {
            let orderData = this.getBuyGoodsParams()
            let data = Object.assign({
                ctmUsrId: Storage.get("USER_INFO").usrId,
                cookieId: Storage.get("USER_INFO").usrId,
                shopCode: Storage.get("properties").shopCode,
                usrKey: Storage.get("USER_INFO").usrId
            },orderData)
            Order.saveCartTemp(data).then((res) => {
                return Order.orderPreferCal({
                    ordId: res
                }).then(() => {
                    c_showLoading(false)
                    this.$router.push("/order-settle?orderHdId=" + res);
                })
            }, (err) => {
                this.$toast(err.errorMsg)
            });
        },

        //  立即购买/加入购物车前置条件处理，0为加入购物车，1为购买
        goodsHandle(type) {
            this.operationsType = type
            if (this.btnLock === true) return
            this.btnLock = true
            if (!this.skuId) {
                this.$toast('请先选择商品的颜色和尺码~')
                this.btnLock = false
                return
            }
            if (!this.isLogin) {
                // 登陆
                this.setLoginCallbackInfo()
                this.$refs.LoginDialog.dialogVisible = true
                this.btnLock = false
                return
            }
            c_showLoading()
            //  判断上下架
            this.checkShelves().then((res) => {
                if (!!res[0].sellFlag && res[0].sellFlag === 1 && res[0].skuSellFlag === 1) {
                    return true
                } else {
                    return false
                }
            }).then((status) => {
                //  判断库存
                if (!!status) {
                    this.checkStock().then((res) => {
                        if (res.enoughAll <= 0) {
                            return false
                        } else {
                            return true
                        }
                    }).then((status) => {
                        if (!!status) {
                            if (type === 1) this.buyGoods()
                            if (type === 0) this.saveCart()
                        } else {
                            c_showLoading(false)
                            this.$toast('商品库存不足')
                            this.btnLock = false
                        }
                    })
                } else {
                    this.$toast('商品已下架~')
                    c_showLoading(false)
                    this.btnLock = false
                }
            })
        },

        //  获取商品详情信息
        getGoodsDetail() {
            let data = {
                usrId: Storage.get('USER_INFO') ? Storage.get('USER_INFO').usrId : 0,  // 用户未登录传0
                busContsCode: !!baseConstant.busContsCode ? baseConstant.busContsCode : Storage.get('properties').busContsCode,
                goodsCode: this.goodsCode || this.$route.query.goodsCode,
                shopId: Storage.get('properties').shopId,
            }
            Goods.getGoodsInfo(data).then((res) => {
                res.goodsCode = this.goodsCode
                this.goodsInfo = res
            })
        },

        //  收藏/取消收藏
        collectToggle() {
            if(this.sellFlag == 0) {
                this.$toast('该商品已下架~')
                return
            }
            if (!this.isLogin) {
                // 登陆
                this.$refs.LoginDialog.dialogVisible = true
                return
            }
            if (this.goodsInfo.collectionFlag === 1) {
                //  取消收藏
                let data = {
                    goodCodeStr: this.goodsCode,
                    ids: this.goodsInfo.rtlCollectionDtId
                };
                Collection.deleteCollection(data).then((res) => {
                    this.$nextTick(() => {
                        this.$toast('已取消收藏~')
                        this.getGoodsDetail()
                    });
                });
            } else {
                //  收藏
                let data = {
                    busContsCode: Storage.get("properties").busContsCode,
                    goodsCode: this.goodsCode,
                    shopId: Storage.get("properties").shopId
                };
                Collection.addCollection(data).then((res) => {
                    if (res === 1) {
                        this.$nextTick(() => {
                            this.$toast('收藏成功~')
                            this.getGoodsDetail()
                        });
                    }
                });
            }
        },

        //新浪分享(暂时只是新浪分享)
        share() {
            if(this.sellFlag == 0) {
                this.$toast('该商品已下架~')
                return
            }
            var time = new Date().getTime();
            var content = encodeURIComponent(`我发现了一个非常不错的商品！${this.shareMsg.goodsName}，只要${this.goodsInfo.salePrice}元，倾情推荐！`);
            var url = window.location.href + '&tp=' + time;  //加个时间戳，否则微博不让连续分享同个内容的东西
            url = encodeURIComponent(url);
            var picurl = encodeURIComponent(this.shareMsg.bdPic.join('||'));
            var shareqqstring = 'http://v.t.sina.com.cn/share/share.php?appkey=168486312&title=' + content + '&url=' + url + '&pic=' + picurl;
            window.open(shareqqstring);
        },
        //  分享
        shareInit() {
            setTimeout(() => {
                c_showLoading(false);
                if (window._bd_share_main) {
                    window._bd_share_main.init();
                } else {
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5);
                    document.body.appendChild(script);
                    window._bd_share_config = {
                        common: {
                            //此处放置通用设置
                            bdText: `我发现了一个非常不错的商品！${this.shareMsg.goodsName}，只要${this.goodsInfo.salePrice}元，倾情推荐！`,
                            bdDesc: `我发现了一个非常不错的商品！${this.shareMsg.goodsName}，只要${this.goodsInfo.salePrice}元，倾情推荐！`,
                            bdUrl: window.location.href,
                            bdPic: this.shareMsg.bdPic.join('||')
                        },
                        share: [
                            //此处放置分享按钮设置
                            //                            {
                            //                                "bdSize" : 16
                            //                            }
                        ],
                        slide: [
                            //此处放置浮窗分享设置
                        ],
                        image: [],
                        //                            selectShare : [
                        //                                //此处放置划词分享设置
                        //                                {
                        //                                    "bdselectMiniList" : ['qzone','tsina','weixin']
                        //                                }
                        //                            ]
                    }
                }
            }, 1000)
        },

        //  跳转领券中心
        goVouchersCenter() {
            if (!this.isLogin) {
                // 登陆
                this.vouchersFlag = true
                this.$refs.LoginDialog.dialogVisible = true
                return
            } else {
                let routeUrl = this.$router.resolve({
                    path: "/vouchers-center",
                    query: {
                        goodsCode: this.goodsCode,
                        ptiPartHdId: !!this.goodsId ? this.goodsId : this.goodsInfo.orderGoodsCode,
                    }
                });
                window.open(routeUrl.href, '_blank');
            }
        },

        vouchersCallBack(){
            if(!!this.vouchersFlag) {
                let routeUrl = this.$router.resolve({
                    path: "/vouchers-center",
                    query: {
                        goodsCode: this.goodsCode,
                        ptiPartHdId: !!this.goodsId ? this.goodsId : this.goodsInfo.orderGoodsCode,
                    }
                });
                window.open(routeUrl.href, '_blank');
            }
        },

        getImageUrl(fileUrl) {
            let url = window.location.host;
            if (window.location.hostname == "localhost" || window.location.hostname == "127.0.0.1") {
                url = "localhost:3000"
            } else {
                url += "/ballon"
            }
            return url + "/file-system/getImg?" + ("fileUrl=" + fileUrl + "&companyId=" + Storage.get('COMPANYID').company_id)
        },

        setLoginCallbackInfo() {
            let operationParams = {}
            if(this.operationsType === 2) {
                operationParams = {}
            }else if(this.operationsType === 0 || this.operationsType === 1){
                operationParams = {
                    vm: this,
                    type: this.operationsType,
                    spPartGoodsSearchDtoList: this.getCheckShelvesParams(),  // 上下架
                    inventoryJudgeDtos: this.getCheckStockParams(),  // 库存
                    orderData: this.getBuyGoodsParams(),  // 保存更新结算商品信息
                    cartData: this.getSaveCartParams(),  // 保存购物车商品信息
                }
            }
            this.$store.commit('goods/setData',{ storeKey: 'operationType', storeValue: this.operationsType })
            this.$store.commit('goods/setData',{ storeKey: 'operationParams', storeValue: operationParams })
        }

    },

    computed: {

        //  按钮名称
        btnName: function () {
            return !!this.showAllCoupons ? this.$t('goods.details.retract') : this.$t('goods.details.more')
        },

        //  是否显示商品详情富文本
        hasTitle: function () {
            return this.goodsTitle.length > 0 ? true : false
        },

        //  商品
        skuId: function () {
            let goodsSkuId = ''
            this.stockList.forEach((item) => {
                if (item.sizeCode === this.sizeCode && item.colorCode === this.colorCode) {
                    goodsSkuId = item.skuId
                }
            })
            return goodsSkuId
        },

        //  分享信息
        shareMsg: function () {
            let root = this;
            let list = this.goodsSwipperList
            let map = {}
            let newArr = []
            list.forEach((item) => {
                map = root.getImageUrl(item)
                newArr.push(map)
                map = {}
            })
            return {
                goodsName: !!this.goodsInfo.goodsName ? this.goodsInfo.goodsName : null,
                bdPic: newArr
            }
        },
        //  用户是否登陆
        isLogin: function () {
            return !!this.userInfo ? true : false
        },

        //  库存校验
        stock: function () {
            let stock = 0
            //                if (!this.sizeCode || !this.colorCode) {
            //                    return this.goodsStock
            //                } else {
            //                    for (let i = 0; i < this.stockList.length; i++) {
            //                        if(this.stockList[i].skuId === this.skuId) {
            //                            return this.stockList[i].skuQty
            //                        }
            //                    }
            //                }
            if (!!this.sizeCode && !!this.colorCode) {
                for (let i = 0; i < this.stockList.length; i++) {
                    if (this.stockList[i].skuId === this.skuId) {
                        stock = this.stockList[i].skuQty
                    }
                }
            } else if (!!this.sizeCode && !this.colorCode) {
                for (let i = 0; i < this.stockList.length; i++) {
                    if (this.stockList[i].sizeCode === this.sizeCode) {
                        stock += this.stockList[i].skuQty
                    }
                }
            } else if (!this.sizeCode && !!this.colorCode) {
                for (let i = 0; i < this.stockList.length; i++) {
                    if (this.stockList[i].colorCode === this.colorCode) {
                        stock += this.stockList[i].skuQty
                    }
                }
            } else if (!this.sizeCode && !this.colorCode) {
                stock = this.goodsStock
            }
            return stock
        },

        //  抵用券
        priceCoupon: function () {
            let coupon = ''
            if (this.coupons.length <= 0) {
                return coupon
            } else {
                for (let i = 0; i < this.coupons.length; i++) {
                    let item = this.coupons[i]
                    if (!item.discount && !!item.initialValue) {
                        return item
                    }
                }
                return coupon
            }
        },

        //  折扣券
        discountCoupon: function () {
            let coupon = ''
            if (this.coupons.length <= 0) {
                return coupon
            } else {
                for (let i = 0; i < this.coupons.length; i++) {
                    let item = this.coupons[i]
                    if (!!item.discount) {
                        return item
                    }
                }
                return coupon
            }
            return stock
        },

        ...mapState("user", ["userInfo"])
    },
    created() {
        this.goodsCode = this.$route.query.goodsCode
        this.goodsId = this.$route.query.goodsId
        this.type = null
        this.getGoodsInfo()
        this.getGoodsTree()
        //            this.getGoodsPromotion()
        this.shelvesInfo()
    },
    mounted() {
        this.$nextTick(() => {
            if (window._bd_share_main) {
                window._bd_share_main.init()
            }
        })
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
.crumbs {
    height: 50px;
    .crumbs-con {
        .crumbs-item {
            float: left;
            margin-right: 5px;
            line-height: 50px;
            font-size: $font-small;
            color: $text-primary;
            span {
                display: inline-block;
                cursor: pointer;
                transition: ease 0.3s;
                &:hover {
                    color: $color-golden;
                }
            }
            .icon-jiantou {
                margin-left: 5px;
                font-size: $font-smaller;
                line-height: 50px;
                color: $text-placeholder;
            }
            &:last-of-type {
                .icon-jiantou {
                    display: none;
                }
            }
        }
    }
}

.goods-con {
    width: 100%;
    overflow: hidden;
    position: relative;
    .goods-cover {
        overflow: hidden;
        .cover-main {
            width: 430px;
            height: 430px;
            border: solid 1px $color-line;
            overflow: hidden;
            margin-right: 15px;
            img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
        .cover-list {
            width: 78px;
            height: 430px;
            position: relative;
            overflow: hidden;
            .prev-btn {
                width: 78px;
                height: 15px;
                overflow: hidden;
                background: rgba(255, 255, 255, 0.9);
                position: absolute;
                top: 0;
                left: 0;
                z-index: 3;
                text-align: center;
                transform: rotate(180deg);
                cursor: pointer;
                .iconfont {
                    font-size: $font-small;
                    line-height: 1;
                    color: $color-black;
                }
            }
            .next-btn {
                width: 78px;
                height: 15px;
                overflow: hidden;
                background: rgba(255, 255, 255, 0.3);
                position: absolute;
                bottom: 0;
                left: 0;
                z-index: 3;
                text-align: center;
                cursor: pointer;
                .iconfont {
                    font-size: $font-small;
                    line-height: 1;
                    color: $color-black;
                }
            }
            ul {
                width: 78px;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2;
                .cover-item {
                    width: 78px;
                    height: 78px;
                    margin-bottom: 10px;
                    border: solid 1px $color-line;
                    overflow: hidden;
                    cursor: pointer;
                    img {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                    &.selected {
                        border-color: $color-golden;
                    }
                }
            }
        }
    }
    .goods-ensure {
        margin: 20px 0;
        position: relative;
        overflow: hidden;
        .ensure-item {
            float: left;
            width: 143px;
            height: 20px;
            position: relative;
            font-size: $font-small;
            line-height: 20px;
            color: $text-primary;
            text-align: center;
            overflow: hidden;
            span {
                vertical-align: top;
                margin-left: 10px;
            }
            &::after {
                content: "";
                display: block;
                position: absolute;
                width: 1px;
                height: 20px;
                top: 0;
                right: 0;
                background: $text-secondary;
                clear: both;
            }
            &:nth-of-type(3) {
                &::after {
                    display: none;
                }
            }
            .icon-ensure {
                width: 20px;
                height: 20px;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
                overflow: hidden;
                display: inline-block;
                &.bg-ensure {
                    background: url("../../assets/images/footer/ensure01.png")
                        no-repeat center;
                    background-size: contain;
                }
                &.bg-send {
                    background: url("../../assets/images/footer/ensure04.png")
                        no-repeat center;
                    background-size: contain;
                }
                &.bg-after-sale {
                    background: url("../../assets/images/footer/ensure02.png")
                        no-repeat center;
                    background-size: contain;
                }
            }
        }
    }
    .goods-info {
        position: relative;
        overflow: hidden;
        max-width: 618px;
        min-width: 360px;
        width: 100%;
        .goods-name {
            font-size: $font-title1;
            color: $text-primary;
        }
        .goods-panel {
            margin-top: 30px;
            width: 100%;
            padding: 30px 10px 20px 10px;
            background: $bg-color-secondary;
            overflow: hidden;
            border: solid 1px $color-line;
            .promotion-label {
                float: left;
                width: 60px;
                font-size: $font-small;
                color: $text-primary;
            }
        }
        .goods-price {
            .promotion-label {
                line-height: 30px;
            }
            .sale-price {
                font-size: $font-h2;
                color: $text-warn;
                line-height: 30px;
            }
            .tag-price {
                font-size: $font-small;
                color: $text-regular;
                line-height: 30px;
                text-decoration: line-through;
            }
        }
        .discount {
            margin-top: 14px;
            .coupons-list {
                position: relative;
                padding-right: 50px;
                max-width: 500px;
                height: 26px;
                overflow: hidden;
                &.all {
                    height: auto;
                }
                .more {
                    position: absolute;
                    top: 0;
                    right: 0;
                    font-size: $font-small;
                    line-height: 20px;
                    color: $text-warn;
                    cursor: pointer;
                    .icon-jiantou {
                        display: inline-block;
                        font-size: $font-smaller;
                        line-height: 20px;
                        transition: ease 0.3s;
                        &.rotate {
                            transform: rotate(90deg);
                        }
                    }
                }
                .coupons-item {
                    position: relative;
                    float: left;
                    font-size: $font-small;
                    line-height: 20px;
                    color: $text-warn;
                    margin-bottom: 6px;
                    margin-right: 10px;
                    cursor: pointer;
                    &::after {
                        content: "";
                        display: table;
                        clear: both;
                    }
                    .coupons-name {
                        max-width: 320px;
                        padding-left: 6px;
                        height: 20px;
                        border: solid 1px $text-warn;
                        border-right: none;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .coupons-val {
                        max-width: 320px;
                        padding: 0 10px;
                        height: 20px;
                        border: solid 1px $text-warn;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .receive-btn {
                        width: 46px;
                        height: 20px;
                        padding-right: 6px;
                        text-align: right;
                        background: url("../../assets/images/goods/receive.png")
                            no-repeat center;
                        cursor: pointer;
                    }
                }
            }
        }
        .gifts {
            margin-top: 14px;
            .promotion-list {
                max-width: 510px;
                overflow: hidden;
                .promotion-item {
                    float: left;
                    max-width: 182px;
                    height: 40px;
                    overflow: hidden;
                    margin-bottom: 10px;
                    margin-right: 18px;
                    font-size: $font-small;
                    line-height: 20px;
                    color: $text-primary;
                    &::after {
                        content: "";
                        display: table;
                        clear: both;
                    }
                    .promotion-cover {
                        width: 40px;
                        height: 40px;
                        margin-right: 6px;
                        img {
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .promotion-name {
                        max-width: 125px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
        .size-con {
            margin-top: 14px;
            line-height: 32px;
            overflow: hidden;
            .con-label {
                float: left;
                margin-top: 6px;
            }
            ul {
                width: calc(100% - 60px);
                .size-item {
                    float: left;
                    min-width: 40px;
                    text-align: center;
                    font-size: $font-small;
                    line-height: 32px;
                    color: $text-primary;
                    border: solid 1px $color-line;
                    padding: 0 4px;
                    margin: 6px 8px 0 0;
                    cursor: pointer;
                    transition: ease 0.3s;
                    &:hover {
                        color: $color-golden;
                    }
                    &.selected {
                        color: $color-golden;
                        border-color: $color-golden;
                    }
                    &.disabled {
                        color: $text-secondary !important;
                        border: dashed 1px $color-disabled !important;
                    }
                }
            }
        }
        .color-con {
            margin-top: 14px;
            line-height: 32px;
            overflow: hidden;
            .con-label {
                float: left;
                margin-top: 6px;
            }
            ul {
                .color-img {
                    float: left;
                    margin: 6px 10px 0 0;
                    width: 50px;
                    height: 50px;
                    border: solid 1px $color-line;
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                    img {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                    &.selected {
                        border-color: $color-golden;
                    }
                    .selected-btn {
                        width: 14px;
                        height: 14px;
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        background: url("../../assets/images/shoppingCart/selected.png")
                            no-repeat center;
                    }
                    &.disabled {
                        color: $text-secondary !important;
                        border: dashed 1px $color-disabled !important;
                    }
                }
            }
        }
        .amount-con {
            margin-top: 20px;
            line-height: 32px;
            overflow: hidden;
            .inputNumber {
                width: 135px;
                height: 32px;
                overflow: hidden;
            }
        }
    }
    .goods-btns {
        margin-top: 20px;
        /*overflow: hidden;*/
        .buy-btn {
            float: left;
            width: 168px;
            height: 49px;
            margin-bottom: 10px;
            font-size: $font-common;
            line-height: 49px;
            color: $color-white;
            text-align: center;
            background: $color-golden;
            cursor: pointer;
        }
        .cart-btn {
            float: left;
            width: 168px;
            height: 49px;
            margin-left: 10px;
            margin-bottom: 10px;
            font-size: $font-common;
            line-height: 49px;
            color: $color-golden;
            text-align: center;
            background: $bg-color-secondary;
            border: solid 1px $color-golden;
            cursor: pointer;
        }
        .unshelves-btn{
            float: left;
            width: 168px;
            height: 49px;
            margin-bottom: 10px;
            font-size: $font-common;
            line-height: 49px;
            color: $color-white;
            text-align: center;
            background: $color-disabled;
            cursor: pointer;
        }
        .handle-btn {
            float: left;
            width: 49px;
            height: 49px;
            margin-left: 10px;
            margin-bottom: 10px;
            text-align: center;
            /*overflow: hidden;*/
            border: solid 1px $color-line;
            cursor: pointer;
            .icon-box {
                margin-top: 5px;
                .iconfont {
                    font-size: $font-regular;
                    line-height: 1;
                    color: $text-secondary;
                }
            }
            p {
                margin-top: 5px;
                font-size: $font-small;
                line-height: 1;
                color: $text-secondary;
            }
            &.share-btn {
                position: relative;
                .bdsharebuttonbox {
                    position: absolute;
                    display: block;
                    top: -30px;
                    left: 0;
                    width: 100px;
                    height: 30px;
                    display: none;
                }
                &:hover {
                    .bdsharebuttonbox {
                        display: block;
                    }
                }
            }
        }
    }
}

.shop-recommend {
    margin-top: 30px;
}

.goods-info-detail {
    width: 100%;
    margin-top: 30px;
    margin-bottom: 50px;
    position: relative;
    overflow: hidden;
    .detail-tab-con {
        width: 100%;
        height: 45px;
        border: solid 1px $color-line;
        background: $bg-color-regular;
        .tab-item {
            float: left;
            width: 167px;
            height: 43px;
            font-size: $font-small;
            line-height: 45px;
            text-align: center;
            color: $text-primary;
            background: $bg-color-regular;
            transition: ease 0.3s;
            cursor: pointer;
            &:hover {
                color: $color-golden;
            }
            &.selected {
                border-top: solid 1px $color-golden;
                border-left: solid 1px $color-line;
                border-right: solid 1px $color-line;
                color: $color-golden;
                background: $color-white;
            }
            &:first-child {
                &.selected {
                    border-left: none;
                }
            }
        }
    }
    .goods-title {
        width: 100%;
        padding: 10px;
        overflow: hidden;
        border: solid 1px $color-line;
        border-top: none;
    }
    .goods-comment {
        width: 100%;
        padding: 10px;
        overflow: hidden;
        border: solid 1px $color-line;
        border-top: none;
    }
}

@media screen and (max-width: 1199px) {
    .goods-con {
        .goods-info {
            max-width: 380px;
            .goods-btns {
                .favor-btn {
                    margin-left: 0;
                }
            }
            .discount {
                .coupons-list {
                    .coupons-item {
                        .coupons-name {
                            max-width: 140px;
                        }
                    }
                }
            }
        }
    }
}
</style>
