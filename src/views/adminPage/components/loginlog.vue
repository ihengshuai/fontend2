<template>
    <div class="loginlog">
        <Row style="padding:10px 0px 30px 0px;">
            <Col style="padding:0px 0px 0px 25px;" span="9">
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
            <Col span="7">
                <Button type="primary" @click="filterloginlog()">筛选</Button>
            </Col>
            <Col span="4">
                <Input prefix="logo-buffer" v-model="whatloginlog" clearable @keyup.enter.native="queryloginlog()" placeholder="搜索日志(用户名优先)..." style="width: auto" />
            </Col>
            <Col span="4">
                <Button type="primary" v-if="isShow" @click="restore()">还原</Button>
            </Col>
        </Row>
        <!-- 表格数据 -->
        <el-table
            :data="allLoginLog"
            class="loginlog-table"
            style="width: 100%"
            border
            :default-sort = "{prop: 'date', order: 'descending'}"
            >
            <el-table-column
            type="index"
            label="序号"
            align="center"
            width="80">
            </el-table-column>
            <el-table-column
            prop="_id"
            label="记录 ID"
            align="center"
            width="250">
            </el-table-column>
            <el-table-column
            label="登录时间"
            prop="loginTime"
            sortable
            align="center"
            width="250">
            </el-table-column>
            <el-table-column
            prop="username"
            label="用户名"
            sortable
            align="center"
            width="250">
            </el-table-column>
            <el-table-column
            prop="email"
            align="center"
            label="用户邮箱">
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
    </div>
</template>

<script>
export default {
    name:"loginlog",
    data(){
        return{
            isShow:false,
            allLoginLog:[],
            allTableData:[],
            whatloginlog:"",
            paginations: {
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 10, // 1页显示多少条
                page_sizes: [10, 20, 30, 40], //每页显示多少条
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
        this.getLoginLogs();
    },
    methods:{
        // 设置当前页
        handleCurrentChange(page) {
            // 获取当前页
            let sortnum = this.paginations.page_size * (page - 1);
            let table = this.allTableData.filter((item, index) => {
                return index >= sortnum;
            });
            // 设置默认分页数据
            this.allLoginLog = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
            this.allLoginLog = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        // 改变每页条数
        handleSizeChange(page_size) {
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.allLoginLog = this.allTableData.filter((item, index) => {
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
            this.allLoginLog = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        // 获取所有登录日志
        getLoginLogs(){
            this.$axios.get("http://localhost:3001/api/admin/loginlog")
                    .then(res => {
                        this.allLoginLog = res.data;
                        this.allTableData = res.data;
                        this.setPaginations();
                    })
        },
        // 查询某个人的登录日志
        queryloginlog(){
            if(this.whatloginlog.trim().length){
                this.$axios.post("http://localhost:3001/api/admin/search/loginlog", {queryloginlog:this.whatloginlog})
                    .then(res => {
                        this.allLoginLog = res.data;
                        this.allTableData = res.data;
                        this.setPaginations();
                        this.isShow = true;
                    })
            }else{
                this.$Modal.warning({
                    title: "警告",
                    content: "搜索内容不能为空"
                });
            }  
        },
        // 还原表格
        restore(){
            this.isShow = false;
            this.selectDate = "";
            this.getLoginLogs();
        },
        // 筛选数据
        filterloginlog(){
            if(this.selectDate.length){
                const startDate = new Date(this.selectDate[0]);
                const endDate = new Date(this.selectDate[1]);
                this.$axios.get("http://localhost:3001/api/admin/loginlog")
                        .then(res => {
                            let filters = [];
                            res.data.forEach(item => {
                                const time = new Date(item.loginTime);
                                if(time.getTime() >= startDate.getTime() && time.getTime() <= endDate.getTime()){
                                    filters[filters.length] = item;
                                }
                            })
                            this.allLoginLog = filters;
                            this.allTableData = filters;
                            this.setPaginations();
                            this.isShow = true;
                        })
            }else{
                this.$Modal.warning({
                    title: "警告",
                    content: "请选择日期"
                });
            }
        }
    }
}
</script>

<style lang="less" scoped>
.loginlog{
    width: 100%;


    // 数据表格
    .loginlog-table{
        min-height: 522px;
    }
}
</style>
