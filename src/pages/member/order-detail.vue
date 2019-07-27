/*
* createTime：2019/1/30
* author：zhibin.zhao
* description: 订单详情
*/
<template>
    <div class="order-detail">
        <!-- 订单进度 begin -->
        <div class="step" v-if="!!this.stepCode">
            <el-steps :active="stepCode - 1" align-center>
                <el-step
                    v-for="(item,index) in step"
                    :key="index"
                    :title="item.name"
                    :description="item.time"
                ></el-step>
            </el-steps>
        </div>
        <!-- 订单进度 end -->

        <!-- 订单号 begin -->
        <div class="top">
            <div class="billCode">{{$t('order.orderNumber')}}：{{orderInfo.billCode}}</div>
            <div class="orderTime">{{$t('order.orderTime')}}：{{orderInfo.ordTime}}</div>
        </div>
        <!-- 订单号 begin -->

        <!-- 订单状态 begin -->
        <div class="type clearfix">
            <!--<div class="status">订单状态：{{orderInfo.ordStatusNames}}</div>-->
            <!-- 二期没有待评价状态 -->
            <div
                class="status"
            >{{$t('order.orderState')}}：{{orderInfo.ordStatusNames == "待评价" ? $t('order.dealComplete') : orderInfo.ordStatusNames}}</div>
            <!-- 待付款订单倒计时 -->
            <countDown :order="orderInfo" @refresh="cancelOrder"></countDown>
        </div>
        <!-- 订单状态 end -->

        <!-- 订单信息 begin -->
        <div class="invoices">
            <div class="title">
                <div class="info">{{$t('order.orderDetail.orderInfo')}}</div>
                <router-link
                    v-if="showInvoice === 1 && !!invoiceStatus"
                    class="apply"
                    tag="div"
                    :to="{path:'invoice',query:{fromPage: 'orderDetail',billCode: billCode}}"
                >{{$t('order.orderDetail.applyBill')}}</router-link>
                <router-link
                    v-if="showInvoice === 2"
                    class="apply"
                    tag="div"
                    :to="{path:'invoice'}"
                >{{$t('order.orderDetail.lookBill')}}</router-link>
            </div>
            <div class="detail">
                <p v-if="relateAccountsNum>0">
                    <span>{{$t('order.orderDetail.sourceAccount')}}</span>
                    <span>：</span>
                    {{orderInfo.sourceAccount | vipAccountHandle}}
                </p>
                <p>
                    <span class="w3">{{$t('order.orderDetail.receiver')}}</span>
                    <span>：</span>
                    {{orderInfo.cargoUsrName}}
                </p>
                <p>
                    <span class="w3">{{$t('order.phoneNumber')}}</span>
                    <span>：</span>
                    {{orderInfo.cargoMobile}}
                </p>
                <p>
                    <span>{{$t('order.shippingAddress')}}</span>
                    <span>：</span>
                    {{orderInfo.cargoStateName + orderInfo.cargoCityName + orderInfo.cargoDestName +
                    orderInfo.cargoAddress + (orderInfo.shippingWayCode === 'mdzq' ? orderInfo.recptdptName : '')}}
                </p>
                <p>
                    <span>{{$t('order.deliveryMethod')}}</span>
                    <span>：</span>
                    {{orderInfo.shippingWayName}}
                </p>
                <p>
                    <span class="w2">{{$t('order.remark')}}</span>
                    <span>：</span>
                    {{!!orderInfo.ctmMessage ? orderInfo.ctmMessage: $t('order.orderDetail.nothing') }}
                </p>
            </div>
        </div>
        <!-- 订单信息 end -->

        <!-- 包裹 begin -->
        <div
            class="package"
            v-if="package && package.length > 0 && orderInfo.shippingWayCode !== 'mdzq'"
        >
            <ul>
                <li
                    v-for="(item,index) in package"
                    :key="index"
                    :class="{'active' : actPackageIndex === index}"
                    @click="getPkg(item,index)"
                >{{item.name}}</li>
            </ul>
            <div class="logis">
                <p v-if="package.length > 1">{{$t('order.orderDetail.packageErrorMsg')}}</p>
                <div
                    class="details"
                    v-for="(item,index) in package"
                    :key="index"
                    v-show="index === actPackageIndex"
                >
                    <div
                        class="logistic-box"
                        v-if="!!item.data.expressCode && !!item.data.expressNo"
                    >
                        <div class="item">
                            <div class="label">{{$t('order.orderDetail.expressCompany')}}:</div>
                            <div class="value">{{item.data.expressName}}</div>
                        </div>
                        <div class="item">
                            <div class="label">{{$t('order.orderDetail.expressNumber')}}:</div>
                            <div class="value">{{item.data.expressNo}}</div>
                        </div>
                        <div class="item">
                            <div class="label">{{$t('order.orderDetail.logistics')}}:</div>
                            <div class="value" v-if="item.data.logisticInfo.length > 0">
                                <template v-for="(step ,step_index) in item.data.logisticInfo">
                                    <div
                                        class="child"
                                        :key="step_index"
                                        v-show="(step_index>1&&logistics_showMore==false)?false:true"
                                    >{{step.acceptTime}}</div>
                                    <div
                                        class="child"
                                        :key="step_index"
                                        v-show="(step_index>1&&logistics_showMore==false)?false:true"
                                    >{{step.acceptStation}}</div>
                                </template>
                                <div
                                    class="load-more"
                                    v-show="item.data.logisticInfo.length > 2"
                                    @click="logistics_showMore=!logistics_showMore"
                                >{{logistics_showMore?$t('order.orderDetail.hideMore'):$t('order.orderDetail.showMore')}}</div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="wait-send"
                        v-if="!item.data.expressCode && !item.data.expressNo"
                    >{{$t('order.orderDetail.awaitGoods')}}</div>
                </div>
            </div>
        </div>
        <!-- 包裹 end -->

        <!-- 商品信息 begin -->
        <div class="goods">
            <table>
                <thead>
                    <tr>
                        <th colspan="2" class="textLeft">{{$t('order.orderDetail.goods')}}</th>
                        <th>{{$t('common.unitPrice')}}</th>
                        <th>{{$t('common.quantity')}}</th>
                        <th>{{$t('order.orderDetail.realPrice')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in orderInfo.goodsList" :key="index">
                        <td colspan="2">
                            <div class="product clearfix">
                                <div class="img" @click="goDetail(item)">
                                    <img
                                        v-lazy="getImg(item.thumb)"
                                        :key="item.thumb"
                                        class="goods-cover"
                                    />
                                    <!-- 定制商品使用 begin -->
                                    <i
                                        class="iconfont icon-dingzhitubiao customization"
                                        v-show="item.orderFlag === 1"
                                    ></i>
                                    <!-- 定制商品使用 end -->
                                </div>
                                <div class="info">
                                    <div class="desc">{{item.goodsName}}</div>
                                    <div class="other clearfix">
                                        <!-- 大货商品信息 begin -->
                                        <template v-if="item.orderFlag===0">
                                            <span>{{item.colorName}}&nbsp;{{item.sizeName}}</span>
                                        </template>
                                        <!-- 大货商品信息 end -->

                                        <!-- 定制商品信息 begin -->
                                        <template v-if="item.orderFlag===1">
                                            <!--显示着装人信息 begin  -->
                                            <template v-if="item.measureOpCode=='D_MSROPMSR' ">
                                                <template
                                                    v-if="!!item.measure && item.measure.length > 0 "
                                                >
                                                    <div
                                                        class="flex-box fl"
                                                        v-if="item.measure[0].measureType=='预约量体'"
                                                        @click.stop="getSalemeasure(item,index)"
                                                    >
                                                        <span
                                                            class="dress-infor"
                                                        >{{$t('order.dressPeople')}}:{{item.measure[0].dressPerson}}</span>
                                                    </div>
                                                    <div
                                                        class="flex-box fl"
                                                        @click.stop="toViewDress(item,index)"
                                                        v-else
                                                    >
                                                        <span
                                                            class="dress-infor"
                                                        >{{$t('order.dressPeople')}}:{{item.measure[0].dressPerson}}</span>
                                                    </div>
                                                </template>

                                                <!-- 添加着装人按钮 begin -->
                                                <div
                                                    class="addDress"
                                                    @click="addDressItem(item)"
                                                    v-else-if="orderInfo.ordStatusCodes=='D_ORDSPAYING' || orderInfo.ordStatusCodes=='D_ORDSSHIPPING' "
                                                >
                                                    {{$t('order.addDressPeople')}}
                                                    <!--<i class="iconfont icon-bannerjiantou"></i>-->
                                                </div>
                                                <!-- 添加着装人按钮 end -->

                                                <!-- 新的预约 begin -->
                                                <div
                                                    class="dressed-alter dresss-booking-alter"
                                                    v-if="item.showInfoDetial"
                                                >
                                                    <div class="contain flex-box flex-wrap">
                                                        <div class="flex-between">
                                                            <span>{{$t('order.dressPeople')}}：</span>
                                                            <span>{{item.measure[0].dressPerson}}</span>
                                                        </div>
                                                        <div class="flex-between">
                                                            <span>{{$t('order.phone')}}：</span>
                                                            <span>{{item.measure[0].dressPhone}}</span>
                                                        </div>
                                                        <div class="flex-between">
                                                            <span>{{$t('order.appointmentTime')}}：</span>
                                                            <span>{{item.measure[0].orderTime}}</span>
                                                        </div>
                                                        <div class="flex-between">
                                                            <span>{{$t('order.appointmentAddress')}}：</span>
                                                            <span>{{item.bookingInor.address}}</span>
                                                        </div>
                                                        <div class="flex-between">
                                                            <span>{{$t('order.remark')}}:</span>
                                                            <span>{{item.bookingInor.measureMemo?item.bookingInor.measureMemo:'-'}}</span>
                                                        </div>
                                                        <div class="flex-between">
                                                            <span>{{$t('order.measureWay')}}:</span>
                                                            <span>{{item.measure[0].msrWayName}}</span>
                                                        </div>
                                                        <div class="flex-between">
                                                            <span>{{$t('order.state')}}:</span>
                                                            <span
                                                                :class="(item.bookingInor.statusId=='10051501' || item.bookingInor.statusId=='10051506')?'state-red':'state-black'"
                                                            >{{item.bookingInor.statusName}}</span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        @click="updateMyBooking(item.bookingInor)"
                                                        v-if="item.bookingInor.statusId=='10051501' || item.bookingInor.statusId=='10051506' "
                                                    >
                                                        <span
                                                            style="color:rgba(153,153,153,1);display: inline;"
                                                        >{{$t('order.go')}}</span>
                                                        <span
                                                            style="display: inline;cursor: pointer;"
                                                        >{{$t('order.personalCenter_myAppointment')}}</span>
                                                        <span
                                                            style="color:rgba(153,153,153,1);display: inline;"
                                                        >{{$t('order.modifyInfo')}}</span>
                                                    </div>
                                                </div>
                                                <!-- 新的预约 end -->

                                                <!-- 旧的明细 begin -->
                                                <div
                                                    class="dressed-alter dresss-details-alter"
                                                    v-if="item.showDetial"
                                                >
                                                    <div class="contain flex-box flex-wrap">
                                                        <div
                                                            class="flex-between"
                                                            v-for="(msg,index) in item.measureInfor"
                                                            :key="index"
                                                        >
                                                            <span>{{msg.vitalName}}</span>
                                                            <span>{{msg.netValue}}</span>
                                                        </div>
                                                    </div>
                                                    <!-- 因为后台临售小票的原因注释bodyList，等五一之后改回来 -->
                                                    <!--<div style="cursor: pointer"-->
                                                    <!--v-if="(item.prodStatusCode == null || item.prodStatusCode=='D_BEFORE' ) && orderInfo.ordStatusCodes != 'D_ORDCANCEL'"-->
                                                    <!--@click="addDressItem(item)">更换着装人-->
                                                    <!--</div>-->
                                                    <!-- 因为后台临售小票的原因注释bodyList，等五一之后改回来 -->
                                                </div>
                                                <!-- 旧的明细 end -->
                                            </template>
                                            <!--显示着装人信息 end  -->
                                        </template>
                                        <!-- 定制商品信息 end -->

                                        <!--定制商品 查看订制信息-->
                                        <div class="custom-btn" v-if="item.orderFlag===1">
                                            <el-button
                                                @click.stop="showCustomDialog(item,index)"
                                            >{{$t('order.orderDetail.viewCustInfo')}}</el-button>
                                            <!--定制信息弹窗-->
                                            <custom-dialog
                                                :key="'custom'+customIndex"
                                                fromPage="orderDetail"
                                                :partList="item.parts"
                                                :mainFabricName="item.mainFab?item.mainFab.fabName:''"
                                                v-clickoutside="handleCustomDiaState"
                                                v-show="item.showCustomInfo"
                                            ></custom-dialog>
                                        </div>
                                        <!-- <el-popover placement="top-start" width="374" trigger="click"
                                    v-if="item.orderFlag===1">
                                    <slot name="reference">
                                    <customDialog fromPage="orderDetail" :partList="item.parts"></customDialog>
                                    </slot>
                                    <el-button slot="reference">查看定制信息</el-button>
                                        </el-popover>-->
                                        <!-- 待收货状态、定制商品显示预计发货时间 -->
                                        <span
                                            v-if="orderInfo.ordStatusCodes === 'D_ORDSSHIPPING' && item.orderFlag===1 && !!item.estimateTime && !!item.estimateTime.split(' ')[0]"
                                        >{{$t('order.orderDetail.planShipmentsTime')}}：{{item.estimateTime.split(" ")[0]}}</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            ¥{{item.averagePrice | Fix2}}
                            <!--<del>¥{{item.tagPrice | Fix2}}</del>-->
                        </td>
                        <td>{{item.ordQty}}</td>
                        <td>¥{{item.amountAverage | Fix2}}</td>
                    </tr>
                    <tr class="bottom">
                        <td colspan="5">
                            <div class="calc">
                                <div class="right">
                                    <div>
                                        <span class="item">{{$t('order.orderDetail.goodsTotal')}}</span>
                                        <span class="item">：</span>
                                        <span class="price">￥{{orderInfo.amountPart | Fix2}}</span>
                                    </div>
                                    <div>
                                        <span class="item w2">{{$t('order.carriage')}}</span>
                                        <span class="item">：</span>
                                        <span class="price">￥{{orderInfo.amountTrans | Fix2}}</span>
                                    </div>
                                    <div>
                                        <span class="item w2">{{$t('order.discounts')}}</span>
                                        <span class="item">：</span>
                                        <span class="price">￥{{orderInfo.totalSumAmount | Fix2}}</span>
                                    </div>
                                    <div>
                                        <span class="item">{{$t('order.orderDetail.actualPayment')}}</span>
                                        <span class="item">：</span>
                                        <!--<span class="price sumPrice">￥{{orderInfo.amountUnPay | Fix2}}</span>-->
                                        <span
                                            class="price sumPrice"
                                        >￥{{ orderInfo.amountNeedPay | Fix2}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="operate">
                                <el-button
                                    class="cancelOrder"
                                    v-if="!!btnCancel"
                                    @click="centerDialogVisible = true"
                                >{{btnCancel}}</el-button>
                                <el-button
                                    class="payByNow"
                                    v-if="btnTypeName"
                                    @click="onBtnClick(btnTypeName)"
                                >{{btnTypeName}}</el-button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- 商品信息 end -->

        <!-- 取消订单接口 begin -->
        <el-dialog :visible.sync="centerDialogVisible" width="36%" :title="$t('common.hint')">
            <span>{{$t('order.isDeleteOrder')}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">{{$t('common.cancel')}}</el-button>
                <el-button type="primary" @click="cancelOrder">{{$t('common.sure')}}</el-button>
            </span>
        </el-dialog>
        <!-- 取消订单接口 end -->
    </div>
</template>
<script>
import { Popover, Steps, Step, Tabs, TabPane } from "element-ui";
import moment, { min } from "moment";
import { Order, Invoice, ThirdParty, Goods, Volume } from "../../api/service";
import check from "../../utils/check";
import Storage from "../../utils/storage";
import { mapState } from "vuex";
import countDown from "./components/countDown";
import customDialog from "../cart/components/CustomDialog";
import clickoutside from "@/components/clickoutside";
import { constants } from "crypto";

export default {
    data() {
        return {
            countDownTime: false,
            billCode: null, // 订单号
            orderInfo: {}, // 订单详情
            errMsg: {
                // 订单流程错误的提示文案
                kdps: "已取消发货",
                mdzq: "已取消发货"
            },
            step: [], // 订单进度条
            package: [], // 订单包裹
            actPackageIndex: null, // 选中展示的订单包裹
            invoiceStatus: null, // 是否允许开发票
            centerDialogVisible: false, // 取消订单弹窗
            selectValue: null, // 选中的取消订单理由
            options: [], // 取消订单的理由
            btnCancel: null, //  取消按钮
            btnTypeName: null, // 确认按钮
            customIndex: -1, // 所显示定制弹窗index
            orderStatus: [
                {
                    name: "待付款",
                    searchCode: "D_ORDSPAYING"
                },
                {
                    name: "待发货",
                    searchCode: "D_ORDSSHIPPING"
                },
                {
                    name: "待收货",
                    searchCode: "D_ORDSDELIVERY"
                }
            ],
            stepCode: 1, // 步骤条
            deliveryText: {
                // 门店自取
                mdzq: [
                    {
                        name: "下单",
                        time: ""
                    },
                    {
                        name: "支付",
                        time: " "
                    },
                    // {
                    //     name: "备货中",
                    //     time: ""
                    // },
                    // {
                    //     name: "备货完成",
                    //     time: ""
                    // },
                    {
                        name: "备货",
                        time: ""
                    },
                    {
                        name: "签收",
                        time: ""
                    }
                ],

                // 快递配送
                kdps: [
                    {
                        name: "下单",
                        time: ""
                    },
                    {
                        name: "支付",
                        time: ""
                    },
                    {
                        name: "发货",
                        time: ""
                    },
                    // {
                    //     name: "发货",
                    //     time: ""
                    // },
                    {
                        name: "签收",
                        time: ""
                    }
                ]
            }, // 物流文案
            relateAccountsNum: Storage.get("USER_INFO").relationAccountLength,
            logistics_showMore: false //是否显示更多物流信息
            //                showDetial: false, //显示明细详情
            //                showInfoDetial: false, //显示我的预约单详情
        };
    },
    directives: {
        clickoutside
    },
    components: {
        "el-popover": Popover,
        "el-steps": Steps,
        "el-step": Step,
        "el-tabs": Tabs,
        "el-tab-pane": TabPane,
        countDown,
        customDialog
    },
    computed: {
        //实付款
        actualPay: function() {
            let money =
                this.orderInfo.actualAmount -
                this.orderInfo.amountPoint -
                this.orderInfo.balancePayAmount;
            if (money <= 0) {
                money = 0;
            }
            return money;
        },

        // 显示发票逻辑(0不显示，1显示申请,2显示查看)
        showInvoice: function() {
            if (
                !this.orderInfo ||
                !check.isEmpty(this.orderInfo.invoiceDetail)
            ) {
                return 2;
            } else if (
                check.isEmpty(this.orderInfo.invoiceDetail) &&
                this.orderInfo.isAllowOpenTicket
            ) {
                return 1;
            } else {
                return 0;
            }
        }

        // 订单流程
        //            ...mapState("order", ["deliveryText"])
    },
    methods: {
        //  初始化按钮组
        initBtn(ordStatus) {
            const ordStatuNameMap = {
                D_ORDSPAYING: this.$t("order.immediatePay"), // 立即支付
                D_ORDSDELIVERY: this.$t("order.confirmOrder"), // 待收货
                D_ORDSCOMMENTING: this.$t("order.againBuy"), // 待评价（三期开发待评价）
                D_ORDRECEIVED: this.$t("order.againBuy") // 待评价（三期开发待评价）
            };
            const btnName = ordStatuNameMap[ordStatus];
            this.btnCancel =
                ordStatus === "D_ORDSPAYING"
                    ? this.$t("order.deleteOrder")
                    : null;
            this.btnTypeName = btnName ? btnName : null;
        },
        // 控制定制弹窗状态 -1时关闭
        handleCustomDiaState(index = -1) {
            this.collapseDressInfo();
        },

        // 获取订单详情
        getDetail() {
            c_showLoading();
            let data = {
                billCode: this.billCode || this.$route.query.billCode,
                busContsCode: Storage.get("properties").busContsCode
            };
            console.log("getDetail", data);
            Order.getDetailInfo(data).then(res => {
                this.orderInfo = res;
                this.getStep(this.orderInfo.shippingWayCode);
                this.initBtn(this.orderInfo.ordStatusCodes);
                this.orderInfo.goodsList.forEach(item => {
                    if (item.orderFlag === 1) {
                        item.showDetial = false;
                        item.showInfoDetial = false;
                        item.showCustomInfo = false;
                    }
                });
                this.package = this.orderInfo.packages;
                if (!!this.package && this.package.length > 0) {
                    this.package.forEach(item => {
                        item.data.logisticInfo = [];
                    });
                    this.getPkg(this.package[0], 0);
                }
            });
        },

        // 获取发票设置，用于判断是否可以开发票
        canSetInvoice() {
            Invoice.canSetInvoice().then(res => {
                if (res.invoiceStateCode === "D_INV_REFULE") {
                    this.invoiceStatus = false;
                } else {
                    this.invoiceStatus = true;
                }
            });
        },

        // 获取订单进度
        getStep(type) {
            this.step = this.deliveryText[type];
            this.step[0].time = this.orderInfo.ordTime; //  下单时间
            let nodeCode = this.orderInfo.nodeCode;
            switch (this.orderInfo.ordStatusCodes) {
                case "D_ORDSPAYING":
                    nodeCode = 1;
                    break;
                case "D_ORDSSHIPPING":
                    nodeCode = 2;
                    break;
                case "D_ORDSDELIVERY":
                    nodeCode = 3;
                    break;
                case "D_ORDSCOMMENTING":
                    nodeCode = 4;
                    break;
                case "D_ORDRECEIVED":
                    nodeCode = 4;
                    break;
                case "D_ORDCANCEL":
                    nodeCode = "";
                    break;
            }
            this.stepCode = nodeCode;
            if (!!nodeCode) {
                if (nodeCode > 2) {
                    this.step[1].time = this.orderInfo.ordPayTime; // 支付时间
                    this.step[nodeCode - 1].time = this.orderInfo.nodeTime; // 当前步骤时间
                } else {
                    this.step[nodeCode - 1].time = this.orderInfo.nodeTime;
                }
            } else {
                // 后台取消订单。
                //                    this.stepCode = 3
                //                    this.step[2].name = this.errMsg[type];
            }
            console.log("this.step", this.step);
            c_showLoading(false);
        },

        // 获取退单原因列表
        getReasons() {
            let data = {
                pageNum: 0,
                reasonTypeCode: "D_CANCEL",
                effFlag: 1
            };
            Order.getReasonsList(data).then(res => {
                if (res.length > 0) {
                    res.forEach(item => {
                        item.label = item.reasonName;
                        item.value = item.id;
                    });
                }
                this.options = res;
            });
        },

        // 取消订单
        cancelOrder() {
            let data = {
                flag: 1,
                ctmUsrId: Storage.get("USER_INFO").usrId,
                billCodes: [this.billCode]
            };
            if (!!this.selectValue) data.cancelReasonId = this.selectValue; // 取消订单原因对应的id
            Order.cancel(data).then(
                res => {
                    this.$toast(this.$t("order.deleteOrderSuccess"));
                    // this.$message(this.$t("order.deleteOrderSuccess"));
                    this.centerDialogVisible = false;
                    this.getDetail();
                },
                err => {
                    let failMsg =
                        err.errorMsg || this.$t("order.deleteOrderFail");
                    this.$alert(failMsg);
                }
            );
        },

        //  确认收货
        confirmOrder() {
            //  确认收货前判断该订单是否存在售后申请单子
            let data = {
                ctmUsrId: Storage.get("USER_INFO").usrId,
                billCodes: [this.billCode]
            };
            Order.beforeSignUp(data).then(
                res => {
                    //  0:没有售后单
                    //  1:有未完成的售后申请单
                    //  2:有待审核的售后申请单
                    let messages = {
                        0: this.$t("order.confirmOrderJudge_nomal"),
                        1: this.$t("order.confirmOrderJudge_beforeSale"),
                        2: this.$t("order.confirmOrderJudge_confirmSale")
                    };
                    let btnName = {
                        0: this.$t("common.sure"),
                        2: this.$t("order.continue")
                    };

                    // 订单下的挂的售后申请单状态为【待支付】【待寄回】【已寄回】弹框提示
                    if (res === 1) {
                        this.$alert(messages[1]);
                    } else {
                        this.$confirm(messages[res], {
                            confirmButtonText: btnName[res]
                        })
                            .then(() => {
                                Order.signUp(data).then(
                                    () => {
                                        this.$toast(
                                            this.$t("order.confirmOrderSuccess")
                                        );
                                        // this.$message(this.$t("order.confirmOrderSuccess"));
                                        this.getDetail();
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
                    this.$alert(this.$t("order.networkSlow"));
                }
            );
        },

        //点击再次购买，先检测下架和售空商品
        buyAgain() {
            c_showLoading();
            let goodListOld = this.orderInfo.goodsList;
            let goodList = [];
            for (let i = 0; i < goodListOld.length; i++) {
                goodList.push({
                    busContsCode: Storage.get("properties").busContsCode, //业务触点
                    goodsCode: goodListOld[i].goodsCode, // 商品编码
                    ptiPartDtSkuId: goodListOld[i].ptiPartDtSkuId, // 商品skuid
                    amount: goodListOld[i].ordQty, // 数量
                    orderFlag: goodListOld[i].orderFlag, // 是否定制商品标识
                    ptiPartHdId: goodListOld[i].ptiPartHdId, //商品id
                    rtlOrdDtId: goodListOld[i].saleOrdDtId
                });
            }
            let data = {
                ctmUsrId: Storage.get("USER_INFO").usrId,
                shopId: Storage.get("USER_INFO").shopId,
                goodList: goodList
            };
            Goods.getUseableGood(data)
                .then(res => {
                    console.log(res);
                    if (res.sellAll == 1 && res.stockAll == 1) {
                        this.againBuy_success();
                    } else {
                        this.$alert(
                            this.$t("order.againBuyError"),
                            this.$t("common.hint"),
                            {
                                confirmButtonText: this.$t("common.sure")
                            }
                        );
                        c_showLoading(false);
                    }
                })
                .catch(() => {
                    c_showLoading(false);
                });
        },

        //再次购买生成订单
        againBuy_success: function() {
            let data = {
                ctmUsrId: Storage.get("USER_INFO").usrId,
                shopCode: Storage.get("USER_INFO").shopCode,
                billCode: this.billCode
            };
            Order.buyAgain(data)
                .then(res => {
                    this.$router.push("/order-settle?orderHdId=" + res);
                    c_showLoading(false);
                })
                .catch(() => {
                    c_showLoading(false);
                });
        },

        //点击事件
        onBtnClick(name) {
            switch (name) {
                case "取消订单":
                    this.cancelOrder();
                    break;
                case "确认收货":
                    this.confirmOrder();
                    break;
                case "立即支付":
                    this.goPay();
                    break;
                case "立即评价":
                    // todo 跳转评价页面/显示评价弹窗
                    break;
                case "再次购买":
                    this.buyAgain();
                    break;
                default:
                    this.btnCancel = null;
                    this.btnTypeName = null;
            }
        },

        // 跳转支付页面
        goPay() {
            let url = `/pay-mode?billCode=${this.billCode}&actuallyPaid=${
                this.actualPay
            }`;
            this.$router.push(url);
        },

        //  获取物流
        getLogistic(item) {
            if (!item.data.expressCode || !item.data.expressCode) {
                c_showLoading(false);
                return;
            }
            if (item.data.expressCode) {
                c_showLoading();
                let data = {
                    expressCode: item.data.expressCode,
                    logisticCode: item.data.expressNo
                };
                ThirdParty.getLogis(data)
                    .then(
                        res => {
                            item.data.logisticInfo = res.traceList;
                            this.orderInfo = JSON.parse(
                                JSON.stringify(this.orderInfo)
                            );
                        },
                        err => {
                            let failMsg =
                                err.errorMsg ||
                                this.$t(
                                    "order.orderDetail.obtainLogisticsFail"
                                );
                            this.$alert(failMsg);
                        }
                    )
                    .then(() => {
                        c_showLoading(false);
                    });
            }
        },

        //  展示包裹信息
        getPkg(item, index) {
            if (this.actPackageIndex === index) return;
            this.actPackageIndex = index;
            this.getLogistic(item);
        },

        //  跳转商品详情
        goDetail(item) {
            if (item.orderFlag === 1) {
                this.$router.push("/goods-design?goodsCode=" + item.goodsCode);
            } else if (item.orderFlag === 0) {
                this.isShelve(item.goodsCode).then(res => {
                    if (res) {
                        this.$router.push(
                            "/goods-detail?goodsCode=" + item.goodsCode
                        );
                    } else {
                        setTimeout(() => {
                            this.$router.push("/off-shelves");
                        }, 500);
                    }
                });
            } else {
                alert(this.$t("order.goDetailFail"));
            }
        },

        //添加着装人  选择着装人
        addDressItem(item) {
            console.log(item.ptiPartClassId, "item.ptiPartClassId");
            this.$router.push({
                path: "/choice-dressed",
                query: {
                    billCode: this.billCode,
                    rtlOrdDtId: item.saleOrdDtId,
                    ptiPartClassId: item.ptiPartClassId,
                    callbackUrl: this.$route.fullPath,
                    dressPerson:
                        !!item.measure && item.measure.length > 0
                            ? item.measure[0]
                            : null
                }
            });
        },

        //隐藏着装人信息
        collapseDressInfo(goodIndex, field, state) {
            this.orderInfo.goodsList.forEach((good, index) => {
                this.$set(good, "showInfoDetial", false);
                this.$set(good, "showCustomInfo", false);
                this.$set(good, "showDetial", false);
                if (field && index == goodIndex) {
                    this.$set(good, field, state);
                }
            });
            this.orderInfo = JSON.parse(JSON.stringify(this.orderInfo));
        },
        // 显示定制信息弹窗
        showCustomDialog(good, index) {
            console.log("showCustomDialog1", good.showCustomInfo);
            // let good = this.orderInfo.goodsList[index];
            this.collapseDressInfo(
                index,
                "showCustomInfo",
                !good.showCustomInfo
            );

            console.log(
                "showCustomDialog2",
                this.orderInfo.goodsList[index].showCustomInfo
            );
        },

        //查看预约单明细
        async getSalemeasure(item, index) {
            let data = {
                rtlOrdDtId: item.saleOrdDtId
            };
            const res = await Volume.getSalemeasure(data);
            item.bookingInor = res;
            this.collapseDressInfo(
                index,
                "showInfoDetial",
                !item.showInfoDetial
            );

            // this.orderInfo = JSON.parse(JSON.stringify(this.orderInfo))
        },

        // 查看着装人
        async toViewDress(item, index) {
            // if (item.showDetial == true) return (item.showDetial = false);
            console.log("toViewDress", index);
            let data = {
                id: item.saleOrdDtId
            };
            const res = await Volume.measureInfor(data);
            let arr = [],
                showArr = [];
            //  临时使用中文判断，五一放假之后用编码
            res.MsrList.forEach(item => {
                if (arr.indexOf(item.vitalName) === -1) {
                    arr.push(item.vitalName);
                    showArr.push(item);
                }
            });
            item.measureInfor = showArr;

            this.collapseDressInfo(index, "showDetial", !item.showDetial);
        },

        //  更新着装人信息
        updateMyBooking(bookingDetail) {
            this.$router.push({
                path: "/my-reserve",
                query: {
                    bookingDetail: bookingDetail,
                    callbackUrl: this.$route.fullPath
                }
            });
        },
        //注册监听点击事件
        registerDocListener() {
            document.addEventListener("click", $event => {
                this.collapseDressInfo();
            });
        }
    },
    filters: {
        vipAccountHandle: function(str) {
            return (str + "").replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
        }
    },
    created() {
        this.billCode = this.$route.query.billCode || null;
        this.getDetail();
        this.canSetInvoice();
        this.registerDocListener();
    },
    beforeDestroy() {
        document.removeEventListener("click", () => {});
    }
};
</script>

<style scoped lang="scss" type="text/scss">
.order-detail {
    font-size: $font-small;
    color: $text-primary;
    padding: 30px 0;
    .top {
        .billCode {
            width: 50%;
            display: inline-block;
        }
        .orderTime {
            width: 50%;
            display: inline-block;
            text-align: right;
        }
    }
    .type {
        padding: 12px 20px;
        margin-top: 10px;
        background-color: $bg-color-regular;
        border: 1px solid $color-line;
        .status {
            width: 50%;
            float: left;
            height: 24px;
        }
        .remainTime {
            width: 50%;
            float: right;
            height: 24px;
            text-align: right;
            color: $text-warn;
            .icon-daojishi {
                margin-right: 15px;
            }
        }
    }
    .invoices {
        border: 1px solid $color-line;
        margin-top: 30px;
        .title {
            padding: 13px 20px;
            background-color: $bg-color-regular;
            font-weight: bold;
            .info {
                width: 50%;
                display: inline-block;
            }
            .apply {
                width: 50%;
                display: inline-block;
                text-align: right;
                color: $text-blue;
                cursor: pointer;
            }
        }
        .detail {
            text-align: left;
            margin: 20px;
            p {
                line-height: 32px;
                span {
                    width: 84px;
                    color: $text-secondary;
                }
                .w2 {
                    letter-spacing: 2em;
                    margin-right: -2em;
                }
                .w3 {
                    letter-spacing: 0.5em;
                    margin-right: -0.5em;
                }
            }
        }
    }
    .package {
        margin-top: 30px;
        border: 1px solid $color-line;
        ul {
            height: 50px;
            padding: 8px 0;
            background-color: $bg-color-regular;
            li {
                width: 110px;
                font-size: $font-small;
                color: $text-secondary;
                height: 34px;
                line-height: 34px;
                display: inline-block;
                border-right: 1px solid $text-placeholder;
                cursor: pointer;
                text-align: center;
                &:hover,
                &.active {
                    color: $text-hover;
                }
            }
        }
        .logis {
            padding: 10px 30px;
            p {
                padding: 5px;
                background-color: rgba(245, 209, 213, 1);
                color: $text-primary;
                font-size: $font-small;
            }
            .details {
                .item {
                    margin: 15px 0;
                    font-size: $font-small;
                    .label {
                        width: 100px;
                        color: $text-secondary;
                        display: inline-block;
                        vertical-align: top;
                    }
                    .value {
                        color: $text-primary;
                        display: inline-block;
                        .load-more {
                            position: relative;
                            left: 50%;
                            display: inline-block;
                            padding: 10px 16px 0px;
                            margin: auto;
                            text-align: center;
                            color: #ccc;
                            cursor: pointer;
                            transform: translate(-50%, 0);
                        }
                    }
                }
                .wait-send {
                    margin: 30px 0;
                    font-size: $font-small;
                    line-height: 1;
                    color: $text-secondary;
                }
            }
        }
    }
    .goods {
        table {
            width: 100%;
            table-layout: fixed;
            border: 1px solid $color-line;
            margin-top: 30px;
            thead {
                line-height: 50px;
                background-color: $bg-color-regular;
                tr {
                    th {
                        text-align: center;
                    }
                }
            }
            .textLeft {
                text-align: left;
                padding-left: 20px;
            }
            tbody {
                tr {
                    td {
                        text-align: center;
                        .product {
                            padding-top: 15px;
                            padding-bottom: 5px;
                            .img {
                                cursor: pointer;
                                float: left;
                                margin: 0 10px;
                                position: relative;
                                width: 100px;
                                height: 100px;
                                padding: 10px;
                                overflow: hidden;
                                > .goods-cover {
                                    display: block;
                                    max-width: 100%;
                                    max-height: 100%;
                                }
                                > .customization {
                                    position: absolute;
                                    top: 0px;
                                    left: 3px;
                                    font-size: 10px;
                                    color: $color-golden;
                                }
                            }
                            .info {
                                text-align: left;
                                font-size: $font-small;
                                min-width: 234px;
                                float: left;
                                .desc {
                                    width: 234px;
                                    max-height: 42px;
                                    word-break: break-all;
                                    color: $text-primary;
                                    overflow: hidden;
                                }
                                .other {
                                    color: $text-secondary;
                                    .addDress {
                                        width: 120px;
                                        height: 32px;
                                        border: solid 1px $text-placeholder;
                                        color: $text-primary;
                                        text-align: center;
                                        font-size: $font-small;
                                        line-height: 32px;
                                        margin: 10px 0;
                                        cursor: pointer;
                                        float: left;
                                        transition: ease 0.3s;
                                        &:hover {
                                            border: solid 1px $color-golden;
                                            color: $color-golden;
                                            background: $color-white;
                                        }
                                        .icon-bannerjiantou {
                                            margin-left: 10px;
                                            font-size: 12px;
                                        }
                                    }
                                    span {
                                        display: block;
                                        line-height: 30px;
                                    }
                                    button {
                                        padding: 9px 14px;
                                    }
                                    .custom-btn {
                                        // border:1px solid $color-line;
                                        padding: 0 10px;
                                        line-height: 30px;
                                        cursor: pointer;
                                        position: relative;
                                        float: left;
                                        .el-button {
                                            width: 120px;
                                            height: 32px;
                                            padding: 0;
                                            border: solid 1px $text-placeholder;
                                            color: $text-primary;
                                            text-align: center;
                                            font-size: $font-small;
                                            line-height: 32px;
                                            margin: 10px 0;
                                            cursor: pointer;
                                            -webkit-border-radius: 0;
                                            -moz-border-radius: 0;
                                            border-radius: 0;
                                            transition: ease 0.3s;
                                            &:hover {
                                                border: solid 1px $color-golden;
                                                color: $color-golden;
                                                background: $color-white;
                                            }
                                        }
                                        .container {
                                            top: 10px;
                                        }
                                    }
                                }
                            }
                        }
                        del {
                            color: $text-secondary;
                            margin-left: 5px;
                        }
                    }
                }
                .bottom {
                    td {
                        padding: 10px 20px 30px;
                        border-top: 1px dotted $color-line;
                        .calc {
                            width: 100%;
                            display: inline-block;
                            .right {
                                width: 213px;
                                float: right;
                                color: $text-primary;
                                font-size: $font-small;
                                div {
                                    text-align: left;
                                    margin-top: 20px;
                                    .item {
                                        width: 84px;
                                        color: $text-secondary;
                                    }
                                    .w2 {
                                        letter-spacing: 2em;
                                        margin-right: -2em;
                                    }
                                    .w3 {
                                        letter-spacing: 0.5em;
                                        margin-right: -0.5em;
                                    }
                                    .price {
                                        float: right;
                                    }
                                    .sumPrice {
                                        color: $text-warn;
                                        font-size: $font-regular;
                                        font-weight: bold;
                                    }
                                }
                            }
                        }
                        .operate {
                            text-align: right;
                            color: $text-primary;
                            font-size: $font-common;
                            margin-top: 20px;
                            .cancelOrder {
                                display: inline-block;
                                width: 168px;
                                height: 49px;
                            }
                            .payByNow {
                                display: inline-block;
                                width: 168px;
                                height: 49px;
                                background-color: $color-golden;
                                margin-left: 30px;
                                color: $color-white;
                                border-color: $color-golden;
                            }
                        }
                    }
                }
            }
        }
    }
}

.el-popper {
    padding: 0;
    margin: 0;
}

.customList {
    max-height: 300px;
    overflow: auto;
    font-size: $font-small;
    .customItem {
        padding-left: 10px;
        margin-top: 20px;
        .goodsInfo {
            /*width: 155px;*/
            float: left;
            img {
                width: 50px;
                height: 50px;
                float: left;
            }
            span {
                max-width: 200px;
                height: 50px;
                float: left;
                line-height: 50px;
                margin-left: 20px;
                color: $text-secondary;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        .unitPrice {
            float: right;
            height: 50px;
            line-height: 50px;
            margin-right: 20px;
            color: $text-primary;
        }
    }
    .fonts {
        .weight {
            float: left;
            color: $text-secondary;
            height: 50px;
            line-height: 50px;
            padding-left: 10px;
            span {
                color: $text-primary;
            }
        }
        .unitPrice {
            float: right;
            height: 50px;
            line-height: 50px;
            margin-right: 20px;
            color: $text-primary;
        }
    }
}

@media screen and (max-width: 1199px) {
    .order-detail {
        .goods {
            table {
                tbody {
                    tr {
                        td {
                            .product {
                                .info {
                                    width: 200px !important;
                                    min-width: 100px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

.other {
    color: #333333;
    position: relative;
    div {
        position: relative;
        .dress-infor {
            display: block;
            width: 120px;
            height: 32px;
            padding: 0;
            border: solid 1px $text-placeholder;
            color: $text-primary;
            text-align: center;
            font-size: $font-small;
            line-height: 32px;
            margin: 10px 0;
            cursor: pointer;
            -webkit-border-radius: 0;
            -moz-border-radius: 0;
            border-radius: 0;
            background: rgba(255, 255, 255, 1);
            transition: ease 0.3s;
            /*box-shadow: 0px 2px 4px 0px rgba(29, 29, 35, 0.17);*/
            &:hover {
                border: solid 1px $color-golden;
                color: $color-golden;
            }
        }
        .to-view {
            margin-left: 10px;
        }
    }
    .dressed-alter:before {
        display: block;
        content: "";
        border-width: 8px 8px 8px 8px;
        border-style: solid;
        border-color: transparent transparent #e6e6e6 transparent;
        position: absolute;
        left: 9%;
        top: -16px;
    }
    .dresss-details-alter {
        width: 270px;
    }
    .dresss-booking-alter {
        width: 750px;
        .contain {
            div {
                span:nth-child(1) {
                    color: rgba(153, 153, 153, 1);
                }
            }
        }
    }
    .dressed-alter {
        z-index: 20;
        top: 55px;
        left: 10px;
        position: absolute;
        background-color: $color-white;
        padding: 15px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 4px 0px rgba(29, 29, 35, 0.17);
        .contain {
            width: 100%;
            font-size: 10px;

            font-family: PingFangSC-Medium;
            font-weight: 500;
            color: #333333;
            line-height: 11px;
            div:nth-child(even) {
                margin-left: 10%;
            }
            div {
                font-size: 10px;
                margin-bottom: 10px;
                width: 45%;
            }
        }
        & > div {
            margin-top: 15px;
            color: #3d78cc;
        }
    }
    .addDress {
        cursor: pointer;
        .icon-bannerjiantou {
            margin-left: 10px;
            font-size: 12px;
        }
    }
    .dress-infor {
        cursor: pointer;
        margin: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.state-red {
    color: red !important;
}
</style>
