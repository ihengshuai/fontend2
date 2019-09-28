<template>
    <div class="manageusers">
        <!-- 页头 -->
        <Row style="padding:10px 0px 30px 0px;">
            <Col style="padding:0px 0px 0px 45px;" span="3">
                <Select v-model="minMoney" :placeholder="String(minMoney)" style="width:100px">
                    <Option v-for="item in moneyRange" :value="item.value" :key="item.label"></Option>
                </Select>
            </Col>
            <Col span="1" style="text-align:center;">
                <span style="line-height:32px;">~</span>
            </Col>
            <Col span="3">
                <Select v-model="maxMoney" :placeholder="String(maxMoney)" style="width:100px">
                    <Option v-for="item in moneyRange" :value="item.value" :key="item.label"></Option>
                </Select>
            </Col>
            <Col span="11">
                <Button type="primary" @click="filteruser()">筛选</Button>
            </Col>
            <Col span="4">
                <Input prefix="ios-contact" clearable v-model="searchuser" @keyup.enter.native="search()" placeholder="搜索用户(用户名优先)..." style="width: auto" />
            </Col>
            <Col span="2">
                <Button type="primary" @click="restore()" v-if="isShow">还原</Button>
            </Col>
        </Row>
        <!-- 表格数据 -->
        <el-table
            ref="usersTableData"
            stripe
            show-header
            :highlight-current-row="true"
            class="usertable"
            :data="getAllUsers"
            style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="用户 ID:">
                            <span>{{ props.row._id }}</span>
                        </el-form-item>
                        <el-form-item label="用户头像:">
                            <span><Avatar :src="require('../../../assets/avatar/' + props.row.avatar)" size="default" /></span>
                        </el-form-item>
                        <el-form-item label="用户邮箱:">
                            <span>{{ props.row.email }}</span>
                        </el-form-item>
                        <el-form-item label="用户名称:">
                            <span>{{ props.row.username }}</span>
                        </el-form-item>
                        <el-form-item label="用户电话:">
                            <span>{{ props.row.phone }}</span>
                        </el-form-item>
                        <el-form-item label="用户余额:">
                            <span>{{ props.row.money }}</span>
                        </el-form-item>
                        <el-form-item label="最近签到:">
                            <span>{{ props.row.signdate }}</span>
                        </el-form-item>
                        <el-form-item label="签到次数:">
                            <span>{{ props.row.signcount }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
            label="序号"
            align="center"
            width="80"
            type="index">
            </el-table-column>
            <el-table-column
            label="用户邮箱"
            align="center"
            width="220">
                <template slot-scope="scope"> 
                        <Icon type="ios-send" style="color:#2b85e4;margin-right:10px;"/>
                        <span style="color:#2b85e4;">{{ scope.row.email}}</span>
                </template>
            </el-table-column>
            <el-table-column
            label="用户名称"
            align="center"
            width="200"
            prop="username">
            </el-table-column>
            <el-table-column
            label="用户电话"
            align="center"
            width="250">
                <template slot-scope="scope"> 
                        <Icon type="ios-call" style="color:#F40;margin-right:10px;" /> 
                        <span style="color:#E9232C;">{{ scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column
            label="余额"
            align="center"
            width="200">
            <template slot-scope="scope"> 
                        <Icon type="logo-usd" style="color:#ff9900;margin-right:5px;"/>
                        <span style="color:#ff9900;">{{ scope.row.money}}</span>
                </template>
            </el-table-column>
            <el-table-column
            label="操作"
            align="center">
                <template slot-scope="scope">
                    <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <Row>
            <Col span="24" style="text-align:right;padding:5px 10px;">
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
        
        <!-- 删除用户时验证密码模态框 -->
        <Modal draggable v-model="isCheckPassword" :zIndex="zIndex" :mask-closable="false" width="360">
            <p slot="header" style="color:#f60;">
                <Icon type="ios-information-circle"></Icon>
                <span>验证密码</span>
            </p>
            <div style="text-align:left;font-size:14px;">
                <Row>
                    <Col span="18">
                        <Input v-model="inputPassword" type="password" icon="ios-key" @keyup.enter.native="checkPwd()"  placeholder="请输入管理员口令..." style="width: 200px" />
                    </Col>
                    <Col span="6">
                        <Button type="primary" size="large" @click="checkPwd()">验证</Button>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>

<script>
import wsmLoading from "@/myplugin/Loading";
import jwt_decode from "jwt-decode";
import { parse } from 'path';
import { setTimeout } from 'timers';
export default {
    name:"manageusers",
    components:{},
    data(){
        return{
            currentRow:"",
            isCheckPassword:false,
            inputPassword:"",
            zIndex:999,
            minMoney:"最小余额",
            maxMoney:"最大余额",
            // 金钱范围
            moneyRange:[{label:10,value:10},{label:100,value:100},{label:500,value:500},{label:1000,value:1000},{label:2000,value:2000},{label:3000,value:3000},{label:4000,value:4000},{label:5000,value:5000},{label:10000,value:10000},{label:15000,value:15000},{label:20000,value:20000},{label:25000,value:25000},{label:30000,value:30000},{label:50000,value:50000},{label:60000,value:60000},{label:70000,value:70000},{label:80000,value:80000},{label:90000,value:90000},{label:100000,value:100000},{label:500000,value:500000},{label:1000000,value:1000000},],
            // 搜索用户
            searchuser:"",
            // 还原按钮
            isShow:false,
            // 分页组件信息
            paginations: {
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 5, // 1页显示多少条
                page_sizes: [5, 10, 15, 20], //每页显示多少条
                layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
            },
        }
    },
    created(){
        this.allUsers();
    },
    methods:{
        // 验证密码
        checkPwd(){
            if(this.inputPassword.trim().length){
                this.isCheckPassword = false;
                wsmLoading.startLoading("正在验证密码,请稍候...");
                setTimeout(() => {
                    this.$axios.post("http://localhost:3001/api/admin/checkpassword",{
                        pwd:this.inputPassword
                    }).then(res => {
                        if(res.data == true){
                            wsmLoading.startLoading("口令正确,正在删除,请稍候...");
                            setTimeout(() => {
                                this.$axios.post("http://localhost:3001/api/admin/delete", {email:this.currentRow.email})
                                    .then(res => {
                                        this.$axios.get("http://localhost:3001/api/admin/allusers")
                                            .then(res => {
                                                if(res){
                                                    wsmLoading.endLoading();
                                                    this.$Message.success("删除成功");
                                                    this.$store.dispatch("getAllusers", res.data);
                                                    this.allTableData = res.data;
                                                    this.setPaginations();
                                                    const users = JSON.stringify(res.data);
                                                    localStorage.setItem("users", users);
                                                }
                                            }).catch(err => console.log(err))
                                    })
                            }, 1000)
                        }else{
                            wsmLoading.endLoading();
                            this.$Modal.confirm({
                                title:"提示",
                                content:"你输入的口令有误,是否继续验证?",
                                okText:"继续",
                                cancelText:"取消",
                                onOk:()=>{
                                    this.isCheckPassword = true;
                                },
                                onCancel:()=>{
                                    this.inputPassword = "";
                                }
                            })
                        }
                    })
                }, 1000)
            }else{
                this.isCheckPassword = false;
                this.$Modal.warning({
                    title:"警告",
                    content:"输入内容不能为空,请重新输入管理员口令!",
                    okText:"确定",
                    onOk:()=>{
                        this.isCheckPassword = true;
                    }
                })
            }
        },
        // 筛选用户
        filteruser(){
            if(parseInt(this.minMoney) || parseInt(this.maxMoney)){
                const min = parseInt(this.minMoney) ? parseInt(this.minMoney) : 0;
                const max = parseInt(this.maxMoney) ? parseInt(this.maxMoney) : 999999999999;
                this.$axios.get("http://localhost:3001/api/admin/allusers")
                        .then(res => {
                            if(res){
                                const users = [];
                                res.data.forEach(item => {
                                    if(item.money >= min && item.money <= max){
                                        users[users.length] = item;
                                    }
                                })
                                this.allTableData = users;
                                this.setPaginations();
                                this.isShow = true;
                            }
                        })
            }else{
                this.$Modal.warning({
                    title: "警告",
                    content: "最小或最大金额至少选择一处"
                });
            }
        },
        // 获取所有用户信息
        allUsers(){
            if(localStorage.users){
                const users = JSON.parse(localStorage.getItem("users"));
                this.$store.dispatch("getAllusers", users);
                this.allTableData = users;
                this.setPaginations();
            }else{
                this.$axios.get("http://localhost:3001/api/admin/allusers")
                    .then(res => {
                        if(res){
                            this.$store.dispatch("getAllusers", res.data);
                            this.allTableData = res.data;
                            this.setPaginations();
                            const users = JSON.stringify(res.data);
                            localStorage.setItem("users", users);
                        }
                    }).catch(err => console.log(err))
            }
        },
        // 删除用户
        handleDelete(index, row){
            this.currentRow = row;
            this.$Modal.confirm({
                    title:'警告',
                    content:`您即将移除<span style="color:#F56C6C;font-weight:600;"> ${row.username}(${row.email}) </span>账户的所有信息,不可恢复, 是否继续?</p>`,
                    okText: '确定',
                    cancelText: '取消',
                    type: 'warning',
                    onOk:()=>{
                        this.isCheckPassword = true;
                    },
                    onCancel:()=>{
                        console.log("cancel");
                    }
            });
        },
        // 搜索用户
        search(){
            const search = this.searchuser.trim();
            if(search.length){
                this.isShow = true;
                this.$axios.post("http://localhost:3001/api/admin/search/user", {searchuser:search})
                    .then(res => {
                        if(res){
                            this.$store.dispatch("getAllusers", res.data);
                            this.allTableData = res.data;
                            this.setPaginations();
                        }
                    })
            }else{
                this.$Modal.warning({
                    title: "警告",
                    content: "搜索内容不能为空"
                });
            }
            
        },
        // 还原所有用户
        restore(){
            this.isShow = false;
            this.searchuser = "";
            this.allUsers();
        },
        handleCurrentChange(page) {
            // 获取当前页
            let sortnum = this.paginations.page_size * (page - 1);
            let table = this.allTableData.filter((item, index) => {
                return index >= sortnum;
            });
            // 设置默认分页数据
            this.getAllUsers = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
            this.getAllUsers = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        handleSizeChange(page_size) {
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.getAllUsers = this.allTableData.filter((item, index) => {
                return index < page_size;
            });
        },
        setPaginations() {
            // 总页数
            this.paginations.total = this.allTableData.length;
            this.paginations.page_index = 1;
            this.paginations.page_size = 5;
            // 设置默认分页数据
            this.getAllUsers = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
    },
    mounted(){
        
    },
    computed:{
        getAllUsers:{
            get(){
                // this.users = this.$store.getters.allusers;
                return this.$store.getters.allusers;
            },
            set(val){
                this.$store.dispatch("getAllusers", val);
            }
        }
    }
}
</script>

<style lang="less" scoped>
.manageusers{
    width: 100%;
    height: 100%;

    // usertable
    .usertable{
        width: 100%;
        min-height: 327px;

        .el-table__expanded-cell{
            background-color: #ccc;
        }
        .demo-table-expand {
            font-size: 0;
        }
        .demo-table-expand label{
            width: 90px;
            color: #99a9bf;
        }
        .demo-table-expand .el-form-item{
            margin-right: 0;
            margin-bottom: 0;
            width: 50%;
        }
    }
}
</style>
