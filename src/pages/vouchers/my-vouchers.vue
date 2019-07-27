/*
* createTime：2018/11/8
* author：junyong.hong
* description: 我的优惠券
*/
<template>
    <div class="my-vouchers">
        <!-- 标签 begin -->
        <div class="my-vouchers-tab">
            <div
                v-for="(item, index) in tabList"
                :key="index"
                :class="[tabActive === index ? 'active': '']"
                @click="tabClick(item, index)"
            >
                <span>{{item.nameCn}}</span>
            </div>
        </div>
        <!-- 标签 end -->
        <!-- 优惠券列表 begin -->
        <van-list
            v-model="loading"
            :finished="finished"
            :offset="10"
            @load="loadMore"
            :immediate-check="false"
            class="vouchers-list"
        >
            <!-- <my-vouchers :tabType="tabActive" :cardList="cardList"></my-vouchers> -->
            <couponList :cardState="tabActive" :cardList="cardList" :reload="handleCarList"/>
        </van-list>
        <!-- 优惠券列表 end -->
        <!-- 去领券 begin -->
        <div class="go-vouchers-btn" @click.prevent="routeLink()">去领券</div>
        <!-- 去领券 end -->
    </div>
</template>
<script type="text/ecmascript-6">
// import MyVouchers from '@/components/MyVouchers'
import couponList from "./components/couponList";
import { Vouchers, Order } from "../../api/service";

export default {
    components: {
        couponList
    },
    data() {
        return {
            pageNum: 1,
            pageSize: 10,
            loading: false, // 是否处于加载状态
            finished: false, // 是否已加载完成
            tabList: [
                {
                    tabType: 0,
                    nameEn: "unUsed",
                    nameCn: "未使用",
                    state: "D_VALCARDHACED"
                },
                {
                    tabType: 1,
                    nameEn: "used",
                    nameCn: "已使用",
                    state: "D_VALCARDUSEED"
                },
                {
                    tabType: 2,
                    nameEn: "expired",
                    nameCn: "已过期",
                    state: "D_VALCARDOVERD"
                }
            ],
            tabActive: 0,
            cardList: []
        };
    },
    methods: {
        /**
         * 标题切换
         * @param item
         * @param index 索引值
         */
        tabClick(item, index) {
            // 防止重复点击

            if (this.tabActive === index) return;
            this.tabActive = index;
            this.pageNum = 1;
            this.finished = false;
            this.cardList = [];
            this.handleCarList();
        },
        /**
         * 获取卡券列表
         * @param code 卡券类型
         */
        async getCardList() {
            let params = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                statusCode: this.tabList[this.tabActive].state
            };
            return Vouchers.userVouchersList(params);
        },

        async handleCarList() {
            this.pageNum = 1;
            this.loading = true;
            let res = await this.getCardList();
            this.cardList = res.list;
            console.log(this.cardList, "this.cardList");
            if (this.cardList.length < res.total) {
                this.finished = false;
            } else {
                this.finished = true;
            }
            this.loading = false;
        },
        loadMore() {
            // 有赞推荐写法，防止首次进入，请求2次分页
            setTimeout(async () => {
                if (this.finished === true) {
                    Toast("没有更多了~");
                    this.loading = false;
                    return;
                } else {
                    this.pageNum += 1;
                    let res = await this.getCardList();
                    this.cardList = this.cardList.concat(res.list);
                    if (this.cardList.length < res.total) {
                        this.finished = false;
                    } else {
                        this.finished = true;
                    }
                    this.loading = false;
                }
            }, 100);
        },
        onInit() {
            this.handleCarList();
        },
        /**
         * 跳转到领取优惠券列表
         */
        routeLink() {
            this.$router.replace("/vouchers-list");
        }
    },
    created() {
        // 默认显示未使用优惠券
        this.onInit();
    }
};
</script>
<style lang="scss" type="text/scss" scoped>
.my-vouchers {
    $whiteColor: #ffffff;
    $grayColor: #f5f5f5;
    $redColor: #c41717;
    $tabTitleColor: #0d0e09;

    display: flex;
    flex-direction: column;
    background-color: $grayColor;
    height: 100vh;
    .my-vouchers-tab {
        width: 100%;
        height: computed(90);
        line-height: computed(90);
        text-align: center;
        > div {
            width: 33.33%;
            height: computed(90);
            background-color: $whiteColor;
            display: inline-block;
            color: $tabTitleColor;
            font-size: computed(30);
            &.active {
                color: $redColor;
                > span {
                    padding-bottom: computed(20);
                    border-bottom: 2px solid $redColor;
                }
            }
        }
    }
    .vouchers-list {
        flex: 1;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
    }
    .go-vouchers-btn {
        width: 100%;
        height: computed(94);
        line-height: computed(94);
        font-size: computed(28);
        text-align: center;
        background-color: $redColor;
        color: $whiteColor;
        z-index: 999;
    }
}
</style>