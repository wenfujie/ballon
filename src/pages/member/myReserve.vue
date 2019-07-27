<template>
  <div class="my-reserve">
    <div class="right-div">
      <div class="right-item" v-if="Object.keys(this.$route.query).length == 0">
        {{$t('myReservation.type')}}:
        <el-select
          v-model="state"
          clearable
          placeholder="请选择状态"
          @change="selectState"
          @clear="getVolumeList,statusId = ''"
        >
          <el-option
            v-for="(item,index) in stateList"
            :key="index"
            :label="item.txt"
            :value="item.id"
          ></el-option>
        </el-select>
        <!-- <div class="fl-right" @click="bookingShow()">+{{$t('amountBody.bookingBody')}}</div> -->
      </div>
      <ul class="reserve-list" v-if="pagination.count>0">
        <li v-for="(item,index) in volumeList" :key="index">
          <p>{{$t('myReservation.reservaCode')}}：{{item.billCode}}</p>
          <div class="base-infor flex-around">
            <div>
              <span>{{$t('myReservation.cargousrName')}} :</span>
              <span>{{item.cargousrName}}</span>
            </div>
            <div>
              <span>{{$t('myReservation.cargoMobile')}} :</span>
              <span>{{item.cargoMobile}}</span>
            </div>
            <div>
              <span>{{$t('myReservation.msrWayName')}} :</span>
              <span>{{item.msrWayName}}</span>
            </div>
          </div>
          <div class="reserve-infor flex-box">
            <div>
              <span>{{$t('myReservation.measureTime')}} :</span>
              <span>{{item.orderTime}}</span>
            </div>
            <div class="flex-box">
              <span>{{$t('myReservation.measureAdress')}} :</span>
              <span>{{item.stateName}} {{item.cityName}}{{item.destName}}{{item.address}}</span>
            </div>
          </div>
          <div class="other-infor">
            <div>
              <span>{{$t('common.measureMemo')}}:</span>
              <span>{{item.measureMemo?item.measureMemo:'-'}}</span>
            </div>
            <div>
              <span>{{$t('myReservation.type')}}:</span>
              <span
                :class="(item.statusId=='10051501' || item.statusId=='10051506')?'state-red':'state-black'"
              >{{item.text}}</span>
            </div>
          </div>
          <div
            class="dialog-button"
            v-if="item.statusCode=='D_SALEMSRSTATUS1' || item.statusCode=='D_SALEMSRSTATUS2'"
          >
            <button
              class="sure"
              v-if="item.statusCode!='D_SALEMSRSTATUS2'"
              @click="bookingShow(item)"
            >{{$t('myReservation.modifyReservation')}}</button>
            <button
              class="cancel"
              @click="cancalBooking(item)"
            >{{$t('myReservation.cancelReservation')}}</button>
          </div>
          <div
            class="dialog-button"
            v-else-if="item.statusCode=='D_SALEMSRSTATUS5' || item.statusCode=='D_SALEMSRSTATUS6'"
          >
            <button
              class="sure"
              v-if="item.statusCode=='D_SALEMSRSTATUS5'"
              @click="$router.push('/amount-body')"
            >{{$t('amountBody.viewData')}}</button>
            <button class="cancel" @click="deleteBooking(item)">{{$t('common.delete')}}</button>
          </div>
        </li>
      </ul>
      <div class="no-data" v-else>
        <div class="img-row-one">
          <img src="../../assets/images/vouchers/noData.png" />
        </div>
        <div class="img-row-two">{{$t('myReservation.noData')}}</div>
        <!-- <div class="img-row-three">
          <div class="goReserve" @click="bookingShow()">+{{$t('amountBody.bookingBody')}}</div>
        </div>-->
      </div>
      <div
        class="pagination"
        v-if="pagination.count>5 && Object.keys(this.$route.query).length == 0"
      >
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-size="pagination.limit"
          background
          layout="prev, pager, next"
          :total="pagination.count"
        ></el-pagination>
      </div>
    </div>
    <!-- 预约量体弹框 -->
    <Booking ref="addBooking" :entrance="1" @getVolumeList="getVolumeList" />
  </div>
</template>
<script>
import getLocationPosition from "../../utils/getLocation";
import { Volume, UserService ,Order} from "../../api/service";
import Booking from "../../components/member/Booking";
export default {
  components: {
    Booking
  },
  data() {
    return {
      pagination: {
        // 分页
        count: 0,
        limit: 5,
        page: 1,
        currentPage: 1
      },
      stateList: [
        {
          value: "D_SALEMSRSTATUS1",
          label: "未审核",
          txt: "审核中",
          id: "10051501"
        },
        {
          value: "D_SALEMSRSTATUS2",
          label: "已审核",
          txt: "审核通过待指派量体师",
          id: "10051502"
        },
        {
          value: "D_SALEMSRSTATUS3",
          label: "已派遣",
          txt: "已派遣量体师",
          id: "10051503"
        },
        {
          value: "D_SALEMSRSTATUS4",
          label: "预约完成",
          txt: "预约成功",
          id: "10051504"
        },
        {
          value: "D_SALEMSRSTATUS5",
          label: "已完成",
          txt: "量体完成",
          id: "10051505"
        },
        {
          value: "D_SALEMSRSTATUS6",
          label: "已作废",
          txt: "已取消",
          id: "10051506"
        }
      ],
      statusId: "",
      usrId: Storage.get("USER_INFO").usrId,
      companyId: Storage.get("COMPANYID").company_id,
      ownCompanyId: Storage.get("COMPANYID").company_id,
      state: "",
      loading: false,
      volumeList: [], //预约列表
      booingInfor: {} //选中的预约信息
    };
  },
  methods: {
    /**
     *取消预约
     * @param
     *
     */
    cancalBooking(item) {
      this.$confirm(this.$t("myReservation.cancalBooking"), "提示", {
        confirmButtonText: this.$t("common.sure"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          let data = {
            usrId: this.usrId,
            companyId: this.companyId,
            id: item.id,
            statusCode: "D_SALEMSRSTATUS6",
            ownCompanyId: this.ownCompanyId
          };

          Volume.cancelMeasure(data).then(res => {
            if (res == 1) {
              Order.clearAllCache();
              this.$message({
                type: "success",
                message: this.$t("myReservation.successMessage")
              });
              if (Object.keys(this.$route.query).length !== 0) {
                this.$router.push({
                  path: "/order-list",
                  query: {
                    entrance: "我的预约"
                  }
                });
                return;
              }

              //statusId 不为空代表筛选的列表
              this.statusId != ""
                ? this.getVolumeList(item.statusId)
                : this.getVolumeList();
            } else {
              this.$message({
                type: "info",
                message: this.$t("myReservation.cancal")
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("myReservation.noCancal")
          });
        });
    },
    /**
     * 删除预约
     * @param
     *
     */
    deleteBooking(item) {
      this.$confirm(this.$t("myReservation.deleteBooking"), "提示", {
        confirmButtonText: this.$t("common.sure"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          let data = {
            usrId: this.usrId,
            companyId: this.companyId,
            ids: item.id,
            ownCompanyId: this.ownCompanyId
          };
          Volume.delSaleMeasure(data).then(res => {
            if (res == 1) {
              this.$message({
                type: "success",
                message: this.$t("myReservation.successDelete")
              });

              if (Object.keys(this.$route.query).length !== 0) {
                this.$router.push({
                  path: "/order-list",
                  query: {
                    entrance: "我的预约"
                  }
                });
                return;
              }
              //statusId 不为空代表筛选的列表
              this.statusId != ""
                ? this.getVolumeList(item.statusId)
                : this.getVolumeList();
            } else {
              this.$message({
                type: "info",
                message: this.$t("myReservation.failureDelete")
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("myReservation.noDelete")
          });
        });
    },
    /**
     * 预约弹框显示 子组件
     * @param
     *type 1 修改 item预约信息
     */
    bookingShow(item) {
      this.booingInfor = item;
      let isOrderBooking = "";
      if (Object.keys(this.$route.query).length !== 0)
        isOrderBooking = "订单新增预约量体";
      this.$refs.addBooking.bookingShow(
        this.booingInfor,
        this.statusId,
        "",
        isOrderBooking
      );

      this.booingInfor = "";
    },
    /**
     * 选择状态
     * @param
     *ud 选中值statusId
     */
    selectState(statusId) {
      this.pagination.currentPage = 1;
      this.pagination.page = 1;
      this.statusId = statusId;
      this.getVolumeList(statusId);
    },
    /**
     * 分页
     * @param
     *
     */
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.pagination.currentPage = val;
      this.getVolumeList(this.statusId);
    },
    /**
     * 获取预约列表
     * @param
     *usrId
     *companyId
     *searchUsrId
     *statusId
     *pageNum
     *pageSize
     */
    getVolumeList(statusId) {
      let data = {
        usrId: this.usrId,
        companyId: this.companyId,
        searchUsrId: this.usrId
      };
      if (Object.keys(this.$route.query).length !== 0) {
        data.id = this.$route.query.bookingDetail.id;
      } else {
        data={
          statusId:statusId,
          pageNum:this.pagination.page,
          pageSize:this.pagination.limit,
    
        }
  

      }
      console.log(data,'78789787')
      Volume.getVolumeList(data).then(res => {
        let { total, list, pages } = res;
        this.pagination.count = total;

        if (pages > 0 && list.length == 0) {
          this.pagination.page = this.pagination.page - 1;
          this.getVolumeList();
        }

        this.volumeList = list;
        this.volumeList.forEach(item => {
          this.stateList.forEach(_item => {
            if (item.statusCode == _item.value) {
              item.text = _item.txt;
            }
          });
        });

        if (statusId == undefined) this.state = "";
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    getLocationPosition();

    next();
  },
  watch: {
  $route: {
    handler: function(val, oldVal){
      if(val.path=='/my-reserve'){
        this.getVolumeList();
      }
    },
    // 深度观察监听
    deep: true
  }
},
  created() {

    this.getVolumeList();
  }
};
</script>

<style scoped lang="scss">
.dialog-button {
  margin-left: 95px;
  margin-bottom: 30px;
  button {
    cursor: pointer;
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
.pagination {
  margin: 30px 0 76px 0;
  text-align: right;
}
.my-reserve {
  width: 100%;
  .right-div {
    width: 100%;
    display: inline-block;
    margin-top: 32px;
    // margin-left: 28px;
    ul.reserve-list {
      width: 100%;
      li {
        width: 100%;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgb(204, 204, 204);
        margin-bottom: 30px;
        p {
          margin-bottom: 30px;
          padding-left: 19px;
          height: 50px;
          background: rgba(245, 245, 245, 1);
          font-size: 18px;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          line-height: 50px;
        }

        .base-infor,
        .reserve-infor,
        .other-infor {
          padding: 0px 19px;
          margin-bottom: 30px;
          div {
            justify-content: flex-start;
            display: flex;
            align-items: center;

            span {
              font-size: 14px;
              font-family: PingFangSC-Medium;
              font-weight: 500;
              line-height: 21px;
              display: block;
            }
            span:nth-of-type(1) {
              margin-right: 15px;
              color: rgba(153, 153, 153, 1);
            }
            span:nth-of-type(2) {
              color: rgba(51, 51, 51, 1);
            }
          }
        }
        .base-infor {
          div:nth-child(1),
          div:nth-child(2) {
            width: 40.3%;
          }
        }
        .reserve-infor {
          div:nth-of-type(1) {
            width: 43%;
          }
          div:nth-of-type(2) {
            width: 57%;
            span:nth-of-type(2) {
              width: 80%;
            }
          }
        }
        .other-infor {
          div:nth-of-type(1) {
            margin-bottom: 30px;
          }
          div {
            span:nth-of-type(1) {
              margin-right: 0px;
              letter-spacing: 10px;
            }
          }
        }
      }
    }
    .right-item {
      font-size: 14px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 31px;
    }
    .rightWord {
      font-size: 14px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(61, 120, 204, 1);
    }
    .fl-right {
      float: right;
      font-size: 14px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(61, 120, 204, 1);
    }
  }
}

.state-red {
  color: red !important;
}
.state-black {
  color: #333;
}
@media screen and (max-width: 1200px) {
  .right-div {
    .reserve-infor {
      div:nth-of-type(1) {
        width: 41.2% !important;
      }
    }
  }
}
</style>
