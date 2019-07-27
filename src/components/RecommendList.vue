/*
* createTime：2019/1/21
* author：fujie.wen
* description: 推荐列表 （有引用父级：购物车）
*/
<template>
    <div>
        <table class="com-table" v-if="recommendList && recommendList.length">
            <thead class="com-thead">
                <!--猜你喜欢-->
                <th>{{$t('components.guessLike')}}</th>
            </thead>
            <tbody>
                <div class="main">
                    <!--上一页-->
                    <div class="page-btn prev-page" @click="changePage('prev')"></div>
                    <ul class="flex-box">
                        <li class="list-item"
                            :key="index"
                            @click="handleClickGoodItem(item)"
                            v-for="(item,index) in recommendList">
                            <img v-lazy="getImg(item.fileUrl)" alt="">
                            <span class="list-item-name" :title="item.platformProdName">{{item.platformProdName}}</span>
                            <span class="list-item-price">¥{{item.salePrice | $goldDivide}}</span>
                        </li>
                    </ul>
                    <!--下一页-->
                    <div class="page-btn next-page" @click="changePage('next')"></div>
                </div>
            </tbody>
        </table>
    </div>
</template>

<script>
    import { Goods } from '../api/service'

    export default {
        components:{},
        data() {
            return {
                page:{
                    pageNum: 1,
                    pageSize: 4,
                    pages:1//总页数
                },
                recommendList:[],//推荐列表
            }
        },
        props:{
            findType: {
                default: 'D_LABEL_O4',
                type: String
            }
        },
        methods: {
            // 切换上下页
            changePage(pageType){
                if(pageType === 'prev'){// 上一页
                    if(this.page.pageNum <= 1){
                        return;
                    }else{
                        this.page.pageNum--;
                    }
                }else{// 下一页
                    if(this.page.pageNum >= this.page.pages){
                        return;
                    }else{
                        this.page.pageNum++;
                    }
                }
                this.getGuessLikeList();
            },
            // 点击商品
            handleClickGoodItem(item){
                let url = '';
                if(item.orderFlag == 1){// 定制
                    url = `/goods-design?goodsCode=${item.platformProdCode}&goodsId=${item.ptiPartHdId}`;
                }else{// 大货
                    url = `/goods-detail?goodsCode=${item.platformProdCode}&goodsId=${item.ptiPartHdId}`;
                }
                this.$router.push(url);
            },
            // 猜你喜欢
            getGuessLikeList(){
                let data = {
                    findType: this.findType,
                    buscontsCode: Storage.get('properties').busContsCode,
                    pageNum: this.page.pageNum,
                    pageSize: this.page.pageSize,
                    shopId: Storage.get('properties').shopId,
                }
                c_showLoading();
                Goods.getPutGoods(data).then(res=>{
                    this.recommendList = res.list;
                    this.page.pages = res.pages;
                    this.$nextTick(()=>{
                        c_showLoading(false);
                    })
                })
            },
        },
        created() {
            this.getGuessLikeList();
        }
    }
</script>

<style scoped lang="scss">
    .com-table{
        text-align: left;
        font-size: $font-small;
        margin-top: 30px;
    }
    .com-thead{
        th{
            padding-left: 15px;
            color: $text-primary;
            font-size:$font-regular;
        }
    }
    .main{
        padding: 10px 80px 10px 80px;
        position: relative;
    }
    .list-item{
        width: 245px;
        text-align: center;
        cursor: pointer;
        margin-right: 17px;
        img{
            width: 245px;
            height: 245px;
        }
        .list-item-name{
            color: $text-primary;
            margin: 12px 0;
            display: block;
            line-height: 20px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .list-item-price{
            color: $color-red;
            line-height: 1;
        }
        &:last-child{
            margin-right: 0;
        }
    }
    .page-btn{
        position: absolute;
        top:50%;
        margin-top: -30px;
        width: 34px;
        height: 41px;
        cursor: pointer;
    }
    .prev-page{
        left: 20px;
        background: url("../assets/images/shoppingCart/recommend-prev.png") no-repeat 100%;
    }
    .next-page{
        right: 20px;
        background: url("../assets/images/shoppingCart/recommend-next.png") no-repeat 100%;
    }
    @media screen and (max-width: 1199px) {
        .list-item {
            width: 180px;
            margin-right: 29px;
            img {
                width: 180px;
                height: 180px;
            }
        }
    }
</style>
