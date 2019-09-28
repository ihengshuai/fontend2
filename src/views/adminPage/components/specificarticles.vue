<template>
    <div class="specificarticle">
        <Row style="padding:20px 60px 20px 40px;">
            <Col :span="24" style="text-align:right;">
                <Input prefix="ios-document" clearable v-model="articleName" @keypress.enter.native="searchArticle()" placeholder="搜索文章标题..." style="width: auto" />
                <Button type="primary" v-if="showRestoreBtn" style="margin-left:5px;" @click="restore()">还原</Button>
            </Col>
        </Row>

        <!-- 表格数据 -->
        <el-table
            :data="allAllArticle"
            class="article-table"
            style="width: 100%"
            border
            :default-sort = "{prop: 'date', order: 'descending'}"
            >
            <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60">
            </el-table-column>
            <el-table-column
            prop="_id"
            label="文章 ID"
            align="center"
            width="300">
            </el-table-column>
            <el-table-column
            label="文章类型"
            prop="coursetype"
            align="center"
            width="200">
            </el-table-column>
            <el-table-column
            prop="title"
            label="文章标题"
            sortable
            align="center"
            width="400">
            </el-table-column>
            <el-table-column
                prop="operation"
                align='center'
                label="操作"
                fixed="right"
                width="200">
                <template slot-scope='scope'>
                    <Tooltip content="点击查看文章" placement="top">
                        <Icon alt="查看文章" style="cursor:pointer;color:#2b85e4;margin-right:20px;" type="ios-eye" size="23" @click="seeArticle(scope.row)" />
                    </Tooltip>
                    <Tooltip content="编辑文章" placement="top">
                        <Icon type="ios-create" style="cursor:pointer;color:#ff9900;" size="23" @click="editArticle(scope.row,scope.$index)" />
                    </Tooltip>
                    <Tooltip content="删除文章" placement="top">
                        <Icon type="ios-trash" style="cursor:pointer;color:#ed4014;margin-left:20px;" size="23" @click="deleteArticle(scope.row,scope.$index)" />
                    </Tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <Row>
            <Col span="24" style="text-align:right;padding:10px;">
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

        <!-- 删除文章时验证密码模态框 -->
        <Modal draggable v-model="isCheckPassword" :zIndex="zIndex" :mask-closable="false" width="360">
            <p slot="header" style="color:#f60;">
                <Icon type="ios-information-circle"></Icon>
                <span>验证密码</span>
            </p>
            <div style="text-align:left;font-size:14px;">
                <Row>
                    <Col span="18">
                        <Input v-model="inputPassword" type="password" icon="ios-key" @keyup.enter.native="checkPwd()"  placeholder="请输入管理员密码..." style="width: 200px" />
                    </Col>
                    <Col span="6">
                        <Button type="primary" size="large" @click="checkPwd()">验证</Button>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
            </div>
        </Modal>

        <!-- 查看文章模态框 -->
        <Modal :mask-closable="false" :styles="{top: '10px'}" v-model="readArticleModal" :title="articleTitle">
            <mavon-editor style="height:650px;" id="readArticleModal" :subfield="false" :toolbarsFlag="false" :value="currentArticle" :defaultOpen="preview">
            </mavon-editor>
        </Modal>
    </div>
</template>
<script>
import wsmLoading from "@/myplugin/Loading";
import { setTimeout } from 'timers';
import $ from "jquery";
export default {
    name:"specificarticle",
    data(){
        return{
            preview:"preview",
            articleTitle:"",
            readArticleModal:false,
            currentArticle:"",
            articleName:"",
            showRestoreBtn:false,
            allAllArticle:[],
            allTableData:[],
            paginations: {
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 10, // 1页显示多少条
                page_sizes: [10, 20, 30, 40], //每页显示多少条
                layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
            },
            zIndex:999,
            inputPassword:"",
            isCheckPassword:false,
            currentRow:""
        }
    },
    created(){
        this.getAllArticles();
    },
    methods:{
        // 编辑时跳转到指定页面
        editArticle(row, index){
            this.$router.push({path:"/admin/index/edit/" + row.coursetype, query:{title:row.title}})
        },
        // 获取所有文章
        getAllArticles(){
            this.$axios.get("http://localhost:3001/api/article/all")
                .then(res => {
                    this.allAllArticle = res.data;
                    this.allTableData = res.data;
                    this.setPaginations();
                })
        },
        // 查看文章
        seeArticle(row){
            $('#readArticleModal').animate({scrollTop: 0}, 5);
            this.readArticleModal = true;
            this.articleTitle = row.title;
            this.currentArticle = row.content;
        },
        // 根据文章类型和ID删除文章
        deleteArticle(row,rowIndex){
            this.currentRow = row;
            this.inputPassword = "";
            this.$Modal.confirm({
                title:"删除提示",
                content:`你确定要删除文章  <span style="color:#f40;font-size:15px;text-decoration:underline;">${row.title}</span>  吗?不可恢复,是否继续?`,
                okText:"确定",
                calcelText:"取消",
                type:"warning",
                onOk:()=>{
                    this.isCheckPassword = true;
                },
                onCancel:()=>{
                    this.isCheckPassword = false;
                    console.log("cancel")
                }
            })
        },
        // 删除文章时验证密码
        checkPwd(){
            if(this.inputPassword.trim().length){
                this.isCheckPassword = false;
                wsmLoading.startLoading("正在验证密码,请稍候...");
                setTimeout(() => {
                    this.$axios.post("http://localhost:3001/api/admin/checkpassword", {
                        pwd:this.inputPassword
                    }).then(res => {
                        if(res.data == true){
                            wsmLoading.startLoading("密码正确,正在删除,请稍候...");
                            setTimeout(() => {
                                this.$axios.post("http://localhost:3001/api/admin/article/del", {
                                    _id:this.currentRow._id,coursetype:this.currentRow.coursetype
                                }).then(res => {
                                    wsmLoading.endLoading();
                                    this.$Message.success("删除成功");
                                    this.getAllArticles();
                                })
                            }, 1000)
                        }else{
                            wsmLoading.endLoading();
                            this.$Modal.confirm({
                                title:"提示",
                                content:"你输入的密码有误,是否继续验证?",
                                okText:"继续",
                                cancelText:"取消",
                                onOk:()=>{
                                    this.isCheckPassword = true;
                                },
                                onCancel:()=>{
                                    console.log("取消验证");
                                }
                            })
                        }
                    })
                }, 1500)
            }else{
                this.isCheckPassword = false;
                this.$Modal.warning({
                    title:"提示",
                    content:"密码不能为空,请输入管理员口令...",
                    okText:"确定",
                    onOk:()=>{
                        this.isCheckPassword = true;
                    }
                })
            }
        },
        // 搜索文章标题
        searchArticle(){
            if(this.articleName.trim().length){
                this.showRestoreBtn = true;
                this.$axios.post("http://localhost:3001/api/admin/article/title/search",{
                    searchTitle:this.articleName
                }).then(res => {
                    this.allAllArticle = res.data;
                    this.allTableData = res.data;
                    this.setPaginations();
                })
            }else{
                this.$Modal.warning({
                    title:"搜索提示",
                    content:"搜索内容不能为空,请输入您想查找的内容..."
                })
            }
        },
        // 还原按钮
        restore(){
            this.articleName = "";
            this.showRestoreBtn = false;
            this.getAllArticles();
        },
        // 设置当前页
        handleCurrentChange(page) {
            // 获取当前页
            let sortnum = this.paginations.page_size * (page - 1);
            let table = this.allTableData.filter((item, index) => {
                return index >= sortnum;
            });
            // 设置默认分页数据
            this.allAllArticle = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
            this.allAllArticle = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        // 改变每页条数
        handleSizeChange(page_size) {
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.allAllArticle = this.allTableData.filter((item, index) => {
                return index < page_size;
            });
        },
        // 设置的分页
        setPaginations() {
            // 总页数
            this.paginations.total = this.allTableData.length;
            this.paginations.page_index = 1;
            this.paginations.page_size = 10;
            // 设置默认分页数据
            this.allAllArticle = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
    }
}
</script>
<style lang="less" scoped>
.specificarticle{
    color: #f40;

    .ivu-tooltip-popper{
        z-index: 10000;
    }
}
</style>