<!--
import func from './vue-temp/vue-editor-bridge';
import { clearInterval } from 'timers';
import { setInterval } from 'timers';
import { setTimeout } from 'timers';
import { setInterval } from 'timers';
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description: 倒计时组件
 * @Date: 2019-03-22 10:23:46
 * @LastEditTime: 2019-07-15 20:09:58
 -->
<style lang='scss' scoped>
.count-wrap {
    i {
        margin-right: 10px;
    }
    font-size: 14px;
    text-align: right;
    color: $text-warn;
}
</style>

<template>
    <div class="count-wrap" v-if="isRender">
        <i class="iconfont icon-daojishi"></i>剩余时间：
        <span v-if="hours > 0">{{hours | timeFormatter}}时</span>
        <span>{{minutes | timeFormatter}}分</span>
        <span>{{seconds | timeFormatter}}秒</span>
        <!--<span>&nbsp;后自动取消订单</span>-->
    </div>
</template>

<script>
export default {
    props: {
        order: Object
    },
    data() {
        return {
            time: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            maxtime: 0,
            timer: null
        };
    },
    methods: {
        // 获取结束时间与当前时间差值的毫秒值
        getEndTimeMill() {
            return Math.floor(this.time / 1000);
        },
        // 初始化
        init_Time() {
            this.seconds = 0;
            this.minutes = 0;
            this.hours = 0;
            this.time = this.order.closeDate - this.order.nowDate;
            if (this.timer) clearInterval(this.timer);
        },
        //时间设置
        set_Time(maxtime) {
            this.seconds = Math.floor(maxtime % 60);
            this.minutes = Math.floor(maxtime / 60) % 60;
            this.hours = Math.floor(maxtime / 3600);
        },
        // 判断订单是否待支付状态
        isPayed() {
            const isPayed =
                this.order.ordStatusCodes === "D_ORDSPAYING" ? true : false;
            const isPayedPart =
                this.order.payStatusCode == "D_PAIDPART" ? false : true;
            return isPayed && isPayedPart ? true : false;
        },
        // 倒计时
        countDown(maxtime) {
            this.maxtime = maxtime;
            this.timer = setInterval(() => {
                if (this.maxtime > 0) {
                    this.maxtime -= 1;
                    this.set_Time(this.maxtime);
                    // console.log('downtime', this.maxtime)
                } else {
                    this.$emit("refresh");
                    clearInterval(this.timer);
                }
            }, 1000);
        },
        // 开始
        start() {
            if (!this.isPayed()) return;
            this.init_Time();
            const maxtime = this.getEndTimeMill();
            if (maxtime <= 0) return;
            this.set_Time(maxtime);
            this.countDown(maxtime);
        }
    },

    computed: {
        isRender: function() {
            if (!this.isPayed()) return false;
            if (this.maxtime === 0) return false;
            return true;
        }
    },
    watch: {
        order: function() {
            this.start();
        }
    },
    filters: {
        timeFormatter: function(value) {
            if (value < 10) {
                return "0" + Number(value).toFixed(0);
            } else {
                return Number(value).toFixed(0);
            }
        }
    }
    // beforeDestroy() {
    //     // 路由离开时清空定时器
    //     clearInterval(this.timer);
    // }
};
</script>
