<template>
    <div class="signlog">
        <Row style="padding:10px 0px 30px 0px;">
            <!-- 日期筛选 -->
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
                align="center">
                </el-date-picker>
            </Col>
            <Col span="7">
                <Button type="primary" @click="filtersignlog()">筛选</Button>
            </Col>
            <Col span="4">
                <Input prefix="logo-buffer" v-model="whatsignlog" clearable @keyup.enter.native="querysignlog()" placeholder="搜索日志(用户名优先)..." style="width: auto" />
            </Col>
            <Col span="2">
                <Button type="primary" v-if="isShow" @click="restore()">还原</Button>
            </Col>
            <Col span="2" style="text-align:center;">
                <Avatar @click.native="rankinglist()" style="background:#f56a00;cursor:pointer;">排行榜</Avatar>
            </Col>
        </Row>
        <!-- 表格数据 -->
        <el-table
            :data="allSignLog"
            class="signlog-table"
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
            width="210">
            </el-table-column>
            <el-table-column
            label="签到时间"
            prop="signTime"
            sortable
            align="center"
            width="200">
            </el-table-column>
            <el-table-column
            prop="username"
            label="用户名"
            sortable
            align="center"
            width="180">
            </el-table-column>
            <el-table-column
            prop="email"
            align="center"
            width="180"
            label="用户邮箱">
            </el-table-column>
            <el-table-column
            prop="signData"
            align="center"
            label="签到内容">
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
        <!-- 排行榜 -->
        <Modal v-model="rankingModal" width="700">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="md-trophy" />
                <span> 签到排行榜 <span style="color:#ccc;font-size:10px;">(前十名)</span></span>
            </p>
            <div v-if="rankingData.length">
                <div class="ranklistbox" style="width:100%;">
                    <el-table
                    :data="rankingData"
                    :row-class-name="tableRowClassName"
                    :default-sort = "{prop: 'date', order: 'descending'}"
                    height="300"
                    style="width: 100%">
                        <el-table-column
                            prop="username"
                            align="center"
                            width="200"
                            label="名称">
                        </el-table-column>
                        <el-table-column
                            prop="email"
                            align="center"
                            width="250"
                            label="邮箱ID">
                        </el-table-column>
                        <el-table-column
                            prop="signcount"
                            align="center"
                            width="100"
                            label="签到次数">
                        </el-table-column>
                        <el-table-column
                            type="index"
                            align="center"
                            width="100"
                            sortable
                            label="排名">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div slot="footer" v-if="rankingModal">
                <Row style="background:#f30;padding:10px 0px;color:#fff;font-size:14px;">
                    <Col span="8"  v-if="rankingData.length > 0" style="text-align:center;">
                        冠军:{{rankingData[0].username}}({{rankingData[0].signcount}}次)
                    </Col>
                    <Col span="8" v-if="rankingData.length > 1" style="text-align:center;">
                        亚军:{{rankingData[1].username}}({{rankingData[1].signcount}}次)
                    </Col>
                    <Col span="8" v-if="rankingData.length > 2" style="text-align:center;">
                        季军:{{rankingData[2].username}}({{rankingData[2].signcount}}次)
                    </Col>
                </Row>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    name:"signlog",
    data(){
        return{
            // 排行榜模态框
            rankingModal:false,
            rankingData:"",
            // 还原按钮
            isShow:false,
            allSignLog:[],
            allTableData:[],
            whatsignlog:"",
            // 分页组件
            paginations: {
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 10, // 1页显示多少条
                page_sizes: [10, 15, 20, 30], //每页显示多少条
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
        this.getSignLogs();
    },
    methods:{
        // 设置排行榜前三的颜色  目前没用
        tableRowClassName({row, rowIndex}) {
            if (rowIndex == 0) {
                return "first";
            } else if (rowIndex == 1) {
                return "second";
            }else if(rowIndex == 2){
                return "third";
            }
        },
        // 设置当前页
        handleCurrentChange(page) {
            // 获取当前页
            let sortnum = this.paginations.page_size * (page - 1);
            let table = this.allTableData.filter((item, index) => {
                return index >= sortnum;
            });
            // 设置默认分页数据
            this.allSignLog = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
            this.allSignLog = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        // 改变每页条数
        handleSizeChange(page_size) {
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.allSignLog = this.allTableData.filter((item, index) => {
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
            this.allSignLog = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        // 获取所有签到日志
        getSignLogs(){
            this.$axios.get("http://localhost:3001/api/admin/signlog")
                    .then(res => {
                        if(res.data){
                            this.allSignLog = res.data;
                            this.allTableData = res.data;
                            this.setPaginations();
                        }
                    }).catch(err => console.log(err))
        },
        // 查询某个人的签到日志
        querysignlog(){
            if(this.whatsignlog.trim().length){
                this.$axios.post("http://localhost:3001/api/admin/search/signlog", {querysignlog:this.whatsignlog})
                    .then(res => {
                        if(this.selectDate.length){
                            const startDate = new Date(this.selectDate[0]);
                            const endDate = new Date(this.selectDate[1]);
                            let filters = [];
                            res.data.forEach(item => {
                                const time = new Date(item.signTime);
                                if(time.getTime() >= startDate.getTime() && time.getTime() <= endDate.getTime()){
                                    filters[filters.length] = item;
                                }
                            })
                            this.allSignLog = filters;
                            this.allTableData = filters;
                            this.setPaginations();
                            this.isShow = true;
                        }else{
                            this.allSignLog = res.data;
                            this.allTableData = res.data;
                            this.setPaginations();
                            this.isShow = true;
                        }
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
            this.getSignLogs();
        },
        // 筛选数据
        filtersignlog(){
            if(this.selectDate.length){
                const startDate = new Date(this.selectDate[0]);
                const endDate = new Date(this.selectDate[1]);
                this.$axios.get("http://localhost:3001/api/admin/signlog")
                        .then(res => {
                            let filters = [];
                            res.data.forEach(item => {
                                const time = new Date(item.signTime);
                                if(time.getTime() >= startDate.getTime() && time.getTime() <= endDate.getTime()){
                                    filters[filters.length] = item;
                                }
                            })
                            this.allSignLog = filters;
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
        },
        // 排行榜
        rankinglist(){
            this.$axios.get("http://localhost:3001/api/admin/sign/ranking")
                    .then(res => {
                        if(res.data.length){
                            const rankingArr = [];
                            if(res.data.length < 11){
                                this.rankingData = res.data;
                                this.rankingModal = true;
                                // rankingArr = res.data;
                                return;
                            }else{
                                res.data.forEach(item => {
                                    if(rankingArr.length < 10){
                                        rankingArr[rankingArr.length] = item;
                                    }else{
                                        return;
                                    }
                                })
                            }
                            this.rankingData = rankingArr;
                            this.rankingModal = true;
                        }else{
                            this.$Message.error("暂无用户数据");
                        }
                    }).catch(err => console.log(err))
        }
    }
}
</script>

<style lang="less" scoped>
.signlog{
    width: 100%;


    // 数据表格
    .signlog-table{
        min-height: 522px;
    }
}

.el-table .first {
    background: rgb(238, 123, 108);
}

.el-table .second {
    background: #fcbc68;
}
.el-table .third {
    background: #c2b88e;
}
</style>
