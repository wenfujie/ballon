/*
* createTime：2019/1/22
* author：fujie.wen
* description: 定制信息弹窗 （有引用父级：购物车、结算页）
*/
<template>
    <div class="container" @click.stop>

        <div class="goods-detail-cust com-b-shadow">
            <div class="triangle-up"></div>

            <!--主面料-->
            <p class="cust-title main-fabric" v-show="mainFabricName">
                {{$t('cart.mainFabric')}}：{{mainFabricName}}
            </p>

            <!--部件-->
            <ul>
                <li class="flex-between part-item" v-for="(item,index) in partList">
                    <div class="flex-auto">
                        <img class="part-pic fl" v-lazy="getImg(item.fabricPictFileUrl)" alt>
                        <span class="part-name">{{item.regionName+' - '+item.partCode}}</span>
                    </div>
                    <!-- <div class="img-cont" v-if="item.salePrice">￥{{item.salePrice | $goldDivide}}</div> -->
                </li>
            </ul>
            <!--绣字-->
            <ul>
                <li class="font-item" v-for="(item,index) in embList.emb">
                    <!--绣字-->
                    <p class="cust-title" v-show="embList.emb.length">
                        {{$t('common.emb')}}：（{{item.regionName}}）
                    </p>
                    <div class="flex-between">
                        <div class="flex-auto">
                            <!--商品绣字-->
                            <span class="font-label" :title="item.fontsName">{{item.fontsName}}：</span>
                            <span
                                :style="{color: item.colorNumberHx}"
                                :title="item.content"
                                class="font-cont"
                            >{{item.content}}</span>
                        </div>
                        <div class v-if="!!item.embprice">￥{{item.embprice | $goldDivide}}</div>
                    </div>
                </li>
            </ul>
            <!--绣花-->
            <ul>
                <li class="font-item" v-for="(item,index) in embList.embpt">
                    <!--绣花-->
                    <p class="cust-title" v-show="embList.embpt.length">
                        {{$t('common.ept')}}：（{{item.regionName}}）
                    </p>
                    <div class="flex-between flex-vcenter img-cut-top">
                        <div class="flex-auto flex-box">
                            <img class="font-item-img" v-lazy="getImg(item.embFileUrl)" alt>
                        </div>
                        <div
                            class="img-cont"
                            v-if="!!item.embprice"
                        >￥{{item.embprice | $goldDivide}}</div>
                    </div>
                </li>
            </ul>

            <!--印花-->
            <ul>
                <li class="font-item" v-for="(item,index) in embList.print">
                    <!--印花-->
                    <p class="cust-title" v-show="embList.print.length">
                        {{$t('common.print')}}：（{{item.regionName}}）
                    </p>
                    <div class="flex-between flex-vcenter img-cut-top">
                        <div class="flex-auto flex-box">
                            <img class="font-item-img" v-lazy="getImg(item.embPrintPictUrl)" alt>
                        </div>
                        <div
                            class="img-cont"
                            v-if="!!item.prtprice"
                        >￥{{item.prtprice | $goldDivide}}</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
        }
    },
    props: {
        // 部件信息
        partList: {
            type: Array,
            default: []
        },
        // 主面料名称
        mainFabricName: {
            type: String,
            default: ''
        },
        // 父页面 shoppingCart(购物车)  orderSettle(结算页)
        fromPage: {
            type: String,
            default: ''
        }
    },
    computed: {//rtlCartDttPrintDto
        // 定制列表
        embList() {
            let data = {
                emb: [],//绣字
                embpt: [],//绣花
                print: []// 印花
            };
            this.partList.forEach(item => {
                if (this.fromPage === 'shoppingCart') {
                    item.salePrice = item.price;
                    if (item.rtlCartDttEmbDto) {
                        item.rtlCartDttEmbDto.regionName = item.regionName;
                        item.rtlCartDttEmbDto.fontsName = item.rtlCartDttEmbDto.ictEmbFontsHdName;
                        item.rtlCartDttEmbDto.content = item.rtlCartDttEmbDto.embValue;
                        item.rtlCartDttEmbDto.embprice = item.rtlCartDttEmbDto.salePrice;
                        data.emb.push(item.rtlCartDttEmbDto);
                    }
                    if (item.rtlCartDttEmbptDto) {
                        item.rtlCartDttEmbptDto.regionName = item.regionName;
                        item.rtlCartDttEmbptDto.embFileUrl = item.rtlCartDttEmbptDto.fileUrl;
                        item.rtlCartDttEmbptDto.embprice = item.rtlCartDttEmbptDto.salePrice;
                        data.embpt.push(item.rtlCartDttEmbptDto);
                    }
                    if (item.rtlCartDttPrintDto) {
                        item.rtlCartDttPrintDto.regionName = item.regionName;
                        item.rtlCartDttPrintDto.embPrintPictUrl = item.rtlCartDttPrintDto.fileUrl;
                        item.rtlCartDttPrintDto.prtprice = item.rtlCartDttPrintDto.salePrice;
                        data.print.push(item.rtlCartDttPrintDto);
                    }
                } else if (this.fromPage === 'orderSettle') {
                    if (item.emb.length) {
                        item.emb[0].regionName = item.regionName;
                        data.emb.push(item.emb[0]);
                    }
                    if (item.ept.length) {
                        item.ept[0].regionName = item.regionName;
                        data.embpt.push(item.ept[0]);
                    }
                    if (item.prt.length) {
                        item.prt[0].regionName = item.regionName;
                        data.print.push(item.prt[0]);
                    }
                } else {
                    if (!!item.emb && item.emb.length) {    //绣字
                        item.emb[0].regionName = item.regionName;
                        item.emb[0].fontsName = item.emb[0].ictEmbfontsHdName
                        item.emb[0].embprice = item.emb[0].price
                        data.emb.push(item.emb[0]);
                    }
                    if (!!item.embPrint && item.embPrint.length) {    // 绣花
                        item.embPrint[0].regionName = item.regionName;
                        item.embPrint[0].embFileUrl = item.embPrint[0].embPrintPictUrl
                        data.embpt.push(item.embPrint[0]);
                    }
                    if (!!item.prtPrint && item.prtPrint.length) {    // 印花
                        item.prtPrint[0].regionName = item.regionName;
                        data.print.push(item.prtPrint[0]);
                    }
                }

            })

            return data;
        },
    },
    methods: {},
    created() {
    }
}
</script>

<style scoped lang="scss">
.container {
    position: absolute;
    top: 50px;
    left: 0;
    cursor: default;
}
.goods-detail-cust {
    position: absolute;
    text-align: left;
    max-height: 300px;
    overflow: auto;
    background: $color-white;
    width: 358px;
    padding: 25px;
    z-index: 100;
}
.triangle-up {
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
.part-item {
    line-height: 50px;
    margin-bottom: 20px;
    .part-name {
        color: $text-secondary;
    }
}
.part-pic {
    width: 50px;
    height: 50px;
    margin-right: 20px;
}
.font-item {
    margin-bottom: 20px;
}
.font-label {
    color: $text-secondary;
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
}
.font-cont {
    width: 139px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    white-space: nowrap;
    word-break: normal;
}
.font-item-img {
    width: 50px;
    height: 50px;
}
.img-label {
    line-height: 50px;
}
.img-cont {
    color: $text-secondary;
}
.cust-title {
    color: $text-secondary;
}
.img-cut-top {
    margin-top: 10px;
}
.main-fabric {
    margin-bottom: 10px;
}
</style>
