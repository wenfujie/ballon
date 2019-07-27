/*
* createTime：2019/7/18
* author：en.chen
* description:
*/
<template>
    <div class="error-page">
        <div class="error-detail">
            <div class="error-img img-404"></div>
            <p class="error-tip">抱歉，该商品还未上架</p>
        </div>
        <div class="error-advice">
            <a class="error-advice-btn back-btn" @click="back">上一页(<span class="color-red">{{time}}s</span>)</a>
            <a class="error-advice-btn index-btn" @click="toIndex">回到首页</a>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                time: 5,  //倒计时时间
                timer: null  //倒计时定时器
            }
        },
        methods: {
            navBack() {
                this.timer = window.setInterval(()=>{
                    if(--this.time <=0){
                        window.clearInterval(this.timer)
                        // 定制商品页面跳过来的要回退两页
                        if (this.$route.query.page === 'goods-design') {
                            this.$router.go(-2)
                        } else {
                            this.$router.go(-1)
                        }

                    }
                },1000)
            },
            back() {
                if(this.timer) window.clearInterval(this.timer)
                // 定制商品页面跳过来的要回退两页
                if (this.$route.query.page === 'goods-design') {
                    this.$router.go(-2)
                } else {
                    this.$router.go(-1)
                }
            },
            toIndex () {
                if(this.timer) window.clearInterval(this.timer)
                this.$router.replace('/')
            }
        },
        created() {
        },
        mounted() {
            this.navBack()
        },
        beforeDestroy() {
            if(this.timer) window.clearInterval(this.timer)
        },
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss" scoped>

    .error-page{
        background: $bg-color-regular;
    }

    .error-detail {
        overflow: hidden;
    }

    .error-detail .error-img {
        width: 202px;
        height: 202px;
        margin: 160px auto 28px auto;
        background-size: 100%;
    }

    .error-detail .img-404 {
        background: url("../../assets/images/common/off-shelves.png") no-repeat top center;
    }

    .error-detail .error-tip {
        font-size: 30px;
        line-height: 1;
        text-align: center;
        color: $color-line;
    }

    .error-advice {
        margin-top: 57px;
        text-align: center;
    }

    .error-advice .error-advice-btn {
        box-sizing: border-box;
        display: inline-block;
        width: 168px;
        height: 49px;
        font-size: 16px;
        line-height: 49px;
        text-align: center;
        cursor: pointer;
    }

    .error-advice-btn.back-btn {
        color: $color-line;
        border: solid 1px $color-line;
    }

    .error-advice-btn.index-btn {
        margin-left: 95px;
        color: $color-golden;
        border: solid 1px $color-golden;
    }
</style>

