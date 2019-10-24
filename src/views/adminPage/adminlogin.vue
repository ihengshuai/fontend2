<template>
    <div class="adminlogin" :class="backgroundImage">
         <div class="form-box">
             <div class="login-logo">
                 <img src="../../assets/logo/favicon.png" @click="toHome()" alt="">
             </div>
             <div class="login-title">
                 后 台 管 理 系 统
             </div>
            <el-form class="login-form" label-position="top" size="small" :inline-message="inlinemessage" :model="loginForm" :rules="loginRule" ref="loginForm" label-width="100px">
                <el-form-item label="Administrator Account" prop="email">
                    <el-input type="text" v-model="loginForm.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="Administrator Password" prop="password">
                    <el-input type="password" @keypress.enter.native="submitForm('loginForm')" show-password v-model="loginForm.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="Security Code" prop="inputCaptcha">
                    <div class="yzm">
                        <el-input style="width:150px;" v-model="inputCaptcha" placeholder="验证码"></el-input>
                        <img width="80" style="background:#EEE9E9;margin-left:30px;" ref="captcha" height="32" src="http://localhost:3001/api/user/getCaptcha" @click="refreshCaptcha">
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button class="login-btn" type="primary" @click="submitForm('loginForm')">Sign in</el-button>
                </el-form-item>
            </el-form>
            <div class="back-userlogin">
                是普通用户?<span><router-link to="/login"> 返回用户登录</router-link></span>
            </div>
         </div>
    </div>
</template>

<script>
import wsmLoading from "@/myplugin/Loading";
import jwt_decode from 'jwt-decode';
import { decode } from 'punycode';
export default {
    name:"userlogin",
    data(){
        var validateCaptcha = (rule, value, callback) => {
            if(!this.inputCaptcha.trim().length){
                callback(new Error('请输入验证码~'));
            }else{
                callback();
            }
        }
        return{
            inline:true,
            inlinemessage:false,
            backgroundImage: `login-bg${Math.floor(Math.random() * 4 + 1)}`,
            loginForm:{
                // email:"admin@163.com",
                // password:"AxYgfi.?1105",
                email:"",
                password:""
            },
            loginRule:{
                email:[
                    {required:true,message:"请输入管理员账号",trigger:"blur"},
                    {type:"email",message:"请输入正确的邮箱",trigger:"blur"},
                ],
                password:[
                    {required:true,message:"请输入管理员密码",trigger:"blur"},
                    {min:6,max:20,message:"密码长度在6-20之间",trigger:"blur"}
                ],
                inputCaptcha:[
                    {required:true, validator:validateCaptcha,trigger:"blur"}
                ]
            },
            equipment:"", // 判断是移动端还是PC端
            inputCaptcha:"",
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
                this.equipment = "mobile";
            } else {
                this.equipment = "computer";
            } 
        },
        // 刷新验证码
        refreshCaptcha(){
            this.$refs.captcha.src = "http://localhost:3001/api/user/getCaptcha?d=" + Math.random();
        },
        // 登录
        submitForm(formName){
            this.$refs[formName].validate(valid => {
                if(valid){
                    wsmLoading.startLoading("正在登录,请稍候...")
                    setTimeout(() => {
                         if(this.inputCaptcha == this.getCookie("captcha")){
                             this.$axios.post("http://localhost:3001/api/admin/login", this.loginForm)
                                .then(res => {
                                    if(res){
                                        // 解析token
                                        const {token} = res.data;
                                        localStorage.setItem("adminToken", token);
                                        const decoded = jwt_decode(token);
                                        this.$store.commit("isAdminAuthorization", true);
                                        this.$store.commit("setAdmin", decoded);
                                        this.$router.push("/admin/index");
                                    }else{
                                        this.refreshCaptcha();
                                    }
                                })
                                .catch(error => console.log(error))
                         }else{
                            wsmLoading.endLoading();
                            this.$Modal.confirm({
                                title:"错误",
                                content:"你输入的验证码有误,请重新输入验证码~",
                                type:"error",
                                onOk:()=>{
                                    // this.refreshCaptcha();
                                }
                            })
                         }
                    }, 900)
                    
                }
            })
        },
        // 获取验证码cookie
        getCookie(cname){
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++){
                var c = ca[i].trim();
                if (c.indexOf(name)==0) return c.substring(name.length,c.length);
            }
            return "";
        },
        // 去首页
        toHome(){
            this.$router.push("/home");
        }
    },
    created(){
        this.browserRedirect();
        console.log(this.equipment)
        if(this.equipment == "mobile"){
            this.$Modal.confirm({
                title:"提示",
                content:"由于后台管理系统对移动端的兼容性比较差,请转至PC端登录,是否离开稍后去电脑登录?",
                okText:"确定",
                cancelText:"取消",
                onOk:()=>{
                    this.$router.push("/login");
                },
                onCancel:()=>{
                    console.log("祝您好运!");
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.adminlogin{
    width: 100%;
    font-weight: 700;
    background-color: #fcfcfc;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    height: 100vh;
    padding: 40px 200px;
    display: flex;
    align-items: flex-start;
    justify-content: center;

    // 主区域
    .form-box{
        width: 340px;
        padding: 0px 10px;
        
        // logo
        .login-logo{
            // text-align: center;
            width: 100%;
            padding: 0px 110px;
            img{
                width: 100%;
                cursor: pointer;
            }
        }

        // 标题
        .login-title{
            width: 100%;
            text-align: center;
            padding: 20px 0px;
            font-size: 20px;
            font-weight: 600;
            color: #fff;
        }

        // 表单
        .login-form{
            width: 100%;
            background-color: rgba(255, 255, 255,.9);
            border: 1px solid #cdcdcd;
            padding: 10px 15px;
            border-radius: 5px;

            .login-btn{
                width: 100%;
                background: linear-gradient(to bottom, rgba(47, 228, 89, 0.9),#26a744);
                font-weight: 600;
            }
            .login-btn:hover{
                background-color: rgb(94, 255, 132);
            }

            // 验证码区域
            .yzm{
                display:flex;
                align-content:center;
                input{
                    width: 160px;
                    height: 32px;
                    outline: none;
                    border: 1px solid #eee;
                    padding: 2px 15px;
                    border-radius: 5px;
                    font-size: 13px;
                }
                ::-webkit-input-placeholder{
                    color:#bbb;
                }
            }
        }
       

        // 返回普通用户登录
        .back-userlogin{
            width: 100%;
            height: 50px;
            background-color: rgba(255,255,255,.8);
            line-height: 50px;
            text-align: center;
            font-weight:400; 
            border: 1px solid #ddd;
            margin-top: 10px;
            border-radius: 5px;

            span{
                color: #0366d6;
            }
            span:hover{
                text-decoration: underline;
            }
        }
        
    }
}

// 背景
.login-bg1{
    background-image: url(../../assets/imgs/bg1.jpg);
}
.login-bg2{
    background-image: url(../../assets/imgs/bg2.jpg);
}
.login-bg3{
    background-image: url(../../assets/imgs/bg3.jpg);
}
.login-bg4{
    background-image: url(../../assets/imgs/bg4.jpg);
}

@media screen and (max-width: 600px){
    .adminlogin{
        padding: 40px 0px;
        background-size: 150% 100%;
    }
}
</style>
