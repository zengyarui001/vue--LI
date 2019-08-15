<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 玩家局号输赢报表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                     查询时间:
                    <el-date-picker
                    class="startDate"
                    v-model="form.dateVlue"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                   >
                  </el-date-picker>
               游戏局号: 
                  <el-input class="startDate" style="width:200px;" v-model="form.RoundCode" placeholder="请输入游戏局号进行查询"></el-input>
                <br> 
               游戏类别:
                <el-select  class="startDate" style="width:250px;margin-top:10px"    v-model="form.gameID" placeholder="请选择游戏" @change="gameRoom">
                        <el-option v-for="(item,index) in gameListData" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                玩家账号:
                <el-input class="startDate" style="width:200px;" v-model="form.PlayerAccount" placeholder="请输入玩家账号进行查询"></el-input> 
                 <span  v-show="gameRoomCode" >
                        房间列表: 
                        <el-select class="startDate" clearable style="width:200px;margin-top:10px;" v-model="form.RoomCode">
                                <el-option v-for="(item,index) in RoomCodes" :key="index" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </span>
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
                ref="table" >
                <el-table-column align="center" type="index" label="序号"  width="">
                </el-table-column>
                <el-table-column align="center" prop="game_id" label="游戏id"  width="">
                </el-table-column>
                <el-table-column align="center" prop="createdate" label="日期"  width="130">
                </el-table-column>
                <el-table-column align="center" prop="game_name" label="游戏名称" width="">
                </el-table-column>
                <el-table-column align="center" prop="room_code" label="房间号码" width="">
                </el-table-column>
                <el-table-column align="center" prop="round_code" label="游戏局号" width="">
                </el-table-column>
                <el-table-column align="center" prop="user_name" label="用户账号" width="">
                </el-table-column>
                 <el-table-column label="用户投注详情" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button type="text"  @click="handleEdit(scope.$index, scope.row)">查看</el-button>
                    </template>
                </el-table-column>
                 <el-table-column  label="游戏结果" width="120" align="center">
                    <template slot-scope="scope">
                         <el-button type="text" @click="toogleExpand(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
                
                <el-table-column align="center" prop="agent_code" label="代理账号" width="">
                </el-table-column>
                 <el-table-column align="center" prop="before_money" label="投注前金额" width="">
                </el-table-column>
                 <el-table-column align="center" prop="bet_amount" label="总投注" width="">
                </el-table-column>
                <el-table-column align="center" prop="valid_bet_amount" label="有效投注" width="">
                </el-table-column>
                <el-table-column align="center" prop="pay_out" label="派彩" width="">
                </el-table-column>
                <el-table-column align="center" label="总盈利" width="">
                    <template scope="scope">
                         <span class="red">{{scope.row.win_amount}}</span>
                     </template>
                </el-table-column>
                <el-table-column type="expand" width="1">
                    <template slot-scope="props">
                             <el-form v-if="props.row.game_id =='1'" label-position="left" inline class="demo-table-expand">
                               <el-form-item> 
                                <span v-for="(item,index) in BrnnBanker" :key=index>
                                    <span v-if="index == 0" style="margin-right:10px;font-weight:600">庄家:</span>
                                    <span v-if="index == 5" style="margin-right:10px;margin-left:10px;font-weight:600">天:</span>
                                    <span v-if="index == 10" style="margin-right:10px;margin-left:10px;font-weight:600">地:</span>
                                    <span v-if="index == 15" style="margin-right:10px;margin-left:10px;font-weight:600">玄:</span>
                                    <span v-if="index == 20" style="margin-right:10px;margin-left:10px;font-weight:600">黄:</span>
                                   <img v-if="item.str == '0'" src="../../../assets/img/f.png" alt="">
                                   <img v-if="item.str == '1'" src="../../../assets/img/m.png" alt="">
                                   <img v-if="item.str == '2'" src="../../../assets/img/h.png" alt="">
                                   <img v-if="item.str == '3'" src="../../../assets/img/b.png" alt="">
                                   <span style="font-size:18px;font-weight:600;margin-right:5px;">{{item.type}}</span>
                                </span>
                               </el-form-item>
                            </el-form>
                            <el-form v-if="props.row.game_id == '5'" label-position="left" inline class="demo-table-expand">
                               <el-form-item label="龙:"> 
                                <span >
                                   <img v-if="LhdData[6] == '0'" src="../../../assets/img/f.png" alt="">
                                   <img v-if="LhdData[6] == '1'" src="../../../assets/img/m.png" alt="">
                                   <img v-if="LhdData[6] == '2'" src="../../../assets/img/h.png" alt="">
                                   <img v-if="LhdData[6] == '3'" src="../../../assets/img/b.png" alt="">
                                   <span style="font-size:18px;font-weight:600;margin-right:5px;">{{LhdData[4]}}</span>
                                </span>
                               </el-form-item>
                               <el-form-item label="虎:"> 
                                <span >
                                   <img v-if="LhdData[7] == '0'" src="../../../assets/img/f.png" alt="">
                                   <img v-if="LhdData[7] == '1'" src="../../../assets/img/m.png" alt="">
                                   <img v-if="LhdData[7] == '2'" src="../../../assets/img/h.png" alt="">
                                   <img v-if="LhdData[7] == '3'" src="../../../assets/img/b.png" alt="">
                                   <span style="font-size:18px;font-weight:600;margin-right:5px;">{{LhdData[5]}}</span>
                                </span>
                                </el-form-item>
                            </el-form>
                            <el-form v-if="props.row.game_id == '6'" label-position="left" inline class="demo-table-expand">
                               <el-form-item label="庄:"> 
                                <span  v-for="(item,index) in BjlZhuang" :key=index>
                                   <img v-if="item.type == '0'" src="../../../assets/img/f.png" alt="">
                                   <img v-if="item.type == '1'" src="../../../assets/img/m.png" alt="">
                                   <img v-if="item.type == '2'" src="../../../assets/img/h.png" alt="">
                                   <img v-if="item.type == '3'" src="../../../assets/img/b.png" alt="">
                                   <span style="font-size:18px;font-weight:600;margin-right:5px;">{{item.str}}</span>
                                </span>
                               </el-form-item>
                               <el-form-item label="闲:"> 
                                <span  v-for="(item,index) in BjlXian" :key=index>
                                   <img v-if="item.type == '0'" src="../../../assets/img/f.png" alt="">
                                   <img v-if="item.type == '1'" src="../../../assets/img/m.png" alt="">
                                   <img v-if="item.type == '2'" src="../../../assets/img/h.png" alt="">
                                   <img v-if="item.type == '3'" src="../../../assets/img/b.png" alt="">
                                   <span style="font-size:18px;font-weight:600;margin-right:5px;">{{item.str}}</span>
                                </span>
                                </el-form-item>
                            </el-form>
                            <el-form v-if="props.row.game_id == '19'" label-position="left" inline class="demo-table-expand">
                               <el-form-item label="玩家ID:" v-for="(item,index) in ZjhData" :key=index>
                                   <span style="margin-right:10px;font-size:18px;font-weight:600">{{item.id}}</span> 
                                <span> 
                                   <img v-if="item.hua1 == '0'" src="../../../assets/img/f.png" alt="">
                                   <img v-if="item.hua1 == '1'" src="../../../assets/img/m.png" alt="">
                                   <img v-if="item.hua1 == '2'" src="../../../assets/img/h.png" alt="">
                                   <img v-if="item.hua1 == '3'" src="../../../assets/img/b.png" alt="">
                                   <span style="font-size:18px;font-weight:600;margin-right:5px;">{{item.pai1}}</span>
                                </span>
                                <span>
                                   <img v-if="item.hua2 == '0'" src="../../../assets/img/f.png" alt="">
                                   <img v-if="item.hua2 == '1'" src="../../../assets/img/m.png" alt="">
                                   <img v-if="item.hua2 == '2'" src="../../../assets/img/h.png" alt="">
                                   <img v-if="item.hua2 == '3'" src="../../../assets/img/b.png" alt="">
                                   <span style="font-size:18px;font-weight:600;margin-right:5px;">{{item.pai2}}</span>
                                </span>
                                <span>
                                   <img v-if="item.hua3 == '0'" src="../../../assets/img/f.png" alt="">
                                   <img v-if="item.hua3 == '1'" src="../../../assets/img/m.png" alt="">
                                   <img v-if="item.hua3 == '2'" src="../../../assets/img/h.png" alt="">
                                   <img v-if="item.hua3 == '3'" src="../../../assets/img/b.png" alt="">
                                   <span style="font-size:18px;font-weight:600;margin-right:5px;">{{item.pai3}}</span>
                                </span>
                               </el-form-item>
                            </el-form>
                            <el-form v-if="props.row.game_id == '2'" label-position="left" inline class="demo-table-expand">
                              
                                 <el-form-item  v-for="(item,index) in DdzData" :key=index>
                                      <span v-if="item.win == 2" style="font-size:16px;margin-right:5px;">地主胜利</span>
                                      <span v-if="item.win == 1" style="font-size:16px;margin-right:5px;">农民胜利</span>
                                      <span style="margin-right:10px;font-size:16px;">地主ID:<span class="red">{{item.dzid}}</span></span>
                                      <span style="margin-right:10px;font-size:16px">农民1号ID:<span class="red">{{item.nm1}}</span></span>
                                      <span style="margin-right:10px;font-size:16px">农民2号ID:<span class="red">{{item.nm2}}</span></span>
                                      <span style="margin-right:10px;font-size:16px;">倍数:<span class="red">{{item.bs}}</span></span>
                                      <span style="margin-right:10px;font-size:16px">底注:<span class="red">{{item.dz}}</span></span>
                                      <span style="margin-right:10px;font-size:16px">地主派彩:<span class="red">{{item.dzpc}}</span></span>
                                      <span style="margin-right:10px;font-size:16px">农民1派彩:<span class="red">{{item.nm1pc}}</span></span>
                                      <span style="margin-right:10px;font-size:16px">农民2派彩:<span class="red">{{item.nm2pc}}</span></span>
                                 </el-form-item>
                            </el-form>
                    </template>
                </el-table-column>
            </el-table>



   <el-dialog title="" center :visible.sync="editVisible" width="60%">
                 <div class="table">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 玩家投注详情列表 </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        <div class="container">
            <div class="handle-box">   
                 <div v-if="this.gathers.length != 0" class="handle-right">
                   <span> 总派彩 : <b class="red">{{gathers.pay_out}}</b>元</span> 
                   <span>总投注 : <b class="red">{{gathers.bet_amount}}</b>元</span>
                   <span>总有效投注 :<b class="red"> {{gathers.valid_bet_amount}}</b>元</span>
                  </div> 
            </div>
            <el-table 
                v-loading="loadings"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                :data="tableDatas" 
                border 
                class="table" 
                >
                <el-table-column align="center" type="index" label="序号" sortable width="150">
                </el-table-column>
                <el-table-column align="center" prop="createdate" label="时间" width="200">   
                 </el-table-column>
                  <el-table-column align="center" prop="user_name" label="玩家账号" >   
                 </el-table-column>
                  <el-table-column align="center" prop="bet_amount" label="总投注" >
                 </el-table-column>
                 <el-table-column align="center" prop="valid_bet_amount" label="有效投注" width="">
                </el-table-column>
                 <el-table-column align="center" prop="payout" label="派彩" width="">
                </el-table-column>                
            </el-table> 
            <!-- <div class="pagination">
                <el-pagination 
                    background 
                    @current-change="handleCurrentChanges"
                    @size-change="handleSizeChanges"
                    :page-sizes="[20,50,100,200]" 
                    layout="sizes,prev, pager, next"  
                    :page-count="this.totals"
                    >
                        </el-pagination>
                    </div>  -->
                </div>
            </div>
      </el-dialog>
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
        name: 'playerWin',
        data() {
            return {
                tableData: [],
                tableDatas: [],
                cur_page: 1,
                cur_pages:1,
                gathers:[],
                PageSize:20,
                PageSizes:20,
                multipleSelection: [],
                select_cate: '',
                BrnnBanker:[],
                gameRoomCode:false,
                editVisible:false,
                RoomCodes:[],
                LhdData:'',
                ZjhData:[],
                BjlZhuang:'',
                BjlXian:'',
                DdzData:[],
                loading:true,
                loadings:false,
                gameListData:[],  
                searchVisible: false,
                select:'',
                selectUse:'',
                gather : '',
                total:0,
                totals:0,
                form: {
                     dateVlue:'',
                     RoomCode:''
               },
               forms:{
                    dateVlue:''
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
                     
               }
            }
         }
        },
        created() {
            this.getData();
            this.gameList();
            this.form.dateVlue = this.$getNowFormatDate();
             
        },
        computed: {
         
        },
        methods: {
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
            },
            /* 详情 */
            handleCurrentChanges(val) {
                this.cur_pages = val;
                let self = this;
                let data = {
                    PageIndex:this.cur_pages-1,
                    PageSize:this.PageSizes
                }
                let BeginTime = this.GMTTime(self.form.dateVlue[0]);
                let EndTime = this.GMTTime(self.form.dateVlue[1]);
                if(this.forms.dateVlue) {
                   data.BeginTime = BeginTime,
                   data.EndTime = EndTime
                }
                if(this.forms) {
                   Object.assign(data,this.forms);
                }
                this.searchs(data)
                this.$message.success(`第${val}页`);
            },
            handleSizeChanges(val){
                this.PageSizes = val;
                let data = {
                    PageIndex:this.cur_pages-1,
                    PageSize:this.PageSizes
                }
                let BeginTime = this.GMTTime(self.form.dateVlue[0]);
                let EndTime = this.GMTTime(self.form.dateVlue[1]);
                if(this.forms.dateVlue) {
                    data.BeginTime = BeginTime,
                   data.EndTime = EndTime
                }   
                 if(this.forms) {
                   Object.assign(data,this.forms);
                }
                this.searchs(data)
                //  this.$message.success(`第${this.cur_page}页`);
            },
            getDatas(id,round) {
                let self = this;
                if(id) {
                  let data = {
                    PlayerId: id,
                    RoundId:round
                 }
                 self.$get(self.baseURL+self.site.GetUserBetDetails,data).then(res=>{
                    this.tableDatas = res.data.data.data;
                    this.totals = res.data.data.totalPages;
                    this.gathers = res.data.data.sum;
               })
               }
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
            searchs(forms) {
               let self = this;
               this.loading = true;
               let data;
               console.log(forms);
                if(!this.forms.dateVlue) {
                   data = {
                     PlayerId: this.forms.PlayerId,
                     gameID:self.forms.gameID,
                     RoundCode:self.forms.RoundCode
                   }
                }else {
                let BeginTime = this.GMTTime(self.form.dateVlue[0]);
                let EndTime = this.GMTTime(self.form.dateVlue[1]);
                data = {
                    PlayerId: this.forms.PlayerId,
                    BeginTime: BeginTime,
                    EndTime:  EndTime,
                    gameID:self.forms.gameID,
                    RoundCode:self.forms.RoundCode
                   }
                }
                if(forms) {
                   Object.assign(data,forms);
                }
               self.$get(self.baseURL+self.site.GetUserBetDetails,data).then(res=>{
                    if(res.data.code == self.S_CODE) {
                        this.$message.success('加载成功');
                        setTimeout(()=>{
                            this.loadings = false;
                        },1000)
                        this.tableDatas = res.data.data.data
                    }else {
                        this.$message.error(res.data.failedMsg);
                         this.loadings = false;
                    }         
               })    
            },
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
            toogleExpand(row){
                console.log(row);
                let Brnn = [],Lhd=[],Bjl=[],Zjh=[],Ddz=[],arr=[];
                let $table = this.$refs.table;
                this.tableData.map((item)=>{
                    let itemID = item.user_id + item.game_id + item.round_code + item.room_code;
                    let rowID = row.user_id + row.game_id + row.round_code + row.room_code;
                    if(itemID != rowID) {
                        $table.toggleRowExpansion(item, false)
                    }
                })
                $table.toggleRowExpansion(row)
               
                if(row.game_id == '1') {
                   let arrs = row.result.split(',');
                   arrs.map(v=>{ 
                      Brnn.push(v.split('|'));
                   }) 
                   for(let i=0;i<Brnn.length;i++) {
                   Brnn[i].map(v=>{
                      let str,type;
                      str = v.slice(0,1);
                      type = v.slice(1,3)
                     
                       type = this.PeiPai(type);
                       arr.push({str:str,type:type})      
                   })
                   }
                    this.BrnnBanker = arr;
                }
                if(row.game_id == '5') {
                    let Lhd = row.result.split('|');
                    Lhd[4] = this.PeiPai(Lhd[4]);
                    Lhd[5] = this.PeiPai(Lhd[5]);
                    this.LhdData = Lhd;
                }
                if(row.game_id == '6') {
                    let Bjl = row.result.split('|');
                    let xian=[],zhuang=[];
                     Bjl[8] = this.PeiPai(Bjl[8]);
                     Bjl[8] = this.PeiPai(Bjl[8]);
                     Bjl[10] = this.PeiPai(Bjl[10]);
                     Bjl[13] = this.PeiPai(Bjl[13]);
                     Bjl[15] = this.PeiPai(Bjl[15]);
                     Bjl[17] = this.PeiPai(Bjl[17]);
                     // 计算牌数 
                     if(Bjl[5] == 2) {
                         xian.push({str:Bjl[6],type:Bjl[7]});
                         xian.push({str:Bjl[8],type:Bjl[9]});
                     }else if(Bjl[5] == 3) {
                         xian.push({str:Bjl[6],type:Bjl[7]});
                         xian.push({str:Bjl[8],type:Bjl[9]});
                         xian.push({str:Bjl[10],type:Bjl[11]});
                     }
                     if(Bjl[12] == 2) {
                         zhuang.push({str:Bjl[13],type:Bjl[14]});
                         zhuang.push({str:Bjl[15],type:Bjl[16]});
                     }else if(Bjl[12] == 3) {
                         zhuang.push({str:Bjl[13],type:Bjl[14]});
                         zhuang.push({str:Bjl[15],type:Bjl[16]});
                         zhuang.push({str:Bjl[17],type:Bjl[18]});
                     }
                   this.BjlZhuang = zhuang;
                   this.BjlXian = xian;    
                }
                if(row.game_id == '19') {
                   let Zjh = row.result.split(',');
                   let arr = new Array();         
                   for(let k=0;k<Zjh.length;k++) {
                       let data = {};
                       let pai = Zjh[k].split('|')[1]; 
                       data.id =  Zjh[k].split('|')[0];
                       data.hua1 = pai[0];
                       data.pai1 = pai[1] + pai[2];
                       data.hua2 = pai[3];
                       data.pai2 = pai[4] + pai[5];
                       data.hua3 = pai[6];
                       data.pai3 = pai[7] + pai[8];
                       data.pai1 = this.PeiPai(data.pai1);
                       data.pai2 = this.PeiPai(data.pai2);
                       data.pai3 = this.PeiPai(data.pai3);
                       arr.push(data); 
                   }
                   this.ZjhData = arr;
                   console.log(this.ZjhData);
                }
                if(row.game_id == 2) {
                    let Ddz = row.result.split('|');
                    let arr = new Array();
                    let data = {};
                    data.dzid = Ddz[0];
                    data.nm1 = Ddz[1];
                    data.nm2 = Ddz[2];
                    data.win = Ddz[4];
                    data.bs = Ddz[5];
                    data.dz = Ddz[6];
                    data.dzpc = Ddz[7];
                    data.nm1pc = Ddz[8];
                    data.nm2pc = Ddz[9];
                    arr.push(data);
                    this.DdzData = arr;
                }
            },
            PeiPai(data) {
                if(data[0] =='0' && data[1] != '1') {
                    data = data[1];
                }
                switch (data) {
                    case '01':
                        data = 'A'
                        break;
                    case '11':
                        data = 'J'
                        break;
                    case '12':
                        data = 'Q'
                        break;
                    case '13':
                        data = 'K'
                        break;
                
                    default:
                        break;
                }
                return data;
            },
            handleEdit (i,v){
                // this.$router.push({path:'/api/Report/GetUserBetDetails',query:{userName:v.user_name}})
                this.editVisible = true;
                this.getDatas( v.user_id,v.round_id);
            },
            getData(data) {
                let self = this;
                this.$get(this.baseURL + this.site.GetUserBetReport,data).then(res=>{
                     if(res.data.code == self.S_CODE) {
                        this.$message.success('查询成功');
                        setTimeout(()=>{
                            this.loading = false;
                        },1000)
                        this.searchVisible = false;
                        this.tableData = res.data.data.data;
                        this.gather = res.data.data.sum;
                        // this.total = res.data.data.totalPages;
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
                let data;
                this.loading = true;
                let BeginTime = this.GMTTime(self.form.dateVlue[0]);
                let EndTime = this.GMTTime(self.form.dateVlue[1]);
                if(!this.form.dateVlue) {
                   data = {
                    GameId : self.form.gameID,
                    RoomCode: self.form.RoomCode,
                    RoundCode:self.form.RoundCode,
                    PlayerAccount:self.form.PlayerAccount
                   }
                }else {
                  data = {
                    GameId : self.form.gameID,
                    RoomCode: self.form.RoomCode,
                    BeginTime: BeginTime,
                    EndTime: EndTime,
                    RoundCode: self.form.RoundCode,
                    PlayerAccount:self.form.PlayerAccount
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
        text-align: center;
         
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
    .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
    width: 250px;
    }
     .handle-right {
        margin-top: 10px;
        font-size: 14px;
    }
    .handle-right span {
        margin-right: 30px;
    }
    .el-table__expand-column > cell {
        display: none;
    }
</style>
