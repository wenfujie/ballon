/*
* createTime：2018/7/5
* author：en.chen
* description: 中间层提供给前端的内容管理模块api
*/

// const getCmsTemplate = require('../controller/cms/cms-template')
//
// const getUsrCmsTemplate = require('../controller/cms/user-cms-template')
//
// const getCmsInfoV2 = require('../controller/cms/cms-info-v2')
//
// const getCrumbs = require('../controller/cms/cms-crumbs')
//
// const getNavigation = require('../controller/cms/cms-navigation')
//
// const getWebItemGoods = require('../controller/cms/cms-webitem-goods')
//
// const getChoosebuyGoods = require('../controller/cms/choosebuy-list-goods')
//
// const getProperties = require('../controller/cms/properties')

const Cms = require('../controller/cms')

module.exports = {
    "GET/cmsInfoV2": Cms.getCmsInfoV2,
    "GET/crumbs": Cms.getCrumbs,
    "GET/crumbsDetail": Cms.getCrumbsDetail,
    "GET/navigation": Cms.getNavigation,
    // "GET/webItemGoods": getWebItemGoods,
    "GET/choosebuyGoods": Cms.getChoosebuyGoods,
    "GET/getProperties": Cms.getProperties,
    "GET/getTemplate": Cms.getTemplate
};
