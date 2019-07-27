/*
* createTime：2019/1/22
* author：en.chen
* description:  网站底部导航
*/
<template>

    <footer class="footer">
        <div class="wrapper">
            <div class="ensure">
                <ul class="clearfix">
                    <li class="ensure-item">
                        <div class="item-icon ensure01"></div>
                        <div class="ensure-text">
                            <h3 class="font-title1 color-white">{{$t('footer.assure')}}</h3>
                            <p class="font-common">{{$t('footer.assureInfo')}}</p>
                        </div>
                    </li>
                    <li class="ensure-item">
                        <div class="item-icon ensure02"></div>
                        <div class="ensure-text">
                            <h3 class="font-title1 color-white">{{$t('footer.afterSale')}}</h3>
                            <p class="font-common">{{$t('footer.afterSaleInfo')}}</p>
                        </div>
                    </li>
                    <li class="ensure-item">
                        <div class="item-icon ensure03"></div>
                        <div class="ensure-text">
                            <h3 class="font-title1 color-white">{{$t('footer.diy')}}</h3>
                            <p class="font-common">{{$t('footer.diyInfo')}}</p>
                        </div>
                    </li>
                    <li class="ensure-item">
                        <div class="item-icon ensure04"></div>
                        <div class="ensure-text">
                            <h3 class="font-title1 color-white">{{$t('footer.send')}}</h3>
                            <p class="font-common">{{$t('footer.sendInfo')}}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="copyright">
                <!-- <p>Copyright ©2012-2015 XIAMEN QishonTecnology Co.,Ltd All Rights Reserved</p> -->
                <p>{{$t('footer.copyRight')}}</p>
            </div>
        </div>
    </footer>

</template>
<script>
import Storage from "../utils/storage";
export default {
  name: "Footer",
  data() {
    return {};
  },
  methods: {},
  created() {}
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
.footer {
  background: $bg-color-footer;
  overflow: hidden;
  .ensure {
    margin-top: 55px;
    .ensure-item {
      float: left;
      width: 299px;
      height: 68px;
      overflow: hidden;
      /*cursor: pointer;*/
      line-height: 1.5;
      &::after {
        content: "";
        display: table;
        clear: both;
      }
      .item-icon {
        float: left;
        width: 68px;
        height: 68px;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        overflow: hidden;
        background-size: 100%;
      }
      .ensure01 {
        background: url("../assets/images/footer/ensure01.png") no-repeat center;
      }
      .ensure02 {
        background: url("../assets/images/footer/ensure02.png") no-repeat center;
      }
      .ensure03 {
        background: url("../assets/images/footer/ensure03.png") no-repeat center;
      }
      .ensure04 {
        background: url("../assets/images/footer/ensure04.png") no-repeat center;
      }
      .ensure-text {
        float: left;
        margin-left: 18px;
        p {
          color: $text-footer-gray;
          margin-top: 4px;
        }
      }
    }
  }
  .copyright {
    margin-top: 30px;
    padding: 18px 0 16px 0;
    font-size: $font-smaller;
    color: $text-footer-gray;
    text-align: center;
    border-top: solid 1px $color-line;
  }
}
@media screen and (max-width: 1199px) {
  .footer {
    min-width: 990px;
    .ensure {
      .ensure-item {
        width: 242.5px;
      }
    }
  }
}
</style>