<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 玩家投注详情列表 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                     查询时间:
                    <el-date-picker
                    class="startDate"
                    v-model="form.dateVlue"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']">
                  </el-date-picker>
                 &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;游戏:
                <el-select style="width:210px;"    v-model="form.gameID" placeholder="请选择游戏" >
                        <el-option v-for="(item,index) in gameListData" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select><br>
                玩家账号: 
                <el-input style="width:250px;margin-top:10px" v-model="form.playerAccount" placeholder="请输入玩家账号进行查询" class="handle-input mr10"></el-input>
                游戏局号: 
                <el-input style="width:210px;margin-top:10px" v-model="form.RoundCode" placeholder="请输入游戏局号进行查询" class="handle-input mr10"></el-input>

                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                
                 <div v-if="this.gather.length != 0" class="handle-right">
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
                <el-table-column align="center" type="index" label="序号" sortable width="150">
                </el-table-column>
                <el-table-column align="center" prop="agent_code" label="代理编号" width="120">
                </el-table-column>
                <el-table-column  align="center" prop="game_name" label="游戏名" width="120">
                </el-table-column>
                <el-table-column align="center" prop="createdate" label="时间" >   
                 </el-table-column>
                 <el-table-column align="center" prop="round_code" label="游戏局号" >   
                 </el-table-column>
                  <el-table-column align="center" prop="user_name" label="玩家账号" >   
                 </el-table-column>
                <el-table-column  label="游戏结果" width="120" align="center">
                    <template slot-scope="scope">
                         <el-button type="text" @click="toogleExpand(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
                 <el-table-column align="center" prop="before_money" label="投注前金额" >
                 </el-table-column>
                  <el-table-column align="center" prop="bet_amount" label="总投注" >
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
                <el-table-column type="expand" width="1">
                    <template slot-scope="props">
                             <el-form v-if="props.row.game_id =='1'" label-position="left" inline class="demo-table-expand">
                               <el-form-item > 
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
                                   <span style="margin-right:20px;font-size:18px;">{{item.id}}</span> 
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
                                      <span style="margin-right:10px;font-size:16px;">地主ID:{{item.dzid}}</span>
                                      <span style="margin-right:10px;font-size:16px">农民1号ID:{{item.nm1}}</span>
                                      <span style="margin-right:10px;font-size:16px">农民2号ID:{{item.nm2}}</span>
                                      <span style="margin-right:10px;font-size:16px">倍数:{{item.bs}}</span>
                                      <span style="margin-right:10px;font-size:16px">底注:{{item.dz}}</span>
                                      <span style="margin-right:10px;font-size:16px">地主派彩:{{item.dzpc}}</span>
                                      <span style="margin-right:10px;font-size:16px">农民1派彩:{{item.nm1pc}}</span>
                                      <span style="margin-right:10px;font-size:16px">农民2派彩:{{item.nm2pc}}</span>
                                 </el-form-item>
                            </el-form>
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
        name: 'nettingDetails',
        data() {
            return {
                tableData: [],
                select_word:'',
                gather:[],
                cur_page: 1,
                PageSize:20,
                loading:false,
                BrnnBanker:[],
                gameListData:[],
                ZjhData:[],
                DdzData:[],
                gameID:'',
                LhdData:'',
                dateVlue:'',
                BjlZhuang:'',
                BjlXian:'',
                BrnnOne:[],
                BrnnTwo:[],
                BrnnThree:[],
                BrnnFour:[],
                total:0,
                form:{
                    dateVlue:''
                }
               
            }
        },
        created() {
             this.getData();
             this.gameList();
            this.dateVlue = this.$getNowFormatDate();
        },
        watch:{
             '$route': 'getData'
        },
        mounted() {
             
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
                if(this.form.dateVlue) {
                   data.BeginTime = this.form.dateVlue[0],
                   data.EndTime = this.form.dateVlue[1]
                }
                if(this.form) {
                   Object.assign(data,this.form);
                }
                this.search(data)
                this.$message.success(`第${val}页`);
            },
            handleSizeChange(val){
                this.PageSize = val;
                let data = {
                    PageIndex:this.cur_page-1,
                    PageSize:this.PageSize
                }
                if(this.form.dateVlue) {
                    data.BeginTime = this.form.dateVlue[0],
                   data.EndTime = this.form.dateVlue[1]
                }   
                 if(this.form) {
                   Object.assign(data,this.form);
                }
                this.search(data)
                //  this.$message.success(`第${this.cur_page}页`);
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
        
            getData() {
                let self = this;
                if(this.$route.query.userName) {
                  let data = {
                    PlayerAccount: this.$route.query.userName
                 }
                 self.$get(self.baseURL+self.site.GetUserBetDetails,data).then(res=>{
                    this.tableData = res.data.data.data;
                    this.total = res.data.data.totalPages;
                    this.gather = res.data.data.sum;
               })
               }
            },
            search(form) {
               let self = this;
               this.loading = true;
               let data;
               console.log(form);
                if(!this.form.dateVlue) {
                   data = {
                     PlayerAccount: this.form.playerAccount,
                     gameID:self.form.gameID,
                     RoundCode:self.form.RoundCode
                   }
                }else {
                  
                data = {
                    PlayerAccount: this.form.playerAccount,
                    BeginTime: self.form.dateVlue[0],
                    EndTime: self.form.dateVlue[1],
                    gameID:self.form.gameID,
                    RoundCode:self.form.RoundCode
                   }
                }
                if(form) {
                   Object.assign(data,form);
                }
               console.log(data)
               self.$get(self.baseURL+self.site.GetUserBetDetails,data).then(res=>{
                    if(res.data.code == self.S_CODE) {
                        this.$message.success('加载成功');
                        setTimeout(()=>{
                            this.loading = false;
                        },1000)
                        this.tableData = res.data.data.data
                    }else {
                        this.$message.error(res.data.failedMsg);
                         this.loading = false;
                    }
                    
               })
              
            },
            toogleExpand(row){
                console.log(row);
                let Brnn = [],Lhd=[],Bjl=[],arr=[];
                let $table = this.$refs.table;
                this.tableData.map((item)=>{
                    let itemID = item.user_id + item.game_id + item.round_code + item.room_code;
                    let rowID = row.user_id + row.game_id + row.round_code + row.room_code;
                    if(itemID != rowID) {
                        $table.toggleRowExpansion(item, false)
                    }
                })
                $table.toggleRowExpansion(row);
                console.log(row.game_id)
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
                        console.log(type)
                       type = this.PeiPai(type);
                       arr.push({str:str,type:type})      
                   })
                   }
                    console.log(arr)
                    this.BrnnBanker = arr;
                    // this.BrnnOne = arr.slice(5,10);
                    // this.BrnnTwo = arr.slice(10,15);
                    // this.BrnnThree = arr.slice(15,20);
                    // this.BrnnFour = arr.slice(20,25);         
                }
                if(row.game_id == '5') {
                    let Lhd = row.result.split('|');
                    Lhd[4] = this.PeiPai(Lhd[4]);
                    Lhd[5] = this.PeiPai(Lhd[5]);
                    this.LhdData = Lhd;
                    console.log(this.LhdData);
                }
                if(row.game_id == '6') {
                    let Bjl = row.result.split('|');
                    let xian=[],zhuang=[];
                     Bjl[6] = this.PeiPai(Bjl[6]);
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
                console.log(data);
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
        }
   
        },
        
        beforeDestroy () {
           
          
        },
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
      .handle-right {
        margin-top: 10px;
        font-size: 14px;
    }
    .handle-right span {
        margin-right: 30px;
    }
    .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
    width: 250px;
    }
    .startDate {
        margin-right: 10px
    }
</style>
