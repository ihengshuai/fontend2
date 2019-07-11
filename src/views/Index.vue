<template>
    <div class="index">
        <!-- 内容区域 -->
        <div class="container">
            <div class="suggest">
                <h2 class="title">前端学习之推荐序列</h2>
                <p class="notice">以下这些是学习前端的热门框架,愿这些都对您有所帮助,学习愉快^_^</p>
            </div>
            <div class="content scroll-container">
                <!-- 渲染卡片 -->
                <div  class="showcard card-img-item" v-for="(item, index) in homepagedata" :key="index">
                        <router-link :to="item.url">
                            <el-card :body-style="{ padding: '0px' }">
                                <el-image :src="item.img" class="image" lazy>
                                    <div slot="placeholder" class="image-slot">
                                        加载中<span class="dot">...</span>
                                    </div>
                                </el-image>
                                <!-- <img :src="item.img" class="image"> -->
                                <div style="padding: 14px;">
                                    <p class="card-title">{{item.title}}</p>
                                    <div class="bottom clearfix">
                                        <time class="time">
                                            {{item.content}}
                                        </time>
                                    </div>
                                </div>
                            </el-card>
                        </router-link>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
// 瀑布流组件
import vueWaterfallEasy from 'vue-waterfall-easy';

export default {
    name:"Index",
    components:{
        "vueWaterfallEasy":vueWaterfallEasy
    },
    data(){
        return{
            homepagedata:[],
            searchdata:''
        }
    },
    created(){
        this.getHomepagedata();
        // console.log(this.$store.state.systemsay)
    },
    methods:{
        // 搜索框
        searchInput(){
            if(this.searchdata){
                this.$router.push({path:"/search?",query:{q:this.searchdata}});
            }else{
                this.$Message.warning("搜索内容不能为空")
            }
        },
        // 获取首页数据
        getHomepagedata(){
            if(!localStorage.homepage){
                this.$axios.get("http://localhost:3001/api/index")
                        .then(res => {
                            var homedata = res.data;
                            homedata.forEach((item,index) => {
                                item.img = require("../assets/imgs/" + item.img);
                            })
                            localStorage.setItem("websiteTheme", "dark"); // 设置主题
                            localStorage.setItem("homepage", JSON.stringify(homedata));
                            this.homepagedata = homedata;
                        })
            }else{
                this.homepagedata = JSON.parse(localStorage.getItem("homepage"));
            }
        },
    },
    computed:{
        
    },
    
}
</script>

<style lang="less" scoped>
.index{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    width: 100%;

    // 网站推荐
    .suggest{
        width:100%;
        padding: 40px 80px;
        text-align: center;

        .title{
            width: 100%;
            text-align: center;
            font-size: 40px;
            color: #000;
            font-weight: 400;
        }
        .notice{
            color: #777;
            text-align: center;
            border-bottom: 1px solid #ccc;
            padding: 10px 0px 30px 0px;
        }
    }


    // 主要内容区域
    .container > .content{
        width: 100%;
        padding: 0px 30px 20px 30px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap;

        .showcard{
            width: 300px;
            margin: 20px 0px;

            // 卡片标题
            .card-title{
                display: block;
                width: 100%;
                text-align: center;
                color: #337ab7;
                font-size: 22px;
                font-weight: 700;
            }

            .clearfix .time {
                text-align: center;
                font-size: 14px;
                color: #888;
                width: 100%;
                line-height: 20px;
                height: 100px;
                // 单行文字溢出
                // word-break: break-word;
                // white-space: nowrap;
                // overflow: hidden;
                // text-overflow: ellipsis;
                

                // 多行文字溢出
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }
            .el-card{
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 10px;
            }
            .el-card:hover{
                background-color: rgb(247, 243, 243);
                // transform: scale(1.05);
            }
            .el-card:hover .image{
                // background-color: #fff;
                transition: 500ms ease-in-out;
                transform: scale(1.15);
            }
            .bottom {
                margin-top: 13px;
                line-height: 12px;
            }

            .button {
                padding: 0;
                float: right;
                margin-left: 60px;
            }

            .image {
                width: 100%;
                height: 150px;
                display: block;
            }
            .image-slot{
                width: 100%;
                height: 100%;
                line-height: 150px;
                text-align: center;
                font-size: 18px;
            }

            .clearfix:before,
            .clearfix:after {
                display: table;
                content: "";
            }
            
            .clearfix:after {
                clear: both
            }
        }
    }

    @media screen and (min-width: 600px) {
        .container > .content{
            padding: 0px 170px 20px 170px;
            .showcard{
                width: 270px;
                margin: 20px 10px;
            }
        }
        
    }
    @media screen and (min-width: 800px) {
        .suggest{
            padding: 40px 300px;
        }
    }
}
</style>
