/*
* createTime：2018/7/2
* author：en.chen
* description: 前端基础模块api聚合
*/

import http from '../../utils/http'

/**
 * 获取常数值
 * @returns {*}
 */
export const getBase = () => { return http.get('base/constants'); }

/**
 * 获取门店列表
 * @param config
 * var params = {
 * code: 省市区编码 ,
 * codeType: 编码类型, 0: 区编码 1: 市编码 （不传默认0）
 * pageNo: 1 ,
 * pageSize: 10 }
 * @returns {*}
 */
export const getShopList = (config) => { return http.get('base/shopList',config); }


/**
 * 获取地区信息
 * @param config
 * @returns {*}
 */
export const getDestnation = () => { return http.get('base/destnation'); }

/**
 * 获取购物平台设置
 * @returns {*}
 */
export const getPlamset = () => { return http.get('base/plamset'); }

/**
 * 获取二级域名解析
 * @param config
 * var params = { companyUrl: 域名 }
 * @returns {*}
 */
export const getCompanyQuery = (config) => { return http.get('base/companyQuery',config); }

/*
* 图片上传
* @param config
* var params = { file }
* return {*}
* */
export const imgUpload = (config) => { return http.post('file-system/imgUpload',config) }

/**
 * 获取第三方登录方式列表
 * @param config
 * var params = {
 *      enableFlag: 是否启用，1是0否
 *      busContsCode: 业务触点编码
 *      ownCompanyId
 *      companyId
  * }
 * @returns {*}
 */
export const getThirdLoginList = (config) => { return http.get('base/thirdLoginList',config); }

/**
 * 获取支付方式列表
 * @param config
 * var params = {
 *      allFlag: 是否启用，1是0否
 *      dptId: 门店id
 *      ownCompanyId
 *      companyId
  * }
 * @returns {*}
 */
export const getPayList = (config) => { return http.get('base/payList',config); }

/**
 * 根据用户id查询用户是否创建登录密码
 * @param config
 * var params = {
 *      usrId: 用户名Id
 *      ownCompanyId
 *      companyId
  * }
 * @returns {*}
 */
export const getVipHasPsw = (config) => { return http.get('base/getVipHasPsw',config); }

/**
 * 更新账号的的用户登录名称以及密码
 * @param config
 * var params = {
 *      usrId: 用户名Id
 *      ownCompanyId
 *      companyId
  * }
 * @returns {*}
 */
export const updateUserInfo = (config) => { return http.put('base/updateUserInfo',config); }
