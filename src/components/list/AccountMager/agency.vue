<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 账号管理</el-breadcrumb-item>
                <el-breadcrumb-item>代理账号</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box"> 
                <el-select v-model="select_cate" placeholder="请筛选游戏状态" class="handle-select mr10" @change="change">
                    <el-option v-for="(item,index) in availableData" :key="index" :label="item.name" :value="item.available"></el-option>
                </el-select>           
                <el-input style="width:200px;margin-right:5px" v-model="select_word" placeholder="请输入代理账号查询" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>

                 <el-button type="primary" icon="search" @click="addGame">添加代理</el-button>
            </div>
            <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading" 
                :data="tableData" 
                border 
                class="table" 
                ref="multipleTable">
                <el-table-column  align="center" type="index" label="序号"  >
                </el-table-column> 
                <el-table-column  align="center" prop="account" label="账户"  >
                </el-table-column> 
                <el-table-column align="center" prop="prefix" label="账户前缀" >
                </el-table-column>
                <el-table-column align="center" prop="agent_code" label="代理编码">
                </el-table-column>
                  <el-table-column align="center" label="是否可用" >
                      <template scope="scope">
                         <span v-if="scope.row.available =='可用'" style="color: green">{{scope.row.available}}</span>
                         <span v-else-if="scope.row.available == '不可用'" style="color: red">{{scope.row.available}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="rolename" label="当前角色">
                </el-table-column>
                 <el-table-column align="center" prop="currency" label="货币">
                </el-table-column>
                  <!-- <el-table-column align="center" label="谷歌验证码" width="180">
                          <template slot-scope="scope">
                                     <img  :src="scope.row.google_qrurl" class="head_pic"/>
                           </template>
                  </el-table-column> -->
                  <el-table-column align="center" prop="whiteips" label="白名单IP" width="150">
                </el-table-column>
                  <el-table-column align="center" prop="md5key" label="秘钥" width="180">
                </el-table-column>
                <el-table-column label="操作" width="130" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button> 
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

          <!-- 添加弹出框 -->
        <el-dialog title="添加代理" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="add" label-width="100px">
                
                <el-form-item label="代理账户名称:">
                    <el-input style="width:215px;" v-model="add.account"></el-input>
                </el-form-item>
                 <el-form-item label="代理编号:">
                    <el-input style="width:215px;" v-model="add.agentCode"></el-input>
                </el-form-item>
                 <el-form-item label="代理前缀:">
                    <el-input style="width:215px;" v-model="add.prefix"></el-input>
                </el-form-item>
                <el-form-item label="白名单IP:">
                    <el-input style="width:215px;" v-model="add.whiteIps"></el-input>
                </el-form-item>
                <el-form-item label="秘钥:">
                    <el-input style="width:215px;" v-model="add.mD5Key"></el-input>
                </el-form-item>
                 <el-form-item label="分配角色:">
                    <el-select  v-model="add.roleId" placeholder="请选择1个角色" >
                        <el-option v-for="(item,index) in alreadyList" :key="index" :label="item.name" :value="item.id"></el-option>
                   </el-select>
                </el-form-item>
                 <el-form-item label="是否可用:">
                    <!-- <el-input v-model="form.available"></el-input> -->
                     <el-select v-model="add.available" placeholder="可用">
                        <el-option label="可用" :value=true></el-option>

                        <el-option label="不可用" :value=false></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="货币类型:">
                    <el-input style="width:215px;" v-model="addCurrency" ></el-input>
                </el-form-item>
               
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                
                <el-form-item label="代理前缀:">
                    <el-input style="width:215px;" v-model="form.prefix"></el-input>
                </el-form-item>
                 <el-form-item label="白名单IP:">
                    <el-input type="number" style="width:215px;" v-model="form.whiteIps"></el-input>
                </el-form-item>
                <el-form-item label="秘钥:">
                    <el-input style="width:215px;" v-model="form.md5key"></el-input>
                </el-form-item>
                <el-form-item label="分配角色:">
                    <el-select  v-model="form.roleId" placeholder="请选择1个角色" >
                        <el-option v-for="(item,index) in alreadyList" :key="index" :label="item.name" :value="item.id"></el-option>
                   </el-select>
                </el-form-item>
                <el-form-item label="是否可用:">
                    <!-- <el-input v-model="form.available"></el-input> -->
                     <el-select v-model="form.available" placeholder="可用">
                        <el-option label="可用" value=true></el-option>
                        <el-option label="不可用" value=false></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="货币:">
                    <el-input style="width:215px;" v-model="formCurrency" ></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { setTimeout } from 'timers';
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [], 
                cur_page:1,     //当前页码
                PageSize:20,
                multipleSelection: [],
                alreadyList:[],
                rgpGame:'',
                loading:true,
                redactGame:'',
                select_word: '',
                select_cate:'',
                is_search: false,
                availableData:[
                    {name:'全部',available:''},
                    {name:'可用',available:true},
                    {name:'不可用',available:false}
                ],
                editVisible: false,
                selectUse:'',
                select:'',
                delVisible: false,
                addVisible:false,
                addCurrency:'',
                formCurrency:'',
                total:0,
                form: {
                   
                },
                add:{
                   
                },
                idx: -1
            }
        },
        created() {
            this.acquireRole();
            this.getData();
           
        },
        watch:{
            addCurrency() {
             this.addCurrency = this.addCurrency.replace(/[^\a-\z\A-\Z]/g, '');
           },
           formCurrency() {
             this.formCurrency = this.formCurrency.replace(/[^\a-\z\A-\Z]/g, '');
           },
           
        },
        computed: {
          
        },
        methods: {
            change() {
                let data = {
                    available : this.select_cate
                } 
                this.getData(data);
            },
            // 分页导航
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
                this.getData(data)
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
               self.$get(this.baseURL+this.site.GetAgents,data).then(res=>{
                    if(res.data.code == self.S_CODE) {
                          this.$message.success('加载成功');
                          setTimeout(() => {
                              this.loading = false;
                          }, 1000);
                          this.tableData = res.data.data.data;
                          this.total = res.data.data.totalPages;
                          this.tableData.map((val,index)=>{
                             if(val.available) {
                                    val.available = '可用'
                                }else {
                                    val.available = '不可用'
                                } 
                               for(let i=0;i<this.alreadyList.length;i++) {
                                   if(val.rolename == this.alreadyList[i].name) {
                                       val.role = this.alreadyList[i].name
                                   }
                               }
                          })
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
            acquireRole(){
                let self = this;
                 let name = localStorage.getItem('ms_username');
                 let data = {
                     currentAccount:name
                 }
                self.$get(this.baseURL+this.site.Roles,data).then(res=>{
                    if(res.data.code == self.S_CODE) {
                      this.alreadyList = res.data.data;
                    }
                })
            },
            handleEdit(index, row) {
                this.idx = index;
               
                const item = this.tableData[index];
                console.log(item.roles);
                this.form = {
                    id: item.id,
                    prefix: item.prefix,
                    whiteIps: item.whiteIps,
                    md5key:item.md5key,
                    available:item.available,
                    currency:item.currency,
                    roleId:item.role    
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            addGame(){
                this.add = {};
                this.addVisible = true;
            },

            // 保存编辑
            saveEdit() {
                let self = this;     
                this.editVisible = false;
                 if(!this.form.roleId) {
                    this.form.roleId = null;
                }   
                this.alreadyList.map((val,index)=>{
                     if(this.form.roleId == val.name){
                         this.form.roleId = val.id;
                     }
                })
                if(this.form.available == '可用') {
                    this.form.available = true;
                }else {
                     this.form.available = false;
                }
                if(this.formCurrency != "") {
                    this.form.currency = this.formCurrency;
                }
               this.$axios.put(this.baseURL + this.site.UpdateAgent,this.form).then(res=>{
                     if(res.data.code == self.S_CODE){
                         this.getData();
                         this.$message.success(`修改成功`);
                     }else {
                        this.$message.error(res.data.failedMsg);  
                    }
                })
            },
            // 新增
            addEdit(){
                let self = this;   
                this.addVisible = false;
                if(!this.add.available) {
                    this.select = true;
                }
                let roleIds = [];
                
                if(!this.add.roleId) {
                    this.$message.error('请分配角色');
                   return
                }   
                if(this.addCurrency != '') {
                    tihs.add.currency = this.addCurrency
                }
                self.$post(this.baseURL + this.site.AddAgent,this.add).then((res)=>{
                     if(res.data.code == self.S_CODE) {
                         this.getData();
                         this.$message.success(`添加成功`);   
                         this.add = {};  
                         
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
    .head_pic {
        width: 100px;
        height: 100px;
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
