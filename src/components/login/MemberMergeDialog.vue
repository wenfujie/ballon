/*
* createTime：2019/6/20
* author：fujie.wen
* description: 会员整合弹窗
*/
<template>
    <div :class="{'visibility': !memberList || !memberList.length}">
        <!--:modal="memberList && memberList.length"-->
        <el-dialog
            :title="pageInfo.pageTitle"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            width="500px"
            v-on="$listeners"
            @close="closeCallback">
            <member-merge-form useParent="dialog"
                               @changePage="changePage"
                               @changeList="changeList"
                               v-on="$listeners"></member-merge-form>
        </el-dialog>
    </div>
</template>

<script>
    import MemberMergeForm from './MemberMergeForm';
    export default {
        components:{
            MemberMergeForm
        },
        props:{
            // 是否默认显示弹窗
            defaultVisible: {
                type:Boolean,
                default: false
            }
        },
        data() {
            return {
                memberList: [],//会员列表
                pageInfo:{},// 当前页面类型
                dialogVisible:this.defaultVisible?true:false,// 控制弹窗显示
            }
        },
        methods: {
            // 控制弹窗显示状态
            dialogVisibleState(boolean=true){
                this.dialogVisible = boolean;
            },
            // dialog 的close事件
            closeCallback(){
                this.$emit('close');
            },
            // 弹窗页面改变事件
            changePage(pageInfo){
                this.pageInfo = pageInfo;
            },
            changeList(list){
                console.log(list,"======")
                this.memberList = list;
            },
        },
        created() {
        }
    }
</script>

<style scoped lang="scss">
    .visibility{
        visibility: hidden;
    }
</style>
