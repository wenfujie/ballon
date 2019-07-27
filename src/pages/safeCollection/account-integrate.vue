
<template>
    <div class="account-integrate">
        <div class="title">{{$t('Integrate.accountIntegrate')}}</div>
        <div :class="pageCodes==='userList'?'userContents':'contents'">
            <member-merge-form
                ref="mergeForm"
                v-on="$listeners"
                @close="closeCallback"
                @changeList="changeList"
                @changePage="changePage"
            ></member-merge-form>
        </div>
    </div>
</template>
<script>
import { Icon } from "element-ui";
import { UserService, Invoice, ThirdParty } from "../../api/service";
import MemberMergeForm from "../../components/login/MemberMergeForm";
export default {
    components: { MemberMergeForm },
    data() {
        return {
            safeList: [],
            pageCodes: ""
        };
    },
    methods: {
        // 会员整合 会员列表值change事件
        changeList(list) {
            console.log(list,'llll')
            if (!list || list.length==0) {
                // 一般登录成功
                this.$emit("generalLoginSuccess");
                this.$router.go(-1);
            } 
        },
        changePage(pageCode) {
            this.pageCodes = pageCode.pageCode;
            console.log(this.pageCodes, "pageCode");
        },

        // 会员整合弹窗关闭事件
        closeCallback() {
            this.$emit("generalLoginSuccess");
        }
    },
    watch: {},
    created() {}
};
</script>
<style scoped lang="scss">
.account-integrate {
    width: 100%;
    height: 545px;
    margin: 31px auto;
    border: 1px solid rgba(204, 204, 204, 1);
    .title {
        height: 50px;
        line-height: 50px;
        padding-left: 19px;
        font-size: 14px;
        background: $color-thead;
    }
    .contents {
        width: 500px;
        margin: 110px 0 0 280px;
    }
    .userContents {
        width: 320px;
        margin: 120px 0 0 340px;
    }
}
@media screen and (max-width: 1200px) {
    .contents {
        margin: 110px 0 0 180px !important;
    }
    .userContents {
        margin: 120px 0 0 230px !important;
    }
}
</style>