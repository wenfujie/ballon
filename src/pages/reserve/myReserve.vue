
<template>
    <div class="index min-height wrapper" style="display: inline-block;">
        <div class="wrapper">
            <ul class="left-div">
                <li class="first-title">个人中心</li>
                <li class="item">会员卡</li>
                <li class="item">我的订单</li>
                <li class="item">我的售后</li>
                <li class="item">我的量体</li>
                <li class="item">我的预约</li>
                <li class="item">我的优惠劵</li>
                <li class="item">我的收藏</li>
                <li class="item">浏览记录</li>
                <li class="item">个人资料</li>
                <li class="item">安全管理</li>
                <li class="item">收货地址</li>
                <li class="item">帮助中心</li>
            </ul>
            <div class="right-div">
                <div class="right-title right-item">
                    <span class="word">个人中心</span>
                    <span class="pain-icon"><i class="iconfont icon-jiantou"></i></span>
                    <span >我的预约</span>
                </div>
                <div class="right-item two-row">
                     <!-- 状态:  <el-select v-model="value" placeholder="请选择">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                     -->
                     <div class="fl-right" @click="editReserve = true"> +预约量体</div>
                </div>
                <div class="right-content">
                    <el-dialog
                    title="dialogTitle"
                    :visible.sync="addReserve"
                    width="30%">
                    <span>确定删除该预约单吗</span>
                    <div>
                        <el-form ref="form" :model="form" label-width="80px">
                            <el-form-item label="活动名称">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                            <el-form-item label="活动区域">
                                <el-select v-model="form.region" placeholder="请选择活动区域">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="活动时间">
                                <el-col :span="11">
                                <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                                </el-col>
                                <el-col class="line" :span="2">-</el-col>
                                <el-col :span="11">
                                <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="即时配送">
                                <el-switch v-model="form.delivery"></el-switch>
                            </el-form-item>
                            <el-form-item label="活动性质">
                                <el-checkbox-group v-model="form.type">
                                <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                                <el-checkbox label="地推活动" name="type"></el-checkbox>
                                <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                                <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label="特殊资源">
                                <el-radio-group v-model="form.resource">
                                <el-radio label="线上品牌商赞助"></el-radio>
                                <el-radio label="线下场地免费"></el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="活动形式">
                                <el-input type="textarea" v-model="form.desc"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary">立即创建</el-button>
                                <el-button>取消</el-button>
                            </el-form-item>
                            </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                    </span>
                    </el-dialog>
                    <ul class="ul-container" v-for="(item,index) in list" :key="index" :title="item">
                        <div class="ul-title">预约编号：{{item.billCode}}</div>
                        <li class="li-item">
                            <div class="item-row">
                                <div class="row-third" v-if="item.cargousrName !== null && item.cargousrName !== ''"> 
                                    <span class="row-word">着 装 人：</span> {{item.cargousrName}}
                                </div>
                                <div class="row-third" v-if="item.cargoMobile !== null && item.cargoMobile !== ''"> 
                                    <span class="row-word">联系电话：</span> {{item.cargoMobile}}
                                </div>
                                <div class="row-third" v-if="item.msrWayName !== null && item.msrWayName !== ''"> 
                                    <span class="row-word">量体方式：</span> {{item.msrWayName}}
                                </div>
                            </div>
                            <div class="item-row">
                                <div class="row-third"> 
                                    <span class="row-word">预约时间：</span>  {{item.measureTime}}
                                </div>
                                <div class="row-third" v-if="item.address !== null && item.address !== ''"> 
                                    <span class="row-word">预约地址：</span> {{item.stateName}} {{item.cityName}}{{item.destName}}{{item.address}}
                                </div>
                            </div>
                            <div class="item-row">
                                <div class="row-third" v-if="item.measureMemo!== null && item.measureMemo!== ''"> 
                                    <span class="row-word">备 注：</span> {{item.measureMemo}}
                                </div>
                            </div>
                            <div class="item-row">
                                <div class="row-third"> 
                                    <span class="row-word">状 态：</span> {{item.statusName}}
                                </div>
                            </div>
                        </li>
                        <li class="li-item">
                            <div class="pain-update" @click="actionReserve(index)">修改预约</div>
                            <div class="pain-cancel" @click="cancelReserve1(index)">取消预约</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!--<img v-lazy="" />-->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>确定删除该预约单吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="delReserve()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="修改预约量体"
            :visible.sync="editReserve"
            width="697px">
            <div>
                <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="量体方式：">
                        <el-radio-group v-model="form.resource" @change="tabChange">
                        <el-radio label="1">到店量体</el-radio>
                        <el-radio label="2">上门量体</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div class="store" v-if="form.resource == '1'">
                        <el-form-item label="量体地址：">
                            <div class="shopName" v-if="store.addressDetail !=''">{{store.addressDetail}}</div>
                            <div class="shopName" v-else>无门店</div>

                            <div class=""><el-button type="primary" @click="updateShop">修改门店</el-button></div>
                            <!-- <el-select v-model="form.region" placeholder="请选择活动区域">
                            <el-option label="湖里万达店" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                            </el-select> -->
                        </el-form-item>
                        <el-form-item label="着 装 人：">
                            <el-input v-model="store.name"></el-input>
                        </el-form-item>
                        <el-form-item label="性别：">
                            <el-radio-group v-model="store.sex">
                            <el-radio label="D_PERSONUSRSEX_MAN">男</el-radio>
                            <el-radio label="D_PERSONUSRSEX_WOMAN">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="手 机 号：">
                            <el-input v-model="store.tel"></el-input>
                        </el-form-item>
                        <el-form-item label="量体时间">
                            <el-col :span="6">
                            <el-date-picker type="date" placeholder="选择日期" v-model="store.date" style="width: 100%;"></el-date-picker>
                            </el-col>
                            <el-col class="line" :span="2">-</el-col>
                            <el-col :span="6">
                            <el-time-picker type="fixed-time" placeholder="选择时间" v-model="store.date" style="width: 100%;"></el-time-picker>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="备 注：" >
                            <el-input type="textarea" v-model="store.measureMemo"></el-input>
                        </el-form-item>
                    </div>
                    <div class="visit" v-if="form.resource == '2'">
                        <el-form-item label="量体地址：">
                            <el-cascader
                                    :options="areaList"
                                    v-model="visit.addressModel"
                                    @change="areaChange">
                            </el-cascader>
                        </el-form-item>
                        <el-form-item label="详细地址：" >
                            <el-input type="textarea" v-model="visit.addressDetail"></el-input>
                        </el-form-item>
                        <el-form-item label="着 装 人：">
                            <el-input v-model="visit.name"></el-input>
                        </el-form-item>
                        <el-form-item label="性别：">
                            <el-radio-group v-model="visit.sex">
                            <el-radio label="D_PERSONUSRSEX_MAN">男</el-radio>
                            <el-radio label="D_PERSONUSRSEX_WOMAN">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="手 机 号：">
                            <el-input v-model="visit.tel"></el-input>
                        </el-form-item>
                        <el-form-item label="量体时间">
                            <el-col :span="6">
                            <el-date-picker type="date" placeholder="选择日期" v-model="visit.date" style="width: 100%;"></el-date-picker>
                            </el-col>
                            <el-col class="line" :span="2">-</el-col>
                            <el-col :span="6">
                            <el-time-picker type="fixed-time" placeholder="选择时间" v-model="visit.date" style="width: 100%;"></el-time-picker>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="备 注: ">
                            <el-input type="textarea" v-model="visit.measureMemo"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="postVolume">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title=""
            :visible.sync="editReserve3"
            width="900px">
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
            </div> -->
            <div class="pain-row two-row">
                <div class="row-item addressMap">
                    <span>选择门店：</span>
                </div>
                <div class="row-item pain-shop" v-if="infoList.length >0">
                    <ul>
                        <li v-for="(item, index) in infoList" @click="addressSelect(item, index)" :key="index">
                            <div class="shop-left">
                                <i class="van-checkbox__icon iconfont" :class="[infoActive === index ? 'icon-xuanzhongyuanxing' : 'icon-weixuanzhongyuanxing']"></i>
                            </div>
                            <div class="shop-right">
                                <div class="right-one">{{item.dptName}}</div>
                                <div class="right-twe">{{item.provinceName}}{{item.cityName}}{{item.districtName}}{{item.address}}</div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="row-item pain-shop" v-else>
                    暂无门店
                </div>
                <div class="row-item pain-map" id="allmap" ref="allmap">
                </div>
            </div>
            <div class="pain-row three-row">
                <div class="sure-btn" @click="mapSubmit('sure')">确认</div>
                <div class="cancel-btn" @click="mapSubmit('cancel')">取消</div>
            </div>
        </el-dialog>
        <EditDialog
        :Id="Id"
        :destId="destId"
        ></EditDialog>
    </div>
</template>
<script>
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
    } from 'element-ui'
    import { Base } from '../../api/service'
    import { cityData } from '../../assets/js/cityData'
    import {UserService,Volume} from "../../api/service";
    import { MP } from '../../utils/map'
    import EditDialog from "../../components/address/EditDialog";
    export default {
        components: {
            "EditDialog":EditDialog,
            'el-cascader':Cascader,
            'el-select':Select
        },
        data() {
            return {
                infoActive: '',
                infoList:[],
                editReserve3:false,
                // 上门量体
                visit: {
                    sex:"D_PERSONUSRSEX_MAN",
                    id:'',
                    name: "",
                    tel: "",
                    address: "",
                    addressDetail: "",
                    date: "",
                    addressInfo: {
                        province:'',
                        district:'',
                        city:''
                    },
                    dptId: '',
                    measureMemo:'',
                    addressModel:[]
                },
                // 到店量体
                store: {
                    id:'',
                    sex:"D_PERSONUSRSEX_MAN",
                    name: "",
                    tel: "",
                    address: "",
                    addressDetail: "",
                    date: "",
                    addressInfo: {
                    province: '',
                    district: '',
                    city: ''
                    },
                    dptId: '',
                    measureMemo: '',
                    addressModel:[]
                },
                dialogTitle:"新增预约量体",
                addressInfo: {
                    name: '',
                    phone: '',
                    addressModel:[],//级联选择器v-model
                    addressId:"",//  地址id
                    province: '',
                    district: '',
                    city: '',
                    addressId: '',
                    detail: ''
                },
                areaList: [],// 表单可选地址列表
                Id:null,
                destId:10120102,
                editReserve:true,
                addReserve:false,
                active:1,
                show: false,
                radio: '1',
                list: [],
                loading: false,
                finished: false,
                pageNum:1,
                lastPage:null,
                dialogVisible: false,
                fromPage: "", 
                addressList: [], // 地址列表
                username: "",
                userEmail: "",
                columns: [
                    {
                        text: "男",
                        value: "D_MALE"
                    },
                    {
                        text: "女",
                        value: "D_FEMALE"
                    }
                ],
                form: {
                    name: '',
                    region: '',
                    date1: new Date(2016, 9, 10, 18, 40),
                    date2: new Date(2016, 9, 10, 18, 40),
                    delivery: false,
                    type: [],
                    resource: '1',
                    desc: ''
                },
                sexPickerShow: false,
                dialogVisible: false,
                userphone: "",
                userbirthday: "",
                s_id:null,
                pageTitle:  !!this.$route.meta.title ? this.$route.meta.title : '吃人',
                userInfo:null
            }
        },
        metaInfo() {
            return {
                meta: [    // set meta
                    {
                        name: 'keyWords',
                        content: '巴龙商城首页'
                    }
                ]
            }
        },
        methods: {
            //  提交预约量体
            async postVolume() {
                let data = {};
                if (this.form.resource === 2) {
                    if (
                    !this.visit.addressInfo.district||
                    !this.visit.addressDetail ||
                    !this.visit.name ||
                    !this.visit.tel ||
                    !this.visit.addressInfo.city ||
                    !this.visit.sex||
                    !this.visit.date
                    ) {
                    this.$message({
                        type: 'info',
                        message: '请先完善信息~'
                    });
                    this.btnLock = false;
                    return;
                    }
                    if (!isPhone(this.visit.tel)) {
                    this.$message({
                        type: 'info',
                        message: '请填写正确手机号~'
                    });
                    this.btnLock = false;
                    return;
                    }
                    data = {
                    id: this.visit.id,
                    msrWayCode: "D_MSRVISIT",
                    cargousrName: this.visit.name,
                    measurePersonSex: this.visit.sex,
                    cargousrSex: 'D_MALE',
                    cargoMobile: this.visit.tel,
                    stateName: this.visit.addressInfo.province,
                    cityName: this.visit.addressInfo.city,
                    destName: this.visit.addressInfo.district,
                    address: this.visit.addressDetail,
                    orderTime: this.visit.date,
                    usrId: Storage.get('USER_INFO').usrId,
                    dptId: null,
                    shopId: Storage.get('USER_INFO').shopId,
                    measureMemo: this.visit.measureMemo,
                    companyId: Storage.get("COMPANYID").company_id
                    };
                } else {
                    if (
                    !this.store.name ||
                    !this.store.tel ||
                    !this.store.addressInfo.city ||
                    !this.store.addressDetail ||
                    !this.store.date
                    ) {
                    this.$message({
                        type: 'info',
                        message: '请先完善信息~'
                    });
                    this.btnLock = false;
                    return;
                    }
                    if (!isPhone(this.store.tel)) {
                    this.$message({
                        type: 'info',
                        message: '请填写正确手机号~'
                    });
                    this.btnLock = false;
                    return;
                    }
                    data = {
                        id: this.store.id,
                        personUsrSexName:  this.store.sex,
                        msrWayCode: "D_MSRSHOP",
                        cargousrName: this.store.name,
                        cargoMobile: this.store.tel,
                        stateName: this.store.addressInfo.province,
                        cityName: this.store.addressInfo.city,
                        destName: this.store.addressInfo.district,
                        address: this.store.addressDetails,
                        orderTime: this.store.date,
                        usrId: Storage.get('USER_INFO').usrId,
                        dptId: this.store.dptId,
                        shopId: Storage.get('USER_INFO').shopId,
                        measureMemo: this.store.measureMemo
                    };
                }
                console.log(data)
      // let saveResult=await  Volume.saveVolume(data);
                await Volume.saveVolume(data).then(
                    (res) => {
                        console.log("有结果呦",data)
                    })



            },
            updateShop () {
                this.editReserve3 = true;
                this.editReserve = false;
                this.getShopAddr()

            },
            /*
             * 确定
             */
            mapSubmit (word) {
                if(word == 'cancel'){
                    this.editReserve3 = false;
                    this.editReserve = true;
                    return
                }
                if(word == 'sure'){
                    if(!this.actAddressDetail){
                        this.$message({
                            type: 'info',
                            message: '请先选择门店~'
                        });
                        return
                    }
                    this.store.dptId = this.dptId
                    console.log("mendianID",this.store.dptId)
                    this.store.dptCode = this.dptCode
                    this.store.addressInfo = this.addressInfo
                    this.store.addressDetail = this.actAddressDetail
                    this.editReserve3 = false;
                    this.editReserve = true;
                     
                }
                

            },
            /**
             * 点击地图坐标，坐标移动中心
             * @param lng 经度
             * @param lat 纬度
             * @private
             */
            _mapToCenter (lng, lat) {
                this.map.panTo(new BMap.Point(lng, lat))
            },
            /**
             * 点击门店
             */
            addressSelect (item, index) {
                this.infoActive = index
                this.actAddressDetail = item.dptName
                this.addressDetails =item.address
                this.dptId = item.dptId
                this.dptCode = item.dptCode
                // 点击覆盖物，中心移动到覆盖物
                this._mapToCenter(item.lng, item.lat)
            },
            /**
             * 初始化地图
             * npm run build
             */
            _initMap () {
                // 防止ak暴露
                console.log("有进来哦")
                MP('kyQyvOBQwLUVrHieFzUcfV1TZt0slzlG').then(BMap => {
                    this.map = new BMap.Map('allmap')
                    console.log("地图的map",this.map)
                    let top_left_navigation = new BMap.NavigationControl()  //右下角，添加默认缩放平移控件
                    this.map.centerAndZoom(this.currentCity, 12)                       //初始化地图,设置城市和地图级别
                    this.map.enableScrollWheelZoom(true)                    // 缩放
                    this.map.addControl(top_left_navigation)
                    this.infoList.forEach((item, index) => {
                        let point = new BMap.Point(item.lng, item.lat)
                        let marker = new BMap.Marker(point)             // 创建标注
                        this.map.addOverlay(marker)                     // 将标注添加到地图中
                        marker.addEventListener('click', this._attribute)
                        if(item.dptId == Storage.get('VOLUME_STORE').dptId){
                            this.infoActive = index
                        }
                    })
                })
            },
            //  获取用户信息
            getUser () {
                let data ={}
                UserService.getUserInfo(data).then((res) => {
                    this.userInfo = res
                }).then(()=>{
                    this.getShopAddr()
                })
            },
            //  获取到店量体地址列表
            getShopAddr () {
                let data = {
                    ownCompanyId: Storage.get("COMPANYID").company_id,
                    stateName: this.store.addressInfo.province,
                    cityName: this.store.addressInfo.city,
                    destName: this.store.addressInfo.district,
                    cardNo: this.userInfo.cardNo,
                    buscontscode:'D_BUSCONTS_WSC'
                }
                Volume.getShopAddr(data).then((res)=> {
                    this.infoList = []
                    res.forEach((item)=> {
                        item.lng = item.lon
                        this.infoList.push(item)
                    })
                    console.log("柳暗花明");
                    this.currentCity= this.store.addressInfo.city
                    this._initMap()
                }, (err)=> {})
            },
            actionReserve(index) {
                if(this.list[index].msrWayCode == 'D_MSRSHOP'){
                    this.form.resource = '1'
                    let storeData = {
                        id:'',
                        name: "",
                        tel: "",
                        address: "",
                        addressDetail: "",
                        date: "",
                        addressInfo: {
                            addressId: '',
                            province:'',
                            district:'',
                            city:''
                        },
                        dptCode:'',
                        dptId: '',
                        measureMemo:''
                    }
                    this.store.id = this.list[index].id
                    this.store.name = this.list[index].cargousrName
                    this.store.tel = this.list[index].cargoMobile
                    this.store.date = this.list[index].measureTime
                    this.store.address = this.list[index].stateName + this.list[index].cityName + this.list[index].destName
                    this.store.addressDetail = this.list[index].dptName
                    this.store.measureMemo = this.list[index].measureMemo
                    this.store.addressInfo.addressId = this.list[index].destCode
                    this.store.addressInfo.province = this.list[index].stateName
                    this.store.addressInfo.city = this.list[index].cityName
                    this.store.addressInfo.district = this.list[index].destName
                    this.store.dptId = this.list[index].dptId
                    this.store.dptCode = this.list[index].dptCode
                    this.store.sex = this.list[index].personUsrSexCode
                    var s_arr =[]
                    s_arr.push(this.list[index].stateCode)
                    s_arr.push(this.list[index].cityCode)
                    s_arr.push(this.list[index].destCode)
                    this.store.addressModel = s_arr
                    let data ={}
                    UserService.getUserInfo(data).then((res) => {
                        this.userInfo = res
                    }).then(()=>{
                        let a_data = {
                            ownCompanyId: Storage.get("COMPANYID").company_id,
                            stateName: this.list[index].stateName,
                            cityName: this.list[index].cityName,
                            destName: this.list[index].destName,
                            cardNo: this.userInfo.cardNo,
                            buscontscode:'D_BUSCONTS_WSC'
                        }
                        Volume.getShopAddr(a_data).then((res)=> {
                            console.log(res,"门店")
                        }, (err)=> {})
                    })
                    // console.log(storeData)
                    // Storage.set('VOLUME_STORE', storeData)
                    // Storage.set('DATA', storeData)
                    this.editReserve = true
                }
                if(this.list[index].msrWayCode == 'D_MSRVISIT'){
                    this.form.resource = '2'
                    let visitData = {
                        id:'',
                        name: "",
                        tel: "",
                        address: "",
                        addressDetail: "",
                        date: "",
                        addressInfo: {
                            province:'',
                            district:'',
                            city:''
                        },
                        dptId: '',
                        measureMemo:''
                    }
                    this.visit.id = this.list[index].id
                    this.visit.name = this.list[index].cargousrName
                    this.visit.tel = this.list[index].cargoMobile
                    this.visit.date = this.list[index].measureTime
                    this.visit.address = this.list[index].stateName + this.list[index].cityName + this.list[index].destName
                    this.visit.addressDetail = this.list[index].address
                    this.visit.measureMemo = this.list[index].measureMemo
                    this.visit.addressInfo.province = this.list[index].stateName
                    this.visit.addressInfo.city = this.list[index].cityName
                    this.visit.addressInfo.district = this.list[index].destName
                    this.visit.dptId = this.list[index].dptId
                    this.visit.sex = this.list[index].personUsrSexCode
                    var s_arr =[]
                    s_arr.push(this.list[index].stateCode)
                    s_arr.push(this.list[index].cityCode)
                    s_arr.push(this.list[index].destCode)
                    this.visit.addressModel = s_arr
                    console.log(this.visit.addressModel,"$$$$$$$$$$$$$")
                    this.editReserve = true
                }
            },
            initState(){

            },
            // 省市区选择确定
            areaChange(value){
                console.log("do for yourself",this.$refs.cascader)
                console.log("do for yourself",this.$refs.cascader.currentLabels)
                if(value[2]){
                    this.addressInfo.addressId = value[2]
                }else if(value[1]){
                    this.addressInfo.addressId = value[1]
                }else{
                    this.addressInfo.addressId = value[0]
                }
                this.store.addressInfo.province = this.$refs.cascader.currentLabels[0]
                this.store.addressInfo.city = this.$refs.cascader.currentLabels[1]
                this.store.addressInfo.district = this.$refs.cascader.currentLabels[2]
                this.getShopAddr()
            },
            tabChange(){
                console.log("有值哟，有值哟")
            },
            //取消预约
            cancelReserve1(index) {
                console.log(this.s_id,"有id呦")
                if(this.list[index].id !==''){
                this.s_id = this.list[index].id
                this.dialogVisible = true
                }
            },
            delReserve(){
                if(this.s_id !==''){
                     let data ={
                        usrId: Storage.get('USER_INFO').usrId,
                        companyId: Storage.get('COMPANYID').company_id,
                        ids: this.s_id,
                        ownCompanyId:Storage.get("COMPANYID").company_id,
                    }
                    Volume.delSaleMeasure(data).then(
                        (res) => {
                            if(res == 1 ){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.dialogVisible = false
                            this.list.splice(index, 1);
                            }else{
                                this.$message({
                                    type: 'info',
                                    message: '删除失败!'
                                });
                                this.dialogVisible = false
                            }
                        },
                        () => {
                            this.$message({
                                type: 'info',
                                message: '提交出错了!'
                            });
                        }
                    );
                }
            },
            //取消预约
            cancelReserve(index) {
                Dialog.confirm({
                    title: '确定删除该条量体记录吗？',
                    confirmButtonText:'确定',
                    cancelButtonText:'取消'
                    }).then(() => {
                 if(this.list[index].id !==''){
                     let data ={
                        usrId: Storage.get('USER_INFO').usrId,
                        companyId: Storage.get('COMPANYID').company_id,
                        ids: this.list[index].id,
                        ownCompanyId:Storage.get("COMPANYID").company_id
                    }
                    Volume.delSaleMeasure(data).then(
                        (res) => {
                            console.log(res);
                            if(res == 1 ){
                            Toast("删除成功");
                                this.list.splice(index, 1);
                                }else{
                                Toast("删除失败");
                            }
                        },
                        () => {
                            Toast("提交出错了~");
                        }
                    );
                 }
                }).catch(() => {
                    // on cancel
                });
            },
        },
        created() {
            let _that = this
            let data ={
                usrId: Storage.get('USER_INFO').usrId,
                companyId: Storage.get('COMPANYID').company_id,
                searchUsrId: Storage.get('USER_INFO').usrId,
                pageNum: 1,
                pageSize: 5
            }
            Volume.getVolumeList(data).then(
                (res) => {
                    console.log(res);
                    _that.list = res.list
                    this.lastPage = res.lastPage
                },
                () => {
                    Toast("接口出错了~");
                }
            );
            // this.getUserInfo();
            this.areaList = c_disposeCityData(cityData);
            this.getUser()
        }
    }
</script>

<style scoped lang="scss">
    .pain-row{
        overflow: hidden;
        .row-item{
            float: left;
        }
        .cascader-item{
            margin-left:25px;
        }
        .pain-shop{
            
           margin-left:25px;
           margin-right: 50px;
           width: 260px;
           li{
               display: inline-block;
               margin-bottom:34px;
           }
           .shop-left{
            float: left;
               i{
                   width:20px;
                   height:20px;
                   margin-right: 24px;
               }
           }
           .shop-right{
           width: 220px;
           float: left;
                .right-one{
                    font-size:16px;
                    font-family:PingFangSC-Medium;
                    font-weight:500;
                    color:rgba(51,51,51,1);
                }
                .right-twe{
                    margin-top: 13px;
                    font-size:14px;
                    font-family:PingFangSC-Medium;
                    font-weight:500;
                    color:rgba(153,153,153,1);
                }
           }
           
        }
        .pain-map{
            width:443px;
            height:380px;
            background:rgba(245,243,239,1);
            border:1px solid rgba(204,204,204,1);
        }
    }
    .three-row{
        text-align: center;
        margin-top: 53px;
        .sure-btn{
            margin-right: 56px;
            display: inline-block;
            width:188px;
            height:54px;
            background:rgba(182,159,125,1);
            border:1px solid rgba(182,159,125,1);
            font-size:16px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(255,255,255,1);
            text-align: center;
            line-height: 54px;
        }
        .cancel-btn{
            display: inline-block;
            width:188px;
            height:54px;
            background:rgba(255,255,255,1);
            border:1px solid rgba(182,159,125,1);
            font-size:16px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(182,159,125,1);
            text-align: center;
            line-height: 54px;
        }
    }
    .two-row{
        margin-top: 39px;
    }
    .pain-icon{
        margin: 0 12px;
        .icon{
            width:20px;
            height:20px;
        }
    }
    .pain-update{
        width:188px;
        line-height: 54px;
        text-align: center;
        height:54px;
        background:rgba(182,159,125,1);
        border:1px solid rgba(182,159,125,1);
        margin-left:80px; 
        display: inline-block;
        font-size:16px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(255,255,255,1);
    }
    .pain-cancel{
        font-size:16px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(182,159,125,1);
        margin-left:56px;
        display: inline-block;
        width:188px;
        line-height: 54px;
        text-align: center;
        height:54px;
        background:rgba(245,243,239,1);
        border:1px solid rgba(182,159,125,1);
    }
    .ul-title{
        height:50px;
        background:rgba(245,245,245,1);
        font-size:18px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height: 50px;
        padding: 0 19px; 
    }
    .li-item{
        .item-row{
            margin-bottom: 30px;
        }
        font-size:14px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        padding: 0 19px;
        padding-top: 32px;
        .row-word{
            color: #999999;
        }
        .row-third{
            width: 33%;
            display: inline-block;
        }
    }

    .fl-right{
        float: right;
        font-size:14px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(61,120,204,1);
    }
    .left-div{
        float: left;
        display: inline-block;
        width:180px;
        // height:536px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(204,204,204,1);
        margin-top: 32px;
        .first-title{
            margin-top: 45px;
            margin-bottom: 18px;
            font-size:18px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(51,51,51,1);
            padding-left: 31px;
        }
        .item{
            font-size:14px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(153,153,153,1);
            padding-left: 31px;
            margin-bottom: 17px;
        }
    }
    .right-div{
        width: calc(100% - 220px);
        float: left;
        display: inline-block;
        margin-top: 32px;
        margin-left: 28px;
        .two-row{
            height: 10px;
        }
        .right-item{
            font-size:14px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(51,51,51,1);
            margin-bottom: 31px;
        }
        .rightWord{
            font-size:14px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(61,120,204,1);
        }
    }
    .right-title i{
        font-size: 7px;
        color: rgba(204,204,204,1);
    }
    .userHeader{
        width:60px;
        height:60px;
        border-radius: 50%;
    }
    .ul-container{
        border:1px solid rgba(204,204,204,1);
        padding-bottom: 31px;
        margin-bottom: 33px;
    }
    .right-content{
        .content-title{
            width: 100%;
            height:50px;
            padding-left: 19px;
            line-height: 50px;
            background:rgba(245,245,245,1);
        }
        background:rgba(255,255,255,1);
        width: 100%;
        display: inline-block;
        .content{
            margin-left: 120px;
            margin-top: 53px;
            width: 300px;
        }
    }
    .right-content{
        .content-title{
            width: 100%;
            height:50px;
            padding-left: 19px;
            line-height: 50px;
            background:rgba(245,245,245,1);
        }
        background:rgba(255,255,255,1);
        width: 100%;
        display: inline-block;
        .content{
            margin-left: 120px;
            margin-top: 53px;
            width: 300px;
        }
    }
</style>
