/*
* createTime：2019/2/18
* author：fujie.wen
* description: 注册
*/
<template>
    <div class="wrapper">
        <el-form ref="rulesRegister" :rules="rulesRegister" :model="form" label-width="130px" class="list">
            <!--设置用户名-->
            <el-form-item :label="$t('login.setUserName')+'：'" prop="name">
                <!--请输入用户名-->
                <el-input
                        clearable
                        :placeholder="$t('login.writeUserName')"
                        v-model.trim="form.name">
                </el-input>
            </el-form-item>

            <!--设置登录密码-->
            <el-form-item :label="$t('login.setPsw')+'：'" prop="psw">
                <!--只能输入数字、字母和符号，且至少两种组合-->
                <el-input
                        autocomplete="off"
                        :placeholder="$t('login.pswWriteLimit')"
                        :type="pswInputType1"
                        @keydown.native.32="keydownEvent"
                        maxlength="20"
                        v-model="form.psw">
                    <i slot="suffix"
                       :class="['iconfont', 'icon-baomi1',{'icon-xianshi':pswInputType1 == 'text'}]"
                       @click="changePswState('pswInputType1')"></i>
                </el-input>
            </el-form-item>

            <!--确认登录密码-->
            <el-form-item :label="$t('login.sureLoginPsw')+'：'" prop="pswSure">
                <!--只能输入数字、字母和符号，且至少两种组合-->
                <el-input
                        autocomplete="off"
                        :placeholder="$t('login.pswWriteLimit')"
                        :type="pswInputType2"
                        @keydown.native.32="keydownEvent"
                        maxlength="20"
                        v-model="form.pswSure">
                    <i slot="suffix"
                       :class="['iconfont', 'icon-baomi1',{'icon-xianshi':pswInputType2 == 'text'}]"
                       @click="changePswState('pswInputType2')"></i>
                </el-input>
            </el-form-item>

            <!--手机号-->
            <el-form-item :label="$t('login.phoneNumber')+'：'" prop="phone">
                <!--请输入手机号-->
                <el-input
                        maxlength="11"
                        @keyup.native="c_limitInputDigit('form.phone')"
                        :placeholder="$t('login.writePhone')"
                        v-model="form.phone">
                </el-input>
            </el-form-item>

            <!--验证码-->
            <el-form-item :label="$t('login.noteCode')+'：'" prop="noteCode">
                <div class="flex-box all-width">
                    <!--请输入短信验证码-->
                    <el-input
                            class="verifict-input"
                            maxlength="6"
                            @keyup.native="c_limitInputDigit('form.noteCode')"
                            v-model="form.noteCode"
                            :placeholder="$t('login.writeNoteCode')">
                    </el-input>
                    <!--获取短信验证码-->
                    <div :class="['verification-code-btn',{'countDown':countDownCode>0}]" @click="getNoteCode">
                        {{$t('common.getNoteCode')}}
                        <span v-show="countDownCode>0">{{countDownCode}}s</span>
                    </div>
                </div>

            </el-form-item>
        </el-form>

        <ul class="list">
            <li class="item flex-box">
                <p class="label"> </p>
                <div class="register-operator all-width">
                    <!--我已阅读并同意-->
                    <el-checkbox v-model="checkBox">{{$t('login.readConsent')}}</el-checkbox>
                    <!--启尚商城用户注册条款-->
                    <span class="clause" @click="zcxyDialogVisible = true">《{{$t('login.RegistrationTerms')}}》</span>
                </div>
            </li>
            <li class="item flex-box">
                <p class="label"> </p>
                <!--完善资料 注册-->
                <div :class="['register-btn', 'all-width',{'is-read':checkBox}]"
                @click="handleRegister">
                    {{usrId?$t('login.FillInTheComplete'):$t('login.register')}}
                    <!--已有账号，前往登录-->
                    <span class="login-link" @click.stop="$router.push('/login')">{{$t('login.toLogin')}}</span>
                </div>
            </li>
        </ul>


        <el-dialog
                :title="article.title"
                :visible.sync="zcxyDialogVisible"
                width="50%"
                center>
            <div class="salon-content" v-html="article.content"></div>
            <span slot="footer" class="dialog-footer">
                <!--同意条款-->
                <el-button type="primary" @click="clickDialogBtn">{{$t('login.endorse')}}</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import { UserService,Base,Salon } from '../../api/service';
    import md5 from '../../utils/md5';
    import { validateAccount } from '../../mixins/validateAccount.js';
    import LoginMixins from '@/components/login/mixins/LoginMixins.vue';

    export default {
        components:{},
        mixins: [validateAccount, LoginMixins],
        data() {
            return {
                btnLock: false,  // 验证码按钮锁
                zcxyDialogVisible: false,//注册协议弹窗显示
                checkBox: true,//是否阅读协议
                countDownCode:0,// 验证码倒计时
                pswInputType1:'password',//密码可视类型
                pswInputType2:'password',//确认密码可视类型
                form:{
                    name:'',//用户名
                    psw:'',//密码
                    pswSure:'',//确认密码
                    phone:'',//手机
                    noteCode:'',//验证码
                },
                article:{},//注册协议信息
                usrId:"",// 接受url上的usrId

                rulesRegister:{
                    name: [
                        { required: true, validator: this.validateAccount, trigger: 'blur' }
                    ],
                    psw: [
                        { required: true, validator: this.validatePassword, trigger: 'blur' },
                    ],
                    pswSure: [
                        { required: true, validator: this.checkoutSurePsd, trigger: 'blur' },
                    ],
                    phone: [
                        { required: true, validator: this.validatePhone, trigger: 'blur' },
                    ],
                    noteCode: [
                        { required: true, validator: this.validateVerificationCode, trigger: 'blur' },
                    ],
                },
            }
        },

        methods: {
            // 校验确认密码是否有误
            checkoutSurePsd(rule, s, callback){
                if(this.form.psw != this.form.pswSure){
                    return callback(new Error(this.$t('login.differentPsw')));//两次输入密码不同
                }else{
                    callback();
                }
            },
            // 点击注册协议同意按钮
            clickDialogBtn(){
                this.checkBox = true;
                this.zcxyDialogVisible = false;
            },
            //禁止输入空格
            keydownEvent(e){
                e.preventDefault();
                return false;
            },

            //切换密码显示状态
            changePswState(key){
                this[key] = (this[key] == 'password')?'text':'password';
            },
            // 点击注册
            handleRegister(){
                if(!this.checkBox)return;
                this.$refs.rulesRegister.validate((valid) => {
                    if (valid) {
                        if(this.usrId){// 第三方登录绑定账号页
                            let data = {
                                mobilePhone:this.form.phone,
                                registCode:this.form.noteCode,
                                verifyClassCode: 'VERIFY_BIND_MOBILE',
                                onlyVerify:1
                            };
                            UserService.checkCaptcha(data).then(res=>{
                                this.bindEvent();
                            },err=>{
                                if(err.errorMsg){
                                    this.$message.error(err.errorMsg);
                                }
                            })
                        }else{// 注册页
                            this.registerEvent();
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 注册接口
            registerEvent(){
                let data = {
                    loginName: this.form.name,
                    password: md5(this.form.psw),
                    mobile: this.form.phone,
                    registerCode: this.form.noteCode,
                    busContsCode: Storage.get('properties').busContsCode,
                }
                UserService.vipRegister(data).then(res=>{
                    if(res == 1){
                        this.$message.success(this.$t('login.registerSuccess'));//注册成功
                        setTimeout(()=>{
                            this.accountLogin();
                        },2000)
                    }
                },err=>{
                    if(err.errorMsg){
                        this.$message.error(err.errorMsg);
                    }
                })
            },
            // 账号密码登录
            accountLogin(){
                this.m_passwordLogin(this.form.phone,this.form.psw).then(async (res)=>{
                    if(res.statusCode == 200){
                        let data = res.data;
                        if (data.usrId) {// 登录成功
                            if (!data.cardNo) {
                                await this.m_sendCardCoupons(data.usrId, data.vipInfoId);
                            }
                            Storage.set('USER_INFO', {
                                usrId: data.usrId,
                                shopId: Storage.get('properties').shopId,
                                shopCode: Storage.get('properties').shopCode,
                                vipInfoId: data.vipInfoId
                            },this.userExpire)
                            this.$store.dispatch('user/getUserInfo');
                            this.$store.dispatch('user/getShoppingCart');
                            this.$router.push('/index');
                        }
                    }
                })
            },
            // 绑定账号接口
            bindEvent(){
                let data = {
                    usrId: this.usrId,
                    usrLoginName: this.form.name,
                    pwd: md5(this.form.psw),
                    usrMobile: this.form.phone,
                }
                Base.updateUserInfo(data).then(res=>{
                    if(res == 1){
                        this.$message.success(this.$t('login.submitInfoSuccess'));//信息提交成功
                        // todo 此处设置用户信息无vipInfoId，有问题待处理
                        Storage.set('USER_INFO',{
                            usrId: this.usrId,
                            shopId: Storage.get('properties').shopId,
                            shopCode: Storage.get('properties').shopCode,
                        },this.userExpire)
                        this.$store.dispatch('user/getUserInfo')
                        this.$store.dispatch('user/getShoppingCart')
                        setTimeout(()=>{
                            this.$router.push(this.successUrl?this.successUrl:'/index');
                        },3000)
                    }
                },err=>{
                    if(err.errorMsg){
                        this.$message.error(err.errorMsg);
                    }
                })
            },
            // 获取手机验证码
            getNoteCode(){

                if(!!this.btnLock) return
                this.btnLock = true

//                if(this.countDownCode > 0){
//                    return;
//                }

                if(!isPhone(this.form.phone)){
                    this.$message.error(this.$t('login.writeTruePhone'));//请输入正确的手机号
                    this.btnLock = false
                    return;
                }

                let callback = ()=>{
                    c_showLoading();
                    let data = {
                        mobile: this.form.phone,
                        verifyClassCode: 'VERIFY_BIND_MOBILE',
//                        usrId: 0    //  usrId为必填字段，不是实际用户写死为0
                    }
                    UserService.getCaptcha(data).then((res)=>{
                        if(res == '03' || res == 'OK'){
                            this.countDownCode = 60;
                            this.countDown = setInterval(()=>{
                                if(this.countDownCode <= 0){
                                    this.btnLock = false
                                    clearInterval(this.countDown);
                                }
                                this.countDownCode--;
                            },1000)
                        }else{
                            this.btnLock = false
                            this.$message.error('短信发送失败');//短信发送失败
                        }

                    } ,(err)=>{
                        this.btnLock = false
                    }).then(()=>{
                        c_showLoading(false);
                    })
                }

                this.checkoutPhoneRegister(callback);

            },
            // 判断手机号是否注册
            checkoutPhoneRegister(callback){
                let data = {
                    usrId: 0,    //  usrId为必填字段，不是实际用户写死为0
                    mobile: this.form.phone,
                    buscontsId: Storage.get('properties').busContsCode
                }
                UserService.checkPhone(data).then((res) => {
                    typeof callback == 'function' && callback();
                }, (err) => {
                    if(err.statusCode == 500){
                        this.btnLock = false
                        this.$message.error(err.errorMsg);
                    }
                })
            },
            //  获取文章列表
            getArticleList () {
                let data = {
                    effFlag: 1,
                    seqType: 1,
                    articleCatCode:'zcxy'// 分类编码
                }
                Salon.getList(data).then((res) =>{
                    if(res.length){
                        let item = res[0];
                        this.article = item;
                        let pageInfo = item.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (img, src) {
                            let index = src.indexOf('=') + 1
                            let imgData = getImg(src.substring(index, img.length))
                            return '<img src="' + imgData + '" style="width: 100%; display: block; margin: 0;">'
                        })
                        this.article.content = pageInfo;
                    }
                })
            },
        },
        created() {

            // 用户信息失效时间
            this.userExpire = 3600;
            // 存在usrId表示当前为’第三方登录绑定账号页‘
            this.usrId = this.$route.query.usrId;
            // 存在successUrl表示’第三方登录绑定账号页‘绑定成功后要跳转路径
            this.successUrl = decodeURIComponent(this.$route.query.successUrl || '');
            this.getArticleList();
        }
    }
</script>

<style scoped lang="scss">
    .icon-baomi1{
        margin-right: 10px;
        display: inline-block;
        cursor: pointer;
    }

    .wrapper{
        font-size: $font-small;
        padding: 70px 0;
    }
    .list{
        width: 470px;
        margin: 0 auto;
    }
    .item{
        margin-bottom: 30px;
    }
    .label{
        color: $text-secondary;
        width: 160px;
        line-height: 40px;
        font-size: $font-common;
    }
    .all-width{
        width: 100%;
    }
    .verification-code-btn{
        font-size: $font-smaller;
        color: $text-white;
        text-align: center;
        width: 200px;
        line-height: 40px;
        margin-left: 15px;
        // border: 1px solid $color-golden;
        border-radius: 5px;
        background: $color-golden;
        cursor: pointer;
    }
    .countDown{
        background: $color-line;
    }
    .register-operator{
        .clause{
            color: $color-golden;
            cursor: pointer;
        }
    }
    .register-btn{
        text-align: center;
        color: $text-white;
        background: $text-placeholder;
        line-height: 36px;
        cursor: pointer;
        position: relative;
        .login-link{
            color: $color-golden;
            position: absolute;
            right: 0;
            top: 35px;
            cursor: pointer;
        }
        &.is-read{
            background: $color-golden;
        }
    }
    .verifict-input{
        width: 180px;
    }
</style>
