/*
* createTime：2019/6/20
* author：fujie.wen
* description: 会员整合弹窗中的表单
*/
<template>
    <div class="cont">
        <!--账号整合内容 begin-->
        <div v-show="currentPage === 'userList'">
            <p class="tip">{{$t('Integrate.sureBeforeTips')}}</p>
            <p class="tip">{{$t('Integrate.sureAfterTips')}}</p>

            <ul class="user-list">
                <li
                    v-for="(item,index) in memberList"
                    class="user-item"
                    :key="item.id"
                >{{item.mobilePhone | phoneMask}}（{{item.vipAccount}}）；</li>
            </ul>

            <div class="flex-hcenter footer-group-btn">
                <div
                    class="com-second-btn"
                    v-if="useParent === 'dialog'"
                    @click="memberMergeOperator(0)"
                >{{$t('Integrate.unconformity')}}</div>
                <div
                    class="com-main-btn"
                    @click="currentPage = 'checkNote'"
                >{{$t('Integrate.makeSure')}}</div>
            </div>
        </div>
        <!--账号整合内容 end-->

        <!--验证身份内容 begin-->
        <div v-show="currentPage === 'checkAccount' || currentPage === 'checkNote'">
            <p class="tip" v-if="activeMemberInfo">
                {{$t('Integrate.inputMember')}}{{activeMemberInfo.mobilePhone | phoneMask}}（{{activeMemberInfo.vipAccount}}）的
                {{currentPage === 'checkAccount' ? this.$t('Integrate.accountPassword') : this.$t('Integrate.compeletePhone')}}
            </p>

            <!--账号密码校验form begin-->
            <el-form
                v-show="currentPage === 'checkAccount'"
                ref="rulesPsdLogin"
                :rules="rulesPsdLogin"
                :model="form"
                label-width="80px"
                label-position="left"
                class="form-list"
            >
                <el-form-item :label="$t('Integrate.account')" prop="phoneOrName" class="form-item">
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

                <el-form-item :label="$t('Integrate.password')" prop="password" class="form-item">
                    <!--请输入登录密码-->
                    <el-input
                        :placeholder="$t('login.writePsw')"
                        @keydown.native.32="m_keydownEvent"
                        :type="pswInputType"
                        v-model="form.password"
                    >
                        <i slot="prefix" class="iconfont icon-mima"></i>
                        <i slot="suffix"
                        @click="changePswState"
                        :class="['iconfont', 'icon-baomi1',{'icon-xianshi':pswInputType == 'text'}]"></i>
                    </el-input>
                    <div
                        class="other-check"
                        @click="currentPage = 'checkNote'"
                    >{{$t('Integrate.verifyWay')}}</div>
                </el-form-item>
            </el-form>
            <!--账号密码校验form end-->

            <!--账号密码校验form begin-->
            <el-form
                v-show="currentPage === 'checkNote'"
                ref="rulesCodeLogin"
                :rules="rulesCodeLogin"
                :model="form"
                class="form-list"
                label-width="80px"
                label-position="left"
            >
                <el-form-item :label="$t('Integrate.phone')" prop="phone" class="form-item">
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

                <el-form-item :label="$t('Integrate.code')" prop="noteCode" class="form-item">
                    <!--请输入短信验证码-->
                    <el-input
                        maxlength="6"
                        @keyup.native="c_limitInputDigit('form.noteCode')"
                        v-model="form.noteCode"
                        :placeholder="$t('login.writeNoteCode')"
                    ></el-input>
                    <!--获取短信验证码-->
                    <div :class="['phone-code',{'countDown':countDownCode>0}]" @click="getNoteCode">
                        {{$t('common.getNoteCode')}}
                        <span
                            v-show="countDownCode>0"
                        >{{countDownCode}}s</span>
                    </div>
                    <div
                        class="other-check"
                        @click="currentPage = 'checkAccount'"
                    >{{$t('Integrate.verifyWay')}}</div>
                </el-form-item>
            </el-form>
            <!--账号密码校验form end-->

            <div class="flex-hcenter footer-group-btn">
                <div
                    class="com-second-btn"
                    @click="memberMergeOperator(1)"
                >{{$t('Integrate.noMyAccount')}}</div>
                <div
                    class="com-main-btn"
                    @click="memberMergeOperator(currentPage === 'checkNote'?2:3)"
                >{{$t('Integrate.sure')}}</div>
            </div>
        </div>
        <!--验证身份内容 end-->
    </div>
</template>

<script>
import { validateAccount } from "@/mixins/validateAccount.js";
import LoginMixins from "./mixins/LoginMixins.vue";
import { UserService } from "@/api/service";
import md5 from "@/utils/md5";

export default {
    components: {},
    mixins: [validateAccount, LoginMixins],
    props: {
        // （必传）父组件类型： 'dialog'（弹窗），'safe'（安全中心）
        useParent: {
            default: "safe",
            type: String
        }
    },
    computed: {
        // 当前操作用户信息
        activeMemberInfo() {
            return this.memberList && this.memberList.length > 0
                ? this.memberList[0]
                : null;
        }
    },
    data() {
        return {
            currentPage: "userList", // 当前页（'userList':用户列表；'checkAccount':校验账户；'checkNote':校验短信；）
            form: {
                phoneOrName: "", //手机或用户名（密码登录）
                phone: "", //手机号（验证码登录）
                password: "", //密码
                noteCode: "" //短息验证码
            },
            countDownCode: 0, // 验证码倒计时
            memberList: [], //会员列表

            rulesPsdLogin: {
                phoneOrName: [
                    {
                        required: true,
                        message: this.$t("login.writeAccount"),
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        validator: this.validatePassword,
                        trigger: "blur"
                    }
                ]
            },
            rulesCodeLogin: {
                phone: [
                    {
                        required: true,
                        validator: this.validatePhone,
                        trigger: "blur"
                    }
                ],
                noteCode: [
                    {
                        required: true,
                        validator: this.validateVerificationCode,
                        trigger: "blur"
                    }
                ]
            },

            pswInputType:'password',//密码可视类型
        };
    },
    methods: {
        //切换密码显示状态
        changePswState(){
            this.pswInputType = this.pswInputType == 'password'?'text':'password';
        },
        // 获取短信验证码
        getNoteCode() {
            if (this.countDownCode > 0) return;
            if (this.form.phone != this.activeMemberInfo.mobilePhone) {
                this.$message.error(this.$t("Integrate.noMatchPhone"));
                return;
            }

            let sendOk = this.m_getNoteCode(
                this.form.phone,
                "VERIFY_VIP_TER"
            ).then(
                res => {
                    // 全等true表示发送成功
                    if (res === true) {
                        if (sendOk) {
                            this.countDownCode = 60;
                            this.countDown = setInterval(() => {
                                if (this.countDownCode <= 0) {
                                    clearInterval(this.countDown);
                                }
                                this.countDownCode--;
                            }, 1000);
                        }
                    }
                },
                err => {}
            );
        },
        // 获取会员列表
        getMemberList() {
            let data = {
                vipInfoHdId: Storage.get("USER_INFO").vipInfoId,
                windowFlag: this.useParent === "dialog" ? 1 : 0 // 1弹窗 0非弹窗
            };
            return UserService.memberMergeList(data).then(res => {
                this.memberList = res && res.length > 0 ? res : [];
                if (!this.memberList || !this.memberList.length) {
                    // 整合完毕或无需整合事件
                }
            });
        },
        // 会员整合操作 （不整合；此账号不是我的；验证码确认；账号密码确认）
        memberMergeOperator(flag) {
            let data = {
                    vipInfoHdId: Storage.get("USER_INFO").vipInfoId,
                    confirmFlag: flag
                },
                ownData = {}, // 各个操作独立参数
                checkState = false; // 表单校验是否通过

            switch (flag) {
                case 0: // 不整合
                    let ids = this.memberList.map(item => item.id);
                    ownData = {
                        ids: ids
                    };
                    break;

                case 1: // 此账号不是我的
                    ownData = {
                        relId: this.activeMemberInfo.id,
                        relVipInfoHdId: this.activeMemberInfo.vipInfoHdId
                    };
                    break;

                case 2: // 验证码确认
                    this.$refs.rulesCodeLogin.validate(valid => {
                        if (valid) {
                            if (
                                this.form.phone == this.activeMemberInfo.mobilePhone
                            ) {
                                checkState = true;
                            } else {
                                this.$message.error(
                                    this.$t("Integrate.noMatchPhone")
                                );
                            }
                        } else {
                            return false;
                        }
                    });
                    if (!checkState) return;
                    ownData = {
                        relId: this.activeMemberInfo.id,
                        relVipInfoHdId: this.activeMemberInfo.vipInfoHdId,
                        account: this.form.phone,
                        verifyClassCode: "VERIFY_VIP_TER",
                        verifyCode: this.form.noteCode
                    };
                    break;

                case 3: // 账号密码确认
                    ownData = {
                        relId: this.activeMemberInfo.id,
                        relVipInfoHdId: this.activeMemberInfo.vipInfoHdId,
                        account: this.form.phoneOrName,
                        verifyCode: md5(this.form.password)
                    };
                    break;
            }
            Object.assign(data, ownData);
            UserService.memberMergeOperator(data).then(
                async res => {
                    if (res != 1) {
                        this.$message.error(this.$t("Integrate.operationFail"));
                        return;
                    }
                    // 确认整合完后操作
                    let successCallback = ()=>{
                        this.$store.dispatch('user/getShoppingCart')
                        // 仅在操作最后一条数据时提示
                        if(this.memberList.length == 1){
                            this.$message.success(this.$t("Integrate.associateSuccess"));
                        }
                    }
                    switch (flag) {
                        case 0: // 不整合
                            break;
                        case 1: // 此账号不是我的
                            if (res === 1) {
                                // 仅在操作最后一条数据时提示
                                if(this.memberList.length == 1){
                                    this.$message.success(this.$t("Integrate.cancelAssociateSuccess"));
                                }
                            }
                            break;
                        case 2: // 验证码确认
                            this.countDownCode = 0;
                            successCallback();
                            break;
                        case 3: // 账号密码确认
                            successCallback();
                            break;
                    }

                    await this.getMemberList();
                    this.$nextTick(() => {

                        if (this.activeMemberInfo) {
                            this.$refs.rulesPsdLogin.clearValidate();
                            this.$refs.rulesCodeLogin.clearValidate();
                            this.form = {
                                phoneOrName: "", //手机或用户名（密码登录）
                                phone: "", //手机号（验证码登录）
                                password: "", //密码
                                noteCode: "" //短息验证码
                            };
                        }
                    });
                },
                err => {
                    this.$message.error(err.errorMsg);
                }
            );
        }
    },
    watch: {
        currentPage: {
            immediate: true,
            handler(value) {
                let title = "";
                switch (value) {
                    case "userList":
                        title = this.$t("Integrate.accountIntegration");
                        break;
                    case "checkAccount":
                        title = this.$t("Integrate.authenticate");
                        this.$refs.rulesPsdLogin.clearValidate();
                        break;
                    case "checkNote":
                        title = this.$t("Integrate.authenticate");
                        this.$refs.rulesCodeLogin.clearValidate();
                        break;
                }
                this.$emit("changePage", { pageCode: value, pageTitle: title });
            }
        },
        memberList: {
            deep: true,
            handler(list) {
                updateRelationAccountLength();

                this.$emit("changeList", list);
            }
        }
    },
    created() {
        this.getMemberList();
        updateRelationAccountLength();
    }
};
</script>

<style scoped lang="scss">
    .icon-baomi1{
        margin-right: 10px;
        display: inline-block;
        cursor: pointer;
    }
.cont {
    padding: 0 20px;
    box-sizing: border-box;
}
.tip {
    line-height: 25px;
    font-size: $font-small;
    color: $text-regular;
}
.user-list {
    padding-top: 20px;
    min-height: 110px;
    .user-item {
        line-height: 25px;
        color: $text-primary;
    }
}

.footer-group-btn {
    padding-top: 20px;
}
.com-second-btn {
    margin-right: 24px;
}
.com-main-btn,
.com-second-btn {
    width: 138px;
}

.form-list {
    min-height: 170px;
    padding-top: 24px;
    width: 390px;
}
.form-item {
    margin-bottom: 35px;
    position: relative;
    .phone-code {
        position: absolute;
        right: 0;
        top: 0;
        height: 40px;
        line-height: 40px;
        width: 100px;
        z-index: 100;
        cursor: pointer;
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
    .other-check {
        position: absolute;
        right: -3px;
        bottom: 0;
        margin-bottom: -33px;
        line-height: 12px;
        font-size: $font-smaller;
        color: $text-blue;
        cursor: pointer;
    }
    &:last-child {
        margin-bottom: 0;
    }
}
</style>
