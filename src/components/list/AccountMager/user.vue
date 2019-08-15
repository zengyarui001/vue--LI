<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 账号管理</el-breadcrumb-item>
                <el-breadcrumb-item>会员账号</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                 会员账号: <el-input style="width:220px" v-model="select_word" placeholder="请输入会员账号进行查询" class="handle-input mr10"></el-input>
                <br>  <!-- &nbsp;&nbsp;&nbsp;&nbsp;代理ID: <el-input style="width:220px;margin-top:10px" v-model="" placeholder="请输入代理ID进行查询" class="handle-input mr10"></el-input> -->
                 代理账号: 
                   <el-select clearable  style="width:220px;margin-top:10px;margin-right:10px" v-model="select_ID" filterable placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                 <el-button type="primary" icon="search"  @click="search">搜索</el-button>
            </div>
            <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading" 
                :data="tableData" 
                border 
                class="table" 
                ref="multipleTable">
                <!-- <el-table-column type="" width="55" align="center"></el-table-column> -->
                <el-table-column align="center" type="index" label="序号" sortable width="150">
                </el-table-column>
                <el-table-column align="center" prop="user_name" label="账户" width="120">
                </el-table-column>
                <el-table-column align="center" prop="account" label="代理账号" width="120">
                </el-table-column>
               
                 <!-- <el-table-column align="center" prop="agent_id" label="代理ID" width="120">
                </el-table-column> -->
                <el-table-column align="center" prop="is_lock" label="是否锁定" width="120">
                       <template scope="scope">
                         <span v-if="scope.row.is_lock =='锁定'" style="color: green">{{scope.row.is_lock}}</span>
                         <span v-else-if="scope.row.is_lock == '未锁定'" style="color: red">{{scope.row.is_lock}}</span>
                        </template>
                </el-table-column>
                 <el-table-column align="center"  label="账号状态" width="120">
                       <template scope="scope">
                         <span v-if="scope.row.status_name =='在线'" style="color: green">{{scope.row.status_name}}</span>
                         <span v-else-if="scope.row.status_name == '离线'" style="color: red">{{scope.row.status_name}}</span>
                        </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.is_lock == '未锁定'" type="text" icon="el-icon-lock" @click="handleEdit(scope.$index, scope.row)">锁定</el-button>
                        <el-button v-else type="text" icon="el-icon-unlock" @click="debLocking(scope.$index, scope.row)">解锁</el-button>
                        <el-button type="text" icon="el-icon-bottom" class="red" @click="handleOffline(scope.$index, scope.row)">踢下线</el-button>
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
                 :page-count="this.total">
                </el-pagination>
            </div>

            <!-- <el-dialog title="添加备注" :visible.sync="editVisible" width="30%">
            <el-form ref="form"  label-width="50px">
                <el-form-item label="备注">
                    <el-input v-model="remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
            </el-dialog> -->


        </div>

    </div>
</template>

<script>
import { setTimeout } from 'timers';
    export default {
        name: 'user',
        data: function(){
            return {
                userData:'',
                select_word: '',
                select_ID:'',
                loading:true,
                tableData:[],
                PageSize:20,
                cur_page:1,     //当前页码
                total:0,
                editVisible:false,
                remark:'',
                options: [],
            }
        },
        computed:{

        },
        methods: {
            getData(data){
                let self = this;
                self.$get(self.baseURL + self.site.GetUsers,data).then(res=>{
                    if(res.data.code == self.S_CODE) {
                        self.$message.success('加载成功');
                        setTimeout(() => {
                            this.loading = false;
                        }, 1000);
                        this.tableData = res.data.data.data;
                        this.total = res.data.data.totalPages-1;  
                        for (let index = 0; index < this.tableData.length; index++) {
                            const ele = this.tableData[index];
                            if(ele.is_lock == false) {
                                ele.is_lock = '未锁定'
                            } else if(ele.is_lock == true) {
                                ele.is_lock = '锁定'
                            }                    
                        }
                    }else {
                        this.$message.error(res.data.failedMsg);  
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
            handleSizeChange(val){
                this.PageSize = val;
                let self = this;
                
                let data = {
                    PageIndex:this.cur_page-1,
                    PageSize:this.PageSize
                }
                if(this.select_ID) {
                    data.AgentId = this.select_ID; 
                }
                if(this.select_word) {
                    data.Account = this.select_word
                }
               self.getData(data);
            //    this.$message.success(`第${this.cur_page}页`);

            },
            handleCurrentChange(val){
                this.cur_page = val;
                let self = this;
                 let data = {
                    PageIndex:this.cur_page-1,
                    PageSize:this.PageSize
                }
                if(this.select_ID) {
                    data.AgentId = this.select_ID; 
                }
                if(this.select_word) {
                    data.Account = this.select_word
                }
               self.getData(data);
                // this.$message.success(`第${val}页`);
            
            },
            search(){
                let self = this;
                let data = {};
                this.loading = true;
                if(this.select_ID) {
                    data.AgentId = this.select_ID; 
                }
                if(this.select_word) {
                    data.Account = this.select_word
                }
                
                if(this.select_word == ''&& this.select_ID == '') {
                 //   this.$message.error(`请输入条件进行搜索`);
                    setTimeout(() => {
                         this.getData();
                    }, 2000);    
                    return
                }
                this.getData(data);
        
            },
            saveEdit(){

            },
            debLocking(index,row){      //解锁
                let self = this;    
                let data = {
                    id: row.id,
                    lock: false,
                    remark: "解锁操作"
                }
                self.$post(this.baseURL+this.site.ChangeUserLock,data).then(res=>{
                     if(res.data.code == self.S_CODE) {
                         this.$message.success('操作成功');     
                      setTimeout(() => {
                           this.getData();
                        }, 2500);      
                     }else {
                        this.$message.error(res.data.failedMsg);  
                    }
                })
            },
            handleEdit(index,row){      //锁定
                let self = this;    
                let data = {
                    id: row.id,
                    lock: true,
                    remark: "锁定操作"
                }
                self.$post(this.baseURL+this.site.ChangeUserLock,data).then(res=>{
                     if(res.data.code == self.S_CODE) {
                         this.$message.success('操作成功');
                        setTimeout(() => {
                           this.getData();
                        }, 2500);                        
                     }else {
                        this.$message.error(res.data.failedMsg);  
                    }
                })

            },
            handleOffline(index,row){   //踢下线
                let self = this;    
                let data = {
                    id: row.id,
                    status: 0
                }
                self.$post(self.baseURL+this.site.ChangeUser,data).then(res=>{
                     if(res.data.code == self.S_CODE) {
                         this.$message.success('操作成功');
                        setTimeout(() => {
                           this.getData();
                        }, 2500);
                     }else {
                        this.$message.error(res.data.failedMsg);  
                    }
                })
            }   
        },
        created(){
           this.getData();
           this.getAgency();  
        }
    }
</script>
<style scoped>
    .handle-box {
        margin-bottom: 20px;
        font-size:14px;
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
</style>