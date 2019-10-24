<template>
    <div class="vipcourse">
        <div class="wrapper" @click="appearSelectCourse()">
            <div class="hummingbird js-3dbox">
                <div class="body">
                <div class="back"></div>
                <div class="wings"></div>
                <div class="head">
                    <div class="nape"></div>
                    <div class="beak"></div>
                </div>
                </div>
                
                <div class="platform">尊敬的VIP,欢迎回家</div>
            </div>
            
            <!-- <div class="title">欢迎回家</div> -->
            <h1>
                <span>点</span>
                <span>击</span>
                <span>听</span>
                <span>VIP</span>
                <span>课程</span>
            </h1>
        </div>

        <!-- 选择课程观看模态框 -->
        <Modal v-model="selectCourseModal" :closable="false" :mask-closable="false">
            <p slot="header" style="color:#f60;">
                <span>请点击任一VIP课程进行学习</span>
            </p>
            <div style="text-align:left;font-size:15px;height:300px;overflow-y:scroll;">
                <div style="width:100%;height:170px;margin:8px 0px;cursor:pointer;" v-for="item in vipcourse" @click="goDestinationCourse(item)" :key="item.title">
                    <img width="100%" height="100%" :src="item.img" :alt="item.title">
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" long @click="cancelModal()">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { setTimeout } from 'timers';
import wsmLoading from "@/myplugin/Loading";
export default {
    name:"vipcourse",
    data(){
        return{
            selectCourseModal:false,
            vipcourse:[
                {img:require("../../assets/imgs/vip_htmlcourse.png"), title:"html5", url:"html5"},
                {img:require("../../assets/imgs/vip_csscourse.png"), title:"css", url:"css"},
                {img:require("../../assets/imgs/vip_javascriptcourse.png"), title:"javascript", url:"javascript"},
            ]
        }
    },
    created(){
        
    },
    methods:{
        // 去指定的课程
        goDestinationCourse(info){
            const isAuthorizated = this.$store.getters.isAuthorizated;
            wsmLoading.startLoading("正在加载,努力跳转中...");
            this.selectCourseModal = false;
            setTimeout(() => {
                if(!isAuthorizated){
                    wsmLoading.startLoading("加载失败Y(>_<、)Y");
                    setTimeout(() => {
                        wsmLoading.endLoading();
                        this.$Modal.confirm({
                            type:"error",
                            title:"警告",
                            content:"你还没有登录,请先登录账号! 是否现在去登录?",
                            okText:"登录",
                            cancelText:"取消",
                            onOk:()=>{
                                this.$store.commit("callback", "/home/vip/course")
                                this.$router.push("/login");
                            },
                            onCancel:()=>{
                                console.log("取消");
                            }
                        })
                    }, 500)
                }else{
                    const hasThisCourse = this.$store.getters.user[info.title];
                    if(hasThisCourse == "0"){
                        wsmLoading.startLoading("加载失败Y(>_<、)Y");
                        wsmLoading.endLoading();
                        this.$Modal.confirm({
                            title:"警告",
                            content:"你还没有购买此课程,请购买以后再观看!,是否立即购买?",
                            okText:"立即购买",
                            cancelText:"稍后购买",
                            onOk:()=>{
                                this.$router.push("/home/userinfo");
                            },
                            onCancel:()=>{
                                console.log("cancel");
                            }
                        })
                    }else{
                        if(info.url == "html5"){
                            this.$router.push({path:"/home/vip/course/" + info.url + "/play"});
                        }else if(info.url == "css"){
                            this.$router.push({path:"/home/vip/course/" + info.url + "/play"});
                        }else{
                            this.$router.push({path:"/home/vip/course/" + info.url + "/play"});
                        }
                        
                        wsmLoading.endLoading();
                    }
                }
            }, 1000)
        },
        // 调出选择课程模态框
        appearSelectCourse(){
            this.selectCourseModal = true;
        },
        // 取消模态框
        cancelModal(){
            this.selectCourseModal = false;
        }
    }
}
</script>
<style lang="less" scoped>
.vipcourse{
    color:teal;
    width: 100%;
    height: 92vh;

*, *:after, *:before {
  box-sizing: border-box;
  -webkit-backface-visibility: visible;
          backface-visibility: visible;
}

h1 {
  font-size: 2.8rem;
  position: absolute;
  text-transform: uppercase;
  color: #900048;
  white-space: nowrap;
  letter-spacing: 0.1em;
  bottom: 25%;
}

span:nth-child(1) {
  animation: blink 1s steps(1, start) 0.33s infinite;
}

span:nth-child(2) {
  animation: blink 1s steps(1, start) 0.66s infinite;
}

span:nth-child(3) {
  animation: blink 1s steps(1, start) 0.33s infinite;
}

span:nth-child(4) {
  animation: blink 1s steps(1, start) 0.66s infinite;
}

span:nth-child(5) {
  animation: blink 1s steps(1, start) 0.33s infinite;
}

span:nth-child(6) {
  animation: blink 1s steps(1, start) 0.66s infinite;
}

@keyframes blink {
  33% {
    color: #FF4057;
  }
  66% {
    color: #FF8260;
  }
}





.wrapper {
  min-width: 100vw;
  min-height: 92.5vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #111, #355);
  font-family: Lora, serif;
  overflow: hidden;
}

.hummingbird {
  margin-top: -150px;
  width: 200px;
  height: 200px;
  -webkit-perspective: 60rem;
          perspective: 60rem;
  -webkit-transform-style: preserve-3d;
          transform-style: preserve-3d;
  transition: -webkit-transform 0.2s ease-out;
  transition: transform 0.2s ease-out;
  transition: transform 0.2s ease-out, -webkit-transform 0.2s ease-out;
  -webkit-transform-origin: center;
          transform-origin: center;
  pointer-events: none;
}
@media (max-width: 768px) {
  .hummingbird {
    -webkit-transform: scale(0.8);
            transform: scale(0.8);
  }
}
.hummingbird .body {
  height: 100%;
  -webkit-transform-style: preserve-3d;
          transform-style: preserve-3d;
  -webkit-transform: rotateY(0deg);
          transform: rotateY(0deg);
  -webkit-animation: rotate 15s linear infinite;
          animation: rotate 15s linear infinite;
}
@-webkit-keyframes rotate {
  100% {
    -webkit-transform: rotateY(360deg);
            transform: rotateY(360deg);
  }
}
@keyframes rotate {
  100% {
    -webkit-transform: rotateY(360deg);
            transform: rotateY(360deg);
  }
}
.hummingbird .body:before, .hummingbird .body:after {
  content: '';
  display: block;
  width: 70px;
  height: 100%;
  position: absolute;
  left: 50%;
  -webkit-transform-origin: top right;
          transform-origin: top right;
  background: linear-gradient(to bottom, rgba(119, 238, 180, 0.8), rgba(83, 169, 197, 0.8), transparent);
}
.hummingbird .body:before {
  -webkit-transform: rotateZ(30deg) rotateY(30deg);
          transform: rotateZ(30deg) rotateY(30deg);
  -webkit-clip-path: polygon(0 0, 100% 10%, 100% 100%);
          clip-path: polygon(0 0, 100% 10%, 100% 100%);
}
.hummingbird .body:after {
  -webkit-transform: rotateZ(30deg) rotateY(-30deg);
          transform: rotateZ(30deg) rotateY(-30deg);
  -webkit-clip-path: polygon(0 0, 100% 10%, 100% 100%);
          clip-path: polygon(0 0, 100% 10%, 100% 100%);
}
.hummingbird .body .back {
  width: 60px;
  height: 100%;
  position: absolute;
  background: linear-gradient(to bottom, rgba(119, 238, 180, 0.8), rgba(83, 169, 197, 0.8), transparent);
  -webkit-transform-style: preserve-3d;
          transform-style: preserve-3d;
  -webkit-clip-path: polygon(0 0, 100% 0, 50% 100%);
          clip-path: polygon(0 0, 100% 0, 50% 100%);
  -webkit-transform: rotateY(90deg) rotateX(-13deg) translateZ(55px) translateY(-45px);
          transform: rotateY(90deg) rotateX(-13deg) translateZ(55px) translateY(-45px);
}
.hummingbird .body .wings {
  position: absolute;
  left: 35%;
  top: 40px;
  height: 100%;
  -webkit-transform-style: preserve-3d;
          transform-style: preserve-3d;
}
.hummingbird .body .wings:before, .hummingbird .body .wings:after {
  content: '';
  display: block;
  width: 70px;
  height: 100%;
  position: absolute;
  left: 50%;
  top: -25px;
  -webkit-transform-origin: top center;
          transform-origin: top center;
  background: linear-gradient(to top, #d46f30, transparent);
}
.hummingbird .body .wings:before {
  -webkit-clip-path: polygon(100% 0, 100% 100%, 0 0);
          clip-path: polygon(100% 0, 100% 100%, 0 0);
  -webkit-animation: beating-left 2s ease-in-out infinite;
          animation: beating-left 2s ease-in-out infinite;
}
@-webkit-keyframes beating-left {
  0% {
    -webkit-transform: rotateZ(-75deg) rotateY(-10deg) translateZ(30px) rotateX(0deg);
            transform: rotateZ(-75deg) rotateY(-10deg) translateZ(30px) rotateX(0deg);
  }
  50% {
    -webkit-transform: rotateZ(-75deg) rotateY(-10deg) translateZ(30px) rotateX(180deg);
            transform: rotateZ(-75deg) rotateY(-10deg) translateZ(30px) rotateX(180deg);
  }
  100% {
    -webkit-transform: rotateZ(-75deg) rotateY(-10deg) translateZ(30px) rotateX(0deg);
            transform: rotateZ(-75deg) rotateY(-10deg) translateZ(30px) rotateX(0deg);
  }
}
@keyframes beating-left {
  0% {
    -webkit-transform: rotateZ(-75deg) rotateY(-10deg) translateZ(30px) rotateX(0deg);
            transform: rotateZ(-75deg) rotateY(-10deg) translateZ(30px) rotateX(0deg);
  }
  50% {
    -webkit-transform: rotateZ(-75deg) rotateY(-10deg) translateZ(30px) rotateX(180deg);
            transform: rotateZ(-75deg) rotateY(-10deg) translateZ(30px) rotateX(180deg);
  }
  100% {
    -webkit-transform: rotateZ(-75deg) rotateY(-10deg) translateZ(30px) rotateX(0deg);
            transform: rotateZ(-75deg) rotateY(-10deg) translateZ(30px) rotateX(0deg);
  }
}
.hummingbird .body .wings:after {
  -webkit-clip-path: polygon(100% 0, 100% 100%, 0 0);
          clip-path: polygon(100% 0, 100% 100%, 0 0);
  -webkit-animation: beating-right 2s ease-in-out infinite;
          animation: beating-right 2s ease-in-out infinite;
}
@-webkit-keyframes beating-right {
  0% {
    -webkit-transform: rotateZ(-75deg) rotateY(10deg) translateZ(-30px) rotateX(0deg);
            transform: rotateZ(-75deg) rotateY(10deg) translateZ(-30px) rotateX(0deg);
  }
  50% {
    -webkit-transform: rotateZ(-75deg) rotateY(10deg) translateZ(-30px) rotateX(-180deg);
            transform: rotateZ(-75deg) rotateY(10deg) translateZ(-30px) rotateX(-180deg);
  }
  100% {
    -webkit-transform: rotateZ(-75deg) rotateY(10deg) translateZ(-30px) rotateX(0deg);
            transform: rotateZ(-75deg) rotateY(10deg) translateZ(-30px) rotateX(0deg);
  }
}
@keyframes beating-right {
  0% {
    -webkit-transform: rotateZ(-75deg) rotateY(10deg) translateZ(-30px) rotateX(0deg);
            transform: rotateZ(-75deg) rotateY(10deg) translateZ(-30px) rotateX(0deg);
  }
  50% {
    -webkit-transform: rotateZ(-75deg) rotateY(10deg) translateZ(-30px) rotateX(-180deg);
            transform: rotateZ(-75deg) rotateY(10deg) translateZ(-30px) rotateX(-180deg);
  }
  100% {
    -webkit-transform: rotateZ(-75deg) rotateY(10deg) translateZ(-30px) rotateX(0deg);
            transform: rotateZ(-75deg) rotateY(10deg) translateZ(-30px) rotateX(0deg);
  }
}
.hummingbird .body .head:before, .hummingbird .body .head:after {
  content: '';
  display: block;
  width: 50px;
  height: 30%;
  position: absolute;
  left: 55%;
  top: -45px;
  -webkit-transform-origin: top right;
          transform-origin: top right;
  background: linear-gradient(to bottom, #77eeb4, transparent);
}
.hummingbird .body .head:before {
  -webkit-transform: rotateZ(0deg) rotateY(40deg);
          transform: rotateZ(0deg) rotateY(40deg);
  -webkit-clip-path: polygon(0 20%, 100% 0, 100% 100%);
          clip-path: polygon(0 20%, 100% 0, 100% 100%);
}
.hummingbird .body .head:after {
  -webkit-transform: rotateZ(0deg) rotateY(-40deg);
          transform: rotateZ(0deg) rotateY(-40deg);
  -webkit-clip-path: polygon(0 20%, 100% 0, 100% 100%);
          clip-path: polygon(0 20%, 100% 0, 100% 100%);
}
.hummingbird .body .head .nape:after {
  content: '';
  display: block;
  width: 50px;
  height: 35px;
  position: absolute;
  top: 0%;
  background: linear-gradient(to bottom, rgba(119, 238, 180, 0.8), rgba(83, 169, 197, 0.8), transparent);
  -webkit-transform-origin: bottom center;
          transform-origin: bottom center;
  -webkit-clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  -webkit-transform: rotateY(90deg) rotateX(-73deg) translateZ(-37px) translateY(-110px);
          transform: rotateY(90deg) rotateX(-73deg) translateZ(-37px) translateY(-110px);
}
.hummingbird .body .head .beak:before, .hummingbird .body .head .beak:after {
  content: '';
  display: block;
  width: 10px;
  height: 60%;
  position: absolute;
  left: 75%;
  top: -45px;
  -webkit-transform-origin: top right;
          transform-origin: top right;
  background: linear-gradient(to top, #d1c6da, transparent);
}
.hummingbird .body .head .beak:before {
  -webkit-transform: rotateZ(-105deg) rotateY(25deg);
          transform: rotateZ(-105deg) rotateY(25deg);
  -webkit-clip-path: polygon(0 0, 100% 1%, 100% 100%);
          clip-path: polygon(0 0, 100% 1%, 100% 100%);
}
.hummingbird .body .head .beak:after {
  -webkit-transform: rotateZ(-105deg) rotateY(-25deg);
          transform: rotateZ(-105deg) rotateY(-25deg);
  -webkit-clip-path: polygon(0 0, 100% 1%, 100% 100%);
          clip-path: polygon(0 0, 100% 1%, 100% 100%);
}
.hummingbird .platform {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: absolute;
  bottom: 0px;
  -webkit-transform: rotateX(90deg) translateZ(-100px);
          transform: rotateX(90deg) translateZ(-100px);
  color: #FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 8px dashed #53a9c5;
  box-shadow: 0 0 50px 0px #53a9c5;
  font-weight: bold;
}

.title {
  color: #FFF;
  position: absolute;
  font-family: serif;
  font-size: 2.8rem;
  bottom: 25%;
  pointer-events: none;
}

}
</style>