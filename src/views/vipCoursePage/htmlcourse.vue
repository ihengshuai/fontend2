<template>
    <div v-if="showPage" class="htmlcourse">
        <!-- 右侧固定弹性布局 -->
        <div class="wrapper">
            <!-- 左侧区域 -->
            <div class="left-container">
                <!-- 播放器 -->
                <div class="video-container">
                    <!-- 视频标题等等 -->
                    <div class="title">
                        <span class="video-index">第{{currrentVideoIndex + 1}}集</span>
                        <span class="content">HTML教程 <i>:</i><i>{{currentVideo.title}}</i></span>
                    </div>
                    <!-- 视频播放器 -->
                    <video-player v-if="showVideoPlayer" class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
                    <!-- 视频的点评等等 -->
                    <div class="foot-comment">
                        <!-- 分享功能 -->
                        <div class="share" style="cursor:pointer;">
                            <social-sharing :url="'http://localhost:8080/home/vip/course/html5/play?seid=' + currentVideo._id"
                                :title="'[前端教程 | by卫恒帅], ' + currentVideo.title"
                                description="前端教程"
                                :quote="'快来学习前端教程,内容丰富,你值得学习.' + currentVideo.title"
                                hashtags="vuejs,javascript,framework"
                                twitter-user="vuejs"
                                inline-template>
                                <div >
                                    <network  network="weibo">
                                        分享到微博
                                    </network>
                                </div>
                            </social-sharing>
                        </div>

                        <!-- 好评率 -->
                        <div class="comment-remark">

                        </div>

                        <!-- 点赞或反对 -->
                        <div class="pointer-like-or-dislike"></div>
                    </div>
                </div>
                <!-- 移动端选择集数 -->
                <div class="mobile-select-video">
                    <p class="select-video-btn" @click="mobileSelectBtn()">选择集数播放:</p>
                    <div class="mobile-play-list">
                        <ul>
                            <li class="mobile-playlist-li" @click="playSelectedVideo(item,index)" v-for="(item, index) in allVideos" :key="item._id">
                                <div class="left-poster">
                                    <img :src="require('../../assets/vipcourse/html5/' + item.poster)" alt="">
                                </div>
                                <div class="right-title">
                                    <p>第{{parseInt(index) + 1}}集 {{item.title}}</p>
                                    <p class="playing" style="display:none;">
                                        <Icon type="ios-stats" />正在播放
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- video概要 -->
                <div class="videooutline">
                    <!-- 海报 -->
                    <div class="video-poster"></div>
                    <!-- 简介 -->
                    <div class="content">
                        <h3>课程:HTML5教程</h3>
                        <h4>类型:VIP课程</h4>
                        <h5 class="playcount">{{100}}次播放</h5>
                        <p>木老师的那份懒得管你里的你发过来不是减肥.都看不惯可上单吧木老师的那份懒得管你里的你发过来不是减肥.都看不惯可上单吧木老师的那份懒得管你里的你发过来不是减肥.都看不惯可上单吧木老师的那份懒得管你里的你发过来不是减肥.都看不惯可上单吧</p>
                    </div>
                </div>
                <!-- 评论区域 -->
                <div class="comment-area">
                    <!-- 评论留言 -->
                    <div class="leavewords">
                        <Row>
                            <Col span="2" class="comment-useravatar">
                                <Tooltip placement="top">
                                    <Avatar class="useravatar-message" icon="ios-person" :src="require('../../assets/avatar/' + currentUser.avatar)" size="large" />
                                    <div slot="content">
                                        <p><span style="color:#5cadff;">大名:</span> {{currentUser.username}}</p>
                                        <p><span style="color:#5cadff;">邮箱:</span> {{currentUser.email}}</p>
                                        <p><span style="color:#5cadff;">手机:</span> {{currentUser.phone}}</p>
                                    </div>
                                </Tooltip>
                                
                            </Col>
                            <Col span="20">
                                <Input type="textarea" v-model="editingMessage" placeholder="请文明留言..." />
                            </Col>
                            <Col span="2" style="padding:0px 5px;height:50px;">
                                <Button @click="leaveMessage()" style="text-align:center;height:100%;background:#00a1d6;color:#fff;">发表留言</Button>
                            </Col>
                            
                        </Row>
                    </div>
                    <!-- 所有留言 -->
                    <div class="allcomments">
                        <h3>所有留言<span style="color:#2db7f5;">({{allMessagesCount}})</span></h3>
                        <div class="notBodyMessage" v-if="!allMessagesCount">
                            (╥╯^╰╥) 还没有一个宝宝留言, 去抢第一个沙发! （〜^㉨^)〜
                        </div>
                        <div class="each-comment-box" v-if="allMessagesCount">
                            <Card class="comment-card" style="" v-for="(item, index) in allMessages" :key="index">
                                <p slot="title" style="height:25px;line-height:25px;">
                                    <!-- <span>{{1}}#</span> -->
                                    <Avatar :src="require('../../assets/avatar/' + item.avatar)" size="small"></Avatar>
                                    <span name="username" style="color:#ff9900;width:200px;overflow:hidden;padding:0px 2px;">{{item.username}}</span>
                                    <i style="font-size:12px;position:absolute;right:20px;font-style:normal;color:#ccc;">{{item.messageTime}}</i>
                                </p>
                                <div class="content" style="height:100px;">
                                    <div style="text-indent:2em;font-size:12px;overflow:hidden;">{{item.comment}}</div>
                                    <p class="delself" >
                                        <span class="which-floor">#{{parseInt(index) + 1}}楼</span>
                                        <span class="delMessage" @click="delSelfMessage(item)" v-if="currentUser.username == item.username">删除</span>
                                    </p>
                                </div>
                                
                            </Card>
                            
                        </div>
                        <!-- 分页 -->
                        <Row class="pc-paginations">
                            <Col span="24" style="text-align:right;padding:10px;">
                                <el-pagination
                                    v-if='paginations.total > 0'
                                    :page-sizes="paginations.page_sizes"
                                    :page-size="paginations.page_size"
                                    :layout="paginations.layout"
                                    :total="paginations.total"
                                    :current-page.sync='paginations.page_index'
                                    @current-change='handleCurrentChange'
                                    @size-change='handleSizeChange'>
                                </el-pagination>
                            </Col>
                        </Row>
                        <!-- 移动端分页 -->
                        <Row class="mobile-paginations">
                            <Col span="24" style="text-align:right;padding:10px 0px;">
                                <el-pagination
                                    style="width:80vw;height:80px;"
                                    v-if='paginations.total > 0'
                                    :page-sizes="paginations.page_sizes"
                                    :page-size="paginations.page_size"
                                    :total="paginations.total"
                                    layout="prev, pager, next"
                                    @current-change='handleCurrentChange'
                                    @size-change='handleSizeChange'>
                                </el-pagination>
                            </Col>
                        </Row>
                    </div>
                </div>
                
            </div>
            <!-- 右侧区域 -->
            <div class="right-container">
                <!-- 课程集数等具体情况 -->
                <div class="selectvideo">
                    <div class="videocount">
                        <Row>
                            <Col span="3">
                                <span style="font-size:14px;">选集</span>
                            </Col>
                            <Col span="2">
                                <Icon id="selectVideoIndexBtn" @click="selectVideoIndex()" size="30" style="font-weight:900;cursor:pointer;color:#00a1d6;" type="ios-list" />
                            </Col>
                            <Col span="19" style="text-align:right;">
                                {{currrentVideoIndex + 1}}/{{allVideos.length}}
                            </Col>
                        </Row>
                    </div>
                    <!-- 播放详情列表 -->
                    <div class="playlist">
                        <div id="playlist-detail" style="width:100%;" v-if="showsspecificvideo">
                            <div class="specilvideo" @click="playSelectedVideo(item,index)" v-for="(item, index) in allVideos" :key="item._id">
                                <Icon class="ios-play" type="ios-play" style="font-size:15px;display:none;" />
                                第{{index + 1}}集 <i class="coursetype">HTML教程</i> <i>{{item.title}}</i>
                            </div>
                        </div>

                        <div class="allvideocount" id="playlist-button" v-if="!showsspecificvideo">
                            <Button class="playlist-small-btn" @click="playSelectedVideo(item, index)" v-for="(item, index) in allVideos" :key="item._id">{{index + 1}}</Button>
                        </div>
                    </div>

                </div>
                <!-- 相关视频 -->
                <div class="aboutvideo">
                    <h3>相关视频推荐</h3>
                    <div class="about-list">
                        <ul>
                            <li @click="toAboutCourse(item, index)" v-for="(item, index) in aboutcourse" :key="index">
                                <div class="about-poster">
                                    <img :src="aboutcoursePoster[index]" alt="">
                                </div>
                                <div class="about-title">
                                    {{item.title}}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        

        
    </div>
</template>
<script>
import "@/myplugin/Date";
import { setTimeout } from 'timers';
import { parse } from 'path';
import wsmLoading from "@/myplugin/Loading";
export default {
    name:"htmlcourse",
    components:{
        
    },
    data(){
        return{
            showPage:true,
            showsspecificvideo:true,
            showVideoPlayer:false,
            // 视频播放器配置
            playerOptions: {
                playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [{
                    type: 'video/mp4',
                    src: "" //视频url地址
                }],
                poster: "", //你的封面地址
                // width: document.documentElement.clientWidth,
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: false,
                    fullscreenToggle: true  //全屏按钮
                }
            },
            allVideos:[],
            currentVideo:[],
            currrentVideoIndex:"",
            allMessages:[],
            allMessagesCount:"",
            editingMessage:"",
            currentUser:[],
            allTableData:[],
            paginations: {
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 6, // 1页显示多少条
                page_sizes: [6, 10, 16, 20], //每页显示多少条
                layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
            },
            aboutcourse:[],
            aboutcoursePoster:[],
        }
    },
    created(){
        this.isIllegality();
        this.getAllVideos();
        this.getAllMessages();
        this.getAboutCourse();
        this.currentUser = this.$store.getters.user;
    },
    methods:{
        // 获取视频
        getAllVideos(){
            // if(this.$route.query.seid){
            const createdVideo = {key:"html"};
            var search_seid = this.$route.query.seid ? this.$route.query.seid : "ssss";
            createdVideo._id = search_seid;
            this.$axios.post("http://localhost:3001/api/vip/course/seid", createdVideo)
                .then(res => {
                    this.playerOptions.sources[0].src = require("../../assets/vipcourse/html5/" + res.data.src);
                    this.playerOptions.poster = require("../../assets/vipcourse/html5/" + res.data.poster);
                    this.currentVideo = res.data;
                    this.currrentVideoIndex = parseInt(res.data.index);
                    this.showVideoPlayer = true;
                    this.$router.push({path:"/home/vip/course/html5/play",query:{seid:res.data._id}})
                    setTimeout(() => {
                        $(".mobile-playlist-li .right-title .playing").fadeOut("fast");
                        $(".mobile-playlist-li").eq(res.data.index).children(".right-title").children(".playing").fadeIn("slow");
                        $(".mobile-playlist-li").css({"background":"#f3f2f2","color":"#515a6e"}).eq(res.data.index).css({"background":"#fff","color":"rgb(45, 183, 245)"});
                        $("#playlist-detail").children(".specilvideo").css({"color":"#666","background":"#f3f2f2"}).eq(res.data.index).css({"color":"#2db7f5","background":"#fff"})
                        $("#playlist-detail").children(".specilvideo").children(".ios-play").fadeOut("fast")
                        $("#playlist-detail").children(".specilvideo").eq(res.data.index).children(".ios-play").fadeIn("slow");
                        $("#playlist-button").children(".playlist-small-btn").css({"background":"#fff","color":"#515a6e"});
                        $("#playlist-button").children(".playlist-small-btn").eq(res.data.index).css({"background":"#2db7f5","color":"#fff"});
                    }, 10)
                })
            // }
            this.$axios.get("http://localhost:3001/api/vip/course/html/all")
                    .then(res => {
                        this.allVideos = res.data;
                    })
        },
        // 获取相关课程
        getAboutCourse(){
            this.$axios.get("http://localhost:3001/api/vip/course/about/all")
                    .then(res => {
                        this.aboutcourse = res.data;
                        this.aboutcoursePoster[0] = require("../../assets/vipcourse/html5/" + res.data[0].poster);
                        this.aboutcoursePoster[1] = require("../../assets/vipcourse/html5/" + res.data[1].poster);
                        this.aboutcoursePoster[2] = require("../../assets/vipcourse/css/" + res.data[2].poster);
                        this.aboutcoursePoster[3] = require("../../assets/vipcourse/css/" + res.data[3].poster);
                        this.aboutcoursePoster[4] = require("../../assets/vipcourse/javascript/" + res.data[4].poster);
                        this.aboutcoursePoster[5] = require("../../assets/vipcourse/javascript/" + res.data[5].poster);
                    })
        },
        // 点击相关推荐课程
        toAboutCourse(item, index){
            if(index >= 0 && index <= 1){
                if(!this.$store.getters.isAuthorizated || this.$store.getters.user["html5"] == "0"){
                    this.$Modal.warning({title:"访问错误",content:"对不起你没有权限,请购买此课程后再来学习,谢谢~"});
                }else{
                    this.$router.push({path:"/home/vip/course/html5/play",query:{seid:item._id}})
                }
            }else if(index >= 2 && index <= 3){
                if(!this.$store.getters.isAuthorizated || this.$store.getters.user["css"] == "0"){
                    this.$Modal.warning({title:"访问错误",content:"对不起你没有权限,请购买此课程后再来学习,谢谢~"});
                }else{
                    this.$router.push({path:"/home/vip/course/css/play",query:{seid:item._id}})
                }
            }else{
                if(!this.$store.getters.isAuthorizated || this.$store.getters.user["javascript"] == "0"){
                    this.$Modal.warning({title:"访问错误",content:"对不起你没有权限,请购买此课程后再来学习,谢谢~"});
                }else{
                    this.$router.push({path:"/home/vip/course/javascript/play",query:{seid:item._id}})
                }
            }
        },
        // 播放指定视频
        playSelectedVideo(info, index){
            this.currentVideo = info;
            this.playerOptions.sources[0].src = require("../../assets/vipcourse/html5/" + info.src);
            this.playerOptions.poster = require("../../assets/vipcourse/html5/" + info.poster);
            this.currrentVideoIndex = index;
            this.$router.push({path:"/home/vip/course/html5/play",query:{seid:info._id}})
            $(".mobile-playlist-li .right-title .playing").fadeOut("fast");
            $(".mobile-playlist-li").eq(index).children(".right-title").children(".playing").fadeIn("slow");
            $(".mobile-playlist-li").css({"background":"#f3f2f2","color":"#515a6e"}).eq(index).css({"background":"#fff","color":"rgb(45, 183, 245)"});
            $("#playlist-detail").children(".specilvideo").css({"color":"#666","background":"#f3f2f2"}).eq(index).css({"color":"#2db7f5","background":"#fff"})
            $("#playlist-detail").children(".specilvideo").children(".ios-play").fadeOut("fast")
            $("#playlist-detail").children(".specilvideo").eq(index).children(".ios-play").fadeIn("slow");
            $("#playlist-button").children(".playlist-small-btn").css({"background":"#fff","color":"#515a6e"});
            $("#playlist-button").children(".playlist-small-btn").eq(index).css({"background":"#2db7f5","color":"#fff"});
        },
        // 选择集数
        selectVideoIndex(){
            const index = this.currrentVideoIndex;
            this.$router.push({path:"/home/vip/course/html5/play",query:{seid:this.currentVideo._id}})
            if(this.showsspecificvideo == true){
                this.showsspecificvideo = false;
                setTimeout(() => {
                    $("#selectVideoIndexBtn").css({'transform':'rotate('+ 90 +'deg)',"color":"#ff9900"})
                    $("#playlist-button").children(".playlist-small-btn").css({"background":"#fff","color":"#515a6e"});
                    $("#playlist-button").children(".playlist-small-btn").eq(index).css({"background":"#2db7f5","color":"#fff"});
                }, 1)
            }else{
                this.showsspecificvideo = true;
                
                setTimeout(() => {
                    $("#selectVideoIndexBtn").css({'transform':'rotate('+ 0 +'deg)',"color":"#00a1d6"})
                    $("#playlist-detail").children(".specilvideo").css({"color":"#666","background":"#f3f2f2"}).eq(index).css({"color":"#2db7f5","background":"#fff"})
                    $("#playlist-detail").children(".specilvideo").children(".ios-play").fadeOut("fast");
                    $("#playlist-detail").children(".specilvideo").eq(index).children(".ios-play").fadeIn("slow");
                }, 1)
            }
        },
        // 移动端选择集数按钮
        mobileSelectBtn(){
            const display = $(".mobile-select-video").children(".mobile-play-list").css('display');
            if(display == "block"){
                $(".mobile-select-video").children(".mobile-play-list").css({'transform':'translateY('+ -440 +'px)','display':'none'})
            }else{
                $(".mobile-select-video").children(".mobile-play-list").css({'transform':'translateY('+ 0 +'px)','display':'block'})
            }
        },
        // 留言
        leaveMessage(){
            const currentMessage = this.editingMessage.trim();
            if(currentMessage.length >= 6 && currentMessage.length <= 85){
                const sensitiveWords = ["操", "操你妈", "爹", "鸡巴", "日尼玛", "日你妈", "你妈", "傻逼", "煞笔", "shabi", "傻屌", "屌丝", "屌", "屄", "草泥马", "泥马", "吃屎", "屎", "尿", "我儿", "孙子", "鸡巴毛", "踏马", "不要脸", "妈妈被草", "妈妈被日", "轮奸", "奸", "麻麻被操", "被草", "被操", "摁在床上", "床上", "蹂躏", "欠日", "欠操", "死爹妈", "死", ];
                var flag = true;
                sensitiveWords.forEach(item => {
                    if(currentMessage.indexOf(item) != -1){
                        flag = false;
                        return;
                    }
                })
                wsmLoading.startLoading("正在检测留言内容,请稍候...")
                setTimeout(() => {
                    if(!flag){
                        wsmLoading.endLoading();
                        this.$Modal.warning({
                            title:"警告",
                            content:"检测出有敏感词汇,请您文明留言..."
                        })
                    }else{
                        wsmLoading.startLoading("检测成功,正在留言请稍候...")
                        const messageInfo = {
                            username:this.$store.getters.user.username,
                            avatar:this.$store.getters.user.avatar,
                            comment:this.editingMessage
                        }
                        this.$axios.post("http://localhost:3001/api/vip/course/html/message/add", messageInfo)
                                .then(res => {
                                    wsmLoading.endLoading();
                                    this.$Message.success("留言成功");
                                    this.editingMessage = "";
                                    setTimeout(() => {
                                        this.getAllMessages();
                                    }, 1000)
                                })
                    }
                }, 1000)
                
                
            }else{
                this.$Modal.warning({
                    title:"警告",
                    content:"留言内容不能小于6大于85个字符,请重新留言..."
                })
            }
        },
        // 删除自己的留言
        delSelfMessage(info){
            this.$Modal.confirm({
                title:"温馨提示",
                content:"你确定要删除这一条留言吗?不可撤销是否继续?",
                okText:"删除",
                cancelText:"取消",
                onOk:()=>{
                    const nowDate = new Date().getTime();
                    const leaveDate = new Date(info.messageTime).getTime();
                    if(parseInt(nowDate - leaveDate) > 259200000){
                        this.$Message.error("您无法删除三天前的留言~");
                    }else{
                        this.$axios.post("http://localhost:3001/api/vip/course/html/message/del", {
                            _id : info._id
                        }).then(res => {
                            this.getAllMessages();
                            this.$Message.success("删除成功");
                        })
                    }
                },
                onCancel:()=>{
                    console.log("cancel")
                }
            })
        },
        // 获取所有的留言
        getAllMessages(){
            this.$axios.get("http://localhost:3001/api/vip/course/html/message/all")
                    .then(res => {
                        this.allMessagesCount = res.data.length;
                        this.allMessages = res.data;
                        this.allTableData = res.data;
                        this.setPaginations();
                    })
        },
        // 检测是否非法进入
        isIllegality(){
            const courseType = this.$route.path.trim().split("/")[4];
            if((!this.isAuthorizated && this.$store.getters.user == null) || this.$store.getters.user[courseType] == "0"){
                this.showPage = false;
                this.$Modal.confirm({
                    title:"出错了",
                    content:"访问错误,没有权限",
                    onOk:()=>{
                        this.$router.push("/")
                    },
                    onCancel:()=>{
                        this.$router.push("/")
                    }
                })
            }
        },
        // 设置当前页
        handleCurrentChange(page) {
            // 获取当前页
            let sortnum = this.paginations.page_size * (page - 1);
            let table = this.allTableData.filter((item, index) => {
                return index >= sortnum;
            });
            // 设置默认分页数据
            this.allMessages = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
            this.allMessages = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        // 改变每页条数
        handleSizeChange(page_size) {
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.allMessages = this.allTableData.filter((item, index) => {
                return index < page_size;
            });
        },
        // 设置的分页
        setPaginations() {
            // 总页数
            this.paginations.total = this.allTableData.length;
            this.paginations.page_index = 1;
            this.paginations.page_size = 6;
            // 设置默认分页数据
            this.allMessages = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
    },
    watch:{
        $route(from,to){
            if(from.path == to.path){
                const createdVideo = {key:"html"};
                createdVideo._id = this.$route.query.seid;
                this.$axios.post("http://localhost:3001/api/vip/course/seid", createdVideo)
                    .then(res => {
                        this.playerOptions.sources[0].src = require("../../assets/vipcourse/html5/" + res.data.src);
                        this.playerOptions.poster = require("../../assets/vipcourse/html5/" + res.data.poster);
                        this.currentVideo = res.data;
                        this.currrentVideoIndex = parseInt(res.data.index);
                        this.showVideoPlayer = true;

                        setTimeout(() => {
                            $(".mobile-playlist-li .right-title .playing").fadeOut("fast");
                            $(".mobile-playlist-li").eq(res.data.index).children(".right-title").children(".playing").fadeIn("slow");
                            $(".mobile-playlist-li").css({"background":"#f3f2f2","color":"#515a6e"}).eq(res.data.index).css({"background":"#fff","color":"rgb(45, 183, 245)"});
                            $("#playlist-detail").children(".specilvideo").css({"color":"#666","background":"#f3f2f2"}).eq(res.data.index).css({"color":"#2db7f5","background":"#fff"})
                            $("#playlist-detail").children(".specilvideo").children(".ios-play").fadeOut("fast")
                            $("#playlist-detail").children(".specilvideo").eq(res.data.index).children(".ios-play").fadeIn("slow");
                            $("#playlist-button").children(".playlist-small-btn").css({"background":"#fff","color":"#515a6e"});
                            $("#playlist-button").children(".playlist-small-btn").eq(res.data.index).css({"background":"#2db7f5","color":"#fff"});
                        }, 10)
                    })
            }
        }
    }
}
</script>
<style lang="less" scoped>
.htmlcourse{
    width: 100%;
    // width: 100vw;
    padding: 18px 130px;
    
    .wrapper{
        width: 100%;
        display: flex;

        // 左侧区域
        .left-container{
            flex:1;

            // 视频播放区域
            .video-container{
                width: 100%;
                border: 1px solid rgb(27, 26, 26);
                border-radius: 5px;

                // 视频播放器标题
                .title{
                    width: 100%;
                    height: 45px;
                    line-height: 45px;
                    color:#fff;
                    padding: 0px 20px;
                    font-size: 15px;
                    background-color: rgb(32, 31, 31);

                    .video-index{
                        padding: 0px 10px;
                    }
                    .content{
                        padding: 0px 10px;
                        i{
                            padding: 0px 5px;
                            font-style: normal;
                        }
                    }
                }

                // 视频下方点评分享之类
                .foot-comment{
                    width: 100%;
                    height: 45px;
                    background-color: rgb(15, 15, 15);
                    color:#fff;
                    line-height: 45px;
                    padding: 0px 10px;

                    @media screen and (max-width: 500px){
                        .share{
                            #icon-weibo-svg{
                                display: none;
                            }
                        }
                    }
                    

                }
            }

            // 移动端选择集数
            .mobile-select-video{
                width: 100%;
                margin-top: 10px;
                display: none;

                .select-video-btn{
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    font-size: 14px;
                    color: rgb(245, 235, 235);
                    cursor: pointer;
                    border-radius: 3px;
                    background: linear-gradient(to bottom, rgba(53, 112, 223, 0.966),rgba(41, 95, 194, 0.966));
                }

                .mobile-play-list{
                    transition: all 0.1s ease-in;
                    display: none;
                    width: 100%;
                    transform: translateY(-440px);
                    ul{
                        
                        max-height: 400px;
                        overflow-y: scroll;
                        overflow-x: hidden;
                        list-style: none;
                        .mobile-playlist-li{ 
                            display: flex;
                            background-color: #f3f2f2;
                            // text-align: center;
                            padding: 8px 10px;
                            padding-right: 20px;
                            border-radius: 2px;
                            cursor: pointer;
                            .left-poster{
                                width: 100px;
                                height: 60px;
                                background-color: cadetblue;
                                border: none;
                                outline: none;
                                img{
                                    width: 100%;
                                    height: 100%;
                                    border: none;
                                    outline: none;
                                }
                            }
                            .right-title{
                                flex:1;
                                padding: 5px 10px;
                                font-size: 14px;
                                p{
                                    padding: 2px 0px;
                                }
                            }
                        }
                        .mobile-playlist-li:hover{
                            background-color: #fff;
                        }
                    }
                }
            }
            @media screen and (max-width: 1200px){
                .mobile-select-video{
                    display: block;
                }
            }

            // 视频概要
            .videooutline{
                width: 100%;
                display: flex;
                // background-color: aquamarine;
                padding: 20px 0px;

                .video-poster{
                    width: 150px;
                    height: 100px;
                    background-image: url("../../assets/imgs/vip_htmlcourse.png");
                    background-size: 100%;
                }
                .content{
                    flex:1;
                    height: 150px;
                    padding: 5px 20px;
                    overflow-y: scroll;

                    p{
                        text-indent: 2em;
                    }
                }
            }

            // 评论区域
            .comment-area{
                width: 100%;
                padding: 20px 0px;

                .useravatar-message{
                    cursor: pointer;
                }
                .useravatar-message:hover{
                    transform: rotate(360deg);
                    transition: all 0.5s ease-in;
                }

                // 留言
                .leavewords{
                    width: 100%;
                    padding: 0px 40px;
                }
                @media screen and (max-width: 900px){
                    .leavewords{
                        width: 90%;
                        padding: 0px 10px;
                    }
                }

                // 所有留言
                .allcomments{
                    width: 100%;
                    padding: 20px 10px;
                    
                    .mobile-paginations{
                        display: none;
                    }
                    @media screen and (max-width: 500px){
                        .mobile-paginations{
                            display: block;
                        }
                    }

                    // 没有人留言
                    .notBodyMessage{
                        margin: 10px 0px;
                        width: 100%;
                        height: 80px;
                        border-radius: 10px;
                        text-align: center;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-color: rgb(243, 242, 242);
                    }

                    .each-comment-box{
                        display: flex;
                        align-items: flex-start;
                        justify-content: space-between;
                        align-content: flex-start;
                        align-self: flex-start;
                        flex-wrap: wrap;
                        padding: 10px 0px;
                        cursor: default;


                        .comment-card{
                            width:270px;
                            margin:10px 0px;
                            overflow:hidden;
                        }
                        @media screen and (max-width: 900px){
                            .comment-card{
                                width:100%;
                            }
                        }
                        .content{
                            .delself{
                                height:25px;
                                line-height: 25px;
                                width: 100%;
                                position:absolute;
                                bottom:5px;

                                .which-floor{
                                    color: #aaa;
                                    font-size: 13px;
                                }

                                .delMessage{
                                    border-radius: 3px;
                                    cursor:pointer;
                                    color: #5cadff;
                                    text-align: center;
                                    position: absolute;
                                    font-size: 13px;
                                    right: 35px;
                                    width: 35px;
                                }
                                .delMessage:hover{
                                    background-color: #ed4014;
                                    color: #fff;
                                    text-align: center;
                                }
                            }
                        }
                    }
                }
            }
        }

        // 右侧区域
        .right-container{
            width: 400px;
            // border: 1px solid #f40;
            padding: 0px 30px 0px 30px;
            // background-color: wheat;

            .selectvideo{
                width: 100%;
                height: 400px;
                padding: 10px;
                background-color: rgb(243, 242, 242);
                border-radius: 5px;


                // 选择哪一集
                .videocount{
                    width: 100%;
                    height: 40px;
                    background-color: rgb(233, 231, 231);
                    line-height: 40px;
                    position: relative;
                    padding: 0px 15px;
                    top:0px;

                }

                // 选择视频列表
                .playlist{
                    width: 100%;
                    height: 350px;
                    overflow-y: scroll;
                    .allvideocount{
                        width: 100%;
                        padding: 10px 15px;
                        display: flex;
                        align-items: flex-start;
                        align-content: space-between;
                        flex-wrap:wrap;
                        button{
                            margin: 5px 2px;
                        }
                    }
                    
                    .specilvideo{
                        width: 100%;
                        min-height: 30px;
                        line-height: 30px;
                        padding: 2px 15px;
                        margin: 5px 0px;
                        color: #666;
                        border-radius: 5px;
                        cursor: pointer;

                        i{
                            padding: 0px 5px;
                            font-style: normal;
                        }
                    }
                    .specilvideo:hover{
                        background-color: #fff;
                    }
                }

                // 相关视频推荐
                .aboutvideo{
                    width: 100%;
                    min-height: 350px;
                    // padding: 20px 15px;
                    padding: 25px 0px;
                }
            }

            // 相关推荐视频
            .aboutvideo{
                padding: 20px 0px;
                .about-list{
                    width: 100%;
                    ul{
                        width: 100%;
                        list-style: none;
                        padding: 10px 0px;
                        li{
                            margin: 5px 0px;
                            padding: 5px;
                            cursor: pointer;
                            border: 1px solid #eee;
                            border-radius: 5px;
                            display: flex;
                            .about-poster{
                                width: 100px;
                                height: 60px;
                                img{
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                            .about-title{
                                flex:1;
                                padding: 5px 10px;
                            }
                            &:hover{
                                box-shadow: 0 1px 6px rgba(0,0,0,.2);
                                border-color: #eee;
                            }
                        }

                    }
                }
            }
            
        }
    }


    @media screen and (max-width: 1200px){
        .right-container{
            display: none;
        }
        .mobile-select-video{
            display: block;
        }
    }

    

    
}
@media screen and (max-width: 900px) {
    .htmlcourse{
        padding: 10px 10px;
    }
}
@media screen and (max-width: 500px) {
    .htmlcourse{
        width: 100vw;
        padding: 10px 10px;
        overflow: hidden;
        .wrapper{
            width:100%;
            .left-container{
                width: 100%;

                // 视频播放区域
                .video-container{
                    width: 100%;
                    border: 1px solid rgb(27, 26, 26);
                    border-radius: 5px;

                    // 视频播放器标题
                    .title{
                        width: 100%;
                        height: 30px;
                        line-height: 30px;
                        color:#fff;
                        padding: 0px 10px;
                        font-size: 15px;
                        background-color: rgb(32, 31, 31);

                        .video-index{
                            padding: 0px 10px;
                        }
                        .content{
                            padding: 0px 10px;
                            i{
                                padding: 0px 5px;
                                font-style: normal;
                            }
                        }
                    }

                    // 视频下方点评分享之类
                    .foot-comment{
                        width: 100%;
                        height: 30px;
                        background-color: rgb(15, 15, 15);
                        color:#fff;
                        line-height: 30px;
                        padding: 0px 10px;


                        
                    }
                    
                }
                #icon-weibo-svg{
                    margin-right: 20px;
                }
                // 视频简介
                .videooutline{
                    padding-top: 5px;
                    // display: none;
                    display: block;
                    .video-poster{
                        display: block;
                    }
                    .content{
                        width: 100%;
                        padding: 10px 10px;
                    }
                }

                // 评论区域
                .comment-area{
                    // display: none;

                    .pc-paginations{
                        display: none;
                    }
                    
                    .comment-useravatar{
                        display: none;
                    }
                }
            }
        }
        
    }
}
</style>