<template>
  <div class="index min-height">
    <div class="right-div">
      <div class="flex-between">
        <div class="search-people flex-start flex-box">
          <el-input
            clearable
            v-model="peopleDress"
            :placeholder="$t('amountBody.inputDress')"
            @clear="getAmountBodyList"
          ></el-input>

          <div
            class="search-button"
            :style="{background:(isSearch==true? '#B59F7F':'#cccccc')}"
            @click="getAmountBodyList()"
          >{{$t('common.search')}}</div>
        </div>
        <!-- <div class="booking-body" @click="bookingShow()">+{{$t('amountBody.bookingBody')}}</div> -->
      </div>
      <div class="right-content" v-if="pagination.count>0">
        <table class="com-table">
          <thead class="com-thead">
            <th>
              <el-checkbox v-model="selectedAll" @change="selectAllEvent">{{$t('common.checkAll')}}</el-checkbox>
            </th>
            <th>{{$t('amountBody.gender')}}</th>
            <th>{{$t('amountBody.specificTime')}}</th>
            <th>{{$t('amountBody.specificData')}}</th>
          </thead>
          <tbody>
            <!-- 量体列表 -->
            <tr class="tr" v-for="(item,index) in bodyList" :key="index">
              <td class="pain-td">
                <el-checkbox v-model="item.selected"></el-checkbox>
                <span class="name">{{item.dressedusrName}}</span>
              </td>
              <td class="pain-td">{{item.sexName}}</td>
              <td class="pain-td">{{item.measureLog.slice(0,19)}}</td>
              <td
                class="pain-td pain-search flex-box flex-center"
                @click="showSkuDialog(index)"
                v-if="item.ctmmeasureDtMsrtypeDtos!=null"
              >
                {{$t('amountBody.viewData')}}
                <p :class="skuIndex==index?'an-up':'an-down'">{{skuIndex==index?'﹀':'︿'}}</p>
                <div class="com-b-shadow sku-form" v-show="skuIndex == index">
                  <div class="triangle-up"></div>
                  <div class="sku-form-item flex-box">
                    <div
                      class="dataTable flex-wrap"
                      v-for="(_item,index) in item.ctmmeasureDtMsrtypeDtos"
                      :key="index"
                    >
                      <div
                        class="dataRow flex-box"
                        v-for="(__item,index) in _item.measureInfoList"
                        :key="index"
                      >
                        <div class="halfRow">{{__item.gctMeasureHdName}}</div>
                        <div class="halfRow">{{__item.cleanValue}}</div>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="sure-btn" @click="deleteBodyDetail(item)">{{$t('common.delete')}}</div> -->
                </div>
              </td>
              <td
                class="pain-td pain-search flex-box flex-center"
                v-else
              >{{$t('amountBody.noDressData')}}</td>
            </tr>
          </tbody>
        </table>
        <div class="body-footer">
          <span
            class="footer-person"
          >{{$t('amountBody.overSelected')}} （{{count}} {{$t('amountBody.pepole')}}）</span>
          <span class="footer-delete" @click="deleteBodyData()">{{$t('amountBody.batchDelete')}}</span>
        </div>
      </div>
      <div class="no-data" v-else>
        <div class="img-row-one">
          <img src="../../assets/images/vouchers/noData.png" />
        </div>
        <div
          class="img-row-two"
        >{{peopleDress==''?$t('amountBody.noData'):$t('amountBody.noDress')}}</div>
      </div>
      <div class="pagination" v-if="pagination.count>5">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="pagination.limit"
          :current-page="1"
          background
          layout="prev, pager, next"
          :total="pagination.count"
        ></el-pagination>
      </div>
    </div>
    <!-- 预约量体弹框 -->
    <Booking ref="addBooking" :entrance="2" @getAmountBodyList="getAmountBodyList" />
  </div>
</template>
<script>
import { UserService, Volume } from "../../api/service";
import Booking from "../../components/member/Booking";
import getLocationPosition from "../../utils/getLocation";
export default {
  components: {
    Booking
  },
  data() {
    return {
      skuIndex: -1, // 所显示sku弹窗index
      isSearch: false,
      vals: [],
      location: [],
      locationTxt: [],
      val: [],
      showDetail: false, //展示列表详情
      bodyList: [], //量体列表
      peopleDress: "", //着装人
      areaList: [], // 表单可选地址列表
      countSelected: false,
      anIndex: -1, // 量体详情索引
      selectedAll: false, //选择所有
      userId: Storage.get("USER_INFO").usrId,
      companyId: Storage.get("COMPANYID").company_id,
      ownCompanyId: Storage.get("COMPANYID").company_id,
      pagination: {
        // 分页
        count: 0,
        limit: 5,
        page: 1,
        currentPage: 1
      }
    };
  },
  metaInfo() {
    return {
      meta: [
        // set meta
        {
          name: "keyWords",
          content: "巴龙商城首页"
        }
      ]
    };
  },
  methods: {
    /**
     * 删除量体明细数据
     * @param
     *bodyInfor  量体数据
     */
    async deleteBodyDetail(bodyInfor) {
      let data = {
        userId: this.userId,
        companyId: this.companyId,
        ids: bodyInfor.ctmmeasureDtMsrtypeDtos[0].id,
        ownCompanyId: this.ownCompanyId
      };
      this.$confirm(this.$t("amountBody.deleteBody"), "提示", {
        confirmButtonText: this.$t("common.sure"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          Volume.delCtmMeasure(data).then(res => {
            if (res == 1) {
              this.$message({
                type: "success",
                message: this.$t("amountBody.succesDel")
              });
              this.getAmountBodyList();
            } else {
              this.$message({
                type: "info",
                message: this.$t("amountBody.failureDel")
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("amountBody.cancelBodyData")
          });
        });
    },
    /**
     * 删除量体数据
     * @param
     *
     *
     */
    deleteBodyData() {
      let selectIdArr = [];
      this.bodyList.forEach(item => {
        if (item.selected) selectIdArr.push(item.id);
      });
      if (selectIdArr.length == 0)
        return this.$message({
          type: "info",
          message: this.$t("amountBody.pleaseSelect")
        });

      let data = {
        userId: this.userId,
        companyId: this.companyId,
        ids: selectIdArr.join(","),
        ownCompanyId: this.ownCompanyId
      };
      this.$confirm(this.$t("amountBody.sureMoreDel"), "提示", {
        confirmButtonText: this.$t("common.sure"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          Volume.delCtmMeasureHd(data).then(res => {
            if (res == 0) {
              console.log("失败");
              this.$message({
                type: "info",
                message: this.$t("amountBody.failureMoreDel")
              });
            } else {
              console.log("成功");
              this.$message({
                type: "success",
                message: this.$t("amountBody.sucessMoreDel")
              });
              this.getAmountBodyList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("amountBody.cancelMoreDel")
          });
        });
    },
    /**
     * 分页
     * @param
     *
     */
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.getAmountBodyList();
    },
    /**
     * 预约弹框显示 子组件
     * @param
     *
     */
    bookingShow() {
      this.$refs.addBooking.bookingShow();
    },
    showSkuDialog(index) {
      if (this.skuIndex === index) {
        this.skuIndex = -1;
        return;
      }
      this.skuIndex = index;
    },
    /**
     * 查看量体数据
     * @param
     * index  相应的索引
     */
    toViewBodyData(index) {
      this.anIndex = index;
      this.showDetail = !this.showDetail;
    },
    /**
     *列表全选
     * @param
     * val false 不全选 true 全选
     */
    selectAllEvent(val) {
      this.bodyList = this.bodyList.map(item => ({
        ...item,
        selected: val
      }));
    },
    /**
     * 获取用户信息
     * @param
     *
     */
    async getUserInfor() {
      let RES = await UserService.getUserInfo({});
      Storage.set("CARDNO", {
        cardNo: RES.cardNo
      });
    },
    /**
     *
     * 获取量体列表
     * @param {*} params
     * ctmUsrId
     * companyId
     * dressedUsrName
     * pageNum
     * pageSize
     */
    async getAmountBodyList() {
      this.skuIndex='-1'
      let data = {
        ctmUsrId: Storage.get("USER_INFO").usrId,
        companyId: Storage.get("COMPANYID").company_id,
        dressedUsrName: this.peopleDress,
        pageNum: this.pagination.page,
        pageSize: this.pagination.limit
      };
      let RES = await Volume.getCtmmeasure(data);
      let { total, list, pages } = RES;
      this.pagination.count = total;

      if (list == null) return;
      console.log(total, "total");

      if (pages > 0 && list.length == 0) {
        this.pagination.page = this.pagination.page - 1;
        this.getAmountBodyList();
      }
      this.bodyList = list.map(item => ({
        ...item,
        selected: false
      }));
    }
  },
  created() {
    this.getUserInfor();
    this.getAmountBodyList();
  },
  mounted() {
    //监听键盘事件
    window.addEventListener("keyup", e => {
      if (e.keyCode === 13) {
        this.getAmountBodyList();
      }
    });
  },
  beforeRouteEnter(to, from, next) {
    getLocationPosition();
    next();
  },
  watch: {
    peopleDress(value) {
      this.$nextTick(() => {
        this.peopleDress = window.filterInput(value);
      });
      if (this.peopleDress.length > 0) return (this.isSearch = true);

      this.getAmountBodyList();
      this.isSearch = false;
    }
  },
  computed: {
    count() {
      if (this.bodyList == null) return;
      let count = this.bodyList.filter(item => item.selected === true).length;
      this.selectedAll = count === this.bodyList.length;
      return count;
    }
  }
};
</script>

<style scoped lang="scss">
.pagination {
  margin: 30px 0 76px 0;
  text-align: right;
}
.pain-row {
  overflow: hidden;
  .row-item {
    float: left;
  }
  .cascader-item {
    margin-left: 25px;
  }
  .pain-shop {
    margin-left: 25px;
    margin-right: 50px;
    width: 260px;
    li {
      display: inline-block;
      margin-bottom: 34px;
    }
    .shop-left {
      float: left;
      i {
        width: 20px;
        height: 20px;
        margin-right: 24px;
      }
    }
    .shop-right {
      width: 220px;
      float: left;
      .right-one {
        font-size: 16px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }
      .right-twe {
        margin-top: 13px;
        font-size: 14px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(153, 153, 153, 1);
      }
    }
  }
  .pain-map {
    width: 443px;
    height: 380px;
    background: rgba(245, 243, 239, 1);
    border: 1px solid rgba(204, 204, 204, 1);
  }
}
.three-row {
  text-align: center;
  margin-top: 53px;
  .sure-btn {
    margin-right: 56px;
    display: inline-block;
    width: 188px;
    height: 54px;
    background: rgba(182, 159, 125, 1);
    border: 1px solid rgba(182, 159, 125, 1);
    font-size: 16px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    line-height: 54px;
  }
  .cancel-btn {
    display: inline-block;
    width: 188px;
    height: 54px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(182, 159, 125, 1);
    font-size: 16px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(182, 159, 125, 1);
    text-align: center;
    line-height: 54px;
  }
}
.dataTable {
  width: 100%;
  display: flex;
  .dataRow {
    width: 50%;
    display: flex;
    padding: 0px 9px;
    justify-content: space-between;
    .halfRow {
      display: inline-block;
      height: 40px;
      line-height: 40px;
    }
  }
}
.pain-search {
  position: relative;
  color: rgba(153, 153, 153, 1);
  .an-up {
    margin: 5px 0px 0px 10px;
  }
  .an-down {
    margin: -8px 0px 0px 10px;
  }
}
.pain-td {
  border: 1px solid rgba(204, 204, 204, 1);
  height: 50px;
  .name {
    font-size: 14px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
  }
  span {
    margin-left: 10px;
  }
}
.footer-person {
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  margin-left: 17px;
}
.footer-delete {
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  margin-left: 58px;
}
.body-footer {
  margin-top: 19px;
  line-height: 45px;
  height: 45px;
  background: rgba(245, 245, 245, 1);
  border: 1px solid rgba(204, 204, 204, 1);
  span:nth-child(2) {
    cursor: pointer;
  }
}

.com-table {
  th:nth-child(1),
  td:nth-child(1) {
    width: 200px;
    text-align: left;
    padding-left: 15px;
    box-sizing: inherit;
  }
  th:nth-child(3),
  td:nth-child(3) {
    width: 247px;
  }
  th:nth-child(4),
  td:nth-child(4) {
    width: 247px;
  }
  th:nth-child(5),
  td:nth-child(5) {
    width: 150px;
  }
  th:nth-child(6),
  td:nth-child(6) {
    width: 150px;
  }
}
.sku-form {
  position: absolute;
  top: 40px;
  left: -115px;
  width: 358px;
  padding: 20px;
  background: $color-white;
  cursor: default;
  z-index: 100;
  .sure-btn {
    line-height: 32px;
    width: 100px;
    height: 32px;
    border: 1px solid $color-golden;
    color: #b69f7d;
    font-size: 14px;
  }
  .sku-form-item {
    margin-bottom: 20px;
    text-align: left;
    .item-label {
      color: $text-primary;
      line-height: 34px;
      margin-right: 15px;
    }
    .size-label {
      line-height: 37px;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.triangle-up {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid $color-white;
  position: absolute;
  top: -10px;
  right: 70px;
  filter: drop-shadow(0px -1px 1px #dcdcdc);
}

.fl-right {
  float: right;
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(61, 120, 204, 1);
}

.right-div {
  width: 97%;
  display: inline-block;
  margin-top: 32px;
  // margin-left: 28px;
  div {
    .search-people {
      margin-bottom: 22px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 40px;
      /deep/.el-input {
        width: 180px;
      }

      .search-button {
        padding: 0px 12px;
        font-size: 7px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
      }
      .search-content {
        background: #cccccc;
      }
      .no-content {
        background: #cccccc;
      }
    }
    .booking-body {
      font-size: 14px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(58, 118, 207, 1);
      line-height: 40px;
    }
  }

  .add-body {
    font-size: 14px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(61, 120, 204, 1);
  }
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
  width: 100%;
  display: inline-block;

  .content {
    margin-left: 120px;
    margin-top: 53px;
    width: 300px;
  }
}
</style>
