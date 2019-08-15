import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/api/home/GetHomeInfo'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/api/home/GetHomeInfo',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
              
                {
                    path: '/api/admin/game',
                    component: resolve => require(['../components/list/game/gameTable.vue'], resolve),
                    meta: { title: '游戏管理' }
                },
                {
                    path: '/api/admin/agentgame',
                    component: resolve => require(['../components/list/game/AuGame.vue'], resolve),
                    meta: { title: '代理游戏管理' }
                },
                {
                    path: '/api/operate',
                    component: resolve => require(['../components/list/BaseTable.vue'], resolve),
                    meta: { title: '运营管理' }
                },
                {
                    path: '/api/home/document',
                    component: resolve => require(['../components/list/document.vue'], resolve),
                    meta: { title: '对接文档' }
                },
               
                {
                    path: '/api/game',
                    component: resolve => require(['../components/list/setGame.vue'], resolve),
                    meta: { title: '游戏设置' }
                },             
                {
                    path: '/api/account',
                    component: resolve => require(['../components/list/agency.vue'], resolve),
                    meta: { title: '账号管理' }
                },
                {
                    path: '/api/report',
                    component: resolve => require(['../components/list/Tabs.vue'], resolve),
                    meta: { title: '报表管理' }
                },
                {
                    path: '/api/risk',
                    component: resolve => require(['../components/list/user.vue'], resolve),
                    meta: { title: '风控管理' }
                },
                {
                    path: '/api/system',
                    component: resolve => require(['../components/list/user.vue'], resolve),
                    meta: { title: '系统设置' }
                },
                {
                    path: '/api/admin/agent',
                    component: resolve => require(['../components/list/AccountMager/agency.vue'], resolve),
                    meta: { title: '代理账号' }
                },
                {
                    path: '/api/admin/subaccount',
                    component: resolve => require(['../components/list/AccountMager/child.vue'], resolve),
                    meta: { title: '子账号' }
                },
                {
                    path: '/api/admin/PoolRange',
                    component: resolve => require(['../components/list/risk/odds.vue'], resolve),
                    meta: { title: '房间赔率设置' }
                },
                {
                    path: '/api/Report/GetAgentBetReportByGame',
                    component: resolve => require(['../components/list/reportForms/gameWin.vue'], resolve),
                    meta: { title: '代理游戏输赢报表(游戏)' }
                },
                {
                    path: '/api/Report/GetAgentBetReportByRound',
                    component: resolve => require(['../components/list/reportForms/officeNumberWin.vue'], resolve),
                    meta: { title: '代理局号输赢报表(局号)' }
                },
                {
                    path: '/api/Report/GetUserBetReportByRound',
                    component: resolve => require(['../components/list/reportForms/playerWin.vue'], resolve),
                    meta: { title: '玩家局号输赢报表(局号)' }
                },
                {
                    path: '/api/Report/GetUserBetDetails',
                    component: resolve => require(['../components/list/reportForms/bettingDetails.vue'], resolve),
                    meta: { title: '玩家每次投注详情(局号)' }
                },
                {
                    path: '/api/Report/GetAgentDepositReport',
                    component: resolve => require(['../components/list/reportForms/scoreBackstage.vue'], resolve),
                    meta: { title: '上下分报表_后台' }
                },
                {
                    path: '/api/Report/GetUserDepositReport',
                    component: resolve => require(['../components/list/reportForms/scorePlayer.vue'], resolve),
                    meta: { title: '上下分报表_玩家' }
                },
                {
                    path: '/api/admin/user',
                    component: resolve => require(['../components/list/AccountMager/user.vue'], resolve),
                    meta: { title: '会员账号' }
                },
                {
                    path: '/api/admin/Role',
                    component: resolve => require(['../components/list/system/role.vue'], resolve),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/api/Admin/Resource',
                    component: resolve => require(['../components/list/system/resource.vue'], resolve),
                    meta: { title: '资源管理' }
                },
                {
                    path: '/api/log/GetLogsByCriteria',
                    component: resolve => require(['../components/list/system/operationLog.vue'], resolve),
                    meta: { title: '操作日志' }
                },
                {
                    path: '/api/cash',
                    component: resolve => require(['../components/list/pointsRace/pointsRace.vue'], resolve),
                    meta: { title: '上下分管理'}
                },
                {
                    path: '/api/DepositBill',
                    component: resolve => require(['../components/list/pointsRace/pointsRace.vue'], resolve),
                    meta: { title: '上下分操作' }
                },
                
                // {
                //     // 富文本编辑器组件
                //     path: '/editor',
                //     component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                //     meta: { title: '富文本编辑器' }
                // },
                // {
                //     // markdown组件
                //     path: '/markdown',
                //     component: resolve => require(['../components/page/Markdown.vue'], resolve),
                //     meta: { title: 'markdown编辑器' }    
                // },
                // {
                //     // 图片上传组件
                //     path: '/upload',
                //     component: resolve => require(['../components/page/Upload.vue'], resolve),
                //     meta: { title: '文件上传' }   
                // },
                // {
                //     // vue-schart组件
                //     path: '/charts',
                //     component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                //     meta: { title: 'schart图表' }
                // },
                // {
                //     // 拖拽列表组件
                //     path: '/drag',
                //     component: resolve => require(['../components/page/DragList.vue'], resolve),
                //     meta: { title: '拖拽列表' }
                // },
                // {
                //     // 拖拽Dialog组件
                //     path: '/dialog',
                //     component: resolve => require(['../components/page/DragDialog.vue'], resolve),
                //     meta: { title: '拖拽弹框' }
                // },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: resolve => require(['../components/page/I18n.vue'], resolve),
                    meta: { title: '国际化' }
                },
              
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
