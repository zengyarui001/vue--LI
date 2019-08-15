<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 上下分报表(玩家)</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                 查询时间:
                     <el-date-picker
                    v-model="form.dateVlue"
                    type="datetimerange"
                    style="width:220px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']">
               </el-date-picker>  <br>
                 代理账号: 
                <el-select style="width:220px;margin-right:10px;" v-model="form.AgentCode" filterable placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
                &nbsp;订单号:
                     <el-input style="width:200px;margin-left:10px;margin-top:10px" v-model="form.select_word" placeholder="请输入订单号查询" class="handle-input"></el-input>
                     <br>
                 玩家账号:
                 <el-input  style="width:220px;margin-top:10px;margin-right:10px" v-model="form.UserAccount" placeholder="请输入玩家账号"></el-input>
                 操作类型:
                    <el-select clearable  style="width:200px;margin-top:10px;" v-model="form.selectType" placeholder="请选择" class="handle-select">
                    <el-option v-for="(item,index) in availableType" :key="index" :label="item.name" :value="item.type"></el-option>
                    </el-select>
               
               
               
                <el-button class="searchDate" type="primary" icon="search"  @click="searchEdit">搜索</el-button> 

                 <div class="handle-right">  
                     <span> 总分数 : <b class="red">{{grossScore}}</b>元</span> 
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
                <!-- <el-table-column type="" width="55" align="center"></el-table-column> -->
                <el-table-column align="center" type="index" label="序号"  width="">
                </el-table-column>
                <el-table-column align="center" prop="createdate" label="日期"  width="">
                </el-table-column>
                 <el-table-column align="center" prop="order_id" label="订单号"  width="">
                </el-table-column>
                <el-table-column align="center" prop="agent_code" label="代理账号" width=""> 
                </el-table-column>
                 <el-table-column align="center" prop="account" label="玩家账号" width=""> 
                </el-table-column>
                <el-table-column align="center" prop="before_balance" label="操作前金额" width="">
                </el-table-column>
                  <el-table-column align="center" prop="money" label="上下分金额" width="">
                </el-table-column>
                <el-table-column align="center" prop="after_balance" label="操作后金额" width="">
                </el-table-column>
               
                 <el-table-column align="center" prop="type" label="类型" width="">
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
        name: 'scoreBackstage',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                availableType:[
                    {name:'全部',type:''},
                    {name:'上分',type:1},
                    {name:'下分',type:2}
                ],
                select_word: '',
                dateVlue:'',
                loading: true, 
                grossScore:'',
                gameListData:[],  
                options: [{
                    
                }],
                searchVisible: false,
                select:'',
                selectUse:'',
                gameID:'',
                total:0,
                form: {
                    startDate: null,
                    closeDate: null,
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
                return time.getTime() < this.form.startDate
               }
            }
         }
        },
        created() {
            this.getData();
            this.getAgency();
            this.dateVlue = this.$getNowFormatDate();
        },
        computed: {
         
        },
        methods: {
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
                if(this.form.dateVlue) {
                    data.BeginTime = this.form.dateVlue[0],
                    data.EndTime = this.form.dateVlue[1]
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
                if(this.form.dateVlue) {
                    data.BeginTime = this.form.dateVlue[0],
                   data.EndTime = this.form.dateVlue[1]
                }   
                 if(this.form) {
                   Object.assign(data,this.form);
                }
                this.getData(data)
                //  this.$message.success(`第${this.cur_page}页`);
            },
          
            getData(data) {
                let self = this;
                this.$get(this.baseURL + this.site.GetUserDeposit,data).then(res=>{
                     if(res.data.code == self.S_CODE) {
                        this.$message.success('查询成功');
                        setTimeout(()=>{
                            this.loading = false;
                        },1000)
                        this.searchVisible = false;
                        this.tableData = res.data.data.data;
                        this.grossScore = res.data.data.sum.money;
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
            search(){
                this.searchVisible = true;
            },
            searchEdit() {
                let self = this;
                this.loading = true;
                let data;
                 if(!this.dateVlue) {
                   data = {
                     UserAccount : self.form.UserAccount,
                     AgentCode: self.form.AgentCode,
                     OrderId:self.form.select_word,
                     Type: self.form.selectType
                   }
                }else {
                 data = {
                   UserAccount : self.form.UserAccount,
                   AgentCode: self.form.AgentCode,
                   OrderId:self.form.select_word,
                   Type: self.form.selectType,
                   BeginTime: self.dateVlue[0],
                   EndTime: self.dateVlue[1],
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
       /* color: #ff0000;  */
       margin-top: 10px;
       font-size: 14px
    }
</style>
