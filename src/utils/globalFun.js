/**
 * createTime: 2018/10/23 19:21
 * author: zhibin.zhao
 * description:
 */
import Vue from 'vue';
//  图片请求过滤器
import filters from './filters';
import sessionStorage from './sessionStorage'
import Storage from './storage';

import {
    Cms,
    Order,
    Base,
    Goods,
    UserService
} from "@/api/service";


global.getImg = function (e) {
    return filters.imgFilter(e);
};

global.errImg = function (e) {
    e.target.src = require('../assets/images/common/error.png')
}

global.sStorage = new sessionStorage(window.sessionStorage);// session缓存实例

global.Storage = Storage;

global.getVideo = function (e) {
    return filters.videoFilter(e);
};

// 获取分享图片
Vue.prototype.getShareImg = function (fileUrl, cpmpanyId) {
    return filters.getShareImg(fileUrl, cpmpanyId);
};

// 跳转路由
global.goToPath = function (path, params) {
    this.$router.push({
        path: path,
        params: params
    });
};
global.filterInput = function (val) {
    // 这里过滤的是特殊字符
    return val.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\.]/g, "");
}

global.filterPhone = function (val) {
    // 这里过滤的是特殊字符
    return val.replace(/[^0-9]/g, '');
}
// 验证手机号
global.isPhone = function (phone) {
    if (typeof phone === "string") {
        phone = parseInt(phone);
    }
    let reg = /^1(((5[0-35-9][0-9])|([34879][0-9]{2}))[0-9]{7})$/;
    return reg.test(phone);
};

// 验证密码复杂度 只能输入6-20个字母、数字、符号
global.checkPasswdLevel = function (s) {
    if (s.length < 6) {
        return 0;
    }
    var ls = 0;
    if (s.match(/([a-z])+/)) {
        ls++;
    }
    if (s.match(/([0-9])+/)) {
        ls++;
    }
    if (s.match(/([A-Z])+/)) {
        ls++;
    }
    if (s.match(/[^a-zA-Z0-9]+/)) {
        ls++;
    }
    console.log("复杂度为", ls);
    return ls
}

//  校验电子邮箱
global.isEmail = function (str) {
    let reg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g
    return reg.test(str)
}

//  截取url中search所带参数的值
global.getQueryVariable = function (url, variable) {
    var vars = url.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return "";
};

//  将富文本中的图片相对路径替换成文件资源路径
global.getImgPath = function (str) {
    return str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (img, src) {
        let index = src.indexOf("=") + 1;
        let imgData = getImg(src.substring(index, img.length));
        return (
            '<img src="' +
            imgData +
            '" style="width: 100%; display: block; margin: 0;">'
        );
    });
};

// 图片上传 参数为File类型
global.uploadImg = function (file) {
    let param = new FormData();
    param.append("companyId", Storage.get("COMPANYID").company_id);
    param.append("usrId", Storage.get("USER_INFO").usrId);
    // param.append('file', convertBase64UrlToBlob(file.replace(/^data:image\/(png|jpg|jpeg);base64,/,"")), "file1.png")
    param.append("file", file);
    return Base.imgUpload(param).then(
        res => {
            console.log(res, 'res')
            return res;
        },
        err => {
            console.log(err, 'err')
            return err;
        }
    );
};

// base64 转file类型
global.convertBase64UrlToBlob = function (urlData) {
    var bytes = window.atob(urlData); //去掉url的头，并转换为byte
    // 处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {
        type: "image/png"
    });
};

// 获取模板
global.getTemplate = function () {
    let busContsCode = baseConstant.busContsCode
    let properties = Storage.get('properties')
    if (!busContsCode && !!properties) {
        busContsCode = properties.busContsCode
    }
    let data = {
        busContsCode: busContsCode,
        shopId: Storage.get('properties').shopId
    };
    return Cms.getTemplate(data).then(res => {
        Storage.set("TEMPLATE_INFO", res[0]);
    });
};

/**
 * 显示关闭loading
 */
global.c_showLoading = function (boolean = true, background = 'trans') {
    if (boolean) {
        Vue.c_loading = Vue.prototype.$loading({ fullscreen: true, background: background });
    } else {
        Vue.c_loading && Vue.c_loading.close();
    }
}

// 获取业务触点编码
global.busContsCode = function () {
    if (baseConstant.busContsCode) {
        return baseConstant.busContsCode
    } else {
        let properties = Storage.get('properties')
        if (properties)
            return properties.busContsCode
        console.log('xxxx')
    }
}
/**
 * @param allDistrictFlag 是否在区列展示全部选项
 * cityData处理：处理成elementUI 中Cascader 级联选择器可使用数据
 */
global.c_disposeCityData = function (cityData, allDistrictFlag = false) {
    let arr = [];
    for (let sKey in cityData.province_list) { // 省
        arr.push({
            value: sKey,
            label: cityData.province_list[sKey],
            children: []
        })
        let item = arr[arr.length - 1];
        for (let cKey in cityData.city_list) { // 市
            let cKey2 = cKey.substring(0, 2);
            if (item.value.substring(0, 2) === cKey2) {
                let cKey4 = cKey.substring(0, 4);
                item.children.push({
                    value: cKey,
                    label: cityData.city_list[cKey],
                    children: []
                })
                for (let qKey in cityData.county_list) { // 区
                    let qKey4 = qKey.substring(0, 4);
                    if (cKey.substring(0, 4) === qKey4) {
                        item.children[item.children.length - 1].children.push({
                            value: qKey,
                            label: cityData.county_list[qKey]
                        })
                    }
                }
                if (item.children[item.children.length - 1].children.length > 0 && allDistrictFlag) {
                    item.children[item.children.length - 1].children.unshift({
                        value: '',
                        label: '全部'
                    });
                }
            }
        }
    }
    return arr;
}

// 跳转路径
Vue.prototype.goPage = function (path, params) {
    if (!path) {
        return
    } else {
        if (path.indexOf('http://') != -1 || path.indexOf('https://') != -1) {
            window.location.href = path
        } else {
            this.$router.push({
                path: path,
                params: params
            });
        }
    }
}

// 时间格式化
global.formatTime = function (date) {
    date = new Date(date);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let min = date.getMinutes();
    min = min < 10 ? ('0' + min) : min;
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s;
    return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;
}

// 四舍五入函数
global.numberRound = function (val) {
    val = Number(val)
    let numFlag = true
    if (val < 0) {
        val = Math.abs(val)
        numFlag = false
    }
    let times = Math.pow(10, 2)
    let res = val * times + 0.5;
    res = parseInt(res, 10) / times;
    if (!numFlag) res = -(res)
    return res
}

// 商品提交订单 生成中间表id
global.c_emitBill = function (orderData) {
    return Order.saveCartTemp(orderData).then((res) => {
        return Order.orderPreferCal({
            ordId: res
        }).then(() => {
            return res;
        });
    })
};

/**
 * 限制原生输入框只能输入正整数
 * @param key data中对应key
 * demo: <input class="el-input__inner"
        maxlength="4"
        @keyup="c_limitInputDigit('form.identifyCode')"
        v-model="form.identifyCode"
        placeholder="请输入图形验证码">
 */
Vue.prototype.c_limitInputDigit = function (key) {
    let keyArr = key.split('.');
    let val = keyArr.reduce((obj, key) => {
        return obj[key];
    }, this._self)

    let filterStr = '';
    let regular = '';
    if (val) {
        // 控制只能输入数字
        regular = val.match(/\d/ig);
        filterStr = regular ? regular.join('') : '';
    }

    keyArr.reduce((obj, key, index) => {
        if (index == keyArr.length - 1) {
            obj[key] = filterStr;
        }
        return obj[key];
    }, this._self)
}

/**
 * 退出统一调用该方法（限制sessionStorage中用户信息作用域）
 * @param
 * @returns
 */
global.c_logOut = function () {
    Storage.set('logOut', true);
    sStorage.remove('USER_INFO');
};

/** 更新已整合用户长度 **/
global.updateRelationAccountLength = function () {
    // 增加缓存变量(会员整合用户长度)
    UserService.getRelationAccountList().then(res => {
        let userInfo = Storage.get("USER_INFO");
        userInfo.relationAccountLength = res.length ? res.length - 1 : 0;
        Storage.set("USER_INFO", userInfo);
    })
}

// 商品是否下架
Vue.prototype.isShelve = function (goodsCode) {
    let params = {
        ownCompanyId: Storage.get("COMPANYID").company_id,
        goodsCode: goodsCode,
        buscontsCode: baseConstant.busContsCode
    }
    return Goods.isShelves(params).then((res) => {
        return res ? true : false;
    })
}

// 商品是否下架
/* Vue.prototype.isShelve = function (goodsCode) {
    let params = {
        ownCompanyId: Storage.get("COMPANYID").company_id,
        goodsCode: goodsCode,
        buscontsCode: baseConstant.busContsCode
    }
    return Goods.isShelves(params).then((res) => {
        return res ? true : false;
    })
} */
