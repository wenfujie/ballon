/*
* createTime：2019/2/15
* author：fujie.wen
* description: 微信支付
*/
<template>
    <div class="wrapper">
        <div class="flex-between bill-info">
            <div class="flex-box">
                <!--请您及时付款，以便系统为您尽快处理哦！-->
                <p>{{$t('pay.pleasePayInTime')}}</p>
                <!--订单号-->
                <p>{{$t('pay.billNumber')}}：{{billCode}}</p>
            </div>
            <div class="bill-price">¥{{actuallyPaid|$goldDivide}}</div>
        </div>

        <div class="main flex-box">
            <div class="main-left flex-vbox flex-center">
                <!--微信支付-->
                <p class="main-tite">{{$t('pay.wxPay')}}</p>
                <div id="wxqrcode">
                    <div class="disabled" v-if="qrcodeDisabled">
                        <!--二维码失效，请-->
                        {{$t('pay.QRcodeLoseEfficacy')}}
                        <!--刷新-->
                        <span @click="refreshPage" class="refresh-btn">{{$t('common.refresh')}}</span>
                        <div class="next-step">
                            <!--若已支付成功，请点击-->
                            {{$t('pay.paySuccessPleaseClick')}}
                            <!--下一步-->
                            <span class="refresh-btn" @click="nextStep">
                                {{$t('pay.next')}}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="flex-box">
                    <div>
                        <img src="@/assets/images/pay/scanningLogo.png" alt="">
                    </div>
                    <div class="qrcode-tip">
                        <!--请使用微信扫一扫-->
                        <p>{{$t('pay.useWechatScan')}}</p>
                        <!--扫描二维码支付-->
                        <p>{{$t('pay.useWechatScanToPay')}}</p>
                    </div>
                </div>
                <!--二维码有效时长60秒，请尽快支付-->
                <p class="scannning-desctibe">{{$t('pay.payRightNow')}}</p>
            </div>
            <div class="center-cut"></div>
            <div class="main-right">
                <img src="@/assets/images/pay/scanningTip.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    import QRCode from 'qrcodejs2';
    import payPc from '../../utils/wxPayPc';
    import { Payment } from '../../api/service';

    export default {
        components:{},
        data() {
            return {
                payInfo:{},//支付信息
                actuallyPaid:0,//实付金额
                qrcodeDisabled: false,// 显示二维码失效遮罩
            }
        },
        beforeDestroy(){
            if(this.interval){
                clearInterval(this.interval);
            }
        },

        methods: {
            // 下一步
            nextStep(){
                this.getBillState(this.payInfo.paymentUid).then((res)=>{
                    if(res != 1){
                        // 非商品下单 仅提示
                        if(this.orderType){
                            this.$message.error('订单尚未支付，请先支付');
                        }else{
                            // 商品下单 跳到商品详情页
                            this.$router.replace('/order-detail?billCode=' + this.billCode);
                        }
                    }
                })
            },
            // 刷新页面
            refreshPage(){
                window.location.reload();
            },
            //  生成二维码
            qrCodeInit(){
                let mobileCode = new QRCode('wxqrcode', {
                    width: 280,
                    height: 280,
                    text: this.payInfo.qRCode, // 二维码地址
                    colorDark : "#000",
                    colorLight : "#fff",
                })
            },
            // 轮询判断订单状态
            pollPayState(paymentUid){
                let callback = ()=>{
                    this.getBillState(paymentUid);
                    this.pollNum++;
                    // 超过轮询限制时间 结束轮询
                    if(this.pollNum * this.pollTime > this.limitTime){
                        clearInterval(this.interval);
                        this.qrcodeDisabled = true;
                    }
                }
                this.interval = setInterval(()=>{
                    callback();
                },this.pollTime);
            },
            // 获取订单状态
            getBillState(paymentUid){
                return Payment.getBillState({paymentUid:paymentUid}).then(res=>{
                    if(res == 1){// 支付成功
                        if(this.interval){
                            clearInterval(this.interval);
                        }
                        window.location.href = this.successUrl;
                    }else{
                    }
                    return res;
                })
            },
            getWxPayInfo(){
                // 微信不支持支付成功后自动跳转

                payPc.wxPay(this,this.billCode,this.actuallyPaid,this.successUrl,this.orderType).then(res=>{
                    this.payInfo = res;
                    this.qrCodeInit();
                    this.pollPayState(res.paymentUid);
                },err => {
                    if(this.orderType){
                        this.$message.error(this.$t('pay.payError'));// 支付出错
                    }else{
                        this.$router.replace("/pay-state?billCode=" + this.billCode + '&payResult=failed' + '&actuallyPaid=' + this.actuallyPaid);
                    }
                })
            }
        },
        created() {
            this.pollTime = 5000;// 轮询间隔
            this.pollNum = 0;// 已轮询次数
            this.limitTime = 60000;// 限制超过时间 结束轮询

            this.billCode = this.$route.query.billCode;
            this.actuallyPaid = this.$route.query.actuallyPaid;
            // 订单类型（支付接口参数） 商品下单为undefine 非商品下单支付时必传
            this.orderType = this.$route.query.orderType;
            // 成功后要跳路由
            let successUrl = this.$route.query.successUrl;
            this.successUrl = window.location.origin + `${baseConstant.pathProjectName?'/'+baseConstant.pathProjectName : ''}` +
                    (successUrl ?
                            decodeURIComponent(successUrl) :
                            '/pay-state?billCode=' + this.billCode + '&payResult=success' +
                            (this.orderType?'&orderType='+this.orderType:'') +
                            (this.actuallyPaid?'&actuallyPaid='+this.actuallyPaid:''));
        },
        mounted(){
            this.getWxPayInfo();
        }
    }
</script>

<style scoped lang="scss">
    .wrapper{
        font-size: $font-small;
    }
    .bill-info{
        line-height: 50px;
        background: $bg-color-regular;
        font-size: $font-regular;
        margin: 70px 0 30px 0;
        padding: 0 20px;
        .bill-price{
            color: $text-warn;
            font-size: $font-h2;
        }
    }
    .main{
        border: 1px solid $color-line;
        position: relative;
        margin-bottom: 100px;
        .main-left{
            width: 50%;
            padding: 28px 0;
        }
        .center-cut{
            position: absolute;
            left: 50%;
            top: 5%;
            height: 90%;
            border-left: 1px solid $color-line;
        }
    }
    .main-tite{
        font-size: $font-h2;

    }
    #wxqrcode{
        margin: 20px 0 10px 0;
        width: 280px;
        height: 280px;
        padding: 10px;
        box-sizing: content-box;
        border: 1px solid $color-line;
        position: relative;
        .disabled{
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 100;
            left: 0;
            top:0;
            background: $color-white;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            .next-step{
                position: absolute;
                top: 248px;
                left: 0px;
                width: 100%;
                text-align: center;
            }
        }
    }
    .scannning-desctibe{
        margin-top: 20px;
        color: $text-hover;
    }
    .qrcode-tip{
        margin-left: 14px;
        p{
            line-height: 20px;
        }
    }
    .main-right{
        width: calc(50% - 1px);
        height: 100%;
        img{
            width: 280px;
            height:351px;
            margin: 85px 0 0 138px;
        }
    }
    .refresh-btn{
        color: $text-blue;
        cursor: pointer;
        text-decoration: underline;
    }

</style>
