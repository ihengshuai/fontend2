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

// 公共组件
import Home from '@/views/Home';
import Index from '@/views/Index';
import MHome from '@/views/M.Home';
import Search from '@/views/search';
import NotFound from '@/views/NotFound';

// 课程组件
import HTML5 from '@/views/coursePage/html5';
import CSS from '@/views/coursePage/css';
import JavaScript from '@/views/coursePage/javascript';

// VIP课程
import VIP_HTML from '@/views/vipCoursePage/htmlcourse';
import VIP_CSS from '@/views/vipCoursePage/csscourse';
import VIP_JAVASCRIPT from '@/views/vipCoursePage/javascriptcourse';

// 普通用户组件
import UserLogin from '@/views/userPage/userlogin';
import UserRegister from '@/views/userPage/userregister';
import UserInfo from '@/views/userPage/userinfo';
import MessageWall from '@/views/userPage/messagewall';
import EnjoyMusic from '@/views/userPage/enjoymusic';
import AboutMe from '@/views/userPage/aboutme';
import VipCourse from '@/views/userPage/vipcourse';

// 管理员组件
import AdminLogin from '@/views/adminPage/adminlogin';
import AdminIndex from '@/views/adminPage/adminindex';
import ManageIndex from "@/views/adminPage/index";
import ManageUsers from "@/views/adminPage/components/manageusers";
import OperaLog from "@/views/adminPage/components/operationlog";
import LoginLog from "@/views/adminPage/components/loginlog";
import RegisterLog from "@/views/adminPage/components/registerlog";
import SignLog from "@/views/adminPage/components/signlog";
import EditHTML from "@/views/adminPage/components/edithtml";
import EditCSS from "@/views/adminPage/components/editcss";
import EditJavaScript from "@/views/adminPage/components/editjavascript";
import AddArticle from "@/views/adminPage/components/addarticle";
import ManageMusic from "@/views/adminPage/components/managemusic";
import SpecificArticle from "@/views/adminPage/components/specificarticles";
import BuyCourseLog from "@/views/adminPage/components/buycourselogs";
import HomePageData from "@/views/adminPage/components/homepagedata";
import VipCourseHtml from "@/views/adminPage/components/vipcoursehtml";
import VipCourseCss from "@/views/adminPage/components/vipcoursecss";
import VipCourseJs from "@/views/adminPage/components/vipcoursejs";
import HTMLMessage from "@/views/adminPage/components/htmlmessage";
import CSSMessage from "@/views/adminPage/components/cssmessage";
import JSMessage from "@/views/adminPage/components/jsmessage";
import CommunityMessage from "@/views/adminPage/components/communitymessage";


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
          title:"前端教程 | by 卫思勉"
        },
        children:[
          {path:"",  component:Index, meta:{title:"前端教程 | by 卫思勉"}},
          {path:"index", name:"index", component:Index, meta:{title:"前端教程 | by 卫思勉"}},
          {
            path:"html5", 
            name:"html5", 
            component:HTML5, 
            meta:{title:"HTML5 | by 卫思勉"}
          },
          {path:"css", name:"css", component:CSS, meta:{title:"CSS | by 卫思勉"}},
          {path:"javascript", name:"javascript", component:JavaScript, meta:{title:"JavaScript | by 卫思勉"}},
          {path:"userinfo", name:"userinfo", component:UserInfo, meta:{title:"前端教程 | 个人信息"}},
          {path:"messagewall", name:"messagewall", component:MessageWall, meta:{title:"前端教程 | 留言墙"}},
          {path:"enjoymusic", name:"enjoymusic", component:EnjoyMusic, meta:{title:"前端教程 | 浸在美曲"}},
          {path:"aboutme", name:"aboutme", component:AboutMe, meta:{title:"前端教程 | 关于作者"}},
          {path:"vip/course", name:"vipcourse", component:VipCourse, meta:{title:"前端教程 | VIP专区"}},
          {
            path:"vip/course/html5/play", 
            name:"vip_html5", 
            component:VIP_HTML, 
            meta:{title:"前端教程 | HTML VIP课程"}
          },
          {path:"vip/course/css/play", name:"vip_css", component:VIP_CSS, meta:{title:"前端教程 | CSS VIP课程"}},
          {path:"vip/course/javascript/play", name:"vip_javascript", component:VIP_JAVASCRIPT, meta:{title:"前端教程 | JAVASCRIPT VIP课程"}},
        ]
      },
      {
        path:"/admin",
        redirect:"/admin/index"
      },
      {
        path:"/admin/index",
        component:AdminIndex,
        meta:{
          title:"前端教程 | 后台管理"
        },
        children:[
          {path:"", name:"adminIndex", component:ManageIndex, meta:{title:"前段教程 | 后台首页"}},
          {path:"manageusers", name:"manageusers", component:ManageUsers, meta:{title:"前段教程 | 用户管理"}},
          {path:"operalog", name:"operationlog", component:OperaLog, meta:{title:"前段教程 | 操作日志"}},
          {path:"loginlog", name:"loginlog", component:LoginLog, meta:{title:"前段教程 | 登录日志"}},
          {path:"registerlog", name:"registerlog", component:RegisterLog, meta:{title:"前段教程 | 注册日志"}},
          {path:"signlog", name:"signlog", component:SignLog, meta:{title:"前段教程 | 签到信息"}},
          {path:"edit/html5", name:"edithtml5", component:EditHTML, meta:{title:"前段教程 | 编辑HTML"}},
          {path:"edit/css", name:"editcss", component:EditCSS, meta:{title:"前段教程 | 编辑CSS"}},
          {path:"edit/javascript", name:"editjavascript", component:EditJavaScript, meta:{title:"前段教程 | 编辑JavaScript"}},
          {path:"addarticle", name:"addarticle", component:AddArticle, meta:{title:"前段教程 | 添加文章"}},
          {path:"managemusic", name:"managemusic", component:ManageMusic, meta:{title:"前段教程 | 歌曲管理"}},
          {path:"specificarticles", name:"specificarticles", component:SpecificArticle, meta:{title:"前段教程 | 文章统计"}},
          {path:"message/html", name:"htmlmessage", component:HTMLMessage, meta:{title:"前段教程 | VIP课程 HTML留言"}},
          {path:"message/css", name:"cssmessage", component:CSSMessage, meta:{title:"前段教程 | VIP课程 CSS留言"}},
          {path:"message/js", name:"jsmessage", component:JSMessage, meta:{title:"前段教程 | VIP课程 JS留言"}},
          {path:"message/community", name:"communitymessage", component:CommunityMessage, meta:{title:"前段教程 | 社区留言"}},
          {path:"buycourselog", name:"buycourselog", component:BuyCourseLog, meta:{title:"前段教程 | 课程购买记录"}},
          {path:"data/homepage", name:"homepagedata", component:HomePageData, meta:{title:"前段教程 | 首页数据"}},
          {path:"manage/vip/course/html", name:"vipcoursehtml", component:VipCourseHtml, meta:{title:"VIP课程管理 | HTML教程"}},
          {path:"manage/vip/course/css", name:"vipcoursecss", component:VipCourseCss, meta:{title:"VIP课程管理 | CSS教程"}},
          {path:"manage/vip/course/js", name:"vipcoursejs", component:VipCourseJs, meta:{title:"VIP课程管理 | JavaScript教程"}},
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
      // 管理员登录
      {
        path:"/admin/login",
        name:"adminlogin",
        component:AdminLogin,
        meta:{
          title:"前端教程 | 管理员登录"
        }
      },
      {
        path:"/m.home",
        // name:"MHome",
        component:MHome,
        meta:{
          title:"前端教程 | by 卫思勉"
        },
        children:[
          {path:"", redirect:"index"},
          {path:"index", name:"mindex", component:Index, meta:{title:"前端教程 | by 卫思勉"}},
          {path:"html5", name:"mhtml5", component:HTML5, meta:{title:"HTML5 | by 卫思勉"}},
          {path:"css", name:"mcss", component:Index, meta:{title:"CSS | by 卫思勉"}},
          {path:"javascript", name:"mjavascript", component:Index, meta:{title:"JavaScript | by 卫思勉"}}
        ]
      },
      // 找不到页面
      {
        path:"*",
        name:"NotFound",
        component:NotFound,
        meta:{
          title:"o(╥﹏╥)o迷茫中..."
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

    // 判断是不是管理员登录
    const adminLogin = localStorage.adminToken ? true : false;

    // 判断是不是第三方网站
    let url = to.path.split("bbb");

    if(to.path == "/login" || to.path == "/register" || to.path == "/home" || to.path == "/home/index" || to.path == "/home/html5" || to.path == "/home/css" || to.path == "/home/javascript" || to.path == "/home/messagewall" || to.path == "/home/aboutme" || to.path == "/home/enjoymusic" || to.path == "/home/vip/course" || to.path == "/admin/login" || to.path == "/home/vip/course/html5/play" || to.path == "/home/vip/course/css/play" || to.path == "/home/vip/course/javascript/play"){
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
            if(to.path == "/admin/index/data/homepage" || to.path == "/admin/index/manage/vip/course/js" || to.path == "/admin/index/manage/vip/course/css" || to.path == "/admin/index/manage/vip/course/html" || to.path == "/admin/index/buycourselog" || to.path == "/admin/index/message/html" || to.path == "/admin/index/message/css" || to.path == "/admin/index/message/js" || to.path == "/admin/index/message/community" || to.path == "/admin/index/specificarticles" || to.path == "/admin/index/managemusic" || to.path == "/admin/index/addarticle"　|| to.path == "/admin/index/edit/html5" || to.path == "/admin/index/edit/css" || to.path == "/admin/index/edit/javascript" || to.path == "/admin/index/signlog" || to.path == "/admin" || to.path == "/admin/index" || to.path == "/admin/index/manageusers" || to.path == "/admin/index/operalog" || to.path == "/admin/index/loginlog" || to.path == "/admin/index/registerlog"){
                if(adminLogin) next();
                else{
                    iView.Message.error("没有权限访问...");
                    next("/admin/login");
                }
            }else if(to.path == "/home/userinfo"){
                if(!isLogin){
                  next("/home")
                }else{
                  next();
                }
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
