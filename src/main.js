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

// Echarts数据可视化
import echarts from "echarts";
Vue.prototype.$echarts = echarts;

// markdownEditor(markdown文件编辑)
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor);

// 视频播放器
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
Vue.use(VueVideoPlayer)

// 分享功能
import SocialSharing from "vue-social-sharing"
Vue.use(SocialSharing)


// 音乐播放器
// import APlayer from 'vue-aplayer';
// Vue.use(APlayer, {
//   defaultCover: 'https://github.com/u3u.png',
//   productionTip: true,
// });

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
