/*
 * @Author: Mr_Wei
 * @Description: Loading加载配置
 * @Date: 22:15 2019/07/04
 * @Param: Loading.js
 * @return:
 **/

import {Loading} from "element-ui";

let loadingInstance;
let wsmLoading = {
    startLoading:function(notice,bgcolor){
        loadingInstance = Loading.service({
            text:notice,
            lock:true,
            fullscreen:true,
            background:bgcolor ? bgcolor : "rgba(0,0,0,.7)"
        });
    },
    endLoading:function(){
        loadingInstance.close();
    }
}

export default wsmLoading