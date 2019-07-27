/*
* createTime：2019/2/14
* author：fujie.wen
* description: 订单信息表
*/
<template>
    <div class="main">
        <div class="main-cont flex-vcenter">
            <div v-if="pageState===1 || pageState===2 || pageState===3" class="pay-state">
                <i :class="['iconfont', 'pay-state-img',
                {'icon-chenggong':payResult=='success','icon-guanbi':payResult=='failed'}]"></i>
                <!--支付成功 支付失败-->
                <p class="pay-state-text">
                    {{payResult=='success'?$t('pay.paySuccess'):$t('pay.payFail')}}
                    <span v-if="pageState === 1">{{timekeeping}}s</span>
                </p>

                <!--查看订单详情 继续支付-->
                <div class="pay-btn" @click="pageSwitch" v-if="pageState===1">
                    {{payResult=='success'?$t('pay.viewBillDetail'):$t('pay.payGoOn')}}
                </div>
                <div  v-else>
                    <div class="pay-btn"
                         v-if="showInfo.routerList.length>=1"
                         @click="goPage(showInfo.routerList[0].url)">{{showInfo.routerList[0].title}}</div>
                    <div class="pay-btn mgT30"
                         v-if="showInfo.routerList.length>=2"
                         @click="goPage(showInfo.routerList[1].url)">{{showInfo.routerList[1].title}}</div>
                </div>
            </div>
            <ul class="main-cont-list">
                <li class="list-item flex-box">
                    <!--应付款-->
                    <div class="label">{{$t('pay.payGold')}}：</div>
                    <p class="price">
                        ¥{{pageState == 1 || pageState == 2 || pageState == 3 || (pageState == 4 && orderType) ? actuallyPaid:billInfo.amountUnPay}}
                    </p>
                </li>

                <li class="list-item flex-box" v-if="pageState === 2 || pageState === 3 || (pageState === 4 && orderType)">
                    <!--订单商品-->
                    <div class="label">{{$t('pay.billGood')}}：</div>
                    <p>{{showInfo.name}}</p>
                </li>

                <li class="list-item flex-box">
                    <!--订单号-->
                    <div class="label">{{$t('pay.billNumber')}}：</div>
                    <p>{{billCode}}</p>
                </li>
                <li class="list-item flex-box" v-if="pageState === 1 || (pageState === 4 && !orderType)">
                    <!--订单商品-->
                    <div class="label label-set-height">{{$t('pay.billGood')}}：</div>
                    <ul>
                        <li class="good-name" v-for="(item,index) in billInfo.goodsList">{{item.goodsName}}</li>
                    </ul>
                </li>
                <li class="list-item flex-box" v-if="pageState === 1 || (pageState === 4 && !orderType)">
                    <!--收货地址-->
                    <div class="label">{{$t('pay.receiveAddress')}}：</div>
                    <p>{{billInfo.cargoUsrName+' '+billInfo.cargoMobile+' '
                    +billInfo.cargoStateName+billInfo.cargoCityName+billInfo.cargoDestName+billInfo.cargoAddress+' '
                    + (billInfo.shippingWayCode === 'mdzq' ? billInfo.recptdptName : '')}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { Order } from '../../../api/service'

    export default {
        components:{},
        data() {
            return {
                billInfo:{},//订单信息
                timekeeping: 5,//跳转倒计时
                showInfo:{
                    name:'',
                    routerList:[]
                }
            }
        },
        props:{
            billCode: String,
            payResult: String,// 控制支付状态显示 1.'success'支付成功 2.'failed'支付失败  3.''无状态
            // 订单类型 ''商品购买订单  'D_COUPONSORD'优惠券  'D_CARDORD'会员卡
            orderType: {
                type: String,
                default: ''
            },
            // 实付金额
            actuallyPaid: [String,Number]
        },
        computed:{
            /**
             * 当前页面状态
              * @returns {number} 1:商品支付结果页 2:会员卡支付结果页 3:优惠券支付结果页 4: 支付方式选择页
             */
            pageState(){
                if(this.payResult){
                    switch (true){
                        case !this.orderType:
                            return 1;
                        case this.orderType === 'D_CARDORD':
                            return 2;
                        case this.orderType === 'D_COUPONSORD':
                            return 3;
                    }
                }else{
                    return 4;
                }
            },
        },
        methods: {
            // 页面跳转
            goPage(url){
                this.$router.push(url);
            },
            // 获取订单信息
            getBillInfo(){
                let param = {
                    busContsCode: Storage.get('properties').busContsCode,
                    billCode: this.billCode
                };
                c_showLoading();
                Order.getDetailInfo(param).then((res) => {
                    this.billInfo = res;
                    c_showLoading(false);
                    this.$emit('getBillInfoSuc',res);
                });
            },
            // 切换页面
            pageSwitch(){
                if(this.interval){
                    clearInterval(this.interval);
                }
                this.$emit('pageSwitch');
            },
        },
        created() {
            if(this.orderType === 'D_CARDORD'){
                this.showInfo = {
                    name: this.$t('pay.membershipCard'),// 会员卡
                    routerList: [
                        {id:1, title: this.$t('pay.viewMembershipCard'),url: '/member-card'},// 查看会员卡
                        {id:2, title: this.$t('pay.toMembership'),url: '/member-center'}// 返回会员中心
                    ],
                }
            }
            if(this.orderType === 'D_COUPONSORD'){
                this.showInfo = {
                    name: this.$t('pay.coupon'),// 优惠券
                    routerList: [
                        {id:1, title: this.$t('pay.myCoupon'),url: '/vouchers-list'},// 我的优惠券
                        {id:2, title: this.$t('pay.takeCoupon'),url: '/vouchers-center'}// 领券中心
                    ],
                }
            }
        },
        mounted(){
            if(this.pageState === 1 || (this.pageState === 4 && !this.orderType)){
                this.getBillInfo();
            }

            // 页面跳转计时器 仅商品下单轮询
            if(this.pageState === 1){
                this.interval = setInterval(()=>{
                    if(this.timekeeping == 1){
                        this.pageSwitch();
                        return;
                    }
                    this.timekeeping--;
                },1000)
            }
        }
    }
</script>

<style scoped lang="scss">
    .mgT30{
        margin-top: 10px;
    }
    .main{
        font-size: $font-small;
    }
    .main-cont{
        border: 1px solid $color-line;
        padding: 18px 60px 18px 0;
    }
    .main-cont-list{
        margin-left: 60px;
    }
    .list-item{
        line-height: 60px;
        .price{
            font-size: $font-h2;
            color: $text-warn;

        }
        .label{
            width: 130px;
            color: $text-secondary;
            &.label-set-height{
                line-height: 30px;
            }
        }
    }
    .good-name{
        line-height: 30px;
    }
    .pay-state{
        text-align: center;
        width: 150px;
        margin: 0 150px;
        .pay-state-img{
            width: 98px;
            height: 98px;
            /*color: #A9C469;*/
            font-size: 70px;
            &.icon-chenggong{
                color: #A9C469;
            }
            &.icon-guanbi{
                color: #D44152;
            }
        }
        .pay-state-text{
            color: $text-primary;
            font-size: $font-h2;
            line-height: 60px;
        }
        .pay-btn{
            width: 100%;
            line-height: 40px;
            color: $color-golden;
            font-size: $font-common;
            border: 1px solid $color-golden;
            background: $bg-color-secondary;
            cursor: pointer;
        }
    }
</style>
