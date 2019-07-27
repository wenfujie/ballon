/*
 * @Author: yongtian.hong
 * @Date: 2018-11-13 19:41:32
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-22 15:12:21
 * @Description: 售后申请API
 */
import http from "@/util/http"
export default class {

    /***********
     * 获取售后类型
     * @params={
     *    saleOrdDtId: "" 
     * }
     */
    static getWays(params) {
        return http.get("postSale/getWays", params);
    }

    /***********
     * 获取售后申请单列表
     * @params={
     *  pageNum: 1,
     *  pageSize: 10
     * }
     */
    static getList(params) {
        return http.get("postSale/getList", params);
    }


}