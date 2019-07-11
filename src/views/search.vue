<template>
    <div class="search">
        <!-- 导航栏 -->
        <PCNAV></PCNAV>

        <div class="" v-if="query.length">
            <div v-for="item in query" :key="item.title">
                <router-link :to="'/home/' + item.coursetype + '#' + item.hash">
                    <p style="padding:20px 10px;background:#eee;font-size:18px;">{{item.title}}</p>
                </router-link>
                <div v-html="item.content"></div>
            </div>
        </div>
        <div v-if="!query.length">
            搜索内容为空
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
            
        }
    },
    created(){
        if(this.$route.query.q.trim().length){
            this.$axios.post("http://localhost:3001/api/article/search", {search:this.$route.query.q})
                            .then(res => {
                                this.query = res.data;
                            })
        }
    },
    watch:{
        $route(to, form){
            this.query = this.$store.getters.search;
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
}
</style>
