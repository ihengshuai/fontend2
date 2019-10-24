<template>
    <div class="index">
        <Row style="width:100%;text-align:center;padding:0px 0px 20px 0px;">
            <Carousel autoplay  v-model="carousel" :height="300" loop style="width:100%;">
                <CarouselItem>
                    <div class="demo-carousel">
                        <img src="../../assets/carousel/html.png" style="width:100%;height:100%;" alt="">
                    </div>
                </CarouselItem>
                <CarouselItem>
                    <div class="demo-carousel">
                        <img src="../../assets/carousel/vue.jpg" style="width:100%;height:100%;" alt="">
                    </div>
                </CarouselItem>
                <CarouselItem>
                    <div class="demo-carousel">
                        <img src="../../assets/carousel/react.jpg" style="width:100%;height:100%;" alt="">
                    </div>
                </CarouselItem>
                <CarouselItem>
                    <div class="demo-carousel">
                        <img src="../../assets/carousel/webpack.png" style="width:100%;height:100%;" alt="">
                    </div>
                </CarouselItem>
            </Carousel>
        </Row>
        <div ref="chartmainline" style="width:90%; height:400px;padding:20px 0px;"></div>
    </div>
</template>

<script>
export default {
    name:"index",
    components:{},
    data(){
        return{
            carousel:0,
            optionline:{
                title:{
                    text:'TIOBE Index for programming languages',
                    subtext:"from tibeo",
                    left:"center",
                    textStyle: {
                        color: '#2b85e4',
                        fontStyle:'italic',//标题字体
                        fontSize:25
                    }

                },
                tooltip : {
                    
                },
                toolbox:{
                    show:true,//显示工具箱
                    feature:{
                        dataView:{show:true}, //以文字形式显示数据
                        restore:{show:true},   //还原
                        dataZoom:{show:true}, //区域缩放
                        saveAsImage:{show:true},  //保存图片
                        magicType:{type:['line','bar']}//动态数据切换，数据显示可以在该规定内容中切换显示方式，
                    }
                },
                legend:{
                    data:['计算机语言']
                },
                xAxis:{
                    data:["Java","JavaScript","C","C#","Python","PHP","Ruby","C++","SQL"]
                },
                yAxis:{
 
                },
                series:[{
                    name:'占比率',
                    type:'line', //设置图表主题
                    data:[500,350,480,200,450,380,120,370,190],
                    smooth:true,
                    areaStyle: {}
                }]
            },
        }
    },
    mounted(){
        this.drawLine();
    },
    watch:{
    },
    methods:{
        drawLine(){
            //基于准本好的DOM，初始化echarts实例
            let chartmainline = this.$echarts.init(this.$refs.chartmainline);
            //绘制图表
            chartmainline.setOption(this.optionline);
        }
    }
}
</script>

<style lang="less" scoped>
.index{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .demo-carousel{
        width: 100%;
        height: 100%;
        line-height: 300px;
        background-color: antiquewhite;
    }
}
</style>
