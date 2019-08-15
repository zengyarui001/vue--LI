<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="select_cate" placeholder="请选择状态" class="handle-select mr10" @change="change">
                    <el-option v-for="(item,index) in availableData" :key="index" :label="item.name" :value="item.available"></el-option>
                </el-select> 
                <el-input style="width:200px;margin-right:5px" v-model="select_word" placeholder="请输入角色名称查询" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>

                <el-button type="primary" icon="search" @click="addGame">添加角色</el-button>
            </div>
            
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="" width="55" align="center"></el-table-column> -->
                <!-- <el-table-column type="hidden" align="center" prop="id" label="id" sortable width="150">
                </el-table-column> -->
                 <el-table-column align="center" type="index" label="序号" sortable >
                </el-table-column>
                <el-table-column align="center" prop="rolename" label="角色名称" >
                </el-table-column>
                <el-table-column align="center" prop="createdate" label="时间" width="200">
                </el-table-column>
                <el-table-column align="center" prop="available" label="状态" >
                    <template scope="scope">
                         <span v-if="scope.row.available =='可用'" style="color: green">{{scope.row.available}}</span>
                         <span v-else-if="scope.row.available == '不可用'" style="color: red">{{scope.row.available}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" prop="create_person" label="创建人" >
                </el-table-column>
                 <el-table-column align="center"  label="权限分配" width="200">
                     <template slot-scope="scope">
                        <el-button type="primary"  @click="alloCation(scope.$index, scope.row)">编辑权限</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="primary"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger"  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-count="this.total">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
     
                <el-form-item label="账号:">
                    <el-input :disabled="true" v-model="form.create_person"></el-input>
                </el-form-item>
                <el-form-item label="角色名称:">
                    <el-input v-model="form.rolename"></el-input>
                </el-form-item>
                <el-form-item label="是否可用:">
                    <!-- <el-input v-model="form.available"></el-input> -->
                     <el-select v-model="form.available" placeholder="可用">
                        <el-option label="可用" :value=true></el-option>
                        <el-option label="不可用" :value=false></el-option>
                    </el-select>
                </el-form-item>
   
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

          <!-- 添加弹出框 -->
        <el-dialog title="添加角色" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="add" label-width="100px">
                
                <el-form-item label="角色名称:">
                    <el-input v-model="add.rolename"></el-input>
                </el-form-item>
                <el-form-item label="是否可用:">
                    <!-- <el-input v-model="form.available"></el-input> -->
                     <el-select v-model="add.available" placeholder="可用">
                        <el-option label="可用" :value=true></el-option>

                        <el-option label="不可用" :value=false></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addEdit">确 定</el-button>
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

         <!-- 权限提示框 -->
        <el-dialog title="请选择需要分配的资源" :visible.sync="alloVisible" width="30%" center>
             <el-form class="form" ref="form" :model="potence" label-width="100px">
                <el-form-item label="菜单资源 :">
                        <el-tree
                            :data="alloList"
                            show-checkbox
                            node-key="id"
                            default-expand-all
                            :check-strictly='strictly'
                            :default-checked-keys="alreadyList"
                            @check = "treeData"
                            @check-change="changeEvent"
                            :props="defaultProps"
                            ref="tree">
                        </el-tree>
                 
                
               </el-form-item>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="alloVisible = false">取 消</el-button>
                <el-button type="primary" @click="alloRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'gameTable',
        data() {
            return {
                data:[],
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                alreadyList:[],
                select_cate: '',
                select_word: '',
                availableData:[
                    {name:'全部',available:''},
                    {name:'可用',available:true},
                    {name:'不可用',available:false}
                ],
                strictly:true,
                del_list: [],
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
                checkedKeys:[],
                select:'',
                total:0,
                form: {
                    name: '',
                    date: '',
                    id:''
                },
                add:{

                },
                idx: -1,
                defaultProps: {
                    children: 'children',
                    label: 'resourcename'
                }
 

            }
        },
        created() {
            this.getData();
           
        },
        computed: {
           
        },
        methods: {
            change (){
                 let data = {
                    available : this.select_cate
                } 
                this.getData(data);
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            treeData(l,t){
                this.checkedKeys = t.checkedKeys;
            },
            getData(data) {
                let self = this;
                this.$get(this.baseURL + this.site.GetRoles,data).then(res=>{
                     if(res.data.code == self.S_CODE) {
                          this.tableData = res.data.data.data;
                          this.total = res.data.data.totalPages;
                          this.tableData.map(val=>{
                              
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
            changeEvent(data,sel){
                 if (sel) {
                    traverseTree(data).forEach((item)=>{
                        this.$refs.tree.setChecked(item,true)
                    })
                }else{
                    traverseTree(data).forEach((item)=>{
                        this.$refs.tree.setChecked(item,false)
                    })
                } 
                 function traverseTree(node) {
                    var child = node.children,
                        arr = [];

                    arr.push(node.id);
                    if (child) {
                        child.forEach(function (node) {
                            arr = arr.concat(traverseTree(node));
                        });
                    }
                    return arr;
                }

            },
            addGame(){
                this.add = {};
                this.addVisible = true;
            },
            search() {
                let self = this;
                let data = {
                    RoleName : this.select_word
                }
                if(this.select_word == '') {
                    setTimeout(() => {
                         this.getData();
                    }, 2000);    
                    return
                }
                this.getData(data);
                
            },
            GetResources(data){
                this.$get(this.baseURL+this.site.GetResources,data).then(res=>{
                    if(res.data.code == this.S_CODE) {  
                       this.alloList = res.data.data;
                    }
                })
            },
            alloCation(row,column){
                let self = this;
                this.alloVisible = true;
                this.limitsID =  column.id;
                let data = {
                    RoleId:column.id,
                    IsForAssign:true
                }
                this.alreadyList = [];
                this.GetResources(data);
                self.$get(this.baseURL+this.site.GetRoleResources,data).then(res=>{
                    if(res.data.code == self.S_CODE) {
                       this.alreadyList = res.data.data;
                       console.log(this.alreadyList)
                    }else {
                        this.$message.error(this.data.failedMsg)
                    }
                })
            },
            alloRow(){
                let type = this.potence.type;
                let self = this;
                type.map((v,i)=>{
                    resourceIds.push(v.split('.')[0])
                })
                let data = {
                    roleId : this.limitsID,
                    resourceIds:this.checkedKeys
                }
                self.$post(this.baseURL+this.site.SetRoleResource,data).then(res=>{
                     if(res.data.code == self.S_CODE) {
                         this.alloVisible = false;
                         this.$message.success('分配成功');
                     }
                })
                
            },

            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    rolename: item.rolename,
                    id: item.id,
                    create_person:item.create_person,
                    available:item.available
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
                this.form = row;
                
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 新增
            addEdit(){
                let self = this;
               
                this.addVisible = false;
                if(!this.select) {
                    this.select = 1;
                }
                let data = {
                    roleName:this.add.rolename,
                    available:this.add.available          
                }    
                self.$post(this.baseURL + this.site.AddRole,data).then((res)=>{
                     if(res.data.code == self.S_CODE) {
                         this.getData();
                         this.form.rolename = '';
                         this.$message.success(`添加成功`);                
                     }else {
                         this.$message.error(res.data.failedMsg);
                     }  
                })
            },
            // 保存编辑
            saveEdit() {
                let self = this; 
                this.editVisible = false;
                if(!this.select) {
                    this.select = 1;    
                }
                if(this.form.available == '可用') this.form.available = true;
                else if(this.form.availableData == '不可用') this.form.available = false;
                
                let data = {
                    id:this.form.id,
                    rolename:this.form.rolename,
                    available:this.form.available
                }
                this.$axios.put(this.baseURL + this.site.UpdateRole,data).then(res=>{
                    
                     if(res.data.code == self.S_CODE){
                         this.getData();
                         this.$message.success(`修改成功`);
                     }else {
                         this.$message.error(res.data.failedMsg);
                     }  
                })
                
            },
            // 确定删除
            deleteRow(){
                let self = this;
                let data = {
                    id:this.form.id
                }
                self.$axios.delete(this.baseURL + this.site.DeleteRole +'?id='+this.form.id,).then(res=>{
                    if(res.data.code == this.S_CODE) {
                         this.getData();
                        this.$message.success('删除成功');
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
    .alreaButton {
        width: 50px;
        margin-top: 5px
    }
    .mr10{
        margin-right: 10px;
    }
    .ml10 {
        margin-left: 10px;
    }
    .form {
        border: 1px solid #666;
    }


</style>
