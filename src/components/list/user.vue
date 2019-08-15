<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 风控管理</el-breadcrumb-item>
                <el-breadcrumb-item>会员账号</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                  <el-input v-model="select_word" placeholder="请输入ID来进行查询" class="handle-input mr10"></el-input>
                 <el-button type="primary" icon="search"  @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable">
                <!-- <el-table-column type="" width="55" align="center"></el-table-column> -->
                <el-table-column align="center" prop="id" label="id" sortable width="150">
                </el-table-column>
                <el-table-column align="center" prop="account" label="账户" width="120">
                </el-table-column>
                <el-table-column align="center" prop="is_lock" label="是否锁定" width="120">
                </el-table-column>
                 <el-table-column align="center" prop="status_name" label="账号状态" width="120">
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
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-count="this.total">
                </el-pagination>
            </div>

        </div>

    </div>
</template>

<script>
import { setTimeout } from 'timers';
    export default {
        name: 'baseform',
        data: function(){
            return {
                userData:'',
                select_word: '',
                tableData:[],
                total:0,
                editVisible:false,
                remark:''
            }
        },
        computed:{

        },
        methods: {
            getData(data){
                let self = this;
                self.$get(self.baseURL + self.site.GetUsers,data).then(res=>{
                    if(res.data.code == self.S_CODE) {
                        this.tableData = res.data.data.data;
                        this.total = res.data.data.totalPages;
                        for (let index = 0; index < this.tableData.length; index++) {
                            const ele = this.tableData[index];
                            if(ele.is_lock == false) {
                                ele.is_lock = '未锁定'
                            } else if(ele.is_lock == true) {
                                ele.is_lock = '锁定'
                            }                    
                        }
                    }
                   
                })
            },
            handleCurrentChange(val){
                let self = this;
                let data = {
                    pageIndex:val
                }
                this.getData(data)
                this.$message.success(`第${val}页`);
            
            },
            search(){
                let self = this;
                let data = {
                    id : this.select_word
                }
                if(this.select_word == '') {
                    this.getData();
                    return
                }
                self.$get(this.baseURL+this.site.GetUser,data).then(res=>{
                    if(res.data.code == self.S_CODE) {
                        let arr = [];
                        arr.push(res.data.data);
                        this.tableData = arr;
                        if(this.tableData[0].is_lock == false) {
                            this.tableData[0].is_lock = '未锁定'
                        } else if(this.tableData[0].is_lock == true) {
                            this.tableData[0].is_lock = '锁定'
                        } 
                        this.$message.success(`查询成功`);
                    }else {
                        this.$message.error(res.data.failedMsg);  
                    }
                    
                })
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
                     }
                })
            }   
        },
        created(){
           this.getData();  
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
</style>