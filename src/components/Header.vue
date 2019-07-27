/*
* createTime：2019/1/18
* author：en.chen
* description:  网页头部导航、搜索框、分类
*/
<template>
    <div>
        <!--网页头部 begin-->
        <header class="header bg-color-white">

            <!-- 顶部导航栏 begin-->
            <div class="header-top  bg-color-golden">
                <div class="wrapper">
                    <div class="top-nav clearfix">

                        <!-- 左侧导航 begin -->
                        <ul class="top-nav-menu fl clearfix">
                            <li>
                                <span class="mg-r10">Hi</span>
                                <span v-if="isLogin">
                                    <router-link to="/member-center">{{userInfo.vipAccount}}</router-link>
                                    <a class="pointer" @click="logout">{{$t('header.logout')}}</a>
                                </span>
                            </li>
                            <li v-if="!isLogin">
                                <router-link :to="{path: 'login', query:{ 'successUrl' : ($route.fullPath.indexOf('login') === -1 && $route.fullPath.indexOf('register') === -1) ? $route.fullPath : 'index'} }" class="color-white top-nav-btn">{{$t('header.login')}}</router-link>
                                <router-link to="/register" class="color-white top-nav-btn">{{$t('header.register')}}</router-link>
                            </li>
                        </ul>
                        <!-- 左侧导航 end -->

                        <!-- 右侧导航 begin -->
                        <ul class="top-nav-menu fr clearfix">
                            <li>
                                <a @click="checkLogin('/order-list')" class="color-white top-nav-btn pointer">{{$t('header.myOrder')}}</a>
                                <!--<router-link to="/" class="color-white top-nav-btn">{{$t('header.customer')}}</router-link>-->
                                <!--<router-link to="/" class="color-white top-nav-btn">{{$t('header.help')}}</router-link>-->
                            </li>
                            <li>
                                <!--<div class="pointer mobile-btn">-->
                                <!--<i class="iconfont icon-shouji"></i>{{$t('header.mobile')}}-->
                                <!--<div id="qrcode" class="qr-code position-absolute animated fadeIn">-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--<span class="mg-l40">{{$t('header.simpleChinese')}}</span>-->
                                <!--<router-link to="/" class="color-white top-nav-btn">简体中文</router-link>-->
                            </li>
                        </ul>
                        <!-- 右侧导航 end -->

                    </div>
                </div>
            </div>
            <!-- 顶部导航栏 end -->

            <!--头部内容 begin-->
            <div class="header-con">
                <div class="wrapper position-relative">

                    <!--logo begin-->
                    <router-link to="/" tag="div" class="logo position-absolute pointer">
                        <img src="../assets/logo.png" alt="logo"/>
                    </router-link>
                    <!-- logo end -->

                    <!-- 搜索框模块 begin -->
                    <div class="search-form position-absolute">
                        <div class="clearfix">
                            <input @input="filterKeyWord" type="text" v-model="keyWord" class="search-box fl font-small" :placeholder="!!this.defaultWords ? this.defaultWords : $t('header.searchTip')" @keyup.enter="searchGoods">
                            <div class="search-btn fl pointer" @click="searchGoods">
                                <i class="iconfont icon-sousuo search-icon"></i>
                            </div>
                        </div>
                        <ul class="hot-goods-list clearfix" v-if="hotGoodsList.length>0">
                            <li v-for="item in hotGoodsList" v-if="!!item.searchWord" @click="searchWord(item)">{{item.searchWord}}</li>
                        </ul>
                    </div>
                    <!-- 搜索框模块 end -->

                    <!-- 购物车按钮组 begin -->
                    <div class="shopping-cart position-absolute font-small" @click="checkLogin('/shopping-cart')">
                        <i class="iconfont icon-gouwuche"></i>
                        <span class="my-cart">{{$t('header.shoppingCart') + (!!$store.state.user.shoppingCartNum ? `(${$store.state.user.shoppingCartNum})` : '')}}</span>
                    </div>
                    <!-- 购物车按钮组 end -->

                </div>
            </div>
            <!--头部内容 end-->

            <!--导航栏 begin-->
            <div class="header-nav">
                <div class="wrapper">
                    <ul class="nav-list clearfix">
                        <li class="nav-list-item sort">
                            <span class="pointer all">{{$t('header.sort')}}</span>

                            <!-- 一级分类 begin -->
                            <ul class="sort-list">
                                <li class="sort-list-item" v-for="item in platFormList" :key="item.id">
                                    <span class="pointer" @click="routerLink('/goods-list',{classId: item.cmsBusconclaHdCode})">{{item.cmsBusconclaHdName}}</span>
                                    <!-- 二级分类 begin -->
                                    <div class="category-content position-absolute bg-color-white clearfix" v-show="item.childs.length!=0">
                                        <div class="sort-con fl">
                                            <div class="sort-con-item flex-box" v-for="sort in item.childs" v-show="item.childs.length > 0">

                                                <!-- 三级分类 begin -->
                                                <h3 class="sort-con-title font-small text-primary bold" @click="routerLink('/goods-list',{classId: sort.cmsBusconclaHdCode})">{{sort.cmsBusconclaHdName}}</h3>
                                                <ul class="sort-con-list flex-box flex-wrap flex-auto font-small text-regular">
                                                    <li class="item" v-for="sortItem in sort.childs" :key="sortItem.id" v-show="sort.childs.length > 0" @click="routerLink('/goods-list',{classId: sortItem.cmsBusconclaHdCode})">{{sortItem.cmsBusconclaHdName}}</li>
                                                </ul>
                                                <!-- 三级分类 end -->
                                            </div>
                                        </div>

                                        <!-- 广告图 begin -->
                                        <div class="ad-con bg-color-regular fr"></div>
                                        <!-- 广告图 end -->

                                    </div>
                                    <!-- 二级分类 end -->
                                </li>
                            </ul>

                            <!-- 一级分类 end -->

                        </li>
                        <div class="nav-menu"><li class="nav-list-item" v-for="(item, index) in nav" :key="index" @click="goPage(item.navigatUrl)">{{item.cmsNavigatHdName}}</li></div>
                    </ul>
                </div>
            </div>
            <!--导航栏 end-->

        </header>
        <!--网页头部 end-->
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import Storage from "../utils/storage"
    import QRCode from 'qrcodejs2'
    import { Cms , Goods, UserService } from '../api/service'
    export default {
        name: 'Header',
        data() {
            return {
//                userInfo: null,  // 用户信息
                keyWord: '',  // 搜索词
                defaultWords: '',  // 默认搜索词
                defaultWordsUrl: null,  // 默认搜索词配置的跳转链接
                hotGoodsList:[],  // 热搜商品列表
                platFormList:[],  // 平台运营分类列表
                nav: [] // 导航数据
            }
        },
        methods: {

            //  生成移动端二维码
            qrCodeInit(){
                let mobileCode = new QRCode('qrcode', {
                    width: 120,
                    height: 120,
                    text: window.location.href, // 二维码地址
                    colorDark : "#000",
                    colorLight : "#fff",
                })
            },

            //  获取热门商品及默认搜索词
            getHotGoodsList () {
                let data = {
                    isShop: 1
                }
                Goods.getHotGoods(data).then((res)=>{
                    res.forEach((item) => {
                        if(item.searchWordTypeCode === 'D_SCPRESET') {
                            let timeStart = new Date().getTime()
                            let timeEnd = new Date(Date.parse(item.invalidTime.replace(/-/g,"/"))).getTime()
                            if(timeStart <= timeEnd) {
                                this.defaultWords = item.searchWord
                                this.defaultWordsUrl = item.searchWordUrl
                            }
                        }else{
                            this.hotGoodsList.push(item)
                        }
                    })
                })
            },

            //  点击热门商品的跳转
            searchWord(item){
                if(!!item.searchWordUrl){
                    // 跳转后台配置的url
                    let linkUrl = item.searchWordUrl
                    if(linkUrl.indexOf('http://') === -1 && linkUrl.indexOf('https://') === -1) {
                        this.$router.push(linkUrl)
                    }else{
                        window.location.href = linkUrl
                    }
                }else{
                    this.keyWord = item.searchWord
                    // 不存在外链跳转商品列表
                    this.$router.push('/goods-list?keyWord=' + item.searchWord)
                }
            },

            //  搜索商品
            searchGoods(){
                //  一期搜索
//                let keyWord = !!this.keyWord ? this.keyWord : this.defaultWords
//                this.$store.commit('goods/setCrumbsCache',[])
//                this.$router.push('/goods-list?keyWord=' + keyWord + '&timestamp=' +(new Date()).getTime())

                //  二期搜索（默认搜索词配置链接优先跳转）
                if(!!this.defaultWordsUrl) {
                    // 没有关键词跳转默认搜索词的链接
                    if(!this.keyWord) {
                        if (this.defaultWordsUrl.indexOf('http://') === -1 && this.defaultWordsUrl.indexOf('https://') === -1) {
                            this.$router.push(this.defaultWordsUrl)
                        } else {
                            window.location.href = this.defaultWordsUrl
                        }
                    }else{
                        //  关键词与默认搜索词相同，跳转默认搜索词的链接
                        if(this.keyWord === this.defaultWords) {
                            if (this.defaultWordsUrl.indexOf('http://') === -1 && this.defaultWordsUrl.indexOf('https://') === -1) {
                                this.$router.push(this.defaultWordsUrl)
                            } else {
                                window.location.href = this.defaultWordsUrl
                            }
                        }else{
                            let keyWord = this.keyWord
//                            this.$store.commit('goods/setData',{
//                                storeKey: 'keyWords', storeValue: keyWord
//                            })
                            this.$store.commit('goods/setCrumbsCache',[])
                            this.$router.push('/goods-list?keyWord=' + keyWord + '&timestamp=' +(new Date()).getTime())
                        }
                    }
                }else {
                    let keyWord = !!this.keyWord ? this.keyWord : this.defaultWords
//                    this.$store.commit('goods/setData',{
//                        storeKey: 'keyWords', storeValue: keyWord
//                    })
                    this.$store.commit('goods/setCrumbsCache',[])
                    this.$router.push('/goods-list?keyWord=' + keyWord + '&timestamp=' +(new Date()).getTime())
                }
            },

            //  路由跳转
            routerLink(url,params){
                this.$router.push({
                    path: url,
                    query: !!params ? params : ''
                })
            },

            // 获取nav导航内容
            getNavData(){
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
                        let param = {
                            cmsTemplateCode: Storage.get('TEMPLATE_INFO').cmsTemplateCode,
                            busContsCode: baseConstant.busContsCode || Storage.get('properties').busContsCode
                        }
                        Cms.getNavigation(param).then(res=>{
                            this.nav = res
                        })
                    })
                }else{
                    let param = {
                        cmsTemplateCode: Storage.get('TEMPLATE_INFO').cmsTemplateCode,
                        busContsCode: baseConstant.busContsCode || Storage.get('properties').busContsCode
                    }
                    Cms.getNavigation(param).then(res=>{
                        this.nav = res
                    })
                }
            },

            // 获取平台运营分类
            getLayerClass(){
                let data = {
                    busContsCode: Storage.get('properties').busContsCode,
                    layer: '4'
                }
                Goods.getGoodsLayerClass(data).then((res) => {
                    if(res[0].childs.length > 18){
                        res[0].childs.length = 18
                    }
                    this.platFormList = res[0].childs
                })
            },

            // 获取用户信息
            initUserInfo() {
                this.$store.dispatch('user/getUserInfo')
            },

            // 退出登陆
            logout(){
                this.$confirm('确定退出登录嘛', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    c_logOut();
                    this.$store.commit('user/logout')
                    this.$router.push('/login')
                }).catch(() => {
                })
            },

            // 国际化切换
            switchLang(){
                if(this.$i18n.locale == 'cn'){
                    this.$i18n.locale = 'en'
                } else {
                    this.$i18n.locale = 'cn'
                }
            },

            // 检查登陆及路由跳转
            checkLogin(path){
                if(!Storage.get('USER_INFO')) {
                    this.$router.push('/login?successUrl=' + path)
                }else{
                    this.$router.push(path)
                }
            },

            // 搜索词过滤
            filterKeyWord(){
                this.keyWord = this.keyWord.replace(/(^\s+)|(\s+$)/g,"");
            },
        },
        created() {
            this.keyWord = !!this.$route.query.keyWord ? this.$route.query.keyWord : ''
            this.getHotGoodsList()
            this.initUserInfo()
        },
        mounted() {
            this.getNavData()
//            this.qrCodeInit()
            this.getLayerClass()
        },
        computed:{
            ...mapState('user', ['userInfo']),
            'isLogin': function () {
                return !!this.userInfo? true : false
            },

        },
        watch: {
            '$route': function (to,from) {
                this.keyWord = !!this.$route.query.keyWord ? this.$route.query.keyWord : ''
                if(to.path != '/goods-list') {
                    this.keyWord = ''
                }
            }
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
    .header{
        width: 100%;
        height: 200px;
        z-index: 999;
    }
    .header .header-top{
        width: 100%;
        height: 50px;
        .top-nav{
            width: 100%;
            padding: 10px 0;
            font-size: $font-small;
            line-height: 30px;
            color: $color-white;
            .top-nav-menu li{
                float: left;
                a{
                    margin-left: 10px;
                    color: $color-white;
                    border-bottom: solid 1px $color-white;
                }
                .mobile-btn{
                    display: inline-block;
                    position: relative;
                    margin-left: 26px;
                    .qr-code{
                        display: none;
                        width: 136px;
                        height: 136px;
                        padding: 8px;
                        top: 40px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: $color-white;
                        z-index: 2;
                        &:before{
                            position: absolute;
                            top: -8px;
                            left: 50%;
                            transform: translate(-50%);
                            content: '';
                            width:0;
                            height:0;
                            border-width:0 8px 8px;
                            border-style: none solid solid;
                            border-color: transparent transparent $color-white;
                        }
                    }
                    &:hover {
                        .qr-code{
                            display: inline-block;
                        }
                    }
                }
            }
            .top-nav-menu.fr li{
                a{
                    margin-left: 40px;
                }
            }
        }
    }
    .header .header-con{
        height: 100px;
        overflow: hidden;
        background: $color-white;
        .logo{
            // width: 172px;
            // height: 52px;
            overflow: hidden;
            left: 0;
            // top: 24px;
            img{
                display: block;
                width: 100%;
                // height: 100%;
                cursor: pointer;
            }
        }
        .search-form{
            width: 470px;
            left: 460px;
            top: 22px;
            overflow: hidden;
            .search-box{
                width: 405px;
                height: 34px;
                padding: 0 10px;
                border: solid 2px $color-black;
                font-size: 14px;
                line-height: 14px;
            }
            .search-box:focus {
                outline:none;
            }
            .search-btn{
                width: 65px;
                height: 34px;
                overflow: hidden;
                background: $color-black;
                text-align: center;
                .search-icon{
                    font-size: 22px;
                    line-height: 34px;
                    color: $color-white;
                }
            }
            .hot-goods-list{
                width: 100%;
                height: 24px;
                overflow: hidden;
                li{
                    float: left;
                    margin: 10px 14px 0 0;
                    font-size: 12px;
                    line-height: 14px;
                    color: $text-regular;
                    cursor: pointer;
                    transition: all .3s;
                    &:hover{
                        color: $color-golden;
                    }
                }
            }
        }
        .shopping-cart{
            top: 21px;
            right: 68px;
            width: 156px;
            height: 44px;
            text-align: center;
            background: $color-white;
            line-height: 44px;
            color: $text-secondary;
            border: solid 1px $color-line;
            cursor: pointer;
            .icon-gouwuche{
                margin-right: 14px;
                font-size: 20px;
                color: $color-black;
            }
            .my-cart{
                vertical-align: top;
            }
        }
    }
    .header .header-nav{
        height: 50px;
        background: #000;
        .nav-list{
            // width: 100%;
            height: 50px;
            position: relative;
            .nav-list-item{
                max-width: 1000px;
                float: left;
                font-size: $font-regular;
                line-height: 50px;
                text-align: center;
                color: $color-white;
                padding: 0 35px;
                cursor: pointer;
                text-overflow:ellipsis;
                white-space: nowrap;
                overflow: hidden;
                &.sort{
                    width: 200px;
                    height: 50px;
                    margin-left: 0;
                    padding: 0;
                    overflow: visible;
                    &:hover{
                        background-color: $color-golden;
                    }
                    .all{
                        display: block;
                        line-height: 50px;
                    }
                    .sort-list{
                        display: none;
                        position: relative;
                        // top: 3px;
                        background: rgba(0,0,0,.72);
                        // max-height: 540px;
                        height: 540px;
                        z-index: 99;
                        overflow:visible;
                        .sort-list-item {
                            padding: 8px 14px;
                            font-size: $font-small;
                            line-height: 1;
                            color: $color-white;
                            text-align: left;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            .category-content{
                                display: none;
                                left: 200px;
                                top: 0;
                                // width: 1000px;
                                // height: 100%;
                                // max-height: 540px;
                                height: 540px;
                                padding-bottom: 20px;
                                overflow: hidden;
                                z-index: 100;
                                border:solid 1px $color-line;
                                .sort-con{
                                    width: 770px;
                                    height: 100%;
                                    overflow: hidden;
                                    padding: 0 34px 0 16px;
                                    .sort-con-item{
                                        width: 100%;
                                        padding-bottom: 14px;
                                        border-bottom: solid 1px $text-secondary;
                                    }
                                    .sort-con-title{
                                        width: 70px;
                                        padding: 14px 14px 0 0;
                                        position: relative;
                                        line-height: 1;
                                        overflow: hidden;
                                        text-overflow:ellipsis;
                                        white-space: nowrap;
                                        &::after{
                                            content: '';
                                            display: block;
                                            width: 1px;
                                            height: $font-small;
                                            background: $text-primary;
                                            position: absolute;
                                            top: 14px;
                                            right: 0;
                                        }
                                    }
                                    .sort-con-list{
                                        li.item{
                                            margin: 15px 0 0 15px;
                                            transition: all .3s;
                                            &:hover{
                                                color: $color-golden;
                                                cursor: pointer;
                                            }
                                        }
                                    }
                                }
                                .ad-con{
                                    width: 230px;
                                    height: 100%;
                                    overflow: hidden;
                                    display: none;
                                }
                            }
                            &:hover{
                                span{
                                    color: $color-golden;
                                }
                                .category-content{
                                    display: block;
                                }
                            }
                        }
                    }
                    &:hover{
                        border-bottom: none;
                        > .sort-list{
                            display: block;
                        }
                    }
                }
            }
            .nav-menu{
                width:1000px;
                height: 50px;
                overflow:hidden;
                li:hover{
                    color: $text-hover;
                }
            }
        }
    }
    @media screen and (max-width: 1199px) {
        .header {
            min-width: 990px;
            .header-con{
                .logo{
                    left: 10px;
                }
                .search-form{
                    left: 260px;
                }
            }
            .header-nav{
                .category-content{
                    width: 750px !important;
                }
                .nav-list{
                    .nav-menu{
                        width: auto;
                    }
                }
            }
        }
    }
</style>
