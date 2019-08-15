<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 上下分操作</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button style="margin-right:30px;" type="primary" icon="search" @click="search">后台上下分</el-button>

               
                     <el-select style="margin-right:10px;" v-model="selectAgency" filterable placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
                    <el-button type="primary" icon="search" @click="agency">搜索代理</el-button>
               
            </div>
            
            <el-table :data="tableData" border class="table" ref="multipleTable" >    
                 <el-table-column align="center" type="index" label="序号" sortable width="70">
                </el-table-column>   
                <el-table-column align="center" prop="order_id" label="订单号" sortable width="200">
                </el-table-column>
                <el-table-column align="center" prop="agent_name" label="代理号" width="120">
                </el-table-column>
                <el-table-column align="center" prop="create_person" label="创建账户" >
                </el-table-column>
                <el-table-column align="center" prop="createdate" label="创建时间" >
                </el-table-column>
                  <el-table-column align="center" prop="money" label="金额(元)" >
                </el-table-column>
                 <el-table-column align="center" prop="typename" label="类型" >
                </el-table-column>
                <el-table-column align="center" prop="comments" label="备注" >
                </el-table-column>
                <el-table-column align="center" prop="statusname" label="状态" >
                     <template scope="scope">
                        <span v-if="scope.row.status===1" style="color: green">审核通过</span>
                        <span v-else-if="scope.row.status===0">待审核</span>
                        <span v-else style="color: red">未通过</span>
	                </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope" v-if="scope.row.status===0">
                        <el-button type="primary"  @click="handleEdit(scope.$index, scope.row)">通过</el-button>
                        <el-button type="danger"  @click="handleDelete(scope.$index, scope.row)">拒绝</el-button>
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
                 :page-count="this.totalPages">
                </el-pagination>
                
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="代理号:">
                      <el-select style="margin-right:10px;" v-model="form.agentCode" filterable placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="金额:">
                    <el-input style="width:220px" v-model="form.money"></el-input>
                </el-form-item>
                <el-form-item label="上下分类型:">
                     <el-select v-model="form.type">
                         <el-option label="上分" value=1></el-option>
                         <el-option label="下分" value=2></el-option>
                     </el-select>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input style="width:220px" v-model="form.comments"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        
        <!-- 通过提示框 -->
        <el-dialog title="提示" :visible.sync="passVisible" width="300px" center>
            <div class="del-dialog-cnt"></div>
            <el-form ref="form" label-width="100px" style="margin-top:20px">
                <el-form-item label="操作密码:">

                </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="passVisible = false">取 消</el-button>
                <el-button type="primary" @click="passApple">确 定</el-button>
            </span>
        </el-dialog>

         <!-- 拒绝通过提示框 -->
        <el-dialog title="提示" :visible.sync="rejectVisible" width="300px" center>
            <div class="del-dialog-cnt"></div>
            <el-form ref="form" label-width="100px" style="margin-top:20px">
                <el-form-item label="操作密码:">
                    <el-input style="width:100px" type="password" v-model="depositpassword"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rejectVisible = false">取 消</el-button>
                <el-button type="primary" @click="rejectApple">确 定</el-button>
            </span>
        </el-dialog>



    </div>
</template>

<script>
import { timingSafeEqual } from 'crypto';
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                select_word: '',
                totalPages:0,   
                editVisible: false,
                rejectVisible:false,
                passVisible: false,
                passId:'',
                depositpassword:'',
                rejectId:'',
                PageSize:20,
                selectAgency:'',
                form: {
                  
                },
                idx: -1,
                 options: [{
                    
              }],
            }
        },
        created() {
            this.getData();
            this.getAgency();
        },
        computed: {
            
        },
        methods: {
            agency(){
                
                let data = {
                   AgentCode:this.selectAgency 
                }
              this.getData(data);  
            },
            handleCurrentChange(val) {
                 this.cur_page = val;
                 let data = {
                     PageIndex:this.cur_page-1,
                     PageSize:this.PageSize
                 }
                 if(this.selectAgency) {
                     data.AgentCode = this.selectAgency
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
                if(this.selectAgency) {
                     data.AgentCode = this.selectAgency
                 }
                this.getData(data)

            },
            getData(data) {
                let self = this;
                self.$get(self.interiorURL+self.inside.GetDepositBills,data).then(res=>{
                    if(res.data.code == self.S_CODE) {
                        self.$message.success('查询成功');
                        this.totalPages = res.data.data.totalPages
                        this.tableData = res.data.data.data;
                    }else {
                        self.$message.error(res.data.failedMsg)
                    }
                })
            },
            search() {
               this.editVisible = true; 
            },
            passApple(){
                let data = {
                    id:this.passId,
                    status: 1,
                    depositpassword:this.depositpassword
                }
                 this.AppleOper(data);
            },
            rejectApple(){
                let data = {
                    id:this.rejectId,
                    status: 2,
                    depositpassword:this.depositpassword
                }
                this.AppleOper(data);
            },
            AppleOper(data){
                let self = this;
                self.$axios.put(self.interiorURL+self.inside.AuditDeposit,data).then(res=>{
                    if(res.data.code == self.S_CODE) {
                        self.$message.success('操作成功');
                         this.passVisible = false; 
                         this.rejectVisible = false;
                        setTimeout(() => {
                           this.getData(); 
                           this.depositpassword = ''
                        }, 1500);
                    }else {
                        self.$message.error(res.data.failedMsg);
                        this.depositpassword = '';
                    }
                })
            },
            handleEdit(index, row) {   
                this.passId = row.id;
                this.passVisible = true;   
            },
            handleDelete(index, row) {
                this.rejectId = row.id;
                this.rejectVisible = true;
            },
            getAgency () {
                let self = this;
                let name = localStorage.getItem('ms_username');
                let data = {
                    currentAccount : name
                }
                self.$get(self.baseURL+self.site.Agents,data).then(res=>{
                    if(res.data.code == self.S_CODE) {
                       
                        this.options = res.data.data;
                    }
                })
            },
        
            saveEdit() {
               
               this.editVisible = false;
               let self = this;
               if(!this.form.type) {
                   self.$message.error('请选择上下分类型');
                   return
               }
               if(!this.form.agentCode) {
                  self.$message.error('请输入代理账号');
                   return 
               }
               let data = this.form;
              
               self.$post(self.interiorURL+self.inside.AddDeposit,data).then(res=>{
                    if(res.data.code == self.S_CODE) {
                        self.$message.success('提交成功');
                        setTimeout(() => {
                            this.getData();  
                        }, 1500);
                    }else {
                        self.$message.error(res.data.failedMsg)
                    }
               })
            },
          
            deleteRow(){
               
            }
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
        margin-left: 100px;
        margin-right: 20px;
    }
 
</style>
