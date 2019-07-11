<template>
    <div class="userinfo">
        <div class="content">
            <!-- pc端 -->
            <Tabs class="tab-box">
                <TabPane label="个人资料" icon="ios-contact">
                    <div class="alltab tab1">
                        <Row>
                            <Col span="4" style="text-align:right;padding-right:20px;font-weight:600;">用户头像:</Col>
                            <Col span="16" style="padding-left:20px;">
                                <Avatar shape="square" :src="userAvatar" size="default" />
                            </Col>
                            <Col span="4"></Col>
                        </Row>
                        <Row>
                            <Col span="4" style="text-align:right;padding-right:20px;font-weight:600;">用户名字:</Col>
                            <Col span="16" style="padding-left:20px;font-size:18px;font-weight:500;color:#E9232C;">{{getUserInfo.username}} (不可更改)</Col>
                            <Col span="4"></Col>
                        </Row>
                        <Row>
                            <Col span="4" style="text-align:right;padding-right:20px;font-weight:600;">账号:</Col>
                            <Col span="16" style="padding-left:20px;color:#E9232C;">{{getUserInfo.email}}(不可更改)</Col>
                            <Col span="4"></Col>
                        </Row>
                        <Row>
                            <Col span="4" style="text-align:right;padding-right:20px;font-weight:600;">手机号:</Col>
                            <Col span="16" style="padding-left:20px;">{{getUserInfo.phone}}</Col>
                            <Col span="4"></Col>
                        </Row>
                        <Row>
                            <Col span="4" style="text-align:right;padding-right:20px;font-weight:600;">账户余额:</Col>
                            <Col span="16" style="padding-left:20px;">{{getUserInfo.money}}元</Col>
                            <Col span="4"></Col>
                        </Row>
                        <Row>
                            <Col span="4" style="text-align:right;padding-right:20px;font-weight:600;">签到次数:</Col>
                            <Col span="16" style="padding-left:20px;">{{getUserInfo.signcount}}次</Col>
                            <Col span="4"></Col>
                        </Row>
                        <Row>
                            <Col span="4" style="text-align:right;padding-right:20px;font-weight:600;">最近签到:</Col>
                            <Col span="16" style="padding-left:20px;">{{getUserInfo.signdate}}</Col>
                            <Col span="4"></Col>
                        </Row>
                        <Row>
                            <Col span="4" style="text-align:right;padding-right:20px;font-weight:600;">账户ID:</Col>
                            <Col span="16" style="padding-left:20px;">{{getUserInfo.id}}</Col>
                            <Col span="4"></Col>
                        </Row>
                        <Row>
                            <Col span="4" style="text-align:right;padding-right:20px;font-weight:600;">注册时间:</Col>
                            <Col span="16" style="padding-left:20px;">{{getUserInfo.date}}</Col>
                            <Col span="4"></Col>
                        </Row>
                        <Row>
                            <Col span="16">
                                <Button type="success" @click="editUserInfo()" style="font-size:16px;" long>编辑资料</Button>
                            </Col>
                        </Row>
                    </div>
                </TabPane>
                <TabPane label="购买课程" icon="ios-book">
                    <!-- 有购买记录 -->
                    <div class="alltab tab2" v-if="getUserInfo.buycount > 0 ? true : false">
                        <Row>
                            <Col span="6" style="text-align:right;padding-right:20px;font-weight:600;">HTML5课程:</Col>
                            <Col span="14" style="padding-left:20px;font-size:18px;font-weight:500;"><span>{{getUserInfo.html5 == 1 ? "已购" : "没有购买"}}</span></Col>
                            <Col span="4"></Col>
                        </Row>
                        <Row>
                            <Col span="6" style="text-align:right;padding-right:20px;font-weight:600;">CSS课程:</Col>
                            <Col span="14" style="padding-left:20px;font-size:18px;font-weight:500;">{{getUserInfo.css == "1" ? "已购" : "没有购买"}}</Col>
                            <Col span="4"></Col>
                        </Row>
                        <Row>
                            <Col span="6" style="text-align:right;padding-right:20px;font-weight:600;">JavaScript课程:</Col>
                            <Col span="14" style="padding-left:20px;font-size:18px;font-weight:500;">{{getUserInfo.javascript == "1" ? "已购" : "没有购买"}}</Col>
                            <Col span="4"></Col>
                        </Row>
                        <Row>
                            <Col span="6" style="text-align:right;padding-right:20px;font-weight:600;">购买时间:</Col>
                            <Col span="14" style="padding-left:20px;font-size:18px;font-weight:500;">{{Number.isInteger(parseInt(getUserInfo.startdate)) ? getUserInfo.startdate : "已过期"}}</Col>
                            <Col span="4"></Col>
                        </Row>
                        <Row>
                            <Col span="6" style="text-align:right;padding-right:20px;font-weight:600;">剩余天数:</Col>
                            <Col span="14" style="padding-left:20px;color:#E9232C;font-size:18px;font-weight:500;">{{timeout}}</Col>
                            <Col span="4"></Col>
                        </Row>
                        <Row>
                            <Col span="6" style="text-align:right;padding-right:20px;font-weight:600;">购买课程次数:</Col>
                            <Col span="14" style="padding-left:20px;font-size:18px;font-weight:500;">{{getUserInfo.buycount != 0 ? parseInt(getUserInfo.buycount) : "无购买记录"}}</Col>
                            <Col span="4"></Col>
                        </Row>
                        <Row>
                            <Col span="14">
                                <Button type="success" @click="opencoursemodal()" style="font-size:16px;" long>继续购买</Button>
                            </Col>
                        </Row>
                    </div>
                    <!-- 无购买记录 -->
                    <div class="nobuy" v-if="getUserInfo.buycount > 0 ? false : true">
                        <div class="notice">你还没有购买任何课程赶紧购买吧</div>
                        <Row style="display:flex;align-items:center;justify-content:center;">
                            <Col span="10">
                                <Button type="success" @click="opencoursemodal()" style="font-size:16px;" long>去购买</Button>
                            </Col>
                        </Row>
                    </div>
                </TabPane>
                <TabPane label="修改密码" icon="ios-key">
                    <div class="alltab tab3">
                        <el-form :model="newpwd" :rules="newpwdRule" label-width="100px" ref="newpwdForm">
                            <el-form-item label="旧密码" prop="oldpassword">
                                <el-input show-password type="password" style="width:300px;" placeholder="请输入旧密码" v-model="newpwd.oldpassword"></el-input>
                            </el-form-item>
                            <el-form-item label="新密码" prop="newpassword1">
                                <el-input show-password placeholder="请输入新密码" type="password" style="width:300px;"  v-model="newpwd.newpassword1"></el-input>
                            </el-form-item>
                            <el-form-item label="确认新密码" prop="newpassword2">
                                <el-input show-password type="password" placeholder="请确认密码" style="width:300px;" v-model="newpwd.newpassword2"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitnewpwdForm('newpwdForm')">提交</el-button>
                                <el-button @click="resetnewpwdForm('newpwdForm')">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </TabPane>
            </Tabs>

            <!-- 移动端 -->
            <Collapse simple id="mobile-box" accordion>
                <!-- 个人资料 -->
                <Panel name="1" :hide-arrow="true">
                    <Icon type="md-contact" style="color:#2b85e4" />
                    <span style="color:#2b85e4">个人资料</span>
                    <p slot="content">
                        <Row>
                            <Col span="6" style="text-align:right;font-weight:600;">用户头像:</Col>
                            <Col span="18" style="padding-left:20px;">
                                <Avatar shape="square" :src="userAvatar" size="default" />
                            </Col>
                        </Row>
                        <Row>
                            <Col span="6" style="text-align:right;font-weight:600;">用户名字:</Col>
                            <Col span="18" style="padding-left:20px;font-size:15px;color:#E9232C;">{{getUserInfo.username}} (不更改)</Col>
                        </Row>
                        <Row>
                            <Col span="6" style="text-align:right;font-weight:600;">账号:</Col>
                            <Col span="18" style="padding-left:20px;font-size:15px;color:#E9232C;">{{getUserInfo.email}}(不可更改)</Col>
                        </Row>
                        <Row>
                            <Col span="6" style="text-align:right;font-weight:600;">手机号:</Col>
                            <Col span="18" style="padding-left:20px;font-size:15px;">{{getUserInfo.phone}}</Col>
                        </Row>
                        <Row>
                            <Col span="6" style="text-align:right;font-weight:600;">账户余额:</Col>
                            <Col span="18" style="padding-left:20px;font-size:15px;">{{getUserInfo.money}}元</Col>
                        </Row>
                        <Row>
                            <Col span="6" style="text-align:right;font-weight:600;">签到次数:</Col>
                            <Col span="18" style="padding-left:20px;font-size:15px;">{{getUserInfo.signcount}}次</Col>
                        </Row>
                        <Row>
                            <Col span="6" style="text-align:right;font-weight:600;">最近签到:</Col>
                            <Col span="18" style="padding-left:20px;font-size:15px;">{{getUserInfo.signdate}}</Col>
                        </Row>
                        <Row>
                            <Col span="6" style="text-align:right;font-weight:600;">账户ID:</Col>
                            <Col span="18" style="padding-left:20px;font-size:15px;">{{getUserInfo.id}}</Col>
                        </Row>
                        <Row>
                            <Col span="6" style="text-align:right;font-weight:600;">注册时间:</Col>
                            <Col span="18" style="padding-left:20px;font-size:15px;">{{getUserInfo.date}}</Col>
                        </Row>
                        <Row>
                            <Col span="24">
                                <Button type="success" @click="editUserInfo()" style="font-size:16px;" long>编辑资料</Button>
                            </Col>
                        </Row>
                    </p>
                </Panel>
                <!-- 购买课程 -->
                <Panel name="2" :hide-arrow="true">
                    <Icon type="ios-book" style="color:#2b85e4"/>
                    <span style="color:#2b85e4">购买课程</span>
                    <p slot="content">
                        <Row>
                            <Col span="10" style="text-align:right;font-weight:600;">HTML5课程:</Col>
                            <Col span="14" style="padding-left:10px;font-size:16px;font-weight:500;"><span>{{getUserInfo.html5 == 1 ? "已购" : "没有购买"}}</span></Col>
                        </Row>
                        <Row>
                            <Col span="10" style="text-align:right;font-weight:600;">CSS课程:</Col>
                            <Col span="14" style="padding-left:10px;font-size:16px;font-weight:500;">{{getUserInfo.css == "1" ? "已购" : "没有购买"}}</Col>
                        </Row>
                        <Row>
                            <Col span="10" style="text-align:right;font-weight:600;">JavaScript课程:</Col>
                            <Col span="14" style="padding-left:10px;font-size:16px;font-weight:500;">{{getUserInfo.javascript == "1" ? "已购" : "没有购买"}}</Col>
                        </Row>
                        <Row>
                            <Col span="10" style="text-align:right;font-weight:600;">购买时间:</Col>
                            <Col span="14" style="padding-left:10px;font-size:16px;font-weight:500;">{{Number.isInteger(parseInt(getUserInfo.startdate)) ? getUserInfo.startdate : "已过期"}}</Col>
                        </Row>
                        <Row>
                            <Col span="10" style="text-align:right;font-weight:600;">剩余天数:</Col>
                            <Col span="14" style="padding-left:10px;color:#E9232C;font-size:16px;font-weight:500;">{{timeout}}</Col>
                        </Row>
                        <Row>
                            <Col span="10" style="text-align:right;font-weight:600;">购买课程次数:</Col>
                            <Col span="14" style="padding-left:10px;font-size:16px;font-weight:500;">{{getUserInfo.buycount != 0 ? parseInt(getUserInfo.buycount) : "无购买记录"}}</Col>
                        </Row>
                        <Row>
                            <Col span="24">
                                <Button type="success" @click="opencoursemodal()" style="font-size:16px;" long>立即购买</Button>
                            </Col>
                        </Row>
                    </p>
                </Panel>
                <!-- 修改密码 -->
                <Panel name="3" :hide-arrow="true">
                    <Icon type="ios-key" style="color:#2b85e4"/>
                    <span style="color:#2b85e4">修改密码</span>
                    <p slot="content">
                        <el-form label-position="top" size="small" :model="newpwd" :rules="newpwdRule" label-width="100px" ref="newpwdForm">
                            <el-form-item label="旧密码" prop="oldpassword">
                                <el-input show-password type="password" style="width:300px;" placeholder="请输入旧密码" v-model="newpwd.oldpassword"></el-input>
                            </el-form-item>
                            <el-form-item label="新密码" prop="newpassword1">
                                <el-input show-password placeholder="请输入新密码" type="password" style="width:300px;"  v-model="newpwd.newpassword1"></el-input>
                            </el-form-item>
                            <el-form-item label="确认新密码" prop="newpassword2">
                                <el-input show-password type="password" placeholder="请确认密码" style="width:300px;" v-model="newpwd.newpassword2"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <Button type="success" long @click="submitnewpwdForm('newpwdForm')">提交</Button>
                                <Button type="error" style="margin-top:5px;" long @click="resetnewpwdForm('newpwdForm')">重置</Button>
                            </el-form-item>
                        </el-form>
                    </p>
                </Panel>
            </Collapse>

            <!-- 编辑资料模态框 -->
            <Modal v-model="editmodal" width="400">
                <p slot="header" style="color:#f60;">
                    <Icon type="ios-information-circle"></Icon>
                    <span> 编辑资料</span>
                </p>
                <el-form :model="newUserInfo" :rules="editRule" ref="editForm" label-width="100px" class="editForm">
                    <el-form-item label="换头像:" prop="avatar">
                        <Upload
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :max-size="10000"
                            multiple
                            type="drag"
                            :on-success="handleSuccess"
                            action="http://localhost:3001/api/user/upload"
                            style="display:block;width:44px;">
                            <span style="float:left;">
                                <Avatar :src="newUserInfo.avatar" size="large" />
                            </span>
                        </Upload>
                    </el-form-item>
                    <el-form-item label="手机号:" prop="phone">
                        <el-input type="text" v-model="newUserInfo.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="余额:" prop="money">
                        <el-input v-model="newUserInfo.money"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <Button type="error" size="large" long @click="calcelEdit()">取消修改</Button>
                </div>
                <div slot="footer" style="margin-top:5px;">
                    <Button type="success" size="large" long @click="submitEdit()">确定修改</Button>
                </div>
            </Modal>
            <!-- 购买课程模态框 -->
            <Modal v-model="coursemodal" width="400">
                <p slot="header" style="color:#f60;">
                    <Icon type="ios-information-circle"></Icon>
                    <span>购买课程</span>
                </p>
                <div class="content">
                    <Row>
                        <Col span="16" style="padding-left:40px;">
                            <Icon type="logo-html5" />
                            HTML5课程:
                        </Col>
                        <Col span="8">
                            <Checkbox  v-model="buycourseInfo.html5.hasbuy">
                                <span style="color:#bbb;">{{buycourseInfo.html5.price}}/月</span>
                            </Checkbox>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="16" style="padding-left:40px;">
                            <Icon type="logo-css3" />
                            CSS课程:
                        </Col>
                        <Col span="8">
                            <Checkbox  v-model="buycourseInfo.css.hasbuy">
                                <span style="color:#bbb;">{{buycourseInfo.css.price}}/月</span>
                            </Checkbox>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="16" style="padding-left:40px;">
                            <Icon type="logo-nodejs" />
                            JavaScript课程
                        </Col>
                        <Col span="8">
                            <Checkbox  v-model="buycourseInfo.javascript.hasbuy">
                                <span style="color:#bbb;">{{buycourseInfo.javascript.price}}/月</span>
                            </Checkbox>
                        </Col>
                    </Row>
                </div>
                <div slot="footer">
                    <Button type="error" size="large" long @click="calcelbuycourse()">取消</Button>
                </div>
                <div slot="footer" style="margin-top:5px;">
                    <Button type="success" size="large" long @click="submitbuy()">购买</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import "../myplugin/Date";
import { parse } from 'path';
import { setTimeout } from 'timers';
export default {
    name:"userinfo",
    components:{},
    data(){
        // 验证手机号
        const validatePhone = (rule, value, callback) => {
            const telRule = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
            if(!(telRule.test(value))){
                callback(new Error("非法手机格式"))
            }else{
                callback();
            }
        };
        // 验证资金
        const validateMoney = (rule, value, callback) => {
            const moneyRule = /^[0-9]*$/;
            if(!(moneyRule.test(value))){
                callback(new Error('请输入正确的资金'))
            }else{
                callback();
            }
        };
        // 验证密码
        const validatePassCheck = (rule, value, callback) => {
            if (value !== this.newpwd.newpassword1) {
                callback(new Error('两次密码不一致!'));
            } else {
                callback();
            }
        };
        return{
            newpwd:{
                oldpassword:'',
                newpassword1:"",
                newpassword2:"",
            },
            userAvatar:"",
            editmodal:false,  // 编辑资料模态框状态
            newUserInfo:{   // 新编辑的用户信息
                avatar:"",
                phone:"",
                money:""
            },
            coursemodal:false, //购买课程模态框
            buycourseInfo:{   // 编辑购买课程信息
                html5:{
                    hasbuy:false,
                    price:600
                },
                css:{
                    hasbuy:false,
                    price:650
                },
                javascript:{
                    hasbuy:false,
                    price:1600
                }
            },
            avatarName:"",
            labelPosition:"top",
            timeout:'', //过期时间
            // 编辑信息规则
            editRule:{
                phone:[
                    {required:true,message:"手机号不能为空",trigger:"blur"},
                    {validator:validatePhone,trigger:"blur"},
                ],
                money:[
                    {required:true,message:"余额不能为空",trigger:"blur"},
                    {validator:validateMoney,trigger:"blur"}
                ]
            },
            // 修改密码规则
            newpwdRule:{
                oldpassword:[
                    {required:true,message:"旧密码不能为空",trigger:"blur"}
                ],
                newpassword1:[
                    {required:true,message:"新密码不能为空",trigger:"blur"},
                    {min:6,max:20,message:"密码长度在6-20之间",trigger:"blur"}
                ],
                newpassword2:[
                    {required:true,message:"请核对新密码",trigger:"blur"},
                    {validator:validatePassCheck,trigger:"blur"}
                ]
            }
        }
    },
    methods:{
        // 确认修改密码
        submitnewpwdForm(formName){
            this.$refs[formName].validate(valid => {
                if(valid){
                    const params = {
                        email:this.getUserInfo.email,
                        oldpassword:this.newpwd.oldpassword,
                        newpassword:this.newpwd.newpassword1
                    };
                    this.$axios.post("http://localhost:3001/api/user/modpwd", params)
                            .then(res => {
                                if(res){
                                    this.$Message.success("修改成功")
                                    setTimeout(() => {
                                        this.$Message.warning("为确保账户安全,请立即重新登录!");
                                        setTimeout(() => {
                                            this.$router.push("/login");
                                            localStorage.removeItem("jwtToken");
                                        }, 3000)
                                    }, 2000);
                                }
                            }).catch(err => console.log(err))
                }
            })
        },
        // 重置修改密码表单
        resetnewpwdForm(formName){
            this.$refs[formName].resetFields();
        },
        // 取消购买课程时
        calcelbuycourse(){
            this.coursemodal = false;
            this.buycourseInfo.html5.hasbuy = false;
            this.buycourseInfo.css.hasbuy = false;
            this.buycourseInfo.javascript.hasbuy = false;
        },
        // 提交购买课程时
        submitbuy(){
            var pay = 0;
                this.buycourseInfo.javascript.hasbuy ? pay += this.buycourseInfo.javascript.price : pay += 0;
                this.buycourseInfo.html5.hasbuy ? pay += this.buycourseInfo.html5.price : pay += 0;
                this.buycourseInfo.css.hasbuy ? pay += this.buycourseInfo.css.price : pay += 0;
            if(pay > 0){
                if(pay > this.getUserInfo.money){
                    this.$Message.warning({
                        content:"余额不足,请充值",
                        duration:1
                    })
                }else{
                    this.$Modal.confirm({
                            title:'支付提示',
                            content:`<p>这将支付${pay}人民币, 是否继续?</p>`,
                            okText: '确定',
                            cancelText: '取消',
                            type: 'warning',
                            onOk: () => {
                                const buy = {};
                                this.buycourseInfo.javascript.hasbuy ? buy.javascript = 1 : buy.javascript = 0;
                                this.buycourseInfo.css.hasbuy ? buy.css = 1 : buy.css = 0;
                                this.buycourseInfo.html5.hasbuy ? buy.html5 = 1 : buy.html5 = 0;
                                buy.buycount = parseInt(this.getUserInfo.buycount) + 1;
                                buy.startdate = new Date().format("yyyy-MM-dd HH:mm:ss");
                                buy.enddate = 30;
                                buy.money = this.getUserInfo.money - pay;
                                buy.email = this.getUserInfo.email;
                                this.$axios.post("http://localhost:3001/api/user/updata/token", buy)
                                    .then(res => {
                                        localStorage.setItem("jwtToken", res.data.token)
                                        const decode = jwt_decode(res.data.token);
                                        this.$store.commit("user", decode);
                                        this.coursemodal = false;
                                        this.$Message.info("购买成功");
                                    })
                            },
                            onCancel: () => {
                                this.$Message.info('取消支付');
                            }
                        });
                }
            }else{
                this.$Message.error({
                    content:"请选择课程",
                    duration:1
                })
            }
        },
        // 打开购买课程模态框
        opencoursemodal(){
            this.coursemodal = true;
        },
        // 编辑资料时改变模态框状态
        editUserInfo(){
            this.editmodal = true;
        },
        // 提交修改信息时
        submitEdit(){
            this.newUserInfo.email = this.getUserInfo.email;
            this.newUserInfo.avatar = this.avatarName;
            this.$axios.post("http://localhost:3001/api/user/updata/token", this.newUserInfo)
                            .then(res => {
                                localStorage.setItem("jwtToken", res.data.token)
                                const decoded = jwt_decode(res.data.token);
                                this.$store.commit("user", decoded);
                                this.$store.commit("isAuthorizated", true);
                                this.$store.commit("avatar", decoded.avatar);
                                this.editmodal = false;
                                this.newUserInfo.avatar = require("../assets/avatar/" + this.avatarName);
                                this.$Message.info("修改成功");
                            })
        },
        // 取消修改信息
        calcelEdit(){
            this.newUserInfo.avatar = require("../assets/avatar/" + this.$store.getters.user.avatar);
            this.newUserInfo.phone = this.$store.getters.user.phone;
            this.newUserInfo.money = this.$store.getters.user.money;
            this.editmodal = false;
        },
        // 头像上传成功时
        handleSuccess (res, file) {
            this.avatarName = file.name;
            this.newUserInfo.avatar = require("../assets/avatar/" + file.name);
        },
    },
    created(){
        // console.log(this.newUserInfo)
        const start = parseInt(((this.$store.getters.user.startdate.split(" "))[0].split("-"))[2]);
        const curdate = (new Date()).getDate();
        if(this.$store.getters.user.enddate == 0){
            this.timeout = 0;
        }else{
            if(start > curdate){
                this.timeout = start - curdate - 1;
                if(this.timeout == 0){
                    const unlimit = {
                        javascript:"f",
                        html5:"f",
                        css:"f",
                        startdate:"f",
                        enddate:"f",
                        email:this.$store.getters.user.email
                    }
                    this.timeout = "已过期";
                    this.$axios.post("http://localhost:3001/api/user/updata/token",unlimit)
                        .then(res => {
                            localStorage.setItem("jwtToken", res.data.token)
                            const decode = jwt_decode(res.data.token);
                            this.$store.commit("user", decode);
                        })
                }
            }else{
                this.timeout = 30 - curdate + start;
                if(this.timeout == 0){
                    const unlimit = {
                        javascript:"f",
                        html5:"f",
                        css:"f",
                        startdate:"f",
                        enddate:"f",
                        email:this.$store.getters.user.email
                    }
                    this.timeout = "已过期";
                    this.$axios.post("http://localhost:3001/api/user/updata/token",unlimit)
                        .then(res => {
                            localStorage.setItem("jwtToken", res.data.token)
                            const decode = jwt_decode(res.data.token);
                            this.$store.commit("user", decode);
                        })
                }
            }
        }
    },
    computed:{
        // 获取用户的所有信息
        getUserInfo:{
            get(){
                this.newUserInfo.avatar = require("../assets/avatar/" + this.$store.getters.user.avatar);
                this.newUserInfo.phone = this.$store.getters.user.phone;
                this.newUserInfo.money = this.$store.getters.user.money;
                this.userAvatar = require("../assets/avatar/" + this.$store.getters.user.avatar)
                return this.$store.getters.user;
            }
        }
    }
}
</script>

<style lang="less" scoped>
.userinfo{
    background: #cdc5b4;
    padding: 20px 300px;
    height: 70vh;

    .content{
        width: 100%;
         
        // pc端 Tab标签
        .tab-box{
            .alltab{
                // width: 100%;
                min-width: 700px;
                color: steelblue;
                font-size: 19px;

                .ivu-row{
                    margin-bottom: 10px;
                }
            
            // 修改密码表单
            .tab3{
                width: 100%;
                padding: 0px 20px;
            }

            }

            .nobuy{
                .notice{
                    color: #ed4014;
                    font-size: 20px;
                    text-align: center;
                    height: 100px;
                    line-height: 100px;
                }
                
            }
        }
    }
}
@media screen and (max-width: 2500px){
    .userinfo{
        padding: 20px 300px;
        #mobile-box{
            display: none;
        }
    }
}
@media screen and (max-width: 1200px){
    .userinfo{
        padding: 20px 150px;
        #mobile-box{
            display: none;
        }
    }
}
@media screen and (max-width: 1000px){
    .userinfo{
        padding: 20px 100px;
        #mobile-box{
            display: none;
        }
    }
}
@media screen and (max-width: 800px){
    .userinfo{
        padding: 20px 50px;
        #mobile-box{
            display: none;
        }
    }
}
@media screen and (max-width: 700px){
    .userinfo{
        padding: 10px 5px;

    }
    #mobile-box{
        display: none;
    }
}
@media screen and (max-width: 600px){
    .userinfo{
        background-color: #fff;
        padding: 20px 20px;
        // pc端隐藏
        .tab-box{
            display: none;
        }
        #mobile-box{
            font-size: 16px;
            display: block;
            width: 100%;

            .ivu-row{
                margin-bottom: 8px;
            }
        }
        
    }
}


</style>
