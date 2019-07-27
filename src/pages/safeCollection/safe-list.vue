
<template>
    <div class="safe-collection">
        <div class="safe-top bg-color-gray color-balck">{{$t('safeList.safeManage')}}</div>
        <div class="safe-content">
            <!-- 有设置密码状态 begin -->
            <ul v-show="getpassword">
                <li
                    v-for="(item,index) in $t('safeList.safeLists')"
                    :key="index"
                    @click="location(item)"
                >
                    <img :src="item.img1" />
                    <span class="title">{{item.title}}</span>
                    <span
                        class="tips"
                        v-if="item.id==3 &&phone"
                    >已验证手机号{{phone.substr(0,3)+"****"+phone.substr(7)}}</span>
                    <span class="tips" v-else>{{item.tips1}}</span>
                    <div :class="memberList.length===0 && item.id==4?'locations':'location'">
                        <span class="locationName">{{item.locationName1}}</span>
                        <i class="el-icon-arrow-right" v-if="item.id!=4"></i>
                        <i class="iconfont icon-wenhao" v-if="memberList.length==0 && item.id==4"></i>
                        <i class="el-icon-arrow-right" v-if="memberList.length!=0 && item.id==4"></i>
                    </div>
                </li>
            </ul>
            <!-- 有设置密码状态 end -->
            <!-- 没有设置密码状态 begin -->
            <ul v-show="!getpassword">
                <li
                    v-for="(item,index) in $t('safeList.safeLists')"
                    :key="index"
                    @click="location(item)"
                >
                    <img :src="item.img" />
                    <span class="title">{{item.title}}</span>
                    <span
                        class="tips"
                        v-if="item.id==3 &&phone"
                    >已验证手机号{{phone.substr(0,3)+"****"+phone.substr(7)}}</span>
                    <span class="tips" v-else>{{item.tips1}}</span>
                    <div :class="memberList.length===0&&item.id==4?'locations':'location'">
                        <span class="locationName">{{item.locationName}}</span>
                        <i class="el-icon-arrow-right" v-if="item.id!=4"></i>
                        <i class="iconfont icon-wenhao" v-if="memberList.length==0 && item.id==4"></i>
                        <i class="el-icon-arrow-right" v-if="memberList.length!=0 && item.id==4"></i>
                    </div>
                </li>
            </ul>
            <!-- 没有设置密码状态 end -->
            <!-- 显示整合弹出层 -->
            <el-popover
                placement="bottom"
                width="200"
                trigger="manual"
                v-model="showCardDate"
                visible-arrow="true"
            >
                <div>{{$t('Integrate.noIntegrate')}}</div>
            </el-popover>
        </div>
    </div>
</template>
<script>
import { Icon, Popover } from "element-ui";
import { UserService, Invoice, ThirdParty } from "../../api/service";
export default {
    components: { "el-popover": Popover },
    data() {
        return {
            status: "", //判断当前是否有无登录密码状态
            getpassword: "", //获取登录密码
            phone: "", //手机号
            showCardDate: false, //判读是否显示整合弹出层
            memberList: [] //判断是否需要会员整合
        };
    },
    methods: {
        // 点击跳转
        location(item) {
            if (item.id == 1) {
                this.$router.push("/set-password");
            } else if (item.id == 2) {
                this.$router.push("/band-account");
            } else if (item.id == 3) {
                this.$router.push("/alter-phone");
            } else {
                if (this.memberList.length == 0) {
                    this.showCardDate = !this.showCardDate;
                } else {
                    this.$router.push("/account-integrate");
                }
            }
        },
        // 获取会员手机号
        getPhone() {
            let data = {};
            UserService.getUserInfo(data).then(res => {
                this.phone = res.mobilePhone;
                // console.log(this.phone, "this.phone");
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
            });
        },
        // 获取会员列表
        getMemberList() {
            let data = {
                vipInfoHdId: Storage.get("USER_INFO").vipInfoId,
                windowFlag: 0 // 1弹窗 0非弹窗
            };
            return UserService.memberMergeList(data).then(res => {
                this.memberList = res && res.length > 0 ? res : [];
            });
        }
    },
    watch: {
        memberList: {
            deep: true,
            handler(list) {
                this.$emit("changeList", list);
            }
        }
    },
    watch: {},
    created() {
        this.getMemberList();
        this.getOldPassword();
        this.getPhone();
    }
};
</script>
<style scoped lang="scss">
.safe-collection {
    .icon-wenhao {
        font-size: 12px;
    }
    width: 100%;
    height: 545px;
    margin-top: 31px;
    border: 1px solid rgba(204, 204, 204, 1);
    .safe-content {
        width: 100%;
        height: 100%;
    }
    .safe-top {
        width: 100%;
        // height: 100%;
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
        cursor: pointer;
        img {
            width: 30px;
            height: 30px;
            position: absolute;
            margin-top: 28px;
            // padding: 15px;
        }
        .title {
            display: inline-block;
            width: 120px;
            font-size: 18px;
            font-weight: 600;
            font-family: PingFangSC-Medium;
            margin-left: 60px;
        }
        .tips {
            text-align: left;
            color: $text-secondary;
            margin-left: 70px;
            font-weight: 600;
        }
        .locations {
            float: right;
            color: $text-secondary;
            font-weight: 600;
        }
        .location {
            float: right;
            color: $text-blue;
            font-weight: 600;
        }
        .locationName {
            margin-right: 20px;
        }
    }
    /deep/.el-popover {
        margin-left: 780px;
        > div {
            color: $text-regular;
        }
    }
}
@media screen and (max-width: 1200px) {
    /deep/.el-popover {
        margin-left: 580px !important;
    }
}
</style>