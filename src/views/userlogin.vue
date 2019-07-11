<template>
    <div class="userlogin" :class="backgroundImage">
         <div class="form-box">
             <div class="login-logo">
                 <img src="../assets/logo/favicon.png" @click="toHome()" alt="">
             </div>
             <div class="login-title">
                 Sign in to WebSite
             </div>
            <el-form class="login-form" label-position="top" size="small" :inline-message="inlinemessage" :model="loginForm" :rules="loginRule" ref="loginForm" label-width="100px">
                <el-form-item label="Username or email address" prop="email">
                    <el-input type="text" v-model="loginForm.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input type="password" show-password v-model="loginForm.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="login-btn" type="primary" @click="submitForm('loginForm')">Sign in</el-button>
                </el-form-item>
            </el-form>
            <div class="reset-account">
                还没有账号?<span class="create-account"><router-link to="/register"> 创建一个账户</router-link></span>
            </div>
         </div>
    </div>
</template>

<script>
import jwt_decode from 'jwt-decode';
import { decode } from 'punycode';
export default {
    name:"userlogin",
    data(){
        return{
            inline:true,
            inlinemessage:false,
            backgroundImage: `login-bg${Math.floor(Math.random() * 4 + 1)}`,
            loginForm:{
                email:"",
                password:"",
            },
            loginRule:{
                email:[
                    {required:true,message:"账户名不能为空",trigger:"blur"},
                    {type:"email",message:"请输入正确的邮箱",trigger:"blur"},
                ],
                password:[
                    {required:true,message:"密码不能为空",trigger:"blur"},
                    {min:6,max:20,message:"密码长度在6-20之间",trigger:"blur"}
                ]
            }
        }
    },
    methods:{
        // 登录
        submitForm(formName){
            this.$refs[formName].validate(valid => {
                if(valid){
                    this.$axios.post("http://localhost:3001/api/user/login", this.loginForm)
                                .then(res => {
                                    if(res){
                                        // 解析token
                                        const {token} = res.data;
                                        localStorage.setItem("jwtToken", token);
                                        const decoded = jwt_decode(token);
                                        decoded.avatar ? decoded.avatar = decoded.avatar : decoded.avatar = "default.png";
                                        // 存储vuex中
                                        this.$store.commit("user", decoded);
                                        this.$store.commit("isAuthorizated", true);
                                        this.$store.commit("avatar", decoded.avatar);
                                        this.$Message.success(`欢迎您:${decoded.username}(${decoded.email})`)
                                        this.$router.push("/");
                                        }
                                })
                                .catch(error => console.log(error))
                }
            })
        },
        // 去首页
        toHome(){
            this.$router.push("/home");
        }
    },
}
</script>

<style lang="less" scoped>
.userlogin{
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
        }
       

        // 注册账号
        .reset-account{
            width: 100%;
            height: 50px;
            background-color: rgba(255,255,255,.8);
            line-height: 50px;
            text-align: center;
            font-weight:400; 
            border: 1px solid #ddd;
            margin-top: 10px;
            border-radius: 5px;

            .create-account{
                color: #0366d6;
            }
            .create-account:hover{
                text-decoration: underline;
            }
        }
        
        
    }
}

// 背景
.login-bg1{
    background-image: url(../assets/imgs/bg1.jpg);
}
.login-bg2{
    background-image: url(../assets/imgs/bg2.jpg);
}
.login-bg3{
    background-image: url(../assets/imgs/bg3.jpg);
}
.login-bg4{
    background-image: url(../assets/imgs/bg4.jpg);
}

@media screen and (max-width: 600px){
    .userlogin{
        padding: 40px 0px;
        background-size: 150% 100%;
    }
}
</style>
