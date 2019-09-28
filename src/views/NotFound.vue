<template>
    <div class="notfound">
        
        <div class="wrapper">
            <img src="../assets/imgs/404.gif" alt="">
            <div class="btns">
                <div class="home" @click="backWebsite('home')">我要回家</div>
                <div class="music" @click="backWebsite('music')">听听音乐</div>
                <div class="article" @click="backWebsite('article')">看看文章</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"notFound",
    data(){
        return{

        }
    },
    methods:{
        backWebsite(url){
            console.log(url)
            if(url == "home"){
                this.$router.push("/home")
            }else if(url == "music"){
                this.$router.push("/home/enjoymusic");
            }else{
                this.$router.push({path:"/home/html5", query:{title:"HTML简介"}})
            }
        }
    }
}
</script>
<style lang="less" scoped >
    .notfound{
        width: 100%;
        height: 100vh;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .wrapper{
            float: left;
            display: flex;
            align-items: center;
            
            .btns{
                height: 100%;
                div{
                    padding: 10px 0px;
                    text-align: center;
                    font-size: 16px;
                    font-weight: 700;
                    color: rgb(126, 99, 13);
                    cursor: pointer;
                    &:hover{
                        color: rgb(250, 71, 65);
                    }
                }
            }

            @media screen and (max-width: 600px){
                .btns{
                    display: none;
                }
            }
            
        }
    }
    /* .notfound img{
        width: 100%;
        height: 100%;
    } */
</style>