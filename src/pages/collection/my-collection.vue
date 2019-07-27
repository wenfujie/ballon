
<template>
    <div class="my-collection">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="collection-top">
            <el-tab-pane label="全部商品" name="first">全部商品</el-tab-pane>
            <el-tab-pane label="失效商品" name="second">失效商品</el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import { Tabs, TabPane } from 'element-ui';
import { UserService } from "../../api/service";
import EditDialog from "../../components/address/EditDialog";
export default {
    components: {},
    data() {
        return {
            activeName: 'first'
        };
    },

    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }

    },
    created() {

    }
};
</script>
<style scoped lang="scss">
.my-collection {
    width: 993px;
    height: 850px;
    border: 1px solid $color-line;
    margin-top: 31px;
    .collection-top {
        width: 100%;
        height: 50px;
        background: $color-thead;
        /deep/.el-tabs__nav-wrap {
            height: 50px;
            line-height: 50px;
        }
        /deep/.el-tabs__header .el-tabs__nav {
            border: none;
        }
        /deep/.el-tabs__item {
            height: 50px;
            width: 123px;
            // border: 1px solid #d7d7d7;
            // padding-top: -2px;
        }
        /deep/.el-tabs__item:hover {
            color: $text-tabs;
        }
        /deep/.el-tabs__item.is-active {
            color: $text-tabs;
            font-size: $font-small;
            font-weight: 600;
        }
    }
}
</style>
