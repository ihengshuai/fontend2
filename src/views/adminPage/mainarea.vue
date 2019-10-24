<template>
    <div class="mainarea">
        <div class="main">
            <div class="leftBar">
                <Menu theme="dark" :active-name="activeName" style="width:100%;" accordion class="menu">
                    <div style="padding:20px 0px;"></div>
                    <MenuItem name="1" to="/admin/index">
                        <Icon type="md-flame" />
                        后台首页
                    </MenuItem>
                    <MenuItem name="2" to="/admin/index/data/homepage">
                        <Icon type="ios-compass" />
                        首页数据
                    </MenuItem>
                    <Submenu name="3">
                        <template slot="title">
                            <Icon type="ios-people" />
                            用户信息
                        </template>
                        <MenuItem name="3-1" to="/admin/index/manageusers">
                            <Icon type="ios-man" />
                            用户管理
                        </MenuItem>
                        <MenuItem name="3-2" to="/admin/index/signlog">
                            <Icon type="md-beer" />
                            签到信息
                        </MenuItem>
                    </Submenu>
                    <Submenu name="4">
                        <template slot="title">
                            <Icon type="ios-brush" />
                            文章信息
                        </template>
                        <Submenu name="4-1">
                            <template slot="title">
                                <Icon type="logo-html5" />
                                HTML5
                            </template>
                            <MenuItem v-if="html5Nav.length" :name="'4-1-' + parseInt(index)" v-for="(item, index) in html5Nav" :key="item.title" :to="'/admin/index/edit/' + item.coursetype + '?title=' + item.title" >{{item.title}}</MenuItem>
                        </Submenu>
                        <Submenu name="4-2">
                            <template slot="title">
                                <Icon type="logo-css3" />
                                CSS
                            </template>
                            <MenuItem v-if="cssNav.length" :name="'4-2-' + parseInt(index)" v-for="(item, index) in cssNav" :key="item.title" :to="'/admin/index/edit/' + item.coursetype + '?title=' + item.title" >{{item.title}}</MenuItem>
                        </Submenu>
                        <Submenu name="4-3">
                            <template slot="title">
                                <Icon type="logo-javascript" />
                                JavaScript
                            </template>
                            <MenuItem v-if="javascriptNav.length" :name="'4-3-' + parseInt(index)" v-for="(item, index) in javascriptNav" :key="item.title" :to="'/admin/index/edit/' + item.coursetype + '?title=' + item.title" >{{item.title}}</MenuItem>
                        </Submenu>
                        <MenuItem name="4-4" to="/admin/index/addarticle">
                            <Icon type="ios-add-circle-outline" />
                            添加文章
                        </MenuItem>
                        <MenuItem name="4-5" to="/admin/index/specificarticles">
                            <Icon type="ios-stats" />
                            文章统计
                        </MenuItem>
                    </Submenu>
                    <Submenu name="5">
                        <template slot="title">
                            <Icon type="logo-youtube" />
                            VIP课程
                        </template>
                        <Submenu name="5-1">
                            <template slot="title">
                                <Icon type="ios-folder-open" />
                                课程管理
                            </template>
                            <MenuItem name="5-1-1" to="/admin/index/manage/vip/course/html">
                                <Icon type="logo-html5" />
                                HTML课程
                            </MenuItem>
                            <MenuItem name="5-1-2" to="/admin/index/manage/vip/course/css">
                                <Icon type="logo-css3" />
                                CSS课程
                            </MenuItem>
                            <MenuItem name="5-1-3" to="/admin/index/manage/vip/course/js">
                                <Icon type="logo-javascript" />
                                JavaScript课程
                            </MenuItem>
                        </Submenu>
                        <MenuItem name="5-2" to="/admin/index/buycourselog">
                            <Icon type="md-cart" />
                            购买记录
                        </MenuItem>
                    </Submenu>
                    <MenuItem name="6" to="/admin/index/managemusic">
                        <Icon type="ios-musical-notes" />
                        歌曲管理
                    </MenuItem>
                    <Submenu name="7">
                        <template slot="title">
                            <Icon type="ios-text" />
                            综合留言
                        </template>
                        <MenuItem name="7-1" to="/admin/index/message/html">
                            <Icon type="logo-html5" />
                            HTML课程留言
                        </MenuItem>
                        <MenuItem name="7-2" to="/admin/index/message/css">
                            <Icon type="logo-css3" />
                            CSS课程留言
                        </MenuItem>
                        <MenuItem name="7-3" to="/admin/index/message/js">
                            <Icon type="logo-javascript" />
                            JavaScript课程留言
                        </MenuItem>
                        <MenuItem name="7-4" to="/admin/index/message/community">
                            <Icon type="ios-chatbubbles" />
                            社区留言
                        </MenuItem>
                    </Submenu>

                    <Submenu name="8">
                        <template slot="title">
                            <Icon type="ios-stats" />
                            网站日志
                        </template>
                        <MenuItem name="8-1" to="/admin/index/operalog">
                            <Icon type="ios-log-in" />
                            操作日志
                        </MenuItem>
                        <MenuItem name="8-2" to="/admin/index/loginlog">
                            <Icon type="ios-log-in" />
                            登录日志
                        </MenuItem>
                        <MenuItem name="8-3" to="/admin/index/registerlog">
                            <Icon type="ios-log-out" />
                            注册日志
                        </MenuItem>
                    </Submenu>
                </Menu>
            </div>
            <div class="main-content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"mainarea",
    data(){
        return{
            activeName:"1",
            html5Nav:[],
            cssNav:[],
            javascriptNav:[]
        }
    },
    created(){
        this.getHtmlNav();
        this.getCssNav();
        this.getJavaScriptNav();
        switch(this.$route.path){
            case "/admin/index": 
                        this.activeName = "1";
                        break;
            case "/admin/index/data/homepage":
                        this.activeName = "2";
                        break;
            case "/admin/index/manageusers":
                        this.activeName = "3-1";
                        break;
            case "/admin/index/signlog":
                        this.activeName = "3-2";
                        break;
            case "/admin/index/loginlog":
                            this.activeName = "8-2";
                            break;
            case "/admin/index/registerlog":
                            this.activeName = "8-3";
                            break;
        }
    },
    methods:{
        // 获取HTML文章标题
        getHtmlNav(){
            this.$axios.get("http://localhost:3001/api/article/html5")
                    .then(res => {
                        this.html5Nav = res.data;
                    })
        },
        // 获取CSS文章标题
        getCssNav(){
            this.$axios.get("http://localhost:3001/api/article/css")
                    .then(res => {
                        this.cssNav = res.data;
                    })
        },
        // 获取JavaScript文章标题
        getJavaScriptNav(){
            this.$axios.get("http://localhost:3001/api/article/javascript")
                    .then(res => {
                        this.javascriptNav = res.data;
                    })
        }
    },
    watch:{
        $route(to, from){
            switch(to.path){
                case "/admin/index": 
                            this.activeName = "1";
                            break;
                case "/admin/index/manageusers":
                            this.activeName = "2-1";
                            break;
                case "/admin/index/loginlog":
                            this.activeName = "4-1";
                            break;
                case "/admin/index/registerlog":
                            this.activeName = "4-2";
                            break;
            }
        }
    }
}
</script>

<style lang="less" scoped>
.mainarea{
    width: 100%;
    height: 100%;
    background-color: slategrey;

    .main{
        width: 100%;
        height: 100%;
        display: flex;

        // 左侧导航
        .leftBar{
            padding: 0px 0px 200px 0px;
            width: 250px;
            height: 100%;
            overflow-y: scroll;
            background-color: #515a6e;

            .menu{
                width: 100%;
            }
        }

        .main-content{
            flex: 1;
            overflow-y: scroll;
            background-color: #fff;
            padding: 20px 50px 100px 50px;
        }
    }
}
</style>
