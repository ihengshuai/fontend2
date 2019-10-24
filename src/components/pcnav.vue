<template>
    <div class="nav">
        <Affix class="affix-nav">
            <Menu mode="horizontal" :theme="theme" active-name="1" class="menu"> 
                        <Col span="5" class="logo">
                            <a href="http://localhost:8080">
                                <img src="../assets/logo/whs-logo.png" alt="">
                            </a>
                        </Col>
                        <MenuItem name="1" to="/home" class="MenuItem1">
                            <Icon type="ios-home" />
                            网站首页
                        </MenuItem>
                        <MenuItem name="2" to="/home/html5?title=HTML简介" class="MenuItem2">
                            <Icon type="logo-html5" />
                            HTML5教程
                        </MenuItem>
                        <MenuItem name="3" to="/home/css?title=CSS简介" class="MenuItem3">
                            <Icon type="logo-css3" />
                            CSS教程
                        </MenuItem>
                        <MenuItem name="4" to="/home/javascript?title=JAVASCRIPT简介" class="MenuItem4">
                            <Icon type="logo-nodejs" />
                            JavaScript教程
                        </MenuItem>
                        <MenuItem name="9" to="/home/vip/course" class="MenuItem9">
                            <Icon type="md-planet" />
                            VIP专区
                        </MenuItem>
                        <!-- <MenuItem name="5" to="/home/community" class="MenuItem5">
                            <Icon type="ios-cafe" />
                            网站社区
                        </MenuItem> -->
                        <Submenu name="5" class="MenuItem5">
                            <template slot="title">
                                <Icon type="ios-cafe" />
                                网站社区
                            </template>
                            <MenuItem name="5-1" to="/home/aboutme">关于作者</MenuItem>
                            <MenuItem name="5-2" to="/home/messagewall">留言墙</MenuItem>
                            <MenuItem name="5-3" to="/home/enjoymusic">欣赏歌曲</MenuItem>
                        </Submenu>
                        <!-- 汉堡菜单 -->
                        <MenuItem name="6" class="MenuItem6">
                            <Dropdown trigger="click" style="margin-left: 20px;z-index:1000;">
                                <a href="javascript:void(0)" @click="changeDrawer()">
                                    <Icon type="md-menu" style="color:#FFF;" />
                                </a>
                                <Drawer style="z-index:9999;" class="drawer" title="网站导航" placement="left" :closable="false" v-model="isShowDrawer">
                                    <div @keypress.enter="searchInput()">
                                        <Input prefix="ios-search" clearable v-model="searchdata" class="search-input-box"  placeholder="输入内容..." :class="{'small-input':searchsize1,'large-input':searchsize2}" />
                                    </div>
                                    <Menu style="z-index:9999;" theme="light">
                                        <MenuItem @click.native="shutDrawer()" name="1" to="/home">
                                            <Icon type="ios-home" />
                                            网站首页
                                        </MenuItem>
                                        <MenuItem @click.native="shutDrawer()" name="2" to="/home/html5?title=HTML简介">
                                            <Icon type="logo-html5" />
                                            HTML5教程
                                        </MenuItem>
                                        <MenuItem @click.native="shutDrawer()" name="3" to="/home/css?title=CSS简介">
                                            <Icon type="logo-css3" />
                                            CSS教程
                                        </MenuItem>
                                        <MenuItem @click.native="shutDrawer()" name="4" to="/home/javascript?title=JAVASCRIPT简介">
                                            <Icon type="logo-nodejs" />
                                            JavaScript教程
                                        </MenuItem>
                                        <MenuItem @click.native="shutDrawer()" name="12" to="/home/vip/course">
                                            <Icon type="md-planet" />
                                            VIP专区
                                        </MenuItem>
                                        <Submenu name="15">
                                            <template slot="title">
                                                <Icon type="ios-cafe" />
                                                网站社区
                                            </template>
                                            <MenuItem name="15-1" to="/home/aboutme">关于作者</MenuItem>
                                            <MenuItem name="15-2" to="/home/messagewall">留言墙</MenuItem>
                                            <MenuItem name="15-3" to="/home/enjoymusic">欣赏歌曲</MenuItem>
                                        </Submenu>
                                        <MenuItem @click.native="shutDrawer()" name="5" v-if="isLogin" to="/home/userinfo">
                                            <Avatar style="margin-right:5px;width:20px;height:20px;line-height:20px;border-radius:10px;" class="mobile-avatar" :src="avatar" size="large" />
                                            <span>个人信息</span>
                                        </MenuItem>
                                        <MenuItem name="6" v-if="!isLogin" to="/login">
                                            <Icon type="ios-ionitron" />
                                            用户登录
                                        </MenuItem>
                                        <MenuItem name="7" to="/register">
                                            <Icon type="md-person-add" />
                                            用户注册
                                        </MenuItem>
                                        <MenuItem name="8" v-if="isLogin" @click.native="logout">
                                            <Icon type="md-power" />
                                            <span>退出登录</span>
                                        </MenuItem>
                                        <MenuItem name="10">
                                            <Icon type="ios-color-palette" />
                                            <span @click="changeTheme()">切换主题</span>
                                        </MenuItem>
                                        <MenuItem name="11">
                                            <Icon type="ios-refresh-circle" />
                                            <span @click="refresh()">强制刷新</span>
                                        </MenuItem>
                                    </Menu>
                                </Drawer>
                            </Dropdown>
                        </MenuItem>
                        <MenuItem name="8" class="search-box MenuItem8">
                            <div @keypress.enter="searchInput()">
                                <Input prefix="ios-search" @blur.native.capture="smallsize()" @focus.native.capture="largesize()" clearable v-model="searchdata" class="search-input-box"  placeholder="搜索文章..." :class="{'small-input':searchsize1,'large-input':searchsize2}" />
                            </div>
                        </MenuItem>
                        <MenuItem name="7" class="userinfo MenuItem7">
                            <Avatar v-if="isLogin" @click.native="gouserinfo()" :src="avatar" size="large" />
                            <span v-if="!isLogin">
                                <span><router-link class="login-link" style="color:#eee;" to="/login">
                                    <Avatar icon="ios-person" size="large" style="margin-right:5px;" />登录</router-link> <i style="color:#ddd;"> | </i> 
                                <router-link class="register-link" style="color:#eee;" to="/register">注册</router-link></span>
                                <span style="padding-left:20px;" @click="changeTheme()"><Icon type="ios-color-palette" />主题</span>
                            </span>
                            <Dropdown v-if="isLogin" trigger="click" style="margin-left: 20px">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-arrow-down" style="color:#fff;"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem v-if="isLogin">
                                        <router-link style="color:#515a6e;" to="/home/userinfo">个人信息</router-link>
                                    </DropdownItem>
                                    <DropdownItem v-if="!isLogin">
                                        <router-link style="color:#515a6e;" to="/login">用户登录</router-link>
                                    </DropdownItem>
                                    <DropdownItem to="/home/register">
                                        <router-link style="color:#515a6e;" to="/register">用户注册</router-link>
                                    </DropdownItem>
                                    <DropdownItem v-if="isLogin">
                                        <span @click="logout()">退出登录</span>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <span @click="changeTheme()">切换主题</span>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </MenuItem>
                </Menu>
        </Affix>
        <div class="mobile-search-box" v-if="isUserInfo">
            <Input size="large" class="mobile-model-search" suffix="ios-search" @keypress.enter.native="searchInput()" v-model="searchdata"  placeholder="搜索内容..." />
        </div>
    </div>
</template>

<script>
export default {
    name:"pcnav",
    data(){
        return{
            // theme:"dark",
            isShowDrawer:false,
            searchdata:"",
            searchsize1:true,
            searchsize2:false,
            isUserInfo:true, // 当在用户信息页面时不显示搜索框
        }
    },
    methods:{
        shutDrawer(){
            this.isShowDrawer = false;
        },
        // 点击头像去我的信息页面
        gouserinfo(){
            this.$router.push("/home/userinfo");
        },
        // 搜索数据
        searchInput(){
            if(this.searchdata.trim().length){
                if(this.$route.path != "/search"){
                    // 存储路径,以便返回当前页
                    localStorage.setItem("backpage", this.$route.fullPath);
                }
                
                this.$router.push({path:"/search",query:{q:this.searchdata}});
                this.$axios.post("http://localhost:3001/api/article/search", {search:this.searchdata})
                            .then(res => {
                                this.$store.dispatch("search", res.data)
                            })
            }else{
                this.$Message.warning("搜索内容不能为空")
            }
        },
        // 加长搜索框
        largesize(){   
            this.searchsize1 = false;
            this.searchsize2 = true;
        },
        // 减小搜索框
        smallsize(){  
            this.searchsize1 = true;
            this.searchsize2 = false;
        },
        // 改变主题
        changeTheme(){
            this.isShowDrawer = false;
            if(this.theme === "dark"){
                this.theme = "primary";
                localStorage.setItem("websiteTheme","primary");
            }else if(this.theme === "primary"){
                this.theme = "dark";
                localStorage.setItem("websiteTheme","dark");
            }
        },
        // 改变抽屉
        changeDrawer(){
            this.isShowDrawer = !this.isShowDrawer;
        },
        // 强制刷新
        refresh(){
            localStorage.removeItem("homepage");
            this.isShowDrawer = false;
            this.$router.go(0);
        },
        // 退出登录
        logout(){
            // console.log("退出")
            this.$Modal.confirm({
                title:"退出提示",
                content:"你确定要退出吗?",
                okText:"确定",
                calcelText:"取消",
                type:"warning",
                onOk:()=>{
                    localStorage.removeItem("jwtToken");
                    this.$store.dispatch("clearCurrentState");
                    this.isLogin = false;
                    this.isShowDrawer = false;
                    this.$router.push("/");
                }
            })
            
        }
    },
    computed:{
        // 判断是否登录
        isLogin:{
            get(){
                return this.$store.getters.isAuthorizated
            },
            set(val){
                this.$store.commit("isAuthorizated", val);
            }
        },
        // 主题
        theme:{
            get(){
                if(!this.$store.getters.websiteTheme){
                    return "dark"
                }else{
                    return this.$store.getters.websiteTheme;
                }
            },
            set(val){
                this.$store.commit("websiteTheme", val);
            }
        },
        // 用户头像
        avatar:{
            get(){
                const tx = this.$store.getters.avatar;
                return "http://localhost:3001/api/user/avatar?email=" + this.$store.getters.user.email
                
            }
        }
    },
    created(){
        // console.log(this.$store.getters.websiteTheme)
        if(this.theme === "light"){
            this.color1 = false;
            this.color2 = true;
        }
        if(this.$route.path == "/home/userinfo" ||  this.$route.path == "/home/vip/course" || this.$route.path == "/home/aboutme" || this.$route.path == "/home/messagewall" || this.$route.path == "/home/enjoymusic" || this.$route.path == "/home/vip/course/html5/play" || this.$route.path == "/home/vip/course/css/play" || this.$route.path == "/home/vip/course/javascript/play"){
            this.isUserInfo = false;
        }else{
            this.isUserInfo = true;
        }
    },
    watch:{
        // 监听路由变化
        $route(to, from){
            if(to.query.q != from.query.q){
                this.searchdata = this.$route.query.q.trim();
            }
            this.isShowDrawer = false;
            if(to.path == "/home/userinfo" || to.path == "/home/messagewall" || to.path == "/home/aboutme" || to.path == "/home/enjoymusic" || to.path == "/home/vip/course" || to.path == "/home/vip/course/html5/play" || to.path == "/home/vip/course/css/play"  || to.path == "/home/vip/course/javascript/play"){
                this.isUserInfo = false;
            }else{
                this.isUserInfo = true;
            }
        }
    }
}
</script>

<style lang="less" scoped>
.nav{
    width: 100%;
    min-width: 400px;

    // 搜索框
    .mobile-search-box{
        display: none;
    }

    @media screen and (max-width: 1350px){
        .MenuItem1{
            display: none;
        }
    }

    @media screen and (max-width: 920px) {
        .mobile-search-box{
            display: block;
            width: 100%;
            min-width: 300px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
            .mobile-model-search{
                width: 70%;
            }
        }
    }


    // 吸顶
    .affix-nav{
        width: 100%;
    }


    .menu{
        width: 100%;
        // 网站logo
        .logo{
            height: 60px;
            padding-left: 40px;
            img{
                height: 100%;
                width: 80%;
            }
        }
        // 用户信息
        .userinfo{
            position: absolute;
            right: 20px;
        }

        // 折叠菜单
        .MenuItem6{
            display: none;
        }
        .login-link:hover{
            color: #fff;
            font-size: 15px;
            text-decoration: underline;
        }
        .register-link:hover{
            color: #fff;
            font-size: 15px;
            text-decoration: underline;
        }

        // 改变箭头颜色
        .color1{
            color: #fff;
        }
        .color2{
            color: #000;
        }

        // 搜索框
        .small-input{
            width: 90px;
        }
        .large-input{
            width: 140px;
        }
        .search-input-box{
            transition: width 200ms ease-in;
        }

        // 媒体查询
        @media (max-width: 800px) {
            .MenuItem1,.MenuItem2,.MenuItem3,.MenuItem4,.MenuItem5,.MenuItem7,.MenuItem8,.MenuItem9{
                display: none;
            }
            .logo{
                width: 350px;
            }

            .MenuItem6{
                display: block;
                font-size: 30px;
                position: absolute;
                z-index: 9999;
                right: 20px;

                .mobile-avatar img{
                    width: 10px;
                    height: 10px;
                }
            }
        }
        @media (max-width: 920px) {
            .MenuItem8{
                display: none;
            }
        }
    }
}
</style>
