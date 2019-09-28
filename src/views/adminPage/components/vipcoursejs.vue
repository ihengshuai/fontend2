<template>
    <div class="vipcoursejs">
        <Row style="padding:20px 60px 20px 40px;">
            <Col :span="12">
                <Input prefix="ios-videocam" clearable v-model="videoName" @keypress.enter.native="searchVideo()" placeholder="搜索视频..." style="width: auto" />
                <Button type="primary" v-if="showRestoreBtn" style="margin-left:5px;" @click="restore()">还原</Button>
            </Col>
            <Col :span="12" style="text-align:right;">
                <Button type="primary" @click="addVideo()">添加</Button>
            </Col>
        </Row>
        <!-- 视频数据表 -->
        <el-table
            :data="allVideos"
            class="video-table"
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
            label="视频 ID"
            align="center"
            width="250">
            </el-table-column>
            <el-table-column
            label="标题"
            prop="title"
            sortable
            align="center"
            width="200">
            </el-table-column>
            <el-table-column
            prop="src"
            label="视频地址"
            sortable
            align="center"
            width="180">
            </el-table-column>
            <el-table-column
            align="center"
            label="视频封面">
                <template slot-scope="scope">
                    <img width="130" height="80" :src="require('../../../assets/vipcourse/javascript/' + scope.row.poster)" alt="">
                </template>
            </el-table-column>
            <el-table-column
                prop="operation"
                align='center'
                label="操作"
                fixed="right"
                min-width="150">
                <template slot-scope='scope'>
                    <el-button 
                        type="warning" 
                        icon='edit' 
                        size="small"
                        @click='onEditVideo(scope.row)'
                    >编辑</el-button>
                    <el-button 
                        type="danger" 
                        icon='delete' 
                        size="small"
                        @click='onDeleteVideo(scope.row,scope.$index)'
                    >删除</el-button>
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


        <!-- 编辑歌曲模态框 -->
        <el-dialog 
            :title="editDialog.title" 
            :visible.sync="editDialog.show"
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            :modal-append-to-body="false">
            <div class="form">
                <el-form 
                    ref="editForm" 
                    :model="editForm"
                    :rules="Form_rules"
                    label-width="120px" 
                    style="margin:10px;width:auto;">
                    <el-form-item prop='_id' label="视频ID:">
                        <el-input type="id" disabled v-model="editForm._id"></el-input>
                    </el-form-item>

                    <el-form-item prop='title' label="视频标题:">
                        <el-input type="title" v-model="editForm.title"></el-input>
                    </el-form-item>

                    <el-form-item prop='src' label="视频地址:">
                        <Upload action="http://localhost:3001/api/user/upload"
                            :on-success="handleEditVideoSuccess"
                            :format="['mp4','mov']">
                            <Button icon="ios-cloud-upload-outline">重新选择</Button>
                        </Upload>
                        <!-- <el-input type="src" v-model="form.src"></el-input> -->
                    </el-form-item>
                    <el-form-item label="视频封面:" prop="poster">
                        <Upload
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :max-size="10000"
                            multiple
                            type="drag"
                            :on-success="handleEditPosterSuccess"
                            action="http://localhost:3001/api/user/upload"
                            style="display:block;width:44px;">
                            <span style="float:left;">
                                <Avatar :src="videoPoster" size="large" />
                            </span>
                        </Upload>
                    </el-form-item>

                    <el-form-item  class="text_right">
                        <el-button @click="editDialog.show = false">取 消</el-button>
                        <el-button type="primary" @click='okEditBtn("editForm")'>提  交</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </el-dialog>

        <!-- 添加视频模态框 --> 
        <el-dialog 
            :title="addDialog.title" 
            :visible.sync="addDialog.show"
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            :modal-append-to-body="false">
            <div class="form">
                <el-form 
                    ref="addForm" 
                    :model="addForm"
                    :rules="Form_rules"
                    label-width="120px" 
                    style="margin:10px;width:auto;">

                    <el-form-item prop='title' label="课程标题:">
                        <el-input type="title" v-model="addForm.title"></el-input>
                    </el-form-item>

                    <el-form-item prop='src' label="歌曲地址:">
                        <Upload action="http://localhost:3001/api/user/upload"
                            :on-success="handleAddVideoSuccess"
                            :format="['mp4','mov']">
                            <Button icon="ios-cloud-upload-outline">上传视频</Button>
                        </Upload>
                    </el-form-item>
                    <el-form-item label="视频封面:" prop="poster">
                        <Upload
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :max-size="10000"
                            multiple
                            type="drag"
                            :on-success="handleAddPosterSuccess"
                            action="http://localhost:3001/api/user/upload"
                            style="display:block;width:44px;">
                            <span style="float:left;">
                                <Avatar :src="videoPoster" size="large" />
                            </span>
                        </Upload>
                    </el-form-item>

                    <el-form-item  class="text_right">
                        <el-button @click="addDialog.show = false">取 消</el-button>
                        <el-button type="primary" @click='addBtn("addForm")'>提  交</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </el-dialog>

        <!-- 验证密码模态框 -->
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
import { setTimeout } from 'timers';
export default {
    name:"vipcoursejs",
    data(){
        return{
            zIndex:999,
            isCheckPassword:false,
            inputPassword:"",
            videoName:"",
            showRestoreBtn:false,
            allVideos:[],
            allTableData:[],
            paginations: {
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 5, // 1页显示多少条
                page_sizes: [5, 10, 15, 20], //每页显示多少条
                layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
            },
            videoPoster:"",
            editForm:{   // 编辑视频的form
                _id:"",
                title:"",
                src:"",
                poster:""
            },
            editDialog:{
                title:"编辑课程",
                show:false
            },
            Form_rules: {  // 添加或者编辑视频规则 
                title: [
                    { required: true, message: "视频标题不能为空", trigger: "blur" }
                ],
                src:[{
                    required:true,message:"视频不能为空", trigger:"blur"
                }],
                poster: [{ required: true, message: "视频封面不能为空", trigger: "blur" }]
            },
            addDialog:{   // 添加模态框
                title:"添加课程",
                show:false,
            },
            addForm:{  // 添加课程 form
                title: "",
                src: "",
                poster: "",
            },
            currentVideo:""
        }
    },
    created(){
        this.getAllVideos();
    },  
    methods:{
        // 模糊标题查询视频
        searchVideo(){
            if(this.videoName.trim().length){
                this.showRestoreBtn = true;
                const search = {type:"js",videoName:this.videoName.trim()};
                this.$axios.post("http://localhost:3001/api/admin/vip/course/search", search)
                    .then(res => {
                        this.allVideos = res.data;
                        this.allTableData = res.data;
                        this.setPaginations();
                    })
            }else{
                this.$alert('搜索内容不能为空,请重新输入...', {
                    confirmButtonText: '确定',
                    type: 'warning'
                })
            }
        },
        // 还原表格所有数据
        restore(){
            this.showRestoreBtn = false;
            this.getAllVideos();
            this.videoName = "";
        },
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
                            // 删除课程
                            if(this.checkGold == 1){
                                this.currentVideo.key = "del";
                                wsmLoading.startLoading("密码正确,正在删除,请稍候...");
                                setTimeout(() => {
                                    this.$axios.post("http://localhost:3001/api/admin/vip/course/manage/js", this.currentVideo)
                                        .then(res => {
                                            wsmLoading.endLoading();
                                            this.$Message.success("删除成功");
                                            this.getAllVideos();
                                            this.inputPassword = "";
                                        })
                                }, 1000)
                            }else if(this.checkGold == 2){  // 添加课程
                                wsmLoading.startLoading("密码正确,正在验证课程,请稍候...");
                                setTimeout(() => {
                                    this.$axios.post("http://localhost:3001/api/admin/vip/course/js/add", this.addForm)
                                        .then(res => {
                                            if(res.data == "exist"){
                                                wsmLoading.startLoading("添加失败,课程已存在..");
                                                setTimeout(() => {
                                                    wsmLoading.endLoading();
                                                    this.inputPassword = "";
                                                    this.addDialog.show = true;
                                                    this.$Message.error("添加失败");
                                                }, 500)
                                            }else{
                                                wsmLoading.startLoading("验证成功,正在添加课程,请稍候...");
                                                setTimeout(() => {
                                                    this.getAllVideos();
                                                    this.inputPassword = "";
                                                    wsmLoading.endLoading();
                                                    this.$Message.success("添加成功");
                                                }, 1000)
                                            }
                                        })
                                }, 1500);
                            }else if(this.checkGold == 3){  // 修改视频
                                this.editForm.key = "mod";
                                wsmLoading.startLoading("正在更改课程,请稍候...");
                                setTimeout(() => {
                                    this.$axios.post("http://localhost:3001/api/admin/vip/course/manage/js",this.editForm)
                                        .then(res => {
                                            wsmLoading.startLoading("更改成功...");
                                            setTimeout(() => {
                                                this.getAllVideos();
                                                wsmLoading.endLoading();
                                                this.inputPassword = "";
                                            }, 500)
                                        })
                                }, 500)
                            }
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
                }, 1500)
            }else{
                this.isCheckPassword = false;
                this.$Modal.warning({
                    title:"提示",
                    content:"密码不能为空,请输入管理员口令...",
                    onOk:()=>{
                        this.isCheckPassword = true;
                    }
                })
            }
        },
        // 确认提交添加后的视频按钮
        addBtn(formName){
            this.$refs[formName].validate(valid => {
                if(valid){
                    this.addDialog.show = false;
                    this.isCheckPassword = true;
                    this.checkGold = 2;
                }
                // 不合法
            })
        },
        // 添加视频
        addVideo(){
            this.addForm.title = "";
            this.addForm.src = "";
            this.addForm.poster = "";
            this.videoPoster = "";
            this.addDialog.show = true;
        },
        // 添加视频封面   已完成
        handleAddPosterSuccess (res, file) {
            this.addForm.poster = file.name;
            this.videoPoster = require("../../../assets/vipcourse/javascript/" + file.name);
        },
        // 添加视频   已完成
        handleAddVideoSuccess(res, file){
            this.addForm.src = file.name;
        },
        // 确认提交编辑后的视频按钮
        okEditBtn(formName){
            this.$refs[formName].validate(valid => {
                if(valid){
                    this.editDialog.show = false;
                    this.isCheckPassword = true;
                    this.checkGold = 3;
                }else{
                    console.log("不合法");
                }
            })
        },
        // 编辑视频
        onEditVideo(video){
            this.editForm = {...video};
            this.editDialog.show = true;
            this.videoPoster = require("../../../assets/vipcourse/javascript/" + video.poster);
        },
        // 更改视频
        handleEditVideoSuccess(res, file){
            this.editForm.src = file.name;
        },
        // 更改视频封面
        handleEditPosterSuccess(res, file){
            this.editForm.poster = file.name;
            this.videoPoster = require("../../../assets/vipcourse/javascript/" + file.name);
        },
        // 删除课程
        onDeleteVideo(video,rowIndex){
            this.inputPassword = "";
            this.currentVideo = video;
            this.$Modal.confirm({
                title:"操作提示",
                content:`你确定要删除课程  <span style="color:#f40;font-size:15px;text-decoration:underline;">${video.title}</span>  吗?不可恢复,是否继续?`,
                okText:"确定",
                calcelText:"取消",
                type:"warning",
                onOk:()=>{
                    this.isCheckPassword = true;
                    this.checkGold = 1;
                },
                onCancel:()=>{
                    // 取消删除
                    console.log("取消删除")
                }
            })
        },
        // 获取所有的视频
        getAllVideos(){
            this.$axios.get("http://localhost:3001/api/vip/course/js/all")
                .then(res => {
                    this.allVideos = res.data;
                    this.allTableData = res.data;
                    this.setPaginations();
                })
        },
        // 设置当前页
        handleCurrentChange(page) {
            // 获取当前页
            let sortnum = this.paginations.page_size * (page - 1);
            let table = this.allTableData.filter((item, index) => {
                return index >= sortnum;
            });
            // 设置默认分页数据
            this.allVideos = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
            this.allVideos = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        // 改变每页条数
        handleSizeChange(page_size) {
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.allVideos = this.allTableData.filter((item, index) => {
                return index < page_size;
            });
        },
        // 设置的分页
        setPaginations() {
            // 总页数
            this.paginations.total = this.allTableData.length;
            this.paginations.page_index = 1;
            this.paginations.page_size = 5;
            // 设置默认分页数据
            this.allVideos = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
    }
}
</script>
<style lang="less" scoped>
.vipcoursejs{
    color: tomato;
}
</style>