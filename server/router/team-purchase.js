/*
* createTime：2018/11/21
* author：en.chen
* description: 提交企业团购
*/

//  提交企业团购
const teamPurchaseFun = require('../controller/teamPurchase')

module.exports = {
    "POST/purchase": teamPurchaseFun.postPurchase,  // 提交企业团购
}
