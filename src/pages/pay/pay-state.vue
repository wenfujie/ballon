/*
* createTime：2019/2/15
* author：fujie.wen
* description: 支付状态
*/
<template>
    <div class="wrapper">
        <div class="main">
            <order-info-table :billCode="billCode"
                              :payResult="payResult"
                              :orderType="this.orderType"
                              :actuallyPaid="actuallyPaid"
                              @pageSwitch="pageSwitch"
            ></order-info-table>
        </div>
    </div>
</template>

<script>
    import orderInfoTable from "./components/order-info-table"

    export default {
        components:{orderInfoTable},
        data() {
            return {
                billCode:'',
                payResult:'',//支付状态
            }
        },
        methods: {
            //页面切换
            pageSwitch(){
                let url = '';
                if(this.payResult == 'success'){
                    url = '/order-detail?billCode=' + this.billCode;
                }else{
                    url = '/pay-mode?actuallyPaid=' + this.actuallyPaid + '&billCode=' + this.billCode;
                }
                this.$router.replace(url);
            },
        },
        created() {
            this.payResult = this.$route.query.payResult;
            this.billCode = this.$route.query.billCode;
            // 失败时需要前端价格
            this.actuallyPaid = this.$route.query.actuallyPaid;
            // 订单类型
            this.orderType = this.$route.query.orderType;

        }
    }
</script>

<style scoped lang="scss">
    .main{
        margin: 70px 0;
    }
</style>