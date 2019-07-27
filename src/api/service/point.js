/*
* createTime：2018/11/6
* author：en.chen
* description: 前端积分模块api
*/

import http from '../../utils/http'

/**
 * 获取积分详情
 * @param config
 * var param = {
    usrId: 用户id,
    companyId: 公司id
    }
 * @returns {*}
 */

export const getPointDetail = (config) => {return http.get('point/detail',config); }

export const sellCardData = (config) => {return http.put('point/sellCardData', Object.assign(config, {isMeasure: true})); }

export const getCardData = (config) => {return http.get('point/getCardData', Object.assign(config, {isMeasure: true})); }

/**
 * 获取用户是否可使用积分flag
 * @param config
 * var param = {
    usrId: 用户id,
    companyId: 公司id
    ownCompanyId: 公司id
    }
 * @returns {*}
 */

export const getUsePointFlag = (config) => {return http.get('point/pointFlag',config); }

/**
 * 根据价格计算赠送积分
 * @param config
 * var param = {
    usrId: 用户id,
    companyId: 公司id
    ownCompanyId: 公司id
    price: 商品,组合价格
    }
 * @returns {*}
 */

export const getComputePresentPointer = (config) => {return http.get('point/computePointer',config); }