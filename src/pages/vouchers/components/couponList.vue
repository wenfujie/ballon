<style lang='scss' scoped>
.page-coupon {
    width: 100%;
    height: 100%;
    padding: computed(30);
    background: #f5f5f5;

    box-sizing: border-box;
}
</style>

<template>
    <div class="page-coupon">
        <coupon
            v-for="(card,index) in coupons"
            :card="card"
            :key="index"
            @reload="refresh"
        />
    </div>
</template>

<script>
import coupon from "./coupon"
export default {
    props: {
        cardList: Array,
        cardState: Number,
        reload: Function

    },
    components: {
        coupon
    },
    data() {
        return {
        }
    },
    methods: {
        /**
         * 充值卡充过，进行删除
         * @param index 索引
         */
        refresh(index) {
            this.reload();
        }
    },
    computed: {
        coupons: function () {
            let coupons = [];
            this.cardList.forEach((item) => {
                item.state = this.cardState
            });
            coupons = this.cardList;
            return coupons;
        }
    }
}
</script>