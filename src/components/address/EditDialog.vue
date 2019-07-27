
<template>
    <div class="thanksPage">
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            @close="cancelOperation()"
            width="697px"
        >
            <el-form
                ref="rulesAddress"
                :rules="rulesAddress"
                :model="addressInfo"
                label-width="100px"
            >
                <div class="flex-vcenter">
                    <el-form-item :label="$t('addressList.consignee')" prop="name">
                        <el-input
                            clearable
                            v-model="addressInfo.name"
                            :placeholder="$t('addressList.inputName')"
                        ></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('addressList.phone')" class="input-phone" prop="phone">
                        <el-input
                            clearable
                            :placeholder="$t('addressList.inputPhone')"
                            maxlength="11"
                            v-model="addressInfo.phone"
                        ></el-input>
                    </el-form-item>
                </div>
                <el-form-item :label="$t('addressList.area')" prop="addressModel">
                    <el-cascader
                        ref="cascader"
                        :options="areaList"
                        v-model="addressInfo.addressModel"
                        @change="areaChange"
                    ></el-cascader>
                </el-form-item>
                <el-form-item :label="$t('addressList.detailAddress')" prop="detail">
                    <el-input
                        type="textarea"
                        clearable
                        :placeholder="$t('addressList.inputdetailAddress')"
                        minlength='2'
                        maxlength='40'
                        v-model="addressInfo.detail"
                    ></el-input>
                </el-form-item>
                <div class="flex-box" style="justify-content: space-between;">
                    <el-form-item :label="' '">
                        <!--<el-switch @change="changeDefault" :disabled="tag?true:false" v-model="defaultStatus" active-color="#13ce66" inactive-color="#C0C0C0"></el-switch>-->
                        <el-checkbox
                            v-model="defaultStatus"
                            @change="changeDefault"
                        >{{$t('addressList.setDefault')}}</el-checkbox>
                    </el-form-item>
                    <div class="flex-box operation">
                        <throttle :time="1000" events="click" :isDebounce="true">
                            <button
                                class="sure"
                                type="button"
                                @click="addressOperation('rulesAddress')"
                            >{{$t('addressList.sure')}}</button>
                        </throttle>
                        <button
                            class="cancel"
                            type="button"
                            @click="cancelOperation()"
                        >{{$t('addressList.cancel')}}</button>
                    </div>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { cityData } from "../../assets/js/cityData";
import { Cascader } from "element-ui";
import { UserService } from "../../api/service";
import { validateAccount } from "../../mixins/validateAccount";
import throttle from "../../components/throttle";
export default {
    // 必传属性==>  id:地址id;  destId:地址对应省市区id  tag:当前是否是默认地址(现在是用来判断默认的话就禁用，后面不再禁用修改默认)  addressList:地址列表
    props: ["id", "destId", "tag", "addressList"],
    mixins: [validateAccount],
    components: {
        "el-cascader": Cascader,
        throttle: throttle
    },
    data() {
        return {
            rulesAddress: {
                name: [
                    {   required: true, 
                        validator:function(rule, value, callback) {
                            if (!value||value==''||value.length < 2 || value.length > 15) {
                                return callback(new Error('收货人姓名长度需2-15字符'));
                            } else {
                                callback();
                            }
                        }, 
                        trigger: "blur" 
                    }
                ],
                phone: [
                    {
                        required: true,
                        validator: this.validatePhone,
                        trigger: "blur"
                    }
                ],
                addressModel: [
                    { required: true, message: this.$t('addressList.choiceArea'), trigger: "blur" }
                ],
                detail: [
                    {
                        required: true,
                        validator: this.validateAdrressDetail,
                        trigger: "blur"
                    }
                ]
            },
            painDisabled: true,
            areaList: [], // 表单可选地址列表
            storeTakeForm: {
                // 门店自取表单
                username: "",
                phone: "",
                addressModel: [] //级联选择器v-model
            },
            dialogTitle: "", //弹框标题
            defaultStatus: false, //默认状态
            dialogVisible: false, //是否显示
            addressInfo: {
                name: "", //姓名
                phone: "", //联系方式
                addressModel: [], //省市区级联
                addressId: "", // 地址Id
                detail: "", //详细地址
                setDefault: "" //默认值
            }
        };
    },
    methods: {
        /**
         * 取消操作
         *
         */
        cancelOperation() {
            this.emptyVlaue();
            this.dialogVisible = false;
            this.$nextTick(() => {
                this.$refs.rulesAddress.resetFields();
            });
        },
        /**
         * 选择省市区
         * @param
         * value  数组省市区
         */
        areaChange(value) {
            if (value) this.addressInfo.addressId = value[2];
            this.addressModel = [
                this.$refs.cascader.currentLabels[0],
                this.$refs.cascader.currentLabels[1],
                this.$refs.cascader.currentLabels[2]
            ];
        },
        /**
         * 设置弹窗状态
         *
         */
        setDialogViewState() {
            this.dialogVisible = !this.dialogVisible;
            this.defaultStatus = false;
        },
        /**
         * 设置默认地址
         * @param boolean
         * checked 选择状态 true/false
         */
        changeDefault(checked) {
            checked
                ? (this.addressInfo.setDefault = 1)
                : (this.addressInfo.setDefault = 0);
        },
        /**
         * 清空地址已选值
         */
        emptyVlaue() {
            this.addressInfo = {
                name: "",
                phone: "",
                addressModel: [],
                addressId: "",
                detail: "",
                setDefault: ""
            };
        },
        /**
         * 地址操作
         * @param param
         * id   地址列表唯一id
         * address 地址详情
         * cargousrName 姓名
         * cargoMobile 联系方式
         * cargoPhone 联系方式
         * defaultFlag 默认地址选择
         * destCode 地址id
         */
        async addressOperation(rulesAddress) {
            let addrData = {
                id: this.id != null ? parseInt(this.id) : this.id,
                address: this.addressInfo.detail,
                cargousrName: this.addressInfo.name,
                cargoMobile: this.addressInfo.phone,
                cargoPhone: this.addressInfo.phone,
                defaultFlag:
                    this.addressList.length == 0 ? 1 : this.addressInfo.setDefault,
                destCode: this.addressInfo.addressId
            };
            this.$refs[rulesAddress].validate(async valid => {
                if (valid) {
                    await UserService.changeAddrInfo(addrData).then(
                        () => {
                            this.$message({
                                type: "info",
                                message:
                                    this.id != null ? this.$t('addressList.changeAddressSuccess') : this.$t('addressList.addAddressSuccess')
                            });
                            this.dialogVisible = false;
                            this.$emit("getAddressList");
                            this.emptyVlaue();
                        },
                        () => { }
                    );
                }
            });
        },
        /**
         * 获取地址详情
         * @param param
         */
        getAddressDetail() {
            let data = {
                addressId: this.id,
                destId: this.destId
            };
            UserService.getAddrDetail(data).then(res => {
                this.addressInfo = {
                    name: res.cargousrName,
                    phone: res.cargoPhone,
                    addressId: res.districtCode,
                    province: res.provinceCnName,
                    district: res.districtCnName,
                    city: res.cityCnName,
                    detail: res.address,
                    setDefault: res.defaultFlag,
                    addressModel: [res.provinceCode, res.cityCode, res.districtCode]
                };
                this.addressInfo.setDefault == 1
                    ? (this.defaultStatus = true)
                    : (this.defaultStatus = false);
            });
        },
        /**
         * 父组件调用一进来就判断
         * @param param
         */
        titleChange() {
            this.id == null
                ? (this.dialogTitle = "新增收货地址")
                : ((this.dialogTitle = "修改收货地址"), this.getAddressDetail());
        }
    },
    watch: {
        "addressInfo.name"(value) {
            this.$nextTick(() => {
                this.addressInfo.name = window.filterInput(value);
            });
        },
        "addressInfo.detail"(value) {
            this.$nextTick(() => {
                this.addressInfo.detail = window.filterInput(value);
            });
        },

        "addressInfo.phone"(value) {
            this.$nextTick(() => {
                this.addressInfo.phone = window.filterPhone(value);
            });
        }
    },
    mounted() {
        this.areaList = window.c_disposeCityData(cityData);
    }
};
</script>

<style lang="scss" scoped>
/deep/.el-input {
    width: 200px;
}
.half-row {
    display: inline-block;
    width: 50%;
    .row-label {
        display: inline-block;
        width: 80px;
    }
}
.full-row {
    margin-top: 20px;
    .row-label {
        display: inline-block;
        width: 80px;
    }
    .fl {
        float: left;
    }
}
.operation {
    button {
        width: 140px;
        height: 44px;
        font-size: 16px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
    }
    .sure {
        width: 140px;
        height: 44px;
        background: rgba(181, 159, 127, 1);
        border: 1px solid rgba(181, 159, 127, 1);
        color: rgba(255, 255, 255, 1);
    }
    .cancel {
        margin-left: 12px;
        color: rgba(181, 159, 127, 1);
    }
}
</style>
