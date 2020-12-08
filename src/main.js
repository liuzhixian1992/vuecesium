import Vue from 'vue'
import App from './App.vue'
// 引入路由文件
import router from './router/index'
var Cesium = require('cesium/Cesium');
var widgets= require('cesium/Widgets/widgets.css');

Vue.prototype.Cesium = Cesium
Vue.prototype.widgets = widgets

Vue.config.productionTip = false

new Vue({
  // 引入路由对象
  router,
  render: h => h(App),
}).$mount('#app')
