/*
 * @Author: zhibin.zhao
 * @Date: 2018-11-13 20:54:27
 * @LastEditors: zhibin.zhhao
 * @LastEditTime: 2018-11-13 20:54:27
 * @Description: 解析小程序授权信息encryptedData
 */

const xunfei = require("../../model/xf-voice");

class xunfeiController {

    // 讯飞语音
    static async synthesizeVoice(ctx) {
        let res = await xunfei.synthesizeVoice(ctx, ctx.params);
        ctx.body = res;
    }
}

module.exports = xunfeiController;
