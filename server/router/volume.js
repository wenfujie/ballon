/*
* createTime：2018/8/14
* author：en.chen
* description: 中间层提供给前端的预约量体模块api
*/

const volume = require('../controller/volume');

module.exports = {
    "GET/msrAmount": volume.getMsrAmount,
    "GET/volumes": volume.getVolumns,
    "GET/doorAddr": volume.getDoorAddr,
    "GET/shopAddr": volume.getShopAddr,
    "GET/volumeTime": volume.getRegmeasureTime,
    "POST/saveVolume": volume.saveVolume,
    "POST/sendCoupons": volume.sendCoupons,
    "GET/volumeList": volume.getVolumeList,
    "GET/volumeDataList": volume.getVolumeDataList,
    "GET/getMeasureType": volume.getMeasureType,
    "GET/getBillType": volume.getBillType,
    "GET/getSaleMeasureId": volume.getSaleMeasureId,
    "DELETE/delSaleMeasure": volume.delSaleMeasure,
    "PUT/cancelMeasure": volume.cancelMeasure,
    "DELETE/delCtmMeasure": volume.delCtmMeasure,
    "DELETE/delCtmMeasureHd": volume.delCtmMeasureHd,
    "GET/getSalemeasure": volume.getSalemeasure,
    "GET/getCtmmeasure": volume.getCtmmeasure,
    "GET/getDress": volume.getDress,
    "POST/addCtmmeasure": volume.addCtmmeasure,
    "GET/getMeasureOpInfo": volume.getMeasureOpInfo,
    "GET/measureInfor": volume.measureInfor
}
