/*
* createTime：2018/7/25
* author：en.chen
* description: 登陆模块api
*/

import http from '../../utils/http'

/**
 * 登陆步骤1
 * 传递目标url，获取code
 * @param config
 * @returns {*}
 */

export const wechatLogin = (config) => {return http.post('login/authorizeUrl',config); }

/**
 * 登陆步骤2
 * 传递code，获取微信端用户信息
 * @param config
 * @returns {*}
 */

export const wechatInfo = (config) => {return http.post('login/authorizeInfo',config); }

/**
 * 登陆步骤2
 * 传递code，获取微信端用户信息，pc使用
 * @param config
 * @returns {*}
 */

export const wechatInfoPc = (config) => {return http.post('login/authorizeInfoPc',config); }

/**
 * 登陆步骤2
 * 传递code，获取支付宝用户信息
 * @param config
 * {
 *      signupHdId：登录方式id
 *      code: 网页授权code
 *      ownCompanyId
 *      companyId
 * }
 * @returns {*}
 */

export const getAliUserInfo = (config) => {return http.post('login/getAliUserInfo',config); }

/**
 * 登陆步骤2
 * 传递code，获取qq用户信息
 * @param config
 * {
 *      signupHdId：登录方式id
 *      code: 网页授权code
 *      redirectUri: 跳转页面URL,与第一步中传入的redirectUri保持一致
 *      ownCompanyId
 *      companyId
 * }
 * @returns {*}
 */

export const getQQUserInfo = (config) => {return http.post('login/getQQUserInfo',config); }

/**
 * 登陆步骤3
 * 传递openId，获取商城用户信息
 * @param config
 * var param = {
    busContsCode: "业务触点",
    openId: "微信号",
    unionId: "微信公众号唯一码",
    signupTypeCode: "联合登录类型",
    domainName: "域名"
   }
 * @returns {*}
 */

export const userInfo = (config) => {return http.get('login/userLogin',config); }
