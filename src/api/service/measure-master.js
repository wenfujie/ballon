/*
* createTime：2018/11/13
* author：en.chen
* description: 量体师模块
*/

import http from '../../utils/http'

/**
 * 量体师登陆
 * @param config
 * var param = {
    *mobilePhone: '手机号',
    *registCode: '验证码'
   }
 * @returns {*}
 */

export const login = (config) => {return http.post('measure-master/login', Object.assign(config, {isMeasure: true})); }

/**
 * 量体师获取预约量体列表
 * @param config
 * var param = {
    *companyId：公司Id,
    *usrId: 用户id,
    pageNum: 分页页码,
    pageSize: 分页条数,
    statusCodes: 'MEASURE_UNFINISH',  //('MEASURE_FINISHED'表示已完成，'MEASURE_UNFINISH'表示待完成)
    personUsrId: '量体师id'
    }
 * @returns {*}
 */

export const getVolumeList = (config) => { return http.get('volume/volumeList', Object.assign(config, {isMeasure: true})); }

/**
 * 量体师信息
 * @param config
 * var param = {
    *usrId: '用户id',
    *companyId: '公司id'
   }
 * @returns {*}
 */

export const getInfo = (config) => {return http.get('measure-master/info', Object.assign(config, {isMeasure: true})); }

/**
 * 通过手机号获取量体师信息
 * @param config
 * var param = {
    mobile: '手机号',
    companyId: '公司id'
   }
 * @returns {*}
 */

export const checkPhone = (config) => {return http.get('measure-master/checkPhone', Object.assign(config, {isMeasure: true})); }

/**
 * 修改量体师信息
 * @param config
 * var param = {
    * usrId: '用户id',
    * companyId: '公司id',
    * destCode: '省市区编码'
   }
 * @returns {*}
 */

export const putInfo = (config) => {return http.put('measure-master/info', Object.assign(config, {isMeasure: true})); }

/**
 * 获取会员量体数据
 * @param config
 * var param = {
    *ctmUsrId: '用户id',
    *companyId: '公司id',
    *msrModeTypeCode: 'D_ACTUALMSR' (参数为量体类型编码，D_ACTUALMSR表示实际量体，参数写死)
    dressedUsrName:'着装人姓名',
    measureClassInfoId: '量体类别',
    billCode: '版本流水号'
   }
 * @returns {*}
 */

export const getMeasureInfo = (config) => {return http.get('measure-master/measureInfo', Object.assign(config, {isMeasure: true})); }

/**
 * 删除会员量体数据
 * @param config
 * var param = {
     ownCompanyId:'权限企业id',
     companyId:'公司id',
     usrId:'用户ID', 
     ids:'商品ID'
   }
 * @returns {*}
 */

export const delMeasureData = (config) => {return http.put('measure-master/delMeasureData',config); }





/**
 * 获取会员量体数据
 * @param config
 * var param = {
     ownCompanyId:'权限企业id',
     companyId:'公司id',
     usrId:'用户ID', 
     ids:'商品ID'
   }
 * @returns {*}
 */

export const getMeasureData = (config) => {return http.get('measure-master/getMeasureData', Object.assign(config, {isMeasure: true})); }



/**
 * 获取量体类型
 * 获取量体类型(预约工单绑定订单)
 * @param config
 * var param = {
    *saleCode: '预约工单code',
    *companyId: '公司id'
   }
 * @returns {*}
 */

export const getMeasureType = (config) => {return http.get('measure-master/measureType', Object.assign(config, {isMeasure: true})); }

/**
 * 获取量体类型(默认类型)
 * @param config
 * var param = {
    * pageNum: 0,
    * pageSize: 0,
    * companyId: '公司id'
   }
 * @returns {*}
 */

export const getDefaultMeasureType = (config) => {return http.get('measure-master/defaultMeasureType', Object.assign(config, {isMeasure: true})); }

/**
 * 通过参照商品获取参照数据
 * @param config
 * var param = {
    *usrId: '用户id',
    *companyId: '公司id',
    *id: '商品id',
   }
 * @returns {*}
 */

export const getGoodsData = (config) => {return http.get('measure-master/goodsType', Object.assign(config, {isMeasure: true})); }

/**
 * 通过量体类别中的量体类别id查询实际量体
 * @param config
 * var param = {
    *companyId: '公司id',
    *ids: '量体类别id',（多个用逗号隔开）
    *isGetList: true(写死)
   }
 * @returns {*}
 */

export const getBodyData = (config) => {return http.get('measure-master/bodyData', Object.assign(config, {isMeasure: true})); }

/**
 * 根据商品分类id获取相同量体类别的量体类别关联数据
 * @param config
 * var param = {
    *companyId: '公司id',
    *partClassIds: '1,2,3'(商品分类ids),
   }
 * @returns {*}
 */

export const getGoodsMeasureType = (config) => {return http.get('measure-master/goodsMeasureType', Object.assign(config, {isMeasure: true})); }

/**
 * 通过商品货号精确查询商品信息
 * @param config
 * var param = {
    *companyId: '公司id',
    *partCode: '商品code',
   }
 * @returns {*}
 */

export const getGoodsInfo = (config) => {return http.get('measure-master/goodsInfo', Object.assign(config, {isMeasure: true})); }

/**
 * 保存量体数据
 * @param config
 * var param = {
    *orderBillCode: '预约工单号',
    *deRefs: [
        {
            rtlOrdDtId: '订单商品id',
            ptiPartHdId: '参考商品id',
            sizeId: '参考尺码id',
            msrModeTypeCode: '量体类型', //（实际量体'D_ACTUALMSR'和参照量体'D_REFMSR'）
            measureClassInfoId: '量体类别id',
            volumns: [
                {
                    masmeasureHdId: '量体项目id',
                    measureValue: '实际量体数据',
                    range: '参照量体数据',
                    standardValue: '量体参照数据'
                },
                {...}
            ]
        },
        {...}
    ]
   }
 * @returns {*}
 */

export const saveMeasure = (config) => {return http.post('measure-master/saveMeasure', Object.assign(config, {isMeasure: true})); }