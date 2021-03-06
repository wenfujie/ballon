/*
 * createTime：2018/7/2
 * author：en.chen
 * description: 前端使用的api模块
 */

import * as Base from './service/base'  // 基础模块
import * as UserService from './service/user-service'  // 用户功能模块
import * as Cms from './service/cms'  // 内容管理模块
import * as Goods from './service/goods'  // 商品模块
import * as ShoppingCart from './service/shopping-cart'  //购物车模块
import * as Login from './service/login'  // 用户登陆模块
import * as Volume from './service/volume'  //  预约量体模块
import * as Collection from './service/collection'  //  收藏模块
import * as Vouchers from './service/vouchers'  // 优惠券模块
import * as Order from './service/order'  // 订单模块
import * as Payment from './service/payment'  // 支付模块
import * as Invoice from './service/invoice'  //  发票模块
import * as Point from './service/point'  // 积分模块
import * as MeasureMaster from './service/measure-master'  // 量体师模块
import * as TeamPurchase from './service/team-purchase'  // 企业团购模块
import * as Salon from './service/salon'  // 线下沙龙模块
import * as Fund from './service/fund'  // 资金模块
import * as ThirdParty from './service/thirdParty'  // 资金模块


export {
    Base,
    Cms,
    UserService,
    Goods,
    ShoppingCart,
    Login,
    Volume,
    Collection,
    Vouchers,
    Order,
    Payment,
    Invoice,
    Point,
    MeasureMaster,
    TeamPurchase,
    Salon,
    Fund,
    ThirdParty
};