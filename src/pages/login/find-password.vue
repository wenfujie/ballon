/*
* createTime：2019/2/18
* author：fujie.wen
* description: 找回密码
*/
<template>
    <div class="wrapper">
        <div class="main">
            <!--找回密码-->
            <p class="title">{{$t('login.findPsw')}}</p>

            <!--进度条-->
            <ul class="flex-box step-cont">
                <li :class="['flex-box', 'progress-item',{'success':stepCode >= index+1}]" v-for="(item,index) in stepList">
                    <div class="progress-bar"></div>
                    <div :class="['progress-num']">
                        {{item.id}}
                        <p class="step-describe">{{item.text}}</p>
                    </div>
                    <div class="progress-bar"></div>
                </li>
            </ul>

            <el-form ref="rulesFindPsd"
                     :rules="rulesFindPsd"
                     :model="form"
                     label-width="130px"
                     class="list"
                     v-show="stepCode == 1">
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

                <!--图形验证码-->
                <el-form-item :label="$t('login.imgCode')+'：'" prop="identifyCode">
                    <div class="img-code">
                        <!--请输入图形验证码-->
                        <el-input
                                maxlength="4"
                                @keyup.native="c_limitInputDigit('form.identifyCode')"
                                v-model="form.identifyCode"
                                :placeholder="$t('login.writeImgCode')">
                        </el-input>
                        <div class="verification-code">
                            <identify
                                :colorMin="125"
                                :colorMax="125"
                                :lineColorMin="180"
                                :lineColorMax="255"
                                :dotColorMin="255"
                                :dotColorMax="255"
                                :fontSizeMin="34"
                                :contentWidth="100"
                                :identifyCode.sync="identifyCode"
                                      @handleClickPanel="handleClickPanel"
                                      ref="identify"></identify>
                        </div>
                    </div>
                </el-form-item>
            </el-form>

            <!--第一步表单 验证身份-->
            <ul class="center-style" v-show="stepCode == 1">
                <li class="item flex-box">
                    <p class="label"> </p>
                    <!--提交-->
                    <div :class="['register-btn', 'all-width','is-read']"
                    @click="handleEmit">
                        {{$t('common.submit')}}
                    </div>
                </li>
            </ul>

            <el-form ref="rulesSetPsd"
                     :rules="rulesSetPsd"
                     :model="form"
                     label-width="130px"
                     class="list"
                     v-show="stepCode == 2">
                <!--新密码-->
                <el-form-item :label="$t('login.newPsw')+'：'" prop="psw">
                    <!--只能输入数字、字母和符号，且至少两种组合-->
                    <el-input
                            :placeholder="$t('login.pswWriteLimit')"
                            @keydown.native.32="keydownEvent"
                            maxlength="20"
                            :type="pswInputType1"
                            v-model="form.psw">
                        <i slot="suffix"
                           :class="['iconfont', 'icon-baomi1',{'icon-xianshi':pswInputType1 == 'text'}]"
                           @click="changePswState('pswInputType1')"></i>
                    </el-input>
                </el-form-item>

                <!--确认密码-->
                <el-form-item :label="$t('login.surePsw')+'：'" prop="pswSure">
                    <!--只能输入数字、字母和符号，且至少两种组合-->
                    <el-input
                            :placeholder="$t('login.pswWriteLimit')"
                            @keydown.native.32="keydownEvent"
                            maxlength="20"
                            :type="pswInputType2"
                            v-model="form.pswSure">
                        <i slot="suffix"
                           :class="['iconfont', 'icon-baomi1',{'icon-xianshi':pswInputType2 == 'text'}]"
                           @click="changePswState('pswInputType2')"></i>
                    </el-input>
                </el-form-item>
            </el-form>

            <!--第二步表单 设置密码-->
            <ul class="center-style" v-show="stepCode == 2">
                <li class="item flex-box">
                    <p class="label"> </p>
                    <!--提交-->
                    <div :class="['register-btn', 'all-width','is-read']"
                         @click="handleEmit">
                        {{$t('common.submit')}}
                    </div>
                </li>
            </ul>

            <!--第三步表单 完成-->
            <ul class="list" v-show="stepCode == 3">
                <li class="item flex-hcenter">
                    <i class="iconfont icon-chenggong"></i>
                    <span class="success-text">{{$t('login.pswSetSuccess')}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { UserService } from '../../api/service';
    import md5 from '../../utils/md5'
    import Identify from '@/components/Identify'
    import { validateAccount } from '../../mixins/validateAccount.js';

    export default {
        components:{Identify},
        mixins: [validateAccount],
        data() {
            return {
                btnLock: false, // 验证码按钮锁
                countDownCode:0,// 验证码倒计时
                // todo
                stepCode: 1,//进度
                identifyCode: '',//要展示的图形验证码
                form:{
                    phone:'',
                    psw:'',//密码
                    pswSure:'',//确认密码
                    noteCode:'',//短信验证码
                    identifyCode: '',//图形验证码值
                },
                pswInputType1:'password',//密码可视类型
                pswInputType2:'password',//确认密码可视类型

                rulesFindPsd:{
                    phone: [
                        { required: true, validator: this.validatePhone, trigger: 'blur' },
                    ],
                    noteCode: [
                        { required: true, validator: this.validateVerificationCode, trigger: 'blur' },
                    ],
                    identifyCode: [
                        { required: true, validator: this.validateImgCode, trigger: 'blur' },
                    ],
                },

                rulesSetPsd:{
                    psw: [
                        { required: true, validator: this.validatePassword, trigger: 'blur' },
                    ],
                    pswSure: [
                        { required: true, validator: this.checkoutSurePsd, trigger: 'blur' },
                    ],
                },
            }
        },
        computed:{
        },
        methods: {
            //切换密码显示状态
            changePswState(key){
                this[key] = (this[key] == 'password')?'text':'password';
            },
            // 判断手机号是否注册
            checkoutPhoneRegister(callback){
                let data = {
                    usrId: 0,    //  usrId为必填字段，不是实际用户写死为0
                    mobile: this.form.phone,
                    buscontsId: Storage.get('properties').busContsCode
                }
                UserService.checkPhone(data).then((res) => {
                    this.$message.error(this.$t('login.unregisteredPhone'));//该手机号未注册
                }, (err) => {
                    if(err.statusCode == 500){
                        // 用户已注册过错误编码
                        if(err.errorCode == 880201006){
                            typeof callback == 'function' && callback();
                        }else{
                            this.$message.error(err.errorMsg);
                        }
                    }
                })
            },
            // 校验确认密码是否有误
            checkoutSurePsd(rule, s, callback){
                if(this.form.psw != this.form.pswSure){
                    return callback(new Error(this.$t('login.differentPsw')));//两次输入密码不同
                }else{
                    callback();
                }
            },
            //禁止输入空格
            keydownEvent(e){
                e.preventDefault();
                return false;
            },
            // 点击图形验证码
            handleClickPanel(){
                // 刷新验证码
                this.$refs.identify.refreshCode();
            },
            // 提交
            handleEmit(){
                let data = {};
                if(this.stepCode == 1){
                    this.$refs.rulesFindPsd.validate((valid) => {
                        if (valid) {
                            // 校验图形验证码
                            if(this.form.identifyCode != this.identifyCode){
                                this.$message.error(this.$t('login.imgCodeError'));//图形验证码错误
                                return false;
                            }
                            data = {
                                mobilePhone:this.form.phone,
                                registCode:this.form.noteCode,
                                verifyClassCode: 'VERIFY_FIND_PWD',
                                verifyType: 'D_VERIFYLOG',
//                                usrId: 0,
//                                vipInfoHdId: 0,
                                onlyVerify:1};
                            UserService.checkCaptcha(data).then(res=>{
                                if(res == 1){
                                    this.stepCode = 2;
                                }
                            },err=>{
                                this.errorTip(err);
                            })
                        } else {
                            return false;
                        }
                    });

                }else if(this.stepCode == 2){
                    this.$refs.rulesSetPsd.validate((valid) => {
                        if (valid) {
                            data = {
                                mobile: this.form.phone,
                                registerCode: this.form.noteCode,
                                password: md5(this.form.psw),
                            }
                            UserService.retrievePassword(data).then(res=>{
                                if(res == 1){
                                    this.stepCode = 3;
                                    setTimeout(()=>{
                                        this.$router.push('/login');
                                    },2000)
                                }else{
                                    this.$message.error(this.$t('login.findPswFail'));//密码找回失败
                                }
                            },err=>{
                                this.errorTip(err);
                            })
                        } else {
                            return false;
                        }
                    });
                }
            },
            errorTip(err){
                if(err.errorMsg){
                    this.$message.error(err.errorMsg);
                }
            },
            // 获取手机验证码
            getNoteCode(){
//                if(this.countDownCode > 0){
//                    return;
//                }

                if(!!this.btnLock) return
                this.btnLock = true

                if(!isPhone(this.form.phone)){
                    this.btnLock = false
                    this.$message.error(this.$t('login.writeTruePhone'));//请输入正确的手机号
                    return;
                }
                let callback = ()=>{
                    c_showLoading();
                    let data = {
                        mobile: this.form.phone,
                        verifyClassCode: 'VERIFY_FIND_PWD',
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
                            this.$message.error(this.$t('common.messageSendFail'));//短信发送失败
                        }

                    } ,(err)=>{
                        this.btnLock = false
                    }).then(()=>{
                        c_showLoading(false);
                    })
                }
//                callback();
                this.checkoutPhoneRegister(callback);
            },
        },
        created() {
//            验证身份 设置密码 设置成功
            this.stepList = [
                {id:1,text:this.$t('login.authentication')},//验证身份
                {id:2,text:this.$t('login.setPassword')},//设置密码
                {id:3,text:this.$t('login.setSuccess')}//设置成功
            ];
        }
    }
</script>

<style scoped lang="scss">
    .icon-baomi1{
        margin-right: 10px;
        display: inline-block;
        cursor: pointer;
    }
    .icon-chenggong{
        color: #a9c469;
        font-size: 30px;
    }
    .success-text{
        font-size: $font-regular;
        line-height: 42px;
        margin-left: 25px;
    }
    .main{
        margin: 32px 0 70px 0;
        border: 1px solid $color-line;
        height: 550px;
        padding: 30px 40px;
    }
    .title{
        font-size: $font-title1;
    }
    .list{
        width: 470px;
        margin: 0 auto;
        padding: 70px 0 20px 0;
    }
    .center-style{
        margin: 0 auto;
        width: 470px;
    }
    .item{
        margin-bottom: 30px;
        .label{
            color: $text-secondary;
            width: 160px;
            line-height: 40px;
            font-size: $font-common;
        }
    }
    .all-width{
        width: 100%;
    }
    .verification-code{
        position: absolute;
        right: 0;
        top: 0;
        height: 40px;
        line-height: 40px;
        width: 100px;
        z-index: 100;
        cursor: pointer;
    }
    .verification-code-btn{
        font-size: $font-smaller;
        color: $text-white;
        text-align: center;
        width: 240px;
        line-height: 40px;
        margin-left: 15px;
        // border: 1px solid $color-line;
        border-radius: 5px;
        background: $color-golden;
        cursor: pointer;
    }
    .countDown{
        background: $color-line;
    }
    .register-btn{
        text-align: center;
        color: $text-white;
        background: $text-placeholder;
        line-height: 36px;
        cursor: pointer;
        &.is-read{
            background: $color-golden;
        }
    }
    .progress-item{
        position: relative;
        .progress-bar{
            width: 65px;
            background: $color-disabled;
            height: 6px;
        }
        .progress-num{
            width: 30px;
            line-height: 30px;
            border-radius: 50%;
            background: $color-disabled;
            position: absolute;
            left: 50%;
            margin-left: -15px;
            top:50%;
            margin-top: -15px;
            text-align: center;
            color: $text-white;
            font-size: $font-regular;
            .step-describe{
                position: absolute;
                top: 38px;
                left: 0;
                color: $text-secondary;
                white-space: nowrap;
                margin-left: -21px;
            }
        }
        &.success{
            .progress-bar,
            .progress-num{
                background: $color-golden;
                .step-describe{
                    color: $color-golden;
                }
            }
        }
        &:first-child{
            .progress-bar:first-child{
                visibility: hidden;
            }
        }
        &:last-child{
            .progress-bar:last-child{
                visibility: hidden;
            }
        }
    }
    .step-cont{
        margin: 0 auto;
        padding: 40px 0 60px 0;
        width: 395px;
    }
    .img-code{
        width: 100%;
        position: relative;
    }
</style>
