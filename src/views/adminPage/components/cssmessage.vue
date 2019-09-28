<template>
    <div class="cssmessage">
        <Row style="padding:20px 60px 20px 40px;">
            <Col :span="24" style="text-align:right;">
                <Input prefix="md-text" clearable v-model="username" @keypress.enter.native="searchMessage()" placeholder="搜索用户留言..." style="width: auto" />
                <Button type="primary" v-if="showRestoreBtn" style="margin-left:5px;" @click="restore()">还原</Button>
            </Col>
        </Row>

        <!-- 表格数据 -->
        <el-table
            :data="allMessage"
            class="message-table"
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
            label="留言 ID"
            align="center"
            width="260">
            </el-table-column>
            <el-table-column
            label="用户名"
            prop="username"
            align="center"
            width="180">
            </el-table-column>
            <el-table-column
            label="用户头像"
            align="center"
            width="120">
                <template slot-scope="scope">
                    <Avatar :src="require('../../../assets/avatar/' + scope.row.avatar)" size="large" />
                </template>
            </el-table-column>
            <el-table-column
            prop="messageTime"
            label="留言时间"
            sortable
            align="center"
            width="200">
            </el-table-column>
            <el-table-column
            prop="comment"
            label="留言内容"
            min-width="200"
            align="center">
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
    </div>
</template>
<script>
export default {
    name:"cssmessage",
    data(){
        return{
            showRestoreBtn:false,
            username:"",
            allMessage:[],
            allTableData:[],
            paginations: {
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 10, // 1页显示多少条
                page_sizes: [10, 20, 30, 40], //每页显示多少条
                layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
            },
        }
    },
    created(){
        this.getAllMessage();
    },
    methods:{
        // 获取所有留言
        getAllMessage(){
            this.$axios.get("http://localhost:3001/api/vip/course/css/message/all")
                .then(res => {
                    this.allMessage = res.data;
                    this.allTableData = res.data;
                    this.setPaginations();
                })
        },
        // 搜索留言
        searchMessage(){
            if(this.username.trim().length){
                const search = {username:this.username,key:"css"};
                this.$axios.post("http://localhost:3001/api/admin/vip/course/message/search", search)
                        .then(res => {
                            this.showRestoreBtn = true;
                            this.allMessage = res.data;
                            this.allTableData = res.data;
                            this.setPaginations();
                        })
            }else{
                this.$alert("搜索内容不能为空,请重新输入...",{
                    type:"warning"
                })
            }
        },
        // 还原数据
        restore(){
            this.showRestoreBtn = false;
            this.getAllMessage();
            this.username = "";
        },
        // 设置当前页
        handleCurrentChange(page) {
            // 获取当前页
            let sortnum = this.paginations.page_size * (page - 1);
            let table = this.allTableData.filter((item, index) => {
                return index >= sortnum;
            });
            // 设置默认分页数据
            this.allMessage = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
            this.allMessage = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        // 改变每页条数
        handleSizeChange(page_size) {
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.allMessage = this.allTableData.filter((item, index) => {
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
            this.allMessage = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
    }
}
</script>
<style lang="less" scoped>
.cssmessage{
    color:#E9232C;
}
</style>