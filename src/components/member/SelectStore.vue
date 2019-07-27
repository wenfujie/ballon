<template>
  <div id="selectStore">
    <el-dialog title="" :visible.sync="storeVisible" width="900px" @close="emptyData">
      <div class="select-store">
        <div class="store-menu">
          <span class="tilte">{{this.$t("selectStore.storeArea")}}</span>
          <el-cascader ref="cascader" :options="areaList" v-model="addressModel" @change="areaChange">
          </el-cascader>
        </div>
        <div class="store-infor  flex-center flex-start">
          <span class="tilte">{{this.$t("selectStore.selectStore")}}</span>
          <ul class="store-list scroll_rest">
            <el-radio-group v-model="store" v-if="addressList.length>0">
              <el-radio v-for="(item,index) in addressList" :key="index" @change="selectStore" :label="index">{{item.dptName}}
                <div class="address-infor">{{item.provinceName}}{{item.cityName}}{{item.districtName}}{{item.address}}</div>
              </el-radio>
            </el-radio-group>
            <div class="no-address flex-box flex-vbox flex-vcenter" v-else>
              <img src="../../assets/images/goods/unset.png">
              <span>{{this.$t("selectStore.noStore")}}</span>
            </div>
          </ul>

          <div class="map-position" id="allMap" ref="allmap">
          </div>
        </div>
        <div class="dialog-button flex-center">
          <button class="sure" @click="sure">{{this.$t("common.sure")}}</button>
          <button class="cancel" @click="emptyData()">{{this.$t("common.cancel")}}</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { cityData } from "../../assets/js/cityData";
import { Cascader } from "element-ui";
import { Volume } from "../../api/service";
import { MP } from "../../utils/map";
import { mapState } from "vuex";
export default {
  props: ["bookingForm"],
  components: {
    "el-cascader": Cascader
  },
  data() {
    return {
      markers: [],
      infoActive: -1,
      store: -1,
      locationTxt: Storage.get("POSITION").locationTxt, //[省，市，区]

      ownCompanyId: Storage.get("COMPANYID").company_id, //公司id
      addressInfor: {
        stateName: Storage.get("POSITION").locationTxt[0], //区
        cityName: Storage.get("POSITION").locationTxt[1], //市
        destName: Storage.get("POSITION").locationTxt[2] //省
      },
      addressModel: Storage.get("POSITION").location, //[省，市，区] 编码
      storeVisible: false, //选择门店是否显示
      areaList: [], //区域列表
      addressList: [], //可用门店地址列表
      map: "", // 地图实例
      currentCity: "", //当前的城市
      storeInfor: [] //已选地址信息
    };
  },
  methods: {
    /**
     *确定选择地址
     * @param
     *selectPlease
     */
    sure() {
      if (this.addressList.length == 0)
        return this.$message(this.$t("selectStore.noData"));
      if (this.storeInfor.length == 0)
        return this.$message(this.$t("selectStore.selectPlease"));
      this.$emit("getTime", this.storeInfor.dptCode);
      this.$emit("selectStoreF", 1, this.storeInfor, this.store);
    },
    /**
     * 设置地图标识颜色前的判断
     * @param
     *item 当前点击的门店信息
     *index 索引
     */
    setMarkerStyle(item, index) {
      if (this.infoActive == index) {
        return;
      }
      if (this.infoActive != -1) {
        this.setMarkersColor(
          this.infoActive,
          require("../../assets/images/address/location_select_no.png")
        );
      }
      this.infoActive = index;
      this.setMarkersColor(
        index,
        require("../../assets/images/address/location_select.png")
      );
    },

    /**
     * 设置地图标识颜色
     * @param
     *index 索引
     *iconUrl 图标样式
     */
    setMarkersColor(index, iconUrl) {
      let icon = new BMap.Icon(iconUrl, new BMap.Size(24, 33), {
        anchor: new BMap.Size(24 / 2, 33)
      }); //显示图标大小
      this.markers[index].setIcon(icon); //设置标签的图标为自定义图标
    },
    /**
     * 地图点击事件
     * @param
     *e 当前的event
     */
    attribute(e) {
      let lat = e.currentTarget.point.lat;
      let lng = e.currentTarget.point.lng;
      this.map.panTo(new BMap.Point(lng, lat));
      //遍历门店，点击图标选中门店
      this.addressList.forEach((item, index) => {
        if (item.lon == lng && item.lat == lat) {
          this.setMarkerStyle(item, index);
          this.store = index;
          this.storeInfor = this.addressList[index];
          this.storeInfor.dptCode = this.addressList[index].dptCode;
        }
      });
    },
    createdMap() {
      MP("kyQyvOBQwLUVrHieFzUcfV1TZt0slzlG").then(BMap => {
        this.map = new BMap.Map("allMap");
        let point = "",
          marker = "",
          positon = "",
          top_left_navigation = new BMap.NavigationControl(); //右下角，添加默认缩放平移控件
        this.map.enableScrollWheelZoom(true); // 缩放
        this.map.addControl(top_left_navigation);
        this.addressInfor.destName == "全部"
          ? (positon = this.addressInfor.cityName)
          : (positon = this.addressInfor.destName);
        if (this.addressList.length == 0)
          return this.map.centerAndZoom(positon, 12);
        let markers = [];
        let infoActive = -1;
        this.addressList.forEach((item, index) => {
          point = new BMap.Point(item.lon, item.lat);
          this.map.centerAndZoom(point, 12);
          let storeIcon = new BMap.Icon(
            require("../../assets/images/address/location_select_no.png"),
            new BMap.Size(24, 33),
            {
              anchor: new BMap.Size(24 / 2, 33)
            }
          ); //显示图标大小
          marker = new BMap.Marker(point, { icon: storeIcon }); // 创建标注
          marker.setIcon(storeIcon); //设置标签的图标为自定义图标
          markers.push(marker);
          this.map.addOverlay(marker); // 将标注添加到地图中
          marker.addEventListener("click", this.attribute);
          if (this.bookingForm.dptId && item.dptId == this.bookingForm.dptId) {
            this.store = index;
            this.storeInfor = this.addressList[index];
            infoActive = index;
          }
          this.markers = markers;
          this.infoActive = infoActive;
          if (infoActive != -1) {
            this.setMarkersColor(
              infoActive,
              require("../../assets/images/address/location_select.png")
            );
            setTimeout(() => {
              this.map.panTo(
                new BMap.Point(
                  this.addressList[infoActive].lon,
                  this.addressList[infoActive].lat
                )
              );
            }, 500);
          }
        });
      });
    },
    /**
     * 选择门店  拿到门店id，省市区给父组件传参
     * @param
     *
     */
    selectStore(val, type) {
      //点击单个获取百度地图
      if (type == 1) {
        this.createdMap();
        this.addressList.forEach((item, index) => {
          if (item.dptId == this.bookingForm.dptId) {
            this.store = index;
            this.storeInfor = this.addressList[index];
          }
        });
      } else {
        this.setMarkerStyle(this.storeInfor, this.store);
        this.store = val;
        this.storeInfor = this.addressList[val];
        this.storeInfor.dptCode = this.addressList[val].dptCode;
      }

      this.$emit("clearTime");
      this.map.panTo(new BMap.Point(this.storeInfor.lon, this.storeInfor.lat));
    },

    /**
     * 店面量体地址列表
     * @param
     *
     */
    async getShopAddress() {
      let data = {
        ownCompanyId: this.ownCompanyId,
        stateName: this.addressInfor.stateName,
        cityName: this.addressInfor.cityName,
        cardNo: Storage.get('CARDNO').cardNo,
        buscontscode: "D_BUSCONTS_B2C"
      };
      if (this.addressInfor.destName != "全部") {
        data.destName = this.addressInfor.destName;
      }
      let RES = await Volume.getShopAddr(data);
      this.addressList = RES;
      this.currentCity = this.addressInfor.cityName;
      this.createdMap();
    },
    /**
     * 选择门店弹框显示
     * @param
     *
     */
    storeShow(type) {
      if (type == 1) this.store = "-1";
      this.storeVisible = !this.storeVisible;
    },
    /**
     * 选择门店弹框显示
     * @param
     *
     */
    emptyData() {
      this.storeVisible = false;
      this.addressModel = Storage.get("POSITION").location;
      this.locationTxt = Storage.get("POSITION").locationTxt;
      this.cardNo = Storage.get('CARDNO').cardNo;
      this.ownCompanyId = Storage.get("COMPANYID").company_id;
      this.addressInfor = {
        stateName: Storage.get("POSITION").locationTxt[0],
        cityName: Storage.get("POSITION").locationTxt[1],
        destName: Storage.get("POSITION").locationTxt[2]
      };
      this.store = "-1";
      this.map = "";
      this.currentCity = ""; //当前的城市
      this.storeInfor = []; //已选地址信息
      this.getShopAddress();
    },
    /**
     * 选择省市区
     * @param
     * value  数组省市区
     */
    areaChange(value) {
      if (value) this.addressInfor.addressId = value[2];
      this.addressInfor = {
        stateName: this.$refs.cascader.currentLabels[0],
        cityName: this.$refs.cascader.currentLabels[1],
        destName: this.$refs.cascader.currentLabels[2]
      };
      if (this.addressInfor.destName == "全部") {
        this.store = "";
      }
      this.getShopAddress();
    }
  },
  computed: {
    ...mapState("user", ["userInfo"])
  },
  created() {
    this.getShopAddress();
  },
  mounted() {
    this.areaList = window.c_disposeCityData(cityData);
    this.areaList.forEach(item => {
      item.children.forEach(_item => {
        let option = {
          label: "全部",
          value: ""
        };
        _item.children.unshift(option);
      });
    });
  }
};
</script>

<style lang="scss" scoped >
/deep/.el-radio,
.el-radio__input {
  white-space: normal;
}
.tilte {
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 21px;
  margin-right: 10px;
}
/deep/.el-dialog__body {
  padding: 10px 20px 10px 20px;
}
.select-store {
  .store-menu {
    margin-bottom: 35px;
    /deep/.el-cascader {
      /deep/.el-input {
        width: 310px;
      }
    }
  }
  .store-infor {
    margin-bottom: 53px;
    ul.store-list {
      width: 275px;
      height: 380px;
      overflow-y: scroll;
      .no-address {
        img {
          width: 100px;
          height: 50px;
          margin: 60px 0px 40px 0px;
        }
        span {
          color: #bfbfbf;
        }
      }
      .el-radio-group {
        margin-bottom: 34px;
        /deep/.el-radio {
          width: 100%;
          display: flex;
          display: -webkit-flex;
          display: -moz-flex;
          display: -ms-flexbox;
          margin-bottom: 32px;
          /deep/.el-radio__label {
            font-size: 16px;
            font-family: PingFangSC-Medium;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
            .address-infor {
              margin-top: 10px;
              font-size: 14px;
              font-family: PingFangSC-Medium;
              font-weight: 500;
              color: rgba(153, 153, 153, 1);
            }
          }
        }

        /deep/.el-radio + .el-radio {
          margin-left: 0px;
        }
      }
    }
  }
  .map-position {
    width: 443px;
    height: 380px;
    margin-left: 65px;
  }
  .dialog-button {
    button {
      width: 188px;
      height: 54px;
      font-size: 16px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      line-height: 21px;
    }
    .sure {
      background: rgba(182, 159, 125, 1);
      border: 1px solid rgba(182, 159, 125, 1);
      color: rgba(255, 255, 255, 1);
      margin-right: 53px;
    }
    .cancel {
      color: rgba(182, 159, 125, 1);
      background: rgba(245, 243, 239, 1);
      border: 1px solid rgba(182, 159, 125, 1);
    }
  }
}
</style>
