import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import '@/assets/css/wochu.scss' // 变量
import '@/assets/css/reset.css' // 样式重置
import '@/assets/js/rem.js' // rem

// 按需引入 Vant
import {
  AddressList, Area, AddressEdit, Popup, Notify, Sku, Search, NavBar, Button, Icon, Tabbar, TabbarItem, Swipe, SwipeItem, Lazyload, Tab, Tabs, Field, Cell, CellGroup, Toast, Row, Col, List, PullRefresh, GoodsAction, GoodsActionBigBtn, GoodsActionMiniBtn, Card, Stepper, SubmitBar, Checkbox, CheckboxGroup, SwipeCell, Dialog
} from 'vant';
Vue.use(AddressList).use(Area).use(AddressEdit).use(Popup).use(Notify).use(Sku).use(Search).use(NavBar).use(Button).use(Icon).use(Tabbar).use(TabbarItem).use(Swipe).use(SwipeItem).use(Lazyload).use(Tab).use(Tabs).use(Field).use(Cell).use(CellGroup).use(Toast).use(Row).use(Col).use(List).use(PullRefresh).use(GoodsAction).use(GoodsActionBigBtn).use(GoodsActionMiniBtn).use(Card).use(Stepper).use(SubmitBar).use(Checkbox).use(CheckboxGroup).use(SwipeCell).use(Dialog);

import '@/mock/mock.js' //模拟数据
// 生产提示
Vue.config.productionTip = false
// 过滤器
import { formatCurrency, fillSpace } from '@/assets/js/general.js' // 货币格式化插件
Vue.filter('formatCurrency', formatCurrency);
Vue.filter('fillSpace', fillSpace);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
