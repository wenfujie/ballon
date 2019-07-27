/*
* createTime：2019/2/18
* author：fujie.wen
* description: 登录
*/
<template>
    <div class="main">
        <div class="wrapper wrapper-reset">

            <!--图片-->
            <img v-lazy="getImg(bgInfo.coverFileUrl)" class="login-img" alt="">

            <div class="main-content">
                <login-form
                        @generalLoginSuccess="generalLoginSuccess"></login-form>
            </div>

        </div>

    </div>
</template>

<script>
    import { Cms, Vouchers } from '../../api/service';
    import LoginForm from '@/components/login/LoginForm'

    export default {
        components:{LoginForm},
        data() {
            return {
                bgInfo:{},//背景图信息
            }
        },
        methods: {
            // 账号密码、验证码登录成功回调
            generalLoginSuccess(){
                console.log(this.successUrl,"==1=")
//                this.sendCardCoupons()
                let routerUrl = this.successUrl ? decodeURIComponent(this.successUrl) : '/index';
                this.$router.push(routerUrl);
            },
            //  登陆成功发卡发券
            sendCardCoupons(){
                Vouchers.sendCardCoupons({shopId: Storage.get('properties').shopId}).then(res=>{
                })
            },
            // 图片模块
            getLoginMode(){
                let data = {
                    cmsTemplateCode: Storage.get('TEMPLATE_INFO').cmsTemplateCode,
                    cmsWebCode: pageCode.login.name,
                    busContsCode: Storage.get('properties').busContsCode
                }
                Cms.getUsrCmsInfoV2(data).then((res)=> {
                    let moduleData = res.cmsModulepageHdList[0].cmsBackpageDtDtoList;  //正确格式
                    moduleData.forEach(item=>{
                        if(item.cmsBackpageDtCode == 'login'){
                            this.bgInfo = item.cmsBackpageDttList[0];
                        }
                    })
                })
            },
        },
        created() {

            this.successUrl = this.$route.query.successUrl;

            this.getLoginMode();
        }
    }
</script>

<style scoped lang="scss">
    .main{
        height: 600px;
        background: $color-golden;
        margin: 32px 0 75px 0;
        font-size: $font-small;
    }
    .wrapper-reset{
        position: relative;
    }
    .login-img{
        max-width: 500px;
        position: absolute;
        top: 70px;
        right: calc(388px + 180px);
    }
    .main-content{
        width: 388px;
        position: absolute;
        right: 100px;
        top: 70px;
    }
</style>
