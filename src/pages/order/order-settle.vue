/*
* createTime：2019/1/28
* author：fujie.wen
* description: 订单结算
*/
<template>
    <div class="wrapper">
        <!--配送方式表格-->
        <table class="com-table delivery-table">
            <thead class="com-thead">
            <th>{{$t('order.shippingAddress')}}</th>
            <th>{{$t('order.deliveryMethod')}}</th>
            </thead>
            <tbody>
            <tr>
                <td class="address-info">

                    <el-form ref="rulesStore"
                             v-show="delivery=='mdzq'"
                             :rules="rulesStore"
                             :model="storeTakeForm"
                             label-width="85px">
                        <el-form-item :label="$t('order.PickupPerson')+'：'" prop="username" class="form-item">
                            <el-input v-model="storeTakeForm.username" clearable></el-input>
                        </el-form-item>

                        <el-form-item :label="$t('order.phoneNumber')+'：'" prop="phone" class="form-item">
                            <el-input v-model="storeTakeForm.phone" maxlength="11"  clearable></el-input>
                        </el-form-item>

                        <el-form-item :label="$t('order.storeArea')+'：'" prop="addressModel">
                            <el-cascader
                                ref="storeCascader"
                                :options="areaList"
                                v-model="storeTakeForm.addressModel"
                                @change="areaChange">
                            </el-cascader>
                        </el-form-item>
                    </el-form>

                    <!--和门店自取表单填写-->
                    <ul class="form-ul" v-show="delivery=='mdzq'">
                        <li>
                            <div class="flex-box">
                                <div class="form-label">{{$t('order.checkStore')}}：</div>
                                <ul class="flex-auto store-list" v-show="delivery=='mdzq' && !storeList.length">
                                    <!--<li v-for="(item,index) in storeList"-->
                                        <!--:key="index"-->
                                        <!--v-show="index<=3"-->
                                        <!--class="store-item">-->
                                        <!--<el-radio v-model="storeId" :label="item.id">{{index+1}}.{{item.dptName}}</el-radio>-->
                                        <!--<p class="store-item-addr">{{item.address}}</p>-->
                                    <!--</li>-->
                                    <li v-show="delivery=='mdzq' && !storeList.length" class="empty-store">{{$t('order.isNoStore')}}</li>
                                </ul>
                                <div>
                                    <div>
                                        <div>{{currentStoreItem.dptName}}</div>
                                        <p class="store-item-addr">{{currentStoreItem.address}}</p>
                                    </div>
                                    <div v-show="delivery=='mdzq' && storeList.length"
                                         :class="['custom-btn',{'check-store-top':storeId}]"
                                         @click="showStoreDialog">
                                        <!--更改门店 选择门店-->
                                        {{storeId?$t('order.changeStore'):$t('selectStore.selectStore')}}
                                        <!--<i class="iconfont icon-xiangxiajiantou icon-down-color"></i>-->
                                    </div>
                                </div>
                            </div>

                        </li>
                    </ul>
                    <!--快递配送地址列表-->
                    <div class="addr-list" v-show="delivery=='kdps'">
                        <ul>
                            <li :key="index"
                                class="addr-item"
                                v-show="index < defaultAddrNum || (showMortAddrBtnText && showAllAddrFlag && index >= defaultAddrNum)"
                                v-for="(item,index) in addressList">
                                <el-radio v-model="addressIndex"
                                          @change="getTransFee"
                                          :label="item.id">{{''}}</el-radio>
                                <span class="addr-list-info addr-list-name" :title="item.cargousrName">{{item.cargousrName}}</span>
                                <span class="addr-list-info addr-list-phone">{{item.cargoPhone | phoneMask}}</span>
                                <span class="addr-list-info addr-list-addr" :title="item.destDesc+item.address">{{item.destDesc+item.address}}</span>
                                <span class="addr-change-btn" @click="editAddr(item)" v-show="addressIndex == item.id">
                                    <!--修改-->
                                    {{$t('order.editAddress')}}
                                </span>
                                <span class="addr-change-btn" @click="deleteAddress(item)" v-show="addressIndex == item.id">
                                    <!--修改-->
                                    {{'删除'}}
                                </span>
                            </li>
                        </ul>
                        <ul class="flex-box addr-btn-group">
                            <li class="addr-btn-all"
                                @click="showAllAddrFlag = !showAllAddrFlag"
                                v-if="showMortAddrBtnText">
                                {{showMortAddrBtnText}}
                            </li>
                            <li class="addr-btn-new" @click="editAddr" v-show="addressList.length<20">
                                <i class="iconfont icon-tianjia"></i>
                                <!--新建地址-->
                                {{$t('order.addAddress')}}
                            </li>
                        </ul>
                    </div>
                </td>
                <td class="tab-right">
                    <!--<div class="cut-border"></div>-->
                    <ul class="flex-hcenter tab-list">
                        <li v-for="(item,index) in deliveryType"
                            :class="['tab-item',{'selected': delivery == item.shipCode}]"
                            @click="checkTab(item,index)"
                            :key="item.id">{{item.shipName}}</li>
                    </ul>
                </td>
            </tr>
            </tbody>
        </table>

        <table class="com-table good-info-table">
            <thead class="com-thead">
            <th>{{$t('cart.goodInfo')}}</th>
            <th>{{$t('common.unitPrice')}}</th>
            <th>{{$t('common.quantity')}}</th>
            <th>{{$t('cart.subtotal')}}</th>
            </thead>
            <tbody>
            <tr class="tr" v-for="(item,index) in shoppingCartList">
                <td class="clearfix">
                    <img class="good-pic fl" v-lazy="getImg(item.url)" alt="">
                    <div class="fl good-info clearfix">
                        <span class="good-info-describe">{{item.goodsName}}</span>
                        <span class="good-info-sku fl"
                              v-if="item.orderFlag == 0">{{item.colorName}} {{item.sizeName}}
                        </span>
                    </div>
                </td>
                <td v-if="item.orderFlag == 0">￥{{item.dealPrice}}</td>
                <td v-else>
                    <!--查看订制信息-->
                    <div class="good-custom-btn" @click.stop="showCustomDialog(item,index)">
                        {{$t('cart.viewCustInfo')}}
                        <i class="iconfont icon-xiangxiajiantou icon-down-color"></i>
                        <!--定制信息弹窗-->
                        <custom-dialog :key="'custom'+customIndex"
                                       fromPage="orderSettle"
                                       :mainFabricName="item.mainFabricName"
                                       :partList="item.partList"
                                       v-clickoutside="handleCustomDiaState"
                                       v-show="customIndex == index"></custom-dialog>
                    </div>
                </td>
                <td>{{item.amount}}</td>
                <td>¥{{item.amount*item.dealPrice | $goldDivide}}</td>
            </tr>
            </tbody>
        </table>

        <!--结算信息-->
        <div class="settle-model">
            <!--<div class="settle-model-cont">-->
                <!--<span class="settle-model-label settle-model-cont-label">选择物流公司：</span>-->
                <!--<el-select v-model="logisticsIndex">-->
                    <!--<el-option-->
                            <!--v-for="(item,index) in logisticsList"-->
                            <!--:key="item.value"-->
                            <!--:label="item.label"-->
                            <!--:value="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            <!--</div>-->
            <div class="flex-between settle-model-bottom">
                <div class="settle-model-left">
                    <div class="ticket-item">
                        <!--使用会员卡-->
                        <span class="settle-model-label">{{'使用会员卡'}}：</span>
                        <el-select v-model="cardId"
                                   :disabled="disabledCart"
                                   placeholder="暂无可用会员卡"
                                   @change="changeVipCard">
                            <el-option
                                v-for="(item,index) in cardList"
                                :key="item.id"
                                :label="item.vipLevelName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="ticket-item">
                        <!--使用折扣券-->
                        <span class="settle-model-label">{{$t('order.useDisCard')}}：</span>
                        <el-select v-model="selectedDisCardId"
                                   :placeholder="disCouponList.length ? $t('order.pleaseChooes'):$t('order.nullDisCard')"
                                   @change="changeCoupon('dis',arguments)"
                                   clearable>
                            <el-option
                                    v-for="(item,index) in disCouponList"
                                    :key="index"
                                    :label="item.couponName"
                                    :value="item.cardId">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="ticket-item bottom-cut">
                        <!--使用现金券-->
                        <span class="settle-model-label">{{$t('order.useCashCard')}}：</span>
                        <el-select v-model="selectedCashCardId"
                                   :placeholder="cashCouponList.length ? $t('order.pleaseChooes'):$t('order.nullCashCard')"
                                   @change="changeCoupon('cash',arguments)"
                                   clearable>
                            <el-option
                                v-for="(item,index) in cashCouponList"
                                :key="index"
                                :disabled="item.disabled"
                                :label="item.couponName"
                                :value="item.cardId">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="flex-box remark-item">
                        <!--订单备注-->
                        <div class="settle-model-label">{{$t('order.orderMemo')}}：</div>
                        <el-input
                                type="textarea"
                                :rows="3"
                                resize="none"
                                :maxlength="150"
                                :placeholder="$t('order.orderMemoTip')"
                                v-model="memo">
                        </el-input>
                    </div>
                </div>
                <div class="settle-model-right">
                    <ul class="settle-right-list">
                        <li class="flex-between settle-right-item">
                            <!--共计商品-->
                            <span>{{$t('order.sumTo')}}：</span>
                            <span>{{allNumberOfUnits}}{{$t('order.piece')}}</span>
                        </li>
                        <li class="flex-between settle-right-item">
                            <!--商品总额-->
                            <span>{{$t('common.goodTotalSum')}}：</span>
                            <span>￥{{totalPrice | $goldDivide}}</span>
                        </li>
                        <li class="flex-between settle-right-item" v-show="delivery == 'kdps'">
                            <!--运费-->
                            <span>{{$t('order.carriage')}}：</span>
                            <span>￥{{transFee | $goldDivide}}</span>
                        </li>
                        <li class="flex-between settle-right-item">
                            <!--其他优惠-->
                            <span>{{'优惠'}}：</span>
                            <span>-￥{{preferentialPrice | $goldDivide}}</span>
                        </li>
                        <!--todo 优惠分开展示注释掉 -->
                        <!--<li class="flex-between settle-right-item">-->
                            <!--&lt;!&ndash;会员卡优惠&ndash;&gt;-->
                            <!--<span>{{'会员卡优惠'}}：</span>-->
                            <!--<span>-￥{{price.vipPrice | $goldDivide}}</span>-->
                        <!--</li>-->
                        <!--<li class="flex-between settle-right-item">-->
                            <!--&lt;!&ndash;折扣券优惠&ndash;&gt;-->
                            <!--<span>{{'折扣券优惠'}}：</span>-->
                            <!--<span>-￥{{price.disCouponPrice | $goldDivide}}</span>-->
                        <!--</li>-->
                        <!--<li class="flex-between settle-right-item">-->
                            <!--&lt;!&ndash;现金券优惠&ndash;&gt;-->
                            <!--<span>{{'现金券优惠'}}：</span>-->
                            <!--<span>-￥{{price.cashCouponPrice + price.storedValueCardPrice | $goldDivide}}</span>-->
                        <!--</li>-->
                    </ul>
                    <div class="flex-between settle-need-pay">
                        <!--应付总额-->
                        <span>{{$t('order.needPay')}}：</span>
                        <span class="settle-need-pay-price">¥{{allPrice | $goldDivide}}</span>
                    </div>
                    <!--去付款-->
                    <div class="pay-btn" @click="checkoutEmitBillForm">{{'提交订单'}}</div>
                </div>
            </div>
        </div>
        <edit-dialog :id="editDialog.id"
                     :destId="editDialog.destId"
                     :addressList="addressList"
                     :tag="editDialog.defaultFlag"
                     ref="addrEditCom"
                     @getAddressList="addressEdit"></edit-dialog>
        <map-dialog :storeData="storeData" ref="mapDialog" @changeStore="changeStore"></map-dialog>
    </div>
</template>
<script>
    import { Goods,Order,UserService,Base,Vouchers } from '../../api/service'
    import { Cascader,Select } from 'element-ui';
    import CustomDialog from '../cart/components/CustomDialog.vue';
    import EditDialog from "../../components/address/EditDialog";
    import MapDialog from '../../components/MapDialog';
    import { cityData } from '../../assets/js/cityData';
    import wxPayPc from '../../utils/wxPayPc';
    import clickoutside from '@/components/clickoutside';
    import {validateAccount} from '@/mixins/validateAccount.js';


    export default {
        components:{'el-cascader':Cascader,'el-select':Select,CustomDialog,EditDialog,MapDialog},
        directives:{ clickoutside },
        mixins:[validateAccount],
        data() {
            return {
                storeData:{// 门店弹窗props
                    province:'',
                    city:'',
                    district:'',
                    dptId:'',
                    list:[]//门店列表
                },
                editDialog:{
                    id:null,
                    destId:null,
                    defaultFlag:false
                },//修改地址组件参数
                storeTakeForm:{// 门店自取表单
                    username:"",
                    phone:"",
                    addressModel:[],//级联选择器v-model
//                    address:"",// 地址名
                    addressId:"",//  地址id
//                    storeId:"",// 店铺id
//                    storeName:"",// 店铺名(假 地址)addressText
//                    realStoreName:"",//真店铺名dptName
                },
                detailAddress:"",// 详细地址
                areaList: [],// 表单可选地址列表
                storeList: [], //  门店列表
                storeId: '',// 已选中门店id
                defaultAddrFlag:false,// 设置默认地址
                addressIndex: '',//已选地址id
                addressList:[],//快递配送地址列表
                transFee:0,//运费
                showAllAddrFlag:false,// 是否显示全部地址
                shoppingCartList:[],//商品列表
                customIndex:-1,//显示的定制信息弹窗索引
                logisticsIndex:'',//选中物流列表索引
                logisticsList:[],//物流列表
                selectedDisCardId:'',//已选中折扣券id
                selectedCashCardId:'',//已选中现金券id
                couponList:[],//券列表
                disCouponList:[],//折扣券列表
                cashCouponList:[],//现金券列表
                price:{},// 计算接口返回价格
                memo:'',//备注
                delivery:"",//选中配送方式id
                deliveryType:[],//配送方式tab

                rulesStore: {
                    username: [
                        { required: true, validator: this.validateUsername, trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, validator: this.validatePhone, trigger: 'blur' },
                    ]
                },

                cardId: '',// 会员卡id
                cardList: [],// 会员卡列表
                disabledCart: false,// 禁用会员卡下拉
            }
        },
        watch:{
            storeId(val){
                this.storeData.dptId = val;
            },
            "storeTakeForm.phone"(value) {
                this.$nextTick(() => {
                    this.storeTakeForm.phone = window.filterPhone(value);
                });
            }
        },
        computed:{
            // 已选中券id
            selectedCouponId(){
                let arrs = [];
                if(this.selectedDisCardId){
                    arrs.push(this.selectedDisCardId);
                }
                if(this.selectedCashCardId){
                    arrs.push(this.selectedCashCardId);
                }
                return arrs;
            },
            // '显示全部地址'和'隐藏部分地址'按钮控制
            showMortAddrBtnText(){
                if(this.addressList.length > this.defaultAddrNum){
                    if(this.showAllAddrFlag){
                        return this.$tc('order.showOrHideAddress',0);//隐藏部分地址
                    }else{
                        return this.$tc('order.showOrHideAddress',1);//显示全部地址
                    }
                }else{
                    return '';//不显示按钮
                }
            },
            // 已选中快递配送地址信息
            addressMsg(){
                if(this.addressIndex){
                    for(let i=0;i<this.addressList.length;i++){
                        if(this.addressList[i].id == this.addressIndex){
                            return this.addressList[i];
                        }
                    }
                }
                return {};
            },
            // 商品总件数
            allNumberOfUnits(){
                let count = 0;
                this.shoppingCartList.forEach(item=>{
                    count += item.amount;
                })
                return count;
            },
            // 商品总额
            totalPrice(){
                let allAmount = 0;
                this.shoppingCartList.forEach(item => {
                    allAmount += item.dealPrice * item.amount;
                });
                return allAmount;
            },
            // 应付总额
            allPrice(){
                let actualPay = 0;
                if(this.delivery == 'kdps'){
                    if(this.price.salePrice){
                        actualPay = this.price.salePrice + this.transFee;
                    }else{
                        actualPay = this.transFee;
                    }
                }else{
                    if(this.price.salePrice){
                        actualPay = this.price.salePrice;
                    }else{
                        actualPay = 0;
                    }
                }
                return +(actualPay.toFixed(2));
            },
            // 优惠价
            preferentialPrice(){
                let price = this.price.vipPrice +
                        this.price.cashCouponPrice +
                        this.price.disCouponPrice +
                        this.price.storedValueCardPrice;
                return price || 0;
            },
            // 当前选中tab对象
            currentNav(){
                for(let i=0;i<this.deliveryType.length;i++){
                    if(this.deliveryType[i].shipCode == this.delivery){
                        return this.deliveryType[i]
                    }
                }
                return {};
            },
            // 当前选中门店信息
            currentStoreItem(){
                if(this.storeId){
                    for(let i=0;i<this.storeList.length;i++){
                        if(this.storeId === this.storeList[i].id){
                            return this.storeList[i];
                        }
                    }
                }
                return {};
            }
        },
        methods: {
            // 校验取货人姓名
            validateUsername(rule, s, callback){
                if(this.storeTakeForm.username.length < 2){
//                    取货人姓名必须输入两个字符以上
                    return callback(new Error(this.$t('order.needTwoString')));
                }else{
                    callback();
                }
            },
            // 控制定制弹窗状态 -1时关闭
            handleCustomDiaState(index=-1){
                this.customIndex = index;
            },
            // 删除地址
            deleteAddress(item) {
                let callback = ()=>{
                    let data = {
                        ids: item.id
                    };
                    UserService.deleteAddrList(data).then(res => {
                        if (res == 1) {
                            this.$message.success(this.$t('common.deleteSuccess'));// 删除成功
                            this.getAddr();
                        } else {
                            this.$message.success(this.$t('common.deleteFail'));// 删除失败
                        }
                    });
                }
                this.msgDialog(this.$t('order.isDeleteAddress'),callback);// 是否确认删除此地址？
            },
            // 弹窗修改门店事件
            changeStore(id){
                this.storeId = id;
            },
            // 显示门店自取弹窗
            showStoreDialog(){

                this.$refs.mapDialog.$data.editReserve3 = true;
            },
            // 修改地址事件
            addressEdit(){
                this.getAddr();
            },
            // 获取门店列表
            getShopList(){

                let data = {
                    code: this.storeTakeForm.addressId,
                    codeType: this.storeCodeType,
                    pageNo: 1,
                    pageSize: 100
                };
                Base.getShopList(data).then((res) => {
                    this.storeId = '';
                    if (res.list.length < 1) {
                        this.storeList = [];
                        this.storeData.list = [];// 门店选择弹窗列表赋值
                    }else{
                        this.storeList = res.list;
                        this.storeData.list = res.list;
                    }
                });
            },
            //  获取配送方式
            getShipType() {
                let data = {
                    effFlag: 1,
                    policyTypeCode: "D_SALERETAIL"
                };
                Order.getShipType(data).then((res) => {
                    // 赋空值（监听$route防止多次push）
                    this.deliveryType = [];
                    res.forEach((item) => {
                        if (item.shipCode === "kdps" || item.shipCode === "mdzq") {
                            this.deliveryType.push(item);
                        }
                    });
                    this.delivery = this.deliveryType[0].shipCode;
                    // 默认选择快递
                    this.deliveryType.forEach((item) => {
                        if(item.shipCode.indexOf('kdps') !== -1) {
                            this.delivery = item.shipCode
                        }
                    })
                });
            },
            // 提交订单
            handleEmitBill(){
                let data = {};
                if(this.delivery === "kdps"){
                    data = {
                        buyUsrMobile: this.addressMsg.cargoMobile,
                        cargoAddr: this.addressMsg.address,
                        cargoDestrictCode: this.addressMsg.districtCode
                                ? this.addressMsg.districtCode
                                : this.addressMsg.addressId,
                        cargoMobile: this.addressMsg.cargoMobile,
                        cargoUsrName: this.addressMsg.cargousrName,
                    };

                }else if(this.delivery === "mdzq"){
                    data = {
                        buyUsrMobile: this.storeTakeForm.phone,
                        cargoAddr: this.currentStoreItem.addressText,
                        cargoDestrictCode: this.storeTakeForm.addressId,
                        cargoMobile: this.storeTakeForm.phone,
                        cargoUsrName: this.storeTakeForm.username,
                        recptDptId: this.currentStoreItem.id,
                    };
                }

                let params = Object.assign({
                    companyId: Storage.get("COMPANYID").company_id,
                    usrId: Storage.get("USER_INFO").usrId,
                    billId: this.orderHdId,
                    busContsCode: Storage.get('properties').busContsCode,
                    shopCode: Storage.get("USER_INFO").shopCode,
                    shopId: Storage.get("USER_INFO").shopId,
                    sourceCode: "D_ORDSHOP",
                    cartList: this.shoppingCartList, //商品列表
                    ctmUsrId: Storage.get("USER_INFO").usrId,
                    ctmMessage: this.memo,//订单备注
                    receiptWayCode: this.delivery,//'kdps'
                    receiptWayId: this.currentNav.id,// 导航id
                    promotionList: this.selectedCouponId,//券数组['123',456]
                    promotePartDto: [],//赠品 []
                    pointFlag: 0,//是否使用积分
                    vipCardHdId: this.cardId || null,//会员卡id
                },data);
                console.log(JSON.parse(JSON.stringify(params)),"====")

                c_showLoading();
                Order.saveOrder(params).then(billCode=>{
                    c_showLoading(false);
                    this.toPay(billCode);
                    this.$store.dispatch('user/updateShoppingCart');
                },err=>{
                    if(err.statusCode == 500 && err.errorMsg){
                        this.$message.error(err.errorMsg);
                    }
                    c_showLoading(false);
                })
            },
            // 订单支付支付
            toPay(billCode) {
                if(this.allPrice <= 0){
                    this.$router.replace('/pay-state?billCode=' + billCode +
                        '&payResult=success' +
                        '&actuallyPaid=' + this.allPrice);
                    Order.packLevelUp({billCode:billCode});
                    Order.lockStock({billCode:billCode,operType:'FRONT_PAY'});
                }else{

                    // todo 加2s延迟处理到选择支付方式页 价格为0的问题   （待能能优化后去掉延迟）
//                    setTimeout(()=>{
                        this.$router.replace('/pay-mode?billCode=' + billCode + '&actuallyPaid=' + this.allPrice);
//                    },2000)
                }
            },
            // 提交订单时 校验表单
            checkoutEmitBillForm(){
                let scrollCallback = ()=>{
                    window.scrollTo(0,200);
                }
                if(this.delivery === "kdps"){
                    if (
                            !this.addressMsg.address ||
                            !this.addressMsg.cargoMobile ||
                            !this.addressMsg.cargousrName
                    ) {
                        scrollCallback();
                        this.msgDialog(this.$t('order.insufficientAddress'));//地址不完整
                    }else{
                        this.handleEmitBill();
                    }
                }else if(this.delivery === "mdzq"){
                    this.$refs.rulesStore.validate((valid) => {
                        if (valid) {
                            if(this.storeId){
                                this.handleEmitBill();
                            }else{
                                scrollCallback();
                                this.$message.error(this.$t('order.chooesStore'));//请选择要自取的门店
                                return false;
                            }
                        } else {
                            scrollCallback();
                            return false;
                        }
                    });
                }
            },
            /**
             * 新建或修改地址
             * @param item（存在时为修改，不存在为新建）
             */
            editAddr(item){
                if(item){
                    this.editDialog = {
                        destId: item.destId,
                        id: item.id,
                        defaultFlag: item.defaultFlag
                    }
                }else{
                    this.editDialog = {
                        destId: null,
                        id: null,
                        defaultFlag: item.defaultFlag
                    }
                }
                this.$refs.addrEditCom.setDialogViewState();
                this.$nextTick(()=>{
                    this.$refs.addrEditCom.titleChange();
                })
            },
            // 修改选择券
            changeCoupon(type,argument){
                if(type === 'dis'){
                    this.selectedDisCardId = argument[0];
                    if(this.selectedDisCardId){
                        this.getUsableTickets(this.selectedDisCardId).then(res=>{
                            // 现金券、储值卡合并
                            let allCashList = [];
                            if(res.storeList && res.storeList.length){
                                allCashList = allCashList.concat(res.storeList);
                            }
                            if(res.cashList && res.cashList.length){
                                allCashList = allCashList.concat(res.cashList);
                            }
                            this.cashCouponList.forEach((item,index)=>{
                                if(!item.cardId)return;
                                if(allCashList && allCashList.length){
                                    for(let i=0;i<allCashList.length;i++){
                                        if(item.cardId == allCashList[i]){
                                            item.disabled = false;
                                            break;
                                        }
                                        // 可用券列表中找不到该券
                                        if(allCashList.length == i+1){
                                            item.disabled = true;
                                            // 已选券被禁用 清空该已选
                                            if(this.selectedCashCardId == item.cardId){
                                                this.selectedCashCardId = '';
                                            }

                                        }
                                    }
                                }else{
                                    item.disabled = true;
                                    this.selectedCashCardId = '';
                                }

                            })
                        });
                    }else{
                        this.cashCouponList.forEach((item,index)=> {
                            item.disabled = false;
                        })
                    }
                }else{
                    this.selectedCashCardId = argument[0];
                }
                this.getDiscount();
            },
            //选中券 过滤出可用券
            getUsableTickets(cardIds) {
                let params = {
                    rtlOrdInterHdId: this.orderHdId,
                    vipCardHdId: this.cardId || null,//会员卡id
                    cardIds: cardIds + "" || ""
                };
                return Vouchers.getCanUseCouponsList(params);
            },
            //获取价格
            async getDiscount(cardIds) {
                let params = {
                    companyId: this.Storage.get("COMPANYID").company_id,
                    usrId: this.Storage.get("USER_INFO").usrId,
                    rtlOrdInterHdId: this.orderHdId,
                    cardIds: cardIds || (this.selectedCouponId+''),
                    pointFlag: 0, //是否使用积分
                    vipCardHdId: this.cardId || null,//会员卡id
                };
                c_showLoading();
                this.price = await Vouchers.getOrderDiscountPoint(params);

                c_showLoading(false);
                return this.price;
            },
            // 获取结算页面可用优惠券列表
            getCouponsList() {
                let data = {
                    shopId: Storage.get("USER_INFO").shopId,
                    rtlOrdInterHdId: this.orderHdId,
                    scopeId: 0,
                    vipCardHdId: this.cardId || null,//会员卡id
                };

                this.disCouponList = []; //折扣券
                this.cashCouponList = []; //现金券

                Vouchers.getOrderCouponsList(data).then((res) => {
                    res.forEach(item => {
                        if (item.discount) {
                            this.disCouponList.push(item);
                        } else {
                            item.disabled = false;
                            this.cashCouponList.push(item);
                        }
                    });
                    if(this.disCouponList.length){
                        // 不使用折扣券
                        this.disCouponList.unshift({couponName: this.$t('order.unUseDisCard'), cardId: '',disabled: false});
                    }
                    if(this.cashCouponList.length){
                        // 不使用现金券
                        this.cashCouponList.unshift({couponName: this.$t('order.unUseCashCard'), cardId: '',disabled: false});
                    }
                });
            },
            // 显示定制信息弹窗
            showCustomDialog(child,cindex){
                if(this.customIndex === cindex){
                    this.customIndex = -1;
                    return;
                }
                this.customIndex = cindex;
            },
            //  获取地址列表
            getAddr() {
                //  获取个人默认地址
                let data = {
                    vipUsrId: Storage.get("USER_INFO").usrId
                };
                UserService.getAddrList(data).then((res) => {
                    if (res && res.length > 0) {
                        for(let i=0; i<res.length; i++) {
                            // 存在已选勾选已选选id
                            if(this.addressIndex && this.addressIndex == res[i].id){
                                this.addressIndex = res[i].id;
                                break;
                            }
                            // 否则用默认id
                            if(res[i].defaultFlag === 1) {
                                this.addressIndex = res[i].id;
                                break;
                            }
                            // 在否则选中第一条
                            if(res.length-1 == i){
                                this.addressIndex = res[0].id;
                            }
                        }

                        this.addressList = res;
                        this.$nextTick(()=>{
                            this.getTransFee();
                        })
                    }else{
                        this.addressList = [];
                    }
                });
            },
            //  获取运费
            getTransFee() {
                let data = {
                    id: this.orderHdId,
                    destCode: this.addressMsg.addressId
                            ? this.addressMsg.addressId
                            : this.addressMsg.districtCode
                };
                if (this.addressMsg.destId) {
                    data.destId = this.addressMsg.destId;
                }
                Order.getFreight(data).then((res) => {
                    this.transFee = res;
                });
            },
            // 切换导航
            checkTab(item,index){
                this.delivery = item.shipCode;
            },
            // 省市区选择确定
            areaChange(value){
                this.$nextTick(()=>{

                    // 解决饿了吗组件在 线上和本地返回数据有区别 导致报错问题
                    if(this.$refs.storeCascader.currentLabels){
                        this.storeData.province = this.$refs.storeCascader.currentLabels[0];
                        this.storeData.city = this.$refs.storeCascader.currentLabels[1];
                        this.storeData.district = this.$refs.storeCascader.currentLabels[2];
                    }else{
                        let inputValue = this.$refs.storeCascader.getCheckedNodes()[0].pathLabels;

                        console.log(inputValue,"=====")
                        this.storeData.province = inputValue[0];
                        this.storeData.city = inputValue[1];
                        this.storeData.district = inputValue[2] ? inputValue[2] : '';
                    }


                    if(value[2]){
                        this.storeTakeForm.addressId = value[2];
                        this.storeCodeType = 0;
                    }else if(value[1]){
                        this.storeTakeForm.addressId = value[1];
                        this.storeCodeType = 1;
                    }else{
                        this.storeTakeForm.addressId = value[0]
                    }
                    this.getShopList();
                })
            },
            // 会员卡change事件
            changeVipCard(value){
                console.log(value,"....")
                // 清空已选券
                this.selectedDisCardId = '';
                this.selectedCashCardId = '';
                // 获取券列表
                this.getCouponsList();
                // 计算价格
                this.getDiscount();
            },
            /** 校验会员卡表单是否禁用 **/
            checkUseableCart(){
                // 存在未调价商品则返回true 表示可使用会员卡
                return this.shoppingCartList.some(item=>{
                    if(item.salePrice == item.dealPrice){
                        return true;
                    }
                })
            },
            // 获取会员卡列表
            getCartList(){
                let data = {
                    shopCode: Storage.get("USER_INFO").shopCode,
//                    vipInfoHdId: 856
                }
                return UserService.memberCartList(data)
            },
            //  获取结算页信息
            getPage(callback) {
                let data = {
                    ctmUsrId: Storage.get("USER_INFO").usrId,
                    cookieId: Storage.get("USER_INFO").cookieId,
                    rtlCartTempHdId: this.orderHdId || this.$route.query.orderHdId,
                    busContsCode: Storage.get('properties').busContsCode,
                    shopCode: Storage.get("USER_INFO").shopCode
                };
                Order.getSettlementInfo(data).then((res) => {
                    // 赋空值（监听$route防止多次push）

                    this.shoppingCartList = res.skuList;
                    typeof callback === "function" && callback();
                });
            },
            // 切换页面后回到"订单结算" 需初始化页面方法
            initPageFunction(){
                this.defaultAddrNum = 4;// 快递配送初始显示条数
                this.orderHdId = this.$route.query.orderHdId;// 中间表id
                // 获取结算页信息
                let p1 = new Promise((resolve)=>{
                    this.getPage(resolve);
                })

                // 获取会员卡列表
                let p2 = new Promise((resolve)=>{
                    this.getCartList().then(res=>{
                        res.unshift({
                            id: -1,
                            vipLevelName: '不使用会员卡'
                        })
                        this.cardList = res;

                        if(res && res.length > 1){
                            this.$nextTick(()=>{
                                // 默认使用第一张（后端以最高级到低级排序）
                                this.cardId = this.cardList[1].id;
                            })
                        }else{
                            this.cardId = -1;
                        }
                        resolve();
                    })
                })

                Promise.all([p1,p2]).then((res)=>{
                    // 校验会员卡表单是否禁用
                    let useCartFlag = this.checkUseableCart();
                    if(!useCartFlag){
                        this.cardId = -1;
                        this.disabledCart = true;
                    }
                    this.getDiscount('');
                    this.getCouponsList();
                })
                this.getShipType();
                this.areaList = c_disposeCityData(cityData, true);
                this.getAddr();
            },
            /***
             * 工具方法
             */
            msgDialog(msg,callback){
                this.$alert(msg, this.$t('common.hint'), {
                    confirmButtonText: this.$t('common.sure'),
                    dangerouslyUseHTMLString:true,
                    callback: action => {
                        if(action == 'confirm'){
                            typeof callback === 'function' && callback();
                        }
                    }
                });
            }
        },
        created() {
            this.initPageFunction();
        }
    }
</script>

<style scoped lang="scss">
    .wrapper{
        padding-top: 58px;
        padding-bottom: 70px;
        font-size: $font-small;
        color: $text-primary;
    }
    .good-pic{
        width: 100px;
        height: 100px;
        margin: 17px 0;
    }
    .td-operator{
        color: $text-regular;
        .td-operator-collect,
        .td-operator-remove{
            cursor: pointer;
        }
        .td-operator-remove:hover{
            color:$text-hover;
        }
        .td-operator-collect:hover{
            color:$text-hover;
        }
    }
    .good-info{
        text-align: left;
        margin-left: 20px;
        padding-top: 38px;

        .good-info-describe,
        .good-info-sku{
            display: block;
            line-height: 28px;
            font-size: $font-small;
            position: relative;
        }
        .good-info-describe{
            color: $text-primary;
        }
        .good-info-sku{
            color: $text-secondary;
        }
    }

    .good-info-table{
        margin-top: 30px;
        th:nth-child(1),td:nth-child(1){
            text-align: left;
            padding-left: 25px;
            box-sizing: inherit;
        }
        th:nth-child(2),td:nth-child(2){width: 200px;}
        th:nth-child(3),td:nth-child(3){width: 200px;}
        th:nth-child(4),td:nth-child(4){width: 200px;}
    }
    .triangle-up{
        width: 0;
        height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-bottom: 15px solid $color-white;
        position: absolute;
        top: -15px;
        left: 15px;
        filter: drop-shadow(0px -1px 1px #dcdcdc);
    }
    .custom-btn{
        border:1px solid $color-golden;
        padding: 0 10px;
        line-height: 32px;
        cursor: pointer;
        position: relative;
        color: $color-golden;
        width: 96px;
        background: $bg-color-secondary;
        text-align: center;
        &.check-store-top{
            margin-top: 15px;
        }
    }
    .good-custom-btn{
        border:1px solid $color-line;
        padding: 0 10px;
        line-height: 32px;
        cursor: pointer;
        position: relative;
        color: $text-secondary;
        width: 130px;
        display: inline-block;
    }
    .icon-down-color{
        color:$text-secondary;
    }
    .delivery-table{
        th:nth-child(1),td:nth-child(1),
        th:nth-child(2),td:nth-child(2){
            text-align: left;
            padding-left: 30px;
            box-sizing: inherit;
        }
        th:nth-child(2),td:nth-child(2){width: 435px;}
    }
    .address-info{
        padding: 30px;
    }
    .userinfo{
        .el-input{
            width: 200px;
        }
    }
    .form-ul{

        li{
            margin-bottom: 30px;
        }
        li:last-child{
            margin-bottom: 0;
        }
    }
    .store-item{
        display: inline-block;
        width: 240px;


        .store-item-addr{
            color: $text-secondary;
            margin-left: 23px;
        }
        &:nth-child(2n-1){
            margin-right: 82px;
        }
    }
    .form-label{
        width: 85px;
    }
    .addr-btn{
        width: 188px;
        line-height: 54px;
        text-align: center;
        font-size:$font-common;
        border: 1px solid $color-golden;
        cursor: pointer;

        &.addr-btn-cancel{
            background: $bg-color-secondary;
            color: $color-golden;
        }
        &.addr-btn-sure{
            background: $color-golden;
            margin-left: 85px;
            margin-right: 56px;
            color: $text-white;
        }
    }
    .tab-right{
        padding: 30px;
        position: relative;
        border-left: 1px dotted $color-line;
        .cut-border{
            position: absolute;
            border-left: 1px dotted $color-line;
            height: 100%;
            top:0;
            left: 0;
            box-sizing: content-box;
        }
    }
    .tab-list{

        .tab-item{
            margin-right: 10px;
            color: $text-secondary;
            font-size:$font-common;
            text-align: center;
            width:160px;
            line-height: 49px;
            border: 1px solid $color-line;
            cursor: pointer;
            &:last-child{
                margin-right: 0;
            }
            &.selected{
                border-color: $color-golden;
                color: $color-golden;

            }
        }
    }
    .addr-default-box{
        margin-top: 30px;
    }
    .addr-list{

    }
    .addr-item{
        line-height: 42px;
        .addr-list-name{
            width: 95px;
            margin: 0 24px;
        }
        .addr-list-phone{}
        .addr-list-addr{
            width: 250px;
            margin: 0 24px 0 24px;
        }
        .addr-list-info{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            vertical-align: top;
        }
    }
    .addr-change-btn{
        width: 50px;
        line-height: 25px;
        text-align: center;
        color: $text-hover;
        display: inline-block;
        border:1px solid $color-golden;
        background: $bg-color-secondary;
        cursor: pointer;
        margin-right: 5px;
    }
    .addr-btn-group{
        margin-top: 20px;
    }
    .addr-btn-all,
    .addr-btn-new{
        border: 1px solid $color-line;
        padding: 0 10px;
        line-height: 30px;
        cursor: pointer;
    }
    .addr-btn-all{
        color: $text-secondary;
        margin-right: 20px;
    }
    .settle-model{
        background: $bg-color-regular;
        padding-bottom: 43px;
        box-sizing: content-box;
        .settle-model-cont{
            line-height: 80px;
            border-bottom: 2px dotted $color-line;
        }
    }
    .settle-model-bottom{
        margin-left: 68px;
    }
    .settle-model-label{
        display: inline-block;
        width: 110px;
    }
    .settle-model-cont-label{
        margin-left: 68px;
    }
    .settle-model-left{
        width: 600px;
    }
    .ticket-item{
        height: 80px;
        display: flex;
        align-items: center;
        &.bottom-cut{
            border-bottom: 2px dotted $color-line;
        }
    }
    .remark-item{
        margin-top: 25px;
        .el-textarea{
            width: 70%;
        }
    }
    .settle-model-right{
        margin-right: 67px;
        width: 190px;
        .settle-right-list{
            border-bottom: 2px dotted $color-line;
            .settle-right-item{
                line-height: 50px;
            }
        }
    }
    .settle-need-pay{
        line-height: 60px;
        .settle-need-pay-price{
            font-size: $font-regular;
            color: $color-red;
            font-weight: bold;
        }
    }
    .pay-btn{
        background: $color-golden;
        color: $text-white;
        font-size: $font-common;
        text-align: center;
        width: 168px;
        margin: 0 auto;
        line-height: 50px;
        cursor: pointer;
    }
    .empty-store{
        color:$text-secondary;
    }
    .form-item{
        display: inline-block;
        width: 285px;
        margin-right: 30px;
    }
</style>
