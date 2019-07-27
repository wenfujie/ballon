/*
* createTime：2019/1/30
* author：zhibin.zhao
* description: 个人中心
*/
<template>
    <div class="wrapper">
        <div class="member">
            <div class="menu">
                <p>个人中心</p>
                <router-link
                    v-for="(item, index) in menu"
                    :key="index"
                    :to="{path: item.path}"
                    :class="activeIndex===index?'active':''"
                >{{item.name}}</router-link>
            </div>
            <div class="content">
                <!-- 页面导航 begin -->
                <div class="crumbs" v-if="activeIndex!=0">
                    <ul class="crumbs-con clearfix">
                        <li class="crumbs-item">
                            <router-link :to="{path: '/member'}">个人中心</router-link>
                        </li>
                        <li class="crumbs-item" v-for="(item, index) in crumbs" :key="index">
                            <i class="iconfont icon-jiantou"></i>
                            <router-link :to="{path: item.path}">{{item.name}}</router-link>
                        </li>
                    </ul>
                </div>
                <!-- 页面导航 end -->
                <!-- 个人中心页-全部子页面展示 begin -->
                <transition name="fade" class="sonPage" mode="out-in">
                    <router-view></router-view>
                </transition>
                <!-- 个人中心页-全部子页面展示 end -->
            </div>
            <!--<recommend-list v-if="activeIndex==0"></recommend-list>-->
        </div>
    </div>
</template>
<script>
// import RecommendList from "@/components/RecommendList";
export default {
    // components: {
    //     RecommendList
    // },
    data() {
        return {
            // 左侧菜单项
            menu: [
                {
                    path: "/member-center",
                    name: "个人中心"
                },
                {
                    path: "/member-card",
                    name: "会员卡"
                },
                {
                    path: "/order-list",
                    name: "我的订单"
                } /* ,{
                path: '/member',
                name: '我的售后'
            } */,
                {
                    path: "/amount-body",
                    name: "我的量体"
                },
                {
                    path: "/my-reserve",
                    name: "我的预约"
                },
                {
                    path: "/vouchers-list",
                    name: "我的优惠券"
                },
                /* {
                    path: "/my-collection",
                    name: "我的收藏"
                },
                {
                    path: "/member",
                    name: "浏览记录"
                },*/
                {
                    path: "/member-info",
                    name: "个人资料"
                },
                {
                    path: "/invoice",
                    name: "我的发票"
                },
                {
                    path: "/safe-list",
                    name: "安全管理"
                },
                {
                    path: "/address-list",
                    name: "收货地址"
                } /* ,
                {
                    path: "/member",
                    name: "帮助中心"
                } */
            ],
            activeIndex: -1,
            crumbs: []
        };
    },
    methods: {
        getActiveMenu(path, name) {
            this.crumbs = [];
            if (path.indexOf("order-detail") != -1) {
                this.activeIndex = 2;
                this.crumbs.push({ path: "/order-list", name: "我的订单" });
            } else if (path.indexOf("/choice-dressed") != -1) {
                this.activeIndex = 2;
                this.crumbs.push({ path: "/order-list", name: "我的订单" });
            } else if (path.indexOf("buy-card") != -1) {
                this.activeIndex = 1;
                this.crumbs.push({ path: "/member-card", name: "会员卡" });
            } else {
                this.menu.forEach((item, index) => {
                    if (path == item.path) {
                        this.activeIndex = index;
                        return;
                    }
                });
            }
            this.crumbs.push({ path: path, name: name });
        }
    },
    created() {
        this.getActiveMenu(this.$route.path, this.$route.meta.title);
    },
    watch: {
        $route(to, from) {
            this.getActiveMenu(to.path, to.meta.title);
        }
    }
};
</script>

<style scoped lang="scss">
.member {
    margin: 32px 0 72px 0;
    .menu {
        width: 180px;
        font-size: $font-small;
        border: 1px solid $color-line;
        padding: 44px 0;
        display: inline-block;
        > p {
            margin: 0 0 16px 33px;
            color: $text-primary;
            font-size: $font-regular;
        }
        > a {
            display: block;
            padding-left: 33px;
            line-height: 31px;
            color: $text-secondary;
            font-weight: 500;
            margin-left: 1px;
            border-left: 4px solid $color-white;
            &:hover {
                color: $color-golden;
                border-left: 4px solid $color-golden;
            }
            &.router-link-active {
                color: $color-golden;
                border-left: 4px solid $color-golden;
            }
            &.active {
                color: $color-golden;
                border-left: 4px solid $color-golden;
            }
        }
    }
    .content {
        display: inline-block;
        margin-left: 30px;
        vertical-align: top;
        width: 990px;
        .crumbs {
            // height: 50px;
            .crumbs-con {
                .crumbs-item {
                    float: left;
                    // margin-right: 5px;
                    font-size: $font-small;
                    color: $text-primary;
                    > a {
                        color: $text-primary;
                    }
                    .icon-jiantou {
                        margin: 0 5px;
                        font-size: $font-smaller;
                        color: $text-placeholder;
                    } /*
                        &:last-of-type{
                            .icon-jiantou{
                                display: none;
                            }
                        } */
                }
            }
        }
        .fade-enter {
            opacity: 0;
        }
        .fade-leave {
            opacity: 1;
        }
        .fade-enter-active {
            transition: opacity 0.3s;
        }
        .fade-leave-active {
            opacity: 0;
            transition: opacity 0.3s;
        }
    }
    @media screen and (max-width: 1199px) {
        .menu {
            width: 145px;
        }
        .content {
            width: 815px;
            margin-left: 10px;
        }
    }
}
</style>
