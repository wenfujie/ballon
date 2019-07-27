<!--
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description: 会员卡组件
 * @Date: 2019-02-26 10:56:19
 * @LastEditTime: 2019-02-27 10:25:59
 -->
<style lang='scss' scoped>
.goldCard {
    background: url("../../images/cardBlack.png");
    color: $color-golden-hover;
    .card-level:after {
        background: $color-golden-hover;
    }
}

.silverCard {
    background: url("../../images/cardSilver.png");
    color: $color-white;
    .card-level:after {
        background: #fff;
    }
}

.card {
    height: 255px;
    width: 100%;
    box-shadow: 1px 1px 1px 1px $color-thead;
    margin-bottom: 40px;
    .left {
        float: left;
        height: 100%;
        width: 68%;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        // border: dotted 1px #d5bc98;
        .card-level {
            display: inline-block;
            width: 35%;
            height: 100%;
            padding-top: 7%;
            text-align: center;

            position: relative;
            .iconfont {
                font-size: 60px;
            }
            .level-name {
                font-size: $font-regular;
                margin-top: -15px;
            }
            .sale-price {
                font-size: $font-h2;
            }
        }
        .card-level:after {
            content: "";
            display: block;
            position: absolute;
            right: 0;
            top: 25%;
            width: 1px;
            height: 50%;
        }
        // 特权详情
        .card-privilege-info {
            display: inline-block;
            vertical-align: top;
            width: 65%;
            height: 100%;
            font-size: $font-small;
            // color: #d5bc98;
            padding-left: 30px;
            .content {
                margin-top: 15%;
                max-width: 100%;
            }
        }
    }
    .right {
        position: relative;
        margin-left: 68%;
        width: 32%;
        height: 100%;
        background-color: #f5f3ef;
        box-sizing: border-box;
        // 有效期选择
        .options-wrap {
            padding: 50px 0 0 10px;
            font-size: $font-small;
            .explain {
                display: inline-block;
            }
            .options {
                display: inline-block;
                margin-left: 60px;
                margin-top: -30px;
                min-width: 80%;
                max-width: 80%;
                .option {
                    width: 80px;
                    height: 30px;
                    outline: none;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    background: rgba(255, 255, 255, 1);
                    color: $text-placeholder;
                    border: 1px solid $text-placeholder;
                }
                .option-active {
                    color: $color-golden-hover;
                    border: 1px solid $color-golden-hover;
                }
            }
        }
        .btn-buy-wrap {
            position: absolute;
            width: 100%;
            bottom: 20px;
            text-align: center;
            font-size: $font-regular;
            .btn-buy {
                width: 120px;
                height: 45px;
                outline: none;
                border: none;
                margin: 0px auto;
                color: $color-white;
                background: rgba(181, 159, 127, 1);
            }
        }
    }
}
</style>

<template>
    <div class="card">
        <div class="left goldCard">
            <div class="card-level">
                <i class="iconfont icon-huangguan"></i>
                <p class="level-name">金卡会员</p>
                <p class="sale-price">￥688.00/年</p>
            </div>
            <div class="card-privilege-info">
                <div class="content">
                    <p>专享所有商品98折；</p>
                    <p>专享全国地区包邮(偏远地区除外)；</p>
                    <p>专享生日当月购物，附赠大礼包；</p>
                    <p>专享所有商品98折；</p>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="options-wrap">
                <div class="explain">有效期&nbsp;:&nbsp;</div>
                <div class="options">
                    <button
                        :class="['option',{'option-active':i==3}]"
                        v-for="i in 6"
                        :key="i"
                    >{{12*i}}月</button>
                </div>
            </div>
            <div class="btn-buy-wrap">
                <button class="btn-buy">立即付费</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cardType: {

            }
        }
    }
}
</script>