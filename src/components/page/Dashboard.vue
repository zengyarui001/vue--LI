<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:205px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                            <div style="margin-top:10px">上次登陆IP:{{userData.lastip}}</div>
                            <div style="margin-top:5px">上次登陆时间:{{userData.lasttime}}</div>
                        </div>
                    </div>
                    <!-- <div class="user-info-list">上次登录时间：<span>2019-04-28</span></div>
                    <div class="user-info-list">上次登录地点：<span>makati</span></div> -->
                </el-card>
            
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{userData.onlineCount}}</div>
                                    <div>在线玩家数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-coin grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{userData.balance}}</div>
                                    <div>剩余分数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                
                </el-row>
            </el-col>
        </el-row>
       
            <schart ref="line" class="schart" canvasId="line" :data="data" type="line" :options="options2"></schart>
             
    
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../common/bus';
    export default {
        name: 'dashboard',
        data() {
            return {
                name: localStorage.getItem('ms_username'),
                data: [
                    // {
                    //     date: '2019/05/10',
                    //     count: 1083
                    // },
                    // {
                    //     date: '2019/05/11',
                    //     count: 941
                    // },
                    // {
                    //     date: '2019/05/12',
                    //     count: 1139
                    // },
                    // {
                    //     date: '2019/05/13',
                    //     count: 816
                    // },
                    // {
                    //     date: '2019/05/14',
                    //     count: 327
                    // },
                    // {
                    //     date: '2019/05/15',
                    //     count: 228
                    // },
                    // {
                    //     date: '2019/05/16',
                    //     count: 1065
                    // },
                   
                ],
                options2: {
                    title: '最近30天不重复登陆人数曲线',
                    fillColor: '#FC6FA1',
                    axisColor: '#008ACD',
                    contentColor: '#EEEEEE',
                    bgColor: '#F5F8FD',
                    bottomPadding: 30,
                    topPadding: 30
                },
                userData:''
            }
        },
        components: {
            Schart
        },
        computed: {
            role() {
                return this.name === 'benben' ? '超级管理员' : '普通用户';
            }
        },
        created(){
            this.handleListener();
            this.changeDate();
            this.getData();
        },
        activated(){
            this.handleListener();
        },
        deactivated(){
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        },
        methods: {
            getData(){
                let self = this;
                this.$get(self.baseURL + self.site.GetHomeInfo).then(res=>{
                    if(res.data.code == self.S_CODE) {
                        this.userData = res.data.data;
                        this.data = res.data.data.last30Data;
                    }
                })

            },
            changeDate(){
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
                })
            },
            handleListener(){
                bus.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart);
            },
            handleBus(msg){
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            renderChart(){
               
                this.$refs.line.renderChart();
            }
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 200px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 200px;
        text-align: center;
        line-height: 200px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 95%;
        height: 70%;
        margin-left: 30px;
        height: 440px;
        /* position: absolute;
        right: 2%;
        top: 22% */
    }

</style>
