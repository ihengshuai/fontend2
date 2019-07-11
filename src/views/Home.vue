<template>
    <div class="home">
        <!-- 导航栏 -->
        <PCNAV></PCNAV>

        <router-view/>
        
        <!-- 脚注部分 -->
        <div class="footer">
            <div class="footer-top">
                <div class="left">
                    <p style="padding-bottom:20px;">
                        <img src="../assets/logo/whs-logo.png">
                    </p>
                    <p>我们一直致力于为广大初学者提供优质技术文档,以及正确的学习过程和更多的辅助开发工具！</p>
                </div>
                <div class="right">
                    <div class="item1">
                        <h3>关于</h3>
                        <p>广告合作</p>
                        <p>友情链接</p>
                        <p>招聘</p>
                    </div>
                    <div class="item2">
                        <h3>联系方式</h3>
                        <p>新浪微博</p>
                        <p>腾讯QQ</p>
                        <p>电子邮件</p>
                    </div>
                    <div class="item3">
                        <h3>赞助商</h3>
                        <p>阿里巴巴集团</p>
                        <p>腾讯集团</p>
                        <p>百度集团</p>
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <p>京ICP备11008151号 | 京公网安备11010802014853</p>
            </div>
        </div>
    </div>
</template>

<script>
import PCNAV from '@/components/pcnav';
export default {
    name:"home",
    components:{
        "PCNAV":PCNAV
    },
    data(){
        return{

        }
    },
    methods:{
        // 判断设备
        browserRedirect() {
            const sUserAgent = navigator.userAgent.toLowerCase();
            const bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            const bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            const bIsMidp = sUserAgent.match(/midp/i) == "midp";
            const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            const bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            const bIsAndroid = sUserAgent.match(/android/i) == "android";
            const bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            const bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                // this.$router.push("/m.home");
            } else {
            } 
        }
    },
    created(){
        this.browserRedirect();
    }
}
</script>

<style lang="less" scoped>
.home{
    width: 100%;
    // min-width: 400px;

    // 脚注部分
    .footer{
        border-top: 1px solid #ddd;
        width: 100%;
        padding: 50px 30px;
        background-color: #1d3958;  
        color: #fff;

        .footer-top{
            padding-bottom: 20px;
            width: 100%;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            justify-content: space-between;
            .left{
                padding: 5px 0px;

                img{
                    width: 200px;
                }
            }

            .right{
                width: 400px;
                padding: 5px 0px;
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                flex-wrap: wrap;

            }
        }

        .footer-bottom{
            // border-top: 1px solid #ddd;
            padding: 20px 20px 0px 20px;
            p{
                border-top: 1px solid #aaa;
                padding-top: 20px;
                text-align: center;
            }
        }

    }
}


</style>
