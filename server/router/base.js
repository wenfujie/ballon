/*
* createTime：2018/7/2
* author：en.chen
* description: 中间层提供给前端的基础模块api
*/
const base = require('../controller/base/base')

module.exports = {
    // 'GET/constants': getContent,
    'GET/shopList': base.getShopList,
    'GET/destnation': base.getDestnation,//获取地区信息
    'GET/thirdLoginList': base.getThirdLoginList,//获取第三方登录方式列表
    'GET/payList': base.getPayList,//获取支付方式列表
    'GET/getVipHasPsw': base.getVipHasPsw,//根据用户id查询用户是否创建登录密码
    'PUT/updateUserInfo': base.updateUserInfo,//更新账号的的用户登录名称以及密码
    // 'GET/plamset': getPlamset,
    // 'GET/companyQuery': getCompanyQuery
};
