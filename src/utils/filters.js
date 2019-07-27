/**
 * createTime: 2018/9/10 17:06
 * author: zhibin.zhao
 * description:
 */
import Storage from './storage.js'
class filters {
    static imgFilter (fileUrl) {
        if(!!fileUrl){
            return baseConstant.serverUrl + "file-system/getImg?" + ("fileUrl=" + fileUrl + "&companyId=" + Storage.get('COMPANYID').company_id)
        }else{
            return require('../assets/images/common/none.png')
        }

        // return baseConstant.serverUrl + "file-system/getImg?" + ("fileUrl=" + fileUrl + "&companyId=239")
    }
    static videoFilter (fileUrl) {
        return baseConstant.serverUrl + "file-system/getVideo?" + ("fileUrl=" + fileUrl + "&companyId=" + Storage.get('COMPANYID').company_id)
        // return baseConstant.serverUrl + "file-system/getVideo?" + ("fileUrl=" + fileUrl + "&companyId=239")
    }
    static getShareImg (fileUrl, companyId) {
        return baseConstant.serverUrl + "file-system/getImg?" + ("fileUrl=" + fileUrl + "&companyId=" + companyId)
    }
}
export default filters