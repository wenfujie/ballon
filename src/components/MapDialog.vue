/*
* createTime：2019/2/27
* author：jiandu.sun
* description:  门店地图弹窗
*/
<style lang="scss" scoped>
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
        margin-right: 30px;
        width: 280px;
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
.two-row {
    margin-top: 39px;
}
.pain-icon {
    margin: 0 12px;
    .icon {
        width: 20px;
        height: 20px;
    }
}
.map-address-list {
    height: 400px;
    overflow: auto;
}
</style>


<template>
    <div class="thanksPage">
        <el-dialog title :visible.sync="editReserve3" @open="openDialog" width="900px">
            <!-- <div class="pain-row">
                 <div class="row-item">
                     <span>门店地区：</span>
                 </div>
                 <div class="row-item cascader-item">
                     <el-cascader
                            ref="cascader"
                            :options="areaList"
                            v-model="store.addressModel"
                            @change="areaChange">
                    </el-cascader>
                 </div>
            </div>-->
            <div class="pain-row two-row">
                <div class="row-item addressMap">
                    <span>{{this.$t("selectStore.selectStore")}}：</span>
                </div>
                <div class="row-item pain-shop" v-if="infoList.length >0">
                    <ul class="map-address-list">
                        <li
                            v-for="(item, index) in infoList"
                            @click="addressSelect(item, index)"
                            :key="index"
                        >
                            <div class="shop-left">
                                <i
                                    class="van-checkbox__icon iconfont"
                                    :class="[infoActive === index ? 'icon-xuanzhongyuanxing' : 'icon-weixuanzhongyuanxing']"
                                ></i>
                            </div>
                            <div class="shop-right">
                                <div class="right-one">{{item.dptName}}</div>
                                <div
                                    class="right-twe"
                                >{{item.provinceName}}{{item.cityName}}{{item.districtName}}{{item.address}}</div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="row-item pain-shop" v-else>{{this.$t("selectStore.noStore")}}</div>
                <div class="row-item pain-map" id="allmap" ref="allmap"></div>
            </div>
            <div class="pain-row three-row">
                <div class="sure-btn" @click="mapSubmit('sure')">{{this.$t("common.sure")}}</div>
                <div class="cancel-btn" @click="mapSubmit('cancel')">{{this.$t("common.cancel")}}</div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
var selectIconUrl = require("../assets/images/address/location_select.png");
var selectIconUrl_no = require("../assets/images/address/location_select_no.png");
import {
    Form,
    FormItem,
    Pagination,
    Dialog,
    Input,
    InputNumber,
    Radio,
    RadioGroup,
    Checkbox,
    Switch,
    CheckboxGroup,
    Button,
    Loading,
    MessageBox,
    DatePicker,
    TimePicker,
    Select,
    Message,
    Cascader
} from "element-ui";
import { cityData } from "../assets/js/cityData";
import { UserService, Volume } from "../api/service";
import { MP } from "../utils/map";
export default {
    props: {
        storeData: [Number, Object]
    },
    components: {
        "el-cascader": Cascader,
        "el-select": Select
    },
    data() {
        return {
            infoActive: -1,
            userInfo: null,
            infoList: [],
            areaList: [], // 表单可选地址列表
            editReserve3: false,
            show: false,
            // 到店量体
            store: {
                id: "",
                sex: "D_PERSONUSRSEX_MAN",
                name: "",
                tel: "",
                address: "",
                addressDetail: "",
                date: "",
                addressInfo: {
                    province: "",
                    district: "",
                    city: ""
                },
                dptId: "",
                measureMemo: "",
                addressModel: []
            },
            markerArr: [],
            markerIconWidth: 24, //定位图片像素的宽度
            markerIconHeight: 33
        };
    },
    methods: {
        // 确认、取消按钮
        mapSubmit(type) {
            if (type == "sure") {
                console.log(this.infoActive)
                if (this.infoActive >= 0) {
                    this.$emit("changeStore", this.store.dptId);
                }
            } else {
            }
            this.editReserve3 = false;
        },
        /**
         * 点击地图坐标，坐标移动中心
         * @param lng 经度
         * @param lat 纬度
         * @private
         */
        _mapToCenter(lng, lat) {
            this.map.panTo(new BMap.Point(lng, lat));
        },
        /**
         * 点击门店
         */
        addressSelect(item, index) {
            this.actAddressDetail = item.dptName;
            this.addressDetails = item.address;
            this.dptId = item.dptId;
            this.dptCode = item.dptCode;
            this.store.dptId = item.id;
            // 点击覆盖物，中心移动到覆盖物
            this._mapToCenter(item.lng, item.lat);
            this.setMarkerStyle(item, index);
        },
        //设置地图标识颜色前的判断
        setMarkerStyle(item, index) {
            if (this.infoActive == index) {
                return;
            }
            if (this.infoActive != -1) {
                this.setMarkersColor(this.infoActive, selectIconUrl_no);
            }
            this.infoActive = index;
            this.setMarkersColor(index, selectIconUrl);
        },
        //设置地图标识颜色
        setMarkersColor(index, iconUrl) {
            var icon = new BMap.Icon(
                iconUrl,
                new BMap.Size(this.markerIconWidth, this.markerIconHeight),
                {
                    anchor: new BMap.Size(this.markerIconWidth / 2, this.markerIconHeight)
                }
            ); //显示图标大小
            this.markers[index].setIcon(icon); //设置标签的图标为自定义图标
        },
        //  获取用户信息
        //            getUser () {
        //                let data ={}
        //
        //                UserService.getUserInfo(data).then((res) => {
        //                    this.userInfo = res
        //                }).then(()=>{
        //                    this.getShopAddr()
        //
        //                })
        //            },
        _initList(listData) {
            this.infoList = [];
            listData.forEach(item => {
                item.lng = item.lon;
                this.infoList.push(item);
            });
            this.currentCity = this.store.addressInfo.city;
            this._initMap();
        },
        /**
         * 地图坐标点击事件
         * @param e 当前坐标的信息
         * @param e.currentTarget.point.ln 经度
         * @param e.currentTarget.point.lat 纬度
         */
        _attribute(e) {
            let x = e.currentTarget.point.lng;
            let y = e.currentTarget.point.lat;
            this._mapToCenter(x, y);
            // 遍历门店，选中门店
            this.infoList.forEach((item, index) => {
                if (item.lng == x && item.lat == y) {
                    this.setMarkerStyle(item, index);
                    this.actAddressDetail = item.dptName;
                    this.addressDetails = item.address;
                    this.dptId = item.dptId;
                    this.store.dptId = item.id;
                    this.dptCode = item.dptCode;
                }
            });
        },
        //  获取到店量体地址列表
        //            getShopAddr () {
        //
        //                let data = {
        //                    ownCompanyId: Storage.get("COMPANYID").company_id,
        //                    stateName: this.store.addressInfo.province,
        //                    cityName: this.store.addressInfo.city,
        //                    destName: this.store.addressInfo.district,
        //                    cardNo: this.userInfo.cardNo,
        //                    buscontscode:'D_BUSCONTS_WSC'
        //                }
        //                Volume.getShopAddr(data).then((res)=> {
        //                    this.infoList = []
        //                    res.forEach((item)=> {
        //                        item.lng = item.lon
        //                        this.infoList.push(item)
        //                    })
        //                    console.log("柳暗花明",this.infoList);
        //                    this.currentCity= this.store.addressInfo.city
        //                    this._initMap()
        //                }, (err)=> {})
        //            },
        /**
         * 初始化地图
         * npm run build
         */
        _initMap() {
            // 防止ak暴露
            MP("kyQyvOBQwLUVrHieFzUcfV1TZt0slzlG").then(BMap => {
                let root = this;
                this.map = new BMap.Map("allmap");
                let top_left_navigation = new BMap.NavigationControl(); //右下角，添加默认缩放平移控件
                this.map.centerAndZoom(this.currentCity, 12); //初始化地图,设置城市和地图级别
                this.map.enableScrollWheelZoom(true); // 缩放
                this.map.addControl(top_left_navigation);
                let markers = [];
                let infoActive = -1;
                this.infoList.forEach((item, index) => {
                    let point = new BMap.Point(item.lng, item.lat);
                    let marker = new BMap.Marker(point); // 创建标注
                    var icon = new BMap.Icon(
                        selectIconUrl_no,
                        new BMap.Size(this.markerIconWidth, this.markerIconHeight),
                        {
                            anchor: new BMap.Size(
                                this.markerIconWidth / 2,
                                this.markerIconHeight
                            )
                        }
                    ); //显示图标大小
                    marker.setIcon(icon); //设置标签的图标为自定义图标
                    markers.push(marker);
                    this.map.addOverlay(marker); // 将标注添加到地图中
                    marker.addEventListener("click", this._attribute);
                    if (this.store.dptId && item.id == this.store.dptId) {
                        infoActive = index;
                    }
                });
                this.markers = markers;
                this.infoActive = infoActive;
                if (infoActive != -1) {
                    root.setMarkersColor(infoActive, selectIconUrl);
                    setTimeout(() => {
                        root._mapToCenter(
                            this.infoList[infoActive].lng,
                            this.infoList[infoActive].lat
                        );
                    }, 500);
                }
            });
        },
        // 省市区选择确定
        areaChange(value) {
            if (value[2]) {
                this.addressInfo.addressId = value[2];
            } else if (value[1]) {
                this.addressInfo.addressId = value[1];
            } else {
                this.addressInfo.addressId = value[0];
            }
            this.store.addressInfo.province = this.$refs.cascader.currentLabels[0];
            this.store.addressInfo.city = this.$refs.cascader.currentLabels[1];
            this.store.addressInfo.district = this.$refs.cascader.currentLabels[2];
            this.getShopAddr();
        },
        onInit() {
            let from = this.$route.params.fromPage;
            if (check.isEmpty(from)) from = this.$route.query.fromPage;
            let fromPageArr = ["settlement", "order", "payCode"];
            if (fromPageArr.indexOf(from) != -1) {
                this.show = true;
            }
        },
        fill() {
            this.show = false;
            this.$emit("close");
        },
        // 更新数据
        refreshData() {
            this.store.addressInfo.province = this.storeData.province;
            this.store.addressInfo.city = this.storeData.city;
            this.store.addressInfo.district = this.storeData.district;
            this.store.dptId = this.storeData.dptId;

            if (this.storeData.list.length) {
                this._initList(this.storeData.list);
            }
        },
        // 打开弹窗事件
        openDialog() {
            this.refreshData();
        }
    },
    created() {
        this.refreshData();
        // this.onInit();
        //        this.areaList = c_disposeCityData(cityData);
    },
    watch: {
        //        "storeData.dptId": function () {
        //            this.refreshData();
        //        },
        //        "storeData.city": function () {
        //            this.refreshData();
        //        },
        //        "storeData.list"(){
        //            this.refreshData();
        //        }
    }
};
</script>
