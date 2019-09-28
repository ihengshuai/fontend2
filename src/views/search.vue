<template>
    <div class="search">
        <!-- 导航栏 -->
        <PCNAV></PCNAV>

        <div class="wrapper">
            <div class="left">
                <div class="leftBar" v-if="query.length">
                    <div>书</div>
                    <div>山</div>
                    <div>有</div>
                    <div>路</div>
                    <div>勤</div>
                    <div>为</div>
                    <div>径</div>
                </div>
                <div class="rightBar" v-if="query.length">
                    <div>学</div>
                    <div>海</div>
                    <div>无</div>
                    <div>涯</div>
                    <div>苦</div>
                    <div>作</div>
                    <div>舟</div>
                </div>
                <div class="noResultBar" v-if="!query.length">
                    <div>亲</div>
                    <div>,</div>
                    <div>尝</div>
                    <div>试</div>
                    <div>一</div>
                    <div>下</div>
                    <div>其</div>
                    <div>它</div>
                    <div>哦</div>
                    <div>๑乛◡乛๑</div>
                </div>
            </div>
            <div class="right">
                <div class="seach-content">
                    <div class="markdown-box" @click="godestination(item)" style="width:80%;"  v-for="item in query" :key="item.title">
                        <mavon-editor style="height:150px;overflow:hidden!important;" :subfield="false" :toolbarsFlag="false" :value="item.content" :defaultOpen="preview">
                        </mavon-editor>
                    </div>
                </div>
                <div class="noresult" v-if="!query.length">
                    <div>抱歉,暂没有你想要的内容~</div>
                </div>

                <!-- 分页 -->
                <Row style="padding:0px 0px 40px 0px;" v-if='query.length > 0'>
                    <Col span="24" style="text-align:right;padding:5px 10px;">
                        <el-pagination 
                            class="paginate"
                            background
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
        </div>
        

        <!-- 返回上一页 -->
        <div class="back-page" @click="backPage()">
            返回
        </div>
    </div>
</template>

<script>
import PCNAV from '@/components/pcnav';
export default {
    name:"search",
    components:{
        PCNAV
    },
    data(){
        return{
            preview:"preview",
             paginations: {
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 10, // 1页显示多少条
                page_sizes: [5, 10, 15, 20], //每页显示多少条
                layout: "total, prev, pager, next" // 翻页属性
            },
            allQueryResult:[],
        }
    },
    created(){
        if(this.$route.query.q.trim().length){
            this.$axios.post("http://localhost:3001/api/article/search", {search:this.$route.query.q})
                            .then(res => {
                                this.query = res.data;
                                this.allQueryResult = res.data;
                                this.setPaginations();
                            })
        }
    },
    methods:{
        // 搜索后点击进入指定的页面
        godestination(info){
            this.$router.push("/home/" + info.coursetype + "?title=" + info.title)
        },
        // 返回上一页
        backPage(){
            const prev = localStorage.getItem("backpage");
            if(prev.length){
                this.$router.push(prev);
            }
        },
        // 设置当前页
        handleCurrentChange(page) {
            // 获取当前页
            let sortnum = this.paginations.page_size * (page - 1);
            let table = this.allQueryResult.filter((item, index) => {
                return index >= sortnum;
            });
            // 设置默认分页数据
            this.query = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
            this.query = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        // 改变每页条数
        handleSizeChange(page_size) {
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.query = this.allQueryResult.filter((item, index) => {
                return index < page_size;
            });
        },
        // 设置的分页
        setPaginations() {
            // 总页数
            this.paginations.total = this.allQueryResult.length;
            this.paginations.page_index = 1;
            this.paginations.page_size = 5;
            // 设置默认分页数据
            this.query = this.allQueryResult.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
    },
    watch:{
        $route(to, form){
            this.query = this.$store.getters.search;
            setTimeout(() => {
                this.allQueryResult = this.$store.getters.search;
                this.setPaginations();
            }, 100)
        }
    },
    computed:{
        query:{
            get(){
                return this.$store.getters.search;
            },
            set(val){
                this.$store.commit("search", val);
            }
        }
    }
}
</script>

<style lang="less" scoped>
.search{
    width: 100%;
    height: 92.8vh;
    .wrapper{
        width: 100%;
        height: 100%;
        display: flex;
        overflow: hidden;
        background: transparent;

        .left{
            width:300px;
            height: 100%;
            min-height: 800px;
            border-right: 1px solid #000;
            border-left: 1px solid #000;
            background-image: url(../assets/imgs/blog.jpg);
            background-size: 200% 100%;
            background-position: center center;

            .noResultBar{
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                text-align: center;
                font-size: 25px;
                padding-top: 150px;
                font-weight: 900;
                color: rgb(236, 82, 82);
                div{
                    animation: haha 3s linear infinite;
                }
                @keyframes haha {
                    from{
                        transform: scale(1.0);
                        color: rgb(236, 82, 82);
                    }
                    to{
                        transform: scale(1.4);
                        color: rgb(221, 216, 216);
                    }
                }
            }

            .leftBar{
                width: 50%;
                height: 100%;
                display: flex;
                text-align: center;
                flex-direction: column;
                padding-top: 200px;
                div{
                    width: 150px;
                    font-size: 20px;
                    color: #fff;
                }
            }
            .rightBar{
                position: relative;
                top: -800px;
                right:-150px;
                width: 50%;
                height: 100%;
                display: flex;
                text-align: center;
                flex-direction: column;
                align-items: center;
                padding-top: 350px;
                div{
                    width: 150px;
                    font-size: 20px;
                    color: #fff;
                }
            }
        }
        .right{
            flex: 1;
            height: 100%;
            overflow-y: scroll;

            .paginate{
                background-color: transparent;
            }

            .noresult{
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                background-image: url(../assets/imgs/404.gif);
                background-position: center center;
                background-repeat: no-repeat;


                div{
                    color: rgb(168, 107, 14);
                    padding: 20px 0px;
                    font-size: 30px;
                    font-weight: 900;
                }
            }
        }
    }


    // 搜索内容部分
    .seach-content{
        padding: 50px 0px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-direction: column;
        margin: auto;
        // flex-wrap: wrap;

        .markdown-box{
            border-radius: 5px;
            border: 1px solid #ddd;
            cursor: pointer;
            overflow: hidden !important;
            overflow-y: hidden;
            margin: 8px 0px;
            width: 100%;
            height: 150px;
            box-shadow: 0px 1px 1px #ccc;
            div{
                font-size: 5px;
            }
        }
        
    }


    // 移动端导航
    .back-page{
        width: 40px;
        height: 40px;
        border-radius: 20px;
        color: #fff;
        font-weight: 700;
        cursor: pointer;
        background-color: #999;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        position: fixed;
        z-index: 10000;
        bottom: 80px;
        right: 35px;
        display: none;
    }


    .v-note-wrapper{
        z-index: 2;
        overflow-y: hidden!important;
    }
    .v-note-wrapper, .v-note-panel, .v-note-show, .v-show-content{
        overflow: hidden!important;
    }
    .v-note-wrapper, .v-note-panel, .v-note-show, .v-show-content{
        max-height: 40px !important;
    }

    @media screen and (max-width: 900px){
        .back-page{
            display: block;
        }

        .left{
            display: none;
        }
        .wrapper{
            display: block;
        }

        // 搜索内容部分
        .seach-content{
            display: flex;
            align-items: center;
            justify-content: space-around;
            flex-direction: column;
            margin: auto;
            // flex-wrap: wrap;

            .markdown-box{
                border-radius: 5px;
                border: 1px solid #ddd;
                overflow: hidden;
                margin: 8px 0px;
                width: 100%;
                height: 150px;
                div{
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
