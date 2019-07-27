/*
* createTime：2019/2/18
* author：en.chen
* description:  发票
*/
<template>
    <div class="invoice">
        <!-- 查询发票列表 begin -->
        <div class="check" v-if="!fromPage">
            <!-- 发票状态筛选 begin -->
            <div class="invoice-status-box">
                <label>{{$t("order.state")}} : </label>
                <el-select popper-class="select-box" v-model="status" placeholder="请选择" @change="statusChange">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <!-- 发票状态筛选 end -->

            <!-- 发票列表 begin -->
            <div class="invoice-list-content">
                <p class="tip" v-if="userInvoiceList.length<=0 && !loading">{{$t("invoice.noData")}}~</p>
                <ul class="invoice-list">
                    <li class="invoice-item" v-for="item in userInvoiceList" :key="item.id">
                        <div class="item-head clearfix">
                            {{$t("order.state")}}:
                            <span>{{item.statusName}}</span>
                            <!--<a class="download-btn fr" v-show="!!item.fileUrl" :href="getImg(item.fileUrl)"-->
                               <!--:download="getImg(item.fileUrl)">-->
                                <!--↓ {{$t("invoice.download")}}-->
                            <!--</a>-->
                            <span class="download-btn fr" v-show="!!item.nnJpgUrl" @click="downloadInvoice(item.nnJpgUrl)">
                                ↓ {{$t("invoice.download")}}
                            </span>
                        </div>
                        <div class="item-content">
                            <div class="fl half-width content-box">
                                <label>{{$t("invoice.type")}}：</label>
                                <span>{{item.typeName}}</span>
                            </div>
                            <div class="fl half-width content-box">
                                <label>{{$t("invoice.time")}}：</label>
                                <span>{{item.invoiceDate}}</span>
                            </div>
                            <div class="fl half-width content-box">
                                <label>{{$t("invoice.lookUp")}}：</label>
                                <span>{{item.title}}</span>
                            </div>
                            <div class="fl half-width content-box">
                                <label>{{$t("invoice.orderNumber")}}：</label>
                                <span>{{item.billCode}}</span>
                            </div>
                            <div class="fl half-width content-box" v-show="!!item.invoiceCode">
                                <label>{{$t("invoice.identificationNumber")}}：</label>
                                <span>{{item.invoiceCode}}</span>
                            </div>
                            <div class="fl wd100">
                                <div class="fl half-width content-box"
                                     v-show="!!item.shippingName ||!!item.isSendWithOrd && item.invStateCode == 'D_INV_TRICKT' && item.typeCode === 'D_INVOICE_COMMON' ">
                                    <label>{{$t("invoice.distributionLogistics")}}：</label>
                                    <span
                                        v-if="!item.isSendWithOrd || item.isSendWithOrd != 1">{{item.shippingName}}</span>
                                    <span v-if="!!item.isSendWithOrd && item.invStateCode == 'D_INV_TRICKT'">{{$t("invoice.send")}}</span>
                                </div>
                            </div>
                            <div class="show-logistics-btn" :class="{'active' : item.showLogistics === true}"
                                 v-if="item.typeCode === 'D_INVOICE_COMMON' && !!item.shippingCode && (!item.isSendWithOrd || item.isSendWithOrd != 1 )"
                                 @click="checkLogistics(item)">
                                {{$t("invoice.lookMore")}}
                                <i class="fr iconfont icon-xiangxiajiantou"></i>
                            </div>
                            <div class="fl content-box clearfix"
                                 v-if="item.typeCode === 'D_INVOICE_COMMON' && item.logisticsList.length>0"
                                 v-show="item.showLogistics === true">
                                <label class="fl"> {{$t("invoice.logisticsProcess")}} ：</label>
                                <div class="fl logistics">
                                    <p v-for="(step,index) in item.logisticsList" :key="index">{{step.acceptTime}}
                                        {{step.acceptStation}}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- 发票列表 end -->

            <!-- 分页 begin -->
            <div class="pagination" v-if="total>0">
                <el-pagination background layout="prev, pager, next" :current-page="pageNum" :page-size="pageSize"
                               :total="total" @current-change="onPageChagne">
                </el-pagination>
            </div>
            <!-- 分页 end -->
        </div>
        <!-- 查询发票列表 end -->

        <!-- 申请发票 begin -->
        <div class="apply" v-if="!!fromPage">
            <div class="invoice-item">
                <div class="item-head clearfix">{{$t("invoice.applyInvoice")}}</div>
                <div class="item-content">
                    <div class="fl half-width content-box">
                        <label>{{$t("invoice.type")}}：</label>
                        <div class="item-btn" :class="{'selected': item.dictCode === invoiceType}"
                             v-for="item in invoiceList" :key="item.id">
                            {{item.dictName}}
                            <input class="radioInput" type="radio" :value="item.dictCode" v-model="invoiceType">
                            <div class="selected-btn" v-if="item.dictCode === invoiceType"></div>
                        </div>
                    </div>
                    <div class="fl half-width content-box">
                        <label>{{$t("invoice.lookUp")}}：</label>
                        <div class="item-btn" :class="{'selected': item.dictCode === invoiceTitle}"
                             v-for="item in invoiceTitleList" :key="item.id">
                            {{item.dictName}}
                            <input class="radioInput" type="radio" :value="item.dictCode" v-model="invoiceTitle">
                            <div class="selected-btn" v-if="item.dictCode === invoiceTitle"></div>
                        </div>
                    </div>
                    <!-- 发票抬头为公司时显示模板 begin -->
                    <template v-if="invoiceTitle === 'D_INVTITLETYPE2'">
                        <div class="fl half-width content-box">
                            <label>{{$t("invoice.companyName")}}：</label>
                            <input class="invoice-text" type="text" v-model="companyName" @input="checkVal(0)">
                        </div>
                        <div class="fl half-width content-box">
                            <label>{{$t("invoice.identificationNumber")}}：</label>
                            <input class="invoice-text" type="text" v-model="taxpayerNum" @input="checkVal(1)">
                        </div>
                    </template>
                    <!-- 发票抬头为公司时显示模板 end -->

                    <!-- 发票类型为纸质显示内容 begin -->
                    <div class="address-info content-box fl" v-show="invoiceType === 'D_INVOICE_COMMON'">
                        <label class="fl">{{$t("invoice.address")}}：</label>
                        <ul class="fl address-list">
                            <li class="address-item" v-if="addressList.length>0" v-for="(item,index) in addressList"
                                :key="index" v-show="index <= maxAddressLength">
                                <div class="select-address">
                                    <!--<i class="iconfont icon-weixuanzhongfangxing"></i>-->
                                    <svg class="icon" aria-hidden="true">
                                        <use
                                            :xlink:href="item.id === addrVal ? '#icon-xuanzhongfangxing' : '#icon-weixuanzhongfangxing' "></use>
                                    </svg>
                                    <input type="radio" :value="item.id" v-model="addrVal">
                                </div>
                                <span class="name">{{item.cargousrName}}{{$t("invoice.closed")}}</span>
                                <span>{{item.cargoPhone}}</span>
                                <span>
                                    <span class="color-red" v-if="item.defaultFlag === 1">{{$t("invoice.defalutAdress")}}</span>
                                    {{item.destDesc + item.address}}
                                </span>
                            </li>
                            <div class="add-address-btn" @click="editAddr">{{$t("invoice.addAdress")}}</div>
                            <div class="show-more-address" :class="{'active' : !!canShowMoreAddress}"
                                 v-show="!!addressList.length && addressList.length > 5">
                                <i class="iconfont icon-xiangxiajiantou"
                                   @click="canShowMoreAddress = !canShowMoreAddress"></i>
                            </div>
                            <edit-dialog :Id="editDialog.id" :destId="editDialog.destId" :tag="editDialog.tag"
                                         :addressList="addressList" ref="addrEditCom" @sureEvent="addressEdit"
                                         @getAddressList="getAddrList"></edit-dialog>
                        </ul>
                    </div>
                    <!-- 发票类型为纸质显示内容 begin -->
                </div>
                <div class="btn-box">
                    <div class="invoice-btn confirm-btn" @click="submitInvoice">{{$t("invoice.submit")}}</div>
                    <div class="invoice-btn reset-btn" @click="goBack">{{$t("invoice.cancel")}}</div>
                </div>
            </div>
        </div>
        <!-- 申请发票 end -->

    </div>
</template>
<script>
    import {Select} from "element-ui";
    import {UserService, Invoice, ThirdParty} from "../../api/service";
    import CustomDialog from "../cart/components/CustomDialog.vue";
    import EditDialog from "../../components/address/EditDialog";

    export default {
        components: {
            CustomDialog,
            EditDialog
        },
        data() {
            return {
                editDialog: {
                    id: null,
                    destId: null,
                    tag: false
                }, //修改地址组件参数
                showPage: null,
                options: [
                    //  发票状态列表
                    {
                        value: "",
                        label: this.$t("invoice.all")
                    },
                    {
                        value: "D_INV_UNAUDIT",
                        label: this.$t("invoice.unaudit")
                    },
                    {
                        value: "D_INV_AGREE",
                        label: this.$t("invoice.agreen")
                    },
                    {
                        value: "D_INV_REFUSE",
                        label: this.$t("invoice.refuse")
                    },
                    {
                        value: "D_INV_TRICKT",
                        label: this.$t("invoice.trickt")
                    },
                    {
                        value: "D_INV_CHANCEL",
                        label: this.$t("invoice.cancel")
                    }
                ],
                status: "", // 选中的发票状态
                userInvoiceList: [], //  用户发票列表
                pageNum: 1,
                pageSize: 5,
                total: null, // 商品总数
                fromPage: "", // 来源页面
                storageData: {}, //  本地缓存中的发票信息
                invoiceList: [], // 发票类型列表
                invoiceTitleList: [], //发票抬头列表
                invoiceType: "", // 发票类型
                invoiceTitle: "", // 发票抬头
                companyName: "", // 公司名称
                taxpayerNum: "", // 纳税识别号
                addressList: [], // 个人地址列表
                addrVal: "", // 选中地址
                btnLock: false, // 按钮锁
                loading: false,
                canShowMoreAddress: false
                //                maxAddressLength: 4
            };
        },
        methods: {
            //  页面初始化
            loadPage() {
                this.fromPage = this.$route.query.fromPage;
                this.getInvoiceType();
                this.getInvoiceTitleType();
                this.getAddrList();
                this.getInvoiceList();
            },

            //  获取个人发票列表
            getInvoiceList() {
                this.loading = true;
                c_showLoading();
                let data = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                };
                if (!!this.status) data.invoiceStatusCode = this.status;
                Invoice.getList(data)
                    .then(res => {
                        this.userInvoiceList = res.list;
                        this.total = res.total;
                        this.loading = false;
                    })
                    .then(() => {
                        c_showLoading(false);
                        this.loading = false;
                    });
            },

            //  获取发票类型
            getInvoiceType() {
                let data = {
                    type: "D_INVOICETYPE"
                };
                Invoice.getInvoiceType(data).then(res => {
                    this.invoiceList = res;
                });
            },

            //  获取发票抬头
            getInvoiceTitleType() {
                let data = {
                    type: "D_INVTITLETYPE"
                };
                Invoice.getInvoiceType(data).then(res => {
                    this.invoiceTitleList = res;
                });
            },

            //  获取收货地址列表
            getAddrList() {
                this.addrVal = "";
                let data = {
                    vipUsrId: Storage.get("USER_INFO").usrId,
                    pageNum: 1
                };
                UserService.getAddrList(data).then(res => {
                    this.addressList = res.list;
                });
            },

            //  新增地址弹窗
            editAddr() {
                if (!!this.addressList.length && this.addressList.length >= 20) {
                    this.$toast(this.$t("invoice.sorry"));
                    // this.$message(this.$t("invoice.sorry"));
                    return;
                } else {
                    this.$refs.addrEditCom.setDialogViewState();
                }
            },

            // 修改地址事件
            addressEdit() {
                this.$refs.addrEditCom.setDialogViewState(false);
                this.getAddrList();
            },

            //  返回上一页
            goBack() {
                this.$router.go(-1);
            },

            //  提交发票申请
            submitInvoice() {
                if (this.btnLock) return;
                this.btnLock = true;
                if (!this.invoiceType || !this.invoiceTitle) {
                    this.$toast(this.$t("invoice.perfect"));
                    // this.$message(this.$t("invoice.perfect"));
                    this.btnLock = false;
                    return;
                }
                let data = {
                    ctmUsrId: Storage.get("USER_INFO").usrId,
                    cookieId: Storage.get("USER_INFO").usrId,
                    invoiceTypeCode: this.invoiceType,
                    invoiceTitle: this.invoiceTitle
                };
                //  判断发票类型
                if (this.invoiceType === "D_INVOICE_ELC") {
                    //  类型为电子发票
                    if (this.invoiceTitle === "D_INVTITLETYPE1") {
                        //  个人电子发票参数不变
                    } else if (this.invoiceTitle === "D_INVTITLETYPE2") {
                        //  公司电子发票必填公司名称、纳税识别号
                        if (!this.companyName || !this.taxpayerNum) {
                            this.$toast(this.$t("invoice.perfect"));
                            // this.$message(this.$t("invoice.perfect"));
                            this.btnLock = false;
                            return;
                        } else {
                            //  提交参数修改
                            data.invoiceCompany = this.companyName;
                            data.invoiceTaxAlias = this.taxpayerNum;
                        }
                    }
                } else if (this.invoiceType === "D_INVOICE_COMMON") {
                    //  类型为纸质发票
                    if (this.invoiceTitle === "D_INVTITLETYPE1") {
                        //  个人纸质发票必填收货地址
                        if (this.addrVal === "") {
                            this.$toast(this.$t("invoice.perfect"));
                            // this.$message(this.$t("invoice.perfect"));
                            this.btnLock = false;
                            return;
                        } else {
                            //  选中的地址区code作为提交参数
                            this.addressList.forEach(item => {
                                if (item.id === this.addrVal) {
                                    data.invoiceAddrId = item.id;
                                }
                            });
                        }
                    } else if (this.invoiceTitle === "D_INVTITLETYPE2") {
                        //  公司电子发票必填公司名称、纳税识别号、收货地址
                        if (!this.companyName || !this.taxpayerNum || !this.addrVal) {
                            this.$toast(this.$t("invoice.perfect"));
                            // this.$message(this.$t("invoice.perfect"));
                            this.btnLock = false;
                            return;
                        } else {
                            //  选中的地址区code作为提交参数
                            this.addressList.forEach(item => {
                                if (item.id === this.addrVal) {
                                    data.invoiceAddrId = item.id;
                                }
                            });
                            //  提交参数修改
                            data.invoiceCompany = this.companyName;
                            data.invoiceTaxAlias = this.taxpayerNum;
                        }
                    }
                }
                console.log("putData", data);

                //  判断纳税识别号
                if(!!data.invoiceTaxAlias) {
                    if(data.invoiceTaxAlias.length < 6) {
                        this.$toast(this.$t("invoice.identificationNumberErrorTip"));
                        this.btnLock = false
                        return;
                    }
                }

                //  判断来源页面
                if (this.fromPage === "settlement") {
                    //  储存信息并返回订单结算页面
                    let invoiceData = {};
                    this.invoiceList.forEach(item => {
                        if (item.dictCode === this.invoiceType) {
                            invoiceData.type = item.dictName;
                        }
                    });
                    this.invoiceTitleList.forEach(item => {
                        if (item.dictCode === this.invoiceTitle) {
                            invoiceData.title = item.dictName;
                        }
                    });
                    invoiceData.data = data;
                    console.log(invoiceData);
                    Storage.set("invoiceData", invoiceData);
                    this.btnLock = false;
                    window.history.go(-1);
                } else {
                    let billCode = this.$route.query.billCode;
                    let params = Object.assign(data, {
                        billCode: billCode
                    });
                    Invoice.putInvoice(params)
                        .then(
                            () => {
                                this.$toast(this.$t("invoice.submitSuccess"));
                                // this.$message(this.$t("invoice.submitSuccess"));
                                setTimeout(() => {
                                    this.btnLock = false;
                                    this.$router.go(-1);
                                }, 1000);
                            },
                            err => {
                                let failMsg = err.errorMsg || this.$t("invoice.fauirle");
                                this.$alert(failMsg);
                                this.btnLock = false;
                            }
                        )
                        .then(() => {
                            this.btnLock = false;
                        });
                }
            },

            //  切换发票状态
            statusChange() {
                this.pageNum = 1;
                this.getInvoiceList();
            },

            //  查看物流
            checkLogistics(item) {
                if (item.showLogistics === true) {
                    item.showLogistics = false;
                    return;
                } else {
                    if (!!item.logisticsList && item.logisticsList.length.length > 0) {
                        item.showLogistics = true;
                    } else {
                        let data = {
                            expressCode: item.shippingCode,
                            logisticCode: item.sendShipCode
                        };
                        ThirdParty.getLogis(data).then(
                            res => {
                                item.logisticsList = res.traceList;
                                item.showLogistics = true;
                            },
                            () => {
                                this.$toast(this.$t("invoice.noLogistics"));
                                // this.$message(this.$t("invoice.noLogistics"));
                            }
                        );
                    }
                }
            },

            //  分页
            onPageChagne(curPaageNo) {
                this.pageNum = curPaageNo;
                this.getInvoiceList();
            },

            //  校验输入框内的数值合法性
            checkVal(type) {
                console.log(type);
                switch (type) {
                    case 0:
                        this.companyName = this.companyName.replace(/(^\s+)|(\s+$)/g, "");
                        break;
                    case 1:
                        this.taxpayerNum = this.taxpayerNum.replace(/[\W]/g, "");
                        if(this.taxpayerNum.length > 20) {
                            this.taxpayerNum = this.taxpayerNum.slice(0,20)
                        }
                }
            },

            //  下载发票
            downloadInvoice(url) {
                window.open(url)
            }
        },
        created() {
            this.loadPage();
        },
        computed: {
            maxAddressLength: function () {
                if (!!this.canShowMoreAddress) {
                    return 20;
                } else {
                    return 4;
                }
            }
        }
    };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
    .invoice {
        overflow: hidden;
        .check {
            .invoice-status-box {
                margin-top: 30px;
                height: 40px;
                font-size: $font-small;
                line-height: 40px;
                color: $text-primary;
            }
            .tip {
                margin-top: 30px;
                font-size: $font-small;
                color: $text-primary;
            }
            .invoice-list {
                margin-top: 30px;
                overflow: hidden;
                .invoice-item {
                    border: solid 1px $color-line;
                    margin-bottom: 30px;
                    padding-bottom: 10px;
                    .item-head {
                        height: 50px;
                        padding: 0 20px;
                        background: $color-thead;
                        font-size: $font-regular;
                        line-height: 50px;
                        color: $text-primary;
                        .review {
                            color: $text-warn;
                        }
                        .download-btn {
                            margin-top: 10px;
                            width: 110px;
                            height: 30px;
                            background: $color-golden;
                            font-size: $font-small;
                            line-height: 30px;
                            overflow: hidden;
                            text-align: center;
                            color: $color-white;
                            cursor: pointer;
                        }
                    }
                    .item-content {
                        padding: 30px 20px 0 20px;
                        font-size: $font-small;
                        line-height: $font-common;
                        position: relative;
                        .wd100 {
                            width: 100%;
                        }
                        .content-box {
                            overflow: hidden;
                            margin-bottom: 30px;
                            label {
                                display: inline-block;
                                min-width: 70px;
                                color: $text-secondary;
                            }
                            span {
                                margin-left: 10px;
                                color: $text-primary;
                            }
                            .logistics {
                                p {
                                    margin-bottom: 10px;
                                }
                            }
                            &.hide {
                                opacity: 0;
                            }
                        }
                        .show-logistics-btn {
                            position: absolute;
                            bottom: 0;
                            left: 50%;
                            transform: translateX(-50%);
                            font-size: $font-small;
                            line-height: 1;
                            text-align: center;
                            color: $color-line;
                            cursor: pointer;
                            &.active {
                                .iconfont {
                                    transform: rotate(180deg);
                                }
                            }
                        }
                        .half-width {
                            width: 50%;
                        }
                        &::after {
                            content: "";
                            display: table;
                            clear: both;
                        }
                    }
                }
            }
            .pagination {
                margin: 30px 0 70px 0;
                text-align: right;
            }
        }
        .apply {
            margin-top: 30px;
            overflow: hidden;
            .invoice-item {
                border: solid 1px $color-line;
                .item-head {
                    height: 50px;
                    padding: 0 20px;
                    background: $color-thead;
                    font-size: $font-regular;
                    line-height: 50px;
                    color: $text-primary;
                }
                .item-content {
                    padding: 30px 20px 0 20px;
                    font-size: $font-small;
                    line-height: 30px;
                    .content-box {
                        overflow: hidden;
                        margin-bottom: 30px;
                        &.half-width {
                            width: 50%;
                        }
                        label {
                            float: left;
                            min-width: 70px;
                            color: $text-secondary;
                        }
                        span {
                            margin-left: 10px;
                        }
                        .item-btn {
                            float: left;
                            width: 100px;
                            height: 30px;
                            margin-left: 25px;
                            color: $text-primary;
                            text-align: center;
                            overflow: hidden;
                            border: solid 1px $color-line;
                            cursor: pointer;
                            position: relative;
                            transition: all 0.3s;
                            .radioInput {
                                z-index: 2;
                                width: 100px;
                                height: 30px;
                                position: absolute;
                                top: 0;
                                left: 0;
                                opacity: 0;
                                cursor: pointer;
                            }
                            &:hover {
                                color: $color-golden;
                                border-color: $color-golden;
                            }
                            &.selected {
                                border-color: $color-golden;
                                color: $color-golden;
                            }
                            .selected-btn {
                                width: 14px;
                                height: 14px;
                                position: absolute;
                                right: 0;
                                bottom: 0;
                                background: url("../../assets/images/shoppingCart/selected.png") no-repeat center;
                            }
                        }
                        .invoice-text {
                            width: 220px;
                            height: 30px;
                            margin-left: 25px;
                            padding: 0 10px;
                            border: solid 1px $color-line;
                            font-size: $font-small;
                            line-height: 30px;
                            color: $text-primary;
                            &:focus {
                                outline: none;
                                border-color: $color-golden;
                            }
                        }
                        &.address-info {
                            width: 100%;
                            .address-list {
                                .address-item {
                                    position: relative;
                                    height: 30px;
                                    margin-left: 25px;
                                    margin-bottom: 36px;
                                    line-height: 30px;
                                    overflow: hidden;
                                    .select-address {
                                        float: left;
                                        margin-top: 5px;
                                        width: 20px;
                                        height: 20px;
                                        position: relative;
                                        overflow: hidden;
                                        font-size: $font-title1;
                                        color: $color-line;
                                        cursor: pointer;
                                        input {
                                            width: 100%;
                                            height: 100%;
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                            z-index: 2;
                                            opacity: 0;
                                            cursor: pointer;
                                        }
                                        .icon {
                                            position: relative;
                                            top: -3px;
                                            width: 20px;
                                            height: 20px;
                                        }
                                    }
                                    &::after {
                                        content: "";
                                        display: table;
                                        clear: both;
                                    }
                                }
                                .add-address-btn {
                                    width: 100px;
                                    height: 30px;
                                    margin-left: 25px;
                                    border: solid 1px $color-line;
                                    font-size: $font-small;
                                    line-height: 30px;
                                    color: $text-primary;
                                    text-align: center;
                                    cursor: pointer;
                                    transition: all 0.3s;
                                    &:hover {
                                        border-color: $color-golden;
                                        color: $color-golden;
                                    }
                                }
                                .show-more-address {
                                    text-align: center;
                                    .iconfont {
                                        transition: all 0.3s;
                                        display: inline-block;
                                        cursor: pointer;
                                    }
                                    &.active {
                                        .iconfont {
                                            transform: rotate(180deg);
                                            -webkit-transform: rotate(180deg);
                                            -moz-transform: rotate(180deg);
                                            -ms-transform: rotate(180deg);
                                            -o-transform: rotate(180deg);
                                        }
                                    }
                                }
                            }
                            &::after {
                                content: "";
                                display: table;
                                clear: both;
                            }
                        }
                        &::after {
                            content: "";
                            display: table;
                            clear: right;
                        }
                    }
                    &::after {
                        content: "";
                        display: table;
                        clear: both;
                    }
                }
            }
            .btn-box {
                margin-left: 96px;
                margin-bottom: 30px;
                .invoice-btn {
                    display: inline-block;
                    width: 188px;
                    height: 54px;
                    margin-right: 56px;
                    font-size: $font-common;
                    line-height: 54px;
                    text-align: center;
                    border: solid 1px $color-golden;
                    cursor: pointer;
                    &.confirm-btn {
                        background: $color-golden;
                        color: $color-white;
                    }
                    &.reset-btn {
                        background: $bg-color-disabled;
                        color: $color-golden;
                    }
                }
            }
        }
    }
</style>
