<template>
    <div class="adminnav">
        <Menu mode="horizontal" theme="dark" active-name="1" class="menu">
            <Col span="5" class="logo">
                <a href="http://localhost:8080/admin">
                    <img src="../../assets/logo/whs-logo.png" alt="卫恒帅毕业设计">
                </a>
            </Col>
            <Col span="14" class="title">
                <span>后台管理系统</span>
            </Col>
            <Col span="5">
                <span style="cursor:default;color:#bbb;padding:20px 0px;text-align:center;font-size:16px;line-height:60px;">{{currentTime}}</span>
            </Col>
            
            <MenuItem name="1" class="avatar-menu" v-if="isAdminLogin">
                <Dropdown trigger="click" style="margin-left:5px;">
                    <Avatar :src="adminAvatar" size="large" alt="卫恒帅毕业设计" />
                    <DropdownMenu slot="list">
                        <DropdownItem @click.native="adminLogout()">退出登录</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </MenuItem>
        </Menu>
    </div>
</template>

<script>
import "@/myplugin/Date"
import { setInterval } from 'timers';
export default {
    name:"adminnav",
    components:{},
    data(){
        return{
            adminAvatar:require("../../assets/avatar/admin.jpg"),
            currentTime:""
        }
    },
    created(){
        this.showTime();
    },
    methods:{
        // 退出登录
        adminLogout(){
            this.$Modal.confirm({
                title:"退出提示",
                content:"你确定要退出吗?",
                okText:"确定",
                calcelText:"取消",
                type:"warning",
                onOk:()=>{
                    // 退出清除一切
                    this.$store.dispatch("clearAdminState");
                    this.$router.push("/");
                },
                onCancel:()=>{
                    this.$Message.info("取消退出");
                }
            })
            
        },
        // 显示时间
        showTime(){
            setInterval(() => {
                this.currentTime = new Date().format("yyyy/MM/dd HH:mm:ss")
            }, 1000)
        }
    },
    computed:{
        // 判断是否登录
        isAdminLogin(){
            return this.$store.getters.isAdminAuthorization;
        }
    }

}
</script>

<style lang="less" scoped>
.adminnav{
    width: 100%;

    .menu{
        min-width: 1000px;

        // 网站logo
        .logo{
            height: 60px;
            padding-left: 40px;
            img{
                height: 100%;
                width: 80%;
            }
        }

        // 后台管理系统标题
        .title{
            font-family: "隶书";
            font-size: 40px;
            color: #ccc;
        }

        // avatar
        .avatar-menu{
            position: absolute;
            right:50px;
        }
    }
}
</style>
