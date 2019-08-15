<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 操作日志</el-breadcrumb-item>
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
                  </el-date-picker><br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;账号:
                 <el-input style="width:220px;margin-top:10px;margin-right:20px;" v-model="form.Account" placeholder="请输入账号查询日志"></el-input>
                日志类型:
                <el-select clearable style="width:220px;margin-top:10px;"   v-model="form.LogLevel" placeholder="请选择日志类型" >
                        <el-option v-for="(item,index) in LogType" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-button class="searchDate" type="primary" icon="search"  @click="searchEdit">搜索</el-button> 
            </div>
            <el-table 
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                :data="data"  
                border 
                class="table" 
                ref="multipleTable" >
                 <el-table-column type="expand" width="150" label="操作详情">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="详情">
                        <span>{{ props.row.message}}</span>
                    </el-form-item>
                    </el-form>
                </template>
                </el-table-column>
                <el-table-column align="center" prop="createdate" label="日期" sortable width="250">
                </el-table-column>
                <el-table-column align="center" prop="id" label="ID"  width="280">
                </el-table-column>
                <el-table-column align="center" prop="opuser" label="账号" width="150">
                </el-table-column>
                <el-table-column align="center"  prop="action" label="操作" width="250" >
                </el-table-column>
                <el-table-column align="center" prop="level" label="等级"  >
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                 background 
                 @current-change="handleCurrentChange"
                 @size-change="handleSizeChange"
                 :page-sizes="[20,50,100,200]"
                 layout="sizes,prev, pager, next" 
                 :page-count="this.totalPages">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'operationLog',
        data() {
            return {
                data:[],
                totalPages:0,   //总页码
                cur_page:1,     //当前页码
                PageSize:20,
                LogType:'',
                loading:true,
                form: {
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
            this.logType();
            let arr = this.$getNowFormatDate();
            this.form.dateVlue = arr;
        },
        computed: {
           
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                let data = {
                    PageIndex:this.cur_page-1,
                    PageSize:this.PageSize
                }
                if(this.form.dateVlue) {
                   data.StartTime = this.form.dateVlue[0],
                   data.EndTime = this.form.dateVlue[1]
                }
                if(this.form) {
                    Object.assign(data,this.form)
                }
                
                this.getData(data);
                this.$message.success(`第${val}页`);
            },
            handleSizeChange(val){
                this.PageSize = val;
                let data = {
                    PageIndex:this.cur_page-1,
                    PageSize:this.PageSize
                }
                 if(this.form.dateVlue) {
                    data.StartTime = this.form.dateVlue[0],
                   data.EndTime = this.form.dateVlue[1]
                }   
                 if(this.form) {
                    Object.assign(data,this.form)
                }
                this.getData(data)

            },
            logType() {
                let self = this;
                self.$get(this.baseURL+this.site.LogLevels).then(res=>{
                    if(res.data.code == self.S_CODE) {
                        console.log(res.data.data)
                        this.LogType = res.data.data;
                    }
                })
            },
            transDate(date){
                let d = new Date(date);
                return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
            },
             searchEdit() {
                let self = this;
                let data;
                this.loading = true;
                if(!this.form.dateVlue) {
                   data = {
                    Account : self.form.Account,
                    LogLevel:self.form.gameID
                   }
                }else {
                   data = {
                   Account : self.form.Account,
                   LogLevel:self.form.LogLevel,
                   StartTime: self.form.dateVlue[0],
                   EndTime: self.form.dateVlue[1]
                   }
                }
                self.getData(data);
                
            },
             transDate(date){
                let d = new Date(date);
                return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
            },
            getData(params) {
                let self = this;

                self.$get(this.baseURL + this.site.GetLogs,params).then(res=>{

                    if(res.data.code == self.S_CODE) {
                        this.$message.success(`加载成功`);
                        let data = res.data.data.data;
                        setTimeout(() => {
                            this.loading = false;
                        }, 1000);
                        for(let i=0;i<data.length;i++) {    
                        data[i].createdate = this.transDate(data[i].createdate)
                        }
                        this.data = data;
                        this.totalPages = res.data.data.totalPages-1;
                    }else {
                        this.$message.error(res.data.failedMsg);  
                    }
                    
                })
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
</style>
