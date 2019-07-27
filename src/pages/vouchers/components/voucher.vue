<style lang='scss' scoped>
  .white{
     color:#FFFFFF;
  }
  .greyFA{
      color: #FAFAFA;
  }
   .greyF5{
      color: #F5F5F5;
  }
   .greyD2{
      color: #F5F5F5;
  }
  .grey99{
      color: #999999;
  }
  .black{
      color: #0D0E09;
  }
  .black33{
       color: #333333;
  }
  .red{
      color: #C41717;
  }
  .grey99{
     color:#999999;
  }
  .coupon{
      width: 100%;
      min-height: computed(180);
      background: url('../../../assets/images/vouchers/vouchers-bg.png');
      background-size: 100% 100%;
      box-sizing:border-box; 
      .left{
        width:computed(180);
        min-height: 100%;
      }
      .right{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height:100%;
        width:computed(180);
        box-sizing:border-box;
      }
  }
  .button{
    width:computed(130);
    height: computed(60);
    background: #0D0E09;
    color:#fff;
  }
  .describe{
    color:#333333;
    font-size: computed(24);
    padding: computed(20);
    line-height: computed(28);
    background: #FAFAFA;
  }
  .salePrice{
    font-size: computed(32);
    font-weight: 600;
    color:#C41717;
    margin-bottom: computed(20);

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
                        <span class="fs48B">{{card.couponValue|disFormat}}</span>
                        <span class="fs24">&nbsp;折</span>
                    </div>
                </div>
                <div class="center flex-auto flex-vbox flex-between pdTb20">
                    <p class="fs28B">{{card.couponName}}</p>
                    <div class="fs26">
                        <span v-if="card.state===2">已过期 &nbsp;</span>
                        <span class="GREY.grey99 fs24">{{valiPeriod}}</span>
                    </div>
                    <div class="fs24 GREY.grey99" @click="showUsage()">
                        使用说明
                        <i
                            :class="['iconfont icon-down ',{'rotatingUp':showDesc,'rotatingDown':!showDesc}]"
                        ></i>
                    </div>
                </div>
                <div class="right">
                    <div class="salePrice" v-if="operation.showPrice">售{{card.buyPrice}}元</div>
                    <div class="button flex-center" @click="operate()">{{operation.name}}</div>
                </div>
            </div>
            <!-- 说明 -->
            <div class="describe" v-if="showDesc">{{card.couponLimit}}</div>
        </div>
        <!-- 现金抵用券 -->
        <div class="mgB30" v-if="isCashCoupon">
            <!-- 卡券 -->
            <div class="coupon flex-box">
                <div class="left flex-center">
                    <div>
                        <span class="fs24">¥&nbsp;</span>
                        <span class="fs36B">{{card.couponValue}}</span>
                    </div>
                </div>
                <div class="center flex-auto flex-vbox flex-between pdTb20">
                    <p class="fs28B">{{card.couponName}}</p>
                    <div class="fs26">
                        <span v-if="card.state===2">已过期 &nbsp;</span>
                        <span class="GREY.grey99 fs24">{{valiPeriod}}</span>
                    </div>
                    <div class="fs24 GREY.grey99" @click="showUsage()">
                        使用说明
                        <i
                            :class="['iconfont icon-down ',{'rotatingUp':showDesc,'rotatingDown':!showDesc}]"
                        ></i>
                    </div>
                </div>
                <div class="right flex-vbox">
                    <div class="salePrice" v-if="operation.showPrice">售 {{card.buyPrice}} 元</div>
                    <div class="button flex-center" @click="operate()">{{operation.name}}</div>
                </div>
            </div>
            <!-- 说明 -->
            <div class="describe" v-if="showDesc">{{card.couponLimit}}</div>
        </div>
        <!-- 储值卡 -->
        <div class="mgB30" v-if="isOnceCard">
            <!-- 卡券 -->
            <div class="coupon flex-box">
                <div class="left flex-vbox flex-center">
                    <div>
                        <span class="fs24">¥&nbsp;</span>
                        <span class="fs36B">{{card.couponValue}}</span>
                    </div>
                </div>
                <div class="center flex-auto flex-vbox flex-between pdTb20">
                    <p class="fs28B">{{card.couponName}}</p>
                    <div class="fs26">
                        <span v-if="card.state===2">已过期 &nbsp;</span>
                        <span class="GREY.grey99 fs24">{{valiPeriod}}</span>
                    </div>
                    <div class="fs24 GREY.grey99" @click="showUsage()">
                        使用说明
                        <i
                            :class="['iconfont icon-down',{'rotatingUp':showDesc,'rotatingDown':!showDesc}]"
                        ></i>
                    </div>
                </div>
                <div class="right flex-vbox">
                    <div class="salePrice" v-if="operation.showPrice">售{{card.buyPrice}}元</div>
                    <div class="button flex-center" @click="operate()">{{operation.name}}</div>
                </div>
            </div>
            <!-- 说明 -->
            <div class="describe" v-if="showDesc">{{card.couponLimit}}</div>
        </div>
        <!-- 充值卡 -->
        <div class="mgB30" v-if="isStoredCard">
            <!-- 卡券 -->
            <div class="coupon flex-box">
                <div class="left flex-vbox flex-center">
                    <div>
                        <span class="fs24">¥&nbsp;</span>
                        <span class="fs36B">{{card.couponValue}}</span>
                    </div>
                </div>
                <div class="center flex-auto flex-vbox flex-between pdTb20">
                    <p class="fs28B">{{card.couponName}}</p>
                    <div class="fs26">
                        <span v-if="card.state===2">已过期 &nbsp;</span>
                        <span class="GREY.grey99 fs24">{{valiPeriod}}</span>
                    </div>
                    <div class="fs24 GREY.grey99" @click="showUsage()">
                        使用说明
                        <i
                            :class="['iconfont icon-down',{'rotatingUp':showDesc,'rotatingDown':!showDesc}]"
                        ></i>
                    </div>
                </div>
                <div class="right flex-vbox">
                    <div class="salePrice" v-if="operation.showPrice">售{{card.buyPrice}}元</div>
                    <div class="button flex-center" @click="operate()">{{operation.name}}</div>
                </div>
            </div>
            <!-- 限定说明 -->
            <div class="describe" v-if="showDesc">{{card.couponLimit}}</div>
        </div>
    </div>
</template>

<script>
import { Vouchers, Order } from "@/api/service"
// import wxPay from "@/util/wxPay";
// import payment from "@/util/payment";
export default {
    props: {
        card: Object
    },
    data() {
        return {
            showDesc: false,
            couponNames: {
                D_AONETIMECARD: "一次性储值卡 ",
                D_CASHVOLUME: " 现金券",
                D_DISCOUNTCOUPONS: "折扣券",
                D_RECHARGEABLECARD: "充值卡"
            }
        };
    },
    computed: {
        // 有效期
        valiPeriod: function () {
            let start = this.card.couponStartTime.split(" ");
            let end = this.card.couponEndTime.split(" ");
            let startTime =
                start[0].replace(/\-/g, ".") + " " + start[1].substr(0, 5);
            let endTime =
                end[0].replace(/\-/g, ".") + " " + end[1].substr(0, 5);
            return startTime + "-" + endTime;
        },
        // 是否现金券
        isCashCoupon: function () {
            return this.card.cardTypeCode === "D_CASHVOLUME" ? true : false;
            // return this.card.cardTypeCode === "002" ? true : false;
        },
        // 是否折扣券
        isDisCoupon: function () {
            return this.card.cardTypeCode === "D_DISCOUNTCOUPONS" ? true : false;
        },
        // 是否充值卡
        isStoredCard: function () {
            return this.card.cardTypeCode === "D_RECHARGEABLECARD" ? true : false;
            // return this.card.cardTypeCode === "czk" ? true : false;
        },
        // 是否一次性储值卡
        isOnceCard: function () {
            return this.card.cardTypeCode === "D_AONETIMECARD" ? true : false;
        },
        //操作按钮控制
        operation: function () {
            if (this.card.isBuy === 1 && this.card.buyPrice > 0) {
                return {
                    name: "购买",
                    type: "buy",
                    showPrice: true
                };
            } else if (this.card.isBuy === 0 || this.card.buyPrice <= 0) {
                return {
                    name: "领用",
                    type: "draw",
                    showPrice: false
                };
            }
        }
    },
    filters: {
        disFormat: function (val) {
            // return val.toFixed(1);
            return (val * 10).toFixed(1);
        }
    },
    methods: {
        // 使用说明显示控制
        showUsage() {
            if (this.card.couponLimit) {
                this.showDesc = !this.showDesc;
            }
        },
        //空参数过滤器
        paramsFilter(params) {
            let keys = Object.keys(params);
            keys.forEach(key => {
                if (!params[key]) {
                    delete params[key];
                }
            });
            console.log("filter", params);
            return params;
        },
        //领取卡券
        async draw() {
            let params = {
                usrId: Storage.get("USER_INFO").usrId,
                companyId: Storage.get("COMPANYID").company_id,
                busContsCode: baseConstant.busContsCode,
                cardId: this.card.valueCardHdId,
                couponsId: this.card.couponId
            };
            params = this.paramsFilter(params);

            let result = await Vouchers.saveCoupons(params);

            switch (result[0].state) {
                case "0":
                    Toast("领取成功~");
                    this.$router.replace("/my-vouchers");
                    break;
                case "1":
                    Toast("您已经领取过该优惠券啦~");
                    break;
                case "2":
                    Toast("该优惠券已经被其他会员绑定~");
                    break;
                default:
                    Toast("领取失败~");
                    break;
            }
        },
        // 购买卡券
        async buy() {
            let params = {
                usrId: Storage.get("USER_INFO").usrId,
                companyId: Storage.get("COMPANYID").company_id,
                shopCode: Storage.get("USER_INFO").shopCode,
                couponsId: this.card.couponId,
                valuecardHdId: this.card.valueCardHdId,
                busContsCode: baseConstant.busContsCode
            };
            params = this.paramsFilter(params);
            let order = await Vouchers.buyCoupons(params);
            wxPay(
                this,
                order.billCode,
                this.card.buyPrice,
                "D_COUPONSORD"
            ).then(res => {
                let successUrl = "/my-vouchers";
                let failUrl = "/vouchers-list";
                payment.miniProgramPay(res, successUrl, failUrl);
            });
        },
        // 操作
        async operate() {
            switch (this.operation.type) {
                case "draw":
                    this.draw();
                    break;
                case "buy":
                    this.buy();
                    break;
                default:
                    break;
            }
        }
    },
    created() {
        console.log("card", this.card.cardTypeCode);
    }
};
</script>