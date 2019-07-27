<style lang='scss' scoped>
$whiteColor: #ffffff;
$descColor: #fafafa;
$grayColor: #f5f5f5;
$titleColor: #333333;
$dataColor: #999999;
$rightColor: #0d0e09;
$redColor: #c41717;
$addCardColor: #d2d2d2;
.white {
    color: #ffffff;
}
.date-color {
    color: #999999;
}
.desc-color {
    // color:#D2D2D2;
    background: #d2d2d2;
}
.add-to-wx {
    color: #c41717;
    margin: computed(30) 0 computed(30) 0;
}
.has-add-to-wx {
    color: #d2d2d2;
}
.coupon {
    width: 100%;
    min-height: computed(180);
    background: url("../../../assets/images/vouchers/vouchers-bg.png");
    background-size: 100% 100%;
    box-sizing: border-box;
    .left {
        width: computed(180);
        min-height: 100%;
    }
    .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100%;
        width: computed(180);
        box-sizing: border-box;
    }
}
.button {
    width: computed(130);
    height: computed(60);
    background: $rightColor;
    color: #fff;
}
.describe {
    color: #333333;
    font-size: computed(24);
    padding: computed(20);
    line-height: computed(28);
    background: #fafafa;
}
</style>

<template>
    <div>
        <!-- 折扣券 -->
        <div class="mgB30" v-if="isDisCoupon">
            <!-- 卡券 -->
            <div class="coupon flex-box">
                <div class="left flex-center">
                    <div>
                        <span class="fs48B">{{card.discount|disFormat}}</span>
                        <span class="fs24">&nbsp;{{$t("coupon.discount")}}</span>
                    </div>
                </div>
                <div class="center flex-auto flex-vbox flex-between pdTb20">
                    <p class="fs28B">{{card.couponName}}</p>
                    <div class="fs26 flex-auto">
                        <span v-if="card.state===2">{{$t("coupon.overdue")}} &nbsp;</span>
                        <div class="date-color fs24">{{valiPeriod}}</div>
                    </div>
                    <div class="fs24 date-color" @click="showUsage()">
                        {{$t("coupon.directionsForUse")}}
                        <i
                            :class="['iconfont icon-down ',{'rotatingUp':showDesc,'rotatingDown':!showDesc}]"
                        ></i>
                    </div>
                </div>
                <div class="right" v-if="card.state===0">
                    <span
                        class="add-to-wx fs24"
                        v-if="card.weixinId && card.weixinId !==null && card.isSyncToWechet === 0"
                    >  {{$t("coupon.joinWechatCardPagkage")}}</span>
                    <div class="fs24 mgB30" v-if="card.isSyncToWechet === 1"> {{$t("coupon.overJoin")}}</div>
                    <div class="button flex-center" @click="goToGoodsList()">{{$t("coupon.use")}}</div>
                </div>
            </div>
            <!-- 说明 -->
            <div class="describe" v-if="showDesc">{{$t("coupon.usingRange")}} : {{card.couponLimit}}</div>
        </div>
        <!-- 现金抵用券 -->
        <div class="mgB30" v-if="isCashCoupon">
            <!-- 卡券 -->
            <div class="coupon flex-box">
                <div class="left flex-center">
                    <div>
                        <span class="fs24">¥&nbsp;</span>
                        <span class="fs36B">{{card.remainAmount}}</span>
                    </div>
                </div>
                <div class="center flex-auto flex-vbox flex-between pdTb20">
                    <p class="fs28B">{{card.couponName}}</p>
                    <div class="fs26">
                        <span v-if="card.state===2">{{$t("coupon.overdue")}} &nbsp;</span>
                        <div class="date-color fs24">{{valiPeriod}}</div>
                    </div>
                    <div class="fs24 date-color" @click="showUsage()">
                        {{$t("coupon.directionsForUse")}}
                        <i
                            :class="['iconfont icon-down ',{'rotatingUp':showDesc,'rotatingDown':!showDesc}]"
                        ></i>
                    </div>
                </div>
                <div class="right flex-vbox" v-if="card.state===0">
                    <span
                        class="add-to-wx fs24"
                        v-if="card.weixinId && card.weixinId !==null && card.isSyncToWechet === 0"
                    > {{$t("coupon.joinWechatCardPagkage")}}</span>
                    <div class="fs24 mgB30" v-if="card.isSyncToWechet === 1">{{$t("coupon.overJoin")}}</div>
                    <div class="button flex-center" @click="goToGoodsList()">{{$t("coupon.use")}}</div>
                </div>
            </div>
            <!-- 说明 -->
            <div class="describe" v-if="showDesc">{{$t("coupon.usingRange")}} : {{card.couponLimit}}</div>
        </div>
        <!-- 储值卡 -->
        <div class="mgB30" v-if="isOnceCard">
            <!-- 卡券 -->
            <div class="coupon flex-box">
                <div class="left flex-vbox flex-center">
                    <span class="fs16 date-color">{{$t("coupon.balance")}}</span>
                    <div>
                        <span class="fs24">¥&nbsp;</span>
                        <span class="fs36B">{{card.remainAmount}}</span>
                    </div>
                </div>
                <div class="center flex-auto flex-vbox flex-between pdTb20">
                    <p class="fs28B">{{card.couponName}}</p>
                    <div class="fs26">
                        <span v-if="card.state===2">{{$t("coupon.overdue")}} &nbsp;</span>
                        <div class="date-color fs24">{{valiPeriod}}</div>
                    </div>
                    <div class="fs24 date-color" @click="showUsage()">
                        {{$t("coupon.directionsForUse")}}
                        <i
                            :class="['iconfont icon-down   ',{'rotatingUp':showDesc,'rotatingDown':!showDesc}]"
                        ></i>
                    </div>
                </div>
                <div class="right flex-vbox" v-if="card.state===0">
                    <div class="button flex-center" @click="goToGoodsList()">{{$t("coupon.use")}}</div>
                </div>
            </div>
            <!-- 说明 -->
            <div class="describe" v-if="showDesc">{{$t("coupon.usingRange")}}  : {{card.couponLimit}}</div>
        </div>
        <!-- 充值卡 -->
        <div class="mgB30" v-if="isStoredCard">
            <!-- 卡券 -->
            <div class="coupon flex-box">
                <div class="left flex-vbox flex-center">
                    <!-- <span class="fs16 date-color">余额</span> -->
                    <div>
                        <span class="fs24">¥&nbsp;</span>
                        <span class="fs36B">{{card.remainAmount}}</span>
                    </div>
                </div>
                <div class="center flex-auto flex-vbox flex-between pdTb20">
                    <p class="fs28B">{{card.couponName}}</p>
                    <div class="fs26">
                        <span v-if="card.state===2">{{$t("coupon.overdue")}} &nbsp;</span>
                        <div class="date-color fs24">{{valiPeriod}}</div>
                    </div>
                    <div class="fs24 date-color" @click="showUsage()">
                        {{$t("coupon.directionsForUse")}}
                        <i
                            :class="['iconfont icon-down   ',{'rotatingUp':showDesc,'rotatingDown':!showDesc}]"
                        ></i>
                    </div>
                </div>
                <div class="right flex-vbox" v-if="card.state===0">
                    <div class="button flex-center" @click="charge()"> {{$t("coupon.use")}}</div>
                </div>
            </div>

            <!-- 说明 -->
            <div class="flex-vbox fs24 gray" v-if="showDesc">
                <div class="flex-box mgTb20">
                    <div class="flex-box flex-auto">
                        <div class>{{$t("coupon.cardNumber")}} :</div>
                        <div class="flex-auto pdL20">{{card.cardCode}}</div>
                    </div>
                    <div class="flex-box flex-auto">
                        <div class>{{$t("coupon.password")}}:</div>
                        <div class="flex-auto pdL20">{{card.password||'无需密码'}}</div>
                    </div>
                </div>
                <div v-if="card.couponLimit">{{$t("coupon.usingRange")}} : {{card.couponLimit}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import * as fundApi from "@/api/service/fund";
export default {
    props: {
        card: Object,
        refreshIndex: Number
    },
    data() {
        return {
            showDesc: false,
            couponNames: {
                10060201: "一次性储值卡",
                10060202: "现金券",
                10060203: "折扣券",
                10060206: "充值卡",
            }
        }
    },
    methods: {
        // 使用说明显示控制
        showUsage() {
            if (this.card.couponLimit) {
                this.showDesc = !this.showDesc;
            }
        },
        // 获取微信卡包配置
        async getCardConfig() {
            let params = {
                card_id: this.card.weixinId,  //卡券weixinId,
                code: this.card.cardCode,
                isNeedOpenid: 0,
                wxuuid: Storage.get('properties').publicAccount
            }
            return vouchersApi.getWxconfig(params)
        },
        // 获取微信签名配置
        async getWxConfig() {
            let url = window.location.href.split("#")[0];
            let params = {
                wxUUID: Storage.get('properties').publicAccount,
                unAuthorizedUrl: encodeURIComponent(url)
            }
            return orderApi.getWxSignature(params)

        },
        // 添加卡包
        addCards(wxCofig, cardConfig) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: wxCofig.appId, // 必填，公众号的唯一标识
                timestamp: wxCofig.timeStamp, // 必填，生成签名的时间戳
                nonceStr: wxCofig.nonceStr, // 必填，生成签名的随机串
                signature: wxCofig.signature,// 必填，签名
                jsApiList: ['addCard'] // 必填，需要使用的JS接口列表
            });
            wx.ready(function () {
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                wx.addCard({
                    cardList: [{
                        cardId: this.card.weixinId,
                        cardExt: JSON.stringify(cardConfig)
                    }], // 需要添加的卡券列表
                    success: function (res) {
                        Toast('添加成功~')
                        var cardList = res.cardList; // 添加的卡券列表信息
                    },
                    error: function (err) {
                        Toast('添加失败~', err)
                        console.error('err', err)

                    }
                });
            });
        },
        // 加入微信卡包
        addToWxCardPkgs() {
            if (this.card.expiringFlag === 0) return;
            this.$requestAll([this.getWxConfig(), this.getCardConfig()]).then((res) => {
                console.log("request", res)
                this.addCards(res[0], res[1])
            })

        },
        // 使用卡券时,跳转至商品详情
        goToGoodsList() {
            this.$router.push('/goods')
        },
        // 通过卡号充值,点击使用时触发该方法
        async chargeByCardId() {
            let params = {
                cardId: this.card.cardId
            };
            fundApi.chargeByCardId(params).then(
                res => {
                    if (res === 1) {
                        Toast("充值成功");
                        this.$emit('reload');
                    } else {
                        Toast("充值失败");
                    }
                },
                err => {
                    Toast("充值失败");
                }
            );
        },
        charge() {
            Dialog.confirm({
                message: '是否确定将金额充值至我的资金账户?'
            }).then(() => {
                this.chargeByCardId();
            })
        }
    },
    computed: {
        // 有效期
        valiPeriod: function () {
            let start = this.card.couponTimeStart.split(" ");
            let end = this.card.couponTimeEnd.split(" ");
            let startTime = start[0].replace(/\-/g, ".") + " " + start[1].substr(0, 5);
            let endTime = end[0].replace(/\-/g, ".") + " " + end[1].substr(0, 5);
            return startTime + "-" + endTime;
        },
        // 是否现金券
        isCashCoupon: function () {
            return this.card.cardTypeCode === "D_CASHVOLUME" ? true : false;
        },
        // 是否折扣券
        isDisCoupon: function () {
            return this.card.cardTypeCode === "D_DISCOUNTCOUPONS" ? true : false;
        },
        // 是否充值卡
        isStoredCard: function () {
            return this.card.cardTypeCode === "D_RECHARGEABLECARD" ? true : false;
        },
        // 是否一次性储值卡
        isOnceCard: function () {
            return this.card.cardTypeCode === "D_AONETIMECARD" ? true : false;
        },
    },
    filters: {
        disFormat: function (val) {
            return val.toFixed(1)
        }
    }

}
</script>