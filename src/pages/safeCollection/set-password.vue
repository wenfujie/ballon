
<template>
    <div class="safe-collection">
        <div class="safe-top bg-color-gray color-balck">{{$t('setPassword.changePassword')}}</div>
        <div class="safe-content" v-show="this.success==false">
            <!-- 有设置登录密码 -->
            <el-form
                :model="ruleForm2"
                :rules="rules2"
                ref="ruleForm2"
                label-width="100px"
                class="demo-ruleForm"
                v-show="this.getpassword"
            >
                <el-form-item :label="$t('setPassword.oldPassword')" prop="oldPassword">
                    <el-input
                        :type="pswInputType1"
                        v-model="ruleForm2.oldPassword"
                        autocomplete="off"
                        :placeholder="$t('setPassword.passwordTips')"
                        maxlength="20"
                        @keydown.native.32="keydownEvent"
                    >
                        <i
                            slot="suffix"
                            :class="['iconfont', 'icon-baomi1',{'icon-xianshi':pswInputType1 == 'text'}]"
                            @click="changePswState('pswInputType1')"
                        ></i>
                    </el-input>
                </el-form-item>
                <el-form-item :label="passName" prop="newPassword">
                    <el-input
                        :type="pswInputType2"
                        v-model="ruleForm2.newPassword"
                        autocomplete="off"
                        :placeholder="$t('setPassword.passwordTips')"
                        maxlength="20"
                        @keydown.native.32="keydownEvent"
                    >
                        <i
                            slot="suffix"
                            :class="['iconfont', 'icon-baomi1',{'icon-xianshi':pswInputType2 == 'text'}]"
                            @click="changePswState('pswInputType2')"
                        ></i>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('setPassword.checkPassword')" prop="checkPassword">
                    <el-input
                        :type="pswInputType3"
                        v-model="ruleForm2.checkPassword"
                        autocomplete="off"
                        :placeholder="$t('setPassword.passwordTips')"
                        maxlength="20"
                        @keydown.native.32="keydownEvent"
                    >
                        <i
                            slot="suffix"
                            :class="['iconfont', 'icon-baomi1',{'icon-xianshi':pswInputType3 == 'text'}]"
                            @click="changePswState('pswInputType3')"
                        ></i>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        :class="!isOk?'unSubmits':'submits'"
                        @click="submitForm('ruleForm2')"
                    >{{$t('setPassword.submit')}}</el-button>
                </el-form-item>
            </el-form>
            <!-- 没有设置登录密码 -->
            <el-form
                :model="ruleForm1"
                :rules="rules1"
                ref="ruleForm1"
                label-width="100px"
                class="demo-ruleForm1"
                v-show="!this.getpassword"
            >
                <el-form-item :label="passName" prop="setPassword">
                    <el-input
                        :type="pswInputType2"
                        v-model="ruleForm1.setPassword"
                        autocomplete="off"
                        :placeholder="$t('setPassword.passwordTips')"
                        maxlength="20"
                        @keydown.native.32="keydownEvent"
                    >
                        <i
                            slot="suffix"
                            :class="['iconfont', 'icon-baomi1',{'icon-xianshi':pswInputType2 == 'text'}]"
                            @click="changePswState('pswInputType2')"
                        ></i>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('setPassword.checkPassword')" prop="againPassword">
                    <el-input
                        :type="pswInputType3"
                        v-model="ruleForm1.againPassword"
                        autocomplete="off"
                        :placeholder="$t('setPassword.passwordTips')"
                        maxlength="20"
                        @keydown.native.32="keydownEvent"
                    >
                        <i
                            slot="suffix"
                            :class="['iconfont', 'icon-baomi1',{'icon-xianshi':pswInputType3 == 'text'}]"
                            @click="changePswState('pswInputType3')"
                        ></i>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        :class="!isOk?'unSubmits':'submits'"
                        @click="submitForm1('ruleForm1')"
                    >{{$t('setPassword.submit')}}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 成功显示修改密码成功页面 -->
        <div class="alter-status" v-show="this.success==true">
            <img src="../../assets/images/common/success.png" />
            <p class="title">{{setResult}}</p>
            <p class="location">{{$t('setPassword.successTips')}}</p>
        </div>
    </div>
</template>
<script>
import { Icon } from "element-ui";
import { UserService } from "../../api/service";
import { validateAccount } from "../../mixins/validateAccount.js";
import Base64 from "../../utils/base64";
import md5 from "../../utils/md5";
export default {
    data() {
        // 验证原始密码
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error(this.$t("setPassword.inputPass")));
            } else if (
                md5(this.ruleForm2.oldPassword) !==
                this.getpassword.toLowerCase()
            ) {
                callback(new Error(this.$t("setPassword.errorPass")));
            } else if (checkPasswdLevel(value) < 2) {
                callback(new Error(this.$t("setPassword.errorTips")));
            } else {
                let reg = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*_.]+$)[a-zA-Z\d!@#$%^&*_.]+$/;
                if (reg.exec(value)) {
                    callback();
                } else {
                    return callback(
                        new Error(this.$t("setPassword.specialCharacter"))
                    );
                }
            }
        };
        // 验证新密码
        var validatePass1 = (rule, value, callback) => {
            console.log(22222);
            if (value === "") {
                callback(new Error(this.$t("setPassword.inputPass")));
            } else if (value === this.ruleForm2.oldPassword) {
                callback(new Error(this.$t("setPassword.passDisaffinity")));
            } else if (checkPasswdLevel(value) < 2) {
                callback(new Error(this.$t("setPassword.errorTips")));
            } else {
                let reg = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*_.]+$)[a-zA-Z\d!@#$%^&*_.]+$/;
                if (reg.exec(value)) {
                    callback();
                } else {
                    return callback(
                        new Error(this.$t("setPassword.specialCharacter"))
                    );
                }
            }
        };
        // 验证确认密码
        var validatePass2 = (rule, value, callback) => {
            console.log(value, "1111");
            if (value === "") {
                callback(new Error(this.$t("setPassword.againPass")));
            } else if (value !== this.ruleForm2.newPassword) {
                callback(new Error(this.$t("setPassword.enterPassDiff")));
            } else {
                return callback();
            }
        };
        // 在未设置密码时，校验确认密码是否有误
        var checkoutSurePsd = (rule, value, callback) => {
            if (value == "") {
                callback(new Error(this.$t("setPassword.againPass")));
            } else if (
                this.ruleForm1.setPassword !== this.ruleForm1.againPassword
            ) {
                return callback(
                    new Error(this.$t("setPassword.enterPassDiff"))
                );
            } else if (checkPasswdLevel(value) < 2) {
                callback(new Error(this.$t("setPassword.errorTips")));
            } else {
                let reg = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*_.]+$)[a-zA-Z\d!@#$%^&*_.]+$/;
                if (reg.exec(value)) {
                    callback();
                } else {
                    return callback(
                        new Error(this.$t("setPassword.specialCharacter"))
                    );
                }
            }
        };
        return {
            // 修改登录密码
            ruleForm2: {
                oldPassword: "", //原始密码
                newPassword: "", //新密码
                checkPassword: "" //确认密码
            },
            // 修改登录密码
            rules2: {
                oldPassword: [{ validator: validatePass, trigger: "blur" }],
                newPassword: [{ validator: validatePass1, trigger: "blur" }],
                checkPassword: [{ validator: validatePass2, trigger: "blur" }]
            },
            // 没有设置登录密码时
            ruleForm1: {
                setPassword: "", //设置密码
                againPassword: "" //确认密码
            },
            // 没有设置登录密码时
            rules1: {
                setPassword: [{ validator: validatePass1, trigger: "blur" }],
                againPassword: [{ validator: checkoutSurePsd, trigger: "blur" }]
            },
            getpassword: "", //获取密码
            success: false, //是否成功
            passName: this.$t("setPassword.newPassword"),
            setResult: "", //设置状态
            pswInputType1: "password", //旧密码可视类型
            pswInputType2: "password", //新密码可视类型
            pswInputType3: "password", //确认密码可视类型
            isOk: false //按钮状态
        };
    },
    watch: {
        // 监听input是否有值，来判断按钮的颜色
        ruleForm2: {
            handler(value) {
                if (
                    this.ruleForm2.oldPassword.length > 1 &&
                    this.ruleForm2.newPassword.length > 1 &&
                    this.ruleForm2.checkPassword.length > 1
                ) {
                    this.isOk = true;
                } else {
                    this.isOk = false;
                }
            },
            deep: true
        },
        ruleForm1: {
            handler(value) {
                if (
                    this.ruleForm1.setPassword.length > 1 &&
                    this.ruleForm1.againPassword.length > 1
                ) {
                    this.isOk = true;
                } else {
                    this.isOk = false;
                }
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
        //切换密码显示状态
        changePswState(key) {
            console.log(2111);
            this[key] = this[key] == "password" ? "text" : "password";
        },
        // 获取会员手机号
        getPhone() {
            let data = {};
            UserService.getUserInfo(data).then(res => {
                this.getName = res.usrName;
            });
        },
        // 获取原始密码
        getOldPassword() {
            let data = {
                companyId: Storage.get("COMPANYID").company_id,
                usrId: Storage.get("USER_INFO").usrId,
                ownCompanyId: Storage.get("COMPANYID").company_id
            };
            UserService.getPassword(data).then(res => {
                this.getpassword = res.password;
                if (!this.getpassword) {
                    this.passName = this.$t("setPassword.setsPassword");
                }
            });
        },
        // 修改密码提交事件
        submitForm(formName) {
            // this.success = true;
            // 有设置密码则修改密码
            if (this.getpassword) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let data = {
                            oldPwd: md5(
                                this.ruleForm2.oldPassword
                            ).toUpperCase(),
                            newPwd: md5(
                                this.ruleForm2.newPassword
                            ).toUpperCase(),
                            affNewPwd: md5(
                                this.ruleForm2.checkPassword
                            ).toUpperCase(),
                            usrId: Storage.get("USER_INFO").usrId,
                            companyId: Storage.get("COMPANYID").company_id
                        };
                        UserService.changePassword(data).then(res => {
                            if (res === 1) {
                                this.setResult = "修改密码成功";
                                this.success = true;
                                setTimeout(() => {
                                    this.$router.push("/safe-list");
                                }, 3000);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        // 设置密码提交事件
        submitForm1(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = {
                        password: md5(this.ruleForm1.setPassword).toUpperCase(),
                        loginName: this.getName,
                        usrId: Storage.get("USER_INFO").usrId,
                        fnCode: "D_LOGINPWD",
                        companyId: Storage.get("COMPANYID").company_id
                    };
                    UserService.setPassword(data).then(res => {
                        this.setResult = "设置密码成功";
                        this.success = true;
                        setTimeout(() => {
                            this.$router.push("/safe-list");
                        }, 3000);
                    });
                } else {
                    return false;
                }
            });
        }
    },
    created() {
        this.getOldPassword();
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
        width: 100%;
        height: 50px;
        line-height: 50px;
        padding-left: 19px;
        font-size: 14px;
    }
    .safe-content {
        width: 460px;
        height: 400px;
        margin: 120px 236px;
        .icon-baomi1 {
            margin-right: 10px;
            display: inline-block;
            cursor: pointer;
        }
        /deep/.el-input__inner::-ms-reveal {
            display: none;
        }
        /deep/.el-form-item__label {
            color: $text-primary;
            font-weight: 600;
            text-align: center;
            padding-right: 21px;
        }
        /deep/.el-form-item.is-error .el-input__inner {
            border: 1px solid $color-red;
        }
        /deep/.el-input__inner::-webkit-input-placeholder {
            color: $text-secondary;
            font-weight: 600;
            font-size: $font-small;
        }
        /deep/.el-form-item__error {
            color: $color-red;
        }
        .el-button {
            width: 360px;
            height: 40px;
            text-align: center;
            border-radius: 0;
            border: none;
            margin-top: 10px;
            font-size: $font-small;
            font-weight: 600;
            cursor: pointer;
        }
        .unSubmits {
            background: $color-line !important;
            cursor: pointer;
        }
        .submits {
            background: $color-golden !important;
            cursor: pointer;
        }
    }
    .alter-status {
        width: 400px;
        height: 400px;
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
    .safe-content {
        margin: 115px 160px !important ;
    }
    .alter-status {
        margin: 125px 190px !important ;
    }
}
</style>