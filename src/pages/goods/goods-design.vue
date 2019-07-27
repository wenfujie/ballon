/*
* createTime：2019/1/24
* author：en.chen
* description:
*/
<template>
    <div>
        <div class="wrapper">
            <!--<div v-show="isShelves" class="shelves">该商品已下架~</div>-->
            <iframe :src="url" id="iframePage" class="design-content com-b-shadow"></iframe>
        </div>
        <login-dialog :defaultVisible="true"
                      v-if="loginDialogFlag"
                      @generalLoginSuccess="generalLoginSuccess"
                      @close="closeCallback"></login-dialog>
    </div>
</template>
<script>
import Storage from '../../utils/storage'
import { Goods } from '../../api/service'
import LoginDialog from '@/components/login/LoginDialog.vue';
export default {
    components:{
        LoginDialog
    },
    data() {
        return {
            isShelves: false,
            goodsCode: '',
            url: '',
            loginDialogFlag: false,
            postMessageStatus: null
        }
    },
    methods: {
        // 关闭登录弹窗回调
        closeCallback(){
            this.loginDialogFlag = false;
        },
        // 登录成功后事件
        generalLoginSuccess() {
            this.postMessage(this.postMessageStatus);
            this.loginDialogFlag = false;
        },
        // postMessage实现与父级通信
        postMessage(operate){
            let iframePage = document.getElementById('iframePage');
            iframePage.contentWindow.postMessage({
                operate: operate
            }, this.url);
        },
    },
    created() {
        // 定制设计id（用于还原设计）
        this.rtlDesignHdId = this.$route.query.rtlDesignHdId;
        this.spGoodsDtDesignId = this.$route.query.spGoodsDtDesignId;
        this.$nextTick(() => {
            let companyId = Storage.get('COMPANYID').company_id
            let usrInfo = !!Storage.get('USER_INFO') ? JSON.stringify(Storage.get('USER_INFO')) : Storage.get('USER_INFO')
            if (!window.location.origin) {
                window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
            }
            let iframeUrl = `${window.location.origin}/ballon-custom/#/`
            //    let iframeUrl = "http://localhost:8080/#/";
            let goodsCode = this.$route.query.goodsCode || ''
            let callback = (goodsCode) => {
                // let list = []
                // let map = {}
                // map.goodsCode = this.goodsCode || this.$route.query.goodsCode
                // map.busContsCode = !!baseConstant.busContsCode ? baseConstant.busContsCode : Storage.get('properties').busContsCode
                // map.companyId = Storage.get('COMPANYID').company_id
                // list.push(map)
                // let data = {
                //     spPartGoodsSearchDtoList: list
                // }
                // Goods.getGoodsSellState(data).then((res) => {
                //     if (!res) {
                //         this.isShelves = true   // 提示商品已下架
                //     } else {
                //         //                            let goodsId = res.ptiPartHdId
                //         // 设置标题
                //         if (res[0].goodsName) {
                //             document.title = res[0].goodsName
                //         }
                //         this.url = iframeUrl + 'goods/web-design?&goodsCode=' + goodsCode + '&goodsId=' + this.$route.query.goodsId + '&goodsName=' + encodeURIComponent(res[0].goodsName)
                //         //                            if(!!usrInfo) this.url += ('&userInfo=' + usrInfo)
                //         window.addEventListener('message', (event => {
                //             // 登陆
                //             if (event.data.isLogin) {
                //                 // this.$store.commit('user/setData', { storeKey: 'loginDialogFlag', storeValue: true });//this.$refs.LoginDialog.dialogVisible = true
                //                 this.loginDialogFlag = true;
                //             }
                //             else if (event.data.operate) {
                //                 if (event.data.operate === "addCartSucceed") {    // 加入购物车
                //                     console.log("需要刷新购物车数量")
                //                     this.$store.dispatch('user/updateShoppingCart')
                //                 }
                //             }
                //             this.postMessageStatus = event.data.operate;
                //             console.log("收到" + event.origin + "消息", event.data)
                //         }), false);
                //         if (this.rtlDesignHdId) {
                //             this.url += ('&rtlDesignHdId=' + this.rtlDesignHdId)
                //         }
                //         if (this.spGoodsDtDesignId) {
                //             this.url += ('&spGoodsDtDesignId=' + this.spGoodsDtDesignId)
                //         }
                //     }
                // })

                let params = {
                    ownCompanyId: Storage.get('COMPANYID').company_id,
                    goodsCode: this.goodsCode || this.$route.query.goodsCode,
                    buscontsCode: !!baseConstant.busContsCode ? baseConstant.busContsCode : Storage.get('properties').busContsCode
                };
                Goods.isShelves(params).then((res) => {
                    if (res.sellFlag === 1) {
                        // 设置标题
                        if (res.goodsName) {
                            document.title = res.goodsName
                        }
                        this.url = iframeUrl + 'goods/web-design?&goodsCode=' + goodsCode + '&goodsId=' + this.$route.query.goodsId + '&goodsName=' + encodeURIComponent(res.goodsName)
                        //                            if(!!usrInfo) this.url += ('&userInfo=' + usrInfo)
                        window.addEventListener('message', (event => {
                            // 登陆
                            if (event.data.isLogin) {
                                // this.$store.commit('user/setData', { storeKey: 'loginDialogFlag', storeValue: true });//this.$refs.LoginDialog.dialogVisible = true
                                this.loginDialogFlag = true;
                            }
                            else if (event.data.operate) {
                                if (event.data.operate === "addCartSucceed") {    // 加入购物车
                                    console.log("需要刷新购物车数量")
                                    this.$store.dispatch('user/updateShoppingCart')
                                }
                            }
                            this.postMessageStatus = event.data.operate;
                            console.log("收到" + event.origin + "消息", event.data)
                        }), false);
                        if (this.rtlDesignHdId) {
                            this.url += ('&rtlDesignHdId=' + this.rtlDesignHdId)
                        }
                        if (this.spGoodsDtDesignId) {
                            this.url += ('&spGoodsDtDesignId=' + this.spGoodsDtDesignId)
                        }
                    } else {
                        // 导入微信平台且下架
                        if (res.buscontsId && res.sellFlag === 0) {
                            // 设置标题
                            if (res.goodsName) {
                                document.title = res.goodsName
                            }
                            this.url = iframeUrl + 'goods/web-design?&goodsCode=' + goodsCode + '&goodsId=' + this.$route.query.goodsId + '&goodsName=' + encodeURIComponent(res.goodsName)
                            //                            if(!!usrInfo) this.url += ('&userInfo=' + usrInfo)
                            window.addEventListener('message', (event => {
                                // 登陆
                                if (event.data.isLogin) {
                                    // this.$store.commit('user/setData', { storeKey: 'loginDialogFlag', storeValue: true });//this.$refs.LoginDialog.dialogVisible = true
                                    this.loginDialogFlag = true;
                                }
                                else if (event.data.operate) {
                                    if (event.data.operate === "addCartSucceed") {    // 加入购物车
                                        console.log("需要刷新购物车数量")
                                        this.$store.dispatch('user/updateShoppingCart')
                                    }
                                }
                                this.postMessageStatus = event.data.operate;
                                console.log("收到" + event.origin + "消息", event.data)
                            }), false);
                            if (this.rtlDesignHdId) {
                                this.url += ('&rtlDesignHdId=' + this.rtlDesignHdId)
                            }
                            if (this.spGoodsDtDesignId) {
                                this.url += ('&spGoodsDtDesignId=' + this.spGoodsDtDesignId)
                            }
                        }
                        // 导入全平台未导入微信平台且下架
                        if (!res.buscontsId && res.sellFlag === 0) {
                            // 设置标题
                            if (res.goodsName) {
                                document.title = res.goodsName
                            }
                            this.url = iframeUrl + 'goods/web-design?&goodsCode=' + goodsCode + '&goodsId=' + this.$route.query.goodsId + '&goodsName=' + encodeURIComponent(res.goodsName)
                            //                            if(!!usrInfo) this.url += ('&userInfo=' + usrInfo)
                            window.addEventListener('message', (event => {
                                // 登陆
                                if (event.data.isLogin) {
                                    // this.$store.commit('user/setData', { storeKey: 'loginDialogFlag', storeValue: true });//this.$refs.LoginDialog.dialogVisible = true
                                    this.loginDialogFlag = true;
                                }
                                else if (event.data.operate) {
                                    if (event.data.operate === "addCartSucceed") {    // 加入购物车
                                        console.log("需要刷新购物车数量")
                                        this.$store.dispatch('user/updateShoppingCart')
                                    }
                                }
                                this.postMessageStatus = event.data.operate;
                                console.log("收到" + event.origin + "消息", event.data)
                            }), false);
                            if (this.rtlDesignHdId) {
                                this.url += ('&rtlDesignHdId=' + this.rtlDesignHdId)
                            }
                            if (this.spGoodsDtDesignId) {
                                this.url += ('&spGoodsDtDesignId=' + this.spGoodsDtDesignId)
                            }
                        }
                        // 未导入微信平台和全平台跳转至商品未上架页面
                        if (!res || !res.buscontsId && res.sellFlag !== 0) {
                            // 跳转至商品未上架页面
                            this.$router.push({
                                path: "/off-shelves",
                                query: {
                                    page: 'goods-design',
                                }
                            });

                        }
                    }
                })
            }
            callback(goodsCode);

            // 解决火狐返回上一页空白问题
            document.getElementById('iframePage').contentWindow.location.replace('');
        })
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
.wrapper {
}
.design-content {
    width: 100%;
    max-width: 1200px;
    min-width: 990px;
    margin: 20px auto;
    border: none;
    height: 800px;
}
</style>
