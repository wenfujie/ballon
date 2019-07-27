/*
* createTime：2019/3/21
* author：fujie.wen
* description: 登录弹窗
*/
<template>
    <div>
        <el-dialog
                :title="$t('login.login')"
                :visible.sync="dialogVisible"
                width="388px"
                @close="closeCallback">
                <login-form
                    parent="loginDialog"
                    @generalLoginSuccess="generalLoginSuccess"></login-form>
        </el-dialog>

        <member-merge-dialog ref="mergeDialog"
                             v-on="$listeners"
                             @close="generalLoginSuccess"
                             @changeList="m_changeList"></member-merge-dialog>
    </div>
</template>

<script>
    import LoginForm from '@/components/login/LoginForm'
    import MemberMergeDialog from './MemberMergeDialog'
    import LoginMixins from './mixins/LoginMixins.vue';

    export default {
        components:{LoginForm, MemberMergeDialog},
        mixins: [LoginMixins],
        data() {
            return {
                dialogVisible:this.defaultVisible?true:false,
            }
        },
        // $emit close:关闭弹窗 generalLoginSuccess：账号密码、验证码登录成功回调
        props:{
            // 登录成功回调（不支持第三方登录）
            loginCallBack:{
                type: Function
            },
            // 是否默认显示弹窗
            defaultVisible: {
                type:Boolean,
                default: false
            }
        },
        methods: {
            // 关闭弹窗回调
            closeCallback(){
                this.$emit('close');
            },
            // 控制弹窗显示状态
            dialogVisibleState(boolean=true){
                this.dialogVisible = boolean;
            },
            // 账号密码、验证码登录成功回调
            generalLoginSuccess(operator){
                // onlyClose(控制弹窗关闭，不执行登录后逻辑)
                if(operator === 'onlyClose'){
                    this.dialogVisible = false;
                    this.$refs.mergeDialog.dialogVisibleState();
                    return;
                }

                this.dialogVisible = false;

                if(this.$store.state.goods.operationType === 0 || this.$store.state.goods.operationType === 1) {
                    this.$store.dispatch('goods/goodsHandle')
                    return
                }

                if(typeof this.loginCallBack === 'function'){
                    this.loginCallBack();
                }

                this.$emit('generalLoginSuccess');
            },
            // 会员整合 获取整合用户列表
//            changeList(list){
//                console.log(list,"-=-=-=")
//                if(!list || !list.length){
//
//                }
//            },
        },
        created() {
        }
    }
</script>

<style scoped lang="scss">

</style>
