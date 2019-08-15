import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css';          // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
import { get,post,getNowFormatDate} from './assets/js/ajax';
import VueParticles from 'vue-particles'

Vue.config.productionTip = false
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
Vue.use(VueParticles);
Vue.prototype.$axios = axios;
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$getNowFormatDate = getNowFormatDate;


const i18n = new VueI18n({
    locale: 'zh',
    messages
})

// http request 请求 拦截
axios.interceptors.request.use(
    config => {
        let token = localStorage.getItem('token');
        if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.token = token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
});

// http response 响应拦截   

    axios.interceptors.response.use(
    response=>{
            if(response.data.code == 9999) { 
                localStorage.removeItem('token');  
                localStorage.removeItem('ms_username');
                console.log('token失效');
                    router.push({
                    path: "/login"
                    }); 
            }else  //if(response.data.code == 0)
            {
                return response;
            }
        },err=>{
            return Promise.reject(err);
        }
    )



router.beforeEach((to, from, next) => {
  
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入
        role != 'admin' ? next() : next('/403');
        
    } else {
        
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
})


new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app')