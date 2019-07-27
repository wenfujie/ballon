/**
 * Created by en.chen on 2018-06-20.
 */

import Vue from "vue";

/**
 * 设置窗体配置
 */
global.setWin = function () {
    var winWidth = window.innerWidth
    var winHeight = window.innerHeight
    let fontSize = winWidth / 375 * 20
    document.getElementsByTagName('html')[0].style.fontSize = fontSize + 'px'
    // 窗体
    global.$win = {
        screenRatio: winHeight / winWidth,
        rem: fontSize,
        width: winWidth,
        height: winHeight,
        widthRem: winWidth / fontSize,
        heightRem: winHeight / fontSize
    }
}


/**
 * 基础业务常量
 */
global.baseConstant = {
    busContsCode: 'D_BUSCONTS_B2C', // 业务触点
    serverUrl: process.env.NODE_ENV == "development" ? "http://127.0.0.1:3000/" : '',
    // 域名后路径加项目名称
    pathProjectName: process.env.NODE_ENV == "development" ? "" : "",
    partClassCode: '10'  // (用于商品墙获取一级分类传参)
}

// 页面编码
global.pageCode = {
    //  首页模块内容
    'index': {
        'name': 'index',
        'children': {
            'blpclbt01': 'blpclbt01',  // 巴龙PC轮播图
            'bzxp01': 'bzxp01',  // 本周新品01
            'bzxp02': 'bzxp02',  // 本周新品02
            'rmdp': 'rmdp',  // 热卖单品
        }
    },
    //  现购模块
    'chooseBuy': {
        'name': 'choosebuy',
        'children': {
            'category': 'hsfl',
            'scene': 'choosebuy02'
        }
    },
    //  量体模块
    'volume': {
        'name': 'reserve-volume',
        'children': {
            'detail': 'yylt01'
        }
    },
    //  企业团购
    'teamPurchase': {
        'name': 'choosebuy02',
        'children': {
            'part': 'qiyetuangou',
        }
    },
    // 底部导航web3D，获取goodsCode
    'goodsDesign': {
        'name': 'hdh03'
    },
    // 登录页
    'login': {
        'name': 'login'
    }
}
Vue.config.productionTip = false
