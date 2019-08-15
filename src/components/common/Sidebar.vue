<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu"  @open="handleOpen" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#ffd04b" :unique-opened="true" router>
           
            <template v-for="item in items"  >
                <template v-if="item.children" >
                    <el-submenu :index="item.resourceurl" :key="item.index">
                        <template slot="title" >
                            <!-- <i class="el-icon-monitor"> </i> -->
                            <span slot="title" >{{ item.resourcename}}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-submenu v-if="subItem.children" :index="subItem.resourceurl" :key="subItem.index">
                               
                                <template slot="title">{{ subItem.title }}</template>
                                 
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.resourceurl">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item  v-else :index="subItem.resourceurl" :key="subItem.index">
                                <i class="el-icon-folder"> </i>
                                {{ subItem.resourcename}}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.resourceurl" :key="item.index">
                        <!-- <i class="el-icon-monitor"></i> -->
                        <span slot="title">{{item.resourcename}}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                dashboard:'dashboard',
                items: [
                 
                    //  {
                      
                    //     index: '7',
                    //     resourcename: '错误处理',
                    //     children: [
                    //         {
                    //             resourceurl: 'permission',
                    //             resourcename: '权限测试'
                    //         },
                    //         {
                    //             resourceurl: '404',
                    //             resourcename: '404页面'
                    //         }
                    //     ]
                    // }
                    // {  
                    //     index: 'table',
                    //     title: '基础表格'
                    // },
                    //  {  
                    //     index: 'game',
                    //     title: '游戏数据'
                    // },
                    //  {   
                    //     index: 'agency',
                    //     title: '代理数据'
                    // },
                    // { 
                    //     index: 'tabs',
                    //     title: 'tab选项卡'
                    // },
                    // {  
                    //     index: 'form',
                    //     title: '表单相关',
                        // subs: [
                        //     {
                        //         index: '',
                        //         title: '基本表单'
                        //     },
                        //     {
                        //         index: '3-2',
                        //         title: '三级菜单',
                        //         subs: [
                        //             {
                        //                 index: 'editor',
                        //                 title: '富文本编辑器'
                        //             },
                        //             {
                        //                 index: 'table',
                        //                 title: '基础表格'
                        //             },
                        //             {
                        //                 index: 'markdown',
                        //                 title: 'markdown编辑器'
                        //             },
                        //         ]
                        //     },
                        // ]
                    // },
                    // {
                       
                    //     index: 'icon',
                    //     title: '自定义图标'
                    // },       
                ]
            }
        },
        computed:{
            onRoutes(){    
                
                if(this.$route.redirectedFrom == '/download/dahuanxi.rar') {
                    this.$router.push({ path:'/api/home/GetHomeInfo'});
                    window.location = 'http://192.168.87.135:8080/download/dahuanxi.rar';
                    return
                }
             //  console.log(this.$route)
                // return this.$route.path.replace('/','');   
                
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
            this.getMenu();
            
        },
        methods:{
                handleOpen(key, keyPath) {
                // console.log(key, keyPath);
            },
            getMenu(){'use strict'
                let self = this;
                self.$get(self.baseURL+this.site.Menu).then(res=>{               
                    if(res.data.code == self.S_CODE){
                        sessionStorage.setItem('menu',JSON.stringify(res.data.data))
                        for(let i=0;i<res.data.data.length;i++) { 
                            
                        if(res.data.data[i].children.length <= 0){
                                delete res.data.data[i].children;
                            }                    
                       this.items.push(res.data.data[i]);                                              
                        }
                    }
                }).catch(err=>{
                    
                })
            },
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
