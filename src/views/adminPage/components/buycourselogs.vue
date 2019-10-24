<template>
    <div class="buycourselogs">
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
                <Button type="primary" @click="filterbuylog()">筛选</Button>
            </Col>
            <Col span="4">
                <el-input size="small" prefix-icon="el-icon-loading" v-model="searchwhat" clearable @keyup.enter.native="searchLog()" placeholder="用户名或邮箱(用户名优先)..." style="width: auto;" />
            </Col>
            <Col span="4">
                <Button type="primary" v-if="showRestoreBtn" @click="restore()">还原</Button>
            </Col>
        </Row>

        <!-- 表格数据 -->
        <el-table
            :data="allBuyCourseLogs"
            class="article-table"
            style="width: 100%"
            border
            :summary-method="getSummaries"
            show-summary
            :default-sort = "{prop: 'date', order: 'descending'}"
            >
            <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60">
            </el-table-column>
            <el-table-column
            label="订单号"
            align="center"
            width="280">
            <template slot-scope="scope">
                <span style="color:#E9232C;">{{scope.row._id}}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="用户邮箱"
            align="center"
            width="200">
            <template slot-scope="scope">
                <Icon type="ios-send" />
                <span style="color:#888;">{{ scope.row.email }}</span>
            </template>
            </el-table-column>
            <el-table-column
            prop="username"
            label="用户名"
            align="center"
            width="200">
            </el-table-column>
            <el-table-column
            label="购买类型"
            align="center"
            width="200">
            <template slot-scope="scope">
                <span style="color:#2d8cf0;">{{scope.row.courseType}}</span>
            </template>
            </el-table-column>
            <el-table-column
            prop="totalMoney"
            label="总金额"
            sortable
            align="center"
            width="120">
            <!-- <template slot-scope="scope">
                <Icon type="ios-cart" style="color:#E6A23C" />
                <span style="margin-left:5px;color:#E6A23C;">{{scope.row.totalMoney}}</span>
            </template> -->
            </el-table-column>
            <el-table-column
            label="下单时间"
            sortable
            align="center"
            width="250">
            <template slot-scope="scope">
                <Icon type="md-time" />
                <span style="margin-left:10px;">{{scope.row.buyTime}}</span>
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

        <!-- 统计 -->
        <Row style="padding:20px 20px;">
            <el-card shadow="always" style="height:70px;">
                <Col span="9">
                    <el-date-picker
                    v-model="sellDate"
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
                <Col span="3">
                    <Button type="primary" @click="lookSell()">查看</Button>
                </Col>
                <Col span="5">
                    <span style="line-height:40px;color:#ed4014;font-size:16px;">总销售额:{{allSell}}元</span>
                </Col>
                <Col span="7" v-if="showCurrentSell">
                    <span style="line-height:40px;color:#19be6b;font-size:16px;">当前销售额:{{currentSell}}元</span>
                </Col>
            </el-card>
        </Row>
    </div>
</template>
<script>
export default {
    name:"buycourselogs",
    data(){
        return{
            allSell:0, //总销售额
            currentSell:0, //当前销售额
            showCurrentSell:false, // 是否显示当前销售额
            sellDate:"",  // 统计销售额的日期
            NotChangeTableData:[], // 不改变的表格数据,用来统计销售额
            selectDate:"",  // 选择日期
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
            searchwhat:"",
            showRestoreBtn:false,
            allBuyCourseLogs:[],
            allTableData:[],
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
        this.getAllBuyCourseLogs();
    },
    methods:{
        // 查看销售额
        lookSell(){
            if(this.sellDate.length){
                this.showCurrentSell = true;
                const startTime = new Date(this.sellDate[0]).getTime();
                const endTime = new Date(this.sellDate[1]).getTime();
                this.NotChangeTableData.forEach(item => {
                    const itemTime = new Date(item.buyTime).getTime();
                    if(itemTime >= startTime && itemTime <= endTime){
                        this.currentSell += parseFloat(item.totalMoney)
                    }
                });
            }else{
                this.$Modal.warning({
                    title:"提示",
                    content:"查找的日期不能为空,请重新选择日期!"
                })
            }
        },
        // 搜索购买记录
        searchLog(){
            if(this.searchwhat.trim().length){
                this.showRestoreBtn = true;
                this.$axios.post("http://localhost:3001/api/admin/logs/userbuy", {
                    searchwhat:this.searchwhat
                }).then(res => {
                        if(this.selectDate.length){
                            const result = [];
                            const startTime = new Date(this.selectDate[0]).getTime();
                            const endTime = new Date(this.selectDate[1]).getTime();
                            res.data.forEach(item => {
                                const itemTime = new Date(item.buyTime).getTime();
                                if(itemTime >= startTime && itemTime <= endTime){
                                    result[result.length] = item;
                                }
                            });
                            this.allBuyCourseLogs = result;
                            this.allTableData = result;
                            this.setPaginations();
                        }else{
                            this.allBuyCourseLogs = res.data;
                            this.allTableData = res.data;
                            this.setPaginations();
                        }
                    })
            }else{
                this.$Modal.warning({
                    title:"警告",
                    content:"输入内容不能为空,请重新输入!",
                })
            }
        },
        // 筛选记录
        filterbuylog(){
            if(this.selectDate.length){
                this.showRestoreBtn = true;
                this.$axios.post("http://localhost:3001/api/admin/logs/buycourse/filter", {
                    query:this.searchwhat
                }).then(res => {
                    const result = [];
                    const startTime = new Date(this.selectDate[0]).getTime();
                    const endTime = new Date(this.selectDate[1]).getTime();
                    res.data.forEach(item => {
                        const itemTime = new Date(item.buyTime).getTime();
                        if(itemTime >= startTime && itemTime <= endTime){
                            result[result.length] = item;
                        }
                    });
                    this.allBuyCourseLogs = result;
                    this.allTableData = result;
                    this.setPaginations();
                })
            }else{
                this.$Modal.warning({
                    title:"提示",
                    content:"日期不能为空! 请重新选择日期!"
                })
            }
        },
        // 还原所有记录
        restore(){
            this.getAllBuyCourseLogs();
            this.searchwhat = "";
            this.selectDate = null;
            this.showRestoreBtn = false;
        },
        // 获取所有的购买日志
        getAllBuyCourseLogs(){
            this.$axios.get("http://localhost:3001/api/admin/logs/buycourse")
                .then(res => {
                    this.NotChangeTableData = res.data;
                    this.allBuyCourseLogs = res.data;
                    this.allTableData = res.data;
                    this.setPaginations();
                    res.data.forEach(item => {
                        this.allSell += parseFloat(item.totalMoney);
                    })
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
            this.allBuyCourseLogs = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
            this.allBuyCourseLogs = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        // 改变每页条数
        handleSizeChange(page_size) {
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.allBuyCourseLogs = this.allTableData.filter((item, index) => {
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
            this.allBuyCourseLogs = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        // 合计
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '总价';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0);
                    sums[index] += ' 元';
                } else {
                    sums[index] = 'N/A';
                }
            });
            return sums;
      }
    },
    watch:{
        // 监视 sellDate 属性
        sellDate(){
            if(!this.sellDate){
                this.currentSell = 0;
                this.showCurrentSell = false;
            }
        }
    }
}
</script>
<style lang="less" scoped>
.buycourselogs{
    // color:aqua;
}
</style>