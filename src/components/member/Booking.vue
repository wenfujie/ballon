<template>
  <div id="booking">
    <!-- 预约量体-->
    <el-dialog
      :title="bookingForm.id==''?$t('bookingAlert.booking'):$t('bookingAlert.updated')"
      :visible.sync="bookingVisible"
      width="697px"
      height="449px"
      @close="emptyData()"
    >
      <el-form ref="rulesBooking" :rules="rulesBooking" :model="bookingForm" label-width="100px">
        <el-form-item class="select-way" prop="way" :label="$t('bookingAlert.way')">
          <el-radio-group v-model="bookingForm.way" @change="selectBookingWay">
            <el-radio label="1">{{$t('bookingAlert.storeBody')}}</el-radio>
            <el-radio label="2">{{$t('bookingAlert.goBody')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 到店量体 选择门店-->
        <el-form-item
          :label="$t('bookingAlert.bodyAddress')"
          prop="dptName"
          class="select-store"
          v-if="bookingForm.way == '1'"
        >
          <el-button type="primary" @click="selectStoreF">{{$t('bookingAlert.selectStore')}}</el-button>
          <div v-if="bookingForm.dptName!=''">{{bookingForm.dptName}}</div>
          <div
            v-if="bookingForm.stateNameStore!=''"
          >{{bookingForm.stateNameStore}}{{bookingForm.cityNameStore}}{{bookingForm.destNameStore}}{{bookingForm.detailAddressWay}}</div>
        </el-form-item>
        <!-- 上门量体 选择地址-->
        <div v-else>
          <el-form-item
            class="select-address"
            prop="addressModel"
            :label="$t('bookingAlert.bodyAddress')"
          >
            <el-cascader
              ref="cascader"
              :options="areaList"
              v-model="bookingForm.addressModel"
              @change="areaChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            :label="$t('bookingAlert.detailAddress')"
            prop="detailAddress"
            class="textarea-measureMemo detail-address"
          >
            <el-input type="textarea" v-model="bookingForm.detailAddress" placeholder="请输入详细地址"></el-input>
          </el-form-item>
        </div>
        <div class="flex-vcenter">
          <el-form-item :label="$t('bookingAlert.cargousrName')" prop="name">
            <el-input v-model="bookingForm.name" placeholder="请输入着装人姓名" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('amountBody.gender')" prop="sex">
            <el-checkbox-group :min="1" v-model="bookingForm.sexList" @change="sexCheckBox">
              <el-checkbox label="0">{{$t('bookingAlert.men')}}</el-checkbox>
              <el-checkbox label="1">{{$t('bookingAlert.women')}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <el-form-item :label="$t('bookingAlert.phone')" class="input-phone" prop="cargoMobile">
          <el-input
            :placeholder="$t('bookingAlert.inputPhone')"
            clearable
            maxlength="11"
            v-model="bookingForm.cargoMobile"
          ></el-input>
        </el-form-item>
        <div class="flex-vcenter">
          <el-form-item :label="$t('bookingAlert.bookingTime')" prop="date">
            <!-- 上门量体 时间-->

            <el-select
              class="select-time"
              v-model="bookingForm.date"
              clearable
              :placeholder="$t('bookingAlert.selectDate')"
              :disabled="disabledDateWayOne"
              @change="changeDate"
              v-if="bookingForm.way=='1'"
            >
              <el-option
                v-for="(item,index) in dateList"
                :key="index"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
            <!-- 到店量体 时间-->
            <el-select
              class="select-time"
              v-else
              v-model="bookingForm.date"
              clearable
              :placeholder="$t('bookingAlert.selectDate')"
              :disabled="disabledDateWayTwo"
              @change="changeDate"
            >
              <el-option
                v-for="(item,index) in dateList"
                :key="index"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="form-select-time" prop="time">
            <el-select
              class="select-time time-style"
              v-model="bookingForm.time"
              clearable
              :placeholder="$t('bookingAlert.selectTime')"
              :disabled="bookingForm.date==''?true:false"
              @change="changeTime"
            >
              <el-option v-for="(item,index) in hourList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item
          :label="$t('bookingAlert.besdc')"
          prop="measureMemo"
          class="textarea-measureMemo measureMemo"
        >
          <el-input
            type="textarea"
            :placeholder="$t('bookingAlert.inputMeasureMemo')"
            v-model="bookingForm.measureMemo"
            maxlength="100"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <button
          class="submit-style"
          type="button"
          v-if="entrance!=3"
          @click="submitBooking('rulesBooking')"
        >{{$t('common.sure')}}</button>

        <el-button
          type="primary"
          @click="getBillType()"
          v-if="entrance!=2&&entrance!=1"
        >{{$t('common.sure')}}</el-button>
        <el-button @click="emptyData()">{{$t('common.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!-- 选择门店 -->
    <SelectStore
      ref="selectStoreC"
      @selectStoreF="selectStoreF"
      :addressModel="bookingForm.addressModel"
      @getTime="getTime"
      :bookingForm="bookingForm"
      @clearTime="clearTime"
    />
    <div id="allMap"></div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { Cascader } from "element-ui";
import { Volume } from "../../api/service";
import SelectStore from "../../components/member/SelectStore";
import { validateAccount } from "../../mixins/validateAccount";

export default {
  props: ["entrance"],
  mixins: [validateAccount],
  components: {
    "el-cascader": Cascader,
    SelectStore
  },
  data() {
    return {
      rulesBooking: {
        dptName: [
          {
            required: true,
            message: this.$t("bookingAlert.rulesDptName")
          }
        ],
        way: [
          {
            required: true,
            message: this.$t("bookingAlert.rulesWay")
          }
        ],
        addressModel: [
          {
            required: true,
            message: this.$t("bookingAlert.rulesAddress")
          }
        ],
        detailAddress: [
          {
            required: true,
            validator: this.validateAdrressDetail
          }
        ],
        name: [
          {
            required: true,
            message: this.$t("bookingAlert.rulesName")
          }
        ],

        cargoMobile: [
          {
            required: true,
            validator: this.validatePhone
          }
        ],
        date: [
          {
            required: true,
            message: this.$t("bookingAlert.rulesDate")
          }
        ],
        time: [
          {
            required: true,
            message: this.$t("bookingAlert.rulesTime")
          }
        ]
      },
      bookingForm: {
        way: "1", //方式
        id: "", // 量体唯一id
        dptName: "", //店铺名称
        dptId: Storage.get("USER_INFO").shopId, //店铺id 默认取缓存 选择门店 拿门店的dptId
        destCode: "", //区编码
        addressModel: Storage.get("POSITION").location, //区域地址
        name: "", //姓名
        sexList: ["0"], //性别
        detailAddress: "", //上面量体-详情地址
        stateName: Storage.get("POSITION").locationTxt[0], //上面量体-区
        cityName: Storage.get("POSITION").locationTxt[1], //上面量体-市
        destName: Storage.get("POSITION").locationTxt[2], //上面量体-省
        detailAddressWay: "", // 到店量体--门店详细地址
        stateNameStore: "", //到店量体 - 区
        cityNameStore: "", //到店量体 - 市
        destNameStore: "", //到店量体 - 省
        dptCode: "",
        store: "-1",
        shopCode: Storage.get("USER_INFO").shopCode, //门店code
        busContsCode: Storage.get("properties").busContsCode,
        usrId: Storage.get("USER_INFO").usrId,
        shopId: Storage.get("USER_INFO").shopId, //门店id
        companyId: Storage.get("COMPANYID").company_id, //公司id
        cargoMobile: "", //联系方式
        date: "", //日期
        time: "", //时间
        measureMemo: "", //备注
        orderTime: "",
        billCode: "",
        msrWayCode: ""
      },
      bthLock: false,
      rtlOrdDtId: "",
      dateDisabled: false, //日期是否禁用
      hourList: [], //可预约时间列表
      pickerOptions: {}, //element禁选
      bookingVisible: false, //预约是否显示
      areaList: [], //区域列表
      dateLimit: [], //可预约日期列表
      dateList: [],
      statusId: "",
      dpCode: ""
    };
  },
  methods: {
    /**
     * 改变门店的时候清空时间
     * @param
     *
     */
    clearTime() {
      this.bookingForm.orderTime = "";
      this.bookingForm.date = "";
      this.bookingForm.time = "";
    },
    /**
     * 获取订单的状态
     * @param
     *
     */
    async getBillType() {
      let data = {
        usrId: this.bookingForm.usrId,
        ownCompanyId: this.bookingForm.companyId,
        companyId: this.bookingForm.companyId,
        ordHdCode: this.$store.state.dressed.idArr[0],
        buscontsCode: this.bookingForm.busContsCode
      };
      const RES = await Volume.getBillType(data);
      //与订单有关联的预约单
      let saleOrdDtList = [];
      RES.forEach(item => {
        if (item.measureOpCode == "D_MSROPMSR") {
          saleOrdDtList = [{ saleOrdDtId: this.$store.state.dressed.idArr[1] }];
        }
      });
      this.submitBooking("rulesBooking", saleOrdDtList);
    },
    /**
     * 选择时间判断是否对后台返回数据做改变
     * @param
     *
     */
    changeTime() {
      this.bookingForm.orderTime = `${this.bookingForm.date} ${this.bookingForm.time}:00`;
    },
    /**
     * 选择日期
     * @param
     * 根据日期拿到时间列表数据
     */
    changeDate(val, type) {
      this.dateLimit.forEach(item => {
        if (item.ymd == val) {
          this.hourList = item.hourList;
        }
      });
      if (type == "getTime") return;
      this.bookingForm.time = "";
    },
    /**
     * 时间范围
     * @param
     *
     * 根本后台配置的时间拿到日期时间列表
     */
    async getTime(dptCode, type) {
      console.log(dptCode, "dptCodedptCodedptCode");
      let data = {
        dptCode:
          this.bookingForm.way == "1" ? dptCode : this.bookingForm.shopCode,
        buscontscode: this.bookingForm.busContsCode,
        usrId: this.bookingForm.usrId,
        companyId: this.bookingForm.companyId,
        cardNo: Storage.get("CARDNO").cardNo
      };
      this.dpCode = data.dptCode;
      const RES = await Volume.getVolumeTime(data);
      let dateArr = Object.keys(RES);
      if (dateArr.length === 0) return this.$message("返回时间列表为空");
      this.dateLimit = RES;
      this.dateList = this.dateLimit.map(item => {
        return {
          value: item.ymd
        };
      });

      if (type == 1) {
        this.changeDate(this.bookingForm.date, "getTime");
      }
    },
    /**
     * 选择门店
     * @param
     * type 1 子组件里面走
     *
     */
    selectStoreF(type, storeInfor, store) {
      if (type === 1) {
        let {
          dptId,
          provinceName,
          cityName,
          districtName,
          address,
          dptCode,
          dptName
        } = storeInfor;
        this.bookingForm = {
          ...this.bookingForm,
          way: "1",
          dptName,
          store,
          dptId,
          dptCode,
          detailAddressWay: address,
          stateNameStore: provinceName,
          cityNameStore: cityName,
          destNameStore: districtName
        };
      }
      // store  1. -1 添加  2.不为-1 为修改
      if (
        this.bookingForm.store != "-1" &&
        this.bookingForm.msrWayCode == "D_MSRSHOP"
      ) {
        this.$refs.selectStoreC.selectStore("", 1);
        this.$refs.selectStoreC.storeShow();
      } else {
        this.$refs.selectStoreC.getShopAddress();
        this.$refs.selectStoreC.storeShow(1);
      }
    },
    /**
     * 选择性别
     * @param
     *
     */
    sexCheckBox(value) {
      this.bookingForm.sexList = [];
      this.bookingForm.sexList = [value[1]];
    },
    /**
     * 数据清空 /恢复原始数据
     * @param
     *
     */
    emptyData() {
      this.bookingVisible = false;
      // this.bthLock = false;
      this.bookingForm = {
        ...this.bookingForm,
        id: "",
        dptId: Storage.get("USER_INFO").shopId,
        dptName: "",
        way: "1", //方式
        destCode: "", //区编码
        addressModel: Storage.get("POSITION").location, //区域地址
        detailAddress: "", //详情地址
        name: "", //姓名
        sexList: ["0"], //性别 默认为男
        stateName: Storage.get("POSITION").locationTxt[0],
        cityName: Storage.get("POSITION").locationTxt[1],
        destName: Storage.get("POSITION").locationTxt[2],
        stateNameStore: "",
        cityNameStore: "",
        destNameStore: "",
        busContsCode: Storage.get("properties").busContsCode,
        shopCode: Storage.get("USER_INFO").shopCode, //门店code
        usrId: Storage.get("USER_INFO").usrId,
        shopId: Storage.get("USER_INFO").shopId,
        cargoMobile: "", //联系方式
        date: "", //日期
        time: "", //时间
        measureMemo: "", //备注
        store: ""
      };
      this.$refs.rulesBooking.resetFields();
    },

    /**
     * 选择预约方式
     * @param
     *
     */

    selectBookingWay(way) {
      this.bookingForm.way = way;
      //方式不同地址不同，清空时间，重选
      this.bookingForm.time = "";
      this.bookingForm.date = "";


      if (way == 2) return this.getTime();
    },
    /**
     * 预约弹框显示 子组件
     * @param
     *booingInfor 预约信息
     *type 存在就是修改
     */
    bookingShow(booingInfor, statusId, billCode, isOrderBooking) {
      this.bookingVisible = !this.bookingVisible;
      this.bookingForm.billCode = billCode;

      //我的量体 选择着装人 不走修改 页面只能新增
      if (this.entrance == 2 || this.entrance == 3) return;
      //id 不存在则为新增
      if (booingInfor == undefined) return;

      this.dpCode = booingInfor.dptCode;
      this.bookingForm = {
        ...this.bookinForm,
        isOrderBooking: isOrderBooking,
        sexList: [booingInfor.sexCode == "D_MALE" ? "0" : "1"],
        msrWayCode: booingInfor.msrWayCode,
        way: booingInfor.msrWayCode == "D_MSRSHOP" ? "1" : "2",
        stateName: booingInfor.stateName,
        cityName: booingInfor.cityName,
        destName: booingInfor.destName,
        detailAddressWay: booingInfor.address,
        stateNameStore:
          booingInfor.msrWayCode == "D_MSRVISIT" ? "" : booingInfor.stateName,
        cityNameStore:
          booingInfor.msrWayCode == "D_MSRVISIT" ? "" : booingInfor.cityName,
        destNameStore:
          booingInfor.msrWayCode == "D_MSRVISIT" ? "" : booingInfor.destName,
        id: booingInfor.id,
        cargoMobile: booingInfor.cargoMobile,
        name: booingInfor.cargousrName,
        detailAddress:
          booingInfor.msrWayCode != "D_MSRVISIT" ? "" : booingInfor.address,
        shopId: booingInfor.dptId,
        usrId: booingInfor.usrId,
        dptId: booingInfor.msrWayCode == "D_MSRVISIT" ? "" : booingInfor.dptId,
        dptCode: booingInfor.dptCode,
        statusId: statusId,
        busContsCode: Storage.get("properties").busContsCode,
        dptName:
          booingInfor.msrWayCode == "D_MSRVISIT" ? "" : booingInfor.dptName,
        shopCode: Storage.get("USER_INFO").shopCode,
        measureMemo: booingInfor.measureMemo,
        date: booingInfor.orderTime.substr(0, 10),
        time: booingInfor.orderTime.substr(10, 12),
        orderTime: booingInfor.orderTime,
        addressModel: [
          booingInfor.stateCode,
          booingInfor.cityCode,
          booingInfor.destCode
        ]
      };
        this.getTime(this.bookingForm.dptCode, 1);
    },

    /**
     * 选择省市区
     * @param
     * value  数组省市区
     */
    areaChange(value) {
      if (value) this.bookingForm.destCode = value[2];
      this.bookingForm = {
        ...this.bookingForm,
        stateName: this.$refs.cascader.currentLabels[0],
        cityName: this.$refs.cascader.currentLabels[1],
        destName: this.$refs.cascader.currentLabels[2]
      };
    },
    /**
     * 获取上门量体的限制时间
     * @param
     * 未选门店 禁用时间
     */
    async getMyVisitedAdress() {
      let data = {
        usrId: this.bookingForm.usrId,
        companyId: this.bookingForm.companyId,
        cardNo: Storage.get("CARDNO").cardNo,
        masterWayCode: "D_MSRVISIT"
      };
      const RES = await Volume.getDoorAddr(data);
      let provinceMap = {},
        cityMap = {},
        countyMap = {};

      RES.forEach(item => {
        provinceMap[item.provinceCode] = item.provinceName;
        cityMap[item.cityCode] = item.cityName;
        countyMap[item.districtCode] = item.districtName;
      });
      let visitList = {
        province_list: provinceMap,
        city_list: cityMap,
        county_list: countyMap
      };
      this.areaList = window.c_disposeCityData(visitList);
    },
    /**
     * 提交预约
     * @param
     * id 修改的时候传递id
     */
    async submitBooking(rulesBooking, saleOrdDtList) {
      // console.log(this.bthLock, "this.bthLock");
      // if (this.bthLock == true) return;
      // this.bthLock = true;

      let data = {
        dptCode: this.dpCode,
        buscontscode: this.bookingForm.busContsCode,
        cardNo: Storage.get("CARDNO").cardNo,
        cargousrSex: this.bookingForm.sexList[0] == "0" ? "D_MALE" : "D_FEMALE",
        msrWayCode: this.bookingForm.way == 1 ? "D_MSRSHOP" : "D_MSRVISIT",
        cargousrName: this.bookingForm.name,
        cargoMobile: this.bookingForm.cargoMobile,
        stateName:
          this.bookingForm.way == 1
            ? this.bookingForm.stateNameStore
            : this.bookingForm.stateName,
        cityName:
          this.bookingForm.way == 1
            ? this.bookingForm.cityNameStore
            : this.bookingForm.cityName,
        destName:
          this.bookingForm.way == 1
            ? this.bookingForm.destNameStore
            : this.bookingForm.destName,
        usrId: this.bookingForm.usrId,
        dptId: this.bookingForm.way == 1 ? this.bookingForm.dptId : "",
        shopId: this.bookingForm.shopId,
        measureMemo: this.bookingForm.measureMemo
      };

      //修改的时候传递
      if (this.bookingForm.id != "") {
        data.id = this.bookingForm.id;

        data.orderTime = this.bookingForm.orderTime;
      } else {
        data.orderTime = `${this.bookingForm.date} ${this.bookingForm.time}:00`;
      }
      //选择着装人的时候传递 订单id
      if (this.entrance == 3) {
        data.rtlOrdHdCode = this.bookingForm.billCode;
        data.saleOrdDtList = saleOrdDtList;
      }
      //上门量体的时候传详细地址
      console.log(
        this.bookingForm.detailAddressWay,
        "this.bookingForm.detailAddressWay"
      );
      if (this.bookingForm.way == 2) {
        data.address = this.bookingForm.detailAddress;
      } else {
        data.address = this.bookingForm.detailAddressWay;
      }

      this.$refs[rulesBooking].validate(async valid => {
        if (valid) {
          await Volume.saveVolume(data)
            .then(() => {
              // 新增一个回调地址
              let path = "/order-list";
              if (!!this.$route.query.callbackUrl)
                path = this.$route.query.callbackUrl;
              //入口 3 选择着装人  1 我的预约进入    2 我的量体进入
              if (this.entrance == 3) {
                this.$router.push({
                  path: path,
                  query: {
                    entrance: "我的预约"
                  }
                });
              } else if (this.entrance == 1) {
                //从我的订单新增预约量体 到我的预约修改 预约量体 过来
                if (this.bookingForm.isOrderBooking == "订单新增预约量体") {
                  this.$router.push({
                    path: path,
                    query: {
                      entrance: "我的预约"
                    }
                  });
                  return;
                }
                //搜索相应的状态
                this.bookingForm.statusId == ""
                  ? this.$emit("getVolumeList")
                  : this.$emit("getVolumeList", this.bookingForm.statusId);
              } else {
                this.$emit("getVolumeList");
              }
              this.$message({
                type: "info",
                message:
                  this.bookingForm.id == ""
                    ? this.$t("bookingAlert.bookingSucess")
                    : this.$t("bookingAlert.upadtedSucess")
              });
              this.emptyData();
              // this.bthLock = false;
            })
            .catch(err => {
              // this.bthLock = false;
              if (err.errorCode == 88050511) this.$message(err.errorMsg);
              return;
            });
        }
      });
    }
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    /**
     * 上门量体
     * @param
     * 未选门店 禁用时间
     */
    disabledDateWayOne: function() {
      return this.bookingForm.dptName == "" ? true : false;
    },
    /**
     * 上门量体
     * @param
     * 未定位到地址 禁用时间
     */
    disabledDateWayTwo: function() {
      return this.bookingForm.addressModel == "" ? true : false;
    }
  },
  watch: {
    "bookingForm.dptName"(txt) {
      this.$nextTick(() => {
        if(txt=='') return
        this.$refs.rulesBooking.clearValidate("dptName");
      });
    },
    "bookingForm.name"(value) {
      this.$nextTick(() => {
        this.bookingForm.name = window.filterInput(value);
      });
    },
    "bookingForm.cargoMobile"(value) {
      this.$nextTick(() => {
        this.bookingForm.cargoMobile = window.filterPhone(value);
      });
    }
  },
  created() {},
  mounted() {
    this.getMyVisitedAdress();
  }
};
</script>
<style lang="scss" scoped>
.submit-style {
  background-color: #b59f7f !important;
  border-color: #b59f7f !important;
  padding: 12px 20px;
  font-size: 14px;
  outline: 0;
  margin: 0;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 0px;
  width: 140px;

  color: #fff;
  border: none;
  margin-right: 20px;
}

/deep/.el-input {
  width: 200px;
}
/deep/ .el-dialog__body {
  padding: 10px 20px 10px 20px !important;
}
/deep/ .el-dialog__header {
  padding: 40px 40px 0px;
}
/deep/.el-dialog__footer {
  padding: 0px 20px 20px;
  margin-left: 100px;
  text-align: left;
}
/deep/.el-radio + .el-radio {
  margin-left: 76px;
}

/deep/.el-form-item__content {
  width: 220px;
}

.select-address {
  /deep/.el-input {
    width: 310px;
  }
}
.select-store {
  /deep/.el-form-item__content {
    width: 500px;
    line-height: 45px;
  }
  div {
    height: 25px;
  }
}
.select-way {
  /deep/.el-form-item__content {
    width: 400px;
  }
}
.form-select-time {
  /deep/.el-form-item__error {
    left: -134px;
  }
}

.select-time {
  /deep/.el-input {
    width: 160px;
  }
}
.time-style {
  margin-left: -140px;
}
.textarea-measureMemo {
  /deep/.el-form-item__content {
    width: 528px;
  }
}
.measureMemo {
  /deep/.el-form-item__content {
    /deep/.el-textarea__inner {
      min-height: 100px !important;
    }
  }
}
.detail-address {
  /deep/.el-form-item__content {
    /deep/.el-textarea__inner {
      min-height: 50px !important;
    }
  }
}
/deep/.el-button {
  width: 140px;
  height: 44px;
  border-radius: 0px;
}
</style>
