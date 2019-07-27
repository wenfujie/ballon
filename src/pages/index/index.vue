/*
* createTime：2019/1/16
* author：en.chen
* description:  商城首页
*/
<template>
    <div class="index">

        <!-- 轮播图模块 begin -->
        <div class="banner" v-if="banners.length >0">
            <swiper :options="bannerSwiperOption" id="banner-box" class="banner-box" ref="bannerSwiper" >

                <!-- 轮播图 begin -->
                <swiper-slide v-for="(item,index) in banners" class="banner-list" :key="index" v-if="index<6">
                    <img :data-index="index" v-if="!!item.coverFileUrl" v-lazy="getImg(item.coverFileUrl)" :key="item.coverFileUrl" alt=""  @click="goPage(item.url)" >
                </swiper-slide>
                <!-- 轮播图 end -->

                <!-- 返回按钮 -->
                <div id="prev-btn" class="swiper-button-prev" slot="button-prev">
                    <div></div>
                    <i class="iconfont icon-bannerjiantou"></i>
                </div>
                <!-- 返回按钮-->

                <!-- next按钮 begin -->
                <div id="next-btn" class="swiper-button-next" slot="button-next">
                    <div></div>
                    <i class="iconfont icon-bannerjiantou"></i>
                </div>
                <!--  next按钮 end-->

                <!-- 分页器 begin -->
                <div class="swiper-pagination" slot="pagination"></div>
                <!-- 分页器 end -->
            </swiper>
        </div>
        <!-- 轮播图模块 end-->

        <!-- 首页模块内容 begin -->
        <div class="wrapper">

            <!-- 本周新品01 begin -->
            <div class="new-goods new-goods01" v-if="!!newGoods1.goodsList && newGoods1.goodsList.length>0">
                <h2 class="part-title">{{newGoods1.covername}}</h2>
                <div class="part-title-detail clearfix">
                    <div class="pointer fl">
                        <p class="fl font-bold">{{newGoods1.memo}}</p>
                        <p class="more fl" @click="routerLink(newGoods1.url)"><span>more</span><i class="iconfont icon-jiantou"></i></p>
                    </div>
                </div>
                <!-- 新品列表 begin -->
                <ul class="part-list clearfix" v-show="newGoods1.goodsList">
                    <li class="part-item" v-for="(item,index) in newGoods1.goodsList" :key="item.id" @click="goDetail(item)" v-if="index < 6">
                        <div class="part-cover">
                            <img v-lazy="getImg(item.goodsFilePath)" :alt="$t('index.goodsCover')" />
                        </div>
                        <div class="goods-info text-primary">
                            <div class="goods-info-left">{{item.goodsName}}</div>
                            <div class="goods-info-right mg-l10">￥{{item.salePrice | Fix2}}</div>
                        </div>
                    </li>
                </ul>
                <!-- 新品列表 end -->
            </div>
            <!-- 本周新品01 end-->

            <!-- 本周新品02 begin -->
            <div class="new-goods new-goods02" v-if="!!newGoods2.goodsList && newGoods2.goodsList.length>0">
                <h2 class="part-title">{{newGoods2.covername}}</h2>
                <div class="part-title-detail clearfix">
                    <div class="pointer fl">
                        <p class="fl font-bold">{{newGoods2.memo}}</p>
                        <p class="more fl" @click="routerLink(newGoods2.url)"><span>more</span><i class="iconfont icon-jiantou"></i></p>
                    </div>
                </div>
                <!-- 新品列表 begin -->
                <ul class="part-list clearfix">
                    <li class="part-item" v-for="(item,index) in newGoods2.goodsList" :key="item.id" @click="goDetail(item)" v-if="index < 6">
                        <div class="part-cover">
                            <img v-lazy="getImg(item.goodsFilePath)" :alt="$t('index.goodsCover')" />
                        </div>
                        <div class="goods-info text-primary">
                            <div class="goods-info-left">{{item.goodsName}}</div>
                            <div class="goods-info-right mg-l10">￥{{item.salePrice | Fix2}}</div>
                        </div>
                    </li>
                </ul>
                <!-- 新品列表 end -->
            </div>
            <!-- 本周新品02 end-->

            <!-- 热卖单品推荐 begin -->
            <div class="recommend-box" v-if="!!hotGoods.goodsList && hotGoods.goodsList.length>0">
                <h2 class="recommend-title">{{hotGoods.covername}}</h2>
                <div class="recommend-list flex-box">
                    <div class="recommend-goods" v-for="(item,index) in hotGoods.goodsList" v-if="index<4" @click="goDetail(item)">
                        <div class="goods-cover">
                            <img v-lazy="getImg(item.goodsFilePath)" />
                        </div>
                        <p class="font-title1 text-primary goods-name">{{item.goodsName}}</p>
                        <p class="font-title1 text-primary goods-price">￥{{item.salePrice | Fix2}}</p>
                    </div>
                </div>
                <div class="recommend-more" @click="routerLink(hotGoods.url)"><span>{{$t('index.more')}}<i class="iconfont icon-jiantou"></i></span></div>
            </div>
            <!-- 热卖单品推荐 end -->
        </div>
        <!-- 首页模块内容 end -->

    </div>
</template>
<script>
    import { Cms } from '../../api/service'
    import Storage from "../../utils/storage"
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import 'swiper/dist/css/swiper.css'
    export default {
        name: 'index',
        components: {
            swiper,
            swiperSlide
        },
        data() {
            return {
                pageTitle:  !!this.$route.meta.title ? this.$route.meta.title : this.$t('titles.index'),
                //  广告轮播配置
                bannerSwiperOption: {
                    direction: 'horizontal',  // 水平(horizontal)、垂直(vertical)
                    autoplay: true,  // 是否自动轮播
                    time: 5000,  // 轮播的时间间隔
                    speed: 300,  // 轮播的速度
                    pagination: {
                        el: '.swiper-pagination',   //  轮播图下的圆点提示
                        clickable: true  // 点击切换banner
                    },
                    prevButton: {
                        el:'.swiper-button-prev',  // 前进按钮
                    },
                    nextButton:{
                        el: '.swiper-button-next',  // 后退按钮
                    },
                    paginationClickable :true,  // 分页器是否允许点击
                    loop: false,  // 是否循环播放
                    observer: true,  //修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true,  // 当Swiper的父元素变化时，例如window.resize，Swiper更新
                    mousewheelControl : true,  // 开启鼠标滚轮控制Swiper切换
                },
                //  广告轮播图数据
                banners:[],
                newGoods1: {},  // 本周新品01模块
                newGoods2: {},  // 本周新品02模块
                hotGoods: {},  // 热卖单品模块
            }
        },
        metaInfo() {
            return {
                title: this.pageTitle,
                meta: [    // set meta
                    {
                        name: 'keyWords',
                        content: this.$t('titles.index')
                    }
                ]
            }
        },
        methods: {
            // 页面初始化
            pageInit(){
                if(!Storage.get('TEMPLATE_INFO')) {
                    Cms.getTemplate({
                        busContsCode: Storage.get('properties').busContsCode,
                        shopId: Storage.get('properties').shopId
                    }).then((res) => {
                        if(!!res[0]) {
                            Storage.set("TEMPLATE_INFO", res[0])
                        }else{
                            Storage.set("TEMPLATE_INFO", res)
                        }
                        this.getPage()
                    })
                }else{
                    this.getPage()
                }
            },

            //  获取页面数据
            getPage(){
                window.c_showLoading()
                let data = {
                    cmsTemplateCode: Storage.get('TEMPLATE_INFO').cmsTemplateCode,
                    cmsWebCode: pageCode.index.name,
                    busContsCode: Storage.get('properties').busContsCode
                }
                Cms.getUsrCmsInfoV2(data).then(async (res)=> {
                    if(!res.cmsModulepageHdList || res.cmsModulepageHdList.length <= 0) return
                    let moduleData = res.cmsModulepageHdList[0].cmsBackpageDtDtoList;  //正确格式
                    let pageCodeList = []
                    moduleData.forEach((item) =>{
                        switch (item.cmsBackpageDtCode){
                            case pageCode.index.children.blpclbt01:  // banner模块
                                if(!!item.cmsBackpageDttList && !!item.cmsBackpageDttList.length) {
                                    this.banners = item.cmsBackpageDttList
                                    this.$nextTick(() =>{
                                        this.swipperInit()
                                    })
                                }
                                break
                            case pageCode.index.children.bzxp01:  // 本周新品01
                                if(!!item.cmsBackpageDttList && !!item.cmsBackpageDttList[0]) {
                                    this.newGoods1 = item.cmsBackpageDttList[0]
                                    pageCodeList.push(pageCode.index.children.bzxp01)
//                                    this.getPagePart(pageCode.index.children.bzxp01,'newGoods1')
                                }
                                break
                            case pageCode.index.children.bzxp02:  // 本周新品02
                                if(!!item.cmsBackpageDttList && !!item.cmsBackpageDttList[0]) {
                                    this.newGoods2 = item.cmsBackpageDttList[0]
                                    pageCodeList.push(pageCode.index.children.bzxp02)
//                                    this.getPagePart(pageCode.index.children.bzxp02,'newGoods2')
                                }
                                break
                            case pageCode.index.children.rmdp:  // 热卖单品
                                if(!!item.cmsBackpageDttList && !!item.cmsBackpageDttList[0]) {
                                    this.hotGoods = item.cmsBackpageDttList[0]
                                    pageCodeList.push(pageCode.index.children.rmdp)
//                                    this.getPagePart(pageCode.index.children.rmdp,'hotGoods')
                                }
                                break
                        }
                    })

                    //  获取首页模块内容
                    this.$all(pageCodeList.map((item) =>{
                        if(item === pageCode.index.children.bzxp01){
                            return this.getPagePart(pageCode.index.children.bzxp01,'newGoods1')
                        }
                        if(item === pageCode.index.children.bzxp02){
                            return this.getPagePart(pageCode.index.children.bzxp02,'newGoods2')
                        }
                        if(item === pageCode.index.children.rmdp){
                            return this.getPagePart(pageCode.index.children.rmdp,'hotGoods')
                        }
                    }))
                    window.c_showLoading(false)
                })
            },

            //  获取模块元素
            getPagePart(cmsWebItemCode,map){
                let data = {
                    cmsTemplateCode: Storage.get('TEMPLATE_INFO').cmsTemplateCode,  // 模板编号
                    cmsWebCode: pageCode.index.name,  // 页面编号
                    cmsWebItemCode: cmsWebItemCode,  // 页面元素编号
                    busContsCode: Storage.get('properties').busContsCode,
                    shopId: Storage.get('properties').shopId,
                }
                Cms.getChoosebuyGoods(data).then((res) => {
                    this[map].goodsList = !!res[0].goodsList ? res[0].goodsList :[]
                    this[map] = JSON.parse(JSON.stringify(this[map]))
                })
            },

            // 初始化轮播
            swipperInit(){

                let that = this

                // 鼠标覆盖停止自动切换
                this.swiper.el.onmouseover = function () {
                    this.swiper.autoplay.stop();
                }

                // 鼠标离开开始自动切换
                this.swiper.el.onmouseout = function () {
                    this.swiper.autoplay.start()
                }

                // 前进按钮
                document.getElementById('prev-btn').onclick = function () {
                    that.swiper.slidePrev()
                }

                // 后退按钮
                document.getElementById('next-btn').onclick = function () {
                    that.swiper.slideNext()
                }
            },

            // 项目路由跳转
            routerLink(url){
                if(!!url) this.$router.push(url)
            },

            // 点击商品跳转
            goDetail(item) {
                console.log(item)
                let url = ''
                if(item.orderFlag === 0) {
                    url = '/goods-detail?goodsCode=' + item.goodsCode + '&goodsId=' + item.ptiPartHdId
                }else{
                    url = '/goods-design?goodsCode=' + item.goodsCode + '&goodsId=' + item.ptiPartHdId
                }
                this.routerLink(url)
            }
        },
        created() {
        },
        mounted(){
            this.pageInit()
        },
        computed: {
            swiper() {
                return this.$refs.bannerSwiper.swiper
            }
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
    .banner{
        width: 100%;
        height: 540px;
        overflow: hidden;
        /deep/.swiper-pagination {
            .swiper-pagination-bullet-active {
               background:rgba(49,49,49,1);
            }
        }
        .swiper-button-prev, .swiper-button-next{
            width: 59px;
            height: 72px;
            // background:rgba(0,0,0,1)
            > div{
                width: 59px;
                height: 72px;
                background:rgba(0,0,0,1);
                opacity: 0.2;
                border-radius:5px;
            }
            i{
                font-size: 52px;
                color: $text-white;
                position: absolute;
                top: -3px;
                left: 3px;
            }
        }
        .swiper-button-prev{
            i{
                top: -3px;
                left: 3px;
                transform: rotate(180deg);
                -webkit-transform: rotate(180deg);
                -moz-transform: rotate(180deg);
                -ms-transform: rotate(180deg);
                -o-transform: rotate(180deg);
            }
        }
        .banner-list{
            width: 100%;
            height: 540px;
            overflow: hidden;
            img{
                display: block;
                width: 100%;
                height: 100%;
            }
        }
        #next-btn.swiper-button-next{
            right: 50px;
        }
    }
    .new-goods{
        margin-top: 60px;
        overflow: hidden;
        .part-title{
            font-size: $font-h1;
            line-height: 1;
            color: $color-dark;
        }
        .part-title-detail{
            padding-top: 5px;
            font-size: $font-title1;
            line-height: 20px;
            color: $color-dark;
            .more{
                margin-left: 15px;
                padding: 0 12px 0 15px;
                color: $color-white;
                background: $color-black;
                font-weight: normal;
                .icon-jiantou{
                    font-size: 14px;
                }
            }
        }
        .part-list{
            margin-top: 30px;
            overflow: hidden;
            .part-item{
                float: left;
                width: 380px;
                height: 420px;
                margin-bottom: 75px;
                overflow: hidden;
                cursor: pointer;
                &:nth-of-type(3n-1){
                    margin-left: 30px;
                    margin-right: 30px;
                }
                .part-cover{
                    width: 100%;
                    height: 380px;
                    overflow: hidden;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                .goods-info{
                    display: flex;
                    justify-content: space-between;
                    font-size: $font-title1;
                    line-height: 24px;
                    text-align: center;
                    margin-top: 16px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    .goods-info-left{
                        width:100%;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                        font-weight: bolder;
                    }
                    .goods-info-right{
                        flex-shrink: 0;
                        width: 110px;
                    }
                }
            }
        }
    }
    .recommend-box{
        margin: 100px 0 76px 0;
        overflow: hidden;
        .recommend-title{
            font-size: $font-title1;
            line-height: 1;
            color: $color-dark;
            text-align: center;
        }
        .recommend-list{
            width: 100%;
            margin-top: 50px;
            .recommend-goods{
                flex: 1;
                max-width: 245px;
                margin-right: 70px;
                background: $bg-color-regular;
                text-align: center;
                line-height: 1.5;
                cursor: pointer;
                overflow: hidden;
                .goods-cover{
                    width: 100%;
                    height: 245px;
                    max-height: 245px;
                    overflow: hidden;
                    img{
                        display: block;
                        width: 100%;
                    }
                }
                .goods-name{
                    margin-top: 22px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .goods-price{
                    margin-bottom: 50px;
                }
                &:last-child{
                    margin-right: 0;
                }
            }
        }
        .recommend-more{
            width: 150px;
            height: 32px;
            margin: 50px auto 0 auto;
            border: solid 1px $text-primary;
            text-align: center;
            font-size: $font-title1;
            line-height: 32px;
            color: $text-primary;
            cursor: pointer;
            font-weight: bold;
            vertical-align: top;
            span{
                vertical-align: inherit;
            }
            .icon-jiantou{
                vertical-align: text-bottom;
            }
        }
    }
    @media screen and (max-width: 1199px) {
        .banner{
            min-width: 990px;
            height: 445.5px;
            .banner-list{
                min-width: 990px;
                height: 445.5px;
            }
        }
        .new-goods{
            .part-list{
                .part-item{
                    width: 315px;
                    height: 355px;
                    margin-bottom: 50px;
                    &:nth-of-type(3n-1){
                        margin-left: 12.5px;
                        margin-right: 12.5px;
                    }
                    .part-cover{
                        width: 100%;
                        height: 315px;
                    }
                }
            }
        }
        .recommend-box{
            .recommend-list{
                min-width: 990px;
                .recommend-goods{
                    margin-right: 35px;
                    .goods-cover{
                        height: 195px;
                        max-height: 195px;
                    }
                }
            }
        }
        .recommend-more{
            margin-top: 30px;
        }
    }
</style>
