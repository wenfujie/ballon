
<template>
    <div class="index min-height wrapper">
        <div class="wrapper">
            <div>
                <div class="vc_title">
                    <div class="title">
                        <div class="title_left"></div>
                        {{$t('vouchersCenter.infoHeader')}}
                        <div class="title_right"></div>
                    </div>
                </div>
                <div class="vc_centent">
                    <div class="vc_box vouchers-red" v-for="(card,index) in cardList" :key="index" v-if="card.couponCount !== 0">
                        <div class="row-content">
                            <div class="row-left">
                                <div class="vc_info">
                                    <div class="info-row">
                                        <div class="info-left" v-if="card.cardTypeCode == 'D_DISCOUNTCOUPONS'">
                                            {{card.couponValue | decimal}}
                                            <span class="cellStyle">{{$t('unit.discount')}}</span>
                                        </div>
                                        <div class="info-left" v-if="card.cardTypeCode === 'D_CASHVOLUME'">
                                            <span class="rmb">¥</span>
                                            {{card.couponValue}}
                                        </div>
                                        <div class="info-left" v-if="card.cardTypeCode === 'D_AONETIMECARD'">
                                            <span class="rmb">¥</span>
                                            {{card.couponValue}}
                                        </div>
                                        <div class="info-left" v-if="card.cardTypeCode === 'D_RECHARGEABLECARD'">
                                            <span class="rmb">¥</span>
                                            {{card.couponValue}}
                                        </div>
                                        <div class="info-right">
                                            <div class="right-name">{{card.couponName}}</div>
                                            <div class="right-log">{{$t('vouchersCenter.useLimits') + card.couponLimit}}</div>
                                        </div>
                                    </div>
                                    <!-- <div class="role-row">
                                        活动规则：{{card.couponMemo}}
                                    </div>-->
                                </div>
                            </div>
                            <div class="row-right">
                                <div class="vc_price">
                                    <span v-if="!!card.buyPrice">{{$t('vouchersCenter.buyPrice') + card.buyPrice + $t('unit.priceUnit')}}</span>
                                </div>
                                <div @click="opera(card)" class="vc_use">{{card.btnName}}</div>
                                <!-- <count-down v-if="card.status===1" :startTime="card.couponStartTime"></count-down> -->
                            </div>
                        </div>
                        <!-- 底部说明栏 -->
                        <div class="row-bottom">
                            <p>{{$t('vouchersCenter.useInstructions') + card.instructions}}</p>
                        </div>
                    </div>
                    <empty v-show="showEmpty" :emptyText="$t('vouchersCenter.emptyText')" />
                </div>
            </div>
        </div>
        <coupon-dialog v-if="dialogVisible" :dialogVisible="dialogVisible" :couponId="dialog.couponId" :icon="dialog.icon" :title="dialog.title" :content="dialog.content" :cancelBtnText="dialog.cancelBtnText" :confirmBtnText="dialog.confirmBtnText" :countDownTime="dialog.countDownTime" @handleClose="handleClose" @handleConfirm="handleConfirm" />
    </div>
</template>
<script>
import { Base, Goods, UserService, Volume, Vouchers } from "../../api/service";
import Empty from "@/components/EmptyContent";
import couponDialog from "./components/coupon-dialog";
export default {
  components: {
    empty: Empty,
    "coupon-dialog": couponDialog
  },
  data() {
    return {
      active: 1,
      show: false,
      radio: "1",
      list: [],
      // 优惠券列表
      cardList: [],
      sexPickerShow: false,
      dialogVisible: false,
      currentDateTime: new Date().getTime(),
      userphone: "",
      showEmpty: false, // 没数据显示空提示
      userbirthday: "",
      isGoodsDetail: false,
      pageTitle: !!this.$route.meta.title ? this.$route.meta.title : "吃人",
      dialog: {}
    };
  },
       filters: {
        decimal : function (val) {
            let arr = val.toString().split('.')
            if (arr.length > 1) {
                return val.toFixed(1)
            } else {
                return arr[0]
            }
        }
    },
  methods: {
    //  获取优惠券列表
    async getCouponList() {
      c_showLoading(true, "rgba(0, 0, 0, 0.8)");
      let cardList = [];
      let params = {
        busContsCode: Storage.get("properties").busContsCode,
        shopId: Storage.get("USER_INFO").shopId
      };
      cardList = await this.getList(params);
      c_showLoading(false);
      if (cardList.length == 0 || cardList==undefined) this.showEmpty = true;
      // console.log("cardList",cardList)
      cardList.forEach(item => {
        let time = new Date(item.couponStartTime).getTime();
        if (item.buyPrice > 0) {
          item.btnName = this.$t("vouchersCenter.buyNow");
        } else {
          item.btnName = this.$t("vouchersCenter.immediatelyToReceive");
        }
      });
      this.cardList = cardList;
    },
    async getList(params) {
      let cardList = [];
      if (this.isGoodsDetail) {
        console.log("去领券");
        params.ptiPartHdId = this.$route.query.ptiPartHdId;
        let result = await Goods.getGoodsPromotion(params);
        if (!!result && result.couponsCards.length > 0) {
          cardList = result.couponsCards;
          cardList.forEach(item => {
            if (item.cardTypeCode == "D_DISCOUNTCOUPONS") {
              // 折扣券
              item.couponValue = parseInt(item.discount * 100) / 10;
            } else {
              // D_CASHVOLUME现金券
              item.couponValue = item.initialValue;
            }
          });
        }
      } else {
        let result = await Vouchers.getVouchersList(params);
        if (
          !!result &&
          !!result.couponTypesList &&
          result.couponTypesList.length > 0
        ) {
          result.couponTypesList.forEach(couponTypes => {
            if (
              !!couponTypes.couponsList &&
              couponTypes.couponsList.length > 0
            ) {
              cardList = cardList.concat(couponTypes.couponsList);
            }
          });
        }
      }
      return cardList;
    },
    handleClose() {
      this.dialogVisible = false;
      this.getCouponList();
    },
    handleConfirm(data) {
      this.dialogVisible = false;
      if (data.text == "立即使用") {
        if (this.isGoodsDetail) {
          this.$router.push(
            "/goods-detail?goodsCode=" +
              this.$route.query.goodsCode +
              "&goodsId=" +
              this.$route.query.ptiPartHdId
          );
        } else {
          this.$router.push("/goods-list?couponId=" + data.couponId);
        }
      } else {
        // 查看优惠券
        this.$router.push("/vouchers-list");
      }
    },
    // 点击操作按钮
    async opera(item) {
      c_showLoading(true, "rgba(0, 0, 0, 0.8)");
      // 先判断券是否过期
      let isExpired = await this.expired(item);
      if (!isExpired) {
        let tip = this.$t("vouchersCenter.receive");
        if (item.btnName == this.$t("vouchersCenter.buyNow"))
          tip = this.$t("vouchersCenter.buy");
        this.dialog = {
          icon: "",
          title:
            this.$t("vouchersCenter.sorry") +
            tip +
            this.$t("vouchersCenter.fauirle"),
          content: this.$t("vouchersCenter.over"),
          cancelBtnText: this.$t("vouchersCenter.close"),
          countDownTime: 6
        };
        this.dialogVisible = true;
        return;
      }
      if (item.btnName == "立即购买") {
        let param = {
          shopCode: Storage.get("USER_INFO").shopCode,
          busContsCode: Storage.get("properties").busContsCode,
          couponsId: item.couponId
        };
        Vouchers.buyCoupons(param).then(res => {
          if(res.msg === '无券可领'){
           this.dialog = {
               icon: "",
              title: this.$t("vouchersCenter.buyfailTips"),
              content: this.$t("vouchersCenter.buyfailContent"),
              cancelBtnText: this.$t("vouchersCenter.close"),
              countDownTime: 6
            };
            this.dialogVisible = true;
            return;
          }
          console.log(res,'res')
          c_showLoading(false);
          this.$router.push(
            "/pay-mode?billCode=" +
              res.billCode +
              "&actuallyPaid=" +
              item.buyPrice +
              "&orderType=D_COUPONSORD"
          );
        });
      } else if (item.btnName === "立即领取") {
        let param = {
          busContsCode: Storage.get("properties").busContsCode,
          couponsId: item.couponId
        };
        Vouchers.saveCoupons(param).then(result => {
          c_showLoading(false);
          if (!result || result.length === 0) {
            this.dialog = {
              icon: "",
              title: this.$t("vouchersCenter.sorryFauirle"),
              content: this.$t("vouchersCenter.noNum"),
              cancelBtnText: this.$t("vouchersCenter.close"),
              countDownTime: 6
            };
            this.dialogVisible = true;
            return;
          }
          switch (result[0].state) {
            case "0":
              this.dialog = {
                couponId: item.couponId,
                icon: "success",
                title: this.$t("vouchersCenter.sucessTitle"),
                content: this.$t("vouchersCenter.sucessContent"),
                cancelBtnText: this.$t("vouchersCenter.close"),
                confirmBtnText: this.$t("vouchersCenter.immdeitatelyUse"),
                countDownTime: 6
              };
              this.getCouponList();
              this.dialogVisible = true;
              break;
            case "1":
              this.dialog = {
                icon: "",
                title:
                  this.$t("vouchersCenter.sorry") +
                  this.$t("vouchersCenter.receive") +
                  this.$t("vouchersCenter.fauirle"),
                content:
                  this.$t("vouchersCenter.haveRecive") +
                  item.leftLimitDay +
                  this.$t("vouchersCenter.tomottow"),
                cancelBtnText: this.$t("vouchersCenter.close"),
                confirmBtnText: this.$t("vouchersCenter.reviewCoupons"),
                countDownTime: 6
              };
              this.dialogVisible = true;
              break;
            default:
              console.log("失败");
              this.dialog = {
                icon: "",
                title: this.$t("vouchersCenter.sorryFauirle"),
                content: this.$t("vouchersCenter.noNum"),
                cancelBtnText: this.$t("vouchersCenter.close"),
                countDownTime: 6
              };
              this.dialogVisible = true;
              break;
          }
        });
      }
    },
    async expired(data) {
      let endTime = new Date(data.couponEndTime).getTime();
      let currentTime = new Date().getTime();
      if (endTime < currentTime) return false;
      return true;
    }
  },
  created() {
    if (!!this.$route.query && !!this.$route.query.ptiPartHdId)
      this.isGoodsDetail = true;
    this.getCouponList();
  }
};
</script>

<style scoped lang="scss">
.cellStyle {
  font-size: 18px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
}
.vc_centent {
  .vouchers-red {
    background: url("../../assets/images/vouchers/vc-center.png");
    &:nth-child(2n + 1) {
      margin-right: 70px;
    }
  }
  .vc_box {
    position: relative;
    width: 561px;
    height: 208px;
    background-size: 100% 100%;
    display: inline-block;
    .row-bottom {
      position: absolute;
      bottom: 17px;
      width: 96%;
      height: 61px;
      padding-bottom: 10px;
      background: #f5f3ef;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0.48;
      margin-left: 18px;
      overflow-y: hidden;
      p {
        font-size: 14px;
        font-weight: 400;
        color: #dc776d;
        text-align: left;
        padding: 0 30px;
      }
    }
    .row-left {
      margin-top: 50px;
      float: left;
      width: 70%;
      .vc_info {
        display: inline-block;
        margin-left: 45px;
        width: 340px;
        .info-row {
          .info-left {
            // margin-right: 33px;
            width: 145px;
            display: inline-block;
            height: 50px;
            font-size: $font-large;
            font-family: PingFangSC-Medium;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 50px;
            text-align: center;
            vertical-align: top;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            .rmb {
              font-size: $font-regular;
            }
          }
          .info-right {
            display: inline-block;
            .right-name {
max-width: 190px;
              font-size: $font-small;
              font-family: PingFangSC-Medium;
              font-weight: 500;
              color: rgba(255, 255, 255, 1);
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .right-log {
              max-width: 190px;
              margin-top: 10px;
              font-size: 14px;
              font-family: PingFangSC-Medium;
              font-weight: 500;
              color: rgba(255, 255, 255, 1);
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
        .role-row {
          max-widht: 300px;
          max-height: 46px;
          overflow-y: auto;
          font-size: 14px;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          margin-top: 15px;
        }
      }
    }
    .row-right {
      text-align: center;
      padding-top: 16px;
      margin-top: 32px;
      float: right;
      width: 30%;
      height: 92px;
      border-left: 1px solid rgba(255, 255, 255, 1);
      .vc_price {
        min-width: 16px;
        font-size: 16px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        margin-bottom: 10px;
      }
      .vc_use {
        width: 80px;
        height: 30px;
        border: 1px solid rgba(255, 255, 255, 1);
        border-radius: 15px;
        display: inline-block;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: #dc776d;
        position: relative;
        background-color: $color-white;
        cursor: pointer;
        .use_time {
          position: absolute;
          bottom: -30px;
          left: 10px;
        }
      }
    }
  }
}
.vc_title {
  text-align: center;
  .title {
    display: inline-block;
    position: relative;
    font-size: 30px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    margin-top: 46px;
    margin-bottom: 62px;
  }
  .title_left {
    transform: rotate(45deg);
    content: "";
    display: block;
    position: absolute;
    background: rgba(49, 49, 49, 1);
    width: 14px;
    height: 14px;
    bottom: 10px;
    left: -28px;
  }
  .title_right {
    transform: rotate(45deg);
    content: "";
    display: block;
    position: absolute;
    background: rgba(49, 49, 49, 1);
    width: 14px;
    height: 14px;
    bottom: 10px;
    right: -28px;
  }
}
.yuyueImg {
  img {
    width: 153px;
    height: 94px;
  }
}
.yuyueWord {
  text-align: center;
  font-size: 16px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
}
.yuyueBtn {
  text-align: center;
  width: 96px;
  height: 32px;
  background: rgba(245, 243, 239, 1);
  border: 1px solid rgba(183, 159, 123, 1);
}
.pain-update {
  width: 188px;
  line-height: 54px;
  text-align: center;
  height: 54px;
  background: rgba(182, 159, 125, 1);
  border: 1px solid rgba(182, 159, 125, 1);
  margin-left: 80px;
  display: inline-block;
  font-size: 16px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
}
.pain-cancel {
  font-size: 16px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(182, 159, 125, 1);
  margin-left: 56px;
  display: inline-block;
  width: 188px;
  line-height: 54px;
  text-align: center;
  height: 54px;
  background: rgba(245, 243, 239, 1);
  border: 1px solid rgba(182, 159, 125, 1);
}
.ul-title {
  height: 50px;
  background: rgba(245, 245, 245, 1);
  font-size: 18px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 50px;
  padding: 0 19px;
}
.li-item {
  .item-row {
    margin-bottom: 30px;
  }
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  padding: 0 19px;
  padding-top: 32px;
  .row-word {
    color: #999999;
  }
  .row-third {
    width: 33%;
    display: inline-block;
  }
}
.fl-right {
  float: right;
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(61, 120, 204, 1);
}
.left-div {
  float: left;
  display: inline-block;
  width: 180px;
  height: 536px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(204, 204, 204, 1);
  margin-top: 32px;
  .first-title {
    margin-top: 45px;
    margin-bottom: 18px;
    font-size: 18px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    padding-left: 31px;
  }
  .item {
    font-size: 14px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(153, 153, 153, 1);
    padding-left: 31px;
    margin-bottom: 17px;
  }
}
.right-div {
  width: calc(100% - 220px);
  float: left;
  display: inline-block;
  margin-top: 32px;
  margin-left: 28px;
  .right-item {
    font-size: 14px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 31px;
  }
  .rightWord {
    font-size: 14px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(61, 120, 204, 1);
  }
}
.right-title i {
  font-size: 7px;
  color: rgba(204, 204, 204, 1);
}
.userHeader {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.ul-container {
  border: 1px solid rgba(204, 204, 204, 1);
  padding-bottom: 31px;
  margin-bottom: 33px;
}
.right-content {
  .content-title {
    width: 100%;
    height: 50px;
    padding-left: 19px;
    line-height: 50px;
    background: rgba(245, 245, 245, 1);
  }
  background: rgba(255, 255, 255, 1);
  width: 100%;
  height: 634px;
  .content {
    margin-left: 120px;
    margin-top: 53px;
    width: 300px;
  }
}
.right-content {
  .content-title {
    width: 100%;
    height: 50px;
    padding-left: 19px;
    line-height: 50px;
    background: rgba(245, 245, 245, 1);
  }
  background: rgba(255, 255, 255, 1);
  width: 100%;
  height: 634px;
  .content {
    margin-left: 120px;
    margin-top: 53px;
    width: 300px;
  }
}
@media screen and (max-width: 1199px) {
  .vc_centent {
    .vc_box {
      margin: 0 auto;
      display: block;
    }
    .vouchers-red {
      &:nth-child(2n + 1) {
        margin-right: 204px;
      }
    }
  }
}
</style>
