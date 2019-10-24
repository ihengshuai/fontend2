<template>
    <div class="homepagedata">
        <Row style="padding:20px 60px 20px 40px;">
            <Col :span="12">
                <Input prefix="ios-magnet" clearable v-model="cardName" @keypress.enter.native="searchCard()" placeholder="搜索卡片..." style="width: auto" />
                <!-- <Button type="primary" v-if="showRestoreBtn" style="margin-left:5px;" @click="restore()">还原</Button> -->
            </Col>
            <Col :span="12" style="text-align:right;">
                <Button type="primary" @click="addCard()">添加</Button>
            </Col>
        </Row>

        <!-- 卡片数据表 -->
        <el-table
            :data="allCardData"
            class="card-table"
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
            label="卡片 ID"
            align="center"
            width="250">
            </el-table-column>
            <el-table-column
            label="标题"
            prop="title"
            sortable
            align="center"
            width="120">
            </el-table-column>
            <el-table-column
            align="center"
            width="130"
            label="展示封面">
                <template slot-scope="scope">
                    <Avatar :src="'http://localhost:3001/api/index/img?name=' + scope.row.img" size="large" />
                </template>
            </el-table-column>
            <el-table-column
            prop="url"
            label="链接地址"
            sortable
            align="center"
            width="300">
            </el-table-column>
            <el-table-column
            prop="content"
            align="center"
            width="600"
            label="内容">
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
                        @click='onEditCard(scope.row)'
                    >编辑</el-button>
                    <el-button 
                        type="danger" 
                        icon='delete' 
                        size="small"
                        @click='onDeleteCard(scope.row,scope.$index)'
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

        <!-- 添加卡片模态框 --> 
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

                    <el-form-item prop='title' label="标题:">
                        <el-input type="title" v-model="addForm.title"></el-input>
                    </el-form-item>

                    <el-form-item label="卡片封面:" prop="img">
                        <Upload
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :max-size="10000"
                            multiple
                            type="drag"
                            :on-success="handleAddPictureSuccess"
                            action="http://localhost:3001/api/admin/upload/card"
                            style="display:block;height:44px;width:44px;">
                            <span style="float:left;">
                                <Avatar :src="'http://localhost:3001/api/index/img?name=' +  addForm.img" size="large" />
                            </span>
                        </Upload>
                    </el-form-item>

                    <el-form-item prop='url'  label="卡片链接:">
                        <el-input type="url" v-model="addForm.url"></el-input>
                    </el-form-item>

                    <el-form-item prop='content'  label="内容:">
                        <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="addForm.content">
                        </el-input>
                    </el-form-item>

                    <el-form-item  class="text_right">
                        <el-button @click="addDialog.show = false">取 消</el-button>
                        <el-button type="primary" @click='addBtn("addForm")'>提  交</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </el-dialog>

        <!-- 编辑卡片模态框 -->
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
                    <el-form-item prop='_id' label="卡片ID:">
                        <el-input type="id" disabled v-model="editForm._id"></el-input>
                    </el-form-item>

                    <el-form-item prop='title' label="标题:">
                        <el-input type="title" v-model="editForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="封面图片:" prop="img">
                        <Upload
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :max-size="10000"
                            multiple
                            type="drag"
                            :on-success="handleEditPictureSuccess"
                            action="http://localhost:3001/api/admin/upload/card"
                            style="display:block;width:44px;">
                            <span style="float:left;">
                                <Avatar :src="'http://localhost:3001/api/index/img?name=' + editForm.img" size="large" />
                            </span>
                        </Upload>
                    </el-form-item>
                    <el-form-item prop='url'  label="卡片链接:">
                        <el-input type="artist" v-model="editForm.url"></el-input>
                    </el-form-item>
                    <el-form-item prop='content'  label="内容:">
                        <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="editForm.content">
                        </el-input>
                    </el-form-item>
                    <el-form-item  class="text_right">
                        <el-button @click="editDialog.show = false">取 消</el-button>
                        <el-button type="primary" @click='okEditBtn("editForm")'>提  交</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </el-dialog>


        <!-- 验证密码时模态框 -->
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
    name:"homepagedata",
    data(){
        return{
            isCheckPassword:false,
            zIndex:999,
            inputPassword:"",
            cardName:"", // 卡片标题
            allCardData:[],
            allTableData:[], // 分页暂存
            paginations: {
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 8, // 1页显示多少条
                page_sizes: [8, 13, 18, 23], //每页显示多少条
                layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
            },
            addForm_rules: {  // 添加或者编辑歌曲规则 
                title: [
                    { required: true, message: "标题不能为空", trigger: "blur" }
                ],
                url: [
                    { required: true, message: "卡片链接不能为空", trigger: "blur" }
                ],
                content:[{
                    required:true,message:"内容不能为空", trigger:"blur"
                }],
                img: [{ required: true, message: "卡片封面不能为空", trigger: "blur" }]
            },
            addForm:{  // 添加卡片 form
                title: "",
                url: "",
                content: "",
                img: "",
            },
            editForm:{   // 编辑卡片form
                _id:"",
                title:"",
                url:"",
                img:"",
                content:""
            },
            addDialog:{   // 添加模态框
                title:"添加卡片",
                show:false,

            },
            editDialog:{
                title:"编辑卡片",
                show:false
            },
            checkGold:"",  // 1:删除, 2:添加, 3:修改
            currentCard:"",  // 当前卡片
        }
    },
    created(){
        this.getAllCard();
        
    },
    methods:{
        // 验证密码
        checkPwd(){
            if(this.inputPassword.trim().length){
                this.isCheckPassword = false;
                wsmLoading.startLoading("正在验证密码,请稍候...");
                setTimeout(() => {
                    this.$axios.post("http://localhost:3001/api/admin/checkpassword", {
                        pwd:this.inputPassword,
                        email:this.$store.getters.admin.email
                    }).then(res => {
                        if(res.data == true){
                            // 进行卡片的  删除,编辑,添加 
                            // [1:删除, 2:添加, 3:修改]
                            if(this.checkGold == 1){
                                wsmLoading.startLoading("验证成功,正在删除卡片,请稍候....");
                                setTimeout(() => {
                                    this.$axios.post("http://localhost:3001/api/admin/homepage/del", {
                                        _id:this.currentCard._id
                                    }).then(res => {
                                                this.getAllCard();
                                                this.inputPassword = "";
                                                wsmLoading.endLoading();
                                                this.$Message.success("删除成功");
                                            })
                                }, 1000)
                            }else if(this.checkGold == 3){
                                wsmLoading.startLoading("验证成功,正在修改卡片,请稍候....");
                                setTimeout(() => {
                                    this.$axios.post("http://localhost:3001/api/admin/homepage/edit", this.editForm)
                                            .then(res => {
                                                this.getAllCard();
                                                this.inputPassword = "";
                                                wsmLoading.endLoading();
                                                this.$Message.success("修改成功");
                                            })
                                }, 1000)
                            }else if(this.checkGold == 2){
                                wsmLoading.startLoading("验证成功,添加卡片中,请稍候....");
                                setTimeout(() => {
                                    this.$axios.post("http://localhost:3001/api/admin/homepage/add", this.addForm)
                                        .then(res => {
                                            this.getAllCard();
                                            this.inputPassword = "";
                                            wsmLoading.endLoading();
                                            this.$Message.success("添加成功");
                                        })
                                }, 1000)
                            }
                        }else{
                            wsmLoading.endLoading();
                            this.$Modal.confirm({
                                title:"验证提示",
                                content:"你输入的口令有误,是否重新验证管理员口令?",
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
                    content:"口令不能为空,请重新输入管理员口令!",
                    onOk:()=>{
                        this.isCheckPassword = true;
                    }
                })
            }
        },
        // 获取所有的卡片
        getAllCard(){
            this.$axios.get("http://localhost:3001/api/index/")
                .then(res => {
                    this.allCardData = res.data;
                    this.allTableData = res.data;
                    this.setPaginations();
                })
        },
        // 添加按钮事件   已完成
        addBtn(formName){
            this.$refs[formName].validate(valid => {
                if(valid){
                    this.addDialog.show = false;
                    this.isCheckPassword = true;
                    this.checkGold = 2;
                }else{
                    console.log("不合法")
                }
            })
        },
        // 添加卡片
        addCard(){
            this.inputPassword = "";
            this.addForm.title = "";
            this.addForm.url = "";
            this.addForm.img = "";
            this.addForm.content = "";
            this.addDialog.show = true;
        },
        // 添加卡片封面
        handleAddPictureSuccess (res, file) {
            console.log(res);
            this.addForm.img = res.result.card;
        },
        // 搜索卡片
        searchCard(){
            if(this.cardName.trim().length){
                this.$axios.post("http://localhost:3001/api/index/search", {
                    cardName:this.cardName
                }).then(res => {
                    if(res.data.length){
                        this.allCardData = res.data;
                        this.allTableData = res.data;
                        this.setPaginations();
                    }
                })
            }else{
                this.getAllCard();
            }
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
        // 编辑卡片
        onEditCard(card){
            this.editForm = {...card};
            this.editDialog.show = true;
            this.checkGold = 3;
        },
        // 更改卡片封面
        handleEditPictureSuccess(res, file){
            this.editForm.img = res.result.card;
        },
        // 删除卡片
        onDeleteCard(row, rowIndex){
            this.currentCard = row;
            this.inputPassword = "";
            this.$Modal.confirm({
                title:"警告",
                content:`你确定要删除卡片 <span style="color:#f40;font-size:15px;text-decoration:underline;">${row.title}</span>  吗?不可恢复,是否继续?`,
                okText:"继续",
                cancelText:"取消",
                onOk:()=>{
                    this.isCheckPassword = true;
                    this.checkGold = 1;
                },
                onCancel:()=>{
                    console.log("cancel");
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
            this.allCardData = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
            this.allCardData = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        // 改变每页条数
        handleSizeChange(page_size) {
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.allCardData = this.allTableData.filter((item, index) => {
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
            this.allCardData = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
    }
}
</script>
<style lang="less" scoped>
.homepagedata{
    color:violet;
}
</style>