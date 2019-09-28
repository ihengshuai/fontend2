<template>
    <div class="messagewall">
        <div class="bg-cover issue hover" @click="showMsgModal"></div>
        <Icon type="md-refresh" class="refresh-message" @click="refresh()" />

        <!-- pc端留言效果 -->
        <div v-if="showNote" class="allMessageNote">
            <vue-drag-resize :isResizable="false"  v-for="(item, index) in allMessageNote" :key="index">
                <div class="note" :class="changeBG + Math.floor(Math.random() * 5 + 1)" :style="{'left':Math.random() * clientWidth + 'px', 'top': Math.random() * clientHeight + 'px'}">
                    <div class="nhead">{{item.date}}</div> 
                    <div class="nbody wes-3" >{{item.content}}</div> 
                    <div class="nfoot df-sb" >
                        <img :src="require('../../assets/leavemessage/avatar/'+item.avatar)" class="avatar"> 
                        <a href="javascript:;" rel="nofollow" target="_blank" class="username wes">{{item.username}}</a>
                    </div>
                </div>
            </vue-drag-resize>
        </div>

        <!-- mobile端留言效果 -->
        <div class="mobile-msg">
            <div class="each-msg" v-for="(item, index) in allMessageNote" :key="index" :floor-index="index + 1">
                <div class="top">
                    <div class="leftTop"><span>@</span>{{item.username}}</div>
                    <div class="rightTop">{{item.content}}</div>
                </div>
                <div class="bottom">
                    <div class="leftBottom">
                         <Avatar :src="require('../../assets/leavemessage/avatar/'+item.avatar)" />
                    </div>
                    <div class="rightBottom">{{item.date}}</div>
                </div>
            </div>
            <div class="each-msg notice">
                只随机展示15条留言哦~
            </div>
        </div>

        <!-- 留言模态框 -->
        <Modal :z-index="9999999" v-model="msgModal" width="500" :closable="false">
            <div style="width:100%;padding:50px 20px 10px 20px;">
                <el-form class="messageForm" size="large" :model="messageForm" ref="messageForm">
                    <el-form-item prop="username">
                        <el-input type="text" v-model="messageForm.username" placeholder="Name(必填)"></el-input>
                    </el-form-item>
                    <el-form-item prop="content">
                        <Input v-model="messageForm.content" type="textarea" :rows="4" placeholder="同道中人,理性留言...(必填)" />
                    </el-form-item>
                    <el-form-item prop="email">
                        <el-input type="email" v-model="messageForm.email"  placeholder="Email不会被公开显示"></el-input>
                    </el-form-item>
                    <el-form-item prop="qq">
                        <el-input type="qq" v-model="messageForm.qq"  placeholder="QQ不会被公开显示"></el-input>
                    </el-form-item>
                    <el-form-item prop="city">
                        <el-input type="city" v-model="messageForm.city"  placeholder="City不会被公开显示"></el-input>
                    </el-form-item>
                </el-form>

                <div slot="footer" style="border-top:none;text-align:center;">
                    <Button @click="leaveMessage" type="error" size="large" style="border:none;height:40px;width:100px;border-radius:20px;background: -webkit-linear-gradient(left,hsla(40,33%,60%,.99),#c1866a 100%);">留言</Button>
                </div>
            </div>
            <div slot="footer" style="border:none;display:none;">
                <Button type="error" size="large" long >Delete</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import VueDragResize from 'vue-drag-resize';
import "@/myplugin/Date"
export default {
    name:"messagewall",
    components:{
         VueDragResize,
    },
    data(){
        return{
            msgModal:false,
            messageForm:{
                username:"",
                content:"",
                avatar:"",
                date:"",
                email:"",
                qq:"",
                city:"",
            },
            changeBG:'note-bg',
            rotate:360,
            allMessageNote:[],
            showNote:false,
            clientWidth:"1000",
            clientHeight:"600"
        }
    },
    created(){
        this.getMessageNote();
        const that = this;
        window.onresize = function temp() {
            that.clientWidth = window.innerWidth - 200;
            that.clientHeight = window.innerHeight - 250;
        };
    },
    methods:{
        // 获取留言note
        getMessageNote(){
            this.$axios.get("http://localhost:3001/api/messagewall/all")
                .then(res => {
                    this.allMessageNote = res.data;
                    this.showNote = true;
                })
        },
        //   显示留言模态框
        showMsgModal(){
            this.msgModal = true;
        },
        // 留言
        leaveMessage(){
            if(!this.messageForm.username.trim().length){
                this.msgModal = false;
                this.$Modal.warning({
                    title:"警告",
                    content:"用户名不能为空",
                    onOk:()=>{
                        this.msgModal = true;
                    }
                })
            }else if(!this.messageForm.content.trim().length){
                this.msgModal = false;
                this.$Modal.warning({
                    title:"警告",
                    content:"留言内容不能为空",
                    onOk:()=>{
                        this.msgModal = true;
                    }
                })
            }else if(this.messageForm.content.length > 100){
                this.msgModal = false;
                this.$Modal.warning({
                    title:"警告",
                    content:"留言内容过长...",
                    onOk:()=>{
                        this.msgModal = true;
                    }
                })
            }else{
                const avatar = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg", "21.jpg", "22.jpg", "23.jpg", "24.jpg", "25.jpg", "26.jpg", "27.jpg", "28.jpg", "29.jpg", "30.jpg"];
                this.messageForm.avatar = avatar[Math.floor(Math.random() * avatar.length)];
                this.messageForm.date = new Date().format("yyyy-MM-dd HH:mm:ss")
                
                this.$axios.post("http://localhost:3001/api/messagewall/add", this.messageForm)
                    .then(res => {
                        this.allMessageNote = res.data;
                        this.msgModal = false;
                        this.messageForm.username = "";
                        this.messageForm.content = "";
                        this.messageForm.avatar = "";
                        this.messageForm.date = "";
                        this.messageForm.email = "";
                        this.messageForm.qq = "";
                        this.messageForm.city = "";
                    })
            }
        },
        // 刷新留言
        refresh(){
            $(".refresh-message").css("transform","rotate(" +this.rotate+ "deg)")
            this.rotate += 360;
            this.getMessageNote();
        }
    }
}
</script>

<style lang="less" scoped>
.messagewall{
    width: 100%;
    height: 92.5vh;
    z-index: 1;
    
    background-image: url(../../assets/imgs/wall.png);
    background-color: rgba(230, 170, 52, 0.3);
    overflow: hidden;
    
    .mobile-msg{
        display: none;
        width: 100%;
        padding: 100px 20px 150px 20px;
        // display: flex;

        .notice{
            text-align: center;
            line-height: 80px;
            color:#b96517;
            font-size: 16px;
            font-weight: 800;
        }
        .each-msg{
            position: relative;
            width: 100%;
            min-height: 80px;
            margin: 10px 0px;
            background-color: rgba(238, 238, 238, .5);
            border: 1px solid #bbb;
            border-radius: 5px;
            padding: 5px;

            .top{
                width: 100%;
                min-height: 50px;
                display: flex;
                .leftTop{
                    flex: 1;
                    min-width: 150px;
                    color: #b96517;
                    font-size: 13px;
                    font-weight: 700;
                }
                .rightTop{
                    flex: 1;
                    overflow: hidden;
                    text-indent: 2em;
                }
            }
            .bottom{
                width: 100%;
                height: 30px;
                display: flex;
                .leftBottom{
                    flex: 3;
                }
                .rightBottom{
                    text-align: right;
                    padding-top: 15px;
                    color: rgb(141, 141, 141);
                }
            }
        }
        .each-msg::after{
            content: attr(floor-index);
            position: absolute;
            display: block;
            width: 20px;
            height: 20px;
            text-align: center;
            left: -10px;
            top: 35px;
            transform: rotate(30deg);
            font-size: 14px;
            font-weight: 800;
            color: steelblue;
        }
    }

    // 刷新留言
    .refresh-message{
        font-size: 35px;
        position: absolute;
        right: 30px;
        top: 80px;
        z-index: 99999;
        color: #b96517;
        font-weight: 900;
        cursor: pointer;
        transition: all 1s;
    }

    // 发表留言
    .issue {
        width: 250px;
        height: 80px;
        background-image: url(../../assets/leavemessage/issue.png);
        position: absolute;
        left: 50%;
        top: 60px;
        cursor: pointer;
        -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        transform: translateX(-50%);
        -webkit-transition: opacity .5s;
        transition: opacity .5s;
        z-index: 2;
    }

    // 留言note
    .note {
        width: 235px;
        cursor: move;
        position: absolute;
        z-index: 1;
        max-height: 235px;
    }
    .note .nhead {
        width: 235px;
        height: 68px;
        padding: 45px 30px 0;
        font-family: Georgia;
        color: #999;
    }
    .note .nbody {
        width: 235px;
        line-height: 20px;
        padding: 0 15px 0 30px;
        word-wrap: break-word;
        font-size: 14px;
        background-position: -2px;
        color: #6f5a5a;
    }
    .note .nfoot {
        width: 235px;
        height: 72px;
        padding: 20px 20px 10px 30px;
    }
    .note .avatar, .note .moodpic img {
        width: 30px;
        height: 30px;
        object-fit: cover;
        border-radius: 50%;
    }
    .note .username {
        max-width: 150px;
        text-align: right;
        float: right;
        color: #333;
        font-size: 12px;
    }
    .wes {
        word-wrap: normal;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .note-bg1{
        .nhead{
            background-image: url(../../assets/leavemessage/bg1/note1_1.png);
        }
        .nbody{
            background-image: url(../../assets/leavemessage/bg1/note1_2.png);
        }
        .nfoot{
            background-image: url(../../assets/leavemessage/bg1/note1_3.png);
        }
    }
    .note-bg2{
        .nhead{
            background-image: url(../../assets/leavemessage/bg2/note2_1.png);
        }
        .nbody{
            background-image: url(../../assets/leavemessage/bg2/note2_2.png);
        }
        .nfoot{
            background-image: url(../../assets/leavemessage/bg2/note2_3.png);
        }
    }
    .note-bg3{
        .nhead{
            background-image: url(../../assets/leavemessage/bg3/note3_1.png);
        }
        .nbody{
            background-image: url(../../assets/leavemessage/bg3/note3_2.png);
        }
        .nfoot{
            background-image: url(../../assets/leavemessage/bg3/note3_3.png);
        }
    }
    .note-bg4{
        .nhead{
            background-image: url(../../assets/leavemessage/bg4/note4_1.png);
        }
        .nbody{
            background-image: url(../../assets/leavemessage/bg4/note4_2.png);
        }
        .nfoot{
            background-image: url(../../assets/leavemessage/bg4/note4_3.png);
        }
    }
    .note-bg5{
        .nhead{
            background-image: url(../../assets/leavemessage/bg5/note5_1.png);
        }
        .nbody{
            background-image: url(../../assets/leavemessage/bg5/note5_2.png);
        }
        .nfoot{
            background-image: url(../../assets/leavemessage/bg5/note5_3.png);
        }
    }

    @media screen and (max-width: 700px){
        .allMessageNote{
            display: none;
        }
        .mobile-msg{
            display: block;
        }
        
    }
}
@media screen and (max-width: 700px){
    .messagewall{
        overflow-y: scroll;
    }
}
</style>
