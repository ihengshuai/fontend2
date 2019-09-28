<template>
    <div class="userregister" :class="backgroundImage">
        <div class="form-box">
             <div class="register-logo">
                 <img src="../../assets/logo/favicon.png" @click="toHome()" alt="">
             </div>
             <!-- <div class="register-title">
                 Sign in to WebSite
             </div> -->
            <el-form class="register-form" label-position="top" size="small" :inline-message="inlinemessage" :model="registerForm" :rules="registerRule" ref="registerForm" label-width="100px">
                <el-form-item label="Email address" prop="email">
                    <el-input type="text" v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="Your name" prop="username">
                    <el-input type="text" v-model="registerForm.username" placeholder="请输入你的名字"></el-input>
                </el-form-item>
                <el-form-item label="Your phone" prop="phone">
                    <el-input type="text" v-model="registerForm.phone" placeholder="请输入你的手机号"></el-input>
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input type="password" show-password v-model="registerForm.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="Check password" prop="passwdCheck">
                    <el-input type="password" show-password v-model="registerForm.passwdCheck" placeholder="请再次输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="register-btn" type="primary" @click="submitForm('registerForm')">Sign up for website</el-button>
                </el-form-item>
            </el-form>
            <div class="reset-account">
                已经有账户?<span class="create-account"><router-link to="/login"> 返回登录</router-link></span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"userregister",
    data(){
        const validatePassCheck = (rule, value, callback) => {
            if (value !== this.registerForm.password) {
                callback(new Error('两次密码不一致!'));
            } else {
                callback();
            }
        };
        const validatePhone = (rule, value, callback) => {
            const telRule = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
            if(!(telRule.test(value))){
                callback(new Error("非法手机格式"))
            }else{
                callback();
            }
        }
        return{
            inline:true,
            inlinemessage:false,
            backgroundImage: `register-bg${Math.floor(Math.random() * 4 + 1)}`,
            registerForm:{
                email:"",
                username:"",
                phone:"",
                password:"",
                passwdCheck:""
            },
            registerRule:{
                email:[
                    {required:true,message:"账户名不能为空",trigger:"blur"},
                    {type:"email",message:"请输入正确的邮箱",trigger:"blur"},
                ],
                username:[
                    {required:true,message:"用户名不能为空",trigger:"blur"},
                    {min:2,max:20,message:"用户名长度在2-20之间",trigger:"blur"}
                ],
                phone:[
                    {required:true,message:"手机号不能为空", trigger:"blur"},
                    {validator:validatePhone,trigger:"blur"}
                ],
                password:[
                    {required:true,message:"密码不能为空",trigger:"blur"},
                    {min:6,max:20,message:"密码长度在6-20之间",trigger:"blur"}
                ],
                passwdCheck:[
                    {required:true,message:"请验证你的密码",trigger:"blur"},
                    {validator:validatePassCheck,trigger:"blur"}
                ]
            }
        }
    },
    methods:{
        // 注册账号
        submitForm(formName){
            this.$refs[formName].validate(valid => {
                if(valid){
                    this.$axios.post("http://localhost:3001/api/user/register", this.registerForm)
                                .then(res => {
                                    if(res){
                                        this.$Message.success("注册成功:" + this.registerForm.email)
                                        this.$router.push("/login");
                                    }
                                }).catch(err => console.log(err))
                }
            })
        },
        // 去首页
        toHome(){
            this.$router.push("/home");
        }
    }
}
</script>

<style lang="less" scoped>
.userregister{
    width: 100%;
    font-weight: 700;
    background-color: #fcfcfc;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    height: 100vh;
    padding: 20px 200px;
    display: flex;
    align-items: flex-start;
    justify-content: center;

    // 主区域
    .form-box{
        width: 340px;
        padding: 0px 10px;
        
        // logo
        .register-logo{
            // text-align: center;
            width: 100%;
            padding: 0px 110px;
            img{
                width: 100%;
                cursor: pointer;
            }
        }

        // 标题
        .register-title{
            width: 100%;
            text-align: center;
            padding: 20px 0px;
            font-size: 20px;
            font-weight: 600;
            color: #fff;
        }

        // 表单
        .register-form{
            width: 100%;
            background-color: rgba(255, 255, 255,.9);
            border: 1px solid #cdcdcd;
            padding: 10px 15px;
            border-radius: 5px;

            .register-btn{
                width: 100%;
                background: linear-gradient(to bottom, rgba(47, 228, 89, 0.9),#26a744);
                font-weight: 600;
            }
            .register-btn:hover{
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
.register-bg1{
    background-image: url(../../assets/imgs/bg1.jpg);
}
.register-bg2{
    background-image: url(../../assets/imgs/bg2.jpg);
}
.register-bg3{
    background-image: url(../../assets/imgs/bg3.jpg);
}
.register-bg4{
    background-image: url(../../assets/imgs/bg4.jpg);
}

@media screen and (max-width: 600px){
    .userregister{
        padding: 20px 0px;
        background-size: 150% 100%;
    }
}
</style>
