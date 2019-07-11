/*
 * @Author: Mr_Wei
 * @Description: 状态管理文件
 * @Date: 19:51 2019/6/29
 * @Param: store.js
 * @return:
 **/

import Vue from 'vue'
import Vuex from 'vuex'

// 引入模块
import userStore from '@/store/userstore';
import searchStore from '@/store/searchstore';

Vue.use(Vuex)

const state = {
    // 系统心情语句
    systemsay:[
        {value:'厚积薄发,动起来,每天进步一点点...'},
        {value:'每天都朝气蓬勃,厚积薄发...'},
        {value:'昨日之物不可留,今日多烦恼...'},
        {value:'今日事,今日毕,信用是你最大的财富...'},
        {value:'其实,一切都已经有了苗头,只是,你不肯面对罢了...'},
        {value:'好好工作,思考全面,多多学习,不懂就问...'},
        {value:'自己才是真的好,自己不对自己负责,其他人更加不会了...'},
        {value:'哇哇...期待的周末又来了...'},
        {value:'卧槽...万恶的周一又来了...'},
        {value:'假期总是过得特别快...我已无力吐槽...'},
    ],
    // 网站主题
    websiteTheme:localStorage.getItem("websiteTheme")
};
const getters = {
    // 网站主题
    websiteTheme:state => state.websiteTheme
};
const mutations = {
    // 网站主题
    websiteTheme(state, currentTheme){
        state.websiteTheme = currentTheme;
    }
};

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    modules:{
      userStore,
      searchStore
    }
})


export default store;
