<template>
    <div class="css" id="css">
        <div class="outer-box">
            <div class="left-bar">
                <Row style="padding:10px 0px 20px 0px;color:#000;font-size:25px;font-weight:800;">
                    <span >导航</span>
                </Row>
                <Menu theme="light" style="z-index:10;" :active-name="activeName" accordion class="menu">
                    <MenuItem :to="'/home/css?title=' + item.title" :name="parseInt(index)" v-for="(item,index) in articlenav" :key="item.title"><Icon type="logo-css3" />{{item.title}}</MenuItem>
                </Menu>
            </div>
            <div class="right-content" id="right-content">
                
                <mavon-editor :subfield="false" :toolbarsFlag="false" :value="article" v-model="article" :defaultOpen="preview">
                    
                </mavon-editor>

                <div class="footer-nav">
                    <div class="prev" @click="prev()">上一篇</div>
                    <div class="next" @click="next()">下一篇</div>
                </div>
            </div>
        </div>

        <!-- 移动端导航 -->
        <div class="mobile-nav" @click.native="changeDrawer()">
            <Icon type="md-cube" @click.native="changeDrawer()" size="40"/>
        </div>
        <!-- 移动端导航抽屉 -->
        <Drawer style="overflow-y:scroll;" title="CSS导航" v-model="mobileDrawer">
            <Menu theme="light">
                <MenuItem @click.native="shutDrawer()" :to="'/home/css?title=' + item.title" :name="parseInt(index)" v-for="(item,index) in articlenav" :key="item.title"><Icon type="ios-hammer" />{{item.title}}</MenuItem>
            </Menu>
        </Drawer>
    </div>
</template>

<script>


export default {
    name:"css",
    components:{

    },
    data(){
        return{
            preview:"preview",
            articlenav:"",
            article:"",
            mobileDrawer:false,
            activeName:""
        }
    },
    created(){
        this.getArticleNav();
        this.getArticle();
        window.scrollTo(0,0);
        $('#right-content').animate({scrollTop: 0}, 5);
    },
    mounted(){
        setTimeout(() => {
            const title = this.$route.query.title;
            this.activeName = this.getIndex(title);
        }, 100)
    },
    methods:{
        // 关闭移动端导航
        shutDrawer(){
            this.mobileDrawer = false;
        },
        // 改变移动端导航
        changeDrawer(){
            this.mobileDrawer = true;
            // console.log(111)
        },
        save(){
            // console.log(this.markdown_html)
        },
        // 获取CSS文章导航
        getArticleNav(){
            this.$axios.get("http://localhost:3001/api/article/css")
                    .then(res => {
                        this.articlenav = res.data;
                    })
        },
        // 根据query获取文章
        getArticle(){
            const title = decodeURI(this.$route.query.title);
            this.$axios.post("http://localhost:3001/api/article/type/css", {title})
                    .then(res => {
                            this.article = res.data.content;
                    }).catch(error => this.$router.push({path:"/home/css", query:{title:'CSS简介'}}))
        },
        // 判断序号
        getIndex(title){
            var Index = "";
            this.articlenav.forEach((item, index) => {
                if(item.title == title)
                Index = index;
                return;
            })
            return Index;
        },
        // 上一篇
        prev(){
            const index = this.getIndex(this.$route.query.title);
            if(index == 0){
                this.$Message.warning("已经是第一页了");
            }else{
                const title = this.articlenav[index - 1].title;
                this.$router.push({path:"/home/css",query:{title:title}})
            }
        },
        // 下一篇
        next(){
            const index = this.getIndex(this.$route.query.title);
            if(index == (this.articlenav.length - 1)){
                this.$Message.warning("已经是最后一页了");
            }else{
                const title = this.articlenav[index + 1].title;
                this.$router.push({path:"/home/css",query:{title:title}})
            }
        }
    },
    computed:{
        
    },
    watch:{
        // 监听路由变化
        $route(to, from){
            this.getArticle();
            this.mobileDrawer = false;
            const title = this.$route.query.title;
            this.activeName = this.getIndex(title);
            // 每次切换文章时,让滚动条置顶
            window.scrollTo(0,0);
            $('#right-content').animate({scrollTop: 0}, 5);
        }
    }
}
</script>

<style lang="less" scoped>

.css{
    width:100%;
    
    .v-note-wrapper{
        z-index:5;
    }

    .outer-box{
        width: 100%;
        height: 93vh;
        display: flex;

        // 左边导航
        .left-bar{
            width: 300px;
            border-right: 1px solid #eee;
            padding: 40px 40px;
            height: 100%;
            overflow-y: scroll;
            overflow-x: hidden;
        }

        // 右侧内容区域
        .right-content{
            flex: 1;
            padding: 25px 40px 200px 40px;
            overflow-y: scroll;

            .footer-nav{
                width: 100%;
                height: 60px;
                background-color: rgb(230, 230, 230);
                border-radius: 30px;
                margin: 20px 0px;
                margin-bottom: 100px;
                display: flex;
                align-content: space-between;
                justify-content: space-between;
                line-height: 60px;

                .prev{
                    width: 150px;
                    text-align: center;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 1s;
                }
                .prev:hover{
                    text-decoration: underline;
                    transform: scale(1.05)
                }
                .next{
                    width: 150px;
                    text-align: center;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 1s;
                }
                .next:hover{
                    text-decoration: underline;
                    transform: scale(1.05)
                }
            }
        }
    }
    // 移动端导航
    .mobile-nav{
        width: 40px;
        height: 40px;
        position: fixed;
        z-index: 10000;
        bottom: 50px;
        right: 40px;
        display: none;

        .ivu-icon-md-cube{
            color: cadetblue;
        }
    }

    @media screen and (max-width: 900px){
        .outer-box{
            .right-content{
                padding: 20px 10px;
            }
        }


        // 左边导航
        .left-bar{
            display: none;
        }

        // 移动端导航
        .mobile-nav{
            display: block;
        }
    }
    

    
}
</style>
