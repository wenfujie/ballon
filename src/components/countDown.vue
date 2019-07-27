<template>
    <div>
        <p v-if="showCountDown">
            <!-- 小时 -->
            <span>{{hour}}:</span>
            <!-- 分钟 -->
            <span>{{minute}}:</span>
            <!-- 秒 -->
            <span>{{second}}</span>
        </p>
    </div>
</template>
<script>
export default {
    name: "countDown",
    props: {
        startTime: {
            type: String,
            default: ""
        }
    },
    data(){
        return {
            hour: "00",
            minute: "00",
            second: "00",
            showCountDown: true
        }
    },
    methods: {
        countDown(){
            let startTime = new Date(this.startTime)
            console.log(startTime, startTime.getTime())
            let clrInterval = setInterval(()=>{
                let currentTime = new Date();
                let allTime = Math.floor((startTime.getTime() - currentTime.getTime()) / 1000);
                if(allTime <= 0) {
                    clearInterval(clrInterval)
                    this.showCountDown = false
                    return
                }
                let hour = parseInt(Math.floor(allTime/3600))
                let minute = parseInt(Math.floor(Math.floor(allTime%3600)/60))
                let second = parseInt(Math.floor(Math.floor(Math.floor(allTime%3600)%60))%60)
                if (hour < 10) {
                     hour = "0" + hour;
                }
                if (minute < 10) {
                    minute = "0" + minute;
                }
                if (second < 10) {
                    second = "0" + second;
                }
                this.hour = hour
                this.minute = minute
                this.second = second
            })
        }
    },
    created(){
    },
    mounted(){
        this.$nextTick(()=>{
            this.countDown()
        })
    }
}
</script>