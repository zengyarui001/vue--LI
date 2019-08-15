<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 账号管理</el-breadcrumb-item>
                <el-breadcrumb-item>子账号</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="select_cate" placeholder="请筛选游戏状态" class="handle-select mr10" @change="change">
                    <el-option v-for="(item,index) in availableData" :key="index" :label="item.name" :value="item.available"></el-option>
                </el-select>  
               <el-input style="width:200px;margin-right:5px" v-model="select_word" placeholder="请输入代理账号查询" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>

                 <el-button type="primary" icon="search" @click="addGame">添加子账号</el-button>
            </div>
            <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading" 
                :data="tableData" 
                border 
                class="table" 
                ref="multipleTable" >
             
                 <el-table-column align="center" type="index" label="序号" width="100">
                </el-table-column>
                <el-table-column align="center" prop="account" label="账户" width="100">
                </el-table-column>
                <el-table-column align="center" prop="rolename" label="当前角色" width="100">
                </el-table-column>
                 <el-table-column align="center" prop="nickname" label="昵称" width="100">
                </el-table-column>
                <el-table-column align="center" prop="createdate" label="创建时间" width="200">
                </el-table-column>
                <el-table-column align="center" prop="create_person" label="创建人" width="150">
                </el-table-column>
                <el-table-column  align="center" label="谷歌验证码" width="180">
                    <template slot-scope="scope">
                        <img  :src="scope.row.google_qrurl" class="head_pic"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="depositpassword" label="操作密码" width="100">
                </el-table-column>                
                <el-table-column align="center"  label="是否可用" >
                        <template scope="scope">
                         <span v-if="scope.row.available =='可用'" style="color: green">{{scope.row.available}}</span>
                         <span v-else-if="scope.row.available == '不可用'" style="color: red">{{scope.row.available}}</span>
                        </template>
                </el-table-column>
                 <el-table-column align="center"  label="角色分配" >
                     <template slot-scope="scope">
                        <el-button type="primary"  @click="alloCation(scope.$index, scope.row)">分配</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger"   @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
                    :page-count="total"
                    > 
                </el-pagination>

            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">        
                 <el-form-item label="子账号昵称:">
                    <el-input style="width:215px;" v-model="form.nickName"></el-input>
                 </el-form-item>
                  <el-form-item label="子账号密码:">
                    <el-input style="width:215px;" type="password" v-model="form.password"></el-input>
                </el-form-item>  
                <el-form-item label="操作密码:">
                    <el-input style="width:215px;" type="password" v-model="form.depositpassword"></el-input>
                </el-form-item>                 
                <el-form-item label="是否可用:">
                    <el-select v-model="select" placeholder="可用">
                        <el-option label="可用" value="true"></el-option>
                        <el-option label="不可用" value="false"></el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

         <!-- 添加弹出框 -->
        <el-dialog title="添加子账号" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="add" label-width="100px">
                
                <el-form-item label="子账号:">
                    <el-input style="width:215px;" v-model="add.account"></el-input>
                </el-form-item>
                <el-form-item label="子账号昵称:">
                    <el-input style="width:215px;" v-model="add.nickName"></el-input>
                </el-form-item>
                <el-form-item label="子账号密码:">
                    <el-input style="width:215px;" type="password" v-model="add.password"></el-input>
                </el-form-item>
                <el-form-item label="操作密码:">
                    <el-input style="width:215px;" type="password" v-model="add.depositpassword"></el-input>
                </el-form-item>                
                <el-form-item label="是否可用:">
                    <el-select v-model="addSelect" placeholder="可用">
                        <el-option label="可用" value="true"></el-option>
                        <el-option label="不可用" value="false"></el-option>
                    </el-select>
                </el-form-item>    
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色提示框 -->
        <el-dialog title="请勾选需要分配的角色" :visible.sync="alloVisible" width="30%" center>
             <el-form ref="form" :model="potence" label-width="100px">
                 
                <el-form-item label="角色 :">
                <!-- <el-checkbox-group v-model="potence.type">
                    <el-checkbox   :label="item.id + '.' + item.rolename"  name="type"></el-checkbox> 
                </el-checkbox-group> -->
                <el-radio-group v-model="radio">
                    <el-radio class="radioGroup" v-for="(item,index) in alreadyList" :key="index" :label="item.id">{{item.name}}</el-radio>
                </el-radio-group>
               </el-form-item>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="alloVisible = false">取 消</el-button>
                <el-button type="primary" @click="alloRow">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { log } from 'util';
import { close, closeSync } from 'fs';
import { setTimeout } from 'timers';
    export default {
        name: 'child',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                PageSize:20,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                alreadyList:[],
                loading:true,
                radio:'',
                radioId:'',
                addSelect:'',
                availableData:[
                    {name:'全部',available:''},
                    {name:'可用',available:true},
                    {name:'不可用',available:false}
                ],
                 potence:{
                    type: [],
                    already:[]
                },
                 alloList:[],
                is_search: false,
                editVisible: false,
                delVisible: false,
                addVisible:false,
                alloVisible:false,
                total:0,
                select:'',
                form: {
                   
                },
                add:{

                },
                del:{

                },
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        computed: {
           
        },
        methods: {
            change() {
                let data = {
                    available: this.select_cate
                }
                this.getData(data);
            },
            handleCurrentChange(val) {
                this.cur_page = val;
                let self = this;
                let data = {
                    PageIndex:this.cur_page-1,
                    PageSize:this.PageSize
                }
                if(this.select_cate) {
                   data.available = this.select_cate;
               }
               if(this.select_word) {
                  data.Account = this.select_word;
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
                if(this.select_cate) {
                   data.available = this.select_cate;
               }
               if(this.select_word) {
                  data.Account = this.select_word;
               }
                this.getData(data)

            },
         
            getData(data) {
               let self = this;
               this.$get(this.baseURL+this.site.GetSubAccounts,data).then(res=>{
                    let code = res.data;
                    if(code.code == self.S_CODE) {
                        self.$message.success('加载成功')
                        setTimeout(() => {
                            this.loading = false;
                        }, 1000);
                        this.tableData = code.data.data;
                        this.total = code.data.totalPages;
                        this.tableData.map((val,index)=>{
                            if(val.available) {
                                val.available = '可用'
                            }else {
                                val.available = '不可用'
                            }
                        })
                    }else {
                        this.$message.error(res.data.failedMsg);
                    }
               })

            },
            alloRow(){
                let self = this;
                let roleIds = [];
                roleIds.push(this.radio)
                let data = {
                    accountId:this.radioId,
                    roleIds:roleIds
                }
                self.$axios.put(this.baseURL+this.site.SetAccountRole,data).then(res=>{
                     if(res.data.code == self.S_CODE) {
                         this.alloVisible = false;
                         this.$message.success('分配成功');
                     }else {
                        this.$message.error(res.data.failedMsg);
                    }
                })

              },
            search() {
               
                let val = this.select_word;
                let data = {
                        Account : val
                    }
                if(val == '') {
                  
                    setTimeout(() => {
                         this.getData();
                    }, 2000);    
                    return
                }
                this.getData(data);
                
            },
            addGame(){
                this.add = {};
                this.addVisible = true;
            },
            alloCation(row,column){
                let self = this;
                this.alloVisible = true;
                this.radioId = column.id;
                let data = {
                    AccountId:this.radioId
                }
                this.radio = '';
                let name = localStorage.getItem('ms_username');
                 let datas = {
                     currentAccount:name
                 }
                self.$get(this.baseURL+this.site.Roles,datas).then(res=>{
                    if(res.data.code == self.S_CODE) {
                    this.alreadyList = res.data.data;
                    }
                })
                self.$get(this.baseURL+this.site.GetAccountRoles,data).then(res=>{
                    if(res.data.code == self.S_CODE) {
                        this.radio = res.data.data[0];
                    }
                })
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id:item.id,
                    nickName:item.nickname
                }
                this.editVisible = true;
               
            },
            handleDelete(index, row) {
                this.del = {
                     id:row.id
                }
                this.delVisible = true;
            },
             addEdit(){
                let self = this;
                this.addVisible = false;
                if(!this.addSelect) {
                    this.addSelect = true;
                }
                let data = {
                    available:this.addSelect
                }
                
                Object.assign(data,this.add);
                self.$post(this.baseURL+this.site.AddSubAccount,data).then(res=>{
                      if(res.data.code == self.S_CODE) {
                           this.$message.success(`添加成功`); 
                           this.add= {};  
                           setTimeout(()=>{
                               this.getData();

                           },2000)
                      }else {
                        this.$message.error(res.data.failedMsg);
                    }
                })
            },
            // 保存编辑
            saveEdit() {
                let self = this;
                if(this.select) {
                    this.form.available = this.select;
                }else {
                    this.form.available = true;
                }    
                this.editVisible = false;
                self.$axios.put(this.baseURL + this.site.UpdateSubAccount,this.form).then(res=>{
                    if(res.data.code == self.S_CODE){
                        this.$message.success(`修改成功`);
                        setTimeout(() => {
                            this.getData();
                        }, 2000);
                     }else {
                          this.$message.error(res.data.failedMsg);
                     }
                })
        
            },
            // 确定删除
            deleteRow(){
                let self = this;
                let data = this.del;
                self.$axios.delete(this.baseURL + this.site.DeleteSubAccount +'?id='+data.id,).then(res=>{
                if(res.data.code == this.S_CODE) {
                    this.$message.success('删除成功');
                    setTimeout(()=>{
                        this.getData();
                    },1500)
                    this.delVisible = false;          
                }else {
                      this.$message.error(res.data.failedMsg);
                }
            })
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
        margin-right: 10px;
    }
    .head_pic {
        width: 100px;
        height: 100px;
    }
    .radioGroup {
        width: 70px;
        height: 35px;
        
    }
</style>
