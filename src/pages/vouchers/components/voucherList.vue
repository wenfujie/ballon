<style lang='scss' scoped>
.page-coupon{
  width:100%;
  height: 100%;
  padding: computed(30);
  background: #F5F5F5;
  box-sizing: border-box;
}
</style>
<template>
    <div class="page-coupon">
        <voucher v-for="(card,index) in cardList" :card="card" :key="index "/>
    </div>
</template>
<script>
import voucher from "./voucher"
export default {
    props: {
        cardList: Array,
        cardState: Number
    },
    components: {
        voucher
    },
    data() {
        return {
            list: []
        }
    },
    methods: {
    },
    watch: {
        cardList: function (res) {
            console.log("watchCardList", this.cardList);
        }
    }

}
</script>