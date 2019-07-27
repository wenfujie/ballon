/*
* createTime：2019/1/30
* author：zhibin.zhao
* description: 订单列表
*/
<template>
    <div class="order">
        <div class="tab clearfix">
            <ul>
                <li
                    v-for="(item, index) in orderStatus"
                    :key="index"
                    :class="activeStatus===index?'active':''"
                    @click="changeOrderStatus(item,index)"
                >
                    <a>
                        {{item.name}}&nbsp;
                        <span>{{item.total>99?"99+":item.total}}</span>
                    </a>
                </li>
            </ul>
            <div class="search">
                <el-input
                    :placeholder="$t('order.orderList.searchTip')"
                    v-model="searchContent"
                    @change="searchContentChange"
                >
                    <el-button
                        slot="append"
                        @click="resetPagination();getOrderList()"
                    >{{$t('common.search')}}</el-button>
                </el-input>
                <div class="condition">
                    <el-collapse v-model="activeNames" @change="handleChange" size="small">
                        <el-collapse-item :title="collapseTitle" name="1">
                            <el-form :inline="true" label-width="80px" style="margin-top:20px">
                                <el-form-item :label="$t('order.orderList.orderType')">
                                    <el-select
                                        size="small"
                                        v-model="orderTypeValue"
                                        :placeholder="$t('order.orderList.pleaseSelect')"
                                        @change="selectState"
                                    >
                                        <el-option
                                            v-for="item in orderType"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    :label="$t('order.orderList.sourceAccount')"
                                    v-if="accountList.length>1"
                                >
                                    <el-select
                                        size="small"
                                        v-model="vipInfoHdIds"
                                        :placeholder="$t('order.orderList.pleaseSelect')"
                                        @change="onChangeAccount"
                                    >
                                        <el-option
                                            v-for="account in accountList"
                                            :key="account.name"
                                            :label="account.name"
                                            :value="account.ids"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="$t('order.orderList.orderTime')">
                                    <el-date-picker
                                        size="small"
                                        v-model="timeArr"
                                        type="datetimerange"
                                        align="right"
                                        :start-placeholder="$t('order.orderList.startTime')"
                                        :end-placeholder="$t('order.orderList.endTime')"
                                        :default-time="['00:00:00', '23:59:59']"
                                        @change="onDateTimeChange"
                                    ></el-date-picker>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </div>
        </div>
        <div class="table">
            <table width="100%" class="title">
                <thead>
                    <tr>
                        <th colspan="4" class="check__all">
                            <el-checkbox
                                v-model="selectedAll"
                                @change="selectAllEvent"
                                :disabled="!canSelectAll"
                            >{{$t('common.checkAll')}}</el-checkbox>
                            <el-button
                                :disabled="isBanComfirmBatch"
                                @click="confirmOrderBatch"
                            >{{$t('order.orderList.batchConfirmOrder')}}</el-button>
                            <div class="qty">{{$t('common.quantity')}}</div>
                        </th>
                        <th>{{$t('order.orderList.goodOperate')}}</th>
                        <th>{{$t('order.orderState')}}</th>
                        <th>{{$t('order.orderList.actualPayment')}}</th>
                        <th>{{$t('common.operator')}}</th>
                    </tr>
                </thead>
            </table>
            <div v-if="pagination.count>0">
                <table width="100%" class="data" v-for="(item,index) in orderList" :key="index">
                    <thead>
                        <tr>
                            <th colspan="7" class="checkbox">
                                <el-checkbox
                                    v-model="item.selected"
                                    @change="selectItem"
                                    :disabled="item.ordStatusCode!='D_ORDSDELIVERY'"
                                ></el-checkbox>
                                <div class="billCode">{{$t('order.orderNumber')}}：{{item.billCode}}</div>
                                <div class="time">{{$t('order.orderTime')}}：{{item.ordTime}}</div>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="4">
                                <div
                                    :class="{'product':true, 'clearfix':true,'product_border_top':_index!=0}"
                                    v-for="(order,_index) in item.goodsList"
                                    :key="_index"
                                >
                                    <div class="img">
                                        <img
                                            class="goods-cover order_a"
                                            v-lazy="getImg(order.thumb)"
                                            :key="order.thumb"
                                            @click="goDetail(order)"
                                        />

                                        <i
                                            class="iconfont icon-dingzhitubiao customization"
                                            v-show="order.orderFlag === 1"
                                            @click="goDetail(order)"
                                        ></i>
                                    </div>
                                    <div class="info">
                                        <div
                                            class="desc order_a"
                                            @click="goDetail(order)"
                                        >{{order.goodsName}}</div>
                                        <div class="other">
                                            <!-- 大货显示商品sku  标识 大货商品orderFlag 0-->
                                            <span
                                                v-if="order.orderFlag == 0 "
                                            >{{order.colorName}}&nbsp;{{order.sizeName}}</span>
                                            <!--显示着装人信息  -->

                                            <template
                                                v-else-if="order.measureOpCode=='D_MSROPMSR' "
                                            >
                                                <template v-if="order.measure.length !=0 ">
                                                    <div
                                                        class="flex-box"
                                                        v-if="order.measure[0].measureType=='预约量体'"
                                                    >
                                                        <span
                                                            class="dress-infor"
                                                            @click.stop="getSalemeasure(item,order,index,_index)"
                                                        >{{$t('order.dressPeople')}}:{{order.measure[0].dressPerson}}</span>
                                                    </div>
                                                    <div class="flex-box" v-else>
                                                        <span
                                                            class="dress-infor"
                                                            @click.stop="toViewDress(order,index, _index)"
                                                        >{{$t('order.dressPeople')}}:{{order.measure[0].dressPerson}}</span>
                                                    </div>
                                                </template>
                                                <!-- 添加着装人 -->
                                                <div
                                                    class="addDress"
                                                    @click="addDressItem(item,order)"
                                                    v-else-if="item.ordStatusCode=='D_ORDSPAYING' || item.ordStatusCode=='D_ORDSSHIPPING'"
                                                >
                                                    {{$t('order.addDressPeople')}}
                                                    <i
                                                        class="iconfont icon-bannerjiantou"
                                                    ></i>
                                                </div>
                                                <!-- 新的预约 -->
                                                <div
                                                    class="dressed-alter dresss-booking-alter"
                                                    v-if="order.showInfoDetial"
                                                >
                                                    <div class="contain flex-box flex-wrap">
                                                        <div class="flex-between">
                                                            <span>{{$t('order.dressPeople')}}：</span>
                                                            <span>{{order.measure[0].dressPerson}}</span>
                                                        </div>
                                                        <div class="flex-between">
                                                            <span>{{$t('order.phone')}}：</span>
                                                            <span>{{order.measure[0].dressPhone}}</span>
                                                        </div>
                                                        <div class="flex-between">
                                                            <span>性别：</span>
                                                            <span>{{order.bookingInor.sexName}}</span>
                                                        </div>
                                                        <div class="flex-between">
                                                            <span>{{$t('order.appointmentTime')}}：</span>
                                                            <span>{{order.measure[0].orderTime}}</span>
                                                        </div>
                                                        <div class="flex-between">
                                                            <span>{{$t('order.appointmentAddress')}}：</span>
                                                            <span>{{order.bookingInor.address}}</span>
                                                        </div>
                                                        <div class="flex-between">
                                                            <span>{{$t('order.remark')}}:</span>
                                                            <span>{{order.bookingInor.measureMemo?order.bookingInor.measureMemo:'-'}}</span>
                                                        </div>
                                                        <div class="flex-between">
                                                            <span>{{$t('order.measureWay')}}:</span>
                                                            <span>{{order.measure[0].msrWayName}}</span>
                                                        </div>
                                                        <div class="flex-between">
                                                            <span>{{$t('order.state')}}:</span>
                                                            <span
                                                                :class="(order.bookingInor.statusId=='10051501' || order.bookingInor.statusId=='10051506')?'state-red':'state-black'"
                                                            >{{order.bookingInor.statusName}}</span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        @click="updateMyBooking(order.bookingInor)"
                                                        v-if="order.bookingInor.statusId=='10051501' || order.bookingInor.statusId=='10051506' "
                                                    >
                                                        <span
                                                            style="color:rgba(153,153,153,1)"
                                                        >{{$t('order.go')}}</span>
                                                        {{$t('order.personalCenter_myAppointment')}}
                                                        <span
                                                            style="color:rgba(153,153,153,1)"
                                                        >{{$t('order.modifyInfo')}}</span>
                                                    </div>
                                                </div>
                                                <!-- 旧的明细 -->
                                                <div
                                                    class="dressed-alter dresss-details-alter"
                                                    v-if="order.showDetial"
                                                >
                                                    <div class="contain flex-box flex-wrap">
                                                        <div
                                                            class="flex-between"
                                                            v-for="(item,index) in order.measureInfor"
                                                            :key="index"
                                                        >
                                                            <span>{{item.vitalName}}</span>
                                                            <span>{{item.netValue}}</span>
                                                        </div>
                                                    </div>
                                                    <!-- 因为后台临售小票的原因注释bodyList，等五一之后改回来 -->
                                                    <!--<div v-if="order.prodStatusCode==null || order.prodStatusCode=='D_BEFORE' || item.ordStatusCode!='D_ORDCANCEL'" @click="addDressItem(item,order)">更换着装人</div>-->
                                                    <!-- 因为后台临售小票的原因注释bodyList，等五一之后改回来 -->
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                    <div class="qty">{{order.ordQty}}</div>
                                </div>
                                <!-- <div class="img-row-two">你还未下单哦！</div>
                                            <div class="img-row-three">
                                                <div class="goReserve" @click="$router.push('/index')">去逛逛</div>
                                </div>-->
                            </td>
                            <td></td>
                            <td>
                                <!-- 先将待评价状态改为已完成状态，三期再改回来 -->
                                <p
                                    class="status-noPay"
                                >{{item.ordStatusName=="待评价"?$t('order.dealComplete'):item.ordStatusName}}</p>
                                <!-- <p class="applay" @click="applyInvoice(item.billCode)">发票申请</p> -->
                            </td>
                            <td>
                                <p class="actually">￥{{item.amountNeedPay | Fix2}}</p>
                                <p>({{$t('order.orderList.containFreight')}}￥{{item.amountTrans | Fix2}})</p>
                            </td>
                            <td>
                                <p
                                    class="normal"
                                    @click="againBuy(item)"
                                    v-if="item.ordStatusCode === 'D_ORDSCOMMENTING'||item.ordStatusCode === 'D_ORDRECEIVED'"
                                >{{$t('order.againBuy')}}</p>
                                <el-button
                                    class="pay-now"
                                    @click="goPay(item)"
                                    v-if="item.ordStatusCode === 'D_ORDSPAYING'"
                                >{{$t('order.immediatePay')}}</el-button>
                                <el-button
                                    class="confirm-btn"
                                    @click="confirmOrder([item.billCode])"
                                    v-if="item.ordStatusCode === 'D_ORDSDELIVERY' "
                                >{{$t('order.confirmOrder')}}</el-button>
                                <router-link
                                    class="normal"
                                    :to="{path: 'order-detail', query: {billCode: item.billCode }}"
                                    tag="p"
                                >{{$t('order.orderList.lookOrder')}}</router-link>
                                <p
                                    class="normal"
                                    @click="cancel(item)"
                                    v-if="item.ordStatusCode === 'D_ORDSPAYING'"
                                >{{$t('order.deleteOrder')}}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="no-data" v-else>
                <div class="img-row-one">
                    <img src="../../assets/images/vouchers/noData.png" />
                </div>
                <div class="img-row-two">{{$t('order.orderList.noOrder')}}</div>
                <div class="img-row-three">
                    <div
                        class="goReserve"
                        @click="$router.push('/index')"
                    >{{$t('order.orderList.goLook')}}</div>
                </div>
            </div>
        </div>
        <div class="pagination" v-if="pagination.count>0">
            <el-pagination
                @current-change="handleCurrentChange"
                :page-size="pagination.limit"
                :current-page="pagination.currentPage"
                background
                layout="total,prev, pager, next"
                :total="pagination.count"
            ></el-pagination>
        </div>
        <el-dialog :visible.sync="centerDialogVisible" width="36%" :title="$t('common.hint')">
            <span>{{$t('order.isDeleteOrder')}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">{{$t('common.cancel')}}</el-button>
                <el-button type="primary" @click="cancelOrder">{{$t('common.sure')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import getLocationPosition from "../../utils/getLocation";
import { DatePicker, Collapse, CollapseItem } from "element-ui";
import { Order, Goods, Volume, UserService } from "../../api/service";
import Storage from "../../utils/storage";
import { mapState, mapActions } from "vuex";
export default {
    components: {
        "el-date-picker": DatePicker,
        "el-collapse": Collapse,
        "el-collapse-item": CollapseItem
    },
    data() {
        return {
            orderIdMeasure: "", //预约订单id
            orderId: "", //订单id
            scrollTop: "", //滚动条
            billCode: "", //商品编码
            companyId: Storage.get("COMPANYID").company_id, //公司id
            selectedAll: false, //选择所有
            canSelectAll: true, //是否可以全选，看列表中有无待收货状态订单
            searchContent: null, // 搜索内容
            isBanComfirmBatch: true, //批量确认收货是否禁用，true禁用
            activeNames: "",
            collapseTitle: "展开筛选条件",
            orderTypeValue: "", // 订单类型筛选
            timeArr: null,
            disabled: true,
            centerDialogVisible: false,
            pagination: {
                // 分页
                count: 0,
                limit: 15,
                page: 1,
                currentPage: 1
            },
            pageNum: 1,
            pageSize: 5,
            total: null,
            orderType: [
                //订单类型
                {
                    name: "全部订单",
                    value: ""
                },
                {
                    name: "定制订单",
                    value: "D_ORDORDER"
                },
                {
                    name: "普通订单",
                    value: "D_ORDNOMAL"
                }
            ],
            orderStatus: [
                {
                    name: "全部订单",
                    value: "0",
                    searchCode: null,
                    status: "",
                    statusCode: null,
                    total: null
                },
                {
                    name: "待付款",
                    value: "1",
                    searchCode: "D_ORDSPAYING",
                    status: "waitPay",
                    statusCode: "unPayOrderNum",
                    total: null
                },
                {
                    name: "待发货",
                    value: "2",
                    searchCode: "D_ORDSSHIPPING",
                    status: "waitShip",
                    statusCode: "unShippingOrderNum",
                    total: null
                },
                {
                    name: "待收货",
                    value: "3",
                    searchCode: "D_ORDSDELIVERY",
                    status: "waitReceive",
                    statusCode: "unReceivingGoodsOrderNum",
                    total: null
                }
            ],
            //待评价的先隐藏，待评价状态先显示已完成状态
            // {
            //     name: "待评价",
            //     value: "4",
            //     searchCode: "D_ORDSCOMMENTING",
            //     status: "waitEvaluate",
            //     statusCode: "unEvaluateOrderNum",
            //     total: null
            //   }

            activeStatus: 0,
            orderList: [], // 订单列表
            cancelBillCode: null,
            checked: false,
            checkboxList: [],
            vipId: this.Storage.get("USER_INFO").vipInfoId,
            accountList: [], //当前用户关联的账户列表集合
            vipInfoHdIds: "" //当前账户关联的所有账户的id集合
        };
    },
    methods: {
        ...mapActions("dressed", ["SetStatus", "SetPage"]),
        //  商品跳转
        goDetail(item) {
            if (item.orderFlag === 1) {
                this.$router.push(
                    "/goods-design?goodsCode=" +
                        item.goodsCode +
                        "&goodsId=" +
                        item.ptiPartHdId
                );
            } else if (item.orderFlag === 0) {
                this.$router.push(
                    "/goods-detail?goodsCode=" +
                        item.goodsCode +
                        "&goodsId=" +
                        item.ptiPartHdId
                );
            } else {
                alert(this.$t("order.goDetailFail"));
            }
        },
        //添加着装人  选择着装人
        addDressItem(item, order) {
            this.$router.push({
                path: "/choice-dressed",
                query: {
                    billCode: item.billCode,
                    rtlOrdDtId: order.rtlOrdDtId,
                    ptiPartClassId: order.ptiPartClassId,
                    dressPerson:
                        order.measure.length > 0 ? order.measure[0] : null
                }
            });
        },
        //选择着装人
        // choiceDressed(item, order) {
        //   this.$router.push({
        //     path: "/choice-dressed",
        //     query: {
        //       billCode: item.billCode,
        //       rtlOrdDtId: order.rtlOrdDtId,
        //       ptiPartClassId: order.ptiPartClassId,

        //     }
        //   });
        // },
        updateMyBooking(bookingDetail) {
            this.$router.push({
                path: "/my-reserve",
                query: {
                    bookingDetail: bookingDetail
                }
            });
        },

        //隐藏着装人信息
        collapseDressInfo(orderIndex, goodIndex, field, state) {
            this.orderList.forEach((order, ordIndex) => {
                order.goodsList.forEach((good, index) => {
                    this.$set(good, "showInfoDetial", false);
                    this.$set(good, "showDetial", false);
                });
                if (orderIndex == ordIndex) {
                    order.goodsList.forEach((good, index) => {
                        if (field && index == goodIndex) {
                            this.$set(good, field, state);
                        }
                    });
                }
            });
        },

        async toViewDress(order, index, _index) {
            this.orderId = order.rtlOrdDtId;
            let data = {
                id: order.rtlOrdDtId,
                companyId: this.companyId,
                usrId: this.usrId
            };
            const res = await Volume.measureInfor(data);
            this.orderList.map(item => {
                item.goodsList = item.goodsList.map(_item => {
                    if (_item.rtlOrdDtId == order.rtlOrdDtId) {
                        //            _item.measureInfor = res.MsrList;
                        let arr = [],
                            showArr = [];
                        //  临时使用中文判断，五一放假之后用编码
                        res.MsrList.forEach(item => {
                            if (arr.indexOf(item.vitalName) === -1) {
                                arr.push(item.vitalName);
                                showArr.push(item);
                            }
                        });
                        console.log(arr);
                        _item.measureInfor = showArr;
                        arr = [];
                        showArr = [];
                    }
                    return _item;
                });
            });
            this.collapseDressInfo(
                index,
                _index,
                "showDetial",
                !order.showDetial
            );
            // this.orderList[index].goodsList[_index].showDetial = true;
        },

        //监听滚动条高度
        // getScrollTop() {
        //   this.scrollTop =
        //     document.body.scrollTop ||
        //     document.documentElement.scrollTop ||
        //     window.pageXOffset;
        //   console.log(this.scrollTop, "scrollTopscrollTopscrollTop");
        // },
        //查看预约单明细
        async getSalemeasure(order, good, ordIndex, goodIndex) {
            this.billCode = order.billCode;
            this.orderIdMeasure = good.rtlOrdDtId;
            let data = {
                rtlOrdDtId: this.orderIdMeasure,
                companyId: this.companyId
            };
            const RES = await Volume.getSalemeasure(data);
            this.orderList.map(item => {
                item.goodsList = item.goodsList.map(_item => {
                    if (_item.rtlOrdDtId == good.rtlOrdDtId) {
                        _item.bookingInor = RES;
                    }
                    return _item;
                });
            });

            this.collapseDressInfo(
                ordIndex,
                goodIndex,
                "showInfoDetial",
                !order.showInfoDetial
            );

            console.log(
                "getSalemeasureState",
                this.orderList[ordIndex].goodsList[goodIndex].showInfoDetial
            );

            // this.orderList[index].goodsList[_index].showInfoDetial = true;
        },
        //点击再次购买，先检测下架和售空商品
        againBuy(item) {
            window.c_showLoading(true);
            let goodListOld = item.goodsList;
            let goodList = [];
            for (let i = 0; i < goodListOld.length; i++) {
                goodList.push({
                    busContsCode: "D_BUSCONTS_B2C", //业务触点
                    goodsCode: goodListOld[i].goodsCode, // 商品编码
                    ptiPartDtSkuId: goodListOld[i].ptiPartDtSkuId, // 商品skuid
                    amount: goodListOld[i].ordQty, // 数量
                    orderFlag: goodListOld[i].orderFlag, // 是否定制商品标识
                    ptiPartHdId: goodListOld[i].ptiPartHdId, //商品id
                    rtlOrdDtId: goodListOld[i].rtlOrdDtId
                });
            }
            let data = {
                ctmUsrId: Storage.get("USER_INFO").usrId,
                shopId: Storage.get("USER_INFO").shopId,
                goodList: goodList
            };
            Goods.getUseableGood(data)
                .then(res => {
                    if (res.sellAll == 1 && res.stockAll == 1) {
                        this.againBuy_success(item);
                    } else {
                        this.$alert(
                            this.$t("order.againBuyError"),
                            this.$t("common.hint"),
                            {
                                confirmButtonText: this.$t("common.sure")
                            }
                        );
                        window.c_showLoading(false);
                    }
                })
                .catch(() => {
                    window.c_showLoading(false);
                });
        },
        //再次购买生成订单
        againBuy_success: function(item) {
            let data = {
                ctmUsrId: Storage.get("USER_INFO").usrId,
                shopCode: Storage.get("USER_INFO").shopCode,
                billCode: item.billCode
            };
            Order.buyAgain(data)
                .then(res => {
                    this.$router.push("/order-settle?orderHdId=" + res);
                    window.c_showLoading(false);
                })
                .catch(() => {
                    window.c_showLoading(false);
                });
        },
        //搜索内容改变触发
        searchContentChange(value) {
            let pattern = /[$%<>?!&￥《》！？]/; //需过滤字符
            let newVlaue = "";
            for (var i = 0; i < value.length; i++) {
                newVlaue = newVlaue + value.substr(i, 1).replace(pattern, "");
            }
            this.searchContent = newVlaue;
        },
        //重置分页条件
        resetPagination: function() {
            this.$set(this.pagination, "currentPage", 1);
            this.$set(this.pagination, "page", 1);
        },
        /**
         * 选择状态
         * @param
         *ud 选中值id
         */
        selectState() {
            this.resetPagination();
            this.getOrderList();
        },
        /**
         *列表全选
         * @param
         * val false 不全选 true 全选
         */
        selectAllEvent(val) {
            this.orderList = this.orderList.map(item => {
                //待收货的选择框才改变
                if (item.ordStatusCode == "D_ORDSDELIVERY") {
                    item.selected = val;
                }
                return item;
            });
            if (val) {
                this.isBanComfirmBatch = false;
            } else {
                this.isBanComfirmBatch = true;
            }
        },
        //单选触发
        selectItem() {
            let isBanComfirmBatch = true;
            let selectedAll = true;
            if (this.orderList == null) return;
            this.orderList.forEach(item => {
                if (item.ordStatusCode == "D_ORDSDELIVERY") {
                    if (item.selected) {
                        isBanComfirmBatch = false;
                    } else {
                        selectedAll = false;
                    }
                }
            });
            this.selectedAll = selectedAll;
            this.isBanComfirmBatch = isBanComfirmBatch;
        },
        //判断是否禁用全选
        isCanSelectAll() {
            this.canSelectAll = this.orderList.some(item => {
                if (item.ordStatusCode == "D_ORDSDELIVERY") {
                    return true;
                } else {
                    return false;
                }
            });
        },
        //  切换订单状态查询列表
        changeOrderStatus(item, index) {
            this.resetOptions();
            this.activeStatus = index;
            this.SetStatus(this.activeStatus);
            this.resetPagination();
            this.getOrderList();
        },
        // 切换订单状态
        changeStatus(query) {
            this.activeStatus = this.$store.state.dressed.activeStatus || 0;
        },

        handleChange(val) {
            if (val.length > 1) {
                this.collapseTitle = this.$t("order.orderList.hideCondition");
            } else {
                this.collapseTitle = this.$t("order.orderList.showCondition");
            }
        },
        cancel(item) {
            this.cancelBillCode = item.billCode;
            this.centerDialogVisible = true;
        },

        handleCurrentChange(val) {
            this.pagination.currentPage = val;
            this.selectedAll = false;
            this.SetPage({
                currentPage: this.pagination.currentPage
            });
            this.getOrderList();
        },

        // 切换账户
        onChangeAccount(account) {
            this.pagination.currentPage = 1; //重置查询条件为获取第一页数据
            this.getOrderList();
            this.updateOrdNumber();
        },
        // 手机号部分隐藏处理
        phoneNumHandle(phoneNumber) {
            return (phoneNumber + "").replace(
                /^(\d{3})\d{4}(\d{4})$/,
                "$1****$2"
            );
        },

        //获取关联账户列表
        async getAccountList() {
            let accountList = await UserService.getRelationAccountList();
            let allAcount = {
                name: "全部",
                ids: []
            };
            let curAccount = {
                name: "当前账户",
                ids: ""
            };
            let accounts = [];
            // 数据重组
            if (accountList instanceof Array) {
                accountList.forEach(account => {
                    // 添加id
                    allAcount.ids.push(account.id);
                    //判断是否为当前Id
                    if (this.vipId == account.id) {
                        curAccount.ids = account.id;
                    } else {
                        accounts.push({
                            name: this.phoneNumHandle(account.mobilePhone),
                            ids: account.id
                        });
                    }
                });
                allAcount.ids = allAcount.ids.toString();
            }
            return accountList.length > 1
                ? [allAcount, curAccount, ...accounts]
                : [allAcount];
        },

        // 账户切换时重新更新各类型订单数量
        async updateOrdNumber() {
            // 该接口需后端针对vipHdId过滤
            let nums = await Order.getOrderNum();
        },
        // 获取订单列表
        async getOrderList() {
            // 判断当前关联用户是否已获取(包含自身)
            if (this.accountList.length == 0) {
                this.accountList = await this.getAccountList();
                this.vipInfoHdIds = this.accountList[0].ids;
            }
            console.log(this.orderStatus, 'this.orderStatus');
            console.log(this.activeStatus,'this.activeStatus')
            window.c_showLoading();
            let data = {
                pageNum: this.pagination.currentPage,
                pageSize: this.pagination.limit,
                ordStartDate: this.timeArr
                    ? window.formatTime(this.timeArr[0])
                    : null,
                ordEndDate: this.timeArr
                    ? window.formatTime(this.timeArr[1])
                    : null,
                billCodeOrGoodsName: this.searchContent
                    ? this.searchContent.trim()
                    : null,
                searchCode: this.orderStatus[this.activeStatus].searchCode,
                orderTypeCode: this.orderTypeValue,
                busContsCode: "D_BUSCONTS_B2C",
                vipInfoHdIds: this.vipInfoHdIds
                // this.activeStatus === 0 && this.value
                //   ? this.orderStatus[this.value].searchCode
                //   : this.orderStatus[this.activeStatus].searchCode
            };
            console.log("enterenterenterenterenter");
            Order.getList(data)
                .then(res => {
                    let { total, list } = res;
                    this.pagination.count = total;
                    this.orderList = list.map(item => {
                        item.selected = false;
                        item.goodsList.forEach(_item => {
                            _item.showInfoDetial = false;
                            _item.showDetial = false;
                        });
                        return item;
                    });
                    this.orderStatus.forEach(item => {
                        item.total =
                            res.orderStatusNum[item.statusCode] || null;
                    });
                    this.isBanComfirmBatch = true; //禁用批量收货
                    this.selectedAll = false;
                    this.isCanSelectAll();

                    window.c_showLoading(false);
                })
                .catch(() => {
                    window.c_showLoading(false);
                });
        },
        // 选定时间时触发
        onDateTimeChange() {
            this.resetPagination();
            this.getOrderList();
        },

        // 跳转开票页面
        applyInvoice(billCode) {
            let url = `/invoice?fromPage=orderList&billCode=${billCode}`;
            this.$router.push(url);
        },

        // 跳转支付页面
        goPay(item) {
            let url = `/pay-mode?billCode=${item.billCode}&actuallyPaid=${
                item.amountNeedPay
            }`;
            this.$router.push(url);
        },

        // 取消订单
        cancelOrder() {
            let data = {
                flag: 1,
                ctmUsrId: Storage.get("USER_INFO").usrId,
                billCodes: [this.cancelBillCode]
            };
            // if (!!this.selectValue) data.cancelReasonId = this.selectValue; // 取消订单原因对应的id
            Order.cancel(data).then(
                res => {
                    this.$toast(this.$t("order.deleteOrderSuccess"));
                    // this.$message(this.$t("order.deleteOrderSuccess"));
                    this.cancelBillCode = null;
                    this.getOrderList();
                    this.centerDialogVisible = false;
                },
                err => {
                    let failMsg =
                        err.errorMsg || this.$t("order.deleteOrderFail");
                    this.$alert(failMsg);
                }
            );
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

        // 重置筛选状态
        resetOptions() {
            this.orderTypeValue = "";
            this.timeArr = null;
            this.searchContent = null;
        },
        //批量确认收货
        confirmOrderBatch() {
            let billCodesArr = [];
            let orderList = this.orderList;
            for (let i = 0; i < orderList.length; i++) {
                if (orderList[i].selected) {
                    billCodesArr.push(orderList[i].billCode);
                }
            }
            this.confirmOrder(billCodesArr);
        },
        // 确认收货
        confirmOrder(billCodesArr) {
            //  确认收货前判断该订单是否存在售后申请单子
            let data = {
                ctmUsrId: Storage.get("USER_INFO").usrId,
                billCodes: billCodesArr
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
                        //
                        this.$alert(messages[1]);
                    } else {
                        this.$confirm(messages[res], {
                            confirmButtonText: btnName[res]
                        })
                            .then(() => {
                                Order.signUp(data).then(
                                    () => {
                                        this.$toast(this.$t("order.confirmOrderSuccess"));
                                        // this.$message(this.$t("order.confirmOrderSuccess"));
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
                    this.$toast(this.$t("order.networkSlow"));
                    // this.$message(this.$t("order.networkSlow"));
                }
            );
        },
        //注册监听点击事件
        registerDocListener() {
            document.addEventListener("click", $event => {
                this.orderList.forEach((order, ordIndex) => {
                    order.goodsList.forEach((good, index) => {
                        this.$set(good, "showInfoDetial", false);
                        this.$set(good, "showDetial", false);
                    });
                });
            });
        }
    },
    computed: {
        ...mapState("user", ["userInfo"])
    },
    created() {
        this.changeStatus(this.$route.query);

        if (this.$route.query.entrance == "我的预约") {
            if (this.$store.state.dressed.activeStatus !== "") {
                this.activeStatus = this.$store.state.dressed.activeStatus.activeStatus;
            }
            if (this.$store.state.dressed.currentPage !== "") {
                this.pagination.currentPage = this.$store.state.dressed.currentPage.currentPage;
            }
        }

        this.getOrderList();
        this.getReasons();
        this.registerDocListener();
        // window.addEventListener("scroll", this.getScrollTop);
    },
    mounted() {
        getLocationPosition();
    },
    watch: {},

    beforeDestroy() {
        document.removeEventListener("click", () => {});
    },

    beforeRouteUpdate(to, from, next) {
        this.changeStatus(to.query);
        next();
    }
};
</script>

<style scoped lang="scss" type="text/scss">
.order_a:hover {
    cursor: pointer;
}
.order {
    width: 100%;
    .tab {
        padding-top: 34px;
        ul {
            li {
                cursor: pointer;
                width: 110px;
                text-align: center;
                display: inline-block;
                color: $text-primary;
                font-size: $font-regular;
                border-bottom: 2px solid rgba(255, 255, 255, 0);
                > a {
                    display: block;
                    color: $text-primary;
                    border-bottom: 1px solid $color-line;
                    border-right: 1px solid $color-line;
                    > span {
                        color: $color-golden;
                    }
                }
                &:nth-last-child(1) > a {
                    border-right: none;
                }
                &:hover {
                    border-bottom: 2px solid $color-golden;
                    > a {
                        color: $color-golden;
                        border-bottom: 1px solid $color-golden;
                    }
                }
                &.active {
                    border-bottom: 2px solid $color-golden;
                    > a {
                        color: $color-golden;
                        border-bottom: 1px solid $color-golden;
                    }
                }
            }
        }
        .search {
            position: relative;
            margin-top: 30px;
            .el-input-group--append {
                position: absolute;
                width: 360px;
            }
            .el-select {
                width: 160px;
            }
            span {
                i {
                    font-size: $font-smaller;
                }
            }
            .condition {
                // margin-top: 20px;
                font-size: $font-small;
                /deep/ .el-icon-arrow-right:before {
                    display: block;
                    content: "";
                    border-width: 4px 4px 4px 4px;
                    border-style: solid;
                    border-color: #3d78cc transparent transparent transparent;
                    top: 17px;
                }
                /deep/ .el-collapse-item__arrow.is-active {
                    -webkit-transform: rotate(180deg);
                    transform: rotate(180deg);
                }
                .el-collapse {
                    border: none;
                }
            }
        }
    }
    .table {
        width: 100%;
        margin-top: 20px;
        .title {
            width: 100%;
            table-layout: fixed;
            thead {
                font-size: $font-small;
                color: $text-primary;
                background-color: $bg-color-regular;
                th {
                    height: 40px;
                    font-weight: 540;
                }
                .qty {
                    float: right;
                    width: 120px;
                    text-align: center;
                    line-height: 27px;
                }

                .check__all {
                    span {
                        margin-left: 24px;
                    }
                    // width: 39%;
                    padding: 0 10px;
                    text-align: left;
                    button {
                        margin-left: 25px;
                        padding: 5px 10px;
                        border-radius: 0;
                        font-size: $font-smaller;
                        background-color: $bg-color-regular;
                    }
                }
            }
        }
        .data {
            table-layout: fixed;
            margin-top: 30px;
            thead {
                font-size: $font-small;
                color: $text-primary;
                background-color: $bg-color-regular;
                tr {
                    th {
                        height: 50px;
                        font-weight: 540;
                    }
                    .checkbox {
                        padding-left: 10px;
                        text-align: left;
                        .billCode {
                            display: inline-block;
                            margin-left: 68px;
                        }
                        .time {
                            display: inline-block;
                            margin-left: 68px;
                        }
                    }
                }
            }
            tbody {
                font-size: $font-small;
                border: 1px solid $bg-color-regular;
                tr {
                    td {
                        text-align: center;
                        color: $text-primary;
                        border-right: 1px solid $text-placeholder;
                        .product_border_top {
                            border-top: 1px solid $bg-color-regular;
                        }
                        .product {
                            padding: 15px 0;
                            padding-bottom: 5px;
                            .img {
                                float: left;
                                margin: 0 10px;
                                position: relative;
                                width: 100px;
                                height: 100px;
                                padding: 10px;
                                .goods-cover {
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
                                padding-top: 5px;
                                font-size: $font-small;
                                max-width: 234px;
                                float: left;
                                .desc {
                                    color: $text-primary;
                                    margin-bottom: 12px;
                                }
                                .other {
                                    color: #333333;
                                    position: relative;
                                    div {
                                        cursor: pointer;
                                        position: relative;
                                        .dress-infor {
                                            padding: 5px 10px;
                                            text-align: center;
                                            background: rgba(255, 255, 255, 1);
                                            box-shadow: 0px 2px 4px 0px
                                                rgba(29, 29, 35, 0.17);
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
                                        border-color: transparent transparent
                                            #e6e6e6 transparent;
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
                                                    color: rgba(
                                                        153,
                                                        153,
                                                        153,
                                                        1
                                                    );
                                                }
                                            }
                                        }
                                    }
                                    .dressed-alter {
                                        z-index: 20;
                                        top: 40px;
                                        left: 10px;
                                        position: absolute;
                                        background-color: #fff;
                                        padding: 15px;
                                        background: rgba(255, 255, 255, 1);
                                        box-shadow: 0px 2px 4px 0px
                                            rgba(29, 29, 35, 0.17);
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
                                }
                            }
                        }
                        .qty {
                            float: right;
                            width: 120px;
                            text-align: center;
                            margin-top: 30px;
                        }
                        .status-noPay {
                            color: $text-warn;
                        }
                        .applay {
                            color: $text-blue;
                            cursor: pointer;
                        }
                        .actually {
                            color: $text-primary;
                            font-size: $font-regular;
                        }
                        .pay-now {
                            padding: 9px 17px;
                            background-color: $color-golden;
                            color: $text-white;
                        }
                        .confirm-btn {
                            padding: 9px 17px;
                            border: solid 1px $color-golden;
                            color: $color-golden;
                            background: $color-white;
                            &:hover {
                                background: $color-white;
                            }
                        }
                        .normal {
                            color: $text-secondary;
                            font-size: $font-smaller;
                            line-height: 22px;
                            cursor: pointer;
                        }
                    }
                    td:last-child {
                        border: none;
                    }
                }
            }
        }
    }
    .pagination {
        text-align: right;
        margin-top: 30px;
    }
}
.state-red {
    color: red !important;
}
@media screen and (max-width: 1199px) {
    .order {
        .tab {
            ul {
                li {
                    // width: 90px;
                }
            }
            .search {
                // width: 280px;
            }
        }
        .table {
            .title {
                thead {
                    .qty {
                        width: 102px;
                    }
                }
            }
            .data {
                .product {
                    .info {
                        width: 180px;
                    }
                    .qty {
                        width: 102px;
                    }
                }
            }
        }
    }
}
</style>

