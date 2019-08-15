import Vue from 'vue'
import axios from 'axios'
import qs from 'qs';
axios.defaults.timeout = 50000;   //超时响应
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Vue.prototype.baseURL = 'http://2799988.com';
Vue.prototype.baseURL = '';
Vue.prototype.interiorURL = '';
Vue.prototype.S_CODE = 0;
Vue.prototype.inside = {
    GetDepositbill:'/api/DepositBill/GetDepositBillById',   //获取上下分记录(单)
    GetDepositBills:'/api/DepositBill/GetDepositBillsByCriteria',   //获取上下分记录(多)
    AddDeposit:'/api/DepositBill/AddDepositBill',           //提交上下分
    AuditDeposit:'/api/DepositBill/AuditDepositBill',       //上下分审核
    Login : '/api/Login/Login',        
    Logout:'/api/Login/Logout'
}
Vue.prototype.site = {

     Login:'/api/Login/Login',   //后台登陆
     Menu:'/api/Home/GetMenuResources',  //登陆获取菜单
     Logout:'/api/Login/Logout',  //退出
     GetHomeInfo:'/api/Home/GetHomeInfo',  //获取首页展示信息
     Document:'/api/Home/Documents',        // 获取文档
     
     GetAgent:'/api/Admin/Agent/GetAgentById',   //查询单条代理
     GetAgents:'/api/Admin/Agent/GetAgentsByCriteria', // 查询多条代理
     AddAgent:'/api/Admin/Agent/AddAgent',   //添加代理
     UpdateAgent:'/api/Admin/Agent/UpdateAgent',  //修改代理
     GetSubAccount:'/api/Admin/SubAccount/GetSubAccountById',   //查询单条子账号
     GetSubAccounts:'/api/Admin/SubAccount/GetSubAccountsByCriteria', //查询多条子账号
     AddSubAccount:'/api/Admin/SubAccount/AddSubAccount',  //添加子账号
     UpdateSubAccount:'/api/Admin/SubAccount/UpdateSubAccount',  //修改子账号
     DeleteSubAccount:'/api/Admin/SubAccount/DeleteSubAccount',  //删除子账号

     GetRole:'/api/Admin/Role/GetRoleById',  //查询单个角色
     GetRoles:'/api/Admin/Role/GetRolesByCriteria',  //查询多个角色
     AddRole:'/api/Admin/Role/AddRole',  //添加角色
     UpdateRole:'/api/Admin/Role/UpdateRole', //修改角色
     DeleteRole:'/api/Admin/Role/DeleteRole', //删除角色

     GetAccountRoles:'/api/Admin/AccountRole/GetAccountRolesByCriteria', //获取子账号的角色
     SetAccountRole:'/api/Admin/AccountRole/SetAccountRole',  //给子账号分配角色
     GetResource:'/api/Admin/Resource/GetResourceById',  //查询单条资源,
     GetResources:'/api/Admin/Resource/GetResourcesByCriteria',  //查询多条资源
     AddResource:'/api/Admin/Resource/AddResource',  //添加资源
     UpdateResource:'/api/Admin/Resource/UpdateResource', //修改资源
     DeleteResource:'/api/Admin/Resource/DeleteResource', //删除资源
     GetRoleResources:'/api/Admin/RoleResource/GetRoleResourcesByCriteria', //获取角色权限
     SetRoleResource:'/api/Admin/RoleResource/SetRoleResource',    //角色分配权限

     GetGame:'/api/Admin/Game/GetGameById',  //单条游戏查询
     GetGames:'/api/Admin/Game/GetGamesByCriteria', //多条游戏查询
     AddGame:'/api/Admin/Game/AddGame',  //新增游戏
     UpdateGame:'/api/Admin/Game/UpdateGame',  //修改游戏
     DeleteGame:'/api/Admin/Game/DeleteGame',   //删除游戏
     
     GetAgentGame:'/api/Admin/AgentGame/GetAgentGameById', //代理游戏单条查询
     GetAgentGames:'/api/Admin/AgentGame/GetAgentGamesByCriteria',  //代理游戏多条查询
     UpdateAgentGame:'/api/Admin/AgentGame/UpdateAgentGame',   //代理修改游戏

     Agents:'/api/Dropdown/Agents',  //代理下拉列表
     Roles:'/api/Dropdown/Roles',    //角色下拉列表
     Resource:'/api/Dropdown/ResourceTypes', //资源类型
     RequestMethods:'/api/Dropdown/RequestMethods',  //请求方式
     GameCates:'/api/Dropdown/GameCates',  //游戏类别
     LogLevels:'/api/Dropdown/LogLevels',  //日志等级
     Devices:'/api/Dropdown/Devices',     //设备类型
     Games:'/api/Dropdown/Games',         //游戏列表
     RoomCodes:'/api/Dropdown/RoomCodes',  //游戏房间列表

     GetLogs:'/api/Log/GetLogsByCriteria',   //操作日志

     GetAgentBetReport:'/api/Report/GetAgentBetReportByGame',  // 代理游戏输赢报表
     GetAgentBetReports:'/api/Report/GetAgentBetReportByRound',  // 代理局号输赢报表
     GetUserBetReport:'/api/Report/GetUserBetReportByRound',    //玩家局号输赢报表
     GetUserBetDetails:'/api/Report/GetUserBetDetails',         //玩家每次投注详情
     GetAgentDeposit:'/api/Report/GetAgentDepositReport',       //上下分报表_后台
     GetUserDeposit:'/api/Report/GetUserDepositReport',         //上下分报表_玩家

     GetUser:'/api/Admin/User/GetUserById',          //查询玩家单个
     GetUsers:'/api/Admin/User/GetUsersByCriteria',   //查询玩家多个
     ChangeUser:'/api/Admin/User/ChangeUserStatus',  //踢会员下线
     ChangeUserLock:'/api/Admin/User/ChangeUserLockToggle',   //解除锁定会员

     GetPoolRange:'/api/Admin/PoolRange/GetPoolRangeById',     //房间赔率信息
     GetPoolRanges:'/api/Admin/PoolRange/GetPoolRangesByCriteria',   //房间赔率信息(多条)
     AddPool: '/api/Admin/PoolRange/AddPoolRange',     //添加房间赔率设置
     UpdatePool: '/api/Admin/PoolRange/UpdatePoolRange',  //修改房间赔率设置
     DeletePool:'/api/Admin/PoolRange/DeletePoolRange',     //删除房间赔率设置

     RedisClear:'/api/Home/RedisFlushDB'        //清除缓存 
 
}




    // get请求

    export function get(url,params) {
        return new Promise((resolve,reject)=>{
            axios.get(url,{
                params:params
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    }


    // post 请求
    export function post(url,params) {
        return new Promise((resolve,reject)=>{
            axios.post(url,params).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    }

    export function getNowFormatDate() {
        var date = new Date();
        var yesterday = new Date(date.getTime() - 24*60*60*1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();

        var year1 = yesterday.getFullYear();
        var month1 = yesterday.getMonth() + 1;
        var strDate1 = yesterday.getDate();
        var hours1 = yesterday.getHours();
        var minutes1 = yesterday.getMinutes();
        var seconds1 = yesterday.getSeconds();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (month1 >= 1 && month1 <= 9) {
            month1 = "0" + month1;
        }
        if (strDate1 >= 0 && strDate1 <= 9) {
            strDate1 = "0" + strDate1;
        }
      //  var currentdate = year + seperator1 + month + seperator1 + strDate;
        let currentdate = `${year}-${month}-${strDate} ${hours}:${minutes}:${seconds}`;
        let currentdates = `${year1}-${month1}-${strDate1} ${hours1}:${minutes1}:${seconds1}`;
      //  var currentdates = year1 + seperator1 + month1 + seperator1 + strDate1;
        var arr = []; 
        arr.push(currentdates)   
        arr.push(currentdate);
        return arr;
    }
