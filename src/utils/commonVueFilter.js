

import Vue from 'vue'

//  两位小数过滤器 + 保留小数位
Vue.filter('Fix2',function(val,num){
    val = numberRound(val)
    if(!!num) {
        num = Math.abs(Number(num))
        val = val.toFixed(num)
    }
    return val
});

//  四舍五入
Vue.filter('numberRound',function(val){
    if(!!val) val = numberRound(val)
    return val
});

// 金额分隔 1500 =》 1,500
Vue.filter('$goldDivide',function(value){
    if(value){
        return Number(value).toLocaleString();
    }
    return value;
});

// 手机号掩码
Vue.filter('phoneMask',function(value){
    if(value){
        return value.substring(0, 3) + '****' + value.substring(7, 11);
    }
    return value;
});

// 空值置为0
Vue.filter('nullToZero',function(value){
    if(!value){
        return 0;
    }
    return value;
});

Vue.filter('imageFilter', function(url){
    let reg = /(http|https):\/\/([\w.]+\/?)\S*/;
    // 有http头的不处理
    if (reg.test(url)) {
        return url;
    } else {
        // 无http头的先判断是否为空
        if (!!url) {
            // 图片上传兼容IE
            if (url.substring(0,5) === 'blob:') {
                return url;
            }
        }else {
            return getImg(url);
        }
    }
});

let getFilter = Vue.filter('Fix2');
