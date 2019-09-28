<template>
    <div class="adminindex">
        <admin-nav/>
        <mainarea/>
    </div>
</template>

<script>
import AdminNav from "./adminnav";
import Mainarea from "./mainarea";
export default {
    components:{
        AdminNav,
        Mainarea
    },
    data(){
        return{

        }
    },
    created(){
    },
    methods:{
    }
}
</script>

<style lang="less" scoped>
.adminindex{
    width: 100%;
    height: 100vh;
    background-color: cadetblue;
    overflow: hidden;
}
</style>

