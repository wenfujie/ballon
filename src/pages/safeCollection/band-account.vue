
<template>
    <div class="safe-collection">
        <div class="safe-top bg-color-gray color-balck">账号绑定</div>
        <div class="safe-content">
            <ul>
                <li v-for="(item,index) in safeList" :key="index" @click="location(item)">
                    <img :src="item.img">
                    <span class="title">{{item.title}}</span>
                    <span class="tips">{{item.tips}}</span>
                    <div class="location">
                        <span class="locationName">{{item.locationName}}</span>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </li>
                <!-- <img src="../../assets/images/common/warning.png"> -->
            </ul>
        </div>
    </div>
</template>
<script>
import { Icon } from 'element-ui';
import { UserService, Invoice, ThirdParty } from '../../api/service';
export default {

    data() {
        return {
            safeList: [],

        }
    },
    methods: {
        // 点击跳转
        location(item) {
            console.log(item.id)
            if (item.id == 1) {
                this.$router.push('/set-password');
            } else if (item.id == 2) {
                this.$router.push('/set-password');
            } else {
                this.$router.push('/alter-phone');
            }
        }

    },
    watch: {

    },
    created() {

    }
}
</script>
<style scoped lang="scss">
.safe-collection {
    width: 993px;
    height: 545px;
    margin-top: 31px;
    border: 1px solid rgba(204, 204, 204, 1);
    .safe-top {
        height: 50px;
        line-height: 50px;
        padding-left: 19px;
        font-size: 14px;
    }
    ul {
        width: 94%;
        margin-left: 3%;
    }
    li {
        height: 82px;
        line-height: 82px;
        border-bottom: 1px dashed rgba(204, 204, 204, 1);
        .title {
            display: inline-block;
            width: 80px;
            font-size: 18px;
            font-weight: 500;
            font-family: PingFangSC-Medium;
            margin-left: 30px;
        }
        .tips {
            text-align: left;
            color: $text-secondary;
            margin-left: 80px;
        }
        .location {
            float: right;
            color: #3d78cc;
            font-weight: 500;
        }
        .locationName {
            margin-right: 20px;
        }
        .single {
        }
    }
}
</style>