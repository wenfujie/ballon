
<template>
  <div class="right-div">
    <div class="right-content">
      <!-- <div class="tab-item" v-if="paginationBody.count>0">{{$t('amountBody.specificData')}}</div> -->
      <!-- <div class="tab-item" :class="active == 0? 'select-tab':''" @click="tabChange(0)">量体数据</div>
            <div class="tab-item" :class="active == 1? 'select-tab':''" @click="tabChange(1)">预约单</div>-->
      <!-- <div class="fl-btn pointer" @click="bookingShow()" v-if="$route.query.dressPerson==null &&  bodyList.length>0">+{{$t('amountBody.bookingBody')}}</div> -->
    </div>
      <!-- 因为后台临售小票的原因注释bodyList，等五一之后改回来 -->
    <!--<div class="countData" v-if=" bodyList.length>0">-->
      <!--<ul class="dataItem" v-for="(item,index) in bodyList" :key="index">-->
        <!--<li class="item dressTitle">-->
          <!--<div class="left flex-box">-->
            <!--<el-checkbox v-model="item.checked" @change="checkBodyItem(index)"></el-checkbox>-->
            <!--<span>着装人：{{item.dressedusrName}}</span>-->
          <!--</div>-->
          <!--<span class="right">量体时间：{{item.measureLog.slice(0,19)}}</span>-->
        <!--</li>-->
        <!--<li class="item item-two-row">-->
          <!--<template v-if="item.ctmmeasureDtMsrtypeDtos!=null">-->
            <!--<div class="row-content pain-search" v-if="!item.show" @click="toViewBodyData(index)">-->
              <!--<div class="left">展开详情数据</div>-->
              <!--<div class="right an-up">﹀</div>-->
            <!--</div>-->
            <!--<div class="row-content pain-search row-an-down" v-else-if="item.show" @click="packUp(index)">-->
              <!--<div class="left">收起详情数据</div>-->
              <!--<div class="right an-down">︿</div>-->
            <!--</div>-->
          <!--</template>-->

          <!--<div class="row-content pain-search" v-else>-->
            <!--<div class="left">抱歉,暂无数据</div>-->
          <!--</div>-->
        <!--</li>-->
        <!--<div class="detailItem" v-show="item.show">-->
          <!--<div class="item-row" v-for="(__item,index) in item.arrList" :key="index">-->
            <!--<div class="item-data flex-box" >-->
              <!--<div>{{__item.gctMeasureHdName}}</div>-->
              <!--<div>{{__item.cleanValue?__item.cleanValue:'-'}}</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</ul>-->
      <!--<div class="pagination" v-if="paginationBody.count>5">-->
        <!--<el-pagination @current-change="handleCurrentBodyList" :page-size="paginationBody.limit" :current-page="1" background layout="prev, pager, next" :total="paginationBody.count"></el-pagination>-->
      <!--</div>-->
      <!--<div class="submitBtn pointer" @click.stop="sure">确认</div>-->
    <!--</div>-->
    <div class="no-data">
      <div class="img-row-one">
        <img src="../../assets/images/vouchers/noData.png">
      </div>
      <div class="img-row-two">{{$t('myReservation.noData')}}</div>
      <div class="img-row-three">
        <div class="goReserve" @click="bookingShow()">+{{$t('amountBody.bookingBody')}}</div>
      </div>
    </div>
    <!-- <div class="reserveBill" v-if="active == 1 && volumeListHistory.length>0">
      <ul class="ul-bill">
        <li class="li-bill" v-for="(item,index) in volumeListHistory" :key="index">
          <div class="billTitle flex-box">
            <el-checkbox v-model="item.checked" @change="checkBoxItem(index)"></el-checkbox>
            预约时间：{{item.orderTime}}
          </div>
          <div>
            <div class="li-item">
              <label for="">联 系 人：</label>
              <span>{{item.cargousrName}}</span>
            </div>
            <div class="li-item" v-if="item.cargoMobile">
              <label for="">手 机 号：</label>
              <span>{{item.cargoMobile}}</span>
            </div>
            <div class="li-item" v-if="item.msrWayName">
              <label for="">量体方式：</label>
              <span>{{item.msrWayName}}</span>
            </div>
            <div class="li-item" v-if="item.address">
              <label for="">量体地址：</label>
              <span>{{item.stateName}} {{item.cityName}}{{item.destName}}{{item.address}}</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="pagination" v-if="paginationVolume.count>0">
        <el-pagination @current-change="handleCurrentVolume" :page-size="paginationVolume.limit" :current-page="1" background layout="prev, pager, next" :total="paginationVolume.count">
        </el-pagination>
      </div>
      <div class="submitBtn" @click="sure(2)">
        确认
      </div>
        </div>-->
    <!-- 预约量体弹框 -->
    <Booking ref="addBooking" :entrance="3" @getAmountBodyList="getAmountBodyList" />
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { Volume, UserService } from "../../api/service";
import Booking from "../../components/member/Booking";
export default {
  components: {
    Booking
  },
  data() {
    return {
      checkValue: "",
      volumeListHistory: [],
      activeIndex: "-1",
      showDetail: false,
      active: 0, // tab选中选项
      usrId: Storage.get("USER_INFO").usrId,
      companyId: Storage.get("COMPANYID").company_id,
      searchUsrId: Storage.get("USER_INFO").usrId,
      bodyList: [],
      checkBodyIndex: "-1",
      paginationBody: {
        // 分页
        count: 0,
        limit: 5,
        page: 1,
        currentPage: 1
      },
      paginationVolume: {
        // 分页
        count: 0,
        limit: 5,
        page: 1,
        currentPage: 1
      },
      count: 0,
      checkIndex: "",
      checkList: []
    };
  },
  methods: {
    ...mapActions("dressed", ["SetIndex"]),
    /**
     * 预约弹框显示 子组件
     * @param
     *
     */
    bookingShow() {
      
      this.$refs.addBooking.bookingShow("", "", this.$route.query.billCode);
    },
    /**
     * 分页
     * @param
     *
     */
    // handleCurrentVolume(val) {
    //   this.paginationVolume.page = val;
    //   this.getVolumeList();
    // },
    handleCurrentBodyList(val) {
      this.paginationBody.page = val;
      this.getAmountBodyList();
    },
    /**
     *确定选择
     * @param
     * index  相应的索引
     */
    sure() {
      if (this.checkBodyIndex == "-1") {
        this.$message.error(this.$t("choiceDressed.noData"));
        return false;
      }

      this.addCtmmeasure(this.bodyList[this.checkBodyIndex].id);
    },
    // sure(type) {
    //   type == 1
    //     ? this.SetOrderItem(this.bodyList[this.checkBodyIndex])
    //     : this.SetOrderItem(this.volumeListHistory[this.checkIndex]);
    //   this.$router.go(-1);
    // },
    /**
     *单选数据
     * @param
     * index  相应的索引
     */
    // checkBoxItem(index) {
    //   this.checkIndex = index;
    //   this.volumeListHistory.map((item, index) => {
    //     if (index != this.checkIndex)
    //       return (this.volumeListHistory[index].checked = false);
    //   });
    // },
    /**
     *单选数据
     * @param
     * index  相应的索引
     */
    checkBodyItem(index) {
      this.checkBodyIndex == "-1"
        ? (this.checkBodyIndex = index)
        : (this.checkBodyIndex = "-1");

      this.bodyList.map((item, index) => {
        if (index != this.checkBodyIndex)
          return (this.bodyList[index].checked = false);
      });
    },
    packUp(index) {
      this.bodyList[index].show = false;
    },
    /**
     * 展开量体数据
     * @param
     * index  相应的索引
     */
    toViewBodyData(index) {
      this.bodyList[index].show = true;
      // this.activeIndex = index;
    },
    /**
     * 添加着装人
     * @param
     *id 着装人id
     *ordDtId  订单列表商品id
     *ptiPartClassId  商品类别id
     */
    async addCtmmeasure(id) {
      let data = {
        id,
        ordDtId: this.$route.query.rtlOrdDtId,
        ptiPartClassId: this.$route.query.ptiPartClassId || ""
      };

      const RES = await Volume.addCtmmeasure(data);
      if (RES.code !== 200)
        return this.$message(this.$t("choiceDressed.addFaiulre"));
      this.$message(this.$t("choiceDressed.addSuccess"));
      let path = "/order-list";
      if (!!this.$route.query.callbackUrl) path = this.$route.query.callbackUrl;
      this.$router.push({
        path: path,
        query: {
          entrance: "我的预约"
        }
      });
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
    async getAmountBodyList() {
      console.log( this.$route.query.ptiPartClassId, 'this.$route.query.ptiPartClassId')
      let data = {
        ctmUsrId: this.usrId,
        ptiPartClassId: this.$route.query.ptiPartClassId,
        companyId: this.companyId,
        pageNum: this.paginationBody.page,
        pageSize: this.paginationBody.limit
      };
      let RES = await Volume.getDress(data);
      let { list } = RES;

      if (list == null) return;
      this.bodyList = list.filter(item => {
        return item.ctmmeasureDtMsrtypeDtos !== null;
      });

      this.bodyList.forEach(item => {
        item.Arr = []
        item.arrList = []
        item.ctmmeasureDtMsrtypeDtos.forEach(_item => {
          _item.measureInfoList.forEach((_ite) => {
              let indexRes = item.Arr.indexOf(_ite.gctStandMeasureHdId)
              if(indexRes === -1) {
                  item.Arr.push(_ite.gctStandMeasureHdId)
                  item.arrList.push(_ite)
              }
          });
        });
      });

      // ARR.forEach(item => {
      //   if (OARR.indexOf(item.gctStandMeasureHdId) == -1) {
      //     OARR.push(item);
      //   }
      // });
      this.paginationBody.count = this.bodyList.length;
      this.bodyList = this.bodyList.map(item => ({
        ...item,
        show: false,
        checked: false
      }));
    }
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
    // getVolumeList() {
    //   let data = {
    //     usrId: this.usrId,
    //     companyId: this.companyId,
    //     pageNum: this.paginationVolume.page,
    //     pageSize: this.paginationVolume.limit,
    //     statusCodes: "MEASURE_HISTORY"
    //   };
    //   Volume.getVolumeList(data).then(res => {
    //     let { total, list } = res;
    //     this.paginationVolume.count = total;
    //     this.volumeListHistory = list;
    //     this.volumeListHistory = this.volumeListHistory.map(item => ({
    //       ...item,
    //       checked: false
    //     }));
    //   });
    // }

    /**
     * tab选项卡
     *
     */
    // tabChange(index) {
    //   this.active = index;
    // }
  },
  created() {},
  computed: {
    ...mapState({
      idArr: state => state.dressed.idArr
    })
  },
  beforeRouteEnter(to, from, next) {
    next();
  },
  mounted() {
    this.getAmountBodyList();
    // this.$store.dispatch("user/getUserInfo");

    // this.getUserInfor();

    let idArr = [this.$route.query.billCode, this.$route.query.rtlOrdDtId];
    this.SetIndex(idArr);
  },
  created() {}
};
</script>

<style scoped lang="scss">
.pagination {
  margin: 30px 0 32px 0;
  text-align: right;
}
.reserveBill {
  .li-bill {
    padding-bottom: 30px;
    margin-bottom: 30px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(204, 204, 204, 1);
    .billTitle {
      /deep/.el-checkbox {
        margin: 0px 20px;
      }
      width: 100%;
      height: 50px;
      line-height: 50px;
      background: rgba(245, 245, 245, 1);
      font-size: 18px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
  }
}
.pain-icon {
  margin: 0 12px;
  .icon {
    width: 20px;
    height: 20px;
  }
}
.fl-btn {
  float: right;
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(58, 118, 207, 1);
  line-height: 28px;
  height: 28px;
}
.right-content {
  .tab-item {
    width: 110px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    font-size: 18px;
    display: inline-block;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
  .select-tab {
    color: rgba(182, 159, 125, 1);
    border-bottom: 1px solid rgba(182, 159, 125, 1);
    border-right: 1px solid rgba(182, 159, 125, 1);
  }
}
.item-two-row {
  width: 100%;
  padding-left: 45px;
  padding-right: 38px;
  height: 37px;
  line-height: 37px;
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
  .row-an-down {
    border-bottom: 1px dashed rgba(204, 204, 204, 1);
  }
  .row-content {
    width: 100%;
    overflow: hidden;

    .left {
      float: left;
      font-size: 14px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
    .right {
      float: right;
      font-size: 13px;
      color: #cccccc;
    }
  }
}
.dataItem {
  margin-bottom: 32px;
}
.dataItem .dressTitle {
  overflow: hidden;
  margin-left: 12px;
  margin-bottom: 30px;
  .left {
    float: left;
    font-size: 16px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    span {
      margin-left: 12px;
    }
    .icon {
      margin: 0 12px;
      width: 20px;
      height: 20px;
    }
  }
  .right {
    float: right;
    font-size: 16px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    margin-right: 18px;
  }
  margin-top: 21px;
}

.detailItem {
  display: flex;
  padding: 20px 45px;
  width: 100%;
  flex-wrap: wrap;
  .item-row {
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 14px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 21px;
    width: 33.3%;
    .item-data {
      justify-content: space-between;
      padding: 0 50px 40px 20px;
      width: 100%;
    }
  }
}
.countData {
  ul {
    border: 1px solid rgba(204, 204, 204, 1);
    background: rgba(245, 245, 245, 1);
  }
}
.submitBtn {
  text-align: center;
  width: 188px;
  height: 54px;
  line-height: 54px;
  font-size: 16px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  background: rgba(182, 159, 125, 1);
  border: 1px solid rgba(182, 159, 125, 1);
}
.yuyueImg {
  img {
    width: 153px;
    height: 94px;
  }
}
.yuyueWord {
  text-align: center;
  font-size: 16px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
}
.yuyueBtn {
  text-align: center;
  width: 96px;
  height: 32px;
  background: rgba(245, 243, 239, 1);
  border: 1px solid rgba(183, 159, 123, 1);
}
.pain-update {
  width: 188px;
  line-height: 54px;
  text-align: center;
  height: 54px;
  background: rgba(182, 159, 125, 1);
  border: 1px solid rgba(182, 159, 125, 1);
  margin-left: 80px;
  display: inline-block;
  font-size: 16px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
}
.pain-cancel {
  font-size: 16px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(182, 159, 125, 1);
  margin-left: 56px;
  display: inline-block;
  width: 188px;
  line-height: 54px;
  text-align: center;
  height: 54px;
  background: rgba(245, 243, 239, 1);
  border: 1px solid rgba(182, 159, 125, 1);
}
.ul-title {
  height: 50px;
  background: rgba(245, 245, 245, 1);
  font-size: 18px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 50px;
  padding: 0 19px;
}
.li-item {
  .item-row {
    margin-bottom: 30px;
  }
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  padding: 0 19px;
  padding-top: 32px;
  .row-word {
    color: #999999;
  }
  .row-third {
    width: 33%;
    display: inline-block;
  }
}
.fl-right {
  float: right;
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(61, 120, 204, 1);
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
  width: calc(100% - 220px);
  float: left;
  display: inline-block;
  margin: 32px 0px 75px 20px;
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
.ul-container {
  border: 1px solid rgba(204, 204, 204, 1);
  padding-bottom: 31px;
  margin-bottom: 33px;
}
.right-content {
  .content-title {
    width: 100%;
    height: 50px;
    padding-left: 19px;
    line-height: 50px;
    background: rgba(245, 245, 245, 1);
  }
  display: inline-block;
  background: rgba(255, 255, 255, 1);
  width: 100%;
  .content {
    margin-left: 120px;
    margin-top: 53px;
    width: 300px;
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
  margin-bottom: 30px;
  display: inline-block;
  background: #ffffff;
  width: 100%;
  .content {
    margin-left: 120px;
    margin-top: 53px;
    width: 300px;
  }
}
</style>
