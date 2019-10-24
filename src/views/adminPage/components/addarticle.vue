<template>
    <div class="addarticle">
        <div class="stepsbar">
            <Steps :current="current">
                <Step title="文章类型" icon="ios-home" content="请选择添加文章的类型"></Step>
                <Step title="文章标题" icon="ios-bulb" content="填写文章标题(不可重复)"></Step>
                <Step title="文章内容" icon="ios-book" content="请撰写文章"></Step>
                <Step title="提交文章" icon="ios-finger-print" content="提交验证文章"></Step>
            </Steps>
        </div>
        <div class="tabs">
            <Tabs type="card">
                <TabPane label="步骤一" class="firstandsecond" v-if="tab1">
                    <Select v-model="articleType" prefix="ios-home" size="large" style="text-align:center;width:200px">
                        <Option v-for="item in articleTypeList" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </TabPane>
                <TabPane label="步骤二" class="firstandsecond" v-if="tab2">
                    <Input @keyup.enter.native="nextbtn()" prefix="ios-bulb" v-model="articleTitle" size="large" placeholder="请输入文章标题..." clearable style="width: 300px" />
                </TabPane>
                <TabPane label="步骤三" class="tab3" v-if="tab3">
                    <mavon-editor :value="articleContent" @save="save" v-model="articleContent">
                    
                    </mavon-editor>
                </TabPane>
                <TabPane class="tab4" label="步骤四" v-if="tab4">
                    <div class="type" style="padding:10px 0px;">
                        <Icon type="ios-cube" style="color:#ed4014;font-size:20px;" />
                        <span style="color:#ed4014;font-size:20px;margin-right:10px;">文章类型:</span> 
                        <span style="color:#2b85e4;font-size:18px">{{articleType}}</span>
                    </div>
                    <div class="title" style="padding:10px 0px;">
                        <Icon type="md-planet" style="color:#ed4014;font-size:20px;" />
                        <span style="color:#ed4014;font-size:20px;margin-right:10px;">文章标题:</span> 
                        <span style="color:#2b85e4;font-size:18px">{{articleTitle}}</span>
                    </div>
                    <div class="content" style="padding:10px 0px;">
                        <span>
                            <Icon type="ios-rose" style="color:#ed4014;font-size:20px;" />
                            <span style="color:#ed4014;font-size:20px;margin-right:10px;">文章内容:</span>
                        </span>
                        <div style="padding:10px 0px;">
                            <div  class="markdown-body code-hybrid render-markdown" v-html="articleHTML">

                            </div>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
        </div>
        <!-- 验证密码模态框 -->
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
        <div class="nextbtn">
            <ButtonGroup shape="circle">
                <Button type="primary" @click="previousbtn()">
                    <Icon type="ios-arrow-back"></Icon>
                    上一步
                </Button>
                <Button :type="nextbtntype" @click="nextbtn()">
                    {{nextbtntitle}}
                    <Icon type="ios-arrow-forward"></Icon>
                </Button>
            </ButtonGroup>
        </div>
    </div>
</template>

<script>
import wsmLoading from "@/myplugin/Loading";
import { setTimeout } from 'timers';
export default {
    name:"addarticle",
    components:{},
    data(){
        return{
            zIndex:100,
            isCheckPassword:false,
            checkPassword:"",
            tab1:true,
            tab2:false,
            tab3:false,
            tab4:false,
            isSave:false, // 判断文章是否保存
            nextbtntitle:"下一步",
            nextbtntype:"primary",
            current:0, // 当前步骤条
            articleTypeList:["html5","css","javascript"],
            articleType:"", // 文章类型
            articleTitle:"", // 文章标题
            articleContent:"", // 文章内容
            articleHTML:""
        }
    },
    methods:{
        // 验证密码
        checkPwd(){
            if(this.checkPassword.length){
                this.isCheckPassword = false;
                wsmLoading.startLoading("正在验证密码,请稍候...");
                setTimeout(() => {
                    this.$axios.post("http://localhost:3001/api/admin/checkpassword", {
                        pwd:this.checkPassword,
                        email:this.$store.getters.admin.email
                    }).then(res => {
                        if(res.data == true){   // 密码正确
                            wsmLoading.startLoading("密码正确,正在创建文章,请稍候...");
                            setTimeout(() => {
                                this.$axios.post("http://localhost:3001/api/admin/article/add", {
                                        coursetype:this.articleType,
                                        title:this.articleTitle,
                                        content:this.articleContent
                                    }).then(res => {
                                        wsmLoading.endLoading();
                                        this.$Message.info(res.data);
                                        this.nextbtntitle = "下一步";
                                        this.nextbtntype = "primary";
                                        this.isCheckPassword = false;
                                        this.checkPassword = "";
                                        this.current = 0;
                                        this.tab1 = true;
                                        this.tab4 = false;
                                        this.isSave = false;
                                        this.articleTitle = "";
                                        this.articleContent = "";
                                        this.articleType = "";
                                    })
                            }, 1000)
                        }else{  // 密码错误
                            wsmLoading.endLoading();
                            this.$Modal.confirm({
                                title:"温馨提示",
                                content:"密码错误请重新输入..",
                                cancelText:"取消验证",
                                okText:"重新验证",
                                onOk:()=>{
                                    this.checkPassword = "";
                                    this.isCheckPassword = true;
                                },
                                onCancel:()=>{
                                    this.checkPassword = "";
                                    this.isCheckPassword = false;
                                }
                            })
                        }
                    })
                }, 1500)
            }else{
                this.$Modal.warning({
                    title:"温馨提示",
                    content:"密码不能为空"
                })
            }
        },
        // 下一步按钮
        nextbtn(){
            if(this.current == 0){
                if(this.articleType.trim().length){
                    this.current = this.current >= 3 ? this.current : this.current + 1;
                    this.tab1 = false;
                    this.tab2 = true;
                }else{
                    this.$Modal.warning({
                        title: "警告",
                        content: "请选择文章类型"
                    });
                }
            }else if(this.current == 1){
                if(this.articleTitle.trim().length){
                    this.$axios.post("http://localhost:3001/api/admin/article/isexist", {
                            coursetype:this.articleType,title:this.articleTitle.toUpperCase()
                        }).then(res => {
                            if(res.data == false){
                                this.$Modal.error({
                                    title: "警告",
                                    content: "文章标题已存在,请勿重复创建!"
                                });
                            }else{
                                this.current = this.current >= 3 ? this.current : this.current + 1;
                                this.tab2 = false;
                                this.tab3 = true;
                            }
                        })
                }else{
                    this.$Modal.warning({
                        title: "警告",
                        content: "文章标题不能为空,请填写文章标题~"
                    });
                }
            }else if(this.current == 2){
                if(this.articleContent.trim().length){
                    if(this.isSave){
                        this.current = this.current >= 3 ? this.current : this.current + 1;
                        this.tab3 = false;
                        this.tab4 = true;
                        this.nextbtntype = "error";
                        this.nextbtntitle = "提交文章";
                    }else{
                        this.$Modal.warning({
                            title: "警告",
                            content: "请先保存 Ctrl+S (或点击工具栏上的保存图标)"
                        });
                    }
                    
                }else{
                    this.$Modal.warning({
                        title: "警告",
                        content: "文章内容不能为空,请写好文章后再提交文章~"
                    });
                }
            }else if(this.current == 3){
                this.current = 3;
                this.tab3 = false;
                this.tab4 = true;
                this.nextbtntitle = "提交文章";
                this.isCheckPassword = true;
            }
        },
        // 上一步按钮
        previousbtn(){
            if(this.current == 0){
                this.current = 0;
            }
            if(this.current == 1){
                this.tab2 = false;
                this.tab1 = true;
                this.current = this.current > 0 ? this.current - 1 : 0;
            }
            if(this.current == 2){
                this.tab3 = false;
                this.tab2 = true;
                this.current = this.current > 0 ? this.current - 1 : 0;
            }
            if(this.current == 3){
                this.tab4 = false;
                this.tab3 = true;
                this.nextbtntitle = "下一步";
                this.nextbtntype = "primary";
                this.current = this.current > 0 ? this.current - 1 : 0;
            }
        },
        // 保存文章
        save(markdown, html){
            this.isSave = true;
            this.$Message.info("已保存");
            this.articleHTML = html;
        },
    }
}
</script>

<style lang="less" scoped>
.addarticle{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    padding: 20px 0px;

    // 步骤条
    .stepsbar{
        width: 100%;
        display: flex;
        align-content: center;
        justify-content: center;
        padding-bottom: 50px;
        // border-bottom: 1px solid #eee;

        .ivu-steps{
            padding-left: 100px;
        }
    }

    // 标签卡
    .tabs{
        width: 100%;

        .firstandsecond{
            padding: 20px 100px 20px 100px;
            display: flex;
            align-content: center;
            justify-content: center;
            min-height: 200px;
        }

        .tab3{
            max-height: 500px;
            overflow-y: scroll;
        }

        .tab4{
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            padding: 20px 50px;

            // markdown回显
            .render-markdown{
                padding: 20px 50px;
                border: 1px solid #eee;
            }
        }
    }

    // 下一步button
    .nextbtn{
        padding: 100px 170px;
        display: flex;
        justify-content: center;
    }
}
</style>
