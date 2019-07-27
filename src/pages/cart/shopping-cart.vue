/*
* createTime：2019/1/16
* author：en.chen
* description:  购物车模块
*/
<template>
    <div class="wrapper">
        <table class="com-table">
            <thead class="com-thead">
                <th><el-checkbox v-model="selectedAll" @change="selectAllEvent">{{$t('common.checkAll')}}</el-checkbox></th>
                <th>{{$t('cart.goodInfo')}}</th>
                <th>{{$t('common.unitPrice')}}</th>
                <th>{{$t('common.quantity')}}</th>
                <th>{{$t('cart.subtotal')}}</th>
                <th>{{$t('common.operator')}}</th>
            </thead>
            <tbody>
            <tr :class="['tr',{'tr-disabled': child.disabled}]" v-for="(child,cindex) in shopCartList">
                <td><el-checkbox v-model="child.selected" @change="selectTrEvent" :disabled="child.disabled?true:false"></el-checkbox></td>
                <td class="clearfix">
                    <img class="good-pic fl" v-lazy="getImg(child.url)" :key="child.url" @click="toGoodDetail(child)">
                    <div :class="['fl', 'good-info', 'clearfix',{'good-info-cust':child.orderFlag == 1}]">
                        <div class="good-info-describe" @click="toGoodDetail(child)">{{child.goodsName}}</div>
                        <!--大货商品 sku选择弹窗-->
                        <div class="good-info-sku"
                              v-if="child.orderFlag == 0"
                              @click="showSkuDialog(child,cindex)">{{child.colorName}} {{child.sizeName}}
                            <i class="iconfont icon-xiangxiajiantou"></i>
                            <div class="com-b-shadow sku-form"
                                 v-clickoutside="handleSkuDialog"
                                 @click.stop=""
                                 v-show="skuIndex == cindex">
                                <div class="triangle-up"></div>
                                <div class="sku-form-item flex-box">
                                    <div  class="item-label">{{$t('cart.color')}}：</div>
                                    <ul class="flex-box ul-list flex-auto">
                                        <!--true 表示未经库存校验 默认都可选-->
                                        <li :class="['li-item', {'selected':item.selected},{'no-stock':item.skuQty!==true && item.skuQty<child.amount}]"
                                            :key="index"
                                            @click="clickSkuItem(item,index,child.colorArr,child)"
                                            v-for="(item,index) in child.colorArr">
                                            {{item.colorName}}
                                            <img class="selected-logo" src="@/assets/images/shoppingCart/selected.png" alt="">
                                        </li>
                                    </ul>
                                </div>
                                <div class="sku-form-item flex-box">
                                    <div  class="item-label size-label">{{$t('cart.size')}}：</div>
                                    <ul class="flex-box ul-list flex-auto">
                                        <li :class="['li-item-size', {'selected':item.selected},{'no-stock':item.skuQty!==true && item.skuQty<child.amount}]"
                                            :key="index"
                                            @click="clickSkuItem(item,index,child.sizeArr,child)"
                                            v-for="(item,index) in child.sizeArr">
                                            {{item.sizeName}}
                                            <img class="selected-logo" src="@/assets/images/shoppingCart/selected.png" alt="">
                                        </li>
                                    </ul>
                                </div>
                                <!--确定-->
                                <div class="sure-btn" @click="handleChoseSku(child)">{{$t('common.sure')}}</div>
                            </div>
                        </div>

                        <!--定制商品 查看订制信息-->
                        <div class="custom-btn" @click.stop="showCustomDialog(child,cindex)" v-else>
                            {{$t('cart.viewCustInfo')}}
                            <i class="iconfont icon-xiangxiajiantou icon-down-color"></i>
                            <!--定制信息弹窗-->
                            <custom-dialog :key="'custom'+customIndex"
                                           fromPage="shoppingCart"
                                           :mainFabricName="child.mainFabricName"
                                           :partList="child.gsctPartDttAssfabricVos"
                                           v-clickoutside="handleCustomDiaState"
                                           v-show="customIndex == cindex"></custom-dialog>
                        </div>

                        <div class="good-info-state" v-show="child.disabled">
                            <!--已下架 库存不足-->
                            （{{child.disabled==='unSell'?$t('cart.soldOut'):$t('cart.unStock')}}）
                        </div>
                    </div>
                </td>
                <td>
                    ￥{{child.dealPrice}}
                    <div class="add-price-than"
                         v-if="child.oldPrice&&(child.dealPrice || child.dealPrice===0)&&(child.oldPrice-child.dealPrice>0)">
                        <!--比加入购物车时降价 元-->
                        {{$t('cart.depreciateThenAdd')}}{{child.oldPrice-child.dealPrice | $goldDivide}}{{$t('unit.priceUnit')}}
                    </div>
                </td>
                <td>
                    <el-input-number size="small"
                                     :min="1"
                                     :max="child.disabled === 'unStock'?child.amount:100000"
                                     :disabled="child.disabled === 'unSell'"
                                     @change="changeInputNum(arguments,child)"
                                     v-model="child.amount"></el-input-number>
                </td>
                <td>
                    <div>¥{{(child.amount?child.amount*child.dealPrice:child.dealPrice) | $goldDivide}}</div>
                </td>
                <td class="td-operator">
                    <!--todo 移入收藏夹 这期不做 暂时注释-->
                    <!--<div class="td-operator-collect" @click="addCollect(child)">{{$t('cart.addCollect')}}</div>-->
                    <!--删除-->
                    <div class="td-operator-remove" @click="removeShopCart(child)">{{$t('common.delete')}}</div>
                </td>
            </tr>
            </tbody>
        </table>

        <!--购物车为空-->
        <div v-if="!shopCartList || !shopCartList.length" class="empty-cart">{{$t('cart.emptyCart')}}</div>

        <!--结算信息条-->
        <div class="settle-strip flex-between" v-if="shopCartList.length">
            <div class="settle-strip-info flex-auto flex-between">
                <!--已选（{{selectedShopCartList.length}}件）-->
                <!--<div class="">已选（{{selectedShopCartList.length}}件）</div>-->
                <div class="">
                    <span><el-checkbox v-model="selectedAll" @change="selectAllEvent">{{$t('common.checkAll')}}</el-checkbox></span>
                    <!--批量删除-->
                    <span @click="batchDelete(selectedShopCartList)"
                          :class="['operator-btn',{'disabled': !selectedShopCartList.length}]">
                        {{$t('cart.deleteInBatches')}}
                    </span>
                    <!--todo  这期不要 暂时注释-->
                    <!--<span @click="batchCollect(selectedShopCartList)"-->
                          <!--:class="['operator-btn',{'disabled': !selectedShopCartList.length}]">批量移入收藏夹</span>-->
                </div>
                <div class="flex-box">
                    <div class="settle-price" @click.stop="handleSelectedDialog(!showSelectedDialog)">
                        <!--<span class="span-block">-->
                            <!--<span class="settle-price-label">商品合计：</span>-->
                            <!--<span>¥{{allPrice | $goldDivide}}</span>-->
                        <!--</span>-->
                        <!--<span class="span-block">-->
                            <!--<span class="settle-price-label">活动优惠：</span>-->
                            <!--<span>¥0.00</span>-->
                        <!--</span>-->
                        <span class="selected-text">
                            {{$t('cart.selectedPiece')}}
                            <span class="selected-text-num">{{selectedShopCartList.length}}</span>
                            {{$t('cart.piece')}}
                        </span>
                        <i class="iconfont icon-xiangxiajiantou"></i>
                    </div>
                    <div class="cut-interval"></div>
                    <div class="">
                        <!--实付-->
                        <span>{{$t('cart.realPrice')}}：</span>
                        <span class="real-pay">¥{{allPrice | $goldDivide}}</span>
                    </div>
                </div>
            </div>
            <!--去结算-->
            <div :class="['settle-strip-btn',{'disabled':!selectedShopCartList.length}]"
                 @click="checkoutCanPay">{{$t('cart.toPay')}}</div>
            <!--已选商品弹窗-->
            <div class="selected-dialog"
                 v-show="showSelectedDialog"
                 v-clickoutside="handleSelectedDialog">
                <selected-dialog :selectedShopCartList="selectedShopCartList"></selected-dialog>
            </div>
        </div>

        <!--<div class="shop-recommend">-->
            <!--<recommend-list></recommend-list>-->
        <!--</div>-->
    </div>
</template>
<script>
    // import RecommendList from '../../components/RecommendList.vue'
    import CustomDialog from './components/CustomDialog.vue'
    import { ShoppingCart,Goods,Collection,Order,UserService } from '../../api/service'
    import clickoutside from '@/components/clickoutside';
    import SelectedDialog from './components/SelectedDialog.vue'
    import fastJson from '../../utils/fastJsonRf'

    export default {
        components:{CustomDialog,SelectedDialog},
        directives: {
            clickoutside
        },
        data() {
            return {
                shopCartList:[],// 购物车列表
                skuIndex: -1,// 所显示sku弹窗index
                customIndex: -1,// 所显示定制弹窗index
                selectedAll: false,// 控制全选
                showSelectedDialog: true,// 控制已选商品弹窗显示
            }
        },
        computed:{
            // 当前商品sku 颜色数据
            skuColorList(){
                if(this.skuIndex >= 0) {
                    return this.shopCartList[this.skuIndex].colorArr;
                }else{
                    return [];
                }
            },
            // 当前商品sku 尺码数据
            skuSizeList(){
                if(this.skuIndex >= 0) {
                    return this.shopCartList[this.skuIndex].sizeArr;
                }else{
                    return [];
                }
            },
            // sku弹窗当前选中颜色
            skuColorSelected(){
                if(this.skuIndex >= 0){
                    let colorArr = this.shopCartList[this.skuIndex].colorArr;
                    for(let i=0;i<colorArr.length;i++){
                        if(colorArr[i].selected){
                            return colorArr[i];
                        }
                    }
                }
                return null;
            },
            // sku弹窗当前选中尺码
            skuSizeSelected(){
                if(this.skuIndex >= 0){
                    let sizeArr = this.shopCartList[this.skuIndex].sizeArr;
                    for(let i=0;i<sizeArr.length;i++){
                        if(sizeArr[i].selected){
                            return sizeArr[i];
                        }
                    }
                }
                return null;
            },
            // 总价
            allPrice(){
                let price = 0;
                this.selectedShopCartList.forEach(item=>{
                    price += item.dealPrice * item.amount
                })
                return price.toFixed(2);
            },
            // 已勾选商品
            selectedShopCartList(){
                return this.shopCartList.filter(item=>{
                    if(item.selected){
                        return true;
                    }
                })
            },
            // 所有定制商品
            orderFlagGood(){
                return this.shopCartList.filter(item => item.orderFlag == 1)
            },
        },
        methods: {
            // 前往商品详情页
            toGoodDetail(item){
                if (item.orderFlag === 1) {
                    this.$router.push("/goods-design?goodsCode=" + item.goodsCode +
                        '&goodsId=' + item.ptiPartHdId +
                        (item.rtlDesignHdId?'&rtlDesignHdId=' + item.rtlDesignHdId:'') +
                        (item.spGoodsDtDesignId?'&spGoodsDtDesignId=' + item.spGoodsDtDesignId:'')
                    );
                } else{
                    this.isShelve(item.goodsCode).then(res => {
                        if (res) {
                            this.$router.push("/goods-detail?goodsCode=" + item.goodsCode + '&goodsId=' + item.ptiPartHdId);
                        } else {
                            this.$router.push("/off-shelves");
                        }
                    });
                }
            },
            // 控制定制弹窗状态 -1时关闭
            handleCustomDiaState(index=-1){
                this.customIndex = index;
            },
            // 点击 已选件数 显示已选弹窗
            handleSelectedDialog(boolean=false){
                this.showSelectedDialog = typeof boolean === 'boolean'? boolean : false;
            },
            // 点击非sku弹窗位置关闭弹窗
            handleSkuDialog(e){
                this.skuIndex = -1;
            },
            // 点击批量删除
            batchDelete(arr){
                if(arr.length){
                    this.removeShopCart(arr);
                }
            },
            // 点击批量加入收藏夹
            batchCollect(arr){
                if(arr.length){
                    this.addCollect(arr);
                }
            },
            // 初始化商品时判断是否可购买
            async createCheckoutCanPay(){
                if(!this.shopCartList.length)return
                // 判断商品是否上架
                await this.checkoutSellState(this.shopCartList).then(res=>{
                    res.forEach((item,index)=>{
                        if(item.sellFlag != 1 || item.skuSellFlag != 1){
                            for (let i=0;i<this.shopCartList.length;i++){
                                if(this.shopCartList[i].ptiPartDtSkuId == item.ptiPartDtSkuId){
//                                    this.shopCartList[i].disabled = true;
                                    // 商品未上架
                                    this.shopCartList[i].disabled = 'unSell';
                                    break;
                                }
                            }
                        }
                    })
                })
                await this.checkoutStockPromise(this.shopCartList).then(res=>{
                    if(res.enoughAll == 1)return;
                    let enoughInfoDtos = res.partEnoughInfoDtos;
                    let enoughSkuInfoDtos = res.partEnoughSkuInfoDtos;
                    this.shopCartList.forEach((item,index)=>{
                        // 商品已上架
                        if(!item.disabled){
                            // 判断大货商品具体sku是否库存不足
                            for(let i=0;i<enoughInfoDtos.length;i++){
                                if(enoughInfoDtos[i].enough != 1){
                                    if(enoughInfoDtos[i].cartId == item.id){
                                        item.disabled = 'unStock';
                                    }
                                }
                            }
                        }
                    })
                })
            },
            // 校验是否可结算
            async checkoutCanPay(){
                if(!this.selectedShopCartList.length)return;
                let busContsCode = Storage.get('properties').busContsCode;
                let goodList = this.selectedShopCartList.map(item=>{
                    return {
                        "busContsCode":busContsCode,
                        "goodsCode":item.goodsCode,
                        "ptiPartDtSkuId":item.ptiPartDtSkuId,
                        "amount":item.amount,
                        "orderFlag":item.orderFlag,
                        "ptiPartHdId":item.ptiPartHdId,
                        "cartId": item.id
                    }
                })
                let data = {
                    shopId: Storage.get("USER_INFO").shopId,
                    goodList: goodList
                }
                let res = await Goods.getUseableGood(data);
                if(res.sellAll === 1 && res.stockAll === 1){
                    this.toPay(this.selectedShopCartList);
                }else{
                    let disabledBuyBtn = !res.stockList || res.stockList.length <= 0,// 禁用按钮'继续购买'
                        msg = '',// 最终提示语
                        unSellGoodName = '',//未上架商品名称
                        unStockGoodName = '';// 已上架但库存不足商品名称
                    if(res.sellAll !== 1){
                        res.unSellList.forEach(item=>{
                            unSellGoodName += `【${item.goodsName}】<br/>`;
                        })
                        if(unSellGoodName){
                            msg = `${this.$t('cart.goodUnsell')}<br/>${unSellGoodName}`;
                        }
                    }
                    if(res.stockAll !== 1){
                        res.unStockList.forEach(item=>{
//                            颜色 尺码
                            unStockGoodName += `【${item.ptiPartHdName}】${item.ptiPartSkuId ?
                                this.$t('cart.color')+'：'+item.colorName+'，'+ this.$t('cart.size') +'：'+item.sizeName : ''}<br/>`;
                        })
                        if(unStockGoodName){
                            msg += (msg?'<br/>':'') + `${this.$t('cart.theUnderstock')}<br/>${unStockGoodName}`;
                        }
                    }


                    this.$alert(msg, this.$t('common.hint'), {
                        confirmButtonText: this.$t('cart.buyGoOn'),// 继续购买
                        cancelButtonText: this.$t('cart.noBuy'),// 先不购买
                        showCancelButton: true,
                        dangerouslyUseHTMLString:true,
                        confirmButtonClass:disabledBuyBtn?'button--disabled':'',//确认按钮自定义类名
                        beforeClose: (action, instance, done)=>{
                            // 禁用继续购买按钮时，不关闭弹窗
                            if(action === 'confirm' && disabledBuyBtn){

                            }else{
                                done();
                            }
                        },
                        callback: action => {
                            if(action == 'confirm'){
                                if(disabledBuyBtn)return;
                                let buyList = this.selectedShopCartList.filter(item=>{
                                    for(let i=0;i<res.stockList.length;i++){
                                        if(item.ptiPartHdId == res.stockList[i].ptiPartHdId){
                                            // 大货
                                            if(res.stockList[i].ptiPartSkuId){
                                                if(res.stockList[i].ptiPartSkuId == item.ptiPartDtSkuId){
                                                    return true;
                                                }
                                            }else{// 定制
                                                if(res.stockList[i].cartId == item.id){
                                                    return true;
                                                }
                                            }
                                        }
                                    }
                                })
                                this.toPay(buyList);
                            }else if(action == 'cancel'){
                                this.getCartInfo();
                            }
                        }
                    });
                }
            },
            // 结算
            toPay(buyList){
                let orderData = {
                    companyId: Storage.get("COMPANYID").company_id,
                    usrId: Storage.get("USER_INFO").usrId,
                    ctmUsrId: Storage.get("USER_INFO").usrId,
//                    cookieId: Storage.get("USER_INFO").cookieId,
                    shopCode: Storage.get("USER_INFO").shopCode,
                    usrKey: Storage.get("USER_INFO").usrId,
                    sourceCode: "D_ORDSHOP",
                    amountOrd: this.allPrice
                };
                let skuList = []
                buyList.forEach((item) => {
                    item.cartId = item.id
                    item.pictFileId = item.fileHdId
                    item.mainFabricId = item.fabricId
                    if(item.orderFlag == 1){// 定制
                        item.partList = this.getPartListParams(item.gsctPartDttAssfabricVos);
                        // 删除多余数据
                        delete item.colorArr;
                        delete item.gsctPartDttAssfabricVos;
                        delete item.simpleSkuInfoList;
                        delete item.sizeArr;
                    }
                    skuList.push(item)
                })
                orderData.skuList = skuList;
                c_showLoading();
                c_emitBill(orderData).then(res=>{
                    this.$router.push('/order-settle?orderHdId=' + res)
                    c_showLoading(false);
                })
            },
            // 获取部件参数（用于保存）
            getPartListParams(partList) {
                return partList.map((item,index) => {
                    let emb = [],
                            embCont = {},
                            ept = [],
                            eptObj = {},
                            prt = [],
                            prtObj = {};
                    // 绣字
                    if(item.rtlCartDttEmbDto){
                        // 绣字内容
                        embCont.content = item.rtlCartDttEmbDto.embValue
//                        // 颜色
                        embCont.colorId = item.rtlCartDttEmbDto.colorId
                        // 字体
                        embCont.fontsId = item.rtlCartDttEmbDto.fontsId
                        // 旋转 60/180*3.14 = 1.1
                        embCont.rotate = item.rtlCartDttEmbDto.rotationX
                        // 缩放
                        embCont.scale = item.rtlCartDttEmbDto.scaleX
                        // x轴坐标
                        embCont.xcoordinate = item.rtlCartDttEmbDto.positionX
                        // y轴坐标
                        embCont.ycoordinate = item.rtlCartDttEmbDto.positionY
                        // 绣字UV图
                        // todo 暂时写死测试
                        embCont.embPictId = item.rtlCartDttEmbDto.fileHdId
                        emb.push(embCont);
                    }
                    // 绣花
                    if(item.rtlCartDttEmbptDto){
                        // 绣花档案id  传的是id而不是imageId(确认过)
                        eptObj.embId = item.rtlCartDttEmbptDto.embHdId
                        // 旋转
                        eptObj.rotate = item.rtlCartDttEmbptDto.rotationX
                        // 缩放
                        eptObj.scale = item.rtlCartDttEmbptDto.scale
                        // x轴坐标
                        eptObj.xcoordinate = item.rtlCartDttEmbptDto.positionX
                        // y轴坐标
                        eptObj.ycoordinate = item.rtlCartDttEmbptDto.positionY
                        // 绣花UV图
                        // todo 暂时写死测试
                        eptObj.embPrintPictId = item.rtlCartDttEmbptDto.fileHdId
                        ept.push(eptObj)
                    }
                    // 印花
                    if(item.rtlCartDttPrintDto){
                        prtObj.prtId = item.rtlCartDttPrintDto.printHdId
//                        prtObj.prtcode = item.rtlCartDttPrintDto.printCode
                        // 印花UV图
                        // todo 暂时写死测试
                        prtObj.embPrintPictId = item.rtlCartDttPrintDto.fileHdId
                        // 旋转
                        prtObj.rotate = item.rtlCartDttPrintDto.rotationX || 0
                        // 缩放
                        prtObj.scale = item.rtlCartDttPrintDto.scale
                        // x轴坐标
                        prtObj.xcoordinate = item.rtlCartDttPrintDto.positionX
                        // y轴坐标
                        prtObj.ycoordinate = item.rtlCartDttPrintDto.positionY

                        prt.push(prtObj)
                    }
                    return {
                        "regionCode": item.regionCode,
                        "partCode": item.partCode,
                        "fabricCode": item.fabricCode,
                        "partId": item.assemplyId,//部件
                        "fabricId": item.ptiPartHdId,//面料
                        "regionId": item.gctRegionHdId,//部位
                        "memo": "",
                        "emb": emb,
                        "ept": ept,
                        "prt": prt,
                        "salePrice": "",
                        "tagPrice": ""
                    }
                })
            },
            /**
             * 删除购物车
             * @arrOrObject 购物车列表 或单个对象
             */
            removeShopCart(arrOrObject){
                //是否确认从购物车移除商品
                this.$alert(this.$t('cart.sureRemoveFromCart'), this.$t('common.hint'), {
                    confirmButtonText: this.$t('common.sure'),
                    showCancelButton: true,
                    callback: action => {
                        if(action == 'confirm'){
                            let ids = [];
                            if(arrOrObject instanceof Array){
                                arrOrObject.forEach(item=>{
                                    ids.push(item.id);
                                })
                            }else{// 数组
                                ids.push(arrOrObject.id);
                            }
                            let data = {
                                cartIds: ids.join(',')
                            }
                            c_showLoading();
                            ShoppingCart.deleteCart(data).then(() => {
                                this.$store.dispatch('user/updateShoppingCart')
                                this.getCartInfo();
                                this.msgTip(this.$t('cart.deleteSuccess'),'success');// 删除成功
                            })
                        }
                    }
                });
            },
            /**
             * 加入收藏
             * @arrOrObject 单个对象
             */
            addCollect(arrOrObject){
                let arr = [];
                if(arrOrObject instanceof Array){
                    arrOrObject.forEach(item=>{
                        arr.push({
                            busContsCode: Storage.get('properties').busContsCode,
                            goodsCode: item.goodsCode,
                            shopId: Storage.get("USER_INFO").shopId
                        })
                    })
                }else{
                    arr.push({
                        busContsCode: Storage.get('properties').busContsCode,
                        goodsCode: arrOrObject.goodsCode,
                        shopId: Storage.get("USER_INFO").shopId
                    })
                }
                let data = {
                    spFavoriteDtoList: arr
                };
                c_showLoading();
                Collection.batchAddCollection(data).then((res) => {
                    this.msgDialog(this.$t('cart.collectSuccess'));//收藏成功
                    c_showLoading(false);
                })
            },
            //全选复选框的inputnative事件
            selectAllEvent(val){
                this.shopCartList.forEach(item=>{
                    // 针对未禁用复选框操作
                    if(!item.disabled){
                        item.selected = val;
                    }
                })
                // 备份已选购物车id
                this.backupsSelectedId();
            },
            //勾选表格复选框
            selectTrEvent(val){
                if(val){
                    let isLastOne = false;
                    let arrs = this.shopCartList;
                    for(let i=0;i<arrs.length;i++){
                        if(arrs[i].selected || arrs[i].disabled){
                            if(i==arrs.length-1){
                                isLastOne = true;
                            }
                        }else{
                            break
                        }
                    }
                    if(isLastOne){
                        this.selectedAll = val;
                    }
                }else{
                    this.selectedAll = val;
                }
                // 备份已选购物车id
                this.backupsSelectedId();
            },
            // 备份已选购物车id
            backupsSelectedId(){
                this.backupsSelectedCartId = [];
                this.backupsSelectedCartId = this.selectedShopCartList.map(item=>{
                    if(item.selected){
                        return item.id;
                    }
                })
            },
            // 加载购物车 判断商品勾选
            createCheckoutSelected(){
                if(!this.backupsSelectedCartId.length)return;
                // 勾中全选
                if(this.backupsSelectedCartId.length === this.shopCartList.length){
                    this.selectedAll = true;
                }
                this.shopCartList.forEach(item=>{
                    if(item.disabled){
                        item.selected = false;
                        return;
                    }
                    if(this.backupsSelectedCartId.indexOf(item.id) !== -1){
                        item.selected = true;
                    }else{
                        item.selected = false;
                    }
                })
            },
            // 计算器值改变事件
            changeInputNum(param,item){
                if(!item.amount){
                    this.getCartInfo();
                    return;
                }
                // 定制商品校验库存
                let arr = [];
                c_showLoading();
                this.skuIndex = -1;
                let data = {
                    cartId: item.id
                }
                if(item.orderFlag == 0){// 大货
                    arr.push(item);
                    this.checkoutStockPromise(arr).then(res=>{

                        if(res.enoughAll == 1){// 有库存
                            data.count = item.amount;
                            this.saveCartNumber(data,item,param);
                        }else{
                            this.getGoodsStucks(item.goodsCode).then(_res=>{
                                let dialogSkuList = this.dialogSkuList;
                                for(let i=0;i<dialogSkuList.length;i++){
                                    if(item.ptiPartDtSkuId == dialogSkuList[i].skuId){
                                        item.amount = dialogSkuList[i].skuQty;
                                        break;
                                    }
                                }
                                data.count = item.amount;
                                this.saveCartNumber(data,item,param);
                            })
                            c_showLoading(false);
                            this.msgDialog(this.$t('cart.understock'));// 商品库存不足
                        }
                    })
                }else{

                    this.checkoutStockPromise(this.orderFlagGood).then(res=>{
                        res.partEnoughInfoDtos.some(_item=>{
                            if(_item.cartId == item.id){
                                if(_item.enough == 1){
                                    data.count = item.amount;
                                    this.saveCartNumber(data,item,param);
                                }else{
                                    this.msgDialog(this.$t('cart.understock'));// 商品库存不足
                                    if(item.amount > param[1]){
                                        item.amount = param[1];
                                    }else{
                                        data.count = item.amount;
                                        this.saveCartNumber(data,item,param);
                                    }
                                }
                                return true;
                            }
                        })
                        c_showLoading(false);

                    })
                }
            },
            // 保存购物车数量
            saveCartNumber(data,item,param){
                ShoppingCart.saveCartNum(data).then((res)=>{
                    if(res == 1){// 成功
                        this.getCartInfo();
                    }else{
                        c_showLoading(false);
                        this.$toast('修改失败~');
                        item.amount = param[1];
                    }
                }, (error) => {
                    c_showLoading(false);
                    this.$toast('修改失败，' + error);
                })
            },
            // 点击尺码sku获取修改数量
            clickSkuItem(item,index,arr,child){
                if(item.skuQty !== true && item.skuQty<child.amount)return;
                if(item.selected){
                    item.selected = false;
                }else{
                    arr.forEach(child=>{
                        child.selected = false;
                    })
                    item.selected = true;
                }
                this.checkoutSkuOption(child);
                // 校验所有颜色或尺码与其对应项组成sku是否都库存不足 是则禁用
                this.checkoutAllSkuStock(child);
            },
            //  sku修改
            handleChoseSku(item) {
                let skuItem = this.getColorOrSizeItem(item),
                        colorItem = skuItem.colorItem,
                        sizeItem = skuItem.sizeItem;
                if(!colorItem){
                    this.$toast(this.$t('cart.chooesColor'))
                    // this.msgTip(this.$t('cart.chooesColor'));// 请选择颜色
                    return;
                }
                if(!sizeItem){
                    this.$toast(this.$t('cart.chooesSize'))
                    // this.msgTip(this.$t('cart.chooesSize'));// 请选择尺码
                    return;
                }
                let data = {
                    "count": item.amount,
                    "orderFlag": item.orderFlag,
                    "ptiPartHdCode": item.goodsCode
                }
                let skuInfo = {
                    ptiPartDtSkuId: '',
                    ptiPartHdId: ''
                }
                item.simpleSkuInfoList.forEach((skuItem) => {
                    if((skuItem.colorCode === colorItem.colorCode) && (skuItem.sizeCode === sizeItem.sizeCode)) {
//                        data.colorCode = colorItem.colorCode
//                        data.sizeCode = sizeItem.sizeCode
                        data.ptiPartDtSkuId = skuItem.id
                        data.ptiPartHdId = skuItem.ptiPartHdId

                        skuInfo.ptiPartDtSkuId = skuItem.id
                        skuInfo.ptiPartHdId = skuItem.ptiPartHdId
                    }
                })
                console.log(data,"===")

                //  校验库存
                return this.checkoutStockPromise(null,data).then((res) => {
                    if(res.enoughAll == 1) {
                        item.colorCode = colorItem.colorCode
                        item.colorId = colorItem.colorId
                        item.colorName = colorItem.colorName

                        item.sizeCode = sizeItem.sizeCode
                        item.sizeId = sizeItem.sizeId
                        item.sizeName = sizeItem.sizeName
                        item.newPtiPartDtSkuId = skuInfo.ptiPartDtSkuId
                        this.skuIndex = -1;
                        this.cartSave(item,skuInfo.ptiPartDtSkuId)
                    }else{
                        this.msgDialog(this.$t('cart.understock'))
                        c_showLoading(false);
                        return false;// 表示库存不足
                    }
                })
            },
            /**
             * 校验商品是否上架
             * @returns {*} true:上架 false:下架
             */
            async checkoutSellState(arr){
                let goodsCodeList = arr.map(item=>{
                    return {
                        busContsCode: Storage.get('properties').busContsCode,
                        goodsCode: item.goodsCode,
                        ptiPartDtskuId: item.ptiPartDtSkuId
                    };
                })
                let data = {
                    spPartGoodsSearchDtoList : goodsCodeList
                }
                return await Goods.getGoodsSellState(data);
            },

            /**
             * 校验库存promise arr custParams 只需传一个
             * @param arr 传入购物车列表数据（自动处理成参数）
             * @param custParams 传入自定义参数（只取该参数）
             * @returns {*}
             */
            checkoutStockPromise(arr,custParams) {
                let inventoryJudgeDtos = [];
                if(arr){
                    arr.forEach(item => {
                        inventoryJudgeDtos.push({
                            "cartId": item.id,
                            "count": item.amount,
                            "orderFlag": item.orderFlag,
                            "ptiPartDtSkuId": item.ptiPartDtSkuId,
                            "ptiPartHdCode": item.goodsCode,
                            "ptiPartHdId": item.ptiPartHdId
                        })
                    })
                }
                if(custParams){
                    inventoryJudgeDtos.push(custParams);
                }

                let stockData = {
                    usrId: Storage.get("USER_INFO").usrId,
                    inventoryJudgeDtos: inventoryJudgeDtos,
                    shopId: Storage.get('USER_INFO').shopId
                };
                // 库存校验
                return Goods.getGroupGoodsStockCust(stockData);
            },
            // 保存购物车
            cartSave (item, newId) {
                let saveData = {
                    amount: item.amount,
                    busContsCode: Storage.get('properties').busContsCode,
//                    cookieId: Storage.get('USER_INFO').cookieId,
                    ctmUsrId: Storage.get('USER_INFO').usrId,
                    dptId: Storage.get('USER_INFO').shopId,
                    goodsCode: item.goodsCode,
                    partDtSkuId: item.ptiPartDtSkuId,
                    newPartDtSkuId: item.newPtiPartDtSkuId,
                    flag: 1
                }
                c_showLoading();
                ShoppingCart.saveCart(saveData).then((res)=>{
                    if(newId) {
                        item.ptiPartDtSkuId = newId
                    }
                }, (err)=>{}).then(()=>{
                    this.getCartInfo()
                })
            },
            // 获取商品已选颜色尺码sku信息
            getColorOrSizeItem(goodItem){
                let colorItem = null,
                        sizeItem = null;
                for(let i=0;i<goodItem.colorArr.length;i++){
                    if(goodItem.colorArr[i].selected){
                        colorItem = goodItem.colorArr[i];
                        break;
                    }
                }
                for(let i=0;i<goodItem.sizeArr.length;i++){
                    if(goodItem.sizeArr[i].selected){
                        sizeItem = goodItem.sizeArr[i];
                        break;
                    }
                }
                 return {colorItem,sizeItem};
            },
            // 显示sku弹窗
            async showSkuDialog(child,cindex){
                if(child.disabled === 'unSell')return;
                if(this.skuIndex === cindex){
                    this.skuIndex = -1;
                    return;
                }

                // 重置颜色sku
                this.resetSku(child);
                await this.getGoodsStucks(child.goodsCode);

                this.skuIndex = cindex;
                // 根据已选颜色或尺码 判断sku库存 并置灰选项
                this.checkoutSkuOption(child);
                // 校验所有颜色或尺码与其对应项组成sku是否都库存不足 是则禁用
                this.checkoutAllSkuStock(child);
            },
            // 校验所有颜色或尺码与其对应项组成sku是否都库存不足 是则禁用
            checkoutAllSkuStock(child){
                let dialogSkuList = this.dialogSkuList;
                let record = 0;
                let shopCartItem = this.shopCartList[this.skuIndex];
                this.skuColorList.forEach((item,index)=>{
                    for(let i=0;i<dialogSkuList.length;i++){
                        if(dialogSkuList[i].colorCode == item.colorCode){
                            // 该颜色存在有库存尺码(break)
                            if(dialogSkuList[i].skuQty >= child.amount){
                                break;
                            }
                            // 记录无库存尺码的最大数量
                            record = dialogSkuList[i].skuQty>record? dialogSkuList[i].skuQty:record;
                        }
                        // 该颜色不存在有库存尺码（内循环最后一个,未break） 设置该颜色数量（被禁用）
                        if(i + 1 == dialogSkuList.length){
                            shopCartItem.colorArr[index].skuQty = record;
                            if(shopCartItem.colorArr[index].selected){
                                shopCartItem.colorArr[index].selected = false;
                            }
                        }
                    }
                })

                record = 0;
                this.skuSizeList.forEach((item,index)=>{
                    for(let i=0;i<dialogSkuList.length;i++){
                        if(dialogSkuList[i].sizeCode == item.sizeCode){
                            // 该尺码存在有库存颜色(break)
                            if(dialogSkuList[i].skuQty >= child.amount){
                                break;
                            }
                            // 记录无库存颜色的最大数量
                            record = dialogSkuList[i].skuQty>record? dialogSkuList[i].skuQty:record;
                        }
                        // 该尺码不存在有库存颜色（内循环最后一个,未break） 设置该尺码数量（被禁用）
                        if(i + 1 == dialogSkuList.length){
                            shopCartItem.sizeArr[index].skuQty = record;
                            if(shopCartItem.sizeArr[index].selected){
                                shopCartItem.sizeArr[index].selected = false;
                            }
                        }
                    }
                })
            },
            // 查询大货商品 sku库存
            getGoodsStucks(goodsCode) {
                let data = {
                    busContsCode: Storage.get('properties').busContsCode,
                    goodsCode: goodsCode,
                    shopCode: Storage.get('properties').shopCode
                };
                return Goods.getGoodsStock(data).then((res) => {
                    this.dialogSkuList = res.skuList;
                });
            },
            // 根据已选颜色或尺码 判断sku库存 并置灰选项
            checkoutSkuOption(child){
                let dialogSkuList = this.dialogSkuList;
                let callback = (arr)=>{
                    arr.forEach(item=>{
                        item.skuQty = true;
                    })
                }
                // 有选中颜色 过滤尺码库存
                if(this.skuColorSelected){
                    this.skuSizeList.forEach((item,index)=>{
                        for(let i=0;i<dialogSkuList.length;i++){
                            if(dialogSkuList[i].sizeCode == item.sizeCode && dialogSkuList[i].colorCode == this.skuColorSelected.colorCode){
                                this.shopCartList[this.skuIndex].sizeArr[index].skuQty = dialogSkuList[i].skuQty;
                                if(item.skuQty < child.amount){
                                    this.shopCartList[this.skuIndex].sizeArr[index].selected = false;
                                }
                                break;
                            }
                        }
                    })
                }else{
                    callback(this.shopCartList[this.skuIndex].sizeArr);
                }
                // 有选中尺码 过滤颜色库存
                if(this.skuSizeSelected){
                    this.skuColorList.forEach((item,index)=>{
                        for(let i=0;i<dialogSkuList.length;i++){
                            if(dialogSkuList[i].colorCode == item.colorCode && dialogSkuList[i].sizeCode == this.skuSizeSelected.sizeCode){
                                this.shopCartList[this.skuIndex].colorArr[index].skuQty = dialogSkuList[i].skuQty;
                                break;
                            }
                        }
                    })
                }else{
                    callback(this.shopCartList[this.skuIndex].colorArr);
                }
            },
            // 显示定制信息弹窗
            showCustomDialog(child,cindex){
                console.log(child.mainFabricName,"===")
                if(this.customIndex === cindex){
                    this.customIndex = -1;
                    return;
                }
                this.customIndex = cindex;
            },
            //  获取购物车列表
            getCartInfo () {
                let data = {
                    usrKey: Storage.get('USER_INFO').usrId,
                    shopDptId: Storage.get('USER_INFO').shopId,
                    buscontsCode: Storage.get('properties').busContsCode,
                    pageSize: 200,
                    pageNo: 1,

                }
                // 备份已勾选id
                this.backupsSelectedId();
                c_showLoading();
                ShoppingCart.getCartList(data).then(async (res)=>{
                    res = fastJson.format(res);
                    let map = {skuQty: true}// true代表初始默认都有库存

                    this.shopCartList = [];
                    res.list.forEach((item,index) => {
                        item.colorArr = []
                        item.sizeArr = []
                        item.newPtiPartDtSkuId = item.ptiPartDtSkuId  //  保存购物车所需参数，默认与原skuId一致
                        item.selected = false;
                        this.selectedAll = false;
                        // false不禁用 'unSell'未上架（禁用全部） 'unStock'库存不足（只禁用勾选框）
                        item.disabled = false;
                        //拆解sku
                        for(let i=0; i<item.simpleSkuInfoList.length; i++) {
                            //  遍历所有sku组合，选区颜色数组
                            if(item.colorArr.length === 0) {
                                map.colorCode = item.simpleSkuInfoList[i].colorCode
                                map.colorId = item.simpleSkuInfoList[i].colorId
                                map.colorName = item.simpleSkuInfoList[i].colorName
                                item.colorArr.push(map)
                                map = {skuQty: true}// true代表初始默认都有库存
                            }
                            for(let j=0; j<item.colorArr.length; j++) {
                                let arrList = []
                                item.colorArr.forEach((colorItem) => {
                                    arrList.push(colorItem.colorId)
                                })
                                if(arrList.indexOf(item.simpleSkuInfoList[i].colorId) === -1) {
                                    map.colorCode = item.simpleSkuInfoList[i].colorCode
                                    map.colorId = item.simpleSkuInfoList[i].colorId
                                    map.colorName = item.simpleSkuInfoList[i].colorName
                                    item.colorArr.push(map)
                                    map = {skuQty: true}// true代表初始默认都有库存
                                }
                            }
                            //  遍历所有sku组合，选区尺码数组
                            if(item.sizeArr.length === 0) {
                                map.sizeCode = item.simpleSkuInfoList[i].sizeCode
                                map.sizeId = item.simpleSkuInfoList[i].sizeId
                                map.sizeName = item.simpleSkuInfoList[i].sizeName
                                item.sizeArr.push(map)
                                map = {skuQty: true}// true代表初始默认都有库存
                            }
                            for(let j=0; j<item.sizeArr.length; j++) {
                                let arrList = []
                                item.sizeArr.forEach((sizeItem) => {
                                    arrList.push(sizeItem.sizeId)
                                })
                                if(arrList.indexOf(item.simpleSkuInfoList[i].sizeId) === -1) {
                                    map.sizeCode = item.simpleSkuInfoList[i].sizeCode
                                    map.sizeId = item.simpleSkuInfoList[i].sizeId
                                    map.sizeName = item.simpleSkuInfoList[i].sizeName
                                    item.sizeArr.push(map)
                                    map = {skuQty: true}// true代表初始默认都有库存
                                }
                            }
                        }
                        this.resetSku(item);// 重置sku
                        this.shopCartList.push(item);
                    })
                    /* orderFlag字段用于区分定制商品和大货商品，0表示大货商品 */
                    c_showLoading(false);
                    // 初始化商品时判断是否可购买
                    await this.createCheckoutCanPay();
                    // 初始化商品 判断商品勾选
                    this.createCheckoutSelected();
                })
            },
            // 重置sku resetType: 'color'(重置颜色) 'size'（重置尺码） 'all'（重置颜色、尺码）
            resetSku(item,resetType='all'){
                if(resetType === 'all' || resetType === 'color'){
                    for(let i=0;i<item.colorArr.length;i++){
                        if(item.colorId == item.colorArr[i].colorId){
//                            item.colorArr[i].selected = false;
                            item.colorArr[i].selected = true;
                        }else{
                            item.colorArr[i].selected = false;
                        }
                    }
                }

                if(resetType === 'all' || resetType === 'size'){
                    for(let i=0;i<item.sizeArr.length;i++){
                        if(item.sizeId == item.sizeArr[i].sizeId){
//                            item.sizeArr[i].selected = false;
                            item.sizeArr[i].selected = true;
                        }else{
                            item.sizeArr[i].selected = false;
                        }
                    }
                }
            },
            // 用户信息
            async getUser () {
                let data ={}
                return await UserService.getUserInfo(data).then((res) => {
                    return res;
                })
            },
            /***
             * 工具方法
             */
            msgTip(msg,type='warning'){
                this.$message[type](msg);
            },
            msgDialog(msg,callback){
                this.$alert(msg, this.$t('common.hint'), {
                    confirmButtonText: this.$t('common.sure'),
                    dangerouslyUseHTMLString:true,
                    callback: action => {
                        if(action == 'confirm'){
                            typeof callback === 'function' && callback();
                        }
                    }
                });
            }
        },
        created() {
            // 备份已勾选购物车列表id
            this.backupsSelectedCartId = [];
            this.getCartInfo();
        }
    }
</script>
<style scoped lang="scss">

    .wrapper{
        padding-top: 30px;
        font-size: $font-small;
    }
    .tr-disabled{
        background: $color-disabled;
    }
    .good-pic{
        width: 100px;
        height: 100px;
        margin: 17px 0;
        cursor: pointer;
    }
    .td-operator{
        color: $text-regular;
        .td-operator-collect,
        .td-operator-remove{
            cursor: pointer;
        }
        .td-operator-remove:hover{
            color:$text-hover;
        }
        .td-operator-collect:hover{
            color:$text-hover;
        }
    }
    .good-info{
        text-align: left;
        margin-left: 20px;
        padding-top: 38px;

        .good-info-describe,
        .good-info-sku{
            /*display: block;*/
            line-height: 28px;
            font-size: $font-small;
            position: relative;
        }
        .good-info-describe{
            color: $text-primary;
            cursor: pointer;
        }
        .good-info-sku{
            cursor: pointer;
            color: $text-secondary;
        }
        .good-info-state{
            color: $text-secondary;
        }
        &.good-info-cust{
            padding-top: 28px;
        }
    }

    .com-table{
        th:nth-child(1),td:nth-child(1){
            width: 63px;
            text-align: left;
            padding-left: 15px;
            box-sizing: inherit;
        }
        th:nth-child(3),td:nth-child(3){width: 150px;}
        th:nth-child(4),td:nth-child(4){width: 150px;}
        th:nth-child(5),td:nth-child(5){width: 150px;}
        th:nth-child(6),td:nth-child(6){width: 150px;}
    }
    .sku-form{
        position: absolute;
        top:40px;
        left: 0;
        width: 358px;
        padding: 30px 25px;
        background: $color-white;
        cursor: default;
        z-index: 100;

        .sku-form-item{
            margin-bottom: 20px;
            .item-label{
                color: $text-primary;
                line-height: 34px;
                margin-right: 15px;
            }
            .size-label{
                line-height: 37px;
            }
            &:last-child{
                margin-bottom: 0;
            }
        }
    }
    .ul-list{
        flex-wrap: wrap;
    }
    .li-item{
        border: 1px solid transparent;
        line-height:32px;
        margin: 5px;
        cursor: pointer;
        text-align: center;
        border: 1px solid $color-line;
        position: relative;
        padding: 0 5px;
        box-sizing: content-box;

        &.selected{
            border-color: $text-hover;
            .selected-logo{
                display: block;
            }
        }
        .selected-logo{
            width: 14px;
            height: 14px;
            display: none;
            position: absolute;
            right: 0;
            bottom:0;
        }
    }
    .li-item-size{
        min-width: 40px;
        line-height:32px;
        margin: 5px;
        text-align: center;
        cursor: pointer;
        border: 1px solid $color-line;
        position: relative;

        &.selected{
            border-color: $text-hover;
            .selected-logo{
                display: block;
            }
        }

        .selected-logo{
            width: 14px;
            height: 14px;
            display: none;
            position: absolute;
            right: 0;
            bottom:0;
        }
    }
    .no-stock{
        background: $color-disabled;
    }
    .sure-btn{
        color: $text-white;
        width: 120px;
        line-height: 32px;
        text-align: center;
        background: $color-golden;
        margin: 25px 0 0 55px;
        cursor: pointer;
    }
    .triangle-up{
        width: 0;
        height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-bottom: 15px solid $color-white;
        position: absolute;
        top: -15px;
        left: 15px;
        filter: drop-shadow(0px -1px 1px #dcdcdc);
    }
    .custom-btn{
        border:1px solid $color-line;
        padding: 0 10px;
        line-height: 30px;
        cursor: pointer;
        position: relative;
        width: 128px;
    }
    .icon-down-color{
        color:$text-secondary;
    }
    .settle-strip{
        margin: 20px 0;
        border: 1px solid $color-line;
        line-height: 70px;
        position: relative;

        .settle-strip-info{
            background: $bg-color-regular;
            padding: 0 23px;
        }
        .settle-strip-btn{
            width: 125px;
            text-align: center;
            color: $text-white;
            background: $color-golden;
            cursor: pointer;
            font-size: $font-regular;
            &.disabled{
                background: $color-disabled;
            }
        }
        // 已选中弹窗
        .selected-dialog{
            width: 100%;
            position: absolute;
            top: -125px;
            left: 0px;
            z-index: 1000;
        }
    }
    .settle-price{
        cursor: pointer;
        color: $text-secondary;
        .span-block{
            display: block;
            line-height: 35px;
            color: $text-secondary;
        }
    }
    .settle-price-label{
        margin-right: 30px;
    }
    .real-pay{
        font-size:$font-h2;
        color: $color-red;
    }
    .cut-interval{
        height: 100%;
        border-left:1px dotted $color-line;
        margin:0 30px;
    }
    .empty-cart{
        text-align: center;
        line-height: 200px;
        color: $text-secondary;
    }
    .shop-recommend{
        margin-bottom: 70px;
    }
    .operator-btn{
        margin-left: 55px;
        cursor: pointer;
        &.disabled{
            color: $text-placeholder;
            cursor: default;
        }
    }
    .selected-text{
        .selected-text-num{
            color: $text-warn;
            font-size: $font-regular;
        }
    }
    .add-price-than{
        color: $text-warn;
        font-size: $font-smaller;
    }
    /*结算提示弹窗 禁用'继续购买'*/
    .buy-disabled{
        background: $color-disabled;
    }
</style>
