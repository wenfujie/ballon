(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-77415e14"],{"4a4b":function(o,s,t){"use strict";var e=function(){var o=this,s=o.$createElement,t=o._self._c||s;return t("div",[o.recommendList&&o.recommendList.length?t("table",{staticClass:"com-table"},[t("thead",{staticClass:"com-thead"},[t("th",[o._v(o._s(o.$t("components.guessLike")))])]),t("tbody",[t("div",{staticClass:"main"},[t("div",{staticClass:"page-btn prev-page",on:{click:function(s){return o.changePage("prev")}}}),t("ul",{staticClass:"flex-box"},o._l(o.recommendList,function(s,e){return t("li",{key:e,staticClass:"list-item",on:{click:function(t){return o.handleClickGoodItem(s)}}},[t("img",{directives:[{name:"lazy",rawName:"v-lazy",value:o.getImg(s.fileUrl),expression:"getImg(item.fileUrl)"}],attrs:{alt:""}}),t("span",{staticClass:"list-item-name",attrs:{title:s.platformProdName}},[o._v(o._s(s.platformProdName))]),t("span",{staticClass:"list-item-price"},[o._v("¥"+o._s(o._f("$goldDivide")(s.salePrice)))])])}),0),t("div",{staticClass:"page-btn next-page",on:{click:function(s){return o.changePage("next")}}})])])]):o._e()])},i=[],a=t("22ce"),n={components:{},data:function(){return{page:{pageNum:1,pageSize:4,pages:1},recommendList:[]}},props:{findType:{default:"D_LABEL_O4",type:String}},methods:{changePage:function(o){if("prev"===o){if(this.page.pageNum<=1)return;this.page.pageNum--}else{if(this.page.pageNum>=this.page.pages)return;this.page.pageNum++}this.getGuessLikeList()},handleClickGoodItem:function(o){var s="";s=1==o.orderFlag?"/goods-design?goodsCode=".concat(o.platformProdCode,"&goodsId=").concat(o.ptiPartHdId):"/goods-detail?goodsCode=".concat(o.platformProdCode,"&goodsId=").concat(o.ptiPartHdId),this.$router.push(s)},getGuessLikeList:function(){var o=this,s={findType:this.findType,buscontsCode:Storage.get("properties").busContsCode,pageNum:this.page.pageNum,pageSize:this.page.pageSize,shopId:Storage.get("properties").shopId};c_showLoading(),a["d"].getPutGoods(s).then(function(s){o.recommendList=s.list,o.page.pages=s.pages,o.$nextTick(function(){c_showLoading(!1)})})}},created:function(){this.getGuessLikeList()}},d=n,c=(t("9221"),t("2877")),l=Object(c["a"])(d,e,i,!1,null,"09bd49d4",null);s["a"]=l.exports},"7c51":function(o,s,t){},9221:function(o,s,t){"use strict";var e=t("dbab"),i=t.n(e);i.a},b057:function(o,s,t){"use strict";t.r(s);var e=function(){var o=this,s=o.$createElement,t=o._self._c||s;return t("div",{staticClass:"wrapper goods-detail"},[t("div",{staticClass:"crumbs"},[o.crumbs?t("ul",{staticClass:"crumbs-con clearfix"},[t("router-link",{staticClass:"crumbs-item",attrs:{to:"/",tag:"li"}},[t("span",[o._v(o._s(o.$t("pages.index")))]),t("i",{staticClass:"iconfont icon-jiantou"})]),o._l(o.crumbs,function(s){return t("li",{key:s.id,staticClass:"crumbs-item",on:{click:function(t){return o.goList(s)}}},[t("span",[o._v(o._s(s.cmsBusconclaHdName))]),t("i",{staticClass:"iconfont icon-jiantou"})])})],2):o._e()]),t("div",{staticClass:"goods-con clearfix"},[t("div",{staticClass:"fl"},[t("div",{staticClass:"goods-cover clearfix"},[t("div",{staticClass:"cover-main fl"},[t("img",{attrs:{src:o.getImg(o.mainCover.url),alt:""}})]),t("div",{staticClass:"cover-list fr"},[o.goodsSwipperList.length>5?t("div",{staticClass:"prev-btn",on:{click:function(s){return o.coverSlider(-1)}}},[t("i",{staticClass:"iconfont icon-xiangxiajiantou"})]):o._e(),t("ul",o._l(o.goodsSwipperList,function(s,e){return e>=o.imageSlider.minIndex&&e<o.imageSlider.maxIndex?t("li",{key:e,staticClass:"cover-item",class:{selected:o.mainCover.index===e},on:{click:function(s){return o.showImg(e)}}},[t("img",{attrs:{src:o.getImg(s),alt:""}})]):o._e()}),0),o.goodsSwipperList.length>5?t("div",{staticClass:"next-btn",on:{click:function(s){return o.coverSlider(1)}}},[t("i",{staticClass:"iconfont icon-xiangxiajiantou"})]):o._e()])]),t("div",{staticClass:"goods-ensure"},[t("ul",{staticClass:"clearfix"},[t("li",{staticClass:"ensure-item"},[t("div",{staticClass:"icon-ensure bg-ensure"}),t("span",[o._v(o._s(o.$t("goods.details.assure")))])]),t("li",{staticClass:"ensure-item"},[t("div",{staticClass:"icon-ensure bg-send"}),t("span",[o._v(o._s(o.$t("goods.details.send")))])]),t("li",{staticClass:"ensure-item"},[t("div",{staticClass:"icon-ensure bg-after-sale"}),t("span",[o._v(o._s(o.$t("goods.details.afterSale")))])])])])]),t("div",{staticClass:"goods-info fr"},[t("h2",{staticClass:"goods-name"},[o._v(o._s(o.goodsInfo.goodsName))]),t("div",{staticClass:"goods-panel"},[t("div",{staticClass:"goods-promotional"},[t("div",{staticClass:"goods-price clearfix"},[t("label",{staticClass:"promotion-label"},[o._v(o._s(o.$t("goods.details.salePrice"))+"：")]),t("div",{staticClass:"fl mg-l10"},[t("span",{staticClass:"sale-price"},[o._v("￥"+o._s(o.goodsInfo.salePrice))]),o.goodsInfo.tagPrice&&o.goodsInfo.tagPrice>0?t("span",{staticClass:"tag-price mg-l10"},[o._v("￥"+o._s(o.goodsInfo.tagPrice))]):o._e()])]),o.coupons.length>0?t("div",{staticClass:"discount clearfix"},[t("label",{staticClass:"promotion-label"},[o._v(o._s(o.$t("goods.details.discount"))+"：")]),t("ul",{staticClass:"fl mg-l10 clearfix coupons-list all"},[o.priceCoupon?t("li",{staticClass:"coupons-item",on:{click:o.goVouchersCenter}},[t("div",{staticClass:"fl coupons-val"},[o._v(o._s(o.priceCoupon.initialValue)+o._s(o.$t("unit.priceUnit"))+" "+o._s(o.$t("goods.details.coupons")))])]):o._e(),o.discountCoupon?t("li",{staticClass:"coupons-item",on:{click:o.goVouchersCenter}},[t("div",{staticClass:"fl coupons-val"},[o._v(o._s(parseFloat((10*o.discountCoupon.discount).toFixed(2)))+o._s(o.$t("unit.discount"))+" "+o._s(o.$t("goods.details.discountCard")))])]):o._e(),t("div",{staticClass:"more",on:{click:o.goVouchersCenter}},[o._v("\n                                "+o._s(o.btnName)+"\n                                "),t("i",{staticClass:"fr iconfont icon-jiantou",class:{rotate:!!o.showAllCoupons}})])])]):o._e()])]),t("div",{staticClass:"size-con clearfix"},[t("label",{staticClass:"con-label font-small text-primary"},[o._v(o._s(o.$t("goods.common.size"))+"：")]),t("ul",{staticClass:"fl mg-l10 clearfix"},o._l(o.goodsSize,function(s){return t("li",{key:s.sizeId,staticClass:"size-item",class:[{selected:s.sizeCode===o.sizeCode},{disabled:0==s.canSelectFlag||0==o.sellFlag||o.goodsStock<=0}],on:{click:function(t){return o.choseSize(s)}}},[o._v(o._s(s.sizeName))])}),0)]),t("div",{staticClass:"color-con clearfix"},[t("label",{staticClass:"con-label font-small text-primary"},[o._v(o._s(o.$t("goods.common.color"))+"：")]),t("ul",{staticClass:"fl mg-l10 clearfix"},o._l(o.goodsColor,function(s,e){return t("li",{key:s.colorId,staticClass:"color-img",class:[{selected:s.colorCode===o.colorCode},{disabled:0==s.canSelectFlag||0==o.sellFlag||o.goodsStock<=0}],on:{click:function(t){return o.choseColor(s)}}},[t("img",{directives:[{name:"lazy",rawName:"v-lazy",value:o.getImg(s.urls[0]),expression:"getImg(item.urls[0])"}],attrs:{title:s.colorName}}),s.colorCode===o.colorCode?t("div",{staticClass:"selected-btn"}):o._e()])}),0)]),t("div",{staticClass:"amount-con clearfix"},[t("label",{staticClass:"con-label fl font-small text-primary"},[o._v(o._s(o.$t("common.quantity"))+"：")]),t("div",{staticClass:"fl mg-l10 inputNumber"},[t("el-input-number",{attrs:{size:"small",min:1,max:o.stock,placeholder:o.oldAmount,disabled:0==o.sellFlag},on:{blur:o.handleBlur,change:o.handleChange},model:{value:o.amount,callback:function(s){o.amount=s},expression:"amount"}})],1),t("p",{staticClass:"fl font-small $text-secondary mg-l10"},[o._v(o._s(o.$t("goods.details.stock"))+"："+o._s(this.stock))])]),t("div",{staticClass:"goods-btns clearfix"},[t("div",{directives:[{name:"show",rawName:"v-show",value:!!o.sellFlag,expression:"!!sellFlag"}],staticClass:"buy-btn",on:{click:function(s){return o.goodsHandle(1)}}},[o._v(o._s(o.$t("goods.details.buy")))]),t("div",{directives:[{name:"show",rawName:"v-show",value:!!o.sellFlag,expression:"!!sellFlag"}],staticClass:"cart-btn",on:{click:function(s){return o.goodsHandle(0)}}},[o._v(o._s(o.$t("goods.details.joinCart")))]),t("div",{directives:[{name:"show",rawName:"v-show",value:0==o.sellFlag,expression:"sellFlag == 0"}],staticClass:"unshelves-btn"},[o._v(o._s(o.$t("goods.details.unShelves")))]),t("div",{staticClass:"handle-btn share-btn"},[t("div",{staticClass:"bdsharebuttonbox"},[t("a",{staticClass:"bds_weixin",attrs:{href:"#","data-cmd":"weixin",title:"分享到微信"}}),t("a",{staticClass:"bds_tsina",attrs:{href:"javascript:void(0)",title:"分享到新浪微博"},on:{click:function(s){return o.share("xinlang")}}})]),o._m(0),t("p",[o._v(o._s(o.$t("common.share")))])])])])]),t("div",{staticClass:"goods-info-detail"},[t("ul",{staticClass:"detail-tab-con clearfix"},[t("li",{staticClass:"tab-item",class:{selected:0===o.detailType},on:{click:function(s){o.detailType=0}}},[o._v(o._s(o.$t("goods.details.goodsDetail")))]),t("li",{staticClass:"tab-item",class:{selected:1===o.detailType},on:{click:function(s){o.detailType=1}}},[o._v(o._s(o.$t("goods.details.goodsComment")))])]),t("div",{directives:[{name:"show",rawName:"v-show",value:0===o.detailType,expression:"detailType === 0"}],staticClass:"goods-title"},[t("p",{directives:[{name:"show",rawName:"v-show",value:!o.hasTitle,expression:"!hasTitle"}],staticClass:"font-small text-primary"},[o._v(o._s(o.$t("goods.details.without"))+o._s(o.$t("goods.details.goodsDetail"))+"~")]),o._l(o.goodsTitle,function(s){return o.goodsTitle.length>0?t("div",{key:s.id,staticClass:"goods-title-con"},[t("div",{staticClass:"tab-content",domProps:{innerHTML:o._s(s.descContent)}})]):o._e()})],2),t("div",{directives:[{name:"show",rawName:"v-show",value:1===o.detailType,expression:"detailType === 1"}],staticClass:"goods-comment"},[t("p",{staticClass:"font-small text-primary"},[o._v(o._s(o.$t("goods.details.without"))+o._s(o.$t("goods.details.goodsComment"))+"~")])])]),t("LoginDialog",{ref:"LoginDialog",on:{generalLoginSuccess:o.vouchersCallBack}})],1)},i=[function(){var o=this,s=o.$createElement,t=o._self._c||s;return t("div",{staticClass:"icon-box"},[t("i",{staticClass:"iconfont icon-fenxiang"})])}],a=t("cebc"),n=(t("a481"),t("ac6a"),t("5d2d")),d=t("22ce"),c=t("4a4b"),l=t("2f62"),r=t("5539"),g={components:{RecommendList:c["a"],LoginDialog:r["a"]},data:function(){return{goodsCode:null,goodsId:null,crumbs:null,goodsInfo:{},goodsImages:[],imageSlider:{minIndex:0,maxIndex:5},mainCover:{url:null,index:0},goodsSize:[],goodsColor:[],colorCode:"",sizeCode:"",sizeId:"",stockList:[],goodsStock:null,coupons:[],showAllCoupons:!1,promotion:{},promotionList:[],amount:1,detailType:0,goodsTitle:[],comments:[],sellFlag:0,goodsSkuListSellFlag:[],btnLock:!1,showLogin:!1,oldAmount:"1",goodsSwipperList:[],operationsType:null,vouchersFlag:!1}},methods:{getGoodsInfo:function(){var o=this;c_showLoading();var s={usrId:n["a"].get("USER_INFO")?n["a"].get("USER_INFO").usrId:0,busContsCode:baseConstant.busContsCode?baseConstant.busContsCode:n["a"].get("properties").busContsCode,goodsCode:this.goodsCode||this.$route.query.goodsCode,shopId:n["a"].get("properties").shopId};d["d"].getGoodsInfo(s).then(function(s){o.goodsInfo=s,o.goodsInfo.goodsCode=o.goodsCode;var t=s.colorsVoList;t.forEach(function(s,t){s.stucks="",s.effFlag="",s.canSelectFlag=1,s.urls&&s.urls.length>0?s.urls.forEach(function(s){o.goodsImages.push(s)}):s.urls=["./assets/images/common/error.png"],s.dtColorUrls&&s.dtColorUrls.length>0&&s.urls.forEach(function(s){o.goodsSwipperList.push(s)})}),o.goodsSwipperList.length>0?o.mainCover.url=o.goodsSwipperList[0]:o.mainCover.url=o.goodsInfo.url,0===o.goodsColor.length&&o.goodsColor.push(t[0]);var e=[];t.forEach(function(s){o.goodsColor.forEach(function(o){e.push(o.colorId)}),-1===e.indexOf(s.colorId)&&o.goodsColor.push(s)});var i=s.sizesVoList;i.forEach(function(o){o.stucks="",o.effFlag="",o.canSelectFlag=1}),o.goodsSize=i,o.$nextTick(function(){o.shareInit()})}).then(function(){o.goodsInfo.orderGoodsCode&&o.getGoodsInfoTitle(),o.getGoodsPromotion()})},getGoodsTree:function(){var o=this,s={partCode:this.goodsCode,buscontsCode:n["a"].get("properties").busContsCode};d["d"].getGoodsClassTree(s).then(function(s){o.crumbs=s})},goList:function(o){o.cmsBusconclaHdCode&&this.goPage("/goods-list?classId="+o.cmsBusconclaHdCode)},getGoodsPromotion:function(){var o=this,s={ptiPartHdId:this.goodsId||this.goodsInfo.orderGoodsCode,busContsCode:baseConstant.busContsCode?baseConstant.busContsCode:n["a"].get("properties").busContsCode,shopId:n["a"].get("properties").shopId};d["d"].getGoodsPromotion(s).then(function(s){o.coupons=s.couponsCards,o.promotion=s.giftVos,s.giftVos.length>0&&(o.promotionList=[],s.giftVos.forEach(function(s){s.giftGoodsDtos.length&&s.giftGoodsDtos.length>0&&o.promotionList.push.apply(o.promotionList,s.giftGoodsDtos)}))})},getGoodsInfoTitle:function(){var o=this,s={goodsId:this.goodsInfo.orderGoodsCode};d["d"].getGoodsTitle(s).then(function(s){s.forEach(function(o){var s=o.descContent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi,function(o,s){var t=s.indexOf("=")+1,e=getImg(s.substring(t,o.length));return'<img src="'+e+'" style="width: 100%; display: block; margin: 0;">'}),t=s.replace(/\<pre\>/gi,function(){return'<pre style="word-wrap: break-word;white-space:pre-wrap;">'}),e=t.replace(/\<p\>/gi,function(){return'<p style="word-wrap: break-word;white-space:pre-wrap;">'});o.descContent=e}),o.goodsTitle=s})},showImg:function(o){this.mainCover.index=o,this.mainCover.url=this.goodsSwipperList[o]},checkValue:function(o){o.target.value&&!o.target._value||(o.target.value=1,o.target._value=1)},handleBlur:function(){this.amount=parseInt(this.amount)},handleChange:function(o){var s=this;if(o?(this.amount=o,this.oldAmount=this.amount+""):(o=parseInt(this.oldAmount),this.amount=o),this.sizeCode)for(var t=function(o){s.stockList[o].sizeCode===s.sizeCode&&s.goodsColor.forEach(function(t){t.colorCode===s.stockList[o].colorCode&&(t.stucks=s.stockList[o].skuQty,t.effFlag=s.stockList[o].effFlag,s.stockList[o].skuQty>0&&s.stockList[o].skuQty>=s.amount?t.canSelectFlag=1:t.canSelectFlag=0)})},e=0;e<this.stockList.length;e++)t(e);else if(this.colorCode){var i=function(o){s.stockList[o].colorCode===s.colorCode&&s.goodsSize.forEach(function(t){t.sizeCode===s.stockList[o].sizeCode&&(t.stucks=s.stockList[o].skuQty,t.effFlag=s.stockList[o].effFlag,s.stockList[o].skuQty>0&&s.stockList[o].skuQty>=s.amount?t.canSelectFlag=1:t.canSelectFlag=0)})};for(e=0;e<this.stockList.length;e++)i(e)}},shelvesInfo:function(){var o=this,s=[],t={};t.goodsCode=this.goodsCode||this.$route.query.goodsCode,t.busContsCode=baseConstant.busContsCode?baseConstant.busContsCode:n["a"].get("properties").busContsCode,t.companyId=n["a"].get("COMPANYID").company_id,s.push(t);var e={spPartGoodsSearchDtoList:s};d["d"].getGoodsSellState(e).then(function(s){s[0].sellFlag&&s[0].spPartGoodsSkuList&&(o.sellFlag=s[0].sellFlag,o.goodsSkuListSellFlag=s[0].spPartGoodsSkuList),0===o.sellFlag&&o.$toast("商品已下架~")}).then(function(){o.getGoodsStucks()})},getGoodsStucks:function(){var o=this,s={busContsCode:n["a"].get("properties").busContsCode,goodsCode:this.goodsCode,shopCode:n["a"].get("properties").shopCode};d["d"].getGoodsStock(s).then(function(s){o.goodsStock=s.goodsQty,o.stockList=s.skuList,o.goodsSkuListSellFlag.length>0&&s.skuList.length&&s.skuList.length>0&&o.stockList.forEach(function(s){o.goodsSkuListSellFlag.forEach(function(o){s.skuId===o.ptiPartDtSkuId&&(s.effFlag=o.effFlag)})})})},coverSlider:function(o){o>0?o+this.imageSlider.maxIndex>this.goodsSwipperList.length?(this.imageSlider.maxIndex=this.goodsSwipperList.length,this.imageSlider.minIndex=this.goodsSwipperList.length-5):(this.imageSlider.maxIndex+=o,this.imageSlider.minIndex+=o):o+this.imageSlider.minIndex<0?(this.imageSlider.maxIndex=5,this.imageSlider.minIndex=0):(this.imageSlider.maxIndex+=o,this.imageSlider.minIndex+=o)},choseSize:function(o){var s=this;if(this.goodsStock<=0||0===this.sellFlag||0===o.stucks||0===o.effFlag||0==o.canSelectFlag)this.$toast("该类商品库存不足或已下架");else if(o.sizeCode===this.sizeCode?(this.sizeCode="",this.goodsColor.forEach(function(o){o.stucks="",o.effFlag="",o.canSelectFlag=1})):(this.sizeCode=o.sizeCode,this.sizeId=o.sizeId),this.sizeCode)for(var t=function(o){s.stockList[o].sizeCode===s.sizeCode&&s.goodsColor.forEach(function(t){t.colorCode===s.stockList[o].colorCode&&(t.stucks=s.stockList[o].skuQty,t.effFlag=s.stockList[o].effFlag,s.stockList[o].skuQty>=s.amount&&s.stockList[o].effFlag>0?t.canSelectFlag=1:t.canSelectFlag=0)})},e=0;e<this.stockList.length;e++)t(e)},choseColor:function(o){var s=this;if(this.goodsStock<=0||0===this.sellFlag||0===o.stucks||0===o.effFlag||0==o.canSelectFlag)this.$toast("该类商品库存不足或已下架");else if(o.colorCode===this.colorCode?(this.colorCode="",this.goodsSize.forEach(function(o){o.stucks="",o.effFlag="",o.canSelectFlag=1})):this.colorCode=o.colorCode,this.colorCode)for(var t=function(o){s.stockList[o].colorCode===s.colorCode&&s.goodsSize.forEach(function(t){t.sizeCode===s.stockList[o].sizeCode&&(t.stucks=s.stockList[o].skuQty,t.effFlag=s.stockList[o].effFlag,s.stockList[o].skuQty>=s.amount&&s.stockList[o].effFlag>0?t.canSelectFlag=1:t.canSelectFlag=0)})},e=0;e<this.stockList.length;e++)t(e)},getCheckShelvesParams:function(){var o=[],s={};return s.goodsCode=this.goodsCode||this.$route.query.goodsCode,s.busContsCode=baseConstant.busContsCode?baseConstant.busContsCode:n["a"].get("properties").busContsCode,s.companyId=n["a"].get("COMPANYID").company_id,s.ptiPartDtskuId=this.skuId,o.push(s),o},checkShelves:function(){var o=this.getCheckShelvesParams(),s={spPartGoodsSearchDtoList:o};return d["d"].getGoodsSellState(s)},getCheckStockParams:function(){var o={shopId:n["a"].get("properties").shopId,inventoryJudgeDtos:[{count:this.amount,orderFlag:0,ptiPartDtSkuId:this.skuId,ptiPartHdCode:this.goodsCode,ptiPartHdId:this.goodsId||this.goodsInfo.ptiPartHdId}]};return o},checkStock:function(){var o=this.getCheckStockParams();return d["d"].getGroupGoodsStockCust(o)},getSaveCartParams:function(){var o={amount:this.amount,busContsCode:n["a"].get("properties").busContsCode,dptId:n["a"].get("properties").shopId,goodsCode:this.goodsCode,partDtSkuId:this.skuId,newPartDtSkuId:this.skuId,salePrice:this.goodsInfo.salePrice,flag:0};return o},saveCart:function(){var o=this,s=this.getSaveCartParams();d["j"].saveCart(s).then(function(){o.$store.dispatch("user/updateShoppingCart"),o.$toast("加入购物车成功~"),c_showLoading(!1)}).then(function(){o.btnLock=!1})},getBuyGoodsParams:function(){var o=this,s=null,t=null;this.goodsColor.forEach(function(e){e.colorCode===o.colorCode&&(s=e.fileId,t=e.colorId)});var e={interfaceCode:"SP_SALE_SAVECARTTEMP",sourceCode:"D_ORDSHOP",skuList:[{amount:this.amount,colorCode:this.colorCode,sizeCode:this.sizeCode,salePrice:this.goodsInfo.salePrice,tagPrice:this.goodsInfo.tagPrice,goodsCode:this.goodsCode,thumb:this.goodsInfo.url,pictFileId:s,ptiPartDtSkuId:this.skuId,ptiPartHdId:this.goodsInfo.ptiPartHdId,colorId:t,sizeId:this.sizeId}],amountOrd:this.amount*this.goodsInfo.salePrice};return e},buyGoods:function(){var o=this,s=this.getBuyGoodsParams(),t=Object.assign({ctmUsrId:n["a"].get("USER_INFO").usrId,cookieId:n["a"].get("USER_INFO").usrId,shopCode:n["a"].get("properties").shopCode,usrKey:n["a"].get("USER_INFO").usrId},s);d["g"].saveCartTemp(t).then(function(s){return d["g"].orderPreferCal({ordId:s}).then(function(){c_showLoading(!1),o.$router.push("/order-settle?orderHdId="+s)})},function(s){o.$toast(s.errorMsg)})},goodsHandle:function(o){var s=this;if(this.operationsType=o,!0!==this.btnLock){if(this.btnLock=!0,!this.skuId)return this.$toast("请先选择商品的颜色和尺码~"),void(this.btnLock=!1);if(!this.isLogin)return this.setLoginCallbackInfo(),this.$refs.LoginDialog.dialogVisible=!0,void(this.btnLock=!1);c_showLoading(),this.checkShelves().then(function(o){return!(!o[0].sellFlag||1!==o[0].sellFlag||1!==o[0].skuSellFlag)}).then(function(t){t?s.checkStock().then(function(o){return!(o.enoughAll<=0)}).then(function(t){t?(1===o&&s.buyGoods(),0===o&&s.saveCart()):(c_showLoading(!1),s.$toast("商品库存不足"),s.btnLock=!1)}):(s.$toast("商品已下架~"),c_showLoading(!1),s.btnLock=!1)})}},getGoodsDetail:function(){var o=this,s={usrId:n["a"].get("USER_INFO")?n["a"].get("USER_INFO").usrId:0,busContsCode:baseConstant.busContsCode?baseConstant.busContsCode:n["a"].get("properties").busContsCode,goodsCode:this.goodsCode||this.$route.query.goodsCode,shopId:n["a"].get("properties").shopId};d["d"].getGoodsInfo(s).then(function(s){s.goodsCode=o.goodsCode,o.goodsInfo=s})},collectToggle:function(){var o=this;if(0!=this.sellFlag)if(this.isLogin)if(1===this.goodsInfo.collectionFlag){var s={goodCodeStr:this.goodsCode,ids:this.goodsInfo.rtlCollectionDtId};d["c"].deleteCollection(s).then(function(s){o.$nextTick(function(){o.$toast("已取消收藏~"),o.getGoodsDetail()})})}else{var t={busContsCode:n["a"].get("properties").busContsCode,goodsCode:this.goodsCode,shopId:n["a"].get("properties").shopId};d["c"].addCollection(t).then(function(s){1===s&&o.$nextTick(function(){o.$toast("收藏成功~"),o.getGoodsDetail()})})}else this.$refs.LoginDialog.dialogVisible=!0;else this.$toast("该商品已下架~")},share:function(){if(0!=this.sellFlag){var o=(new Date).getTime(),s=encodeURIComponent("我发现了一个非常不错的商品！".concat(this.shareMsg.goodsName,"，只要").concat(this.goodsInfo.salePrice,"元，倾情推荐！")),t=window.location.href+"&tp="+o;t=encodeURIComponent(t);var e=encodeURIComponent(this.shareMsg.bdPic.join("||")),i="http://v.t.sina.com.cn/share/share.php?appkey=168486312&title="+s+"&url="+t+"&pic="+e;window.open(i)}else this.$toast("该商品已下架~")},shareInit:function(){var o=this;setTimeout(function(){if(c_showLoading(!1),window._bd_share_main)window._bd_share_main.init();else{var s=document.createElement("script");s.type="text/javascript",s.src="http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion="+~(-new Date/36e5),document.body.appendChild(s),window._bd_share_config={common:{bdText:"我发现了一个非常不错的商品！".concat(o.shareMsg.goodsName,"，只要").concat(o.goodsInfo.salePrice,"元，倾情推荐！"),bdDesc:"我发现了一个非常不错的商品！".concat(o.shareMsg.goodsName,"，只要").concat(o.goodsInfo.salePrice,"元，倾情推荐！"),bdUrl:window.location.href,bdPic:o.shareMsg.bdPic.join("||")},share:[],slide:[],image:[]}}},1e3)},goVouchersCenter:function(){if(!this.isLogin)return this.vouchersFlag=!0,void(this.$refs.LoginDialog.dialogVisible=!0);var o=this.$router.resolve({path:"/vouchers-center",query:{goodsCode:this.goodsCode,ptiPartHdId:this.goodsId?this.goodsId:this.goodsInfo.orderGoodsCode}});window.open(o.href,"_blank")},vouchersCallBack:function(){if(this.vouchersFlag){var o=this.$router.resolve({path:"/vouchers-center",query:{goodsCode:this.goodsCode,ptiPartHdId:this.goodsId?this.goodsId:this.goodsInfo.orderGoodsCode}});window.open(o.href,"_blank")}},getImageUrl:function(o){var s=window.location.host;return"localhost"==window.location.hostname||"127.0.0.1"==window.location.hostname?s="localhost:3000":s+="/ballon",s+"/file-system/getImg?fileUrl="+o+"&companyId="+n["a"].get("COMPANYID").company_id},setLoginCallbackInfo:function(){var o={};2===this.operationsType?o={}:0!==this.operationsType&&1!==this.operationsType||(o={vm:this,type:this.operationsType,spPartGoodsSearchDtoList:this.getCheckShelvesParams(),inventoryJudgeDtos:this.getCheckStockParams(),orderData:this.getBuyGoodsParams(),cartData:this.getSaveCartParams()}),this.$store.commit("goods/setData",{storeKey:"operationType",storeValue:this.operationsType}),this.$store.commit("goods/setData",{storeKey:"operationParams",storeValue:o})}},computed:Object(a["a"])({btnName:function(){return this.showAllCoupons?this.$t("goods.details.retract"):this.$t("goods.details.more")},hasTitle:function(){return this.goodsTitle.length>0},skuId:function(){var o=this,s="";return this.stockList.forEach(function(t){t.sizeCode===o.sizeCode&&t.colorCode===o.colorCode&&(s=t.skuId)}),s},shareMsg:function(){var o=this,s=this.goodsSwipperList,t={},e=[];return s.forEach(function(s){t=o.getImageUrl(s),e.push(t),t={}}),{goodsName:this.goodsInfo.goodsName?this.goodsInfo.goodsName:null,bdPic:e}},isLogin:function(){return!!this.userInfo},stock:function(){var o=0;if(this.sizeCode&&this.colorCode)for(var s=0;s<this.stockList.length;s++)this.stockList[s].skuId===this.skuId&&(o=this.stockList[s].skuQty);else if(this.sizeCode&&!this.colorCode)for(var t=0;t<this.stockList.length;t++)this.stockList[t].sizeCode===this.sizeCode&&(o+=this.stockList[t].skuQty);else if(!this.sizeCode&&this.colorCode)for(var e=0;e<this.stockList.length;e++)this.stockList[e].colorCode===this.colorCode&&(o+=this.stockList[e].skuQty);else this.sizeCode||this.colorCode||(o=this.goodsStock);return o},priceCoupon:function(){var o="";if(this.coupons.length<=0)return o;for(var s=0;s<this.coupons.length;s++){var t=this.coupons[s];if(!t.discount&&t.initialValue)return t}return o},discountCoupon:function(){var o="";if(this.coupons.length<=0)return o;for(var s=0;s<this.coupons.length;s++){var t=this.coupons[s];if(t.discount)return t}return o}},Object(l["c"])("user",["userInfo"])),created:function(){this.goodsCode=this.$route.query.goodsCode,this.goodsId=this.$route.query.goodsId,this.type=null,this.getGoodsInfo(),this.getGoodsTree(),this.shelvesInfo()},mounted:function(){this.$nextTick(function(){window._bd_share_main&&window._bd_share_main.init()})}},u=g,h=(t("de04"),t("2877")),f=Object(h["a"])(u,e,i,!1,null,"40dbe7e8",null);s["default"]=f.exports},dbab:function(o,s,t){},de04:function(o,s,t){"use strict";var e=t("7c51"),i=t.n(e);i.a}}]);