<template>
    <div class="communitymessage">
        <Row style="padding:20px 60px 20px 0px;">
            <Col style="padding:0px 0px 0px 25px;" span="10">
                <el-date-picker
                v-model="selectDate"
                size="small"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                format="yyyy/MM/dd HH:mm:ss"
                end-placeholder="结束日期"
                align="right">
                </el-date-picker>
            </Col>
            <Col span="2">
                <Button type="primary" @click="filterloginlog()">筛选</Button>
            </Col>
            <Col :span="12" style="text-align:right;">
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
                    <Avatar :src="require('../../../assets/leavemessage/avatar/' + scope.row.avatar)" size="large" />
                </template>
            </el-table-column>
            <el-table-column
            label="邮箱"
            prop="email"
            align="center"
            width="160">
            </el-table-column>
            <el-table-column
            label="QQ"
            prop="qq"
            align="center"
            width="150">
            </el-table-column>
            <el-table-column
            label="所在地区"
            prop="city"
            align="center"
            width="160">
            </el-table-column>
            <el-table-column
            prop="date"
            label="留言时间"
            sortable
            align="center"
            width="200">
            </el-table-column>
            <el-table-column
            prop="content"
            label="留言内容"
            min-width="300"
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
    name:"communitymessage",
    data(){
        return{
            showRestoreBtn:false,
            username:"",
            allMessage:[],
            allTableData:[],
            paginations: {
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 8, // 1页显示多少条
                page_sizes: [8, 15, 20, 25], //每页显示多少条
                layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
            },
            // 日期选择
            selectDate:"",
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
        }
    },
    created(){
        this.getAllMessage();
    },
    methods:{
        // 获取所有留言
        getAllMessage(){
            this.$axios.get("http://localhost:3001/api/admin/community/message/all")
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
                this.$axios.post("http://localhost:3001/api/admin/community/message/search", search)
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
        // 筛选留言
        filterloginlog(){
            if(!this.selectDate.length){
                this.$alert("日期不能为空, 请重新选择日期!",{
                    title:"警告",
                    type:"warning"
                })
            }else{
                const startDate = new Date(this.selectDate[0]);
                const endDate = new Date(this.selectDate[1]);
                this.$axios.get("http://localhost:3001/api/admin/community/message/all")
                        .then(res => {
                            let filters = [];
                            res.data.forEach(item => {
                                const time = new Date(item.date);
                                if(time.getTime() >= startDate.getTime() && time.getTime() <= endDate.getTime()){
                                    filters[filters.length] = item;
                                }
                            })
                            this.allMessage = filters;
                            this.allTableData = filters;
                            this.setPaginations();
                            this.showRestoreBtn = true;
                        })
            }
        },
        // 还原数据
        restore(){
            this.showRestoreBtn = false;
            this.getAllMessage();
            this.username = "";
            this.selectDate = "";
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
            this.paginations.page_size = 8;
            // 设置默认分页数据
            this.allMessage = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
    }
}
</script>
<style lang="less" scoped>
.communitymessage{
    color:#E9232C;
}
</style>