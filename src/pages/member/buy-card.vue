<!--
 * @Author: jiandu.sun
 * @Date: 2019-04-16 14:59:00
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-07-26 15:43:05
 * @Description: 购买会员卡
 -->
<template>
    <div class="member-center-wrap">
        <div class="mid-title">
            <div class="first-row">{{$t('memberCard.buyCard')}}</div>
            <div class="second-row">{{$t('memberCard.memberPrivilege')}}</div>
        </div>
        <!-- 购买会员卡列表begin -->
        <div
            class="card"
            v-for="(item,index ) in notHoldCard"
            :key="index"
            :style="{'backgroundImage':(!item.vipCardImage?'url(' + require('./images/cardBlack.png') + ')':'url(' + getImg(notHoldCard[index].vipCardImage) + ')'),'background-size': '100% 100%'}"
        >
            <!-- 会员信息和会员权益begin -->
            <div class="left goldCard">
                <div class="card-level">
                    <i class="iconfont icon-huangguan"></i>
                    <p class="level-name">{{item.cardLevelName||''}}</p>
                    <p class="sale-price">
                        <span v-if="item.cardAmount">￥{{item.cardAmount}}/</span>
                        <span v-if="item.validTerm == 0">{{$t('memberCard.longEffective')}}</span>
                        <span v-else>{{item.validTerm}}{{$t('memberCard.month')}}</span>
                    </p>
                </div>
                <div class="card-privilege-info">
                    <div class="content" v-html="item.vipLevelDetailDto.lable"></div>
                </div>
            </div>
            <!-- 会员信息和会员权益 end -->
            <!-- 有效期 begin -->
            <div class="right" :class="[{'right_before':item.vipCardSpmDtTrgVos.length > 0}]">
                <!-- item.cardAmount -->
                <div class="options-wrap">
                    <div class="options" v-if="item.vipCardSpmDtTrgVos.length>0">
                        <div class="word">{{$t('memberCard.validityPeriod')}}</div>
                        <div class="choose-time">
                            <button
                                :class="[{'option-left':item.vipCardSpmDtTrgVos.length > 1 },
                            {'option-active':checkedIndex==index && it.select==1},
                            {'option-right':item.vipCardSpmDtTrgVos.length == 1 }]"
                                v-for="(it,indexs) in item.vipCardSpmDtTrgVos"
                                :key="indexs"
                                @click="selectClick(it,index)"
                            >
                                <span v-if="it.validityTerm===0">{{$t('memberCard.permanent')}}</span>
                                <span v-else>{{it.validityTerm}}{{it.unit}}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    class="btn-buy-wrap"
                    v-if="item.vipCardSpmDtTrgVos.length > 0 || !!item.cardAmount"
                >
                    <button
                        class="btn-buy"
                        type="button"
                        v-if="item.vipCardSpmDtTrgVos.length>0 || !!item.cardAmount"
                        @click="payment(index)"
                    >{{$t('memberCard.immediatelyOpen')}}</button>
                </div>
            </div>
            <!-- 有效期 end -->
        </div>
        <!-- 购买会员卡列表 end  -->
        <!-- 空提示 -->
        <div class="emptyContents" v-if="notHoldCard.length<=0">
            <img src="../../assets/images/goods/unset.png" />
            <!-- {{$t('addressList.noAdressData')}} -->
            <div>{{$t('memberCard.buyRecord')}}</div>
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
import memberCard from "./components/member-card";
import privilegeInfo from "./components/privilege-info";
import { UserService } from "../../api/service";
import * as userApi from "@/api/service/user-service";
import couponDialog from "../vouchers/components/coupon-dialog";

export default {
    components: { memberCard, privilegeInfo, "coupon-dialog": couponDialog },
    data() {
        return {
            priorLock: true, //判断优先级锁
            userIndex: null, //当前持有卡选中值
            noHoldIndex: null, //当前购买卡选中值
            userInfo: {}, //会员信息
            cardList: [], //会员卡
            userCard: [], //持有卡
            notHoldCard: [], //未持有
            btnStatus: false, //按钮锁
            dialogVisible: false, //是否显示会员卡购买完毕弹窗
            checkedIndex: -1 // 所显示sku弹窗index
        };
    },
    methods: {
        // 关闭弹窗
        handleClose() {
            this.dialogVisible = false;
            this.getList();
        },
        //选中
        selectClick(item, index) {
            for (
                var k = 0;
                k < this.notHoldCard[index].vipCardSpmDtTrgVos.length;
                k++
            ) {
                this.notHoldCard[index].vipCardSpmDtTrgVos[k].select = 0;
            }
            this.checkedIndex = index;
            item.select = 1;
        },
        //排序
        bubbleSort(arr) {
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < len - 1 - i; j++) {
                    if (arr[j].priority < arr[j + 1].priority) {
                        //相邻元素两两对比
                        var temp = arr[j + 1]; //元素交换
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }
                }
            }
            return arr;
        },
        // 立即购买
        async payment(index) {
            var vdata = null;
            for (
                var i = 0;
                i < this.notHoldCard[index].vipCardSpmDtTrgVos.length;
                i++
            ) {
                if (!!this.notHoldCard[index].vipCardSpmDtTrgVos[i].select) {
                    if (
                        this.notHoldCard[index].vipCardSpmDtTrgVos[i].select ==
                        1
                    ) {
                        vdata = this.notHoldCard[index].vipCardSpmDtTrgVos[i];
                    }
                }
            }
            if (this.notHoldCard[index].vipCardSpmDtTrgVos.length > 0) {
                if (
                    !vdata ||
                    (!vdata.validityTerm && vdata.validityTerm !== 0)
                ) {
                    this.$message(this.$t("memberCard.chooseValidityPeriod"));
                    return;
                }
            } else {
                vdata = {};
                this.$set(
                    vdata,
                    "validityTerm",
                    this.notHoldCard[index].validTerm
                );
                this.$set(vdata, "price", this.notHoldCard[index].cardAmount);
                console.log(vdata);
            }
            window.c_showLoading();
            let params = {
                shopCode: this.Storage.get("USER_INFO").shopCode,
                cardLevelCode: this.notHoldCard[index].cardLevelCode,
                valiDityTerm: vdata.validityTerm
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
            // if (!!this.userCard.priority) {
            //     if (this.userCard.priority > this.notHoldCard[index].priority) {
            //         this.$confirm(
            //             this.$t("memberCard.buyTips"),
            //             this.$t("memberCard.tips"),
            //             {
            //                 confirmButtonText: this.$t("memberCard.sure"),
            //                 cancelButtonText: this.$t("memberCard.cancal"),
            //                 type: "warning"
            //             }
            //         )
            //             .then(() => {
            //                 this.btnStatus = false;
            //                 window.c_showLoading(false);
            //                 this.$router.push({
            //                     name: "payMode",
            //                     query: data
            //                 });
            //             })
            //             .catch(() => {
            //                 this.btnStatus = false;
            //                 window.c_showLoading(false);
            //                 this.$message({
            //                     type: "info",
            //                     message: this.$t("memberCard.sureDone")
            //                 });
            //             });
            //         return;
            //     }
            // }
            window.c_showLoading(false);
            this.$router.push({
                name: "payMode",
                query: data
            });
        },
        // 获取会员卡
        getList() {
            window.c_showLoading();
            let data = {
                busContsCode: Storage.get("properties").busContsCode,
                shopCode: Storage.get("USER_INFO").shopCode
            };
            UserService.getBuyCardLevelList(data)
                .then(res => {
                    this.cardList = res;
                    console.log(this.cardList, "card");
                    let holdArr = [];
                    let arr = [];
                    for (var i = 0; i < this.cardList.length; i++) {
                        if (!this.cardList[i].usrName) {
                            arr.push(this.cardList[i]);
                        } else {
                            holdArr.push(this.cardList[i]);
                        }
                    }
                    arr = this.bubbleSort(arr);
                    if (holdArr.length > 0) {
                        this.userCard = holdArr[holdArr.length - 1];
                    } else {
                        this.userCard = {
                            cardLevelName: null,
                            validTerm: null,
                            expireDate: null,
                            vipLevelDetailDto: {
                                lable: null
                            },
                            vipCardSpmDtTrgVos: [],
                            validityTerm: null,
                            unit: null,
                            priority: null
                        };
                    }
                    // 给未持有卡设置select
                    for (var j = 0; j < arr.length; j++) {
                        if (!!arr[j].vipCardSpmDtTrgVos) {
                            for (
                                var k = 0;
                                k < arr[j].vipCardSpmDtTrgVos.length;
                                k++
                            ) {
                                this.$set(
                                    arr[j].vipCardSpmDtTrgVos[k],
                                    "select",
                                    0
                                );
                            }
                        }
                    }
                    this.notHoldCard = arr;
                    // console.log("this.notHoldCard", this.notHoldCard);
                })
                .then(() => {
                    window.c_showLoading(false);
                });
        }
    },
    created() {
        // 获取所有会员卡
        this.getList();
    }
};
</script>

<style scoped lang="scss">
@import "./scss/member-card.scss";
</style>
