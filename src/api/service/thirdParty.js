/*
 * @Author: yongtian.hong
 * @Date: 2018-10-19 10:35:35
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-10-19 10:41:49
 * @Description: 第三方相关接口
 */
import http from '../../utils/http'

// 获取物流信息
export const getLogis = (config) => {
    return http.post('thirdParty/getLogis', config);
}

/**
 * 微信第三方登录
 * @param config
 * wxLoginDto {
  "redirectUri": "string", 登录成功跳转页面URL
  "scope": "string", 应用授权作用域(目前仅填写snsapi_login)
  "signupHdId": 0, 登录方式id
  "state": "string" 跳转页面URL入参（可选参数）
}
 */
export const getWxLogin = (config) => {
    return http.post('thirdParty/getWxLogin', config);
}

/**
 * 第三方登录接口聚合（微信、qq、支付宝）
 * @param config
 *  {
  "redirectUri": "string", 登录成功跳转页面URL
  "scope": "string", 应用授权作用域(目前仅填写snsapi_login)
  "signupHdId": 0, 登录方式id
  "state": "string" 跳转页面URL入参（可选参数）
  "signupTypeCode": 支付code（微信：D_WECHAT，支付宝：D_ALI，qq：D_QQ）
  display： 不传则展示为PC下的样式。传入“mobile”，则展示为mobile端下的样式
}
 */
export const getThirdLogin = (config) => {
    return http.post('thirdParty/getThirdLogin', config);
}