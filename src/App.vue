<template>
    <div id="app">
        <div class="ballon-mall" v-if="showHeader">
            <header-con></header-con>
            <keep-alive>
                <router-view :class="{'min-height':setMinHeightFlag}" v-if="$route.meta.keepAlive"/>
            </keep-alive>
            <router-view :class="{'min-height':setMinHeightFlag}" v-if="!$route.meta.keepAlive"/>
            <sidebar></sidebar>
            <footer-con></footer-con>
            <login-dialog :defaultVisible="true"
                          v-if="$store.state.user.loginDialogFlag"
                          @close="closeCallback"></login-dialog>

            <!--会员整合弹窗-->
            <member-merge-dialog ref="mergeDialog"
                                 :defaultVisible="true"
                                 v-if="mergeDialogFlag && showMergeDialog"
                                 @close="closeMergeDialog"></member-merge-dialog>
        </div>
    </div>
</template>

<style lang="scss" type="text/scss">
    @import "./assets/scss/index.scss";
    html, body {
        width: 100%;
        height: 100%;
        #app {
            width: 100%;
            height: 100%;
            .ballon-mall{
                width: 100%;
                height: 100%;
            }
        }
    }
</style>

<script>
    import Storage from './utils/storage'
    import Header from '@/components/Header.vue';
    import Footer from '@/components/Footer.vue';
    import Sidebar from '@/components/Sidebar.vue';
    import { Cms } from '@/api/service';
    import LoginDialog from '@/components/login/LoginDialog.vue';
    import MemberMergeDialog from '@/components/login/MemberMergeDialog'
    import MergeMixins from '@/components/login/mixins/mergeMixins.vue'
    export default {
        mixins:[MergeMixins],
        components:{
            'header-con': Header,
            'footer-con': Footer,
            'sidebar': Sidebar,
            LoginDialog,
            'member-merge-dialog': MemberMergeDialog
        },
        data(){
            return {
                showHeader: false,
                setMinHeightFlag: true,//是否设置最小高度
                showMergeDialog: false,// 显示会员整合弹窗
            }
        },
        computed:{
            /** vuex中控制会员整合弹窗显示字段 **/
            mergeDialogFlag(){
                return this.$store.state.user.mergeDialogFlag;
            },
        },
        methods:{
            // 关闭登录弹窗回调
            closeCallback(){
                this.$store.commit('user/setData',{storeKey: 'loginDialogFlag',storeValue: false});
            },
            /** 关闭会员整合弹窗回调 **/
            closeMergeDialog(){
                this.showMergeDialog = false;
                this.$store.commit('user/setData', { storeKey: 'mergeDialogFlag', storeValue: false });
            },
        },
        created(){
            // 不设置min-height的路由
            this.notSetMinHeightRouter = ['/login','/register'];

            if(!Storage.get('properties')){ // 无缓存数据
                Cms.getProperties().then(res=>{
                    baseConstant.busContsCode = res.busContsCode
                    Storage.set('COMPANYID', {company_id: res.companyId})
                    Storage.set('properties', {
                        iframeUrl: res.iframeUrl,
                        shopId: res.shopId,
                        shopCode: res.shopCode,
                        busContsCode: res.busContsCode
                    })
                    global.getTemplate().then(res=>{
                        this.showHeader = true
                    })
                })
            }else{
                this.showHeader = true
            }
        },
        mounted(){
            // 关闭浏览器窗口的时候清空浏览器缓存在localStorage的数据
            window.onbeforeunload = function (e) {
                let userInfo = Storage.get('USER_INFO');
                if(userInfo){
                    // 解决刷新后获取不到用户信息问题
                    sStorage.set('USER_INFO',userInfo,3600);
                    Storage.remove('USER_INFO');
                }
            }
        },
        watch:{
            // 监听vuex控制会员整合弹窗变量 调用接口判断是否显示弹窗1
            async mergeDialogFlag(boolean) {
                if(boolean) {
                    let memberlist = await this.m_getMemberList(1);
                    if(memberlist && memberlist.length) {
                        this.showMergeDialog = true;
                    }
                }
            },
            $route(item){
                let index = this.notSetMinHeightRouter.indexOf(item.path);
                if(index == -1){
                    this.setMinHeightFlag = true;
                }else{
                    this.setMinHeightFlag = false;
                }
            },

        }
    }
</script>
