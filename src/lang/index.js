// 多语言实例文件
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie'
import elementZH from 'element-ui/lib/locale/lang/zh-CN'
import elementEN from 'element-ui/lib/locale/lang/en'
import elementJA from 'element-ui/lib/locale/lang/ja'
import customZH from './zh' // 引入自定义中文包
import customEN from './en' // 引入自定义英文包
Vue.use(VueI18n) // 全局注册国际化包

export default new VueI18n({
  // i18n选项
  locale: Cookie.get('language') || 'zh', // 指的是当前多语言的类型  zh/中文  en/英文
  messages: {
    zh: {
      // 语言包  elementUI语言包  // 自定义语言包
      ...elementZH, // 将饿了么的中文语言包引入
      ...customZH
    },
    en: [
      ...elementEN, // 将饿了么的英文语言包引入
      ...customEN
    ],
    ja: {
      ...elementJA
    }
  }
})
