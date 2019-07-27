/*
* createTime：2019/2/15
* author：en.chen
* description:  侧边栏
*/
<template>
    <div class="sidebar">
        <div class="sidebar-main">

            <!-- 会员中心 begin -->
            <el-tooltip class="item" effect="dark" content="会员中心" placement="left">
                <div @click="routerLink('/member-center')" class="sidebar-tab member">
                    <i class="iconfont icon-geren"></i>
                </div>
            </el-tooltip>
            <!-- 会员中心 end -->

            <!-- 购物车 begin -->
            <el-tooltip class="item" effect="dark" content="购物车" placement="left">
                <div title="购物车" @click="routerLink('/shopping-cart')" class="sidebar-tab shopping-cart">
                    <i class="iconfont icon-gouwuche1"></i>
                    <div class="car-number" v-if="!!shoppingCartNum">{{ shoppingCartNum <= 99 ? shoppingCartNum : '99+'}}</div>
                </div>
            </el-tooltip>
            <!-- 购物车 end -->

            <!-- 浏览记录 begin 功能未开发-->
            <!--<div class="sidebar-tab footmark">-->
                <!--<i class="iconfont icon-liulanjilu"></i>-->
            <!--</div>-->
            <!-- 浏览记录 end -->

            <!-- 优惠券 begin -->
            <el-tooltip class="item" effect="dark" content="优惠券" placement="left">
                <div title="优惠券" class="sidebar-tab coupons" @click="routerLink('/vouchers-list')">
                    <i class="iconfont icon-youhuiquan"></i>
                </div>
            </el-tooltip>
            <!-- 优惠券 end -->

        </div>
        <div class="sidebar-bottom">

            <!-- 反馈 begin -->
            <!--<div class="sidebar-tab">-->
                <!--<i class="iconfont icon-yijianfankui"></i>-->
            <!--</div>-->
            <!-- 反馈 end -->

            <!-- 返回顶部 begin -->
            <div class="sidebar-tab top-btn" v-show="topBtn" @click="returnTop">
                <div class="top-icon"></div>
                <p>TOP</p>
            </div>
            <!-- 返回顶部 end -->

        </div>
    </div>
</template>
<script>
    import Storage from "../utils/storage"
    import { mapState } from 'vuex'
    import {Tooltip} from 'element-ui'
    export default {
        name: 'Sidebar',
        data() {
            return {
                topBtn: false,
            }
        },
        components:{
            'el-tooltip': Tooltip
        },
        methods: {

            //  初始化购物车数量
            getShopingCartNum(){
                this.$store.dispatch('user/getShoppingCart')
            },

            //  通过滚动距离控制返回顶部按钮出现与隐藏
            scrollListen(){
                window.addEventListener("scroll", () => {
                    let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || window.scrollY
                    this.topBtn = scrollTop>50 ? true : false
                });
            },

            //  返回顶部
            returnTop(){
                window.scroll(0,0)
            },

            routerLink(url,params){
                if(!Storage.get('USER_INFO')) {
                    this.$router.push('/login?successUrl=' + url )
                }else {
                    this.$router.push({
                        path: url,
                        query: !!params ? params : ''
                    })
                }
            },
        },
        created() {
            this.getShopingCartNum()
        },
        mounted(){
            this.scrollListen()
        },
        computed : {
            'checkLogin': function () {
                return !!this.$store.state.user.userInfo ? true: false
            },
            ...mapState('user', ['shoppingCartNum'])
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
    .sidebar{
        position: fixed;
        top: 0;
        right: 0;
        width: 35px;
        height: 100%;
        background: $color-black;
        z-index: 9999;
        .sidebar-tab{
            position: relative;
            left: 0;
            width: 35px;
            height: 35px;
            margin-top: 16px;
            background-color: $color-black;
            line-height: 35px;
            text-align: center;
            color: $color-white;
            z-index: 9;
            cursor: pointer;
            transition: ease .2s;
            &:hover{
                background: $color-golden;
            }
            .iconfont{
                font-size: $font-common;
                &.icon-youhuiquan{
                    font-size: $font-smaller;
                }
            }
            &.shopping-cart{
                .car-number{
                    position: absolute;
                    min-width: 16px;
                    height: 16px;
                    padding: 0 3px;
                    -webkit-border-radius: 16px;
                    -moz-border-radius: 16px;
                    border-radius: 16px;
                    font-size: $font-smaller;
                    line-height: 16px;
                    background: $text-warn;
                    top: 1px;
                    left: 3px;
                    overflow: hidden;
                    text-align: center;
                }
            }
            &.top-btn{
                height: 40px;
                line-height: 1;
                .top-icon{
                    top: 8px;
                    position: relative;
                    width: 100%;
                    height: 6px;
                    background: url("../assets/images/common/top.png") no-repeat center;
                    background-size: contain;
                }
                p{
                    margin-top: 14px;
                    font-size: $font-smaller;
                    line-height: $font-smaller;
                }
            }
        }
        .sidebar-main{
            position: relative;
            top: 50%;
            transform: translateY(-50%);
        }
        .sidebar-bottom{
            position: absolute;
            bottom: 25px;
            left: 0;
        }
    }
</style>
