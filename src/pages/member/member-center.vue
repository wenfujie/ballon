/*
 * createTime：2019/2/18
 * author：zhibin.zhao
 * description: 个人中心
 * modifyTime: 2019/4/15
 * modifier: wei.wang
 */
<template>
    <div class="member-center">
        <!--用户信息-->
        <div class="person-box">
            <div class="userInfo">
                <router-link to="/member-info">
                    <!--使用图片过滤器处理url-->
                    <img :src="userInfo.photoThumb | imageFilter" />
                </router-link>
                <div class="info">
                    <p class="name">{{userInfo.vipAccount}}</p>
                    <p class="tel">{{userInfo.mobilePhone | phoneMask}}</p>
                </div>
            </div>
            <div class="coupon">
                <p class="title">{{$t('memberCenter.myVouchers')}}</p>
                <p class="num">
                    <span v-if="this.vouchersCount">{{this.vouchersCount}}</span>
                    <span v-else>0</span>
                    {{$t('unit.sheet')}}
                </p>
                <button
                    type="button"
                    @click="$router.push('/vouchers-center')"
                >{{$t('memberCenter.getVouchersBtn')}}</button>
            </div>
        </div>
        <!--订单列表-->
        <div class="order-box">
            <!--订单数量大于0-->
            <table v-if="this.orderList.length > 0">
                <thead>
                    <tr>
                        <th colspan="3" class="text-left">{{$t('memberCenter.myOrder')}}</th>
                        <th></th>
                        <th></th>
                        <th>
                            <a @click="toOrderList('waitPay',1)">
                                {{$t('memberCenter.unPay')}}
                                <span
                                    class="order-status"
                                    v-if="this.orderStatusNum.unPayOrderNum > 0"
                                >{{this.orderStatusNum.unPayOrderNum}}</span>
                            </a>
                        </th>
                        <th>
                            <a @click="toOrderList('waitShip',2)">
                                {{$t('memberCenter.unShipping')}}
                                <span
                                    class="order-status"
                                    v-if="this.orderStatusNum.unShippingOrderNum > 0"
                                >{{this.orderStatusNum.unShippingOrderNum}}</span>
                            </a>
                        </th>
                        <th>
                            <a @click="toOrderList('waitReceive',3)">
                                {{$t('memberCenter.unReceiving')}}
                                <span
                                    class="order-status"
                                    v-if="this.orderStatusNum.unReceivingGoodsOrderNum > 0"
                                >{{this.orderStatusNum.unReceivingGoodsOrderNum}}</span>
                            </a>
                        </th>
                        <!--<th>-->
                        <!--<a @click="toOrderList('waitEvaluate')">-->
                        <!--{{$t('memberCenter.unEvaluate')}}-->
                        <!--<span class="order-status">{{this.orderStatusNum.unEvaluateOrderNum}}</span>-->
                        <!--</a>-->
                        <!--</th>-->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orderList">
                        <td colspan="3" class="order-thumb">
                            <!--只显示前三张图片-->
                            <img
                                v-for="(img,index) in order.goodsList"
                                v-if="index < 3"
                                :src="img.thumb | imageFilter"
                            />
                            <!--超出三张显示省略号-->
                            <span v-if="order.goodsList.length > 3">···</span>
                        </td>
                        <td>
                            <p>{{$t('memberCenter.total.common') + order.totalQty + $t('memberCenter.total.desc')}}</p>
                            <p>￥{{order.amountNeedPay}}</p>
                            <p class="order-time">{{order.ordTime}}</p>
                        </td>
                        <td></td>
                        <!--先将待评价状态改为已完成状态，三期再改回来-->
                        <td>{{order.ordStatusName === "待评价"?"交易完成":order.ordStatusName}}</td>
                        <td></td>
                        <td>
                            <button
                                type="button"
                                v-if="order.ordStatusCode === 'D_ORDSPAYING'"
                                @click="toPay(order.billCode,order.amountNeedPay)"
                            >{{$t('memberCenter.payOrder')}}</button>
                            <button
                                type="button"
                                v-else-if="order.ordStatusCode === 'D_ORDSDELIVERY'"
                                @click="confirmOrder(order)"
                            >{{$t('memberCenter.confirmOrder')}}</button>
                            <!--<button-->
                            <!--type="button"-->
                            <!--v-else-if="order.ordStatusCode === 'D_ORDRECEIVED'"-->
                            <!--@click="evaluateOrder(order)"-->
                            <!--&gt;{{$t('memberCenter.evaluateOrder')}}</button>-->
                            <p class="detail" @click="toOrderDetail(order.billCode)">
                                {{$t('memberCenter.viewOrder')}}
                                <i class="iconfont icon-jiantou"></i>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8">
                            <div class="more">
                                <a
                                    @click="$router.push('/order-list')"
                                >{{$t('memberCenter.viewMore')}}</a>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!--无订单-->
            <div class="empty-box" v-else>
                <header>
                    <p>{{$t('memberCenter.emptyTitle')}}</p>
                </header>
                <div class="content">
                    <img
                        src="../../assets/images/vouchers/noData.png"
                        :alt="$t('memberCenter.emptyText')"
                    />
                    <p>{{$t('memberCenter.emptyText')}}</p>
                    <button
                        type="button"
                        @click="$router.push('/index')"
                    >{{$t('memberCenter.emptyBtn')}}</button>
                </div>
            </div>
        </div>
        <!--推荐页-->
        <!--<recommend-list class="recommend"></recommend-list>-->
    </div>
</template>
<script>
import RecommendList from "@/components/RecommendList";
import { mapState } from "vuex";
import { Order, Vouchers } from "../../api/service";
export default {
    data() {
        return {
            // 优惠券数量
            vouchersCount: "",
            // 订单状态码
            orderStatusNum: {
                // 待评价
                unEvaluateOrderNum: "",
                // 待付款
                unPayOrderNum: "",
                // 待收货
                unReceivingGoodsOrderNum: "",
                // 待发货
                unShippingOrderNum: ""
            },
            orderList: []
        };
    },
    components: {
        RecommendList
    },
    computed: {
        ...mapState("user", ["userInfo"])
    },
    methods: {
        // 获取优惠券数量
        async getCouponList() {
            let params = {
                pageNum: 1,
                pageSize: 10,
                statusCode: "D_VALCARDHACED"
            };
            let result = await Vouchers.userVouchersList(params);
            this.vouchersCount = result.total;
        },
        // 订单过滤
        listFilter(ordList = []) {
            const targetStateOrd = [
                "D_ORDSPAYING",
                "D_ORDSSHIPPING",
                "D_ORDSDELIVERY",
                "D_ORDSCOMMENTING"
            ];
            return ordList.filter(item => {
                if (targetStateOrd.includes(item.ordStatusCode)) return item;
            });
        },
        // 获取列表数据
        async getOrderList() {
            await Order.getList({
                pageNum: 1,
                pageSize: 9999,
                searchCode: ""
            }).then(res => {
                // 获取订单状态码
                let {
                    unEvaluateOrderNum,
                    unPayOrderNum,
                    unReceivingGoodsOrderNum,
                    unShippingOrderNum
                } = res.orderStatusNum;
                this.orderStatusNum = {
                    ...this.orderStatusNum,
                    unEvaluateOrderNum,
                    unPayOrderNum,
                    unReceivingGoodsOrderNum,
                    unShippingOrderNum
                };
                let ordList = this.listFilter(res.list);
                if (ordList.length > 5) {
                    ordList.length = 5;
                }
                this.orderList = ordList;
            });
        },
        // 跳转至订单详情
        toOrderDetail(billCode) {
            this.$router.push({
                path: "/order-detail",
                query: {
                    billCode: billCode
                }
            });
        },
        // 跳转至支付页面
        toPay(billCode, actuallyPaid) {
            this.$router.push({
                path: "/pay-mode",
                query: {
                    billCode: billCode,
                    actuallyPaid: actuallyPaid
                }
            });
        },
        // 确认收货
        confirmOrder(item) {
            //  确认收货前判断该订单是否存在售后申请单子
            let data = {
                ctmUsrId: Storage.get("USER_INFO").usrId,
                billCodes: [item.billCode]
            };
            Order.beforeSignUp(data).then(
                res => {
                    //  0:没有售后单
                    //  1:有未完成的售后申请单
                    //  2:有待审核的售后申请单
                    let messages = {
                        0: "请确认全部商品均已收到货?",
                        1: "该订单存在正在售后的商品,请在售后完成后再进行确认收货!",
                        2: "该订单存在正在售后的商品,确认售后后将自动撤销售后申请,是否继续?"
                    };
                    let btnName = {
                        0: "确定",
                        2: "继续"
                    };
                    // 订单下的挂的售后申请单状态为【待支付】【待寄回】【已寄回】弹框提示
                    if (res === 1) {
                        //
                        this.$alert(messages[1]);
                    } else {
                        this.$confirm(messages[res], {
                            confirmButtonText: btnName[res]
                        })
                            .then(() => {
                                Order.signUp(data).then(
                                    () => {
                                        this.$toast("确认收货成功~");
                                        // this.$message("确认收货成功~");
                                        this.getOrderList();
                                    },
                                    err => {
                                        this.$alert(err.errorMsg);
                                    }
                                );
                            })
                            .catch(() => {});
                    }
                },
                () => {
                    this.$alert("服务器开小差了，请稍后再试~");
                }
            );
        },
        // 立即评价
        evaluateOrder(item) {
            alert("尚未开发，三期功能");
        },
        // 跳转至订单列表
        toOrderList(status, index) {
            this.$store.dispatch("dressed/SetStatus", index);
            this.$router.push({
                path: "/order-list",
                query: {
                    status: status
                }
            });
        }
    },
    filters: {
        // 图片路径处理
        imageFilter(str) {
            if (str !== undefined || str !== null) {
                let reg = /(http|https):\/\/([\w.]+\/?)\S*/;
                if (reg.test(str)) {
                    return str;
                } else {
                    return getImg(str);
                }
            }
        }
    },
    created() {
        this.getOrderList();
        this.getCouponList();
    }
};
</script>

<style scoped lang="scss">
.member-center {
    .person-box {
        padding: 25px;
        background-color: rgba(245, 243, 239, 1);
        border: 1px solid $color-line;
        .userInfo {
            padding: 22px 0;
            width: 40%;
            text-align: center;
            border-right: 1px dotted $color-line;
            color: $text-primary;
            display: inline-block;
            img {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: 1px solid $text-placeholder;
                display: inline-block;
            }
            .info {
                display: inline-block;
                vertical-align: top;
                margin: 30px 0 0 15px;
                font-weight: bold;
                .name {
                    font-size: $font-regular;
                }
                .tel {
                    font-size: $font-small;
                }
            }
        }
        .coupon {
            width: 60%;
            text-align: center;
            display: inline-block;
            vertical-align: top;
            .title {
                font-size: $font-small;
                color: $text-primary;
                margin-top: 15px;
            }
            .num {
                margin-top: 15px;
                span {
                    font-size: $font-h1;
                    font-weight: bold;
                    color: $text-warn;
                }
            }
            button {
                width: 120px;
                height: 40px;
                line-height: 40px;
                cursor: pointer;
                background: $bg-color-secondary;
                border: 1px solid $color-golden;
                color: $color-golden;
                margin-top: 15px;
                transition: all 0.4s;
                outline: none;
            }
            button:hover {
                background: $color-white;
            }
        }
    }
    .order-box {
        table {
            padding: 0 15px;
            width: 100%;
            table-layout: fixed;
            margin-top: 30px;
            border: 1px solid $color-line;
            color: $text-primary;
            thead {
                background-color: $color-thead;
                font-size: $font-small;
                th {
                    height: 50px;
                    a {
                        display: block;
                        cursor: pointer;
                        height: 50px;
                        line-height: 50px;
                        box-sizing: border-box;
                        -webkit-box-sizing: border-box;
                        .order-status {
                            color: $color-red;
                        }
                    }
                    a:hover {
                        color: $text-hover;
                        border-bottom: 2px solid $color-golden;
                    }
                }
            }
            .text-left {
                text-align: left;
                padding-left: 15px;
            }
            tbody {
                font-size: $font-small;
                tr {
                    td {
                        padding-top: 30px;
                        text-align: center;
                        img {
                            width: 80px;
                            height: 80px;
                            margin-right: 5px;
                        }
                        p {
                            line-height: 27px;
                        }
                        .order-time {
                            font-size: $font-smaller;
                        }
                        button {
                            width: 90px;
                            height: 32px;
                            margin-bottom: 6px;
                            border: none;
                            outline: none;
                            cursor: pointer;
                            font-size: $font-smaller;
                            background: $color-golden;
                            color: $text-white;
                            transition: all 0.4s;
                        }
                        button:hover {
                            background: $color-golden-hover;
                        }
                        .detail {
                            font-size: $font-smaller;
                            color: $text-blue;
                            cursor: pointer;
                            transition: all 0.4s;
                            i {
                                font-size: $font-smaller;
                            }
                        }
                        .detail:hover {
                            color: $color-red;
                        }
                    }
                    .order-thumb {
                        padding-left: 15px;
                        img {
                            float: left;
                        }
                        span {
                            line-height: 80px;
                            font-size: 16px;
                        }
                    }
                    .more {
                        text-align: center;
                        margin-top: 30px;
                        padding: 0 15px;
                        a {
                            display: block;
                            line-height: 50px;
                            border-top: 1px dotted $color-line;
                            padding: 0 15px;
                            font-size: $font-small;
                            color: $text-secondary;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
        .empty-box {
            width: 100%;
            table-layout: fixed;
            margin-top: 30px;
            border: 1px solid $color-line;
            color: $text-primary;
            header {
                background-color: $color-thead;
                font-size: $font-small;
                p {
                    line-height: 50px;
                    padding-left: 15px;
                    font-size: 14px;
                    font-weight: 600;
                }
            }
            .content {
                height: 274px;
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
}
@media screen and (max-width: 1199px) {
    .vc_box {
        margin: 0 205px;
    }
}
</style>
