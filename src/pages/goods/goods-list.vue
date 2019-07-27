/*
* createTime：2019/1/23
* author：en.chen
* description: 商品列表
*/
<template>
    <div class="wrapper">
        <!-- 搜索引擎 begin -->
        <div class="nav-attrs-form" v-show="canShowCrumbs">
            <!-- 一级分类 begin -->
            <div
                class="nav-list"
                v-for="(crumb,index) in crumbsList"
                :key="crumb.id"
                v-if="crumb.sortList.length > 0"
            >
                <div class="nav-sort-name">{{crumb.escrumbsName}}</div>
                <ul class="nav-sort-list" :class="{ 'more' :crumb.showMore === true}">
                    <!-- <div class="more-btn" @click="sortToggle(crumb)" v-show="crumb.sortList.length > 3"> -->
                    <div class="more-btn" @click="sortToggle(crumb)" v-show="crumb.isShowMore">
                        {{crumb.showMore === false ? '更多':'收起'}}
                        <i
                            class="iconfont icon-xiangxiajiantou"
                            :class="{ 'more' :crumb.showMore === true}"
                        ></i>
                    </div>
                    <div class="crumbLi" :ref="'crumbLi'+index">
                        <li
                            class="sort-item"
                            :class="{ 'selected' : crumb.selectedId === sort.id }"
                            v-for="(sort,index) in crumb.sortList"
                            :key="sort.id"
                        >
                            <span
                                class="sortName"
                                @click="choseCrumbsDetail(crumb,sort.id)"
                            >{{sort.name}}</span>
                            <div
                                v-show="crumb.selectedId === sort.id"
                                class="delete"
                                @click.stop="deleteSelect(crumb)"
                            >
                                <i class="iconfont icon-guanbixiao"></i>
                            </div>
                        </li>
                    </div>
                </ul>
            </div>
            <!-- 一级分类 end -->

            <!-- 按钮组 begin -->
            <div class="sort-btn" v-if="showBtnGroup">
                <span class="reset" @click="resetCrumbsArr">重置</span>
                <span class="confirm-search" @click="getGoodsList">搜索</span>
            </div>
            <!-- 按钮组 end -->
        </div>
        <!-- 搜索引擎 end -->

        <!-- 查询条件 begin -->
        <div class="filter">
            <a
                class="sort"
                :class="{'selected' : sortParam === 'recmSeq'}"
                @click="changeSort('recmSeq')"
            >设计师推荐</a>
            <a
                class="sort"
                :class="{'selected' : sortParam === 'sales'}"
                @click="changeSort('sales')"
            >销量优先</a>
            <a
                class="sort"
                :class="{'selected' : sortParam === 'price'}"
                @click="changeSort('price')"
            >
                价格
                <i class="iconfont icon-xiangxiajiantou" :class="{ 'rotate' : sort === 'ASC' }"></i>
            </a>
        </div>
        <!-- 查询条件 end -->

        <!-- 商品列表 begin -->
        <div class="goods-list">
            <div class="empty-content" v-if="!!emptyStatus">
                <p>{{emptyGoodsTip}}</p>
            </div>
            <ul class="clearfix" v-if="showList.length > 0">
                <li
                    class="goods-item"
                    v-for="(item,index) in showList"
                    @click="goDetail(item)"
                    @mouseenter="showCoverList(item,index)"
                    @mouseleave="hideCoverList(item)"
                >
                    <div class="goods-cover">
                        <img
                            class="cover-img"
                            v-lazy="getImg(!!item.colorImgHover ? item.colorImgUrl : item.glbFileUrl)"
                            :key="!!item.colorImgHover ? item.colorImgUrl : item.glbFileUrl"
                        />
                        <!-- 定制商品使用 begin -->
                        <i
                            class="iconfont icon-dingzhitubiao customization-flag"
                            v-if="item.orderFlag === 1"
                        ></i>
                        <!-- <div class="customization-flag" v-if="item.orderFlag !== 0">定制</div> -->
                        <!-- 定制商品使用 end -->
                    </div>
                    <p class="goods-name font-small text-primary">{{item.goodsName}}</p>
                    <div class="price">
                        <span class="sale-price font-small color-red">￥{{item.salePrice}}</span>
                        <span
                            class="tag-price font-small text-secondary"
                            v-if="!!item.tagPrice && parseInt(item.tagPrice) > 0"
                        >￥{{item.tagPrice}}</span>
                    </div>
                    <div class="goods-color-list animated fadeIn" v-if="item.orderFlag == 0">
                        <div class="color-imgs">
                            <img
                                v-for="colorImg in item.coverList"
                                v-lazy="getImg(colorImg.downloadUrl)"
                                :key="colorImg.downloadUrl"
                                @mouseenter="colorImgHover(item,colorImg.downloadUrl,index)"
                                @mouseleave="colorImgMouseOut(item,index)"
                                alt
                            />
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 商品列表 end -->

        <!-- 分页 begin -->
        <div class="pagination" v-if="total>0">
            <el-pagination
                background
                layout="prev, pager, next"
                :current-page="pageNum"
                :page-size="pageSize"
                :total="total"
                @current-change="onPageChagne"
            ></el-pagination>
        </div>
        <!-- 分页 end -->
    </div>
</template>
<script>
import { Goods, Cms } from "../../api/service";
import Storage from "../../utils/storage";

export default {
    data() {
        return {
            sortParam: "recmSeq", //  商品墙筛选列表索引
            sortParamData: [{ field: "recmSeq", order: "DESC" }], //  商品墙筛选条件
            goodsList: [], //  商品列表
            showList: [], // 展示商品列表
            keyWord: "", //  关键词
            ids: "", //  获取面包屑详情的id字符串
            sort: "",
            showSelect: false,
            isLoading: true, // 是否处于加载状态
            finished: false, // 控制是否加载更多商品
            pageNum: 1,
            pageSize: 10,
            total: null, // 商品总数
            actGoodsId: null, // 处于hover状态的商品
            crumbsList: [], // 一级面包屑数组
            //                actCrumbs: '',  //  选中的一级面包屑的值
            //                crumbsSecList: [],  //  二级面包屑数组
            crumbsDetailList: [], //  三级面包屑数组
            mediaSearch: "", // 默认大于1200px
            //                showBtnGroup: false
            //                crumbsArr: []  // 搜索面包屑参数
            emptyStatus: null, // 搜索结果为空的状态标识
            delay: null
        };
    },
    methods: {
        // 页面初始化
        pageInit() {
            this.keyWord = this.$route.query.keyWord || "";
            this.mediaSearch = "";
            this.resetCrumbsArr();
            this.showList = [];
            this.getCrumbsIds();
        },

        //  获取商品墙
        getGoodsList() {
            if (
                JSON.stringify(this.keyWord) !==
                JSON.stringify(this.$store.state.goods.keyWords)
            ) {
                this.pageNum = 1;
                this.emptyStatus = false;
            }
            this.mediaSearch = ""; // 初始化更多按钮
            //                this.showBtnGroup = false   // 初始化重置、搜索按钮隐藏
            let crumbsCache = this.$store.state.goods.crumbs;
            if (
                JSON.stringify(crumbsCache) !== JSON.stringify(this.crumbsArr)
            ) {
                this.pageNum = 1;
                this.emptyStatus = false;
            }
            if (!!this.emptyStatus) {
                this.getRcmdList();
                return;
            }
            let data = {
                busContsCode: Storage.get("properties").busContsCode,
                shopId: Storage.get("properties").shopId,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                couponId: !!this.$route.query.couponId
                    ? this.$route.query.couponId
                    : "",
                origin: "",
                filters:
                    this.crumbsArr.length > 0
                        ? JSON.stringify(this.crumbsArr)
                        : this.crumbsArr,
                keyword: this.$route.query.keyWord || "",
                sortParam: JSON.stringify(this.sortParamData),
                platformCode: !!this.$route.query.classId
                    ? this.$route.query.classId
                    : "",
                queryNullBusFlag: 1,
                orderFlags: JSON.stringify([0, 1]) // 巴龙PC的需求只查询大货和定制商品
            };
            this.isLoading = true;
            c_showLoading();
            Goods.getGoodsList(data)
                .then(
                    res => {
                        this.$store.commit("goods/setData", {
                            storeKey: "keyWords",
                            storeValue: this.$route.query.keyWord || ""
                        });
                        this.ids = res.ptiPartHdIds;
                        this.showList = res.hits;
                        if (this.showList.length > 0) {
                            this.showList.forEach(item => {
                                item.coverList = [];
                                item.colorImgHover = false;
                                item.colorImgUrl = null;
                            });
                        }
                        this.total = parseInt(res.pagination.totalCount);
                        this.getCrumbsDetail();
                        this.$store.commit(
                            "goods/setCrumbsCache",
                            this.crumbsArr
                        );
                        this.emptyStatus =
                            this.showList.length <= 0 ? true : null;
                    },
                    err => {}
                )
                .then(() => {
                    // 需求新增了没有搜索词对应商品的情况下显示所有商品

                    if (!!this.emptyStatus) {
                        this.getRcmdList();
                        return;
                    } else {
                        this.isLoading = false;
                        c_showLoading(false);
                    }
                });
        },

        getRcmdList() {
            if (
                JSON.stringify(this.keyWord) !==
                JSON.stringify(this.$store.state.goods.keyWords)
            ) {
                this.pageNum = 1;
                this.emptyStatus = false;
            }
            let crumbsCache = this.$store.state.goods.crumbs;
            if (JSON.stringify(crumbsCache) !== JSON.stringify(this.crumbsArr))
                this.pageNum = 1;
            let data = {
                busContsCode: Storage.get("properties").busContsCode,
                shopId: Storage.get("properties").shopId,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                queryNullBusFlag: 1,
                orderFlags: JSON.stringify([0, 1]), // 巴龙PC的需求只查询大货和定制商品
                sortParam: JSON.stringify(this.sortParamData)
            };
            Goods.getGoodsList(data).then(
                res => {
                    this.$store.commit("goods/setData", {
                        storeKey: "keyWords",
                        storeValue: this.$route.query.keyWord || ""
                    });
                    this.ids = res.ptiPartHdIds;
                    this.showList = res.hits;
                    if (this.showList.length > 0) {
                        this.showList.forEach(item => {
                            item.coverList = [];
                        });
                    }
                    this.total = parseInt(res.pagination.totalCount);
                    this.$store.commit("goods/setCrumbsCache", this.crumbsArr);
                    this.isLoading = false;
                    c_showLoading(false);
                },
                err => {
                    this.isLoading = false;
                    c_showLoading(false);
                }
            );
        },

        //  获取面包屑一级分类（需求调整默认选中一级分类）
        //            getCrumbs() {
        //                let data = {
        //                    ptiPartClassCode: baseConstant.partClassCode
        //                }
        //                Goods.getGoodsClass(data).then((res) => {
        //                    this.crumbsList = res
        //                    if(!!this.crumbsList.length && this.crumbsList.length >0) {
        //                        this.crumbsList.forEach((item) =>{
        //                            item.showMore = false
        //                            this.choseCrumbs(item)
        //                        })
        //                    }
        //                });
        //            },

        //  获取三级面包屑详情
        getCrumbsDetail() {
            if (!this.ids) return;
            let data = {
                ptiPartHdIds: this.ids
            };
            if(this.crumbsList.length > 0) {
                this.crumbsList.forEach(item => {
                    if (!item.sortList || item.sortList.length <= 0)
                        item.sortList = [];
                });
                Cms.getCrumbsDetail(data).then(res => {
                    if (!!res.length && !!res.length > 0) {
                        this.crumbsList.forEach(item => {
                            res.forEach(sort => {
                                //  需求确认不需要每次都刷新面包屑
                                if (item.sortList.length <= 0 && item.escrumbsCode == sort.crumbsCode) {
                                    item.sortList = sort.crumbsList;
                                }
                            });
                        });
                        this.getResolution();
                    }
                });
            }else{
                let len = 0
                let interval = setInterval(() => {
                    if(this.crumbsList.length > 0 || ++len >= 100) {
                        clearInterval(interval)
                        Cms.getCrumbsDetail(data).then(res => {
                            if (!!res.length && !!res.length > 0) {
                                this.crumbsList.forEach(item => {
                                    res.forEach(sort => {
                                        //  需求确认不需要每次都刷新面包屑
                                        if (item.sortList.length <= 0 && item.escrumbsCode == sort.crumbsCode) {
                                            item.sortList = sort.crumbsList;
                                        }
                                    });
                                });
                                this.getResolution();
                            }
                        });
                    }
                },100)
            }
        },

        //  查询面包屑接口所需ids
        getCrumbsIds() {
            c_showLoading();
            if (!!this.$route.query.keyWord) {
                let data = {
                    busContsCode: Storage.get("properties").busContsCode,
                    shopId: Storage.get("properties").shopId,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    couponId: !!this.$route.query.couponId
                        ? this.$route.query.couponId
                        : "",
                    origin: "",
                    filters:
                        this.crumbsArr.length > 0
                            ? JSON.stringify(this.crumbsArr)
                            : this.crumbsArr,
                    keyword: this.$route.query.keyWord || "",
                    sortParam: JSON.stringify(this.sortParamData),
                    platformCode: !!this.$route.query.classId
                        ? this.$route.query.classId
                        : "",
                    queryNullBusFlag: 1,
                    orderFlags: JSON.stringify([0, 1]) // 巴龙PC的需求只查询大货和定制商品
                };
                Goods.getCrumbsGoodsIds(data).then(
                    res => {
                        this.getCrumbs(res.join(","), this.getGoodsList());
                    },
                    () => {
                        this.getCrumbs(null, this.getGoodsList());
                    }
                );
            } else {
                this.getCrumbs(null, this.getGoodsList());
            }
        },

        //  查询选中分类的子类(没有传分类标识的状态下后端默认选中一条)（巴龙PC左侧一级面包蟹）
        getCrumbs(ids, callback) {
            let data = {
                busContsCode: Storage.get("properties").busContsCode,
                pageSize: 0,
                pageNum: 0,
                goodsClassIds: !!ids ? ids : null
            };
            if (!!this.$route.query.classId) {
                data.platformCode = this.$route.query.classId;
            }
            Cms.getCrumbs(data).then(res => {
                res.list.forEach(item => {
                    item.sortList = []; //  二级面包屑数组
                    item.selectedId = ""; // 选中的面包屑
                    item.showMore = false; // 控制展示更多按钮
                });
                this.crumbsList = res.list;
                callback && callback();
            });
        },

        //  分类筛选
        sortToggle(crumb) {
            crumb.showMore = !crumb.showMore;
            this.$set(crumb, "showMore", crumb.showMore);
            //                this.crumbsList = JSON.parse(JSON.stringify(this.crumbsList))
        },

        //  分页查询
        onPageChagne(curPaageNo) {
            if (this.isLoading) return;
            this.pageNum = curPaageNo;
            this.getGoodsList();
        },

        //  筛选条件切换
        changeSort(sortParam) {
            if (sortParam !== "price" && sortParam === this.sortParam) return;
            else {
                if (this.sortParam !== sortParam) {
                    this.goodsList = [];
                    this.pageNum = 1;
                }
                this.sortParam = sortParam;
                if (this.sortParam === "recmSeq") {
                    this.sortParamData = [{ field: "recmSeq", order: "DESC" }];
                } else if (this.sortParam === "sales") {
                    this.sortParamData = [{ field: "sales", order: "DESC" }];
                } else if (this.sortParam === "price") {
                    if (this.sort === "DESC") {
                        this.sort = "ASC";
                        this.pageNum = 1;
                        this.sortParamData = [{ field: "price", order: "ASC" }];
                        this.goodsList = [];
                    } else {
                        this.sort = "DESC";
                        this.pageNum = 1;
                        this.sortParamData = [
                            { field: "price", order: "DESC" }
                        ];
                        this.goodsList = [];
                    }
                }
            }
            this.getGoodsList(sortParam);
        },

        //  选择三级面包屑
        choseCrumbsDetail(item, id) {
            if (item.selectedId === id) {
                // item.selectedId = ''
                return;
            } else {
                item.selectedId = id;
            }
            if (!!this.emptyStatus) this.emptyStatus = false;
        },

        // 删除选中项
        deleteSelect(item) {
            item.selectedId = "";
            if (!!this.emptyStatus) this.emptyStatus = false;
        },

        //  商品跳转
        goDetail(item) {
            if (item.orderFlag === 1) {
                this.$router.push(
                    "/goods-design?goodsCode=" +
                        item.goodsCode +
                        "&goodsId=" +
                        item.ptiPartHdId
                );
            } else if (item.orderFlag === 0) {
                this.$router.push(
                    "/goods-detail?goodsCode=" +
                        item.goodsCode +
                        "&goodsId=" +
                        item.ptiPartHdId
                );
            } else {
                alert(
                    "巴龙PC端，产品立了字据不会有组合商品的需求！！！！！！！"
                );
            }
        },

        //  获取商品颜色图
        getGoodsCoverList(item, index) {
            let data = {
                count: 4,
                partIds: [item.ptiPartHdId]
            };
            Goods.getGoodsCoverList(data).then(res => {
                item.coverList = res[item.ptiPartHdId];
                this.$set(this.showList, index, item);
                this.$store.commit("goods/setCoverCache", {
                    id: item.ptiPartHdId,
                    list: res[item.ptiPartHdId]
                });
            });
        },

        //  显示商品颜色图
        showCoverList(item, index) {
            if (item.orderFlag != 0) return;
            if (
                item.ptiPartHdId === this.actGoodsId &&
                item.coverList.length > 0
            )
                return;
            if (item.coverList.length <= 0) {
                if (!!this.$store.state.goods.coverCache[item.ptiPartHdId]) {
                    item.coverList = this.$store.state.goods.coverCache[
                        item.ptiPartHdId
                    ];
                    this.$set(this.showList, index, item);
                } else {
                    this.getGoodsCoverList(item, index);
                }
            }
            this.actGoodsId = item.ptiPartHdId;
        },

        //  隐藏商品颜色图
        hideCoverList(item) {
            this.actGoodsId = null;
        },

        //  重置搜索引擎面包屑
        resetCrumbsArr() {
            this.crumbsList.forEach(item => {
                item.selectedId = "";
            });
            if (!!this.emptyStatus) this.emptyStatus = false;
        },

        // 控制面包屑宽度-更多按钮显示
        ctrMoreBtn(clientWidth) {
            this.$nextTick(() => {
                this.crumbsList.forEach((crumb, index) => {
                    let sortName = "";
                    crumb.sortList.forEach(sort => {
                        sortName += sort.name;
                    });
                    let $ref = this.$refs["crumbLi" + index];
                    // console.log($ref[0].clientHeight)
                    if (
                        !!$ref &&
                        $ref.length > 0 &&
                        $ref[0].clientHeight > 60
                    ) {
                        // 判断高度大于60
                        crumb.isShowMore = true;
                    } else {
                        crumb.isShowMore = false;
                    }
                });
                this.crumbsList.splice(this.crumbsList.length);
            });
        },

        // 获取当前屏幕分辨率
        getResolution() {
            let $clientWidth = document.documentElement.clientWidth;
            if ($clientWidth < 1200) {
                if (this.mediaSearch == "lessthen") return;
                this.mediaSearch = "lessthen"; // 屏幕分辨率小于1200
                // console.log("小于",$clientWidth)
                this.ctrMoreBtn(748);
            } else {
                if (this.mediaSearch == "morethen") return;
                this.mediaSearch = "morethen"; // 屏幕分辨率大于等于1200
                // console.log("大于",$clientWidth)
                this.ctrMoreBtn(978);
            }
        },

        // 鼠标移入颜色图
        colorImgHover(item, url, index) {
            console.log("in");
            item.colorImgHover = true;
            item.colorImgUrl = url;
            this.$set(this.showList, index, item);
            //                this.showList = JSON.parse(JSON.stringify(this.showList))
        },

        // 鼠标移出颜色图
        colorImgMouseOut(item, index) {
            console.log("out");
            item.colorImgHover = false;
            item.colorImgUrl = null;
            this.$set(this.showList, index, item);
            //                this.showList = JSON.parse(JSON.stringify(this.showList))
        }
    },
    created() {
        this.pageInit();
    },
    mounted() {
        //            console.log(document.querySelector('.crumbLi'))
        window.onresize = () => {
            this.getResolution();
        };
    },
    watch: {
        $route(to, from) {
            if (to.path === "/goods-list") this.pageInit();
        }
    },
    computed: {
        //  判断是否显示商品墙面包屑
        canShowCrumbs: function() {
            let showFlag = false;
            if (this.crumbsList.length <= 0) {
                showFlag = false;
                return showFlag;
            } else {
                for (let i = 0; i < this.crumbsList.length; i++) {
                    let item = this.crumbsList[i];
                    if (item.sortList.length > 0) {
                        showFlag = true;
                        return showFlag;
                    }
                }
            }
        },

        //  选中的面包屑数组
        crumbsArr: function() {
            let filters = [];
            let arr = [];
            let map = {};
            if (this.crumbsList.length > 0) {
                this.crumbsList.forEach(item => {
                    if (item.selectedId !== "") {
                        map.queryField = item.escrumbsCode;
                        map.value = item.selectedId;
                        arr.push(map);
                        map = {};
                    }
                });
                if (arr.length > 0) {
                    filters = [
                        {
                            operate: "AND",
                            filterList: arr
                        }
                    ];
                }
            }
            return filters;
        },

        // 判断是否显示面包屑按钮组
        showBtnGroup: function() {
            let showFlag = false;
            for (let i = 0; i < this.crumbsList.length; i++) {
                let item = this.crumbsList[i];
                if (!!item.sortList && item.sortList.length > 0) {
                    showFlag = true;
                    return showFlag;
                }
            }
            return showFlag;
        },

        //  数据为空的提示语
        emptyGoodsTip: function() {
            let crumbs = "";
            this.crumbsList.forEach(item => {
                if (!!item.selectedId) {
                    item.sortList.forEach(crumb => {
                        if (crumb.id === item.selectedId)
                            crumbs += ` "${crumb.name}"`;
                    });
                }
            });
            let keyword = !!this.keyWord ? `"${this.keyWord}"` : "相关";
            return (
                "抱歉，没有找到" +
                keyword +
                crumbs +
                "的搜索结果，为您推荐以下热门商品"
            );
        }
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
.nav-attrs-form {
    width: 100%;
    /*height: 220px;*/
    margin-top: 35px;
    padding: 0 15px;
    border: solid 1px $color-line;
    overflow: hidden;
    .nav-list {
        display: flex;
        .nav-sort-name {
            width: 100px;
            margin-top: 13px;
            font-size: $font-small;
            line-height: 20px;
            color: $text-regular;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .nav-sort-list {
            flex: 1;
            height: 55px;
            min-height: 55px;
            overflow: hidden;
            margin-left: 20px;
            padding-right: 75px;
            border-bottom: dashed 1px $color-line;
            position: relative;
            .crumbLi {
                width: auto;
                display: inline-block;
            }
            .sort-item {
                position: relative;
                margin: 15px 5px;
                padding: 5px 40px 5px 5px;
                float: left;
                font-size: $font-small;
                line-height: 1;
                color: $text-primary;
                transition: ease 0.3s;
                cursor: pointer;
                border: 1px solid $color-white;
                .sortName {
                    width: 100%;
                    &:hover {
                        color: $color-golden;
                    }
                }
                .delete {
                    width: 25px;
                    height: 25px;
                    position: absolute;
                    top: 0;
                    right: -1px;
                    background-color: $color-golden;
                    text-align: center;
                    vertical-align: top;
                    i {
                        line-height: 25px;
                        color: $text-white;
                        font-size: 26px;
                    }
                }
                &.selected {
                    border: 1px solid $color-line;
                    color: $color-golden;
                }
            }
            .more-btn {
                position: absolute;
                top: 15px;
                right: 0;
                width: 70px;
                height: 25px;
                line-height: 25px;
                text-align: center;
                border: solid 1px $color-line;
                color: $text-primary;
                cursor: pointer;
                .icon-xiangxiajiantou {
                    display: inline-block;
                    font-size: 10px;
                    margin-left: 2px;
                    color: $text-primary;
                    transition: all 0.3s;
                    &.more {
                        transform: rotate(-180deg);
                    }
                }
            }
            &.more {
                height: auto;
            }
            &::after {
                content: "";
                display: table;
                clear: both;
            }
        }
        &:last-child {
            .nav-sort-list {
                border-bottom: none;
            }
        }
    }
    .sort-btn {
        margin: 20px 0;
        text-align: center;
        span {
            box-sizing: border-box;
            display: inline-block;
            width: 75px;
            height: 30px;
            text-align: center;
            font-size: 14px;
            line-height: 30px;
            border: solid 1px $color-golden;
            cursor: pointer;
            &.reset {
                margin-right: 18px;
                color: $color-golden;
                background: #ffffff;
            }
            &.confirm-search {
                background: $color-golden;
                color: $color-white;
            }
        }
    }
}

.crumbs {
    width: 100%;
    padding: 0 15px;
    border: solid 1px $color-line;
}

.filter {
    width: 100%;
    height: 35px;
    margin: 30px 0;
    background: $bg-color-filter;
    overflow: hidden;
    border: solid 1px $color-line;
    .sort {
        display: inline-block;
        margin-left: 30px;
        cursor: pointer;
        font-size: $font-small;
        line-height: 35px;
        color: $text-primary;
        transition: ease 0.3s;
        &:hover {
            color: $color-golden-hover;
        }
        &.selected {
            color: $color-golden-hover;
        }
    }
}

.rotate {
    display: inline-block;
    transform: rotate(180deg);
}

.goods-list {
    width: 100%;
    .empty-content {
        display: flex;
        width: 100%;
        height: 250px;
        padding: 0 20px;
        border: solid 1px $color-line;
        font-size: $font-title1;
        line-height: 22px;
        text-align: center;
        margin-bottom: 20px;
        justify-content: center;
        align-items: center;
        word-break: break-all;
    }
    ul {
        .goods-item {
            width: 227px;
            height: 300px;
            float: left;
            margin: 0 15px 30px 0;
            cursor: pointer;
            position: relative;
            z-index: 2;
            &:nth-of-type(5n) {
                margin-right: 0;
            }
            .goods-cover {
                width: 227px;
                height: 227px;
                overflow: hidden;
                position: relative;
                z-index: 9;
                .cover-img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    transition: ease 0.3s;
                }
                .customization-flag {
                    position: absolute;
                    top: 0px;
                    left: 3px;
                    font-size: 16px;
                    color: $color-golden;
                    // box-sizing: content-box;
                    // position: absolute;
                    // top: 3px;
                    // left: 3px;
                    // width: 30px;
                    // height: 16px;
                    // font-size: 10px;
                    // line-height: 16px;
                    // color: $color-golden;
                    // text-align: center;
                    // border: solid 1px $color-golden;
                    // -webkit-border-radius: 3px;
                    // -moz-border-radius: 3px;
                    // border-radius: 3px;
                    // z-index: 2;
                }
                .customization {
                    display: none;
                    position: absolute;
                    top: 3px;
                    left: 3px;
                }
            }
            .goods-name {
                margin: 12.5px 0;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                position: relative;
                z-index: 9;
            }
            .price {
                text-align: center;
                .tag-price {
                    margin-left: 8px;
                    text-decoration: line-through;
                }
                position: relative;
                z-index: 9;
            }
            .goods-color-list {
                width: 304px;
                height: 348px;
                top: -20px;
                left: -17px;
                position: absolute;
                background: $color-white;
                box-shadow: 0 2px 4px 0 rgba(29, 29, 35, 0.17);
                z-index: -1;
                display: none;
                transition: all 0.2s;
                .color-imgs {
                    position: absolute;
                    top: 22px;
                    right: 10px;
                    overflow: hidden;
                    img {
                        display: block;
                        width: 40px;
                        height: 40px;
                        margin-bottom: 10px;
                    }
                }
            }
            &:hover {
                z-index: 5;
                .goods-color-list {
                    z-index: 2;
                    display: block;
                }
            }
        }
    }
}

.pagination {
    margin: 30px 0 76px 0;
    text-align: right;
}

@media screen and (max-width: 1199px) {
    .goods-list {
        min-width: 990px;
        ul {
            .goods-item {
                margin-right: 20px;
                &:nth-of-type(5n) {
                    margin-right: 20px;
                }
            }
        }
        .empty-content {
        }
    }
}
</style>
