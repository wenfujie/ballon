/*
* createTime：2019/2/14
* author：fujie.wen
* description: 支付方式
*/
<template>
    <div class="wrapper">
        <!--订单详情表格-->
        <div class="pay-table">
            <order-info-table :billCode="billCode"
                              :orderType="this.orderType"
                              :actuallyPaid="actuallyPaid"
                              @getBillInfoSuc="getBillInfoSuc"></order-info-table>
        </div>

        <div class="pay-mode">
            <!--支付方式-->
            <div class="pay-title">{{$t('pay.payMode')}}</div>
            <ul class="flex-box pay-list">
                <li class="pay-item flex-vcenter"
                    :key="index"
                    v-for="(item,index) in payList">
                    <el-radio v-model="radio" :label="item.paymentCode"><img :src="item.imgName" alt=""></el-radio>

                </li>
            </ul>
        </div>

        <div class="flex-end">
            <!--支付-->
            <div class="pay-btn" @click="toPay">{{$t('pay.pay')}}</div>
        </div>

        <div v-html="html" v-if="html"></div>
    </div>
</template>

<script>
    import orderInfoTable from "./components/order-info-table";
    import { Base } from '../../api/service';
    import payPc from '../../utils/wxPayPc';
    import Base64 from '../../utils/base64'

    export default {
        components:{orderInfoTable},
        data() {
            return {
                radio:"",//选中支付方式(微信：D_WEIXIN，支付宝：D_ALIPAY)
                billCode:'',
                payList:[],// 支付方式列表
                html:'',//
            }
        },
        methods: {
            // 获取订单信息成功
            getBillInfoSuc(res){
                this.actuallyPaid = res.amountUnPay;
            },
            // 支付
            toPay(){
                if(this.radio == 'D_WEIXIN'){//微信
                    this.$router.push('/pay-wx?billCode='+this.billCode+'&actuallyPaid='+this.actuallyPaid
                            +(this.successUrl?'&successUrl='+this.successUrl:'')
                            +(this.orderType?'&orderType='+this.orderType:'')
                    );
                }else if(this.radio == 'D_ALIPAY'){// 支付宝
                    let successUrl = window.location.origin + `${baseConstant.pathProjectName?'/'+baseConstant.pathProjectName : ''}` +
                            (this.successUrl ?
                                    decodeURIComponent(this.successUrl) :
                                    '/pay-state?billCode=' + this.billCode + '&payResult=success' +
                                    (this.orderType?'&orderType='+this.orderType:'') +
                                    (this.actuallyPaid?'&actuallyPaid='+this.actuallyPaid:''));
                    payPc.aliPay(this,this.billCode,this.actuallyPaid,successUrl,this.orderType).then(res=>{
                        this.base = new Base64();
                        this.html = this.base.decode(res.aliPayHtml);
                        this.$nextTick(()=>{
                            document.forms[0].submit()
                        })
                    },err => {
                        if(this.orderType){
                            this.$message.error(this.$t('pay.payError'));
                        }else{
                            this.$router.replace("/pay-state?billCode=" + this.billCode + '&payResult=failed' + '&actuallyPaid=' + this.actuallyPaid);
                        }
                    })
                }
            },
            // 支付方式列表
            getPayList(){
                let data = {
                    dptId:Storage.get('properties').shopId,
                    allFlag:1,
                }
                Base.getPayList(data).then(res=>{
                    res.forEach(item=>{
                        if(item.paymentCode == 'D_WEIXIN'){
                            item.imgName = require('../../assets/images/pay/weixin.png');
                        }
                        if(item.paymentCode == 'D_ALIPAY'){
                            item.imgName = require('../../assets/images/pay/zhifubao.png');
                        }
                    })
                    this.payList = res;
                    if(this.payList.length){
                        this.$nextTick(()=>{
                            // 设置默认支付方式
                            this.radio = this.payList[0].paymentCode;
                        })
                    }
                })
            },
        },
        created() {
            this.billCode = this.$route.query.billCode;
            this.actuallyPaid = this.$route.query.actuallyPaid;
            // 订单类型（支付接口参数） 商品下单为undefine 非商品下单支付时必传
            this.orderType = this.$route.query.orderType;
            // 成功后要跳路由
            this.successUrl = this.$route.query.successUrl;

            this.getPayList();
        }
    }
</script>

<style scoped lang="scss">
    .wrapper{
        font-size: $font-small;
    }
    .pay-table{
        margin: 70px 0 30px 0;
    }
    .pay-title{
        background: $color-thead;
        color: $text-secondary;
        line-height: 50px;
        padding: 0 30px;
    }
    .pay-list{
        margin: 28px 0;
    }
    .pay-item{
        margin-left: 60px;
    }
    .pay-btn{
        width: 168px;
        line-height: 50px;
        color: $text-white;
        background: $color-golden;
        text-align: center;
        font-size: $font-common;
        cursor: pointer;
        margin-bottom: 70px;
    }
</style>
