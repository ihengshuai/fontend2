<template>
    <div class="edithtml5">
        <mavon-editor :value="getArticle" @save="save" v-model="article">
        </mavon-editor>
        <!-- 编辑保存时的提示 -->
        <Modal v-model="isSave" :zIndex="zIndex" :closable="false" :mask-closable="false" width="360">
            <p slot="header" style="color:#f60;">
                <Icon type="ios-information-circle"></Icon>
                <span>编辑提示</span>
            </p>
            <div style="text-align:left;font-size:14px;">
                <p>这将改变当前的文章,不可撤销,是否继续?</p>
            </div>
            <div slot="footer">
                <Button size="large" @click="cancelEdit()">取消</Button>
                <Button type="primary" @click="okEdit()" size="large" >确定</Button>
            </div>
        </Modal>

        <!-- 验证密码 -->
        <Modal draggable v-model="isCheckPassword" :zIndex="zIndex" :mask-closable="false" width="360">
            <p slot="header" style="color:#f60;">
                <Icon type="ios-information-circle"></Icon>
                <span>验证密码</span>
            </p>
            <div style="text-align:left;font-size:14px;">
                <Row>
                    <Col span="18">
                        <Input v-model="checkPassword" type="password" icon="ios-contact" @keyup.enter.native="checkPwd()"  placeholder="请输入管理员密码..." style="width: 200px" />
                    </Col>
                    <Col span="6">
                        <Button type="primary" size="large" @click="checkPwd()">验证</Button>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
            </div>
        </Modal>
    </div>
    
</template>

<script>
import wsmLoading from "@/myplugin/Loading";
import { setTimeout } from 'timers';
export default {
    name:"edithtml5",
    data(){
        return{
            article:"",
            isSave:false,
            zIndex:5000,
            markdown:"",
            title:"",
            checkPassword:'',
            isCheckPassword:false,
            checkNotice:""
        }
    },
    created(){
        this.$Message.info('点击保存或者(Ctrl+S)进行文章的修改');
        this.getArticle();
    },
    methods:{
        // 获取文章
        getArticle(){
            const title = decodeURI(this.$route.query.title)
            this.title = title;
            this.$axios.post("http://localhost:3001/api/article/type/html", {title})
                    .then(res => {
                        this.article = res.data.content;
                    })
        },
        // 取消修改按钮
        cancelEdit(){
            this.markdown = "";
            this.isSave = false;
        },
        // 验证密码
        checkPwd(){
            if(this.checkPassword.trim()){
                this.isCheckPassword = false;
                wsmLoading.startLoading("正在验证密码");
                setTimeout(() => {
                    this.$axios.post("http://localhost:3001/api/admin/checkpassword", {
                        pwd:this.checkPassword
                    }).then(res => {
                        if(res.data == true){
                            wsmLoading.startLoading("密码正确,正在修改文章,请稍等...");
                            console.log(this.title)
                            setTimeout(() => {
                                // 发送请求修改文章
                                this.$axios.post("http://localhost:3001/api/admin/article/change",{
                                        coursetype:"html5",
                                        title:this.title,
                                        content:this.markdown
                                    }).then(res => {
                                        wsmLoading.endLoading();
                                        this.isCheckPassword = false;
                                        this.checkPassword = "";
                                        if(res.data == "文章不存在,请刷新重试!"){
                                            this.$Message.error(res.data)
                                        }else{
                                            this.markdown = "";
                                            this.getArticle();
                                            this.$Message.success(res.data);
                                        }
                                    })
                            }, 1500)
                            
                        }else{
                            wsmLoading.endLoading();
                            this.isCheckPassword = false;
                            this.checkNotice = "密码错误";
                            this.checkPassword = "";
                            this.$Modal.confirm({
                                title:'温馨提示',
                                content:"你输入的口令有误,是否继续验证?",
                                okText: '确定',
                                type: 'warning',
                                onOk:()=>{
                                    this.isCheckPassword = true;
                                }
                            });
                        }
                    })
                }, 1500)
                
            }else{
                this.isCheckPassword = false;
                this.checkNotice = "密码不能为空";
                this.$Modal.warning({
                    title:'温馨提示',
                    content:this.checkNotice,
                    okText: '确定',
                    type: 'warning',
                    onOk:()=>{
                        this.isCheckPassword = true;
                    }
                });
            }
        },
        // 确定提交编辑内容按钮
        okEdit(){
            this.isCheckPassword = true;
            this.isSave = false;
        },
        // 保存修改文章
        save(markdown, html){
            if(markdown.length){
                this.markdown = markdown;
                this.isSave = true;
            }else{
                this.$Message.error("文章内容不能为空");
            }
        }
    },
    watch:{
        $route(to, from){
            const title = decodeURI(to.query.title)
            this.title = title;
            console.log(this.title)
            this.$axios.post("http://localhost:3001/api/article/type/html", {title})
                    .then(res => {
                        this.article = res.data.content;
                    })
        }
    }
}
</script>

<style lang="less" scoped>
.edithtml5{
    // color: rgb(248, 17, 28);

    width: 100%;
    padding: 10px 50px;

    .v-note-wrapper{
        z-index: 5;
    }

}
</style>
