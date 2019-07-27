/*
* createTime：2019/3/21
* author：fujie.wen
* description: 登录表单
*/
<template>
    <div>
        <!--表单-->
        <div class="main-cont">
            <div class="form">
                <div class="tab flex-box">
                    <p
                        :class="['nav',{'selected':tabId == item.id}]"
                        :key="item.id"
                        @click="changeTab(item)"
                        v-for="(item,index) in tabList"
                    >{{item.text}}</p>
                </div>

                <el-form
                    v-show="tabId == 1"
                    ref="rulesPsdLogin"
                    :rules="rulesPsdLogin"
                    :model="form"
                    label-width="0px"
                    class="form-list"
                >
                    <el-form-item label prop="phoneOrName" class="form-item">
                        <!--请输入手机号/用户名-->
                        <el-input
                            :placeholder="$t('login.writeAccount')"
                            name="username"
                            clearable
                            v-model="form.phoneOrName"
                        >
                            <i slot="prefix" class="iconfont icon-shouji"></i>
                        </el-input>
                    </el-form-item>

                    <el-form-item label prop="password" class="form-item">
                        <!--请输入登录密码-->
                        <el-input
                            :placeholder="$t('login.writePsw')"
                            @keydown.native.32="m_keydownEvent"
                            :type="pswInputType"
                            name="password"
                            v-model="form.password"
                        >
                            <i slot="prefix" class="iconfont icon-mima"></i>
                            <i slot="suffix"
                               @click="changePswState"
                               :class="['iconfont', 'icon-baomi1',{'icon-xianshi':pswInputType == 'text'}]"></i>
                        </el-input>
                    </el-form-item>

                    <el-form-item label prop="identifyCode" class="form-item">
                        <div class="img-code">
                            <!--请输入图形验证码-->
                            <el-input
                                maxlength="4"
                                @keyup.native="loginWriteCtrl"
                                v-model="form.identifyCode"
                                :placeholder="$t('login.writeImgCode')"
                            ></el-input>
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
                                    ref="identify"
                                ></identify>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>

                <el-form
                    v-show="tabId == 2"
                    ref="rulesCodeLogin"
                    :rules="rulesCodeLogin"
                    :model="form"
                    label-width="0px"
                    class="form-list"
                >
                    <el-form-item label prop="phone" class="form-item">
                        <!--请输入手机号-->
                        <el-input
                            :placeholder="$t('login.writePhone')"
                            clearable
                            maxlength="11"
                            v-model="form.phone"
                        >
                            <i slot="prefix" class="iconfont icon-shouji"></i>
                        </el-input>
                    </el-form-item>

                    <el-form-item label prop="noteCode" class="form-item">
                        <!--请输入短信验证码-->
                        <el-input
                            maxlength="6"
                            @keyup.native="c_limitInputDigit('form.noteCode')"
                            v-model="form.noteCode"
                            :placeholder="$t('login.writeNoteCode')"
                        ></el-input>
                        <!--获取短信验证码-->
                        <div class="phone-code" :class="{'countDown':countDownCode>0}" @click="getNoteCode">
                            {{$t('common.getNoteCode')}}
                            <span v-show="countDownCode>0">{{countDownCode}}s</span>
                        </div>
                    </el-form-item>
                </el-form>

                <div class="form-operator">
                    <!--登录-->
                    <div class="login-btn" @click="handleLogin">{{$t('login.login')}}</div>
                    <div class="about-password flex-between">
                        <div class="remenber-password">
                            <!--记住密码-->
                            <el-checkbox v-model="remenberPSW" v-show="tabId == 1">{{$t('login.remenberPsw')}}</el-checkbox>
                        </div>
                        <div class="forget-password flex-box">
                            <!--忘记密码-->
                            <div class="href-link" @click="toPage('/find-password')">{{$t('login.forgetPsw')}}</div>
                            <!--免费注册-->
                            <div class="href-link" @click="toPage('/register')">{{$t('login.freeRegister')}}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!--第三方登录-->
            <ul class="third-party flex-end" v-if="thirdLoginList.length">
                <li
                    class="third-party-item"
                    @click="handleThirdLogin(item)"
                    v-for="(item,index) in thirdLoginList"
                >
                    <!--icon-weixin icon-zhifubao icon-QQ-->
                    <i
                        :class="['iconfont',
                        {'icon-weixin':item.signupTypeCode=='D_WECHAT',
                        'icon-zhifubao':item.signupTypeCode=='D_ALI',
                        'icon-QQ':item.signupTypeCode=='D_QQ'}]"
                    ></i>
                </li>
            </ul>
        </div>
        <!--<member-merge-dialog ref="mergeDialog"-->
                             <!--v-on="$listeners"-->
                             <!--@close="closeCallback"-->
                             <!--v-if="parent === 'loginPage'"-->
                             <!--@changeList="m_changeList"></member-merge-dialog>-->
    </div>
</template>

<script>
import { UserService, Base, ThirdParty, Login, Vouchers } from '../../api/service';
import md5 from '../../utils/md5'
import Base64 from '../../utils/base64'
import Identify from '@/components/Identify'
import { validateAccount } from '@/mixins/validateAccount.js';
import LoginMixins from './mixins/LoginMixins.vue';
import MemberMergeDialog from './MemberMergeDialog'

export default {
    components: { Identify, MemberMergeDialog },
    mixins: [validateAccount, LoginMixins],
    props:{
        // 父级组件 loginDialog（登录弹窗） loginPage（登录页）
        parent:{
            type: String,
            default: 'loginPage'
        }
    },
    data() {
        return {
            btnLock: false,  // 验证码按钮锁
            form: {
                phoneOrName: '',//手机或用户名（密码登录）
                phone: '',//手机号（验证码登录）
                password: '',//密码
                identifyCode: '',//图形验证码值

                noteCode: '',//短息验证码
            },
            countDownCode: 0,// 验证码倒计时
            identifyCode: '',//要展示的图形验证码
            tabId: '1',//默认选中导航id
            remenberPSW: false,//是否记住密码
            thirdLoginList: [],//第三方登录方式列表
            pswInputType:'password',//密码可视类型


            rulesPsdLogin: {
                phoneOrName: [
                    { required: true, message: this.$t('login.writeAccount'), trigger: 'blur' }
                ],
                password: [
                    { required: true, validator: this.validatePassword, trigger: 'blur' },
                ],
                identifyCode: [
                    { required: true, validator: this.validateImgCode, trigger: 'blur' },
                ],
            },
            rulesCodeLogin: {
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
        // 会员整合弹窗关闭事件
//        closeCallback(){
//            this.$emit('generalLoginSuccess');
//        },
        // 判断手机号是否注册
//        checkoutPhoneRegister(callback){
//            let data = {
//                usrId: 0,    //  usrId为必填字段，不是实际用户写死为0
//                mobile: this.form.phone,
//                buscontsId: Storage.get('properties').busContsCode
//            }
//            c_showLoading();
//            UserService.checkPhone(data).then((res) => {
//                c_showLoading(false);
//                this.$message.error(this.$t('login.unregisteredPhone'));
//            }, (err) => {
//                if(err.statusCode == 500){
//                    // 用户已注册过错误编码
//                    if(err.errorCode == 880201006){
//                        typeof callback == 'function' && callback();
//                    }else{
//                        this.$message.error(err.errorMsg);
//                    }
//                }
//                c_showLoading(false);
//            })
//        },
        //切换密码显示状态
        changePswState(){
            this.pswInputType = this.pswInputType == 'password'?'text':'password';
        },
        loginWriteCtrl(e) {
            // 回车
            if (e.keyCode == 13) {
                this.handleLogin();
                return;
            }
            this.c_limitInputDigit('form.identifyCode');
        },
        changeTab(item) {
            if (this.tabId == item.id) return;
            this.tabId = item.id;
            if (item.id == 1) {
                this.form.identifyCode = '';
                this.handleClickPanel();
            }
        },

        // 点击图形验证码
        handleClickPanel() {
            // 刷新验证码
            this.$refs.identify.refreshCode();
        },
        // 第三方登录 获取二维码
        handleThirdLogin(item) {
            let data = {};
            // todo redirectUri待修改 支付宝、微信、qq统一用登录页做后续联合登录（统一使用以下这个路径）
            //                let redirectUri = 'https://wxxcx.qishon.com/wfj/login';
            let redirectUri = window.location.origin + '/login';
            if (item.signupTypeCode == 'D_WECHAT') {// 微信
                data = {
                    redirectUri: redirectUri,
                    scope: 'snsapi_login',
                    signupHdId: item.id,
                    signupTypeCode: item.signupTypeCode,
                    state: item.id + ',' + item.signupTypeCode
                }
            }

            if (item.signupTypeCode == 'D_ALI') {// 支付宝
                data = {
                    redirectUri: redirectUri,
                    scope: 'auth_user',
                    signupHdId: item.id,
                    signupTypeCode: item.signupTypeCode,
                    state: item.id + ',' + item.signupTypeCode
                }
            }

            if (item.signupTypeCode == 'D_QQ') {// qq
                // todo redirectUri 待修改  提交的时候删掉
                // qq只能跳配置好的域名，不能加后缀（支付宝、微信可加后缀）
                //                    redirectUri = 'https://wxxcx.qishon.com/wfj';
                data = {
                    redirectUri: redirectUri,
                    signupHdId: item.id,
                    signupTypeCode: item.signupTypeCode,
                    state: item.id + ',' + item.signupTypeCode + ',' + redirectUri
                }
            }
            ThirdParty.getThirdLogin(data).then(res => {
                // 第三方登录 监听窗口聚焦显示事件，若有切换用户重新加载页面
                this._usrId = Storage.get('USER_INFO') ? Storage.get('USER_INFO').usrId : '';
                document.addEventListener("visibilitychange", () => {
                    if (document.visibilityState === 'visible') {
                        this._usrId2 = Storage.get('USER_INFO') ? Storage.get('USER_INFO').usrId : '';
                        console.log(this._usrId, "====", this._usrId2)
                        if (this._usrId != this._usrId2) {
                            window.location.reload();
                        }
                    }
                });
                // 新窗口打开第三方登录页面
                window.open(res);
            })
        },
        //  第三方登陆步骤2，获取用户信息
        getUserInfo() {
            let url = window.location.search.substr(1) || window.location.hash.split('?')[1]
            if (url) {
                let stateStr = getQueryVariable(url, 'state');
                if (stateStr) {
                    // url上参数state由登录id和登录code组成如： 5,D_WECHAR
                    this.state = stateStr.split(',');
                    switch (this.state[1]) {
                        case 'D_WECHAT':
                            this.getWxUserInfo(url);
                            break;
                        case 'D_ALI':
                            this.getAliUserInfo(url);
                            break;
                        case 'D_QQ':
                            this.getQQUserInfo(url);
                            break;
                    }
                }

            }
        },
        // 获取微信用户信息
        getWxUserInfo(url) {
            let code = getQueryVariable(url, 'code')
            if (!code) return;

            let data = {
                code: code,
                signupHdId: this.state[0],
                lang: 'zh_CN'
            }
            Login.wechatInfoPc(data).then((res) => {
                this.userLogin(res)
            }, (err) => {
            })
        },
        // 获取支付宝用户信息
        getAliUserInfo(url) {
            let code = getQueryVariable(url, 'auth_code')
            if (!code) return;

            let data = {
                code: code,
                signupHdId: this.state[0],
            }
            Login.getAliUserInfo(data).then((res) => {
                let params = {
                    unionid: null,
                    openid: res.userId,
                    nickname: res.nickName,
                    headimgurl: res.avatar,
                    sex: res.gender == 'm' ? 1 : 2,
                }
                this.userLogin(params)
            }, (err) => {
            })
        },
        // 获取qq用户信息
        getQQUserInfo(url) {
            let code = getQueryVariable(url, 'code')
            if (!code) return;

            let data = {
                code: code,
                scope: 'get_user_info',
                signupHdId: this.state[0],
                redirectUri: decodeURIComponent(this.state[2])
            }
            Login.getQQUserInfo(data).then((res) => {
                let params = {
                    unionid: null,
                    openid: res.openId,
                    nickname: res.nickname,
                    headimgurl: res.figureurl_qq,
                    sex: res.gender == '男' ? 1 : 2,
                }
                this.userLogin(params)
            }, (err) => {
            })
        },
        //  联合登陆
        async userLogin(WechatInfo) {
            let userSex = ((WechatInfo.sex == 1) ? 'D_MALE' : 'D_FEMALE');
            let loginData = {
                busContsCode: Storage.get('properties').busContsCode,
                unionId: WechatInfo.unionid,
                openId: WechatInfo.openid,
                signUpTypeCode: this.state[1],
                usrName: WechatInfo.nickname,
                url: WechatInfo.headimgurl,
                sex: userSex,
                shopId: Storage.get('properties').shopId
            }
            Login.userInfo(loginData).then(async (res) => {
                if (res.usrId) {
                    // 获取用户信息 若没有会员卡号cardNo 则需调接口判断是否满足会员规则
                    let userInfo = await this.getUserDetailInfo(res.usrId);
                    if (!userInfo.cardNo) {
                        await this.m_sendCardCoupons(res.usrId);
                    }
                    // 已绑定手机 => 登录成功
                    if (userInfo.mobilePhone) {
                        Storage.set('USER_INFO', res, this.userExpire)//一小时失效
                        this.$store.dispatch('user/getUserInfo')
                        this.$store.dispatch('user/getShoppingCart')
                        this.$router.push('/index');
                    } else {
                        // todo 未绑定手机流程（绑定手机流程页 需添加更新用户信息逻辑）
                        //                            this.$router.push("/alter-phone?successUrl=/index");
                    }
                    // 判断该账号是否有用户密码-------该流程废弃
                    //                        Base.getVipHasPsw({usrId:res.usrId}).then(response=>{
                    //                            if(response == 1){// 用户有密码（已绑定账号）
                    //                                Storage.set('USER_INFO', res, this.userExpire)//一小时失效
                    //                                this.$store.dispatch('user/getUserInfo')
                    //                                this.$store.dispatch('user/getShoppingCart')
                    //                                this.$router.push('/index');
                    //                            }else{// 用户无密码（未绑定账号）
                    //                                this.$router.push('/register?usrId=' + res.usrId);
                    //                            }
                    //                        })
                }
            })
        },
        // 获取用户信息
        getUserDetailInfo(usrId) {
            return UserService.getUserInfo({ "usrId": usrId, }).then(res => {
                return res;
            })
        },
        // 页面跳转
        toPage(url) {
            this.$router.push(url);
        },
        // 登录
        handleLogin() {

            if (this.tabId == 1) {
                this.$refs.rulesPsdLogin.validate((valid) => {
                    if (valid) {
                        if (this.form.identifyCode != this.identifyCode) {
                            this.$message.error(this.$t('login.imgCodeError'));
                            return false;
                        }
                        // 账号密码登录
                        this.m_passwordLogin(this.form.phoneOrName,this.form.password).then(res=>{
                            if(res.statusCode == 200){
                                this.successCallback(res.data);
                            }
                        })
                    } else {
                        return false;
                    }
                });
            } else {
                this.$refs.rulesCodeLogin.validate((valid) => {
                    if (valid) {
                        this.noteCodeLogin();
                    } else {
                        return false;
                    }
                });
            }
        },
        // 验证码登录
        noteCodeLogin() {
            let data = {
                mobile: this.form.phone,
                registerCode: this.form.noteCode,
            }
            UserService.vipCodeLogin(data).then(res => {
                this.successCallback(res);
            }, err => {
                this.errorTip(err);
            })
        },
        errorTip(err) {
            if (err.errorMsg) {
                this.$message.error(err.errorMsg);
            }
        },
        // 账号密码，验证码登录成功回调
        async successCallback(res) {
            if (res.usrId) {// 登录成功
                if (!res.cardNo) {
                    await this.m_sendCardCoupons(res.usrId,res.vipInfoId);
                }
                Storage.set('USER_INFO', {
                    usrId: res.usrId,
                    shopId: Storage.get('properties').shopId,
                    shopCode: Storage.get('properties').shopCode,
                    vipInfoId: res.vipInfoId
                },this.userExpire)
                if (this.tabId == 1) {//账号密码登录
                    Storage.set('LOGIN_FORM', {
                        phoneOrName: this.form.phoneOrName,
                        // base64加密
                        password: this.remenberPSW ? this.base.encode(this.form.password) : '',
                        remenberPsw: this.remenberPSW,
                    })
                }
                this.$store.dispatch('user/getUserInfo')
                this.$store.dispatch('user/getShoppingCart')
                // 一般登录成功 onlyClose(控制弹窗关闭，不执行登录后逻辑)

                // 登录页中 本组件才有会员整合弹窗
                if(this.parent === 'loginPage'){
//                    this.$refs.mergeDialog.dialogVisibleState();
                    this.$emit('generalLoginSuccess');
                    setTimeout(()=>{
                        // todo 设置app.vue中的会员整合弹窗显示
                        this.$nextTick(()=>{
                            this.$store.commit('user/setData', { storeKey: 'mergeDialogFlag', storeValue: true });
                        })
                    },1000)
                }else{
                    // 登录弹窗才抛该事件
                    this.$emit('generalLoginSuccess','onlyClose');
                }
            }
        },
        // 获取手机验证码
        getNoteCode() {
            if(!!this.btnLock) return
            this.btnLock = true
//            if (this.countDownCode > 0) {
//                return;
//            }
            if(!isPhone(this.form.phone)){
                this.$message.error(this.$t('login.writeTruePhone'));
                this.btnLock = false
                return;
            }

            this.m_getNoteCode(
                this.form.phone,
                "VERIFY_LOGON",
                "btnLock"
            ).then(res => {
                // 全等true表示发送成功
                if (res === true) {
                    this.countDownCode = 60;
                    this.countDown = setInterval(() => {
                        if (this.countDownCode <= 0) {
                            clearInterval(this.countDown);
                        }
                        this.countDownCode--;
                    }, 1000);
                }else{
                    this.btnLock = false
                    this.$message.error(this.$t('common.messageSendFail'));
                }
            },(err)=>{
                this.btnLock = false
                this.$message.error(this.$t('common.messageSendFail'));
            });

        },
        // 获取第三方登录列表
        getThirdLoginList() {
            let data = {
                enableFlag: 1,
                busContsCode: Storage.get('properties').busContsCode
            }
            Base.getThirdLoginList(data).then(res => {
                this.thirdLoginList = res;
            })
        },
    },
    created() {
        // 初始化base64
        this.base = new Base64();
        // 用户信息失效时间
        this.userExpire = 3600;

        this.tabList = [
            { id: 1, text: this.$t('login.pswLogin') },//密码登录
            { id: 2, text: this.$t('login.codeLogin') }//验证码登录
        ];
        let login_form = Storage.get('LOGIN_FORM');
        if (login_form) {
            if (login_form.phoneOrName) {
                this.form.phoneOrName = login_form.phoneOrName;
            }
            if (login_form.password) {
                this.form.password = this.base.decode(login_form.password);
            }
            if (login_form.remenberPsw) {
                this.remenberPSW = true;
            }
        }

        // todo 隐藏第三方登录入口（待用户整合后开启）
        //            this.getThirdLoginList();
        this.getUserInfo();
    },
    mounted(){
    },
    watch: {
        countDownCode(num) {
            if(num === 0){
                this.btnLock = false;
            }
        }
    }
}
</script>

<style scoped lang="scss">
    .icon-baomi1{
        margin-right: 10px;
        display: inline-block;
        cursor: pointer;
    }
.icon-mima,
.icon-shouji {
    display: inline-block;
}
.form {
    background: $color-white;
    padding: 20px 44px 33px 44px;
}
.tab {
    .nav {
        width: calc(50% - 1px);
        text-align: center;
        color: $text-secondary;
        font-size: $font-regular;
        cursor: pointer;
        font-weight: bold;
        &.selected {
            color: $text-primary;
        }
        &:first-child {
            border-right: 1px solid $color-line;
        }
    }
}
.form-list {
    margin: 35px 0;
}
.form-item {
    margin-bottom: 35px;
    position: relative;
    .phone-code,
    .verification-code {
        position: absolute;
        right: 0;
        top: 0;
        height: 40px;
        line-height: 40px;
        width: 100px;
        z-index: 100;
        cursor: pointer;
    }
    .verification-code {
    }
    .phone-code {
        background: $color-golden;
        text-align: center;
        color: $text-white;
        width: 130px;
    }
    .countDown{
        background: $color-line;
    }
    &:last-child {
        margin-bottom: 0;
    }
}
.login-btn {
    color: $text-white;
    background: $color-golden;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
    margin-bottom: 5px;
}
.forget-password {
    .href-link {
        color: $text-secondary;
        padding: 0 5px;
        cursor: pointer;
        &:first-child {
            border-right: 1px solid $color-line;
        }
    }
}
.third-party {
    padding: 14px 44px;
    background: $bg-color-regular;
    .third-party-item {
        margin-left: 26px;
        i {
            color: $text-placeholder;
            font-size: $font-h2;
            cursor: pointer;
        }
    }
}
.img-code {
    width: 100%;
    position: relative;
}
</style>
