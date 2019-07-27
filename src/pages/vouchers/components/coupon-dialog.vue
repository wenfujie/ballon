<template>
    <el-dialog
            title=""
            :visible.sync="diaVisible"
            width="500px"
            :before-close="handleClose">
            <div class="eldialog">
                <p class="dialog-icon">
                    <svg width="48" height="48" class="tabbar-icon" aria-hidden="true">
                        <use v-if="icon=='success'" xlink:href="#icon-chenggong"></use>
                        <use v-else xlink:href="#icon-shibai"></use>
                    </svg>
                </p>
            <p class="title">{{title}}</p>
            <p class="content">{{content}}</p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose" class="closeBtn">{{cancelBtnText}}</el-button>
                <el-button type="primary" @click="handleConfirm" class="confirmBtn" v-if="!!confirmBtnText">{{confirmBtnText}}</el-button>
            </div>
            <p v-if="downTime > 0" class="countDownTime">{{downTime}}{{$t("vouchersCenter.secondsColse")}}</p>
            </div>
            </el-dialog>
</template>
<script>
export default {
    name: 'coupon-dialog',
    props: {
        couponId:{
            default: 0,
            type: Number
        },
        dialogVisible:{
            default: false,
            type: Boolean 
        },
        icon: {
           default: "",
           type: String 
        },
        title: {
            default: "",
            type: String
        },
        content: {
            default: "",
            type: String
        },
        countDownTime: {
            default: 0,
            type: Number
        },
        cancelBtnText: {
            default: "",
            type: String
        },
        cancelBtnFun: {
            default: function(){},
            type: Function
        },
        confirmBtnText: {
            default: "",
            type: String
        },
        confirmBtnFun: {
            default: function(){},
            type: Function
        }
    },
    data(){
        return {
            clr: "",
            downTime: this.countDownTime,
            diaVisible: this.dialogVisible
        }
    },
    methods: {
        handleClose(){
            clearInterval(this.clr)
            this.$emit("handleClose")
        },
        handleConfirm(){
            clearInterval(this.clr)
            this.diaVisible = false
            this.$emit("handleConfirm", {text:this.confirmBtnText, couponId: this.couponId})
        },
        countDown(){
            this.clr = setInterval(()=>{
                this.downTime--
                if(this.downTime <= 0) {
                    clearInterval(this.clr)
                    this.handleClose()
                    return
                }
            }, 1000)
        }
    },
    mounted(){
        this.$nextTick(()=>{
            if(this.diaVisible) this.countDown()
        })
    }
}
</script>
<style lang="scss" scoped>
    .eldialog{
        text-align: center;
        .dialog-icon{
            // text-align: center
        }
        .title{
            font-size: $font-regular;
            color: $text-primary;
            margin: 30px 0 10px;
            font-weight: 500;
        }
        .content{
            font-size: $font-small;
            color: $text-secondary;
        }
        .dialog-footer{
            margin-top: 30px;
            .closeBtn, .confirmBtn{
                width: 144px;
                height: 42px;
                font-size: $font-common;
                background-color: $bg-color-secondary;
                color: $text-primary;
                border: 1px solid $color-line;
            }
            .confirmBtn{
                color: $text-white;
                background-color: $color-golden;
            }
        }
        .countDownTime{
            margin-top: 60px;
            text-align: left;
        }
    }
</style>
