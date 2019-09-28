<template>
  <div id="app">
    <router-view/>
    <BackTop></BackTop>
    <!-- 签到模态框 -->
    <template>
        <Modal v-model="modalstatus" :closable="false" :mask-closable="false">
            <p slot="header" style="color:#f60;">
                <Icon type="md-alarm" />
                <span>每日签到</span>
            </p>
            <div style="text-align:left">
                <p style="padding-bottom:10px;">今天签到了吗？请选择您此刻的<span style="color:#f40;">心情图片</span>并写下<span style="color:blue;">今天最想说的话！</span></p>
                <div class="selectmood">
                    <img @click="mymood('开心')" id="开心" src="./assets/face/kx.gif" alt="开心">
                    <img @click="mymood('难过')" id="难过" src="./assets/face/ng.gif" alt="">
                    <img @click="mymood('郁闷')" id="郁闷" src="./assets/face/ym.gif" alt="">
                    <img @click="mymood('无聊')" id="无聊" src="./assets/face/wl.gif" alt="">
                    <img @click="mymood('生气')" id="生气" src="./assets/face/nu.gif" alt="">
                    <img @click="mymood('擦汗')" id="擦汗" src="./assets/face/ch.gif" alt="">
                    <img @click="mymood('奋斗')" id="奋斗" src="./assets/face/fd.gif" alt="">
                    <img @click="mymood('慵懒')" id="慵懒" src="./assets/face/yl.gif" alt="">
                </div>
                <p style="padding-left:0px;">您的心情: <span style="color:#aaa">{{mood}}</span> </p>
                <p style="padding:10px 0px;">
                    <span style="color:#19be6b;padding-right:10px;">今日最想说模式</span>
                    <RadioGroup v-model="saymodel" @change.native="changemodel()">
                        <Radio label="1">
                            <Icon type="ios-create" />
                            <span>自己填写</span>
                        </Radio>
                        <Radio label="2">
                            <Icon type="ios-flag" />
                            <span>快速选择</span>
                        </Radio>
                    </RadioGroup>
                </p>
                <p>
                    <span v-if="saymodel1">
                        <span style="color:#ed4014;">我今天最想说:</span>
                        <Input v-model="mysay" placeholder="请填写自己的最想说..." style="100px" />
                    </span>
                    <span v-if="saymodel2">
                        <span style="color:#ed4014;">快速选择:</span>
                        <span>
                            <Select v-model="mysay" style="width:100%">
                                <Option v-for="item in systemsay" :value="item.value" :key="item.value">{{ item.value }}</Option>
                            </Select>
                        </span>
                    </span>
                </p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" small @click="sign()">点我签到</Button>
            </div>
        </Modal>
    </template>
  </div>
</template>
<script>
// import $ from 'jquery';
// import iView from 'iview';
// $(window).scroll(function() {
//     var scrollTop = $(document).scrollTop();
//     console.log(scrollTop)
//     var documentHeight = document.documentElement.clientHeight;
//     // console.log(documentHeight)
//     var documentWidth = document.documentElement.clientWidth;
//     iView.LoadingBar.update(scrollTop / (documentHeight + 16000) * documentWidth);
// })

import jwt_decode from 'jwt-decode';
import '@/myplugin/Date';
export default {
    name:"APP",
    components:{},
    data(){
        return {
            currentTitle:this.$route.meta.title,  // 设置标题
            saymodel:'1',  // 说说模式
            saymodel1:true,  // 模式1
            saymodel2:false,  // 模式2
            mysay:"",   // 我的说说
            mood:"",   // 我今天的心情
        }
    },
    created(){
        this.judgeSign();
        this.judgeLogin();
        this.welcome();
    },
    watch:{
        $route(to, from){
            this.judgeSign();
            this.welcome();
        }
        
    },
    methods:{
        // 判断有没有签到
        judgeSign(){
            if(localStorage.jwtToken){
                const decode = jwt_decode(localStorage.jwtToken);
                const currentDate = new Date().format("yyyy-MM-dd");
                // 判断签到最新日期是不是今天
                const flag = currentDate === decode.signdate ? true : false;
                if(!flag){
                    this.$store.commit("isSign", !flag);
                }else{
                    this.$store.commit("isSign", !flag);
                }
            }
        },
        // 选定心情
        mymood(mood){
            this.$("#" + mood).siblings("img").css("background","#fff");
            this.$("#" + mood).css("background","#bbb");
            this.mood = mood;
        },
        // 改变说说模式
        changemodel(){
            if(this.saymodel == 2){
                this.saymodel1 = false;
                this.saymodel2 = true;
            }
            if(this.saymodel == 1){
                this.saymodel1 = true;
                this.saymodel2 = false;
            }
        },
        // 签到
        sign(){
            if(!this.mood || !this.mysay){
                this.$notify({
                    title: '签到提示',
                    message: '你选择的心情不正确,请重新选择签到',
                    position: 'top-middle',
                    type:"warning",
                    duration:1000
                });
            }else{
                const decode = jwt_decode(localStorage.jwtToken);
                const currentDate = new Date().format("yyyy-MM-dd");
                const signAllCount = parseInt(decode.signcount) + 1;
                this.$axios.post("http://localhost:3001/api/user/updata/token", {
                                email:decode.email,signdate:currentDate,signcount:signAllCount,say:`心情:${this.mood},最想说:${this.mysay}`
                        }).then(res => {
                            localStorage.setItem("jwtToken", res.data.token)
                            this.modalstatus = false;
                            this.$Message.info("签到成功");
                        })
            }
        },
        // 判断是否登录
        judgeLogin(){
            if(localStorage.jwtToken){
                const decoded = jwt_decode(localStorage.jwtToken);
                decoded.avatar ? decoded.avatar = decoded.avatar : decoded.avatar = "default.png";
                this.$store.commit("user", decoded);
                this.$store.commit("isAuthorizated", true);
                this.$store.commit("avatar", decoded.avatar);
            }
            if(localStorage.adminToken){
                this.$store.commit("isAdminAuthorization", true);
            }
        },
        // 控制台欢迎语
        welcome(){
            console.log(`%c
    ____________________________
        欢迎新同学来本站学习
        我是小萌  
        竭诚为你服务
        如有什么不懂得
        请留言,我们会尽快解决
        学的开心哦（〜^㉨^)〜
        谢谢~
    ____________________________
    ▄︻┻┳═一……
    本站永久地址:http://localhost:8080
            `,'color:#1E90FF;font-size:14px;font-family:"隶书"')
        }
    },
    computed:{
        // 模态框状态
        modalstatus:{
            get(){
                return this.$store.getters.isSign;
            },
            set(val){
                this.$store.commit("isSign", val);
            }
        },
        // 系统心情语句
        systemsay(){
            return this.$store.state.systemsay;
        }
    },
    mounted(){
        // 监视页面是否在活动内
        document.addEventListener("visibilitychange", () => {
            if(document.visibilityState == "hidden"){
                document.title = "(σ｀д′)σ 专心学习,不要跑别的网站去!"
            }else{
                const currentTitle = this.currentTitle;
                document.title = "(*^▽^*)嘿!这就对了!    " + currentTitle;
                setTimeout(() => {
                document.title = currentTitle;
                }, 1000);
            }
        });
    },
    destroyed(){
        window.addEventListener('beforeunload', ()=> {
            localStorage.clear();
        })
    }
}
</script>

<style lang="less">
#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  
   
  
}
// 模态框
.selectmood{
    min-width: 300px;
    img{
        margin: 0px 5px;
        cursor: pointer;
    }
}

/* 滚动槽 */
  // 谷歌
  ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
  }
  ::-webkit-scrollbar-track {
      border-radius: 3px;
      background: rgba(0,0,0,0.06);
      -webkit-box-shadow: inset 0 0 3px rgba(0,0,0,0.08);
  }
  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background: rgba(236, 233, 233, 0.1);
      -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
  }

  // 火狐
  ::-moz-scrollbar {
      width: 6px;
      height: 6px;
  }
  ::-moz-scrollbar-track {
      border-radius: 3px;
      background: rgba(0,0,0,0.06);
      -moz-box-shadow: inset 0 0 3px rgba(0,0,0,0.08);
  }
  /* 滚动条滑块 */
  ::-moz-scrollbar-thumb {
      border-radius: 3px;
      background: rgba(236, 233, 233, 0.1);
      -moz-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
  }



</style>
