<!--
 * @Author: jiandu.sun
 * @Date: 2019-04-16 14:59:00
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-07-26 16:26:57
 * @Description: 会员卡
 -->
<template>
    <div class="member-center-wrap">
        <!-- 会员卡头部标题 begin -->
        <div class="user-profile">
            <div class="my-card">{{$t('memberCard.myCard')}}</div>
            <div class="buy-center" @click="toBuycard()">
                <i class="iconfont icon-goukazhongxin"></i>
                <span>{{$t('memberCard.buyCenter')}}</span>
            </div>
        </div>
        <!-- 会员卡头部标题 end -->
        <!-- 我的会员卡列表begin -->
        <div
            class="card"
            v-for="(item,index) in cardList"
            :key="index"
            :style="{'backgroundImage':(!item.vipCardImage?'url(' + require('./images/cardBlack.png') + ')':'url(' + getImg(cardList[index].vipCardImage) + ')'),'background-size': '100% 100%'}"
        >
            <!-- 左侧会员卡信息begin -->
            <div class="left goldCard">
                <div class="card-level">
                    <i class="iconfont icon-huangguan"></i>
                    <p class="level-name">{{item.vipLevelName}}</p>
                    <p class="card-phone">
                        {{item.vipMobilePhone}}
                        <br />
                        <span
                            v-if="StorageVipId ==item.vipInfoHdId&&status>0"
                        >({{$t('memberCard.currentAccount')}})</span>
                        <span
                            v-if="StorageVipId !=item.vipInfoHdId&&status>0"
                        >({{$t('memberCard.otherAccount')}})</span>
                    </p>
                </div>
                <div class="card-privilege-info">
                    <!-- v-html="item.vipLevelDetailDto.lable" -->
                    <div class="content" v-html="item.lable"></div>
                </div>
            </div>
            <!-- 左侧会员卡信息end -->
            <!-- 右侧有效期begin -->
            <div
                class="right"
                :class="[{'right_before':item.vipCardSpmDtTrgVos.length > 0 || !!item.cardAmount}]"
            >
                <div class="validity">
                    <span>有效期</span>
                    <br />
                    <span
                        v-if="new Date(item.expireDate).getTime() - new Date('2099-12-31 00:00:00').getTime()>=0"
                    >长期有效</span>
                    <span v-else>{{item.expireDate}}</span>
                </div>
                <div
                    class="btn-buy-wraps"
                    v-if="new Date(item.expireDate).getTime() - new Date('2099-12-31 00:00:00').getTime()<0&&(item.vipCardSpmDtTrgVos.length > 0 || !!item.cardAmount)"
                >
                    <!-- <button class="btn-buy" @click="noHoldPurchase(index)">立即开通</button> -->
                    <el-popover placement="bottom" trigger="click" class="btn-buys">
                        <div class="options-wraps">
                            <div
                                class="options"
                                v-if="item.vipCardSpmDtTrgVos &&item.vipCardSpmDtTrgVos.length>0"
                            >
                                <div class="word">{{$t('memberCard.validityPeriod')}}:</div>
                                <div class="chooseDates">
                                    <button
                                        class="option-right"
                                        :class="{'option-active':it.select == 1 && checkedIndex ==index }"
                                        v-for="(it,indexs) in item.vipCardSpmDtTrgVos"
                                        :key="indexs"
                                        @click="selectClick(it,index)"
                                    >
                                        <span
                                            v-if="it.validityTerm===0"
                                        >{{$t('memberCard.permanent')}}</span>
                                        <span v-else>{{it.validityTerm}}{{it.unit}}</span>
                                    </button>
                                </div>
                            </div>
                            <div class="sure" @click="Purchase(index)">{{$t('memberCard.sure')}}</div>
                        </div>

                        <el-button
                            slot="reference"
                            v-if="item.vipCardSpmDtTrgVos.length>0"
                        >{{$t('memberCard.renewal')}}</el-button>
                    </el-popover>
                    <div
                        v-if="item.vipCardSpmDtTrgVos.length==0 && !!item.cardAmount"
                        @click="buy(item)"
                        class="el-button"
                    >{{$t('memberCard.renewal')}}</div>
                </div>
            </div>
        </div>
        <!-- 右侧有效期end -->
        <!-- 我的会员卡列表end -->
        <!-- 空提示begin -->
        <div class="emptyContents" v-if="cardList.length<=0">
            <img src="../../assets/images/goods/unset.png" />
            <!-- {{$t('addressList.noAdressData')}} -->
            <div>{{$t('memberCard.noRecord')}}</div>
        </div>
        <!-- 判断该会员卡是否被购买完，购买显示弹窗 -->
        <coupon-dialog
            v-if="dialogVisible"
            :dialogVisible="dialogVisible"
            :icon="dialog.icon"
            :title="dialog.title"
            :content="dialog.content"
            :cancelBtnText="dialog.cancelBtnText"
            :confirmBtnText="dialog.confirmBtnText"
            :countDownTime="dialog.countDownTime"
            @handleClose="handleClose"
        />
    </div>
</template>
<script>
import { Popover } from "element-ui";
import memberCard from "./components/member-card";
import privilegeInfo from "./components/privilege-info";
import { UserService } from "../../api/service";
import * as userApi from "@/api/service/user-service";
import couponDialog from "../vouchers/components/coupon-dialog"; //借用优惠券弹窗

export default {
    components: {
        memberCard,
        privilegeInfo,
        "el-popover": Popover,
        "coupon-dialog": couponDialog
    },
    data() {
        return {
            priorLock: true, //判断优先级锁
            userIndex: null, //当前持有卡选中值
            noHoldIndex: null, //当前购买卡选中值
            userInfo: {},
            cardList: [], //会员卡
            userCard: [], //持有卡
            notHoldCard: [], //未持有
            showCardDate: false, //是否弹出选择有效期的弹出框
            html: "",
            StorageVipId: "", //获取缓存的vipId
            vipId: "", //获取会员整合当前账号的vip
            dialogVisible: false, //是否显示会员卡购买完毕弹窗
            status: "", //判断当前是否又会员整合
            checkedIndex: -1,
            showBoxIndex: -1
        };
    },
    methods: {
        // 关闭弹窗
        handleClose() {
            this.dialogVisible = false;
            this.getList();
        },
        // 购卡中心
        toBuycard() {
            this.$router.push("/buy-card");
        },
        //选中
        selectClick(item, index) {
            for (
                var k = 0;
                k < this.cardList[index].vipCardSpmDtTrgVos.length;
                k++
            ) {
                this.cardList[index].vipCardSpmDtTrgVos[k].select = 0;
            }
            this.checkedIndex = index;
            item.select = 1;
        },
        //排序
        bubbleSort(arr) {
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < len - 1 - i; j++) {
                    if (arr[j].priority > arr[j + 1].priority) {
                        //相邻元素两两对比
                        var temp = arr[j + 1]; //元素交换
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }
                }
            }
            return arr;
        },
        //选择有效期框
        selectClass(index) {
            this.userIndex = index;
        },
        // 续费
        async Purchase(index) {
            var vdata = null;
            for (
                var i = 0;
                i < this.cardList[index].vipCardSpmDtTrgVos.length;
                i++
            ) {
                if (!!this.cardList[index].vipCardSpmDtTrgVos[i].select) {
                    if (
                        this.cardList[index].vipCardSpmDtTrgVos[i].select == 1
                    ) {
                        vdata = this.cardList[index].vipCardSpmDtTrgVos[i];
                    }
                }
            }
            window.c_showLoading();
            let params = {
                shopCode: this.Storage.get("USER_INFO").shopCode,
                cardLevelCode: this.cardList[index].cardLevelCode,
                valiDityTerm: vdata.validityTerm,
                vipInfoHdId: this.cardList[index].vipInfoHdId
            };
            let cardCode = await UserService.buyCard(params);
            if (cardCode.errorMsg == "库存不足") {
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
            var data = {
                billCode: cardCode,
                actuallyPaid: vdata.price,
                orderType: "D_CARDORD"
            };
            window.c_showLoading(false);
            this.$router.push({
                name: "payMode",
                query: data
            });
        },
        async buy(item) {
            window.c_showLoading();
            let params = {
                shopCode: this.Storage.get("USER_INFO").shopCode,
                cardLevelCode: item.cardLevelCode,
                valiDityTerm: item.validityTerm,
                vipInfoHdId: item.vipInfoHdId
            };
            let cardCode = await UserService.buyCard(params);
            if (cardCode.errorMsg == "库存不足") {
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
            var data = {
                billCode: cardCode,
                actuallyPaid: item.cardAmount,
                orderType: "D_CARDORD"
            };
            window.c_showLoading(false);
            this.$router.push({
                name: "payMode",
                query: data
            });
        },

        // 获取用户信息
        getUser() {
            let data = {};
            UserService.getUserInfo(data).then(res => {
                this.userInfo = res;
                // console.log(this.userInfo.mobilePhone, "user");
                let url = this.userInfo.photoThumb;
                if (!this.userInfo.photoThumb) return;
                if (
                    this.userInfo.photoThumb.indexOf("http") == -1 &&
                    this.userInfo.photoThumb.indexOf("https") == -1 &&
                    this.userInfo.photoThumb.indexOf("blob") == -1
                ) {
                    if (url.substring(0, 5) === "blob:") {
                        this.userInfo.imgFlag = 1;
                    } else {
                        this.userInfo.imgFlag = 0;
                    }
                } else {
                    this.userInfo.imgFlag = 1;
                }
            });
        },
        // 获取会员卡
        getList() {
            this.StorageVipId = Storage.get("USER_INFO").vipInfoId;
            window.c_showLoading();
            let data = {
                vipInfoHdId: this.StorageVipId,
                shopCode: Storage.get("USER_INFO").shopCode
            };
            UserService.getMemCardLevelList(data)
                .then(res => {
                    res.forEach(item => {
                        item.showCardDate = false;
                        this.cardList.push(item);
                        // console.log(this.cardList, "this.cardList");
                        this.vipId = item.vipInfoHdId;
                    });
                    for (var j = 0; j < this.cardList.length; j++) {
                        if (!!this.cardList[j].vipCardSpmDtTrgVos) {
                            for (
                                var k = 0;
                                k < this.cardList[j].vipCardSpmDtTrgVos.length;
                                k++
                            ) {
                                this.$set(
                                    this.cardList[j].vipCardSpmDtTrgVos[k],
                                    "select",
                                    0
                                );
                            }
                        }
                    }
                })
                .then(() => {
                    window.c_showLoading(false);
                });
        }
    },
    created() {
        // 获取所有会员卡
        this.getList();
        this.status = Storage.get("USER_INFO").relationAccountLength; //获取会员整合的长度
    }
};
</script>

<style scoped lang="scss">
@import "./scss/member-card.scss";
</style>
