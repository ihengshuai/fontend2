<template>
    <div class="html5" id="html5">
        <div class="outer-box">
            <div class="left-bar">
                <Anchor  class="Anchorlist" :scroll-offset="scrolloffset" show-ink :offset-top="offsetTop" container="#right-content"> 
                    <AnchorLink v-for="item in articles" @click.native="gohref(item.hash)" :key="item.title" :href="'#'+item.hash" :title="item.title"/>
                </Anchor>
            </div>
            <div class="right-content" id="right-content">
                <div style="width:100%;" class="render" :id="item.hash" v-for="item in articles" :key="item.title">
                    <p style="color:#000;font-size:29px;"><span style="color:blue;">§</span>{{item.title}}</p>
                    <div v-html="item.content"></div>
                </div>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <vue-markdown v-highlight>
                    # 一、获取token
                    接口路径：/router/rest/V1
                    请求方式：HTTP POST
                    请求头域：Content-Type application/json
                    ``` 
                    {
                        "method": "DB.oauth.token",
                        "requestId": "9e100afd-3f7e-4f55-aaee-7a1f9bce71c8",
                        "code": 0,
                        "data": [
                        {
                            "access_token":"dfb7a692-7e98-48bb-97da-6d3ccc97fd97",
                            "token_type":"bearer",
                            "expires_in":28799,
                            "scope":"server"

                        }
                        ],
                        "message": "调用接口成功"
                    }
                    ```
                </vue-markdown>
            </div>
        </div>
    </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import hljs from 'highlight.js'
import 'highlight.js/styles/googlecode.css'
import { AnchorLink } from 'iview';
import $ from 'jquery';
import { setTimeout } from 'timers';
// $(window).scroll(function(event){
//     var top = $(window).scrollTop();
//     if(top >= 900){
//         alert("ss")
//     }
//     console.log(top)
// });


export default {
    name:"html5",
    components:{
        "AnchorLink":AnchorLink,
        VueMarkdown
    },
    data(){
        return{
            offsetTop:100,
            scrolloffset:100,
            author:[
                {href:"first", title:"页头"},
                {href:"second", title:"页中"},
                {href:"third", title:"页尾"},
                {href:"forth", title:"页脚"}
            ],
            articles:""
        }
    },
    created(){
        this.getHTML5();
    },
    mounted(){
        
    },
    methods:{
        // 获取HTML5文章
        getHTML5(){
            this.$axios.get("http://localhost:3001/api/article/html5")
                    .then(res => {
                        this.articles = res.data;
                        console.log(this.articles)
                    })
        },
        // 判断有没有hash值
        judgeHash(){
            if(this.$route.hash){
                console.log(decodeURI(this.$route.hash))
                setTimeout(() => {
                    var top = $(`${decodeURI(this.$route.hash)}`).offset().top - 70;
                    $('html,body').stop().animate({
                        'scrollTop': top
                    }, 500);
                    $(`a[href='${decodeURI(this.$route.hash)}']`).css("color","blue");
                }, 300)
            }
        },
        // 点击链接不管路由有没有变都可以知道位置
        gohref(href){
            var top = $(`#${href}`).offset().top - 70;
            $('html,body').stop().animate({
				'scrollTop': top
            }, 700);
            $(`a[href='#${href}']`).parent("div").siblings(".ivu-anchor-link").children("a").css("color","#000")
            $(`a[href='#${href}']`).css("color","blue");
        }
    },
    watch:{
        // 监听路由变化
        $route(to, from){
            var top = $(`${to.hash}`).offset().top - 70;
            $('html,body').stop().animate({
				'scrollTop': top
            }, 700);
        }
    }
}
</script>

<style lang="less" scoped>

.html5{
    width:100%;
    
    

    .outer-box{
        width: 100%;
        display: flex;
        padding: 20px 80px;

        // 导航
        .left-bar{
            width: 300px;
            padding: 20px 20px 100px 40px;
            font-size: 18px;

            .Anchorlist{
                width: 100%;
            }
        }

        .right-content{
            flex:1;
            padding: 20px 50px;

            .render{
                
            }
        }
    }


    @media screen and (max-width: 900px){
        .outer-box{
            width: 100%;
            padding: 10px 20px;

            .left-bar{
                display: none;
            }
            .right-content{
                // flex: 1;
                width: 100%;
                overflow: hidden;
                border-right: none;
                padding: 20px 0px;
            }
        }
        
    }
    

    
}
</style>
