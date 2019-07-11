/*
 * @Author: Mr_Wei
 * @Description: Loading插件配置
 * @Date: 22:15 2019/07/04
 * @Param: Loading.js
 * @return:
 **/

import {Loading} from "element-ui";

let loadingInstance;
let wsmLoading = {
    startLoading:function(notice){
        loadingInstance = Loading.service({
            text:notice,
            lock:true,
            fullscreen:true,
            background:"rgba(0,0,0,.7)"
        });
    },
    endLoading:function(){
        loadingInstance.close();
    }
}

export default wsmLoading