/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: vuecli3.0配置文件
*  @Date: 2019/06/28
*
*/ 

const webpack = require("webpack");
module.exports = {
    configureWebpack: {
      plugins: [
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery"
        })
      ],
      externals: 'hls.js'    //  忽略hls.js报的错
    }
  }