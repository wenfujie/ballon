(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5ecc9dd8"],{5466:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"main"},[a("div",{staticClass:"main-cont flex-vcenter"},[1===t.pageState||2===t.pageState||3===t.pageState?a("div",{staticClass:"pay-state"},[a("i",{class:["iconfont","pay-state-img",{"icon-chenggong":"success"==t.payResult,"icon-guanbi":"failed"==t.payResult}]}),a("p",{staticClass:"pay-state-text"},[t._v("\n                "+t._s("success"==t.payResult?t.$t("pay.paySuccess"):t.$t("pay.payFail"))+"\n                "),1===t.pageState?a("span",[t._v(t._s(t.timekeeping)+"s")]):t._e()]),1===t.pageState?a("div",{staticClass:"pay-btn",on:{click:t.pageSwitch}},[t._v("\n                "+t._s("success"==t.payResult?t.$t("pay.viewBillDetail"):t.$t("pay.payGoOn"))+"\n            ")]):a("div",[t.showInfo.routerList.length>=1?a("div",{staticClass:"pay-btn",on:{click:function(e){return t.goPage(t.showInfo.routerList[0].url)}}},[t._v(t._s(t.showInfo.routerList[0].title))]):t._e(),t.showInfo.routerList.length>=2?a("div",{staticClass:"pay-btn mgT30",on:{click:function(e){return t.goPage(t.showInfo.routerList[1].url)}}},[t._v(t._s(t.showInfo.routerList[1].title))]):t._e()])]):t._e(),a("ul",{staticClass:"main-cont-list"},[a("li",{staticClass:"list-item flex-box"},[a("div",{staticClass:"label"},[t._v(t._s(t.$t("pay.payGold"))+"：")]),a("p",{staticClass:"price"},[t._v("\n                    ¥"+t._s(1==t.pageState||2==t.pageState||3==t.pageState||4==t.pageState&&t.orderType?t.actuallyPaid:t.billInfo.amountUnPay)+"\n                ")])]),2===t.pageState||3===t.pageState||4===t.pageState&&t.orderType?a("li",{staticClass:"list-item flex-box"},[a("div",{staticClass:"label"},[t._v(t._s(t.$t("pay.billGood"))+"：")]),a("p",[t._v(t._s(t.showInfo.name))])]):t._e(),a("li",{staticClass:"list-item flex-box"},[a("div",{staticClass:"label"},[t._v(t._s(t.$t("pay.billNumber"))+"：")]),a("p",[t._v(t._s(t.billCode))])]),1===t.pageState||4===t.pageState&&!t.orderType?a("li",{staticClass:"list-item flex-box"},[a("div",{staticClass:"label label-set-height"},[t._v(t._s(t.$t("pay.billGood"))+"：")]),a("ul",t._l(t.billInfo.goodsList,function(e,i){return a("li",{staticClass:"good-name"},[t._v(t._s(e.goodsName))])}),0)]):t._e(),1===t.pageState||4===t.pageState&&!t.orderType?a("li",{staticClass:"list-item flex-box"},[a("div",{staticClass:"label"},[t._v(t._s(t.$t("pay.receiveAddress"))+"：")]),a("p",[t._v(t._s(t.billInfo.cargoUsrName+" "+t.billInfo.cargoMobile+" "+t.billInfo.cargoStateName+t.billInfo.cargoCityName+t.billInfo.cargoDestName+t.billInfo.cargoAddress+" "+("mdzq"===t.billInfo.shippingWayCode?t.billInfo.recptdptName:"")))])]):t._e()])])])},s=[],l=(a("c5f6"),a("22ce")),o={components:{},data:function(){return{billInfo:{},timekeeping:5,showInfo:{name:"",routerList:[]}}},props:{billCode:String,payResult:String,orderType:{type:String,default:""},actuallyPaid:[String,Number]},computed:{pageState:function(){if(!this.payResult)return 4;switch(!0){case!this.orderType:return 1;case"D_CARDORD"===this.orderType:return 2;case"D_COUPONSORD"===this.orderType:return 3}}},methods:{goPage:function(t){this.$router.push(t)},getBillInfo:function(){var t=this,e={busContsCode:Storage.get("properties").busContsCode,billCode:this.billCode};c_showLoading(),l["g"].getDetailInfo(e).then(function(e){t.billInfo=e,c_showLoading(!1),t.$emit("getBillInfoSuc",e)})},pageSwitch:function(){this.interval&&clearInterval(this.interval),this.$emit("pageSwitch")}},created:function(){"D_CARDORD"===this.orderType&&(this.showInfo={name:this.$t("pay.membershipCard"),routerList:[{id:1,title:this.$t("pay.viewMembershipCard"),url:"/member-card"},{id:2,title:this.$t("pay.toMembership"),url:"/member-center"}]}),"D_COUPONSORD"===this.orderType&&(this.showInfo={name:this.$t("pay.coupon"),routerList:[{id:1,title:this.$t("pay.myCoupon"),url:"/vouchers-list"},{id:2,title:this.$t("pay.takeCoupon"),url:"/vouchers-center"}]})},mounted:function(){var t=this;(1===this.pageState||4===this.pageState&&!this.orderType)&&this.getBillInfo(),1===this.pageState&&(this.interval=setInterval(function(){1!=t.timekeeping?t.timekeeping--:t.pageSwitch()},1e3))}},n=o,r=(a("ff0f"),a("2877")),c=Object(r["a"])(n,i,s,!1,null,"4ea334a6",null);e["a"]=c.exports},"6be9":function(t,e,a){},"73a6":function(t,e,a){},"786c":function(t,e,a){"use strict";var i=a("73a6"),s=a.n(i);s.a},7936:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"wrapper"},[a("div",{staticClass:"main"},[a("order-info-table",{attrs:{billCode:t.billCode,payResult:t.payResult,orderType:this.orderType,actuallyPaid:t.actuallyPaid},on:{pageSwitch:t.pageSwitch}})],1)])},s=[],l=(a("a481"),a("5466")),o={components:{orderInfoTable:l["a"]},data:function(){return{billCode:"",payResult:""}},methods:{pageSwitch:function(){var t="";t="success"==this.payResult?"/order-detail?billCode="+this.billCode:"/pay-mode?actuallyPaid="+this.actuallyPaid+"&billCode="+this.billCode,this.$router.replace(t)}},created:function(){this.payResult=this.$route.query.payResult,this.billCode=this.$route.query.billCode,this.actuallyPaid=this.$route.query.actuallyPaid,this.orderType=this.$route.query.orderType}},n=o,r=(a("786c"),a("2877")),c=Object(r["a"])(n,i,s,!1,null,"b2f5ce28",null);e["default"]=c.exports},ff0f:function(t,e,a){"use strict";var i=a("6be9"),s=a.n(i);s.a}}]);