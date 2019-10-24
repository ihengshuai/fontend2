<template>
    <div class="enjoymusic" >
        <div class="containner" v-if="judgePath">
            <img class="musicbg" :src="backgroundImage" alt="">
            <div class="wrapper">
                <div class="songlist" >
                    <div class="list">
                        <Row style="padding:20px 40px 20px 40px;">
                            <Col :span="12">
                                <Input prefix="ios-musical-notes-outline" clearable v-model="musicName" @keypress.enter.native="searchMusic()" placeholder="歌曲名、歌手..." style="width: auto;background:#eee;" />
                            </Col>
                            <Col :span="12" style="text-align:right;">
                                <Button type="primary" style="margin-left:5px;" @click="restore()">所有歌曲</Button>
                            </Col>
                        </Row>
                        <Row style="padding:20px 40px 20px 40px;font-size:16px;color:rgba(255,255,255,.8);">
                            <Col :span="10" style="cursor:default;">
                                歌曲<span style="color:#bbb;font-size:13px;">({{noChangeSongs.length}})</span>
                            </Col>
                            <Col :span="8" style="cursor:default;">
                                歌手
                            </Col>
                            <Col :span="3" style="text-align:center;cursor:default;">
                                听歌
                            </Col>
                            <Col :span="3" style="text-align:center;cursor:default;">
                                下载
                            </Col>
                        </Row>
                        <div class="allsongs">
                            <div v-if="!allMusic.length" class="nosongs">
                                抱歉,没找到你想要的歌曲~
                            </div>
                            <Row class="row-song" style="padding:20px 40px 20px 40px;" v-for="(item, index) in allMusic" :key="index">
                                <Col :span="10" style="cursor:default;padding-right:20px;">
                                    {{item.title}}
                                </Col>
                                <Col :span="8" style="cursor:default;">
                                    {{item.artist}}
                                </Col>
                                <Col :span="3" style="text-align:center;cursor:pointer;">
                                    <Icon class="play-btn" type="ios-pause" @click="playThisSong(item, index)" style="font-size:22px;"/>
                                    <Icon class="pause-btn" type="ios-play" @click="playThisSong(item, index)" style="font-size:22px;"/>
                                </Col>
                                <Col :span="3" style="text-align:center;cursor:pointer;">
                                    <a style="color:rgb(226, 214, 214);" href="javascript:void(0);" @click="download(item)" :download="item.artist">
                                    <!-- <a style="color:rgb(226, 214, 214);" :href="'http://localhost:3001/api/music/audio?audio=' + item.src" @click="download(item)" :download="item.artist"> -->
                                        <Icon type="ios-cloud-download-outline"  style="font-size:15px;"/>
                                    </a>
                                    
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div class="right-songposter">
                        <div class="poster">
                            <img v-if="currentSongPoster" :src="currentSongPoster" alt="">
                            
                        </div>
                        <div class="lrc">
                            <div v-if="musicList.lrc" class="currentLrc">{{musicList.lrc}}</div>
                            <div v-if="!musicList.lrc" class="currentLrc">抱歉,暂没有歌词参考~</div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        <div @dblclick.capture="goListenSong()" class="footer-musicplayer">
            <musicplayer  class="aplayer" @play="handlePlay" @pause="handlePause" @ended="handleEvent" ref="aplayer" v-if="showPlayer" :theme="musicplayerTheme" :fixed="false" :float="false" :music="musicList"></musicplayer>
        </div>
    </div>
</template>
<script>
import musicplayer from 'vue-aplayer';
import "@/myplugin/Date"

export default {
    name:"enjoymusic",
    components:{
        musicplayer,
    },
    data(){
        return{
            backgroundImage:require("../../assets/music/bg.jpg"),
            musicName:"",
            musicList: {
                title: "",
                artist: "",
                src: "",
                pic: "",
                lrc: ""
            },
            musicplayerTheme:"#000",
            allMusic:[],
            currentSongPoster:"",
            showPlayer:false,
            currentIndex:"",
            searchIndex:"",
            playing:true,
            noChangeSongs:[],
            hasSearch:false,
        }
    },
    created(){
        
        setTimeout(() => {
            if(this.$route.path != "/home/enjoymusic"){
                this.judgePath = false;
                $(".footer-musicplayer .aplayer").css({"position":"fixed","width":"90px","bottom":"10px","z-index":"2222"})
                if(this.currentIndex == -1){
                    this.$refs.aplayer.pause();
                }
            }else{
                this.renderCurrentSong();
                this.judgePath = true;
                $(".footer-musicplayer .aplayer").css({"position":"fixed","width":"99.5%","bottom":"0px","z-index":"2"})
            }
        }, 50)
        this.getAllSongs();
        this.renderCurrentSong();
    },
    methods:{
        goListenSong(){
            this.$router.push('/home/enjoymusic')
        },
        handlePause(){
            $(".poster img").css("animation-play-state","paused")
            $(".allsongs").children(".row-song").eq(this.currentIndex).find(".play-btn").css("display","none");
            $(".allsongs").children(".row-song").eq(this.currentIndex).find(".pause-btn").fadeIn();
        },
        handlePlay(){
            $(".poster img").css("animation-play-state","running")
            $(".allsongs").children(".row-song").eq(this.currentIndex).find(".play-btn").fadeIn();
            $(".allsongs").children(".row-song").eq(this.currentIndex).find(".pause-btn").css("display","none");
        },
        // 当前歌曲播放完触发
        handleEvent(){
            $(".allsongs").children(".row-song").eq(this.currentIndex).find(".play-btn").css("display","none");
            $(".allsongs").children(".row-song").eq(this.currentIndex).find(".pause-btn").fadeIn();
            $(".poster img").css("animation-play-state","paused")
            if(this.currentIndex == -1){
                this.$Message.success("试听已经完毕");
            }
        },
        // 播放这首歌
        playThisSong(info, index){
            if(this.hasSearch){
                if(this.currentIndex == index){
                    this.$refs.aplayer.toggle();
                    this.playing = !this.playing;
                }else if(this.playing){
                    this.showPlayer = false;
                    this.currentIndex = index;
                    this.backgroundImage = 'http://localhost:3001/api/music/poster?img=' + info.pic;
                    this.currentSongPoster = 'http://localhost:3001/api/music/poster?img=' + info.pic;
                    const song = {
                        title:info.title,
                        artist:info.artist,
                        src:info.src,
                        pic:info.pic,
                        lrc:info.lrc,
                    }
                    this.$store.commit("setCurrentMusic", song);
                    this.$refs.aplayer.pause();
                    setTimeout(() => {
                        this.renderCurrentSong();
                    }, 10)
                }else{
                    this.showPlayer = false;
                    this.currentIndex = index;
                    this.backgroundImage = 'http://localhost:3001/api/music/poster?img=' + info.pic;
                    this.currentSongPoster = 'http://localhost:3001/api/music/poster?img=' + info.pic;
                    const song = {
                        title:info.title,
                        artist:info.artist,
                        src:info.src,
                        pic:info.pic,
                        lrc:info.lrc,
                    }
                    this.$store.commit("setCurrentMusic", song);
                    this.$refs.aplayer.pause();
                    setTimeout(() => {
                        this.renderCurrentSong();
                    }, 10)

                    setTimeout(() => {
                        this.$refs.aplayer.pause();
                    }, 50)
                }   
            }else if(this.currentIndex == index){
                this.$refs.aplayer.toggle();
                this.playing = !this.playing;
                console.log(this.playing)
                if(this.playing){
                    $(".allsongs").children(".row-song").eq(index).find(".play-btn").fadeIn();
                    $(".allsongs").children(".row-song").eq(index).find(".pause-btn").css("display","none");
                }else{
                    $(".allsongs").children(".row-song").eq(index).find(".play-btn").css("display","none");
                    $(".allsongs").children(".row-song").eq(index).find(".pause-btn").fadeIn();
                }
                
            }else{
                if(this.playing){
                    this.showPlayer = false;
                    this.currentIndex = index;
                    this.backgroundImage = 'http://localhost:3001/api/music/poster?img=' + info.pic;
                    this.currentSongPoster = 'http://localhost:3001/api/music/poster?img=' + info.pic;
                    const song = {
                        title:info.title,
                        artist:info.artist,
                        src:info.src,
                        pic:info.pic,
                        lrc:info.lrc,
                    }
                    this.$store.commit("setCurrentMusic", song);
                    this.$refs.aplayer.pause();
                    setTimeout(() => {
                        this.renderCurrentSong();
                    }, 10)
                }else{
                    this.showPlayer = false;
                    this.currentIndex = index;
                    this.backgroundImage = 'http://localhost:3001/api/music/poster?img=' + info.pic;
                    this.currentSongPoster = 'http://localhost:3001/api/music/poster?img=' + info.pic;
                    const song = {
                        title:info.title,
                        artist:info.artist,
                        src:info.src,
                        pic:info.pic,
                        lrc:info.lrc,
                    }
                    this.$store.commit("setCurrentMusic", song);
                    this.$refs.aplayer.pause();
                    setTimeout(() => {
                        this.renderCurrentSong();
                    }, 10)

                    setTimeout(() => {
                        this.$refs.aplayer.pause();
                    }, 50)
                }
            }
            

            // 控制海报的旋转
            if(this.playing){
                $(".poster img").css("animation-play-state","running")
            }else{
                $(".poster img").css("animation-play-state","paused")
            }
            
        },
        // 获取当前歌曲
        renderCurrentSong(){
            this.musicList.title = this.currentSong.title;
            this.musicList.artist = this.currentSong.artist;
            this.musicList.src = 'http://localhost:3001/api/music/audio?audio=' + this.currentSong.src;
            this.musicList.pic = 'http://localhost:3001/api/music/poster?img=' + this.currentSong.pic;
            this.musicList.lrc = this.currentSong.lrc;
            this.backgroundImage = 'http://localhost:3001/api/music/poster?img=' + this.currentSong.pic;
            this.currentSongPoster = 'http://localhost:3001/api/music/poster?img=' + this.currentSong.pic;
            this.showPlayer = true;
            if(this.currentSong.src != "xxxx.mp3"){
                setTimeout(() => {
                    this.$refs.aplayer.play();
                    setTimeout(() => {
                        if(this.hasSearch){
                            this.allMusic.forEach((item, index) => {
                                if(item.title == this.musicList.title){
                                    this.searchIndex = index;
                                    $(".allsongs").children(".row-song").css("background","none")
                                    $(".allsongs").children(".row-song").eq(index).css("background","rgba(255, 255, 255, .1)")

                                    if(this.playing){
                                        $(".allsongs").children(".row-song").eq(index).siblings(".row-song").find(".play-btn").css("display","none");
                                        $(".allsongs").children(".row-song").eq(index).siblings(".row-song").find(".pause-btn").fadeIn();
                                        $(".allsongs").children(".row-song").eq(index).find(".play-btn").fadeIn();
                                        $(".allsongs").children(".row-song").eq(index).find(".pause-btn").css("display","none");
                                    }

                                    return;
                                }
                            })
                        }else{
                            this.noChangeSongs.forEach((item, index) => {
                                if(item.title == this.musicList.title){
                                    this.currentIndex = index;
                                    $(".allsongs").children(".row-song").css("background","none")
                                    $(".allsongs").children(".row-song").eq(index).css("background","rgba(255, 255, 255, .1)")

                                    if(this.playing){
                                        $(".allsongs").children(".row-song").eq(index).siblings(".row-song").find(".play-btn").css("display","none");
                                        $(".allsongs").children(".row-song").eq(index).siblings(".row-song").find(".pause-btn").fadeIn();
                                        $(".allsongs").children(".row-song").eq(index).find(".play-btn").fadeIn();
                                        $(".allsongs").children(".row-song").eq(index).find(".pause-btn").css("display","none");
                                    }

                                    return;
                                }
                            })
                        }
                    }, 100)
                }, 10)
            }else{
                this.musicList.src = require(`../../assets/music/${this.currentSong.src}`);
                this.backgroundImage = require(`../../assets/music/${this.currentSong.pic}`);
                this.currentSongPoster = require(`../../assets/music/${this.currentSong.pic}`);
                this.musicList.pic = require(`../../assets/music/${this.currentSong.pic}`);
                setTimeout(() => {
                    this.playing = true;
                    this.currentIndex = -1;
                    this.$refs.aplayer.play();
                }, 10)  
            }
        },
        // 搜索歌曲
        searchMusic(){
            if(this.musicName.length){
                this.hasSearch = true;
                this.$axios.post("http://localhost:3001/api/music/songs/search", {songName:this.musicName})
                        .then(res => {
                            this.allMusic = res.data;
                            var hasSong = false;
                            res.data.forEach((item, index) => {
                                if(item.title == this.musicList.title){
                                    hasSong = true;
                                    this.currentIndex = index;
                                    $(".allsongs").children(".row-song").css("background","none")
                                    $(".allsongs").children(".row-song").eq(index).css("background","rgba(255, 255, 255, .1)")

                                    if(this.playing){
                                        $(".allsongs").children(".row-song").eq(index).siblings(".row-song").find(".play-btn").css("display","none");
                                        $(".allsongs").children(".row-song").eq(index).siblings(".row-song").find(".pause-btn").fadeIn();
                                        $(".allsongs").children(".row-song").eq(index).find(".play-btn").fadeIn();
                                        $(".allsongs").children(".row-song").eq(index).find(".pause-btn").css("display","none");
                                    }

                                    return;
                                }
                            })

                            if(!hasSong){
                                $(".allsongs").children(".row-song").css("background","none")
                                $(".allsongs").children(".row-song").find(".play-btn").css("display","none");
                                $(".allsongs").children(".row-song").find(".pause-btn").fadeIn();
                            }
                        })
            }else{
                this.$Modal.warning({
                    title:"警告",
                    content:"搜索内容不能为空,请重新输入",
                })
            }
        },
        // 还原所有歌曲
        restore(){
            this.hasSearch = false;
            this.musicName = "";
            this.getAllSongs();
            
            setTimeout(() => {
                this.noChangeSongs.forEach((item, index) => {
                    if(item.title == this.musicList.title){
                        this.currentIndex = index;
                        $(".allsongs").children(".row-song").css("background","none")
                        $(".allsongs").children(".row-song").eq(index).css("background","rgba(255, 255, 255, .1)")

                        if(this.playing){
                            $(".allsongs").children(".row-song").eq(index).siblings(".row-song").find(".play-btn").css("display","none");
                            $(".allsongs").children(".row-song").eq(index).siblings(".row-song").find(".pause-btn").fadeIn();
                            $(".allsongs").children(".row-song").eq(index).find(".play-btn").fadeIn();
                            $(".allsongs").children(".row-song").eq(index).find(".pause-btn").css("display","none");
                        }else{
                            $(".allsongs").children(".row-song").find(".play-btn").css("display","none");
                            $(".allsongs").children(".row-song").find(".pause-btn").fadeIn();
                        }

                        return;
                    }
                })
                
            }, 100)
            

        },
        // 获取所有歌曲
        getAllSongs(){
            this.$axios.get("http://localhost:3001/api/music/all")
                    .then(res => {
                        this.allMusic = res.data;
                        this.noChangeSongs = res.data;
                    })
        },
        // 下载歌曲
        download(item){
            this.$axios.get("http://localhost:3001/api/music/audio?audio=" + item.src)
                .then(res => {
                    // 请求http资源文件，转化成blob
                    var b = new Blob([res.data], {type: 'audio/mp3'});
                    const date = new Date().format("yyyyMMddHHmmss");
                    const random_num = Math.floor(Math.random() * 1000000 + 1);
                    const exname = `${String(date)}_${random_num}`;
                    // 转化成url
                    var bURL = URL.createObjectURL(b);
                    // 新建a标签，触发点击下载（IE未测试）
                    var link = document.createElement('a');
                    link.href = bURL;
                    link.setAttribute('download', `${item.title}.${exname}.mp3`);
                    document.getElementsByTagName("body")[0].appendChild(link);
                    // Firefox
                    if (document.createEvent) {
                        var event = document.createEvent("MouseEvents");
                        event.initEvent("click", true, true);
                        link.dispatchEvent(event);
                    }
                    // IE
                    else if (link.click) {
                        link.click();
                    }
                    link.parentNode.removeChild(link);
                    // console.log(res)
                })
        }
    },
    computed:{
        currentSong:{
            get(){
                return this.$store.getters.getCurrentMusic;
            },
            set(song){
                this.$store.commit("setCurrentMusic", song);
            }
        },
        judgePath:{
            get(){
                return this.$store.getters.getJudgePath;
            },
            set(val){
                this.$store.commit("setJudgePath", val);
            }
        }
    },
    watch:{
        $route(to, from){
            if(to.path != "/home/enjoymusic"){
                this.judgePath = false;
                $(".footer-musicplayer .aplayer").css({"position":"fixed","width":"90px","bottom":"10px","z-index":"2222"})
                if(this.currentIndex == -1){
                    this.$refs.aplayer.pause();
                }
            }else{
                this.judgePath = true;
                this.renderCurrentSong();
                $(".footer-musicplayer .aplayer").css({"position":"fixed","width":"99.5%","bottom":"0px","z-index":"2"})
            }
        }
    }
}
</script>
<style lang="less" scoped>
.containner{
    width: 100%;
    height: 83vh;
    .musicbg{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        filter: blur(30px);
    }
    
    .wrapper{
        padding-left: 50px;
        z-index: 10;
        width: 100%;
        height: 100%;
        color: rgb(224, 219, 219);
        background-color: rgba(71, 70, 70, 0.4);

        .songlist{
            width: 100%;
            height: 90%;
            display: flex;
            .list{
                flex:1;
                overflow-y: scroll;
                padding-right: 20px;
                font-size: 15px;
                color: rgb(226, 214, 214);
                .nosongs{
                    width:100%;
                    padding: 100px 0px;
                    text-align: center;
                    font-size: 20px;
                }

                .row-song{
                    border-radius: 30px;

                    .play-btn{
                        display: none;
                    }
                }
                .row-song:hover{
                    background-color: rgba(255, 255, 255, .1);
                }
            }
            .right-songposter{
                position: relative;
                right: 0px;
                width: 400px;

                .poster{
                    width: 100%;
                    height: 60%;
                    text-align: center;
                    padding: 60px 0px;
                    img{
                        width: 220px;
                        height: 220px;
                        border-radius: 110px;
                        box-shadow: 0px 0px 5px #fff;
                        animation: poster2 60s linear infinite;
                    }
                    @keyframes poster2 {
                        from{
                            transform: rotate(0deg);
                        }
                        to{
                            transform: rotate(360deg);
                        }
                    }
                }
                

                .lrc{
                    text-align: center;
                    overflow-y: scroll;
                    color: rgba(255, 255, 255, .8);
                }
            }
            @media screen and (max-width:1140px){
                .right-songposter{
                    display: none;
                }
                .list{
                    padding-right: 0px;
                }
            }
        }
        

        .footer-musicplayer{
            padding: 0px 40px;
            position: absolute;
            bottom: 0px;
            left: 0;
            right: 0;
            width: 100%;
        }
    }
    @media screen and (max-width:500px){
        .wrapper{
            padding: 0px;
        }
    }
}
</style>