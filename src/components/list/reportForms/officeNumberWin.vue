<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 代理局号输赢报表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!-- 开始时间:
                <el-date-picker style="width:200px" class="startDate" v-model="form.startDate" type="date" :picker-options="pickerStartDate" placeholder="选择日期">
                </el-date-picker>
                结束时间:
                <el-date-picker style="width:200px" class="startDate" v-model="form.closeDate" type="date" :picker-options="pickerCloseDate" placeholder="选择日期">
                    </el-date-picker> -->
                      查询时间:
                    <el-date-picker
                        v-model="form.dateVlue"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        >
                  </el-date-picker><br>
                游戏类别:
                <el-select class="startDate" style="margin-top:10px;width:200px"  v-model="form.gameID" placeholder="请选择游戏" @change="gameRoom">
                        <el-option  v-for="(item,index) in gameListData" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <span  v-show="gameRoomCode" >
                        房间列表: 
                        <el-select class="startDate" clearable style="width:200px;margin-top:10px;"   v-model="form.RoomCode">
                                <el-option v-for="(item,index) in RoomCodes" :key="index" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </span>
                 <br>
                代理账号: 
                 <el-select  class="startDate" style="margin-top:10px;width:200px"  v-model="form.AgentCode" filterable placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
                   游戏局号 : 
                    <el-input style="width:200px" v-model="form.RoundCode" placeholder="请输入局号"></el-input>
                <el-button class="searchDate" type="primary" icon="search"  @click="searchEdit">搜索</el-button> 
                  <div class="handle-right">
                   <span> 总派彩 : <b class="red">{{gather.pay_out}}</b>元</span> 
                   <span>总投注 : <b class="red">{{gather.bet_amount}}</b>元</span>
                   <span>总有效投注 :<b class="red"> {{gather.valid_bet_amount}}</b>元</span>
                   <span>总盈利 :<b class="red"> {{gather.win_amount}}</b>元</span>
                  </div> 
            </div>
            <el-table
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading" 
            :data="tableData" 
            border 
            class="table" 
            ref="multipleTable" >
               <el-table-column align="center" type="index" label="序号"  width="">
                </el-table-column>
                <el-table-column align="center" prop="game_id" label="游戏id"  width="">
                </el-table-column>
                <el-table-column align="center" prop="room_code" label="房间号"  width="">
                </el-table-column>
                <el-table-column align="center" prop="game_name" label="游戏名称" width="">
                </el-table-column>
                <el-table-column align="center" prop="round_code" label="游戏局号" width="">
                </el-table-column>
                <el-table-column align="center" prop="agent_code" label="代理账号" width="">
                </el-table-column>
                 <el-table-column align="center" prop="bet_amount" label="总投注" width="">
                </el-table-column>
                <el-table-column align="center" prop="valid_bet_amount" label="有效投注" width="">
                </el-table-column>
                <el-table-column align="center" prop="pay_out" label="派彩" width="">
                </el-table-column>
                <el-table-column align="center"  label="总盈利" width="">
                    <template scope="scope">
                         <span class="red">{{scope.row.win_amount}}</span>
                     </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background 
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :page-sizes="[20,50,100,200]" 
                    layout="sizes,prev, pager, next"  
                    :page-count="this.total"
                 >
                </el-pagination>
         </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'gameTable',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                PageSize:20,
                multipleSelection: [],
                select_cate: '',
                loading:true,
                select_word: '', 
                gameListData:[],
                RoomCodes:[],
                gather: '',
                gameRoomCode:false,
                options: [{
                    
              }],
                searchVisible: false,
                select:'',
                selectUse:'',
                total:0,
                form: {
                    dateVlue:'',
                    RoomCode:'' 
               },
               pickerStartDate: {
                    disabledDate: time => {
                    if (this.form.closeDate) {
                        return time.getTime() > this.form.closeDate
                  }
               }
            },
             pickerCloseDate: {
                disabledDate: time => {
                return time.getTime() < this.form.startDate
               }
            }
         }
        },
        created() {
            this.getData();
            this.gameList();
            this.getAgency();
            this.form.dateVlue = this.$getNowFormatDate();
           
        },
        computed: {
         
        },
        methods: {
            gameRoom() {
               this.form.RoomCode = '';
               let self = this;
                let data = {
                    gameId:this.form.gameID
                }
                self.$get(self.baseURL+this.site.RoomCodes,data).then(res=>{
                        if(res.data.code == self.S_CODE) {
                            this.gameRoomCode = true;
                            this.RoomCodes = res.data.data;
                            console.log(res.data.data);
                          
                        }
                    })
            },
             getAgency () {
                let self = this;
                 let name = localStorage.getItem('ms_username');
                 let data = {
                     currentAccount:name
                 }
                self.$get(self.baseURL+self.site.Agents,data).then(res=>{
                    if(res.data.code == self.S_CODE) {
                       
                        this.options = res.data.data;
                    }
                })
                
            },
            // 分页导航
            handleCurrentChange(val) {
                 this.cur_page = val;
                let self = this;
                let data = {
                    PageIndex:this.cur_page-1,
                    PageSize:this.PageSize
                }
                let BeginTime = this.GMTTime(self.form.dateVlue[0]);
                let EndTime = this.GMTTime(self.form.dateVlue[1]);
                if(this.form.dateVlue) {
                   data.BeginTime = BeginTime,
                   data.EndTime = EndTime
                }
                if(this.form) {
                   Object.assign(data,this.form);
                }
              
                this.getData(data)
                this.$message.success(`第${val}页`);
            },
              handleSizeChange(val){
                this.PageSize = val;
                let data = {
                    PageIndex:this.cur_page-1,
                    PageSize:this.PageSize
                }
                let BeginTime = this.GMTTime(self.form.dateVlue[0]);
                let EndTime = this.GMTTime(self.form.dateVlue[1]);
                if(this.form.dateVlue) {
                   data.BeginTime = BeginTime,
                   data.EndTime = EndTime
                }   
                 if(this.form) {
                   Object.assign(data,this.form);
                }
                this.getData(data)
                //  this.$message.success(`第${this.cur_page}页`);
            },
            p(s) {
                 return s < 10 ? '0' + s : s
            },
            GMTTime(t) {
              const d = new Date(t);
              const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate());
              const resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds());
              return `${resDate} ${resTime}`;
            },
            getData(data) {
                let self = this;
                this.$get(this.baseURL + this.site.GetAgentBetReports,data).then(res=>{
                     if(res.data.code == self.S_CODE) {
                        this.$message.success('查询成功');
                        setTimeout(()=>{
                            this.loading = false;
                        },1000)
                        this.searchVisible = false;
                        this.tableData = res.data.data.data;
                         this.gather = res.data.data.sum;
                        this.total = res.data.data.totalPages;
                        }else {
                            this.$message.error(res.data.failedMsg);
                        }  
                })     
            },
            transDate(date){
                let d = new Date(date);
                return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
            },
            gameList(){
                let self = this;
                self.$get(this.baseURL+this.site.Games).then(res=>{
                     if(res.data.code == self.S_CODE) {
                         this.gameListData = res.data.data;
                          let length = this.gameListData.length;
                         let key;
                         for (var i = 0; i < length; i++) {
                                if (this.gameListData[i].id == null) {    
                                    key = this.gameListData[i];
                                    this.gameListData.splice(i, 1);
                                    break;
                                }       
                            }    
                            this.gameListData.unshift(key);
                     }else {
                        this.$message.error(res.data.failedMsg);
                     }
                })
            },
            search(){
                this.searchVisible = true;
            },
            searchEdit() {
                let self = this;
                this.loading = true;
                let data;
                if(!this.form.dateVlue) {
                   data = {
                    GameId : self.form.gameID,
                    AgentCode: self.form.AgentCode,
                    RoomCode:self.form.RoomCode,
                    RoundCode:self.form.RoundCode
                    
                   }
                }else {
                    let BeginTime = this.GMTTime(self.form.dateVlue[0]);
                    let EndTime = this.GMTTime(self.form.dateVlue[1]);
                   data = {
                    GameId : self.form.gameID,
                    AgentCode: self.form.AgentCode,
                    BeginTime: BeginTime,
                    EndTime: EndTime,
                    RoomCode:self.form.RoomCode,
                    RoundCode:self.form.RoundCode
                }
                }     
                self.getData(data);      
            },
       }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
        line-height: 30px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
    .searchDate {
        margin-left: 30px
    }
    .startDate {
        margin-right: 20px
    }
     .handle-right {
        margin-top: 10px;
        font-size: 14px;
    }
    .handle-right span {
        margin-right: 30px;
    }
</style>
