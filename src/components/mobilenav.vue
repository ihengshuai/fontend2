<template>
    <Affix>
            <Menu mode="horizontal" :theme="theme" active-name="1" class="menu"> 
                    <Col span="18" class="logo">
                        <a href="http://localhost:8080">
                            <img src="../assets/logo/whs-logo.png" alt="">
                        </a>
                    </Col>
                    <!-- 汉堡菜单 -->
                    <MenuItem name="1" class="MenuItem1">
                        <Dropdown trigger="click" style="margin-left: 20px">
                            <a href="javascript:void(0)" @click="changeDrawer()">
                                <Icon type="md-menu" style="color:#FFF;" />
                            </a>
                            <Drawer class="drawer" title="网站导航" placement="left" :closable="false" v-model="isShowDrawer">
                                <Menu theme="light">
                                    <MenuItem name="1" to="/home">
                                        <Icon type="ios-home" />
                                        网站首页
                                    </MenuItem>
                                    <MenuItem name="2" to="/m.home/html5">
                                        <Icon type="logo-html5" />
                                        HTML5教程
                                    </MenuItem>
                                    <MenuItem name="3" to="/m.home/css">
                                        <Icon type="logo-css3" />
                                        CSS教程
                                    </MenuItem>
                                    <MenuItem name="4" :to="{name:'mjavascript'}">
                                        <Icon type="logo-nodejs" />
                                        JavaScript教程
                                    </MenuItem>
                                    <MenuItem name="5" to="/home/login">
                                        <Icon type="ios-ionitron" />
                                        用户登录
                                    </MenuItem>
                                    <MenuItem name="6" to="/home/register">
                                        <Icon type="md-person-add" />
                                        用户注册
                                    </MenuItem>
                                    <MenuItem name="7" to="/home/callus">
                                        <Icon type="ios-call-outline" />
                                        联系我们
                                    </MenuItem>
                                </Menu>
                            </Drawer>
                        </Dropdown>
                    </MenuItem>
            </Menu>
    </Affix>
</template>

<script>
export default {
    name:"mobilenav",
    data(){
        return{
            isShowDrawer:false,
            theme:"dark"
        }
    },
    methods:{
        changeDrawer(){
            this.isShowDrawer = !this.isShowDrawer;
        }
    },
    computed:{
        
    }
}
</script>

<style lang="less" scoped>
.menu{
// position: relative;
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

    // 汉堡菜单
    .MenuItem1{
        display: block;
        font-size: 30px;
        position: absolute;
        right: 20px;
    }
}
</style>
