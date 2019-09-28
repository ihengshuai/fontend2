<template>
    <div class="managemusic">
        <Row style="padding:20px 60px 20px 40px;">
            <Col :span="12">
                <Input prefix="ios-musical-notes" clearable v-model="songName" @keypress.enter.native="searchSong()" placeholder="按 歌名, 歌手 搜索歌曲..." style="width: auto" />
                <Button type="primary" v-if="showRestoreBtn" style="margin-left:5px;" @click="restore()">还原</Button>
            </Col>
            <Col :span="12" style="text-align:right;">
                <Button type="primary" @click="addSong()">添加</Button>
            </Col>
        </Row>
        <!-- 歌曲数据表 -->
        <el-table
            :data="allSongs"
            class="song-table"
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
            label="歌曲 ID"
            align="center"
            width="250">
            </el-table-column>
            <el-table-column
            label="歌曲名"
            prop="title"
            sortable
            align="center"
            width="200">
            </el-table-column>
            <el-table-column
            prop="artist"
            label="歌手"
            sortable
            align="center"
            width="180">
            </el-table-column>
            <el-table-column
            prop="src"
            align="center"
            width="220"
            label="歌曲地址">
            </el-table-column>
            <el-table-column
            align="center"
            width="150"
            label="歌曲封面">
                <template slot-scope="scope">
                    <Avatar :src="require('../../../assets/music/' + scope.row.pic)" size="large" />
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
                        @click='onEditSong(scope.row)'
                    >编辑</el-button>
                    <el-button 
                        type="danger" 
                        icon='delete' 
                        size="small"
                        @click='onDeleteSong(scope.row,scope.$index)'
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

        <!-- 添加歌曲模态框    已完成--> 
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
                    :rules="addForm_rules"
                    label-width="120px" 
                    style="margin:10px;width:auto;">
                    <!-- <el-form-item prop='_id' label="歌曲ID:">
                        <el-input type="id" disabled v-model="addForm._id"></el-input>
                    </el-form-item> -->

                    <el-form-item prop='title' label="歌曲:">
                        <el-input type="title" v-model="addForm.title"></el-input>
                    </el-form-item>

                    <el-form-item prop='artist'  label="歌手:">
                        <el-input type="artist" v-model="addForm.artist"></el-input>
                    </el-form-item>

                    <el-form-item prop='src' label="歌曲地址:">
                        <Upload action="http://localhost:3001/api/user/upload"
                            :on-success="handleAddSongSuccess"
                            :format="['mp3']">
                            <Button icon="ios-cloud-upload-outline">上传歌曲</Button>
                        </Upload>
                        <!-- <el-input type="src" v-model="form.src"></el-input> -->
                    </el-form-item>
                    <el-form-item label="歌曲封面:" prop="pic">
                        <Upload
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :max-size="10000"
                            multiple
                            type="drag"
                            :on-success="handleAddPictureSuccess"
                            action="http://localhost:3001/api/user/upload"
                            style="display:block;width:44px;">
                            <span style="float:left;">
                                <Avatar :src="SongPic" size="large" />
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

        <!-- 编辑歌曲模态框   已完成-->
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
                    :rules="addForm_rules"
                    label-width="120px" 
                    style="margin:10px;width:auto;">
                    <el-form-item prop='_id' label="歌曲ID:">
                        <el-input type="id" disabled v-model="editForm._id"></el-input>
                    </el-form-item>

                    <el-form-item prop='title' label="歌曲:">
                        <el-input type="title" v-model="editForm.title"></el-input>
                    </el-form-item>

                    <el-form-item prop='artist'  label="歌手:">
                        <el-input type="artist" v-model="editForm.artist"></el-input>
                    </el-form-item>

                    <el-form-item prop='src' label="歌曲地址:">
                        <Upload action="http://localhost:3001/api/user/upload"
                            :on-success="handleEditSongSuccess"
                            :format="['mp3']">
                            <Button icon="ios-cloud-upload-outline">重新选择</Button>
                        </Upload>
                        <!-- <el-input type="src" v-model="form.src"></el-input> -->
                    </el-form-item>
                    <el-form-item label="歌曲封面:" prop="pic">
                        <Upload
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :max-size="10000"
                            multiple
                            type="drag"
                            :on-success="handleEditPictureSuccess"
                            action="http://localhost:3001/api/user/upload"
                            style="display:block;width:44px;">
                            <span style="float:left;">
                                <Avatar :src="SongPic" size="large" />
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

        <!-- 验证密码模态框 -->
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
    </div>
</template>
<script>
import wsmLoading from "@/myplugin/Loading";
import { setTimeout } from 'timers';
export default {
    name:"managemusic",
    data(){
        return{
            zIndex:999,
            isCheckPassword:false,
            inputPassword:"",
            currentSong:"",
            checkGold:"",  // 1:删除, 2:添加, 3:修改
            showRestoreBtn:false,  // 是否显示还原按钮
            songName:"",  // 搜索歌曲
            addForm:{  // 添加歌曲 form
                title: "",
                artist: "",
                src: "",
                pic: "",
            },
            editForm:{   // 编辑歌曲的form
                _id:"",
                title:"",
                src:"",
                artist:"",
                pic:""
            },
            SongPic:"",
            addForm_rules: {  // 添加或者编辑歌曲规则 
                title: [
                    { required: true, message: "歌曲名不能为空", trigger: "blur" }
                ],
                artist: [
                    { required: true, message: "歌手不能为空", trigger: "blur" }
                ],
                src:[{
                    required:true,message:"歌曲不能为空", trigger:"blur"
                }],
                pic: [{ required: true, message: "歌曲封面不能为空", trigger: "blur" }]
            },
            addDialog:{   // 添加模态框
                title:"添加歌曲",
                show:false,
            },
            editDialog:{
                title:"编辑歌曲",
                show:false
            },
            allSongs:[],   // 所有歌曲
            allTableData:[], // 分页暂存
            paginations: {
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 8, // 1页显示多少条
                page_sizes: [8, 15, 20, 25], //每页显示多少条
                layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
            },
        }
    },
    created(){
        this.getAllSongs();
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
                            // 删除歌曲
                            if(this.checkGold == 1){
                                this.currentSong.key = "del";
                                wsmLoading.startLoading("密码正确,正在删除,请稍候...");
                                setTimeout(() => {
                                    this.$axios.post("http://localhost:3001/api/admin/managemusic", this.currentSong)
                                        .then(res => {
                                            wsmLoading.endLoading();
                                            this.$Message.success("删除成功");
                                            this.getAllSongs();
                                            this.inputPassword = "";
                                        })
                                }, 1000)
                            }else if(this.checkGold == 2){  // 添加歌曲
                                wsmLoading.startLoading("密码正确,正在验证歌曲,请稍候...");
                                setTimeout(() => {
                                    this.$axios.post("http://localhost:3001/api/admin/addmusic", this.addForm)
                                        .then(res => {
                                            if(res.data == "exist"){
                                                wsmLoading.startLoading("添加失败,歌曲已存在..");
                                                setTimeout(() => {
                                                    wsmLoading.endLoading();
                                                    this.inputPassword = "";
                                                    this.addDialog.show = true;
                                                    this.$Message.error("添加失败");
                                                }, 500)
                                            }else{
                                                wsmLoading.startLoading("验证成功,正在添加歌曲,请稍候...");
                                                setTimeout(() => {
                                                    this.getAllSongs();
                                                    this.inputPassword = "";
                                                    wsmLoading.endLoading();
                                                    this.$Message.success("添加成功");
                                                }, 1000)
                                            }
                                        })
                                }, 1500);
                            }else if(this.checkGold == 3){  // 修改歌曲
                                this.editForm.key = "mod";
                                wsmLoading.startLoading("正在更改歌曲,请稍候...");
                                setTimeout(() => {
                                    this.$axios.post("http://localhost:3001/api/admin/managemusic",this.editForm)
                                        .then(res => {
                                            wsmLoading.startLoading("更改成功...");
                                            setTimeout(() => {
                                                this.getAllSongs();
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
        // 还原所有歌曲
        restore(){
            this.getAllSongs();
            this.songName = "";
            this.showRestoreBtn = false;
        },
        // 搜索歌曲
        searchSong(){
            if(this.songName.trim().length){
                this.$axios.post("http://localhost:3001/api/music/songs/search", {songName:this.songName})
                        .then(res => {
                            this.showRestoreBtn = true;
                            this.allSongs = res.data;
                            this.allTableData = res.data;
                            this.setPaginations();
                        })
            }else{
                this.$Message.warning("搜索内容不能为空.")
            }
        },
        // 获取所有歌曲
        getAllSongs(){
            this.$axios.get("http://localhost:3001/api/music/all")
                .then(res => {
                    this.allSongs = res.data;
                    this.allTableData = res.data;
                    this.setPaginations();
                })
        },
        // 添加歌曲   已完成
        addSong(){
            this.addForm.title = "";
            this.addForm.artist = "";
            this.addForm.src = "";
            this.addForm.pic = "";
            this.SongPic = "";
            this.addDialog.show = true;
        },
        // 添加按钮事件   已完成
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
        // 添加歌曲封面   已完成
        handleAddPictureSuccess (res, file) {
            this.addForm.pic = file.name;
            this.SongPic = require("../../../assets/music/" + file.name);
        },
        // 添加歌曲   已完成
        handleAddSongSuccess(res, file){
            this.addForm.src = file.name;
        },
        // 编辑歌曲
        onEditSong(song){
            this.editForm = {...song};
            this.editDialog.show = true;
            this.SongPic = require("../../../assets/music/" + song.pic);
        },
        // 确认提交编辑后的歌曲按钮
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
        // 更改歌曲
        handleEditSongSuccess(res, file){
            console.log(file)
            this.editForm.src = file.name;
        },
        // 更改歌曲封面
        handleEditPictureSuccess(res, file){
            this.editForm.pic = file.name;
            this.SongPic = require("../../../assets/music/" + file.name);
        },
        // 删除歌曲
        onDeleteSong(song,rowIndex){
            this.inputPassword = "";
            this.currentSong = song;
            this.$Modal.confirm({
                title:"操作提示",
                content:`你确定要删除歌曲  <span style="color:#f40;font-size:15px;text-decoration:underline;">${song.title}</span>  吗?不可恢复,是否继续?`,
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
        // 设置当前页
        handleCurrentChange(page) {
            // 获取当前页
            let sortnum = this.paginations.page_size * (page - 1);
            let table = this.allTableData.filter((item, index) => {
                return index >= sortnum;
            });
            // 设置默认分页数据
            this.allSongs = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
            this.allSongs = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        // 改变每页条数
        handleSizeChange(page_size) {
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.allSongs = this.allTableData.filter((item, index) => {
                return index < page_size;
            });
        },
        // 设置的分页
        setPaginations() {
            // 总页数
            this.paginations.total = this.allTableData.length;
            this.paginations.page_index = 1;
            this.paginations.page_size = 8;
            // 设置默认分页数据
            this.allSongs = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
    }
}
</script>
<style lang="less" scoped>
.managemusic{
    color: #f40;
}
</style>