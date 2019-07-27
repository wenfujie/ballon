/*
* createTime：2018/11/21
* author：en.chen
* description: 
*/


import http from '../../utils/http'

/**
 * 提交企业团购
 * @param config
 * var param = {
    *usrId: 用户id,
    *companyId: 公司id,
    *contactName : '',  // 联系人姓名
    *contactNumber : '',  // 联系人电话
    *destId: '',  // 省市区的区code
    *purchaseType: ''  // 团购类目
    }
 * @returns {*}
 */

export const getPointDetail = (config) => {return http.post('team-purchase/purchase',config); }