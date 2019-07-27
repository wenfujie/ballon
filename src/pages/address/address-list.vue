/*
* createTime：2019/3/26
* author：wxf
* description:  收货地址
*/
<template>
    <div class="index min-height">
        <div class="right-div">
            <!-- 记录显示 -->
            <div class="right-item">
                {{$t('addressList.tipNumber',[addNumber])}}
                <div
                    class="fl-right add"
                    v-if="addNumber!=0"
                    @click="addressOperation(1)"
                >+{{$t('addressList.addAddress')}}</div>
                <div class="fl-right no-add" v-else>+{{$t('addressList.addAddress')}}</div>
            </div>
            <div class="right-content" v-if="addressList.length!==0">
                <!-- 地址列表 -->
                <table class="com-table">
                    <thead class="com-thead">
                        <th>{{$t('addressList.consignee')}}</th>
                        <th>{{$t('addressList.address')}}</th>
                        <th>{{$t('addressList.contact')}}</th>
                        <th>{{$t('addressList.operation')}}</th>
                        <th></th>
                    </thead>

                    <tbody
                        class="scroll_rest"
                        :style="{'overflow-y':(addressList.length>6?'scroll':'hidden')}"
                    >
                        <tr class="tr pain-tr" v-for="(item,index) in addressList" :key="index">
                            <td>{{item.cargousrName}}</td>
                            <td class="clearfix">{{item.destDesc + item.address}}</td>
                            <td>{{item.cargoPhone.substring(0,3)+'****'+item.cargoPhone.substring(7)}}</td>
                            <td class="pain-option">
                                <div class="pain-edit">
                                    <span @click="addressOperation(2,item)">{{$t('common.modify')}}</span>
                                </div>
                                <div class="pain-delete">
                                    <span @click="deleteAddress(item)">{{$t('common.delete')}}</span>
                                </div>
                            </td>
                            <td>
                                <div
                                    class="setDefault"
                                    v-if="item.defaultFlag == 1"
                                >{{$t('addressList.defalutAdress')}}</div>
                                <div class="defaultWord" v-else>
                                    <span
                                        @click="setDefault(item)"
                                    >{{$t('addressList.setDefalutAdress')}}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="flex-col no-data" v-else>
                <img src="../../assets/images/goods/unset.png">
                {{$t('addressList.noAdressData')}}
            </div>
        </div>

        <EditDialog
            :id="editDialog.id"
            :addressList="addressList"
            :tag="editDialog.tag"
            :destId="editDialog.destId"
            ref="addrEditCom"
            @getAddressList="getAddressList"
        ></EditDialog>
    </div>
</template>
<script>
import { UserService } from "../../api/service";
import EditDialog from "../../components/address/EditDialog";

export default {
    components: {
        EditDialog: EditDialog //弹框组件
    },
    data() {
        return {
            editDialog: {
                id: "",
                destId: "", //组件传递参数
                tag: -1 //默认地址
            }, //修改地址组件参数
            addNumber: 0, //可添加数量
            dialogVisible: false,
            addressList: [] // 地址列表
        };
    },
    metaInfo() {
        return {
            meta: [
                {
                    name: "keyWords",
                    content: "巴龙商城首页"
                }
            ]
        };
    },
    methods: {
        /**
         *设置默认地址
         * @param {*} params
         * id
         * address
         * cargousrName
         * cargoMobile
         * cargoPhone
         * defaultFlag
         * destCode
         */
        setDefault(item) {
            if (item.defaultFlag === 1) return;
            let data = {
                id: item.id,
                address: item.address,
                cargousrName: item.cargousrName,
                cargoMobile: item.cargoMobile,
                cargoPhone: item.cargoPhone,
                defaultFlag: 1,
                destCode: item.districtCode
            };
            UserService.changeAddrInfo(data).then(
                () => {
                    this.getAddressList();
                    this.$message({
                        type: "success",
                        message: this.$t('addressList.setDefalutAdressSuccess')
                    });
                },
                () => {
                    this.$message({
                        type: "info",
                        message: this.$t('addressList.errors')
                    });
                }
            );
        },
        /**
         *地址操作（新增地址/修改地址)
         * @param {*} params
         * infor 相关信息 不为空则为新增
         */
        addressOperation(type, infor) {
            if (type == 1) {
                //新增
                this.editDialog = {
                    destId: null,
                    id: null
                };
            } else {
                //修改
                this.editDialog = {
                    destId: infor.destId,
                    id: infor.id,
                    tag: infor.defaultFlag
                };
            }
            this.$nextTick(() => {
                this.$refs.addrEditCom.titleChange();
            });
            this.$refs.addrEditCom.setDialogViewState();
        },

        /**
         * 删除地址
         * @param param
         * ids   地址列表唯一id
         */
        deleteAddress(item) {
            this.$confirm(this.$t('addressList.deleteAddress'), this.$t('addressList.tips'), {
                confirmButtonText: this.$t('addressList.sure'),
                cancelButtonText: this.$t('addressList.cancel'),
                type: "warning"
            })
                .then(() => {
                    let data = {
                        ids: item.id
                    };
                    UserService.deleteAddrList(data).then(res => {
                        if (res == 1) {
                            this.$message({
                                type: "success",
                                message: this.$t('addressList.deleteSuccess')
                            });
                            this.getAddressList();
                        } else {
                            this.$message({
                                type: "info",
                                message: this.$t('addressList.deleteFail')
                            });
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: this.$t('addressList.deleteFail')
                    });
                });
        },
        /**
         *
         * 获取地址列表
         *  @param {*} params
         * vipUsrId 用户Id
         */
        getAddressList() {
            let data = {
                vipUsrId: Storage.get("USER_INFO").usrId
            };
            UserService.getAddrList(data).then(res => {
                this.addressList = res;
                this.addNumber = 20 - this.addressList.length;
            });
        },
        handleClose(done) {
            this.$confirm(this.$t('addressList.isClose'))
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        }
    },
    created() {
        this.getAddressList();
    }
};
</script>
<style scoped lang="scss">
table tbody {
    display: block;
    height: 600px;
    overflow-y: scroll;
}

table thead,
tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
    font-size: 14px;
}

.flex-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.no-data {
    width: 989px;
    height: 325px;
    border: solid 1px #cccccc;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #999999;
    img {
        margin-bottom: 24px;
    }
}
.pain-icon {
    margin: 0 12px;
    .icon {
        width: 20px;
        height: 20px;
    }
}
.no-add {
    color: #666666;
}
.add {
    cursor: pointer;
    color: rgba(61, 120, 204, 1);
}
.fl-right {
    float: right;
    font-size: 14px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
}
.left-div {
    float: left;
    display: inline-block;
    width: 180px;
    height: 536px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(204, 204, 204, 1);
    margin-top: 32px;
    .first-title {
        margin-top: 45px;
        margin-bottom: 18px;
        font-size: 18px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        padding-left: 31px;
    }
    .item {
        font-size: 14px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(153, 153, 153, 1);
        padding-left: 31px;
        margin-bottom: 17px;
    }
}

.right-div {
    width: 100%;
    float: left;
    display: inline-block;
    margin-top: 30px;
    .right-item {
        font-size: 14px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        margin-bottom: 27px;
    }
    .rightWord {
        font-size: 14px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(61, 120, 204, 1);
    }
}

.right-title i {
    font-size: 7px;
    color: rgba(204, 204, 204, 1);
}
.userHeader {
    width: 60px;
    height: 60px;
    border-radius: 50%;
}
.right-content {
    .content-title {
        width: 100%;
        height: 50px;
        padding-left: 19px;
        line-height: 50px;
        background: rgba(245, 245, 245, 1);
    }
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(204, 204, 204, 1);
    background: rgba(255, 255, 255, 1);
    width: 100%;
    display: inline-block;
    .content {
        margin-left: 120px;
        margin-top: 53px;
        width: 300px;
    }
}

.com-table {
    td:nth-of-type(1),
    th:nth-of-type(1) {
        text-align: left;
        padding-left: 30px;
        width: 16%;
    }
    td:nth-of-type(2) {
        width: 29%;

        word-break: break-all;
    }
    th:nth-of-type(2) {
        width: 27%;
    }
    th:nth-of-type(2),
    td:nth-of-type(2) {
        padding: 0px 30px;
    }
    th:nth-of-type(3),
    td:nth-of-type(3) {
        width: 16%;
    }
    th:nth-of-type(4),
    td:nth-of-type(4) {
        width: 16%;
    }
    th:nth-of-type(5),
    td:nth-of-type(5) {
        width: 13%;
    }
}
.pain-tr {
    height: 90px;
}
.pain-option .pain-delete,
.pain-option .pain-edit {
     cursor: pointer;
    width: 50%;
    text-align: center;
    font-size: 14px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(61, 120, 204, 1);
    display: inline-block;
}
.setDefault {
     cursor: pointer;
    display: inline-block;
    width: 90px;
    line-height: 32px;
    height: 32px;
    background: rgba(245, 243, 239, 1);
    border: 1px solid rgba(181, 159, 127, 1);
    font-size: 14px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(181, 159, 127, 1);
}
.defaultWord {
    font-size: 14px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(61, 120, 204, 1);
    span {
           cursor: pointer;
    }
}
@media screen and (max-width: 1200px) {
}
</style>
