/*
 * @Author: Mr_Wei
 * @Description: 入口文件
 * @Date: 16:34 2019/6/29
 * @Param: main.js
 * @return:
 **/
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// 引入Axios
import axios from "@/http";
Vue.prototype.$axios = axios;

// 引入jquery
import $ from 'jquery';
Vue.prototype.$ = $;


// iview库
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

// Element库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
