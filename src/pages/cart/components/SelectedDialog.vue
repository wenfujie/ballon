/*
* createTime：2019/4/1
* author：fujie.wen
* description: 选中商品弹窗
*/
<template>
    <div class="cont">
        <div class="main" v-show="selectedShopCartList.length">
            <!--<div class="triangle"></div>-->
            <ul class="list">
                <li class="list-item"
                    v-for="(item,index) in selectedShopCartList"
                    :key="index">
                    <img class="list-item__img" :key="item.url" v-lazy="getImg(item.url)" alt="">
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        components:{},
        data() {
            return {
            }
        },
        props:{
            selectedShopCartList:{
                type:Array,
                default:[]
            }
        },
        methods: {},
        created() {
        }
    }
</script>

<style scoped lang="scss">
    .cont,.main{
        width: 100%;
    }
    .main{
        border: 1px solid $color-golden;
        background: $color-white;
        position: relative;
    }
    .list{
        overflow-x: auto;
        width: 100%;
        padding: 12px 30px;
        white-space: nowrap;
        line-height: 1;
        .list-item{
            padding: 0 6px;
            width: 100px;
            height: 100px;
            box-sizing: content-box;
            display: inline-block;
            .list-item__img{
                width: 100%;
                height: 100%;
            }
        }
    }
    .triangle{
        position: absolute;
        left: 72%;
        bottom: -10px;
        filter: drop-shadow(0px 1px 1px $color-golden);
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid $color-white;
    }
    @media screen and (max-width: 1199px) {
        /*控制三角形不同屏幕大小的距离*/
        .triangle{
            left: 66%;
        }
    }
</style>
