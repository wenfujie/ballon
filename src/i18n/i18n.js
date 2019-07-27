/*
 * @Author: zhibin.zhao
 * @Date: 2019-01-18 21:22:27
 * @LastEditors: zhibin.zhao
 * @LastEditTime: 2019-01-18 21:22:27
 * @Description: 国际化
 */

import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './langs'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'cn',
  messages
})

export default i18n