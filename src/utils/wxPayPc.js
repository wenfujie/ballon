import http from "./http"

//  获取微信appId
function getAppid(str) {
    let result = str.match("<appid.*?>([\\s\\S]*)</appid>");

    let appid = result[0]
    .replace("<appid>", "")
    .replace("</appid>", "")
    .trim();

    console.log("appid", appid);

    return appid;
}
//  微信桥接工具准备完成
function onBridgeReady(params, resolve, reject) {
    let appid = getAppid(params.requestStr);
    WeixinJSBridge.invoke(
            "getBrandWCPayRequest",
            {
                appId: appid || "wx45b40e5b82bd74d2", //公众号名称，由商户传入
                timeStamp: params.timeStamp, //时间戳，自1970年以来的秒数
                nonceStr: params.nonceStr, //随机串
                package: params.prepayId,
                signType: "MD5", //微信签名方式：
                paySign: params.paySign //微信签名
            },
            function(res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    resolve(200);
                } else {
                    reject(-1);
                }
            }
    );
}

// 调用微信支付
function wxPay(params) {
    let promise = new Promise(function(resolve, reject) {
        if (params.payAmount == 0) {
            resolve(200);
        } else if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener(
                        "WeixinJSBridgeReady",
                        onBridgeReady(params, resolve, reject),
                        false
                );
            } else if (document.attachEvent) {
                document.attachEvent(
                        "WeixinJSBridgeReady",
                        onBridgeReady(params, resolve, reject)
                );
                document.attachEvent(
                        "onWeixinJSBridgeReady",
                        onBridgeReady(params, resolve, reject)
                );
            }
        } else {
            onBridgeReady(params, resolve, reject);
        }
    });
    return promise;
}

// 小程序支付
function wxMiniProgramPay(params, price) {
    let wxParams = {
        timeStamp: params.timeStamp,
        nonceStr: params.nonceStr,
        package: params.prepayId,
        paySign: params.paySign
    };

    let promise = new Promise(function(resolve, reject) {
        if (price == 0) {
            resolve(0);
        } else {
            resolve(wxParams);
        }
    });
    return promise;
}

// 支付函数(微信二维码支付)
async function wxQrcodePay (vm, billCode, price, successUrl, orderType, payTypeCode) {
    price = Number(price);
    if (price === 0) return price;
    let payParam = {
        usrId: vm.Storage.get("USER_INFO").usrId,
        paymentCode: "D_WEIXIN",
        tradeTypeCode: "QRCODE",//QRCODE("QRCODE", "扫码支付"),DIRECT("DIRECT", "即时到账"),WAP("WAP", "WAP支付")
        paymentTypeCode: payTypeCode ? payTypeCode : "D_FULL",
        shopCode: vm.Storage.get("USER_INFO").shopCode,
        orderList: billCode,
        orderType: orderType ? orderType : null,
        // openId: vm.Storage.get("WECHAT_INFO").openid,
        openId: "",
        payAmount: Number(price),
        // unionId: Storage.get("properties").publicAccount
        unionId: "",
        successUrl:successUrl//支付成功跳转地址
    };
    let wxPayParam = await http.post("payment/orderPayment", payParam);

    if (wxPayParam.code === "200") {
        return wxPayParam
        // return wxMiniProgramPay(wxPayParam, price);
    } else {
        vm.$alert(wxPayParam.message, this.$t('common.hint'), {
            confirmButtonText: this.$t('common.sure'),
            callback: action => {}
        });
        return Promise.reject();
    }
}

// 支付宝支付
async function aliPay (vm, billCode, price, successUrl, orderType, payTypeCode) {
    price = Number(price);
    if (price === 0) return price;
    let payParam = {
        usrId: vm.Storage.get("USER_INFO").usrId,
        paymentCode: "D_ALIPAY",
        tradeTypeCode: "WEBPAY",//QRCODE("QRCODE", "扫码支付"),DIRECT("DIRECT", "即时到账"),WAP("WAP", "WAP支付"),WEBPAY(电脑支付)
        paymentTypeCode: payTypeCode ? payTypeCode : "D_FULL",
        shopCode: vm.Storage.get("USER_INFO").shopCode,
        orderList: billCode,
        orderType: orderType ? orderType : null,
        // openId: vm.Storage.get("WECHAT_INFO").openid,
        openId: "",
        payAmount: Number(price),
        // unionId: Storage.get("properties").publicAccount
        unionId: "",
        successUrl:successUrl//支付成功跳转地址
    };
    let wxPayParam = await http.post("payment/orderPayment", payParam);

    return wxPayParam;

    // 支付宝支付跟后端确认code不返回200
    // if (wxPayParam.code === "200") {
    //     return wxPayParam
    //     // return wxMiniProgramPay(wxPayParam, price);
    // } else {
    //     vm.$alert(wxPayParam.message, this.$t('common.hint'), {
    //         confirmButtonText: this.$t('common.sure'),
    //         callback: action => {}
    //     });
    //     return Promise.reject();
    // }
}

export default {wxPay: wxQrcodePay, aliPay: aliPay};
