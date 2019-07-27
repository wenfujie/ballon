<template>
    <div class="member-info">
        <div class="info-header">{{$t('memberInfo.infoHeader')}}</div>
        <div class="info-content" v-loading="loading" :element-loading-text="$t('memberInfo.loading')" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)">
            <el-form class="form-box" ref="personForm" :rules="rulesPersonForm" :model="personForm">
                <el-form-item :label="$t('memberInfo.avatar')">
                    <el-upload class="avatar-uploader" :http-request="myUpload" action :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-lazy="!!personForm.imgFlag ? personForm.downloadUrl : getImg(personForm.downloadUrl)" class="avatar" :key="personForm.downloadUrl">
                        <i class="el-icon-view avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item :label="$t('memberInfo.usrLoginName')">
                    {{personForm.usrLoginName}}
                </el-form-item>
                <el-form-item :label="$t('memberInfo.vipAccount.label')" class="letter-space" prop="vipAccount">
                    <el-input v-model="personForm.vipAccount" :placeholder="$t('memberInfo.vipAccount.placeholder')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('memberInfo.sex.label')" class="letter-space sexCode_select">
                    <el-radio-group v-model="personForm.sexCode">
                        <el-radio label="D_MALE">{{$t('memberInfo.sex.boy')}}</el-radio>
                        <el-radio label="D_FEMALE">{{$t('memberInfo.sex.girl')}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('memberInfo.birthday.label')" class="letter-space">
                    <el-date-picker type="date" value-format="yyyy-MM-dd" :placeholder="$t('memberInfo.birthday.placeholder')" v-model="personForm.solarcalendar" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item :label="$t('memberInfo.phone.label')">
                    <el-input :value="personForm.mobilePhone | phoneFilter" :disabled="true" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('memberInfo.email.label')" class="letter-space" prop="email">
                    <el-input v-model="personForm.email" :placeholder="$t('memberInfo.email.placeholder')" clearable></el-input>
                </el-form-item>
            </el-form>
            <div class="save-box">
                <button type="button" :class="{ 'disable': btnLock }" @click="saveUserInfo('personForm')">{{$t('memberInfo.save')}}</button>
            </div>
        </div>
    </div>
</template>

<script>
import { Upload } from "element-ui";
import { UserService } from "../../api/service";

export default {
    data() {
        return {
            btnLock: false,
            loading: false,
            personForm: {
                photoId: '',
                usrLoginName: '',
                vipAccount: '',
                sexCode: '',
                solarcalendar: '',
                email: '',
                downloadUrl: '',
            },
            rulesPersonForm: {
                vipAccount: [
                    { required: true, message: '请输入昵称', trigger: 'blur' },
                ],
                email: [
                    { required: true, validator: this.validateEmail, trigger: 'blur' },
                ],
            },
        };
    },
    components: {
        "el-upload": Upload
    },
    methods: {
        async myUpload(file) {
            // 上传图片过程中启动盖屏，禁止点保存
            this.loading = true;
            uploadImg(file.file).then(res => {
                // 存储图片id
                this.personForm.photoId = res;
                // 隐藏盖屏
                this.loading = false;
            })
        },
        // 上传图片成功
        handleAvatarSuccess(res, file) {
            // 替换头像图片
            this.personForm.downloadUrl = URL.createObjectURL(file.raw);
            let url = this.personForm.downloadUrl
            if(url.indexOf('http') == -1 && url.indexOf('https') == -1 && url.indexOf('blob') == -1) {
                if(url.substring(0,5) === 'blob:') {
                    this.personForm.imgFlag = 1
                }else{
                    this.personForm.imgFlag = 0
                }
            }else{
                this.personForm.imgFlag = 1
            }
        },
        // 上传图片之前
        beforeAvatarUpload(file) {
            // 格式校验
            const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp';
            // 大小校验
            const isLt4M = file.size / 1024 / 1024 < 4;
            if (!isImg) {
                this.$message.error('上传图片必须是 JPG/GIF/PNG/BMP 格式!');
            }
            if (!isLt4M) {
                this.$message.error("上传头像图片大小不能超过 4MB!");
            }
            return isImg && isLt4M;
        },
        // 获取个人信息
        getUserInfo() {
            UserService.getUserInfo({}).then(res => {
                let {
                    photoId,
                    usrLoginName,
                    vipAccount,
                    email,
                    sexCode,
                    solarcalendar,
                    mobilePhone,
                    downloadUrl
                } = res;
                this.personForm = {
                    ...this.personForm,
                    photoId,
                    usrLoginName,
                    vipAccount,
                    email,
                    sexCode,
                    solarcalendar,
                    mobilePhone,
                    downloadUrl
                };
                let url = this.personForm.downloadUrl
                if(url.indexOf('http') == -1 && url.indexOf('https') == -1 && url.indexOf('blob') == -1) {
                    if(url.substring(0,5) === 'blob:') {
                        this.personForm.imgFlag = 1
                    }else{
                        this.personForm.imgFlag = 0
                    }
                }else{
                    this.personForm.imgFlag = 1
                }
            });
        },
        // 保存个人信息
        saveUserInfo(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid && !this.btnLock) {
                    // 禁用按钮
                    this.btnLock = true;
                    // 发送用户信息
                    UserService.updateUserInfo({
                        photoId: this.personForm.photoId,
                        account: this.personForm.vipAccount,
                        usrCode: this.personForm.vipAccount,
                        sexCode: this.personForm.sexCode,
                        solarCalendarStr: this.personForm.solarcalendar,
                        email: this.personForm.email,
                    }).then(res => {
                        if (res === 1) {
                            // 启用按钮
                            this.btnLock = false;
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.$store.dispatch('user/updateUserInfo')
                        }
                    });
                }
            });
        },
        // 邮箱有值时校验邮箱格式
        validateEmail(rule, value, callback) {
            let emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/i;
            let regEmail = new RegExp(emailReg);
            if (value) {
                if (!regEmail.test(value)) {
                    callback(new Error('邮箱格式不正确'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        }
    },
    filters: {
        // 手机号掩码
        phoneFilter(str) {
            if(str !== undefined){
                return str.substring(0, 3) + '****' + str.substring(7, 11);
            }
        }
    },
    created() {
        this.getUserInfo();
    }
};
</script>

<style scoped lang="scss">
.member-info {
    $black: #333;
    width: 990px;
    height: 710px;
    background: #fff;
    border: 1px solid #ccc;
    margin-top: 30px;
    .info-header {
        width: 100%;
        height: 50px;
        padding-left: 19px;
        line-height: 50px;
        background: rgba(245, 245, 245, 1);
    }
    .info-content {
        padding: 0 120px;
        margin-top: 30px;
        .form-box {
            /deep/.el-upload {
                cursor: pointer;
                position: relative;
                overflow: hidden;
                width: 60px;
                height: 60px;
                .avatar {
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    display: block;
                    border-radius: 50%;
                    border: 1px solid #d2d2d2;
                }
                .avatar-uploader-icon {
                    position: absolute;
                    left: 0;
                    font-size: 22px;
                    width: 60px;
                    height: 60px;
                    line-height: 60px;
                    border-radius: 50%;
                    color: #fff;
                    background: rgba(0, 0, 0, 0.6);
                    transition: 0.4s;
                    opacity: 0;
                }
            }
            /deep/.el-upload:hover {
                .avatar-uploader-icon {
                    opacity: 1;
                }
            }
            /deep/.el-form-item__content {
                margin-left: 108px !important;
            }
            /deep/.avatar-uploader,
            .el-date-editor.el-input {
                width: 210px !important;
            }
            /deep/.el-input {
                width: 210px;
            }
            /deep/.el-input__inner {
                font-size: 14px;
                color: $black;
            }
            /deep/.el-form-item__label {
                font-size: 16px;
                color: $black;
                letter-spacing: 0;
                font-weight: 500;
                text-align-last: justify;
                width: 76px !important;
            }
            /deep/.el-form-item__label:before {
                display: none;
            }
            /deep/.el-date-editor.el-input,
            .el-date-editor.el-input__inner {
                width: 200px;
            }
        }
        .save-box {
            margin-top: 42px;
            border-top: 1px dashed rgba(204, 204, 204, 1);
            button {
                margin-top: 44px;
                margin-left: 108px;
                width: 168px;
                height: 50px;
                background: #b59f7f;
                font-weight: 500;
                color: #fff;
                line-height: 50px;
                outline: none;
                border: none;
                cursor: pointer;
                transition: all 0.4s;
            }
            button:hover {
                background: $color-golden-hover;
            }
            button.disable {
                background: $bg-color-disabled;
                color: $text-secondary;
            }
        }
    }
}
@media screen and (max-width: 1199px) {
    .member-info {
        width: 815px;
    }
}
</style>
