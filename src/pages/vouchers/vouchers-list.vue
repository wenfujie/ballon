<template>
    <div class="index min-height wrapper">
        <div class="wrapper">
            <div class="right-div">
                <div class="right-content">
                    <div class="content-title">
                        <div class="content-left">
                            <div
                                @click="tabClick(0)"
                                :class="[tabIndex === 0 ? 'tab-one' : 'tab-two']"
                            >{{$t('vouchersList.usableVouchers')}}</div>
                            <div
                                @click="tabClick(1)"
                                :class="[tabIndex === 0 ? 'tab-two' : 'tab-one']"
                            >{{$t('vouchersList.historyVouchers')}}</div>
                        </div>
                        <div class="content-right">
                            <div class="vc_center" @click="$router.push('/vouchers-center')">
                                <i class="iconfont icon-lingquan"></i>
                                {{$t('vouchersList.vouchersCenter')}}
                            </div>
                        </div>
                    </div>
                    <div class="vouchers" v-if="tabIndex === 0">
                        <div
                            class="vouchers-item vouchers-red"
                            v-for="(card,index) in cardList"
                            :key="index"
                        >
                            <div class="item-row">
                                <!--现金券-->
                                <div class="row-left" v-if="card.cardTypeCode === 'D_CASHVOLUME'">
                                    ¥
                                    <span>{{card.initialValue }}</span>
                                    <p>{{card.couponLimit}}</p>
                                </div>
                                <!--折扣券-->
                                <div
                                    class="row-left"
                                    v-if="card.cardTypeCode === 'D_DISCOUNTCOUPONS'"
                                >
                                    <span>{{card.discount | decimal }}</span>
                                    {{$t('unit.discount')}}
                                    <p>{{card.couponLimit}}</p>
                                </div>
                                <div class="row-right">
                                    <p class="right-name">{{card.couponName}}</p>
                                    <!--<p class="right-info" :title="card.projectRmk">{{card.projectRmk}}</p>-->
                                    <p class="right-time">
                                        {{card.couponTimeStart}}起
                                        <br />
                                        {{card.couponTimeEnd}}止
                                    </p>
                                    <div
                                        class="right-btn"
                                        @click="toUse(card)"
                                    >{{$t('vouchersList.useText')}}</div>
                                </div>
                            </div>
                            <div class="item-footer" :title="card.instructions">
                                <p>{{$t('vouchersList.instructions') + card.instructions}}</p>
                            </div>
                        </div>
                        <!--券总数量大于每页数量时开启分页-->
                        <div class="pagination" v-if="total > pageSize">
                            <el-pagination
                                background
                                layout="prev, pager, next, jumper"
                                :current-page="pageNum"
                                :page-size="pageSize"
                                :total="total"
                                @current-change="onPageChagne"
                            ></el-pagination>
                        </div>
                        <!--无可用券-->
                        <div
                            class="vouchers-null"
                            v-if="cardList.length === 0 || total === 0"
                        >
                            <div class="content">
                                <img src="../../assets/images/vouchers/noData.png" />
                                <p>{{$t('vouchersList.emptyTextUsable')}}</p>
                                <button
                                    type="button"
                                    @click="$router.push('/vouchers-center')"
                                >{{$t('vouchersList.emptyBtn')}}</button>
                            </div>
                        </div>
                    </div>
                    <div class="vouchers" v-if="tabIndex === 1">
                        <!--渲染开始使用时间在60天内的优惠券-->
                        <div
                            class="vouchers-item vouchers-gray"
                            v-for="(card,index) in cardList"
                            :key="index"
                            v-if="cardList.length>0"
                        >
                            <div class="item-row">
                                <!--现金券-->
                                <div class="row-left" v-if="card.cardTypeCode === 'D_CASHVOLUME'">
                                    ¥
                                    <span>{{card.initialValue}}</span>
                                    <p>{{card.couponLimit}}</p>
                                </div>
                                <!--折扣券-->
                                <div
                                    class="row-left"
                                    v-if="card.cardTypeCode === 'D_DISCOUNTCOUPONS'"
                                >
                                    <span>{{card.discount | decimal}}</span>
                                    {{$t('unit.discount')}}
                                    <p>{{card.couponLimit}}</p>
                                </div>
                                <div class="row-right">
                                    <div class="right-name">{{card.couponName}}</div>
                                    <div class="right-time">
                                        {{card.couponTimeStart}}起
                                        <br />
                                        {{card.couponTimeEnd}}止
                                    </div>
                                    <div
                                        class="right-btn"
                                        v-if="card.statusCode === 'D_VALCARDUSEED'"
                                        style="cursor: text"
                                    >{{$t('vouchersList.usedText')}}</div>
                                    <div
                                        class="right-btn"
                                        v-if="card.statusCode === 'D_VALCARDOVERD'"
                                        style="cursor: text"
                                    >{{$t('vouchersList.overdueText')}}</div>
                                </div>
                            </div>
                            <div class="item-footer" :title="card.instructions">
                                <p>{{$t('vouchersList.instructions') + card.instructions}}</p>
                            </div>
                        </div>
                        <!--券总数量大于每页数量时开启分页-->
                        <div class="pagination clearfix" v-if="total > pageSize">
                            <el-pagination
                                background
                                layout="prev, pager, next, jumper"
                                :current-page="pageNum"
                                :page-size="pageSize"
                                :total="total"
                                @current-change="onPageChagne"
                            ></el-pagination>
                        </div>
                        <!--无可用券-->
                        <div
                            class="vouchers-null"
                            v-if="cardList.length === 0 || total === 0"
                        >
                            <div class="content">
                                <img src="../../assets/images/vouchers/noData.png" />
                                <p>{{$t('vouchersList.emptyTextHistory')}}</p>
                                <button
                                    type="button"
                                    @click="$router.push('/vouchers-center')"
                                >{{$t('vouchersList.emptyBtn')}}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { UserService, Volume, Vouchers } from "../../api/service";
export default {
    data() {
        return {
            tabIndex: 0,
            isAuto: true,
            // 优惠券列表
            cardList: [],
            pageNum: 1,
            pageSize: 6,
            total: 0, // 优惠券总数
            loading: false,
            tabActive: 1,
            // finished: false,    // 是否已加载完成
            tabList: [
                {
                    tabType: 0,
                    nameEn: "unUsed",
                    nameCn: "未使用",
                    stateCodes: "D_VALCARDHACED",
                    days: ""
                },
                {
                    tabType: 1,
                    nameEn: "history",
                    nameCn: "历史优惠券",
                    stateCodes: "D_VALCARDUSEED,D_VALCARDOVERD",
                    days: "60"
                }
            ]
        };
    },
    filters: {
        // 现在/折扣券过滤器
        decimal: function(val) {
            let arr = val.toString().split(".");
            if (arr.length > 1) {
                return val.toFixed(1);
            } else {
                return arr[0];
            }
        },
        // 过滤掉日期的时间
        dateFilter(str) {
            let strArr = [];
            strArr = str.split(" ");
            return strArr[0].replace(/-/g, ".");
        }
    },
    methods: {
        tabClick(index) {
            this.cardList = [];
            this.total = 0;
            this.pageNum = 1;
            if (index === 0) {
                this.tabIndex = 0;
            }
            if (index === 1) {
                this.tabIndex = 1;
            }
            this.handleCarList();
        },
        differCula(str) {
            let dateStart = new Date(str);
            let dateNow = new Date();
            let days = dateNow.getTime() - dateStart.getTime();
            return parseInt(days / (1000 * 60 * 60 * 24));
        },
        // 获取优惠券
        async getCardList() {
            let params = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                statusCodes: this.tabList[this.tabIndex].stateCodes,
                days: this.tabList[this.tabIndex].days
            };
            return Vouchers.userVouchersList(params);
        },
        async handleCarList() {
            this.loading = true;
            let res = await this.getCardList();
            if (res.list === undefined) {
                this.cardList = [];
            } else {
                this.cardList = res.list;
            }
            this.total = res.total;
            this.loading = false;
        },
        //  分页查询
        onPageChagne(curPaageNo) {
            this.pageNum = curPaageNo;
            this.handleCarList();
        },
        // 去使用
        toUse(item) {
            // 判断优惠券是否到达使用日期
            if (new Date(item.couponTimeStart).getTime() <= new Date().getTime()) {
                if (item.terminalList.length === 0) {
                    this.$router.push('/goods-list?couponId='+item.id)
                } else {
                    // 平台限制跳转
                    let goFlag = false;
                    // 获取店铺id
                    let shopId = Storage.get("USER_INFO").shopId;
                    // 判断优惠券是否在可用店铺区间
                    for (let i=0; i<item.terminalList.length; i++) {
                        if (item.terminalList[i] === shopId) {
                            goFlag = true;
                        }
                    }
                    if(goFlag) {
                        this.$router.push('/goods-list?couponId='+item.id)
                    } else {
                        this.$toast("当前店铺不可用此优惠券~");
                        // this.$message("当前店铺不可用此优惠券~");
                        return false;
                    }
                }
            } else {
                this.$toast("抱歉，还未到该券的使用时间");
                // this.$message("抱歉，还未到该券的使用时间");
                return false;
            }
        }
    },
    created() {
        // 默认显示未使用优惠券
        this.handleCarList();
    }
};
</script>

<style scoped lang="scss">
.right-div {
    width: 990px;
    float: left;
    display: inline-block;
    margin-top: 32px;
    .right-content {
        width: 100%;
        height: auto;
        overflow: hidden;
        position: relative;
        border: 1px solid $color-line;
        background: rgba(255, 255, 255, 1);
        transition: 1s;
        .vouchers {
            overflow: auto;
            padding-bottom: 50px;
            .vouchers-red {
                background: url("../../assets/images/vouchers/vouchers-red.png");
            }
            .vouchers-gray {
                background: url("../../assets/images/vouchers/vouchers-gray.png");
            }
            .vouchers-item {
                position: relative;
                width: 308px;
                height: 186px;
                margin: 15px 10px;
                background-size: 100% 100%;
                float: left;
                .item-row {
                    width: 100%;
                    height: 120px;
                    .row-left {
                        width: 145px;
                        float: left;
                        height: 120px;
                        font-size: 20px;
                        padding-left: 26px;
                        font-weight: 500;
                        color: rgba(255, 255, 255, 1);
                        padding-top: 18px;
                        text-align: center;
                        span {
                            font-size: 36px;
                        }
                        p {
                            font-size: 13px;
                            font-weight: 500;
                            margin-top: -6px;
                        }
                    }
                    .row-right {
                        float: right;
                        width: 47%;
                        height: 120px;
                        overflow: hidden;
                        margin-right: 10px;
                        .right-name {
                            padding-top: 15px;
                            font-size: 14px;
                            font-weight: 500;
                            color: rgba(255, 255, 255, 1);
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                        .right-info {
                            font-size: 12px;
                            margin: 4px 0;
                            font-weight: 500;
                            color: rgba(255, 255, 255, 1);
                            max-width: 130px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                        .right-time {
                            font-size: 10px;
                            font-weight: 500;
                            margin: 2px 0;
                            color: rgba(255, 255, 255, 1);
                        }
                        .right-btn {
                            margin-top: 9px;
                            width: 60px;
                            height: 22px;
                            line-height: 22px;
                            background: #fff;
                            border-radius: 11px;
                            font-size: 12px;
                            font-weight: 500;
                            /*color: #DC776D;*/
                            text-align: center;
                            cursor: pointer;
                        }
                    }
                }
            }
            .item-footer {
                height: 50px;
                width: 100%;
                padding: 0 14px;
                overflow-y: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                p {
                    text-align: left;
                    font-size: 10px;
                    font-weight: 500;
                    line-height: 16px;
                    overflow: hidden;
                }
            }
            .vouchers-red .item-footer {
                color: #dc776d;
            }
            .vouchers-gray .item-footer {
                color: #b3b3b3;
            }
            .vouchers-red .right-btn {
                color: #dc776d;
            }
            .vouchers-gray .right-btn {
                color: #ccc;
            }
            .pagination {
                position: absolute;
                bottom: 10px;
                right: 20px;
            }
            .vouchers-null {
                width: 100%;
                table-layout: fixed;
                .content {
                    height: 260px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    img {
                        width: 154px;
                    }
                    p {
                        margin: 24px 0;
                        color: $text-secondary;
                        font-size: $font-common;
                    }
                    button {
                        width: 92px;
                        height: 32px;
                        color: #b69f7d;
                        font-size: $font-smaller;
                        background: #f5f3ef;
                        line-height: 32px;
                        outline: none;
                        border: 1px solid #b69f7d;
                        display: block;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.4s;
                    }
                    button:hover {
                        background: $color-white;
                    }
                }
            }
        }
        .content-title {
            width: 100%;
            height: 50px;
            line-height: 50px;
            background: rgba(245, 245, 245, 1);
            margin-bottom: 22px;
            .content-left {
                float: left;
                .tab-one {
                    width: 121px;
                    height: 50px;
                    line-height: 50px;
                    background: rgba(255, 255, 255, 1);
                    font-size: 14px;
                    font-weight: 500;
                    color: rgba(182, 159, 125, 1);
                    text-align: center;
                    display: inline-block;
                    cursor: pointer;
                }
                .tab-two {
                    width: 121px;
                    height: 50px;
                    line-height: 50px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #333333;
                    text-align: center;
                    display: inline-block;
                    cursor: pointer;
                }
            }
            .content-right {
                float: right;
                .vc_center {
                    margin-top: 10px;
                    margin-right: 27px;
                    width: 110px;
                    height: 30px;
                    background: rgba(181, 159, 127, 1);
                    color: white;
                    line-height: 30px;
                    text-align: center;
                    cursor: pointer;
                    i {
                        font-size: 18px;
                    }
                }
            }
        }
    }
}
@media screen and (max-width: 1199px) {
    .right-div {
        width: 794px;
        .right-content {
            .vouchers {
                .vouchers-item {
                    margin: 15px 44px;
                }
            }
        }
    }
}
</style>
