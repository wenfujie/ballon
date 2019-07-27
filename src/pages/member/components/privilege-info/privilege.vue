<!--
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description: 会员特权信息组件
 * @Date: 2019-02-26 11:44:02
 * @LastEditTime: 2019-02-27 11:11:56
 -->
<style lang='scss' scoped>
.privilege-wrap:nth-child(2n)
{
    background:rgba(245,243,239,1);
}
.privilege-wrap {
    width: 100%;
    height: 50%;
    max-height: 50%;
    padding: 15px 32px;
    font-family: "PingFangSC-Medium";

    .header {
        padding-bottom: 16px;
        border-bottom: solid 2px #b59f7f;
        .left,
        .right {
            display: inline-block;
            width: 50%;
        }
        .left {
            color: $text-hover;
            font-size: $font-regular;
            font-weight: 600;
            text-align: left;
        }
        .right {
            font-size: $font-small;
            text-align: right;
        }
    }
    .content {
        padding-top: 45px;
        p {
            display: inline-block;
            width: 50%;
            padding: 2px 0px;
            font-size: $font-small;
            font-weight: 400;
            line-height: 21px;
        }
    }
}
</style>

<template>
    <div class="privilege-wrap">
        <div class="header">
            <div class="left"></div>
            <div class="right">有效期：</div>
        </div>
        <div class="content">
            <div>{{userCard.vipDiscount}}</div>
            <div>
                <div>立即续费</div>
                <div></div>
            </div>
            <!-- <p>专享所有商品98折；</p>
            <p>专享所有商品98折；</p>
            <p>专享所有商品98折；</p>
            <p>专享所有商品98折；</p>
            <p>专享所有商品98折；</p>
            <p>专享所有商品98折；</p> -->
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // 
        userCard: Object,
        showPopup: false
    },
    data() {
        return {}
    },
    created() {
        console.log("888",this.userCard)
    }
}
</script>