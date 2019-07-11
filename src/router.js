/*
 * @Author: Mr_Wei
 * @Description: 路由配置文件
 * @Date: 16:34 2019/6/29
 * @Param: router.js
 * @return:
 **/

//  依赖
import Vue from 'vue';
import Router from 'vue-router';
import iView from 'iview';
import wsmLoading from "@/myplugin/Loading";

// 路由文件
import Home from '@/views/Home';
import Index from '@/views/Index';
import MHome from '@/views/M.Home';
import HTML5 from '@/views/html5';
import CSS from '@/views/css';
import JavaScript from '@/views/javascript';
import Search from '@/views/search';
import UserLogin from '@/views/userlogin';
import UserRegister from '@/views/userregister';
import UserInfo from '@/views/userinfo';
import Callus from '@/views/callus';
import NotFound from '@/views/NotFound';

Vue.use(Router)


const vueRouter = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
      {
        path:"/",
        redirect:"/home/index"
      },
      {
        path:"/home",
        component:Home,
        // name:"home",
        meta:{
          title:"前端教程 | by 卫恒帅"
        },
        children:[
          {path:"",  component:Index, meta:{title:"前端教程 | by 卫恒帅"}},
          {path:"index", name:"index", component:Index, meta:{title:"前端教程 | by 卫恒帅"}},
          {path:"html5", name:"html5", component:HTML5, meta:{title:"HTML5 | by 卫恒帅"}},
          {path:"css", name:"css", component:CSS, meta:{title:"CSS | by 卫恒帅"}},
          {path:"javascript", name:"javascript", component:JavaScript, meta:{title:"JavaScript | by 卫恒帅"}},
          {path:"userinfo", name:"userinfo", component:UserInfo, meta:{title:"前端教程 | 个人信息"}},
          {path:"callus", name:"callus", component:Callus, meta:{title:"前端教程 | 联系我们"}},
        ]
      },
      // 查询路由
      {
        path:"/search",
        name:"search",
        component:Search,
        meta:{
          title:"前端教程 | 查询"
        }
      },
      // 登录路由
      {
        path:"/login",
        name:"userlogin",
        component:UserLogin,
        meta:{
            title:"前端教程 | 用户登录"
        }
      },
      // 注册路由
      {
        path:"/register",
        name:"userregister",
        component:UserRegister,
        meta:{
            title:"前端教程 | 用户注册"
        }
      },
      {
        path:"/m.home",
        // name:"MHome",
        component:MHome,
        meta:{
          title:"前端教程 | by 卫恒帅"
        },
        children:[
          {path:"", redirect:"index"},
          {path:"index", name:"mindex", component:Index, meta:{title:"前端教程 | by 卫恒帅"}},
          {path:"html5", name:"mhtml5", component:HTML5, meta:{title:"HTML5 | by 卫恒帅"}},
          {path:"css", name:"mcss", component:Index, meta:{title:"CSS | by 卫恒帅"}},
          {path:"javascript", name:"mjavascript", component:Index, meta:{title:"JavaScript | by 卫恒帅"}}
        ]
      },
      // 找不到页面
      {
        path:"*",
        name:"NotFound",
        component:NotFound,
        meta:{
          title:"o(╥﹏╥)o页面不存在"
        }
      }
  ]
});



// 路由守卫
vueRouter.beforeEach((to, from, next) => {
    // 导航进度条
    iView.LoadingBar.start();
    // 渲染标题
    if(to.meta.title){
        document.title = to.meta.title;
    }

    // 是否登录
    const isLogin = localStorage.jwtToken ? true : false;

    // 判断是不是第三方网站
    let url = to.path.split("bbb");

    if(to.path == "/login" || to.path == "/register" || to.path == "/home" || to.path == "/home/index" || to.path == "/home/html5" || to.path == "/home/css" || to.path == "/home/javascript" || to.path == "/home/callus"){
        next();
    }else{
        if(to.path == "/search"){
            const isQuery = to.query.q ? true : false;
            if(isQuery){
                next();
            }else{
                iView.Message.error("搜索内容不能为空");
                next("/");
            }
        }else if(url[1]){
            setTimeout(() => {
                next("/home");
                wsmLoading.startLoading("正在跳往第三方网站...");
                setTimeout(() => {
                    wsmLoading.endLoading();
                    window.location.href = "http://" + url[1];
                }, 1000);
            }, 1);
        }else{
            if(!isLogin){
                iView.Message.error("请先登录...");
                next("/home")
            }else{
                next();
            }
        }
    }
    
});

vueRouter.afterEach(() => {
  iView.LoadingBar.finish();
})



export default vueRouter; 
