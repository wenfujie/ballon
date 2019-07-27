<!--
 * @Author: lan.chen
 * @Date: 2019-04-08 11:20:27
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-07-16 14:29:52
 * @Description:
 -->
<template>
    <div class="safe-collection">
        <div class="safe-top bg-color-gray color-balck" v-show="!next">{{$t('Mobile.verifyPhone')}}</div>
        <div class="safe-top bg-color-gray color-balck" v-show="next">{{$t('Mobile.changePhone')}}</div>
        <!-- 验证手机号 -->
        <div class="check-phone" v-show="!checkstatus && !next">
            <el-form ref="Checkphone" :rules="Checkphone" :model="ruleForm2" label-width="130px">
                <el-form-item :label="$t('Mobile.oldPhone')">
                    <span
                        style="font-weight:600;padding-left:14px;"
                        class="phones"
                    >{{ruleForm2.phone.substr(0,3)+"****"+ruleForm2.phone.substr(7)}}</span>
                </el-form-item>

                <el-form-item :label="$t('Mobile.verificationCode')" prop="noteCode">
                    <el-input
                        class="verifict-input"
                        clearable
                        maxlength="6"
                        @keydown.native.32="keydownEvent"
                        v-model="ruleForm2.noteCode"
                        :placeholder="$t('Mobile.inputNotecode')"
                        onkeyup="this.value=this.value.replace(/[^0-9]/g,'')"
                        onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^0-9]/g,''))"
                    ></el-input>
                    <div
                        @click.stop="getCheckNumber()"
                        class="getCode"
                        v-if="codeflag"
                    >{{$t('Mobile.getCode')}}</div>
                    <div class="ungetCode" v-else>{{$t('Mobile.agianSend')}}({{countDownCode}}s)</div>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        :class="isOk?'nextSteps':'unNext'"
                        @click="nextStep()"
                    >{{$t('Mobile.nextStep')}}</el-button>
                </el-form-item>
                <!-- <div @click="nextStep()" :class="isOk?'nextSteps':'unNext'">下一步</div> -->
            </el-form>
        </div>
        <!-- 修改手机号 -->
        <div class="change-phone" v-show="!checkstatus && next">
            <el-form ref="changePhone" :rules="changePhone" :model="ruleForm2" label-width="130px">
                <el-form-item :label="$t('Mobile.newPhone')" prop="newPhone">
                    <el-input
                        maxlength="11"
                        clearable
                        @keydown.native.32="keydownEvent"
                        v-model="ruleForm2.newPhone"
                        :placeholder="$t('Mobile.inputPhone')"
                        onkeyup="this.value=this.value.replace(/[^0-9]/g,'')"
                        onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^0-9]/g,''))"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('Mobile.verificationCode')" prop="noteCode">
                    <el-input
                        class="verifict-input"
                        clearable
                        maxlength="6"
                        @keydown.native.32="keydownEvent"
                        v-model="ruleForm2.noteCode"
                        :placeholder="$t('Mobile.inputNotecode')"
                        onkeyup="this.value=this.value.replace(/[^0-9]/g,'')"
                        onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^0-9]/g,''))"
                    ></el-input>
                    <div
                        @click.stop="checkPhone()"
                        :class="!getCode?'ungetCode':'getCode'"
                        v-if="codeflag"
                    >{{$t('Mobile.getCode')}}</div>
                    <div class="ungetCode" v-else>{{$t('Mobile.agianSend')}}({{countDownCode}}s)</div>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        :class="!isOk?'unNext':'nextSteps'"
                        @click="submitForm()"
                    >{{$t('Mobile.submit')}}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="alter-status" v-show="checkstatus">
            <div>
                <img src="../../assets/images/common/success.png" />
                <p
                    class="title"
                >{{$t('Mobile.alterSuccess')}} {{ruleForm2.newPhone.substr(0,3)+"****"+ruleForm2.newPhone.substr(7)}}</p>
                <p class="location">{{$t('Mobile.successTips')}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import { Icon } from "element-ui";
import { UserService, Invoice, ThirdParty, Base } from "../../api/service";
import { validateAccount } from "../../mixins/validateAccount.js";
export default {
    components: {},
    mixins: [validateAccount],
    data() {
        return {
            codeflag: true,
            ruleForm2: {
                phone: "", //手机号
                newPhone: "", //新手机号
                noteCode: "" //验证码
            },
            Checkphone: {
                noteCode: [
                    {
                        validator: this.validateVerificationCode,
                        trigger: "blur"
                    }
                ]
            },
            changePhone: {
                newPhone: [{ validator: this.validatePhone, trigger: "blur" }],
                noteCode: [
                    {
                        validator: this.validateVerificationCode,
                        trigger: "blur"
                    }
                ]
            },
            countDownCode: 0, //倒计时
            next: false, //下一步
            checkstatus: false, //是否进行手机验证状态
            isOk: false,
            getCode: false,
            btnLock: false // 验证码按钮锁,
        };
    },
    watch: {
        ruleForm2: {
            handler(value) {
                this.ruleForm2.phone && this.ruleForm2.noteCode.length > 0
                    ? (this.isOk = true)
                    : (this.isOk = false);
                if (this.ruleForm2.newPhone.length == 0) {
                    this.getCode = false;
                    return;
                }
                !/^1[345789]\d{9}$/.test(this.ruleForm2.newPhone)
                    ? (this.getCode = false)
                    : (this.getCode = true);
                this.getCode && this.ruleForm2.noteCode.length > 0
                    ? (this.isOk = true)
                    : (this.isOk = false);
            },
            deep: true
        }
    },
    methods: {
        //禁止输入空格
        keydownEvent(e) {
            e.preventDefault();
            return false;
        },
        // 获取会员手机号
        getPhone() {
            let data = {};
            UserService.getUserInfo(data).then(res => {
                console.log(res);
                this.ruleForm2.phone = res.mobilePhone;
            });
        },
        //  校验手机号是否绑定
        checkPhone() {
            // 校验手机号正确性
            if (!this.ruleForm2.newPhone) {
                return;
            } else if (!/^1[345789]\d{9}$/.test(this.ruleForm2.newPhone)) {
                return;
            } else {
                let data = {
                    id: Storage.get("USER_INFO").usrId,
                    mobile: this.ruleForm2.newPhone,
                    ownCompanyId: Storage.get("COMPANYID").company_id
                };
                UserService.checkPhone(data).then(
                    res => {
                        this.getCheckNumber();
                    },
                    err => {
                        this.$message.error(err.errorMsg);
                    }
                );
            }
        },
        // 发送验证码
        getCheckNumber() {
            if (!!this.btnLock) return;
            this.btnLock = true;
            var phones;
            if (this.next == false) {
                phones = this.ruleForm2.phone;
            } else {
                phones = this.ruleForm2.newPhone;
            }
            let data = {
                mobile: phones,
                id: Storage.get("USER_INFO").usrId,
                verifyClassCode: "VERIFY_CHANGE_MOBILE"
            };
            UserService.getCaptcha(data).then(res => {
                if (res == "03" || res == "OK") {
                    this.countDownCode = 60;
                    this.codeflag = false;
                    this.countDown = setInterval(() => {
                        this.countDownCode--;
                        if (this.countDownCode <= 0) {
                            this.codeflag = true;
                            this.btnLock = false;
                            clearInterval(this.countDown);
                        }
                    }, 1000);
                    this.$message(this.$t("Mobile.sendNote"));
                } else {
                    this.btnLock = false;
                    this.$message.error(this.$t("Mobile.failNote"));
                }
            });
        },
        // 下一步
        nextStep() {
            this.$refs.Checkphone.validate(valid => {
                if (valid) {
                    let data = {
                        mobilePhone: this.ruleForm2.phone,
                        registCode: this.ruleForm2.noteCode,
                        onlyVerify: 1,
                        verifyType: null,
                        verifyClassCode: "VERIFY_CHANGE_MOBILE"
                    };
                    UserService.checkCaptcha(data).then(
                        res => {
                            this.next = true;
                            this.ruleForm2.noteCode = "";
                            this.ruleForm2.phone = "";
                            this.countDownCode = 0;
                            console.log(res);
                        },
                        err => {
                            if (err.errorMsg) {
                                this.$message.error(err.errorMsg);
                            }
                        }
                    );
                } else {
                    return false;
                }
            });
        },
        // 修改手机号
        submitForm() {
            this.$refs.changePhone.validate(valid => {
                if (valid) {
                    let data = {
                        mobilePhone: this.ruleForm2.newPhone,
                        registCode: this.ruleForm2.noteCode,
                        onlyVerify: "",
                        verifyType: null,
                        verifyClassCode: "VERIFY_CHANGE_MOBILE"
                    };
                    UserService.checkCaptcha(data).then(
                        res => {
                            //  更换新手机号
                            let changeData = {
                                newMobile: this.ruleForm2.newPhone,
                                oldMobile: this.ruleForm2.phone
                            };
                            UserService.changePhone(changeData).then(
                                res => {
                                    this.checkstatus = true;
                                    // 更新用户信息
                                    this.$store.dispatch("user/updateUserInfo");
                                    setTimeout(() => {
                                        this.$router.push("/safe-list");
                                    }, 3000);
                                },
                                err => {}
                            );
                        },
                        err => {
                            if (err.errorMsg) {
                                console.log(err.errorMsg);
                                this.$message.error(err.errorMsg);
                            }
                        }
                    );
                } else {
                    return false;
                }
            });
        }
    },
    created() {
        this.getPhone();
    }
};
</script>
<style scoped lang="scss">
.safe-collection {
    width: 100%;
    height: 545px;
    margin-top: 31px;
    border: 1px solid rgba(204, 204, 204, 1);
    .safe-top {
        height: 50px;
        line-height: 50px;
        padding-left: 19px;
        font-size: 14px;
    }
    .check-phone,
    .change-phone {
        width: 450px;
        height: 400px;
        margin: 120px 245px;
        .el-input {
            width: 310px;
        }
        .el-input__inner {
            width: 310px;
            height: 40px;
        }
        .verifict-input {
            width: 169px;
            // margin-left: 20px;
        }
        /deep/.el-form-item__label {
            padding-right: 30px;
            text-align: right;
        }
        .getCode {
            position: absolute;
            width: 140px;
            height: 40px;
            line-height: 40px;
            background: $color-golden;
            color: $color-white;
            text-align: center;
            font-size: $font-small;
            margin: -40px 0 0 167px;
            cursor: pointer;
        }
        .ungetCode {
            position: absolute;
            width: 140px;
            height: 40px;
            line-height: 40px;
            background: $color-line;
            color: $color-white;
            text-align: center;
            font-size: $font-small;
            margin: -40px 0 0 169px;
            cursor: pointer;
        }
        .el-button {
            width: 310px;
            height: 40px;
            border: none;
        }
        .nextSteps {
            background: $color-golden !important;
            cursor: pointer;
        }
        .unNext {
            background: $color-line !important;
            cursor: pointer;
        }
    }
    .alter-status {
        width: 400px;
        height: 300px;
        margin: 98px 275px;
        font-weight: 500;
        font-family: PingFangSC-Medium;
        text-align: center;
        img {
            width: 98px;
            height: 98px;
        }
        .title {
            padding-top: 20px;
            color: $text-primary;
            font-size: $font-22;
        }
        .location {
            padding-top: 5px;
            color: $text-secondary;
            font-size: $font-regular;
        }
    }
}
@media screen and (max-width: 1200px) {
    .check-phone,
    .change-phone {
        margin: 135px 160px !important ;
    }
    .alter-status {
        margin: 125px 190px !important ;
    }
}
</style>
