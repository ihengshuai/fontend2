/*
 * @Author: Mr_Wei
 * @Description: 配置拦截器
 * @Date: 09:51 2019/07/01
 * @Param: http.js
 * @return:
 **/ 

import axios from "axios";
import {Message} from "iview";
import wsmLoading from '@/myplugin/Loading';
import router from "./router";

// 请求拦截
axios.interceptors.request.use(config => {
    wsmLoading.startLoading("拼命加载中...");
    if(localStorage.jwtToken){
        config.headers.Authorization = localStorage.jwtToken;
    }

    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截
axios.interceptors.response.use(response => {
    wsmLoading.endLoading();
    return response;
}, error => {
    wsmLoading.endLoading();
    const {status} = error.response;
    if(status == 401){
        localStorage.removeItem("jwtToken");
        router.push("/login");
        Message.error({
            content:"密码失效,请重新登录",
            duration:2
        });
    }else{
        Message.error({
            content:error.response.data,
            duration:1
        })
    }
})

export default axios;