/*
* createTime：2019/4/19
* author：fujie.wen
* description: 登录模块多处调用方法（mixins）
*/

<script>
    import md5 from '@/utils/md5'
    import { UserService, Vouchers } from '@/api/service';

    export default {
        components:{},
        data() {
            return {

            }
        },
        methods: {
            // 会员整合 会员列表值change事件
            m_changeList(list){
                if(!list || !list.length){
                    this.$refs.mergeDialog.dialogVisibleState(false);
                    // 一般登录成功
                    this.$emit('generalLoginSuccess');
                }else{
                    // 打開整合弹窗
                    this.$refs.mergeDialog.dialogVisibleState();
                }

            },
            // 账号密码登录
            m_passwordLogin(account,psd) {
                let data = {
                    loginName: account,
                    password: md5(psd),
                }
                return UserService.vipLogin(data).then(res => {
                    return {statusCode: 200, data: res};
                }, err => {
                    this.$message.error(err.errorMsg);
                    return {statusCode: err.statusCode, data: {}}
                })
            },


            // 送卡送券
            m_sendCardCoupons(usrId,vipInfoHdId) {
                return Vouchers.sendCardCoupons({
                    usrId: usrId || '',
                    shopId: Storage.get('properties').shopId,
                    vipInfoHdId: vipInfoHdId || ''
                })
            },
            //禁止输入空格
            m_keydownEvent(e) {
                e.preventDefault();
                return false;
            },
            // 获取短信验证码
            async m_getNoteCode(phone,verifyClassCode,lockKey){
                if(!isPhone(phone)){
                    this[lockKey] = false;
                    this.$message.error(this.$t('login.writeTruePhone'));
                    return;
                }
                return this.m_checkoutPhoneRegister(phone).then((res) => {
                    console.log("-----",res)
                    this[lockKey] = false;
                    c_showLoading(false);
                    this.$message.error(this.$t('login.unregisteredPhone'));
                }, async (err) => {
                    if(err.statusCode == 500){
                        // 用户已注册过错误编码
                        if(err.errorCode == 880201006){
                            let data = {
                                mobile: phone,
                                verifyClassCode: verifyClassCode,
//                                usrId: 0    //  usrId为必填字段，不是实际用户写死为0
                            }
                            return UserService.getCaptcha(data).then((res) => {
                                if (res == '03' || res == 'OK') {

                                    c_showLoading(false);
                                    // 短信发送成功
                                    return true;
                                } else {
                                    this.$message.error(this.$t('common.messageSendFail'));
                                }
                                c_showLoading(false);
                            }, (err) => {
                                this[lockKey] = false;
                                c_showLoading(false);
                            })
                        }else{
                            this.$message.error(err.errorMsg);
                        }
                    }
                    this[lockKey] = false;
                    c_showLoading(false);
                })
            },
            // 判断手机号是否注册
            async m_checkoutPhoneRegister(phone){
                let data = {
                    usrId: 0,    //  usrId为必填字段，不是实际用户写死为0
                    mobile: phone,
                    buscontsId: Storage.get('properties').busContsCode
                }
                c_showLoading();
                await UserService.checkPhone(data)
            },
        },
        created() {
        }
    }
</script>
